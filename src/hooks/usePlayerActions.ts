import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import type { Answer } from '../types/answer';

export function usePlayerActions() {
  const { state, send } = useGameContext();

  const requestJoin = useCallback((name: string): void => {
    send({ type: 'request_join', payload: { name } });
  }, [send]);

  const submitAnswers = useCallback((answers: Answer[]): void => {
    const playerId    = state.localPlayerId;
    const roundNumber = state.gameState?.currentRound ?? 1;
    if (!playerId) return;
    send({ type: 'submit_answers', payload: { playerId, roundNumber, answers } });
  }, [send, state.localPlayerId, state.gameState?.currentRound]);

  return { requestJoin, submitAnswers };
}
