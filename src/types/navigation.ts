import { NavigatorScreenParams } from '@react-navigation/native';
import { Round } from './game';
import { RevealMode } from '../constants/gameConstants';
import { Question } from './questionnaire';

export type RootStackParamList = {
  Home:   undefined;
  Host:   NavigatorScreenParams<HostStackParamList> | undefined;
  Player: NavigatorScreenParams<PlayerStackParamList> | undefined;
};

export type HostStackParamList = {
  Questionnaires: undefined;
  QuestionPicker: { questionnaireId: string };
  HostGame:       { questionnaireId: string; rounds: Round[]; revealMode: RevealMode; savedRoomCode?: string; filteredQuestions?: Question[] };
};

export type PlayerStackParamList = {
  PlayerGame: { roomCode?: string };
};
