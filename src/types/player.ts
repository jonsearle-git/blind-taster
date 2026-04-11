import { PlayerStatus } from '../constants/gameConstants';

export type Player = {
  id: string;
  name: string;
  status: PlayerStatus;
  score: number;
};

export type JoinRequest = {
  playerId: string;
  name: string;
};
