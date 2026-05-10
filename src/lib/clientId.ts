import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';

const KEY = '@blindtaster/clientId';
let cached: string | null = null;

export async function getClientId(): Promise<string> {
  if (cached) return cached;
  let id = await AsyncStorage.getItem(KEY);
  if (!id) {
    id = uuid();
    await AsyncStorage.setItem(KEY, id);
  }
  cached = id;
  return id;
}
