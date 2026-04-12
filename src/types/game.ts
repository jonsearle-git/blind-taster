import { GamePhase, RoundPhase } from '../constants/gameConstants';
import { Player } from './player';
import { Questionnaire } from './questionnaire';
import { Answer } from './answer';

// Full round with correct answers — stored server-side and in the host's nav params.
export type Round = {
  number: number;
  label: string | null;
  correctAnswers: Answer[]; // one per question, keyed by answer.questionId
};

// Stripped round sent to players — no labels mid-game, no correct answers ever.
export type RoundForPlayer = {
  number: number;
  label: string | null; // null mid-game; populated in GameResults at end
};

export type GameState = {
  roomCode: string;
  phase: GamePhase;
  roundPhase: RoundPhase;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  questionnaire: Questionnaire | null;
  rounds: RoundForPlayer[];
  answeredPlayerIds: string[]; // server-authoritative; replaces client-side tracking
};
