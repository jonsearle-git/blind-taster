import { GamePhase, RoundPhase } from '../constants/gameConstants';
import { Player } from './player';
import { QuestionnaireForPlayer } from './questionnaire';

export type Round = {
  number: number;
  label: string | null;
};

export type GameState = {
  roomCode: string;
  phase: GamePhase;
  roundPhase: RoundPhase;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  questionnaire: QuestionnaireForPlayer | null;
  rounds: Round[];
};
