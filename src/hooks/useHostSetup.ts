import { useState, useEffect } from 'react';
import { Round } from '../types/game';
import { useGameState } from './useGameState';
import { useGameContext } from '../context/GameContext';
import { signRoomCode } from '../lib/roomSigning';
import { saveHostSession } from '../lib/hostSession';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateHostToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

type Options = {
  questionnaireId: string;
  rounds:          Round[];
  savedRoomCode?:  string;
  savedHostToken?: string;
};

type HostSetup = {
  roomCode:  string;
  hostToken: string;
};

export function useHostSetup({ questionnaireId, rounds, savedRoomCode, savedHostToken }: Options): HostSetup {
  const { connect }       = useGameContext();
  const { handleMessage } = useGameState();

  const [roomCode]  = useState(() => savedRoomCode  ?? generateRoomCode());
  const [hostToken] = useState(() => savedHostToken ?? generateHostToken());

  useEffect(() => {
    let cancelled = false;
    signRoomCode(roomCode).then((sig) => {
      if (cancelled) return;
      void saveHostSession({ questionnaireId, rounds, roomCode, hostToken });
      connect({ roomCode, isHost: true, hostToken, sig, onMessage: handleMessage });
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { roomCode, hostToken };
}
