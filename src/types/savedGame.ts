import { Round } from './game';

export type SavedGame = {
  id:              string;
  name:            string;
  questionnaireId: string;
  rounds:          Round[];
  createdAt:       number;
  updatedAt:       number;
};
