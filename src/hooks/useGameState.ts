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
      case 'join_request':
        dispatch({ type: 'ADD_JOIN_REQUEST', payload: msg.payload });
        break;
      case 'player_answered':
        dispatch({ type: 'MARK_PLAYER_ANSWERED', payload: msg.payload.playerId });
        break;
      case 'answers_revealed':
        dispatch({
          type:    'SET_ROUND_RESULTS',
          payload: { questionResults: msg.payload.questionResults, playerScores: msg.payload.playerScores },
        });
        break;
      case 'game_ended':
        dispatch({ type: 'SET_GAME_RESULTS', payload: msg.payload });
        break;
      case 'player_admitted':
        dispatch({ type: 'SET_LOCAL_PLAYER_ID', payload: msg.payload.playerId });
        break;
      case 'game_paused':
        dispatch({ type: 'SET_PAUSED', payload: true });
        break;
      case 'game_resumed':
        dispatch({ type: 'SET_PAUSED', payload: false });
        break;
      case 'you_were_kicked':
        dispatch({ type: 'SET_KICKED' });
        break;
      default:
        // all_players_answered, round_started, player_joined, player_kicked,
        // game_started, round_ended, you_were_denied, player_denied — covered
        // by game_state updates or handled by individual screens
        break;
    }
  }, [dispatch]);

  return { handleMessage };
}
