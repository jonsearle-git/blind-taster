import * as Party from 'partyserver';
import { routePartykitRequest } from 'partyserver';
import { GamePhase, PauseReason, PlayerStatus, QuestionType, RoundPhase } from '../constants/gameConstants';
import type { PlayerRoundAnswers } from '../types/answer';
import type { PlayerScore } from '../types/results';
import type { Round } from '../types/game';
import type { Questionnaire } from '../types/questionnaire';
import type { ClientMessage, ServerMessage } from '../types/partykit';
import { gradePlayerAnswers } from './scoring';
import {
  buildGameResults,
  buildGameState,
  toPlayer,
  type InternalPlayer,
  type RoundData,
  type ServerState,
} from './helpers';

type ConnState = { role: 'host' | 'player' | 'pending'; playerId?: string };

interface Env {
  main:              DurableObjectNamespace;
  ROOM_SIGNING_KEY:  string;
  CONNECT_LIMITER:   RateLimit;
}

// ─── HMAC helpers ────────────────────────────────────────────────────────────

async function verifyRoomSig(roomCode: string, sigHex: string, keyHex: string): Promise<boolean> {
  try {
    if (!sigHex) return false;
    // Must match the keyed hash computed by expo-crypto on the client:
    // SHA256(key + ":" + roomCode + ":" + key)
    const input      = `${keyHex}:${roomCode}:${keyHex}`;
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    const expected   = Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('');
    return expected === sigHex;
  } catch {
    return false;
  }
}

export class BlindTasterServer extends Party.Server<Env> {
  private hostToken: string | null = null; // C1: set on first host connect, verified on reconnect

  private s: ServerState = {
    phase:        GamePhase.Lobby,
    roundPhase:   RoundPhase.Answering,
    currentRound: 1,
    rounds:       [],
    questionnaire: null,
    players:      new Map(),
    pending:      new Map(),
    roundAnswers: new Map(),
    roundHistory: new Map(),
  };

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext): void {
    // S1: cap room size — reject connections once limit is reached
    if (this.s.players.size + this.s.pending.size >= 50) {
      conn.close(1008, 'room full'); return;
    }

    const params = new URL(ctx.request.url).searchParams;
    const isHost = params.get('isHost') === '1';

    if (isHost) {
      // S2: async HMAC verification runs in background; connection state is set only after success
      void this.verifyAndAdmitHost(conn, params);
    } else {
      conn.setState({ role: 'pending' } satisfies ConnState);
    }
  }

  private async verifyAndAdmitHost(conn: Party.Connection, params: URLSearchParams): Promise<void> {
    // S2: reject if room signature is invalid — only the app can create rooms
    const sig   = params.get('sig')   ?? '';
    const token = params.get('token') ?? '';
    if (!(await verifyRoomSig(this.name, sig, this.env.ROOM_SIGNING_KEY))) {
      conn.close(1008, 'invalid room signature'); return;
    }
    // C1: verify or register host token
    if (this.hostToken === null) {
      if (token.length < 32) { conn.close(1008, 'invalid token'); return; }
      this.hostToken = token;
    } else if (token !== this.hostToken) {
      conn.close(1008, 'invalid token'); return;
    }
    conn.setState({ role: 'host' } satisfies ConnState);
    this.send(conn, { type: 'game_state', payload: buildGameState(this.s, this.name) });
    if (this.s.phase === GamePhase.GameOver) {
      this.send(conn, { type: 'game_ended', payload: buildGameResults(this.s) });
    } else if (this.s.phase !== GamePhase.Lobby) {
      void this.ctx.storage.deleteAlarm();
      this.broadcastToPlayers({ type: 'game_resumed' });
    }
  }

  onMessage(sender: Party.Connection, message: Party.WSMessage): void {
    // H2: safe parse — discard malformed messages
    let msg: ClientMessage;
    try {
      const raw = typeof message === 'string' ? message : new TextDecoder().decode(message as ArrayBuffer);
      msg = JSON.parse(raw) as ClientMessage;
      if (typeof msg?.type !== 'string') return;
    } catch { return; }

    // C2: enforce role-based authorization
    const cs = sender.state as ConnState | null;
    const HOST_ONLY    = new Set(['admit_player','deny_player','start_game','reveal_answers','resync_players','advance_round','kick_player','end_game']);
    const PLAYER_ONLY  = new Set(['submit_answers', 'sync_state']);
    const PENDING_ONLY = new Set(['request_join', 'restore_player']);
    if (HOST_ONLY.has(msg.type)    && cs?.role !== 'host')    return;
    if (PLAYER_ONLY.has(msg.type)  && cs?.role !== 'player')  return;
    if (PENDING_ONLY.has(msg.type) && cs?.role !== 'pending') return;

    switch (msg.type) {
      case 'request_join':    return this.handleRequestJoin(sender, msg.payload.name);
      case 'restore_player':  return this.handleRestorePlayer(sender, msg.payload.playerId);
      case 'admit_player':   return this.handleAdmit(msg.payload.playerId);
      case 'deny_player':    return this.handleDeny(msg.payload.playerId);
      case 'start_game':     return this.handleStartGame(msg.payload.questionnaire, msg.payload.rounds);
      case 'submit_answers': return this.handleSubmitAnswers(sender, msg.payload);
      case 'sync_state':     return this.send(sender, { type: 'game_state', payload: buildGameState(this.s, this.name) });
      case 'reveal_answers':  return this.handleRevealAnswers();
      case 'resync_players':  return this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
      case 'advance_round':  return this.handleAdvanceRound();
      case 'kick_player':    return this.handleKick(msg.payload.playerId);
      case 'end_game':       return this.handleEndGame();
    }
  }

  onClose(conn: Party.Connection, _code: number, _reason: string, _wasClean: boolean): void {
    const cs = conn.state as ConnState | null;
    if (cs?.role === 'host' && this.s.phase !== GamePhase.Lobby) {
      this.broadcastToPlayers({ type: 'game_paused', payload: { reason: PauseReason.HostDisconnected } });
      // End game automatically if host doesn't reconnect within 5 minutes
      void this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1000);
    } else if (cs?.role === 'player' && cs.playerId) {
      const player = this.s.players.get(cs.playerId);
      // Only clear connectionId if this closing connection is still the active one.
      // onConnect for a reconnect can fire before onClose for the old connection, so we
      // must not stomp a newer connectionId.
      if (player && player.connectionId === conn.id) {
        player.connectionId = null;
        player.status = PlayerStatus.Disconnected;
      }
      this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
    } else if (cs?.role === 'pending') {
      this.s.pending.delete(conn.id);
    }
  }

  async onAlarm(): Promise<void> {
    // Fires 5 min after host disconnect — end the game if host still gone
    if (this.s.phase !== GamePhase.Lobby && this.s.phase !== GamePhase.GameOver && !this.findHost()) {
      this.handleEndGame();
    }
  }

  // ─── Message handlers ────────────────────────────────────────────────────────

  private handleRestorePlayer(conn: Party.Connection, playerId: string): void {
    const player = this.s.players.get(playerId);
    if (!player) return;
    player.connectionId = conn.id;
    player.status = PlayerStatus.Connected;
    conn.setState({ role: 'player', playerId } satisfies ConnState);
    this.send(conn, { type: 'game_state', payload: buildGameState(this.s, this.name) });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleRequestJoin(conn: Party.Connection, name: string): void {
    // M1: validate name server-side
    const sanitised = typeof name === 'string' ? name.trim() : '';
    if (sanitised.length === 0 || sanitised.length > 24) return;
    // M2: reject duplicate names (case-insensitive)
    const lower = sanitised.toLowerCase();
    const taken = [...this.s.players.values()].some((p) => p.name.toLowerCase() === lower)
               || [...this.s.pending.values()].some((n) => n.toLowerCase() === lower);
    if (taken) { this.send(conn, { type: 'name_taken' }); return; }
    this.s.pending.set(conn.id, sanitised);
    const host = this.findHost();
    if (host) this.send(host, { type: 'join_request', payload: { playerId: conn.id, name: sanitised } });
  }

  private handleAdmit(pendingConnId: string): void {
    const name = this.s.pending.get(pendingConnId);
    if (!name) return;
    this.s.pending.delete(pendingConnId);
    const conn = this.getConnection(pendingConnId);
    if (!conn) return;
    const player: InternalPlayer = {
      id: pendingConnId, name, status: PlayerStatus.Connected, score: 0, connectionId: pendingConnId,
    };
    this.s.players.set(pendingConnId, player);
    conn.setState({ role: 'player', playerId: pendingConnId } satisfies ConnState);
    this.send(conn, { type: 'player_admitted', payload: { playerId: pendingConnId, name } });
    this.broadcastToAdmitted({ type: 'player_joined', payload: { player: toPlayer(player) } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleDeny(pendingConnId: string): void {
    this.s.pending.delete(pendingConnId);
    const conn = this.getConnection(pendingConnId);
    if (conn) this.send(conn, { type: 'you_were_denied' });
  }

  private handleStartGame(questionnaire: Questionnaire, rounds: Round[]): void {
    // H3: payload size limits
    if (!questionnaire || !Array.isArray(rounds)) return;
    if (questionnaire.questions.length > 20) return;
    if (rounds.length > 20 || rounds.length === 0) return;
    if (typeof questionnaire.name !== 'string' || questionnaire.name.length > 100) return;
    for (const q of questionnaire.questions) {
      if (typeof q.prompt !== 'string' || q.prompt.length > 500) return;
      if ((q.type === QuestionType.MultipleChoiceText || q.type === QuestionType.MultipleChoiceNumber) &&
          Array.isArray(q.options) && q.options.length > 10) return;
    }
    this.s.questionnaire  = questionnaire;
    this.s.rounds         = rounds;
    this.s.currentRound   = 1;
    this.s.phase          = GamePhase.InRound;
    this.s.roundPhase     = RoundPhase.Answering;
    this.s.roundAnswers   = new Map();
    // H1: labels stripped, correctAnswers never sent to players
    const roundsForPlayer = rounds.map((r) => ({ number: r.number, label: null }));
    this.broadcastToPlayers({ type: 'game_started', payload: { questionnaire, rounds: roundsForPlayer } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleSubmitAnswers(sender: Party.Connection, data: PlayerRoundAnswers): void {
    // C3: derive playerId from verified connection state, not message payload
    const cs = sender.state as ConnState | null;
    const playerId = cs?.playerId;
    if (!playerId || !this.s.players.has(playerId)) return;
    if (this.s.roundAnswers.has(playerId)) return; // prevent re-submission
    this.s.roundAnswers.set(playerId, data.answers);
    const host = this.findHost();
    if (host) this.send(host, { type: 'player_answered', payload: { playerId } });
    // Broadcast updated game_state so answeredPlayerIds is current for all
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
    this.checkAllAnswered();
  }

  private handleRevealAnswers(): void {
    if (this.s.roundPhase === RoundPhase.AnswersRevealed) return; // C4: idempotency guard
    const { questionnaire, currentRound, roundAnswers, players, rounds } = this.s;
    if (!questionnaire) return;

    const currentRoundData = rounds.find((r) => r.number === currentRound);
    if (!currentRoundData) return;

    const playerScores: PlayerScore[] = [];
    const roundMap = new Map<string, RoundData>();

    for (const player of players.values()) {
      const answers    = roundAnswers.get(player.id) ?? [];
      const results    = gradePlayerAnswers(questionnaire.questions, answers, currentRoundData.correctAnswers);
      const roundScore = results.reduce((sum, r) => sum + r.pointsAwarded, 0);
      player.score    += roundScore;
      roundMap.set(player.id, { questionResults: results, roundScore });
      playerScores.push({ playerId: player.id, roundScore, totalScore: player.score });
    }
    this.s.roundHistory.set(currentRound, roundMap);
    this.s.phase      = GamePhase.AnswersRevealed;
    this.s.roundPhase = RoundPhase.AnswersRevealed;

    // Personalized results per player
    for (const player of players.values()) {
      const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
      if (!conn) continue;
      const qr = roundMap.get(player.id)?.questionResults ?? [];
      this.send(conn, { type: 'answers_revealed', payload: { roundNumber: currentRound, roundLabel: currentRoundData.label, questionResults: qr, playerScores } });
    }
    const host = this.findHost();
    if (host) this.send(host, { type: 'answers_revealed', payload: { roundNumber: currentRound, roundLabel: currentRoundData.label, questionResults: [], playerScores } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleAdvanceRound(): void {
    if (this.s.roundPhase !== RoundPhase.AnswersRevealed) return; // H4: phase guard
    if (this.s.currentRound >= this.s.rounds.length) { this.handleEndGame(); return; }
    this.s.currentRound += 1;
    this.s.phase         = GamePhase.InRound;
    this.s.roundPhase    = RoundPhase.Answering;
    this.s.roundAnswers  = new Map();
    this.broadcastToAdmitted({ type: 'round_started', payload: { roundNumber: this.s.currentRound } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleKick(playerId: string): void {
    const player = this.s.players.get(playerId);
    if (!player) return;
    const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
    if (conn) { this.send(conn, { type: 'you_were_kicked' }); conn.close(1000, 'kicked'); }
    this.s.players.delete(playerId);
    this.broadcastToAdmitted({ type: 'player_kicked', payload: { playerId } });
    this.checkAllAnswered();
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private checkAllAnswered(): void {
    if (this.s.phase !== GamePhase.InRound || this.s.roundPhase !== RoundPhase.Answering) return;
    const connected = [...this.s.players.values()].filter((p) => p.connectionId !== null);
    if (connected.length > 0 && connected.every((p) => this.s.roundAnswers.has(p.id))) {
      this.s.phase      = GamePhase.AllAnswered;
      this.s.roundPhase = RoundPhase.AllAnswered;
      this.broadcastToAdmitted({ type: 'all_players_answered' });
    }
  }

  private handleEndGame(): void {
    if (this.s.phase === GamePhase.GameOver) return; // H4: idempotency guard
    // Host abandoned lobby before game started — kick admitted players rather than showing results
    if (this.s.phase === GamePhase.Lobby) {
      for (const player of this.s.players.values()) {
        const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
        if (conn) { this.send(conn, { type: 'game_abandoned' }); conn.close(1000, 'lobby abandoned'); }
      }
      this.s.phase = GamePhase.GameOver;
      return;
    }
    this.s.phase = GamePhase.GameOver;
    const results = buildGameResults(this.s);
    this.broadcastToAdmitted({ type: 'game_ended', payload: results });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  // ─── Utility ─────────────────────────────────────────────────────────────────

  private send(conn: Party.Connection, msg: ServerMessage): void {
    conn.send(JSON.stringify(msg));
  }

  private broadcastToPlayers(msg: ServerMessage): void {
    for (const player of this.s.players.values()) {
      const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
      if (conn) this.send(conn, msg);
    }
  }

  // Send to host + admitted players only — never to unadmitted pending connections.
  private broadcastToAdmitted(msg: ServerMessage): void {
    const host = this.findHost();
    if (host) this.send(host, msg);
    this.broadcastToPlayers(msg);
  }

  private findHost(): Party.Connection | undefined {
    for (const conn of this.getConnections()) {
      if ((conn.state as ConnState | null)?.role === 'host') return conn;
    }
    return undefined;
  }
}

// Worker entry point — routes /parties/main/:roomCode to BlindTasterServer
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    // Rate limit by IP: 20 WebSocket upgrade requests per minute per Cloudflare location
    const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { success } = await env.CONNECT_LIMITER.limit({ key: ip });
    if (!success) {
      return new Response('Too many requests', { status: 429 });
    }
    return (await routePartykitRequest(req, env)) ?? new Response('Not found', { status: 404 });
  },
};
