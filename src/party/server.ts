import type * as Party from 'partykit/server';
import { GamePhase, PauseReason, PlayerStatus, RoundPhase } from '../constants/gameConstants';
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
    const isHost = new URL(ctx.request.url).searchParams.get('isHost') === '1';
    if (isHost) {
      conn.setState({ role: 'host' } satisfies ConnState);
      if (this.s.phase !== GamePhase.Lobby) {
        this.send(conn, { type: 'game_state', payload: buildGameState(this.s, this.room.id) });
        this.broadcastToPlayers({ type: 'game_resumed' });
      } else {
        this.send(conn, { type: 'game_state', payload: buildGameState(this.s, this.room.id) });
      }
    } else {
      conn.setState({ role: 'pending' } satisfies ConnState);
    }
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection): void {
    const msg = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message as ArrayBuffer)) as ClientMessage;
    switch (msg.type) {
      case 'request_join':   return this.handleRequestJoin(sender, msg.payload.name);
      case 'admit_player':   return this.handleAdmit(msg.payload.playerId);
      case 'deny_player':    return this.handleDeny(msg.payload.playerId);
      case 'start_game':     return this.handleStartGame(msg.payload.questionnaire, msg.payload.rounds);
      case 'submit_answers': return this.handleSubmitAnswers(msg.payload);
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
    } else if (cs?.role === 'player' && cs.playerId) {
      const player = this.s.players.get(cs.playerId);
      if (player) { player.connectionId = null; player.status = PlayerStatus.Disconnected; }
      this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
    } else if (cs?.role === 'pending') {
      this.s.pending.delete(conn.id);
    }
  }

  // ─── Message handlers ────────────────────────────────────────────────────────

  private handleRequestJoin(conn: Party.Connection, name: string): void {
    this.s.pending.set(conn.id, name);
    const host = this.findHost();
    if (host) this.send(host, { type: 'join_request', payload: { playerId: conn.id, name } });
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
    this.broadcast({ type: 'player_joined', payload: { player: toPlayer(player) } });
    this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleDeny(pendingConnId: string): void {
    this.s.pending.delete(pendingConnId);
    const conn = this.room.getConnection(pendingConnId);
    if (conn) this.send(conn, { type: 'you_were_denied' });
  }

  private handleStartGame(questionnaire: Questionnaire, rounds: Round[]): void {
    this.s.questionnaire  = questionnaire;
    this.s.rounds         = rounds;
    this.s.currentRound   = 1;
    this.s.phase          = GamePhase.InRound;
    this.s.roundPhase     = RoundPhase.Answering;
    this.s.roundAnswers   = new Map();
    const qfp = buildQuestionnaireForPlayer(questionnaire);
    this.broadcastToPlayers({ type: 'game_started', payload: { questionnaire: qfp, rounds } });
    this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleSubmitAnswers(data: PlayerRoundAnswers): void {
    this.s.roundAnswers.set(data.playerId, data.answers);
    const host = this.findHost();
    if (host) this.send(host, { type: 'player_answered', payload: { playerId: data.playerId } });
    const connected = [...this.s.players.values()].filter((p) => p.connectionId !== null);
    if (connected.length > 0 && connected.every((p) => this.s.roundAnswers.has(p.id))) {
      this.s.phase      = GamePhase.AllAnswered;
      this.s.roundPhase = RoundPhase.AllAnswered;
      this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
      this.broadcast({ type: 'all_players_answered' });
    }
  }

  private handleRevealAnswers(): void {
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
    this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleAdvanceRound(): void {
    if (this.s.currentRound >= this.s.rounds.length) { this.handleEndGame(); return; }
    this.s.currentRound += 1;
    this.s.phase         = GamePhase.InRound;
    this.s.roundPhase    = RoundPhase.Answering;
    this.s.roundAnswers  = new Map();
    this.broadcast({ type: 'round_started', payload: { roundNumber: this.s.currentRound } });
    this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleKick(playerId: string): void {
    const player = this.s.players.get(playerId);
    if (!player) return;
    const conn = player.connectionId ? this.room.getConnection(player.connectionId) : null;
    if (conn) { this.send(conn, { type: 'you_were_kicked' }); conn.close(1000, 'kicked'); }
    this.s.players.delete(playerId);
    this.broadcast({ type: 'player_kicked', payload: { playerId } });
    this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  private handleEndGame(): void {
    this.s.phase = GamePhase.GameOver;
    const results = buildGameResults(this.s);
    this.broadcast({ type: 'game_ended', payload: results });
    this.broadcast({ type: 'game_state', payload: buildGameState(this.s, this.room.id) });
  }

  // ─── Utility ─────────────────────────────────────────────────────────────────

  private send(conn: Party.Connection, msg: ServerMessage): void {
    conn.send(JSON.stringify(msg));
  }

  private broadcast(msg: ServerMessage, except: string[] = []): void {
    this.room.broadcast(JSON.stringify(msg), except);
  }

  private broadcastToPlayers(msg: ServerMessage): void {
    for (const player of this.s.players.values()) {
      const conn = player.connectionId ? this.room.getConnection(player.connectionId) : null;
      if (conn) this.send(conn, msg);
    }
  }

  private findHost(): Party.Connection | undefined {
    for (const conn of this.room.connections.values()) {
      if ((conn.state as ConnState | null)?.role === 'host') return conn;
    }
    return undefined;
  }
}
