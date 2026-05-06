import { PauseReason } from '../constants/gameConstants';
import { PlayerRoundAnswers } from './answer';
import { GameResults, PlayerScore, QuestionResult } from './results';
import { GameState, Round, RoundForPlayer } from './game';
import { JoinRequest, Player } from './player';
import { Questionnaire } from './questionnaire';

// ─── Server → Client ────────────────────────────────────────────────────────

export type ServerMessage =
  | { type: 'game_state';         payload: GameState }
  | { type: 'join_request';       payload: JoinRequest }
  | { type: 'player_admitted';    payload: { playerId: string; name: string } }
  | { type: 'player_denied';      payload: { playerId: string } }
  | { type: 'you_were_denied' }
  | { type: 'name_taken' }
  | { type: 'player_joined';      payload: { player: Player } }
  | { type: 'player_kicked';      payload: { playerId: string } }
  | { type: 'you_were_kicked' }
  | { type: 'game_started';       payload: { questionnaire: Questionnaire; rounds: RoundForPlayer[] } }
  | { type: 'round_started';      payload: { roundNumber: number } }
  | { type: 'player_answered';    payload: { playerId: string } }
  | { type: 'all_players_answered' }
  | { type: 'answers_revealed';   payload: { roundNumber: number; roundLabel: string | null; questionResults: QuestionResult[]; playerScores: PlayerScore[] } }
  | { type: 'round_ended' }
  | { type: 'game_ended';         payload: GameResults }
  | { type: 'game_paused';        payload: { reason: PauseReason } }
  | { type: 'game_resumed' }
  | { type: 'game_abandoned' };

// ─── Client → Server ────────────────────────────────────────────────────────

export type ClientMessage =
  | { type: 'request_join';    payload: { name: string } }
  | { type: 'restore_player';  payload: { playerId: string } }
  | { type: 'sync_state' }
  | { type: 'admit_player';    payload: { playerId: string } }
  | { type: 'deny_player';     payload: { playerId: string } }
  | { type: 'start_game';      payload: { questionnaire: Questionnaire; rounds: Round[] } }
  | { type: 'submit_answers';  payload: PlayerRoundAnswers }
  | { type: 'reveal_answers' }
  | { type: 'advance_round' }
  | { type: 'kick_player';     payload: { playerId: string } }
  | { type: 'end_game' };
