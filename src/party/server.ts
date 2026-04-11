import type * as Party from 'partykit/server';
import { GamePhase, PauseReason, PlayerStatus, QuestionType, RoundPhase } from '../constants/gameConstants';
import type { Answer, PlayerRoundAnswers } from '../types/answer';
import type { PlayerScore } from '../types/results';
import type { Round } from '../types/game';
import type { Questionnaire } from '../types/questionnaire';
import type { ClientMessage, ServerMessage } from '../types/partykit';
import { gradePlayerAnswers } from './scoring';
import {
  buildGameResults,
  buildGameState,
  buildQuestionnaireForPlayer,
  toPlayer,
  type InternalPlayer,
  type RoundData,
  type ServerState,
} from './helpers';

type ConnState = { role: 'host' | 'player' | 'pending'; playerId?: string };

export default class BlindTasterServer implements Party.Server {
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

  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext): void {
    const params = new URL(ctx.request.url).searchParams;
    const isHost = params.get('isHost') === '1';
    const token  = params.get('token') ?? '';

    if (isHost) {
      // C1: verify or register host token
      if (this.hostToken === null) {
        if (token.length < 32) { conn.close(1008, 'invalid token'); return; }
        this.hostToken = token;
      } else if (token !== this.hostToken) {
        conn.close(1008, 'invalid token'); return;
      }
      conn.setState({ role: 'host' } satisfies ConnState);
      this.send(conn, { type: 'game_state', payload: buildGameState(this.s, this.room.id) });
      if (this.s.phase !== GamePhase.Lobby) {
        // M2: cancel the end-game alarm — host is back
        void this.room.storage.deleteAlarm();
        this.broadcastToPlayers({ type: 'game_resumed' });
      }
    } else {
      conn.setState({ role: 'pending' } satisfies ConnState);
    }
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection): void {
    // H2: safe parse — discard malformed messages
    let msg: ClientMessage;
    try {
      const raw = typeof message === 'string' ? message : new TextDecoder().decode(message as ArrayBuffer);
      msg = JSON.parse(raw) as ClientMessage;
      if (typeof msg?.type !== 'string') return;
    } catch { return; }

    // C2: enforce role-based authorization
    const cs = sender.state as ConnState | null;
    const HOST_ONLY   = new Set(['admit_player','deny_player','start_game','reveal_answers','advance_round','kick_player','end_game']);
    const PLAYER_ONLY = new Set(['submit_answers']);
    if (HOST_ONLY.has(msg.type)   && cs?.role !== 'host')   return;
    if (PLAYER_ONLY.has(msg.type) && cs?.role !== 'player') return;

    switch (msg.type) {
      case 'request_join':   return this.handleRequestJoin(sender, msg.payload.name);
      case 'admit_player':   return this.handleAdmit(msg.payload.playerId);
      case 'deny_player':    return this.handleDeny(msg.payload.playerId);
      case 'start_game':     return this.handleStartGame(msg.payload.questionnaire, msg.payload.rounds);
      case 'submit_answers': return this.handleSubmitAnswers(sender, msg.payload);
      case 'reveal_answers': return this.handleRevealAnswers();
      case 'advance_round':  return this.handleAdvanceRound();
      case 'kick_player':    return this.handleKick(msg.payload.playerId);
      case 'end_game':       return this.handleEndGame();
    }
  }

  onClose(conn: Party.Connection): void {
    const cs = conn.state as ConnState | null;
    if (cs?.role === 'host' && this.s.phase !== GamePhase.Lobby) {
      this.broadcastToPlayers({ type: 'game_paused', payload: { reason: PauseReason.HostDisconnected } });
      // M2: end game automatically if host doesn't reconnect within 5 minutes
      void this.room.storage.setAlarm(Date.now() + 5 * 60 * 1000);
    } else if (cs?.role === 'player' && cs.playerId) {
      const player = this.s.players.get(cs.playerId);
      if (player) { player.connectionId = null; player.status = PlayerStatus.Disconnected; }
      this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
    } else if (cs?.role === 'pending') {
      this.s.pending.delete(conn.id);
    }
  }

  async onAlarm(): Promise<void> {
    // M2: fires 5 min after host disconnect — end the game if host still gone
    if (this.s.phase !== GamePhase.Lobby && this.s.phase !== GamePhase.GameOver && !this.findHost()) {
      this.handleEndGame();
    }
  }

  // ─── Message handlers ────────────────────────────────────────────────────────

  private handleRequestJoin(conn: Party.Connection, name: string): void {
    // M1: validate name server-side
    const sanitised = typeof name === 'string' ? name.trim() : '';
    if (sanitised.length === 0 || sanitised.length > 24) return;
    this.s.pending.set(conn.id, sanitised);
    const host = this.findHost();
    if (host) this.send(host, { type: 'join_request', payload: { playerId: conn.id, name: sanitised } });
  }

  private handleAdmit(pendingConnId: string): void {
    const name = this.s.pending.get(pendingConnId);
    if (!name) return;
    this.s.pending.delete(pendingConnId);
    const conn = this.room.getConnection(pendingConnId);
    if (!conn) return;
    const player: InternalPlayer = {
      id: pendingConnId, name, status: PlayerStatus.Connected, score: 0, connectionId: pendingConnId,
    };
    this.s.players.set(pendingConnId, player);
    conn.setState({ role: 'player', playerId: pendingConnId } satisfies ConnState);
    this.send(conn, { type: 'player_admitted', payload: { playerId: pendingConnId, name } });
    this.broadcastToAdmitted({ type: 'player_joined', payload: { player: toPlayer(player) } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleDeny(pendingConnId: string): void {
    this.s.pending.delete(pendingConnId);
    const conn = this.room.getConnection(pendingConnId);
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
    const qfp = buildQuestionnaireForPlayer(questionnaire);
    // H1: strip labels so players can't read upcoming item names
    const roundsForPlayer = rounds.map(r => ({ number: r.number, label: null }));
    this.broadcastToPlayers({ type: 'game_started', payload: { questionnaire: qfp, rounds: roundsForPlayer } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
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
    const connected = [...this.s.players.values()].filter((p) => p.connectionId !== null);
    if (connected.length > 0 && connected.every((p) => this.s.roundAnswers.has(p.id))) {
      this.s.phase      = GamePhase.AllAnswered;
      this.s.roundPhase = RoundPhase.AllAnswered;
      this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
      this.broadcastToAdmitted({ type: 'all_players_answered' });
    }
  }

  private handleRevealAnswers(): void {
    if (this.s.roundPhase === RoundPhase.AnswersRevealed) return; // C4: idempotency guard
    const { questionnaire, currentRound, roundAnswers, players } = this.s;
    if (!questionnaire) return;
    const playerScores: PlayerScore[] = [];
    const roundMap = new Map<string, RoundData>();
    for (const player of players.values()) {
      const answers    = roundAnswers.get(player.id) ?? [];
      const results    = gradePlayerAnswers(questionnaire.questions, answers);
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
      const conn = player.connectionId ? this.room.getConnection(player.connectionId) : null;
      if (!conn) continue;
      const qr = roundMap.get(player.id)?.questionResults ?? [];
      this.send(conn, { type: 'answers_revealed', payload: { roundNumber: currentRound, questionResults: qr, playerScores } });
    }
    const host = this.findHost();
    if (host) this.send(host, { type: 'answers_revealed', payload: { roundNumber: currentRound, questionResults: [], playerScores } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleAdvanceRound(): void {
    if (this.s.roundPhase !== RoundPhase.AnswersRevealed) return; // H4: phase guard
    if (this.s.currentRound >= this.s.rounds.length) { this.handleEndGame(); return; }
    this.s.currentRound += 1;
    this.s.phase         = GamePhase.InRound;
    this.s.roundPhase    = RoundPhase.Answering;
    this.s.roundAnswers  = new Map();
    this.broadcastToAdmitted({ type: 'round_started', payload: { roundNumber: this.s.currentRound } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleKick(playerId: string): void {
    const player = this.s.players.get(playerId);
    if (!player) return;
    const conn = player.connectionId ? this.room.getConnection(player.connectionId) : null;
    if (conn) { this.send(conn, { type: 'you_were_kicked' }); conn.close(1000, 'kicked'); }
    this.s.players.delete(playerId);
    this.broadcastToAdmitted({ type: 'player_kicked', payload: { playerId } });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleEndGame(): void {
    if (this.s.phase === GamePhase.GameOver) return; // H4: idempotency guard
    this.s.phase = GamePhase.GameOver;
    const results = buildGameResults(this.s);
    this.broadcastToAdmitted({ type: 'game_ended', payload: results });
    this.broadcastToAdmitted({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  // ─── Utility ─────────────────────────────────────────────────────────────────

  private send(conn: Party.Connection, msg: ServerMessage): void {
    conn.send(JSON.stringify(msg));
  }

  private broadcastToPlayers(msg: ServerMessage): void {
    for (const player of this.s.players.values()) {
      const conn = player.connectionId ? this.room.getConnection(player.connectionId) : null;
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
    for (const conn of this.room.connections.values()) {
      if ((conn.state as ConnState | null)?.role === 'host') return conn;
    }
    return undefined;
  }
}
