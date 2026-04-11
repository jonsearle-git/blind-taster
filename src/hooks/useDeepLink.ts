import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';

const ROOM_CODE_PATTERN = /blindtaster:\/\/join\/([A-Z0-9]+)/i;

function extractRoomCode(url: string): string | null {
  const match = ROOM_CODE_PATTERN.exec(url);
  return match?.[1]?.toUpperCase() ?? null;
}

export function useDeepLink(): string | null {
  const [roomCode, setRoomCode] = useState<string | null>(null);

  useEffect(() => {
    // Check URL the app was opened with
    Linking.getInitialURL().then((url) => {
      if (url) {
        const code = extractRoomCode(url);
        if (code) setRoomCode(code);
      }
    });

    // Listen for URLs while app is open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const code = extractRoomCode(url);
      if (code) setRoomCode(code);
    });

    return () => subscription.remove();
  }, []);

  return roomCode;
}
