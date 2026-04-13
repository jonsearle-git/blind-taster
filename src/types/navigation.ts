import { GameResults } from './results';
import { Round } from './game';

export type RootStackParamList = {
  Home:   undefined;
  Host:   undefined;
  Player: undefined;
};

export type HostStackParamList = {
  SetupGame:            undefined;
  Questionnaires:       undefined;
  Games:                undefined;
  QuestionnaireBuilder: { questionnaireId?: string };
  RoundsBuilder:        { gameId?: string; questionnaireId?: string };
  HostLobby:            { questionnaireId: string; rounds: Round[] };
  HostInGame:           undefined;
  HostResults:          { results: GameResults };
};

export type HostInGameTabParamList = {
  HostRound:       undefined;
  HostPlayers:     undefined;
  HostLeaderboard: undefined;
};

export type PlayerStackParamList = {
  JoinGame:      { roomCode?: string };
  PlayerLobby:   undefined;
  PlayerRound:   undefined;
  PlayerResults: { results: GameResults };
};
