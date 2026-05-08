import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@blindtaster/player-session';

export type PlayerSession = {
  roomCode: string;
  playerId: string;
  name:     string;
};

export async function savePlayerSession(session: PlayerSession): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export async function loadPlayerSession(): Promise<PlayerSession | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerSession;
  } catch {
    return null;
  }
}

export async function clearPlayerSession(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
