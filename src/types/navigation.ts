import { NavigatorScreenParams } from '@react-navigation/native';
import { GameResults } from './results';
import { Round } from './game';
import { Question } from './questionnaire';
import { QuestionType } from '../constants/gameConstants';

export type RootStackParamList = {
  Home:   undefined;
  Host:   NavigatorScreenParams<HostStackParamList> | undefined;
  Player: NavigatorScreenParams<PlayerStackParamList> | undefined;
};

export type HostStackParamList = {
  SetupGame:            undefined;
  Questionnaires:       undefined;
  Games:                undefined;
  QuestionnaireBuilder: { questionnaireId?: string };
  QuestionEditor:       { questionType?: QuestionType; question?: Question };
  RoundsBuilder:        { gameId?: string; questionnaireId?: string };
  HostGame:             { questionnaireId: string; rounds: Round[]; savedRoomCode?: string; savedHostToken?: string };
};

export type PlayerStackParamList = {
  PlayerGame: { roomCode?: string; savedPlayerId?: string; savedName?: string };
};
