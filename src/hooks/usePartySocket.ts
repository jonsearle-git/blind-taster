import { useEffect, useRef, useCallback } from 'react';
import PartySocket from 'partysocket';
import { PARTYKIT_HOST } from '../lib/config';
import type { ServerMessage, ClientMessage } from '../types/partykit';

type Options = {
  roomCode: string;
  isHost:   boolean;
  onMessage: (msg: ServerMessage) => void;
  onOpen?:   () => void;
  onClose?:  () => void;
  onError?:  (err: Event) => void;
};

export function usePartySocket(options: Options) {
  const { roomCode, isHost, onMessage, onOpen, onClose, onError } = options;

  const socketRef = useRef<PartySocket | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!roomCode) return;

    const socket = new PartySocket({
      host:  PARTYKIT_HOST,
      room:  roomCode,
      query: isHost ? { isHost: '1' } : undefined,
    });

    socket.addEventListener('message', (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as ServerMessage;
        onMessageRef.current(msg);
      } catch {
        // malformed message — ignore
      }
    });

    if (onOpen)  socket.addEventListener('open',  onOpen);
    if (onClose) socket.addEventListener('close', onClose);
    if (onError) socket.addEventListener('error', onError as EventListener);

    socketRef.current = socket;

    return () => {
      socket.close();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, isHost]);

  const send = useCallback((msg: ClientMessage): void => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(msg));
    }
  }, []);

  return { send };
}
