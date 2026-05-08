import { createContext, useContext, useReducer, useRef, useCallback } from 'react';
import PartySocket from 'partysocket';
import { PARTYKIT_HOST } from '../lib/config';
import { GamePhase } from '../constants/gameConstants';
import type { ClientMessage, ServerMessage } from '../types/partykit';
import { GameState } from '../types/game';
import { JoinRequest } from '../types/player';
import { GameResults, PlayerScore, QuestionResult } from '../types/results';
import { clearPlayerSession } from '../lib/playerSession';

type GameContextState = {
  gameState:        GameState | null;
  isHost:           boolean;
  localPlayerId:    string | null;
  pendingRequests:  JoinRequest[];
  isKicked:         boolean;
  isAbandoned:      boolean;
  isPaused:         boolean;
  gameResults:      GameResults | null;
  activeGameId:     string | null;
  lastRoundResults: QuestionResult[] | null;
  lastPlayerScores: PlayerScore[] | null;
  lastRoundLabel:   string | null;
};

type GameAction =
  | { type: 'SET_GAME_STATE';       payload: GameState }
  | { type: 'SET_HOST';             payload: boolean }
  | { type: 'SET_LOCAL_PLAYER_ID';  payload: string }
  | { type: 'SET_ACTIVE_GAME_ID';   payload: string | null }
  | { type: 'ADD_JOIN_REQUEST';     payload: JoinRequest }
  | { type: 'REMOVE_JOIN_REQUEST';  payload: string }
  | { type: 'SET_KICKED' }
  | { type: 'SET_ABANDONED' }
  | { type: 'SET_PAUSED';           payload: boolean }
  | { type: 'SET_GAME_RESULTS';     payload: GameResults }
  | { type: 'SET_ROUND_RESULTS';    payload: { questionResults: QuestionResult[]; playerScores: PlayerScore[]; roundLabel: string | null } }
  | { type: 'CLEAR_ROUND_RESULTS' }
  | { type: 'RESET' };

const initialState: GameContextState = {
  gameState:        null,
  isHost:           false,
  localPlayerId:    null,
  pendingRequests:  [],
  isKicked:         false,
  isAbandoned:      false,
  isPaused:         false,
  gameResults:      null,
  activeGameId:     null,
  lastRoundResults: null,
  lastPlayerScores: null,
  lastRoundLabel:   null,
};

function reducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {
    case 'SET_GAME_STATE':      return { ...state, gameState: action.payload };
    case 'SET_HOST':            return { ...state, isHost: action.payload };
    case 'SET_ACTIVE_GAME_ID':  return { ...state, activeGameId: action.payload };
    case 'SET_LOCAL_PLAYER_ID': return { ...state, localPlayerId: action.payload };
    case 'ADD_JOIN_REQUEST':
      if (state.pendingRequests.some((r) => r.playerId === action.payload.playerId)) return state;
      return { ...state, pendingRequests: [...state.pendingRequests, action.payload] };
    case 'REMOVE_JOIN_REQUEST':
      return { ...state, pendingRequests: state.pendingRequests.filter((r) => r.playerId !== action.payload) };
    case 'SET_KICKED':    return { ...state, isKicked: true };
    case 'SET_ABANDONED': return { ...state, isAbandoned: true };
    case 'SET_PAUSED':    return { ...state, isPaused: action.payload };
    case 'SET_GAME_RESULTS': return { ...state, gameResults: action.payload };
    case 'SET_ROUND_RESULTS':
      return { ...state, lastRoundResults: action.payload.questionResults, lastPlayerScores: action.payload.playerScores, lastRoundLabel: action.payload.roundLabel };
    case 'CLEAR_ROUND_RESULTS':
      return { ...state, lastRoundResults: null, lastPlayerScores: null, lastRoundLabel: null };
    case 'RESET': return initialState;
    default:      return state;
  }
}

type ConnectOptions = {
  roomCode:   string;
  isHost:     boolean;
  hostToken?: string;
  sig?:       string;
  onMessage:  (msg: ServerMessage) => void;
  onOpen?:    () => void;
};

type GameContextValue = {
  state:      GameContextState;
  dispatch:   React.Dispatch<GameAction>;
  send:       (msg: ClientMessage) => void;
  connect:    (opts: ConnectOptions) => void;
  disconnect: () => void;
  leaveGame:  () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

type Props = { children: React.ReactNode };

const DEVICE_ID = Math.random().toString(36).slice(2, 6).toUpperCase();

export function GameProvider({ children }: Props): React.ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);
  const socketRef  = useRef<PartySocket | null>(null);
  const queueRef   = useRef<ClientMessage[]>([]);
  const onMsgRef   = useRef<((msg: ServerMessage) => void) | null>(null);
  const stateRef   = useRef(state);
  stateRef.current = state;

  const disconnect = useCallback((): void => {
    if (__DEV__) console.log(`[${DEVICE_ID}] disconnect`);
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    queueRef.current = [];
    onMsgRef.current = null;
  }, []);

  const connect = useCallback((opts: ConnectOptions): void => {
    if (__DEV__) console.log(`[${DEVICE_ID}] connect`, opts.roomCode, opts.isHost ? 'host' : 'player');
    if (socketRef.current) {
      if (__DEV__) console.log(`[${DEVICE_ID}] closing existing socket`);
      socketRef.current.close();
      socketRef.current = null;
    }
    queueRef.current = [];
    onMsgRef.current = opts.onMessage;

    const socket = new PartySocket({
      host:  PARTYKIT_HOST,
      room:  opts.roomCode,
      query: opts.isHost ? { isHost: '1', token: opts.hostToken ?? '', sig: opts.sig ?? '' } : undefined,
    });

    socket.addEventListener('message', (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as ServerMessage;
        if (__DEV__) console.log(`[${DEVICE_ID}] recv`, msg.type);
        onMsgRef.current?.(msg);
      } catch { /* malformed — ignore */ }
    });

    socket.addEventListener('open', () => {
      if (__DEV__) console.log(`[${DEVICE_ID}] socket opened`, opts.roomCode);
      const pending = queueRef.current.splice(0);
      for (const msg of pending) socket.send(JSON.stringify(msg));
      opts.onOpen?.();
    });

    socket.addEventListener('close', (e) => {
      if (__DEV__) console.log(`[${DEVICE_ID}] socket closed`, opts.roomCode, e.code, e.reason);
    });

    socketRef.current = socket;
  }, []);

  const send = useCallback((msg: ClientMessage): void => {
    const socket = socketRef.current;
    if (__DEV__) console.log(`[${DEVICE_ID}] send`, msg.type, 'readyState:', socket?.readyState ?? 'null');
    if (socket && socket.readyState === 1) {
      socket.send(JSON.stringify(msg));
    } else {
      queueRef.current.push(msg);
    }
  }, []);

  const leaveGame = useCallback((): void => {
    const s = stateRef.current;
    const isHost = s.localPlayerId === null && s.gameState !== null && s.gameState.phase !== GamePhase.GameOver;
    if (__DEV__) console.log(`[${DEVICE_ID}] leaveGame isHost:`, isHost, 'localPlayerId:', s.localPlayerId, 'gameState:', s.gameState?.phase);
    if (isHost) {
      const socket = socketRef.current;
      if (socket && socket.readyState === 1) socket.send(JSON.stringify({ type: 'end_game' }));
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    queueRef.current = [];
    onMsgRef.current = null;
    void clearPlayerSession();
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  return (
    <GameContext.Provider value={{ state, dispatch, send, connect, disconnect, leaveGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
