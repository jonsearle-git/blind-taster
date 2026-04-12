import { Answer } from './answer';
import { Player } from './player';

export type QuestionResult = {
  questionId:           string;
  prompt:               string;
  playerAnswer:         Answer;
  correctAnswer:        Answer;
  playerAnswerLabel:    string; // resolved at scoring time — human-readable
  correctAnswerLabel:   string; // resolved at scoring time — human-readable
  pointsAwarded:        number;
};

export type RoundResult = {
  roundNumber:      number;
  roundLabel:       string | null;
  questionResults:  QuestionResult[];
  roundScore:       number;
};

export type PlayerResult = {
  player:      Player;
  rounds:      RoundResult[];
  totalScore:  number;
  position:    number;
};

export type GameResults = {
  players: PlayerResult[];
  winner:  Player;
};

export type PlayerScore = {
  playerId:   string;
  roundScore: number;
  totalScore: number;
};
