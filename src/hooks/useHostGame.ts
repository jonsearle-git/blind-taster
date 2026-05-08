import { RoundPhase } from '../constants/gameConstants';
import { Player } from '../types/player';
import { useGameContext } from '../context/GameContext';

type HostRoundState = {
  players:      Player[];
  sorted:       Player[];
  waiting:      Player[];
  answered:     Player[];
  answeredIds:  Set<string>;
  currentRound: number;
  totalRounds:  number;
  gameName:     string;
  roomCode:     string;
  roundPhase:   RoundPhase;
  isLastRound:  boolean;
  isAnswering:  boolean;
};

export function useHostGame(): HostRoundState {
  const { state } = useGameContext();

  const game         = state.gameState;
  const players      = game?.players ?? [];
  const currentRound = game?.currentRound ?? 1;
  const totalRounds  = game?.totalRounds ?? 1;
  const gameName     = game?.questionnaire?.name ?? '';
  const roomCode     = game?.roomCode ?? '';
  const roundPhase   = game?.roundPhase ?? RoundPhase.Answering;
  const answeredIds  = new Set(game?.answeredPlayerIds ?? []);
  const isLastRound  = currentRound === totalRounds;
  const isAnswering  = roundPhase === RoundPhase.Answering;

  const sorted   = [...players].sort((a, b) => b.score - a.score);
  const waiting  = sorted.filter((p) => !answeredIds.has(p.id));
  const answered = sorted.filter((p) =>  answeredIds.has(p.id));

  return { players, sorted, waiting, answered, answeredIds, currentRound, totalRounds, gameName, roomCode, roundPhase, isLastRound, isAnswering };
}
