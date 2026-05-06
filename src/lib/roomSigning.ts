import * as Crypto from 'expo-crypto';
import { ROOM_SIGNING_KEY } from './config';

// Keyed SHA-256 hash: SHA256(key + ":" + roomCode + ":" + key)
// crypto.subtle is not available in React Native (react-native-get-random-values
// patches global.crypto and removes subtle), so we use expo-crypto instead.
export async function signRoomCode(roomCode: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${ROOM_SIGNING_KEY}:${roomCode}:${ROOM_SIGNING_KEY}`,
  );
}
