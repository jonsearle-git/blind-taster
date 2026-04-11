import { createContext, useContext, useReducer, useRef } from 'react';
import type { ClientMessage } from '../types/partykit';
import { GamePhase, RoundPhase } from '../constants/gameConstants';
import { GameState } from '../types/game';
import { Player, JoinRequest } from '../types/player';
import { GameResults, PlayerScore, QuestionResult } from '../types/results';

type GameContextState = {
  gameState:         GameState | null;
  isHost:            boolean;
  localPlayerId:     string | null;
  pendingRequests:   JoinRequest[];
  answeredPlayerIds: Set<string>;
  isKicked:          boolean;
  isPaused:          boolean;
  gameResults:       GameResults | null;
  // Post-reveal data for current round
  lastRoundResults:  QuestionResult[] | null;
  lastPlayerScores:  PlayerScore[] | null;
};

type GameAction =
  | { type: 'SET_GAME_STATE';       payload: GameState }
  | { type: 'SET_HOST';             payload: boolean }
  | { type: 'SET_LOCAL_PLAYER_ID';  payload: string }
  | { type: 'ADD_JOIN_REQUEST';     payload: JoinRequest }
  | { type: 'REMOVE_JOIN_REQUEST';  payload: string }
  | { type: 'MARK_PLAYER_ANSWERED'; payload: string }
  | { type: 'CLEAR_ANSWERED' }
  | { type: 'SET_KICKED' }
  | { type: 'SET_PAUSED';           payload: boolean }
  | { type: 'SET_GAME_RESULTS';     payload: GameResults }
  | { type: 'SET_ROUND_RESULTS';    payload: { questionResults: QuestionResult[]; playerScores: PlayerScore[] } }
  | { type: 'CLEAR_ROUND_RESULTS' }
  | { type: 'RESET' };

const initialState: GameContextState = {
  gameState:         null,
  isHost:            false,
  localPlayerId:     null,
  pendingRequests:   [],
  answeredPlayerIds: new Set(),
  isKicked:          false,
  isPaused:          false,
  gameResults:       null,
  lastRoundResults:  null,
  lastPlayerScores:  null,
};

function reducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_HOST':
      return { ...state, isHost: action.payload };
    case 'SET_LOCAL_PLAYER_ID':
      return { ...state, localPlayerId: action.payload };
    case 'ADD_JOIN_REQUEST':
      return {
        ...state,
        pendingRequests: [...state.pendingRequests, action.payload],
      };
    case 'REMOVE_JOIN_REQUEST':
      return {
        ...state,
        pendingRequests: state.pendingRequests.filter((r) => r.playerId !== action.payload),
      };
    case 'MARK_PLAYER_ANSWERED': {
      const next = new Set(state.answeredPlayerIds);
      next.add(action.payload);
      return { ...state, answeredPlayerIds: next };
    }
    case 'CLEAR_ANSWERED':
      return { ...state, answeredPlayerIds: new Set() };
    case 'SET_KICKED':
      return { ...state, isKicked: true };
    case 'SET_PAUSED':
      return { ...state, isPaused: action.payload };
    case 'SET_GAME_RESULTS':
      return { ...state, gameResults: action.payload };
    case 'SET_ROUND_RESULTS':
      return {
        ...state,
        lastRoundResults: action.payload.questionResults,
        lastPlayerScores: action.payload.playerScores,
      };
    case 'CLEAR_ROUND_RESULTS':
      return { ...state, lastRoundResults: null, lastPlayerScores: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

type GameContextValue = {
  state:    GameContextState;
  dispatch: React.Dispatch<GameAction>;
  sendRef:  React.MutableRefObject<((msg: ClientMessage) => void) | null>;
};

const GameContext = createContext<GameContextValue | null>(null);

type Props = { children: React.ReactNode };

export function GameProvider({ children }: Props): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);
  const sendRef = useRef<((msg: ClientMessage) => void) | null>(null);
  return (
    <GameContext.Provider value={{ state, dispatch, sendRef }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
