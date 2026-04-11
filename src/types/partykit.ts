import { GamePhase, PauseReason, RoundPhase } from '../constants/gameConstants';
import { Answer, PlayerRoundAnswers } from './answer';
import { GameResults, PlayerScore, QuestionResult } from './results';
import { GameState } from './game';
import { JoinRequest, Player } from './player';
import { Questionnaire, QuestionnaireForPlayer } from './questionnaire';
import { Round } from './game';

// ─── Server → Client ────────────────────────────────────────────────────────

export type ServerMessage =
  | { type: 'game_state';         payload: GameState }
  | { type: 'join_request';       payload: JoinRequest }
  | { type: 'player_admitted';    payload: { playerId: string; name: string } }
  | { type: 'player_denied';      payload: { playerId: string } }
  | { type: 'you_were_denied' }
  | { type: 'player_joined';      payload: { player: Player } }
  | { type: 'player_kicked';      payload: { playerId: string } }
  | { type: 'you_were_kicked' }
  | { type: 'game_started';       payload: { questionnaire: QuestionnaireForPlayer; rounds: Round[] } }
  | { type: 'round_started';      payload: { roundNumber: number } }
  | { type: 'player_answered';    payload: { playerId: string } }
  | { type: 'all_players_answered' }
  | { type: 'answers_revealed';   payload: { roundNumber: number; questionResults: QuestionResult[]; playerScores: PlayerScore[] } }
  | { type: 'round_ended' }
  | { type: 'game_ended';         payload: GameResults }
  | { type: 'game_paused';        payload: { reason: PauseReason } }
  | { type: 'game_resumed' };

// ─── Client → Server ────────────────────────────────────────────────────────

export type ClientMessage =
  | { type: 'request_join';    payload: { name: string } }
  | { type: 'admit_player';    payload: { playerId: string } }
  | { type: 'deny_player';     payload: { playerId: string } }
  | { type: 'start_game';      payload: { questionnaire: Questionnaire; rounds: Round[] } }
  | { type: 'submit_answers';  payload: PlayerRoundAnswers }
  | { type: 'reveal_answers' }
  | { type: 'advance_round' }
  | { type: 'kick_player';     payload: { playerId: string } }
  | { type: 'end_game' };
