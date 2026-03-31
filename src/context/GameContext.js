import React, { createContext, useContext, useReducer } from 'react';
import { GAME_STATES, HOST_MODES, REVEAL_MODES } from '../constants/gameConstants';

const GameContext = createContext(null);

const initialState = {
  // Setup
  gameName: '',
  hostMode: HOST_MODES.HOST_ONLY,
  revealMode: REVEAL_MODES.END_OF_GAME,
  questionnaire: [],   // Array of question objects
  rounds: [],          // Array of round objects
  hasAnswers: false,   // True if host set correct answers

  // Runtime
  gameState: GAME_STATES.SETUP,
  players: [],         // { id, name, state, answers: [], score: 0 }
  currentRoundIndex: 0,

  // Role
  isHost: false,
  localPlayerName: '',
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_GAME_CONFIG':
      return { ...state, ...action.payload };
    case 'SET_QUESTIONNAIRE':
      return { ...state, questionnaire: action.payload };
    case 'SET_ROUNDS':
      return { ...state, rounds: action.payload, hasAnswers: action.payload.some(r => r.answers !== null) };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(p => p.id === action.payload.id ? { ...p, ...action.payload } : p),
      };
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'REMOVE_PLAYER':
      return { ...state, players: state.players.filter(p => p.id !== action.payload) };
    case 'SET_CURRENT_ROUND':
      return { ...state, currentRoundIndex: action.payload };
    case 'SET_ROLE':
      return { ...state, isHost: action.payload.isHost, localPlayerName: action.payload.localPlayerName || '' };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
