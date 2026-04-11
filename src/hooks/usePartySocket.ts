import { useEffect, useRef, useCallback } from 'react';
import PartySocket from 'partysocket';
import { PARTYKIT_HOST } from '../lib/config';
import type { ServerMessage, ClientMessage } from '../types/partykit';

type Options = {
  roomCode:   string;
  isHost:     boolean;
  hostToken?: string; // C1: required when isHost=true; verified by server
  onMessage:  (msg: ServerMessage) => void;
  onOpen?:    () => void;
  onClose?:   () => void;
  onError?:   (err: Event) => void;
};

export function usePartySocket(options: Options) {
  const { roomCode, isHost, hostToken, onMessage, onOpen, onClose, onError } = options;

  const socketRef   = useRef<PartySocket | null>(null);
  const queueRef    = useRef<ClientMessage[]>([]); // M3: messages queued while socket reconnects
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!roomCode) return;

    const socket = new PartySocket({
      host:  PARTYKIT_HOST,
      room:  roomCode,
      query: isHost ? { isHost: '1', token: hostToken ?? '' } : undefined,
    });

    socket.addEventListener('message', (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as ServerMessage;
        onMessageRef.current(msg);
      } catch {
        // malformed message — ignore
      }
    });

    // M3: flush queued messages when the socket (re)connects
    socket.addEventListener('open', () => {
      const pending = queueRef.current.splice(0);
      for (const msg of pending) {
        socket.send(JSON.stringify(msg));
      }
      onOpen?.();
    });

    if (onClose) socket.addEventListener('close', onClose);
    if (onError) socket.addEventListener('error', onError as EventListener);

    socketRef.current = socket;

    return () => {
      socket.close();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, isHost, hostToken]);

  const send = useCallback((msg: ClientMessage): void => {
    const socket = socketRef.current;
    if (socket && socket.readyState === 1 /* WebSocket.OPEN */) {
      socket.send(JSON.stringify(msg));
    } else {
      // M3: queue message for delivery on next open
      queueRef.current.push(msg);
    }
  }, []);

  return { send };
}
