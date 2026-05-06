import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Round } from '../types/game';

const KEY = '@blindtaster/host-session';

export type HostSession = {
  questionnaireId: string;
  rounds:          Round[];
  roomCode:        string;
  hostToken:       string;
};

export async function saveHostSession(session: HostSession): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(session));
}

export async function loadHostSession(): Promise<HostSession | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HostSession;
  } catch {
    return null;
  }
}

export async function clearHostSession(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
