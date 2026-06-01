import { useState, useEffect } from 'react';
import { Round } from '../types/game';
import { Question } from '../types/questionnaire';
import { RevealMode } from '../constants/gameConstants';
import { useGameState } from './useGameState';
import { useGameContext } from '../context/GameContext';
import { signRoomCode } from '../lib/roomSigning';
import { saveHostSession } from '../lib/hostSession';

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

type Options = {
  questionnaireId:   string;
  filteredQuestions: Question[];
  revealMode:        RevealMode;
  rounds:            Round[];
  savedRoomCode?:    string;
};

type HostSetup = {
  roomCode: string;
};

export function useHostSetup({ questionnaireId, filteredQuestions, revealMode, rounds, savedRoomCode }: Options): HostSetup {
  const { connect }       = useGameContext();
  const { handleMessage } = useGameState();

  const [roomCode] = useState(() => savedRoomCode ?? generateRoomCode());

  useEffect(() => {
    let cancelled = false;
    signRoomCode(roomCode).then((sig) => {
      if (cancelled) return;
      void saveHostSession({ questionnaireId, filteredQuestions, revealMode, rounds, roomCode });
      void connect({ roomCode, isHost: true, sig, onMessage: handleMessage });
    });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { roomCode };
}
