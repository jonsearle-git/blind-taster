import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import type { Answer } from '../types/answer';

export function usePlayerActions() {
  const { state, sendRef } = useGameContext();

  const requestJoin = useCallback((name: string): void => {
    sendRef.current?.({ type: 'request_join', payload: { name } });
  }, [sendRef]);

  const submitAnswers = useCallback((answers: Answer[]): void => {
    const playerId    = state.localPlayerId;
    const roundNumber = state.gameState?.currentRound ?? 1;
    if (!playerId) return;
    sendRef.current?.({ type: 'submit_answers', payload: { playerId, roundNumber, answers } });
  }, [sendRef, state.localPlayerId, state.gameState?.currentRound]);

  return { requestJoin, submitAnswers };
}
