import * as Party from 'partyserver';
import { routePartykitRequest } from 'partyserver';
import { GamePhase, PlayerStatus, QuestionType, RoundPhase } from '../constants/gameConstants';
import type { PlayerRoundAnswers } from '../types/answer';
import type { PlayerScore } from '../types/results';
import type { Round } from '../types/game';
import type { Questionnaire } from '../types/questionnaire';
import type { ClientMessage, ServerMessage } from '../types/partykit';
import { gradePlayerAnswers } from './scoring';
import {
  buildGameResults,
  buildGameState,
  deserializeState,
  serializeState,
  toPlayer,
  type InternalPlayer,
  type PersistedState,
  type RoundData,
  type ServerState,
} from './helpers';

type ConnState = { role: 'host' | 'player' | 'pending'; playerId?: string };

interface Env {
  main:              DurableObjectNamespace;
  ROOM_SIGNING_KEY:  string;
  CONNECT_LIMITER:   RateLimit;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─── HMAC helpers ────────────────────────────────────────────────────────────

async function verifyRoomSig(roomCode: string, sigHex: string, keyHex: string): Promise<boolean> {
  try {
    if (!sigHex) return false;
    const input      = `${keyHex}:${roomCode}:${keyHex}`;
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
    const expected   = Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('');
    return expected === sigHex;
  } catch {
    return false;
  }
}

export class BlindTasterServer extends Party.Server<Env> {
  static options = { hibernate: true };

  private s: ServerState = {
    phase:           GamePhase.Lobby,
    roundPhase:      RoundPhase.Answering,
    currentRound:    1,
    rounds:          [],
    questionnaire:   null,
    players:         new Map(),
    pending:         new Map(),
    roundAnswers:    new Map(),
    roundHistory:    new Map(),
    hostClientId:    null,
    pausedFromPhase: null,
  };

  // Lifecycle ────────────────────────────────────────────────────────────────

  async onStart(): Promise<void> {
    const stored = await this.ctx.storage.get<PersistedState>('state');
    if (stored) this.s = deserializeState(stored);
  }

  private async persist(): Promise<void> {
    await this.ctx.storage.put('state', serializeState(this.s));
  }

  private async clearStorage(): Promise<void> {
    await this.ctx.storage.deleteAll();
  }

  // Connection lifecycle ─────────────────────────────────────────────────────

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext): void {
    if (this.s.players.size + this.s.pending.size >= 50) {
      conn.close(1008, 'room full'); return;
    }

    const url = new URL(ctx.request.url);
    const isHost = url.searchParams.get('isHost') === '1';
    const clientId = conn.id; // partyserver uses ?_pk= as connection id

    if (isHost) {
      // Host identity: clientId must match persisted hostClientId, or claim if vacant.
      if (this.s.hostClientId === null) {
        this.s.hostClientId = clientId;
        void this.persist();
      } else if (this.s.hostClientId !== clientId) {
        conn.close(1008, 'host already claimed by another device'); return;
      }
      // Replace any existing host connection (reconnect / new device with same clientId)
      for (const existing of this.getConnections<ConnState>()) {
        if (existing.id !== conn.id && (existing.state as ConnState | null)?.role === 'host') {
          existing.close(1000, 'replaced by new host connection');
        }
      }
      conn.setState({ role: 'host' } satisfies ConnState);

      // If we were paused waiting for host, restore the previous phase.
      if (this.s.phase === GamePhase.Paused && this.s.pausedFromPhase !== null) {
        this.s.phase = this.s.pausedFromPhase;
        this.s.pausedFromPhase = null;
        void this.ctx.storage.deleteAlarm();
        void this.persist();
        this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
      } else {
        this.send(conn, { type: 'game_state', payload: buildGameState(this.s, this.name) });
      }

      // Send host the full rounds (with correctAnswers) so they can resume.
      if (this.s.rounds.length > 0) {
        this.send(conn, { type: 'host_state', payload: { rounds: this.s.rounds } });
      }
      if (this.s.phase === GamePhase.GameOver) {
        this.send(conn, { type: 'game_ended', payload: buildGameResults(this.s) });
      }
      return;
    }

    // Player path: if this clientId is already a player in the game, treat as reconnect.
    const existingPlayer = this.s.players.get(clientId);
    if (existingPlayer) {
      existingPlayer.connectionId = clientId;
      existingPlayer.status = PlayerStatus.Connected;
      conn.setState({ role: 'player', playerId: clientId } satisfies ConnState);
      this.send(conn, { type: 'game_state', payload: buildGameState(this.s, this.name) });
      this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) }, [conn.id]);
      void this.persist();
      if (this.s.phase === GamePhase.GameOver) {
        this.send(conn, { type: 'game_ended', payload: buildGameResults(this.s) });
      }
      return;
    }

    // Fresh player — pending until admitted.
    conn.setState({ role: 'pending' } satisfies ConnState);
  }

  onMessage(sender: Party.Connection, message: Party.WSMessage): void {
    let msg: ClientMessage;
    try {
      const raw = typeof message === 'string' ? message : new TextDecoder().decode(message as ArrayBuffer);
      msg = JSON.parse(raw) as ClientMessage;
      if (typeof msg?.type !== 'string') return;
    } catch { return; }

    const cs = sender.state as ConnState | null;
    const HOST_ONLY    = new Set(['admit_player','deny_player','start_game','reveal_answers','resync_players','advance_round','kick_player','end_game']);
    const PLAYER_ONLY  = new Set(['submit_answers', 'sync_state']);
    const PENDING_ONLY = new Set(['request_join']);
    if (HOST_ONLY.has(msg.type)    && cs?.role !== 'host')    return;
    if (PLAYER_ONLY.has(msg.type)  && cs?.role !== 'player')  return;
    if (PENDING_ONLY.has(msg.type) && cs?.role !== 'pending') return;

    switch (msg.type) {
      case 'request_join':    return this.handleRequestJoin(sender, msg.payload.name);
      case 'admit_player':    return this.handleAdmit(msg.payload.playerId);
      case 'deny_player':     return this.handleDeny(msg.payload.playerId);
      case 'start_game':      return this.handleStartGame(msg.payload.questionnaire, msg.payload.rounds);
      case 'submit_answers':  return this.handleSubmitAnswers(sender, msg.payload);
      case 'sync_state':      return this.send(sender, { type: 'game_state', payload: buildGameState(this.s, this.name) });
      case 'reveal_answers':  return this.handleRevealAnswers();
      case 'resync_players':  return this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
      case 'advance_round':   return this.handleAdvanceRound();
      case 'kick_player':     return this.handleKick(msg.payload.playerId);
      case 'end_game':        return this.handleEndGame();
    }
  }

  onClose(conn: Party.Connection, _code: number, _reason: string, _wasClean: boolean): void {
    const cs = conn.state as ConnState | null;
    if (cs?.role === 'host') {
      // Only treat as a real host disconnect if no other host connection exists (reconnect race).
      let stillHasHost = false;
      for (const c of this.getConnections<ConnState>()) {
        if (c.id !== conn.id && (c.state as ConnState | null)?.role === 'host') { stillHasHost = true; break; }
      }
      if (stillHasHost) return;
      if (this.s.phase === GamePhase.Lobby) {
        this.handleEndGame();
      } else if (this.s.phase !== GamePhase.GameOver && this.s.phase !== GamePhase.Paused && this.s.phase !== GamePhase.Abandoned) {
        this.s.pausedFromPhase = this.s.phase;
        this.s.phase = GamePhase.Paused;
        void this.persist();
        this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
        void this.ctx.storage.setAlarm(Date.now() + 5 * 60 * 1000);
      }
    } else if (cs?.role === 'player' && cs.playerId) {
      const player = this.s.players.get(cs.playerId);
      if (player && player.connectionId === conn.id) {
        player.connectionId = null;
        player.status = PlayerStatus.Disconnected;
      }
      void this.persist();
      this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
    } else if (cs?.role === 'pending') {
      this.s.pending.delete(conn.id);
      void this.persist();
    }
  }

  async onAlarm(): Promise<void> {
    if (this.s.phase === GamePhase.Paused && !this.findHost()) {
      this.handleEndGame();
    }
  }

  // ─── Message handlers ──────────────────────────────────────────────────────

  private handleRequestJoin(conn: Party.Connection, name: string): void {
    const sanitised = typeof name === 'string' ? name.trim() : '';
    if (sanitised.length === 0 || sanitised.length > 24) return;
    const lower = sanitised.toLowerCase();
    const taken = [...this.s.players.values()].some((p) => p.name.toLowerCase() === lower)
               || [...this.s.pending.values()].some((n) => n.toLowerCase() === lower);
    if (taken) { this.send(conn, { type: 'name_taken' }); return; }
    this.s.pending.set(conn.id, sanitised);
    void this.persist();
    const host = this.findHost();
    if (host) this.send(host, { type: 'join_request', payload: { playerId: conn.id, name: sanitised } });
  }

  private handleAdmit(pendingClientId: string): void {
    const name = this.s.pending.get(pendingClientId);
    if (!name) return;
    this.s.pending.delete(pendingClientId);
    const conn = this.getConnection(pendingClientId);
    const player: InternalPlayer = {
      id: pendingClientId,
      name,
      status: conn ? PlayerStatus.Connected : PlayerStatus.Disconnected,
      score: 0,
      connectionId: conn ? pendingClientId : null,
    };
    this.s.players.set(pendingClientId, player);
    void this.persist();
    if (conn) {
      conn.setState({ role: 'player', playerId: pendingClientId } satisfies ConnState);
      this.send(conn, { type: 'player_admitted', payload: { playerId: pendingClientId, name } });
    }
    this.broadcastToAdmitted({ type: 'player_joined', payload: { player: toPlayer(player) } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleDeny(pendingClientId: string): void {
    this.s.pending.delete(pendingClientId);
    void this.persist();
    const conn = this.getConnection(pendingClientId);
    if (conn) this.send(conn, { type: 'you_were_denied' });
  }

  private handleStartGame(questionnaire: Questionnaire, rounds: Round[]): void {
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
    void this.persist();
    const roundsForPlayer = rounds.map((r) => ({ number: r.number, label: null }));
    this.broadcastToPlayers({ type: 'game_started', payload: { questionnaire, rounds: roundsForPlayer } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleSubmitAnswers(sender: Party.Connection, data: PlayerRoundAnswers): void {
    const cs = sender.state as ConnState | null;
    const playerId = cs?.playerId;
    if (!playerId || !this.s.players.has(playerId)) return;
    if (this.s.roundAnswers.has(playerId)) return;
    this.s.roundAnswers.set(playerId, data.answers);
    void this.persist();
    const host = this.findHost();
    if (host) this.send(host, { type: 'player_answered', payload: { playerId } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) }, [sender.id]);
    this.checkAllAnswered();
  }

  private handleRevealAnswers(): void {
    if (this.s.roundPhase === RoundPhase.AnswersRevealed) return;
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
    void this.persist();

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
    if (this.s.roundPhase !== RoundPhase.AnswersRevealed) return;
    if (this.s.currentRound >= this.s.rounds.length) { this.handleEndGame(); return; }
    this.s.currentRound += 1;
    this.s.phase         = GamePhase.InRound;
    this.s.roundPhase    = RoundPhase.Answering;
    this.s.roundAnswers  = new Map();
    void this.persist();
    this.broadcastToAdmitted({ type: 'round_started', payload: { roundNumber: this.s.currentRound } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  private handleKick(playerId: string): void {
    const player = this.s.players.get(playerId);
    if (!player) return;
    const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
    if (conn) { this.send(conn, { type: 'you_were_kicked' }); conn.close(1000, 'kicked'); }
    this.s.players.delete(playerId);
    void this.persist();
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
      void this.persist();
      this.broadcastToAdmitted({ type: 'all_players_answered' });
    }
  }

  private handleEndGame(): void {
    if (this.s.phase === GamePhase.GameOver || this.s.phase === GamePhase.Abandoned) return;
    if (this.s.phase === GamePhase.Lobby) {
      this.s.phase = GamePhase.Abandoned;
      void this.persist();
      this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
      for (const player of this.s.players.values()) {
        const conn = player.connectionId ? this.getConnection(player.connectionId) : null;
        if (conn) conn.close(1000, 'lobby abandoned');
      }
      // Wipe storage — abandoned games leave nothing behind.
      void this.clearStorage();
      return;
    }
    this.s.phase = GamePhase.GameOver;
    void this.persist();
    const results = buildGameResults(this.s);
    this.broadcastToAdmitted({ type: 'game_ended', payload: results });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.name) });
  }

  // ─── Utility ───────────────────────────────────────────────────────────────

  private send(conn: Party.Connection, msg: ServerMessage): void {
    conn.send(JSON.stringify(msg));
  }

  private broadcastToPlayers(msg: ServerMessage, exclude: string[] = []): void {
    for (const player of this.s.players.values()) {
      if (player.connectionId === null) continue;
      if (exclude.includes(player.connectionId)) continue;
      const conn = this.getConnection(player.connectionId);
      if (conn) this.send(conn, msg);
    }
  }

  private broadcastToAdmitted(msg: ServerMessage, exclude: string[] = []): void {
    const host = this.findHost();
    if (host && !exclude.includes(host.id)) this.send(host, msg);
    this.broadcastToPlayers(msg, exclude);
  }

  private findHost(): Party.Connection | undefined {
    for (const conn of this.getConnections<ConnState>()) {
      if ((conn.state as ConnState | null)?.role === 'host') return conn;
    }
    return undefined;
  }
}

// Worker entry point ─────────────────────────────────────────────────────────

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { success } = await env.CONNECT_LIMITER.limit({ key: ip });
    if (!success) return new Response('Too many requests', { status: 429 });

    return (await routePartykitRequest(req, env, {
      onBeforeConnect: async (rawReq) => {
        const url = new URL(rawReq.url);
        // Validate _pk format up-front: it becomes the connection.id, so reject anything malformed.
        const pk = url.searchParams.get('_pk');
        if (!pk || !UUID_RE.test(pk)) {
          return new Response('invalid client id', { status: 400 });
        }
        // HMAC sig verification for hosts only — players don't need it.
        if (url.searchParams.get('isHost') === '1') {
          const sig = url.searchParams.get('sig') ?? '';
          // Room code is the path segment after /parties/main/
          const match = url.pathname.match(/\/parties\/[^/]+\/([^/?]+)/);
          const roomCode = match ? decodeURIComponent(match[1]) : '';
          if (!roomCode || !(await verifyRoomSig(roomCode, sig, env.ROOM_SIGNING_KEY))) {
            return new Response('invalid room signature', { status: 403 });
          }
        }
        return rawReq;
      },
    })) ?? new Response('Not found', { status: 404 });
  },
};
