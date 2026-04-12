import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import type { ClientMessage } from '../types/partykit';
import type { Questionnaire } from '../types/questionnaire';
import type { Round } from '../types/game';

export function useHostControls() {
  const { dispatch, sendRef } = useGameContext();

  const send = useCallback((msg: ClientMessage): void => {
    sendRef.current?.(msg);
  }, [sendRef]);

  const admitPlayer = useCallback((playerId: string): void => {
    dispatch({ type: 'REMOVE_JOIN_REQUEST', payload: playerId });
    send({ type: 'admit_player', payload: { playerId } });
  }, [dispatch, send]);

  const denyPlayer = useCallback((playerId: string): void => {
    dispatch({ type: 'REMOVE_JOIN_REQUEST', payload: playerId });
    send({ type: 'deny_player', payload: { playerId } });
  }, [dispatch, send]);

  const startGame = useCallback((questionnaire: Questionnaire, rounds: Round[]): void => {
    send({ type: 'start_game', payload: { questionnaire, rounds } });
  }, [send]);

  const revealAnswers = useCallback((): void => {
    send({ type: 'reveal_answers' });
  }, [send]);

  const advanceRound = useCallback((): void => {
    dispatch({ type: 'CLEAR_ROUND_RESULTS' });
    send({ type: 'advance_round' });
  }, [dispatch, send]);

  const endGame = useCallback((): void => {
    dispatch({ type: 'CLEAR_ROUND_RESULTS' });
    send({ type: 'end_game' });
  }, [dispatch, send]);

  const kickPlayer = useCallback((playerId: string): void => {
    send({ type: 'kick_player', payload: { playerId } });
  }, [send]);

  return { admitPlayer, denyPlayer, startGame, revealAnswers, advanceRound, endGame, kickPlayer };
}
