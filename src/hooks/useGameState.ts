import { useCallback } from 'react';
import { useGameContext } from '../context/GameContext';
import type { ServerMessage } from '../types/partykit';

export function useGameState() {
  const { dispatch } = useGameContext();

  const handleMessage = useCallback((msg: ServerMessage): void => {
    switch (msg.type) {
      case 'game_state':
        dispatch({ type: 'SET_GAME_STATE', payload: msg.payload });
        break;
      case 'host_state':
        dispatch({ type: 'SET_HOST_ROUNDS', payload: msg.payload.rounds });
        break;
      case 'join_request':
        dispatch({ type: 'ADD_JOIN_REQUEST', payload: msg.payload });
        break;
      case 'answers_revealed':
        dispatch({
          type:    'SET_ROUND_RESULTS',
          payload: { questionResults: msg.payload.questionResults, playerScores: msg.payload.playerScores, roundLabel: msg.payload.roundLabel },
        });
        break;
      case 'game_ended':
        dispatch({ type: 'SET_GAME_RESULTS', payload: msg.payload });
        break;
      case 'player_admitted':
        dispatch({ type: 'SET_LOCAL_PLAYER_ID', payload: msg.payload.playerId });
        break;
      case 'you_were_kicked':
        dispatch({ type: 'SET_KICKED' });
        break;
      case 'round_started':
        dispatch({ type: 'CLEAR_ROUND_RESULTS' });
        break;
      default:
        break;
    }
  }, [dispatch]);

  return { handleMessage };
}
