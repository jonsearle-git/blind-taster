import { Round } from './game';
import { Question } from './questionnaire';
import { RevealMode } from '../constants/gameConstants';

export type SavedGame = {
  id:                string;
  name:              string;
  questionnaireId:   string;
  filteredQuestions: Question[];
  revealMode:        RevealMode;
  rounds:            Round[];
  createdAt:         number;
  updatedAt:         number;
};
