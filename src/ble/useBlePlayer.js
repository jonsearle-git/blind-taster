/**
 * useBlePlayer
 *
 * PLAYER acts as BLE peripheral — advertises so the host (central) can find and connect.
 *
 * Fixes applied:
 *  - BLE state monitor kept alive → detects BT turned off mid-game (fix #4)
 *  - onDisconnected handler → notifies player UI when host drops (fix #3)
 *  - Write retry on failure (fix #6)
 */

import { useState, useRef, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  BT_SERVICE_UUID,
  BT_CHAR_UUID,
  BLE_WRITE_RETRIES,
  BLE_WRITE_RETRY_DELAY_MS,
} from './bleConstants';
import { encodeMessage, ReassemblyBuffer } from './bleProtocol';
import { BLE_MESSAGE_TYPES } from '../constants/gameConstants';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// BT state (bleReady, btError) is owned by BleContext and passed in — no subscription here.
// advertiseError covers local errors (permissions, advertising failures).
export default function useBlePlayer(managerRef, bleReady, btError) {
  const bufferRef = useRef(new ReassemblyBuffer());
  const [advertising, setAdvertising] = useState(false);
  const [connected, setConnected] = useState(false);
  const [advertiseError, setAdvertiseError] = useState(null);

  const callbacksRef = useRef({});

  async function requestPermissions() {
    if (Platform.OS !== 'android') return true;
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return Object.values(grants).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
  }

  const startAdvertising = useCallback(async (callbacks) => {
    callbacksRef.current = callbacks;
    const ok = await requestPermissions();
    if (!ok) { setAdvertiseError('Bluetooth permissions denied.'); return; }

    setAdvertiseError(null);

    try {
      await managerRef.current.startAdvertising({
        serviceUUIDs: [BT_SERVICE_UUID],
        localName: 'BlindTesterPlayer',
      });
      setAdvertising(true);
    } catch (e) {
      setAdvertiseError('Could not start advertising: ' + e.message);
      return;
    }

    // Listen for incoming characteristic writes from the host
    managerRef.current.onDeviceConnected(BT_SERVICE_UUID, BT_CHAR_UUID, (_err, char) => {
      if (!char?.value) return;
      const msg = bufferRef.current.feed(char.value);
      if (!msg) return;
      handleIncoming(msg);
    });

    // Host disconnect handler — fix #3
    managerRef.current.onDeviceDisconnected(BT_SERVICE_UUID, (_err, _device) => {
      if (!connected) return; // not yet accepted — ignore
      setConnected(false);
      bufferRef.current.evictStale();
      callbacksRef.current.onHostDisconnected?.();
    });
  }, [connected]);

  function stopAdvertising() {
    managerRef.current?.stopAdvertising?.();
    setAdvertising(false);
  }

  function handleIncoming(msg) {
    const cbs = callbacksRef.current;
    switch (msg.type) {
      case BLE_MESSAGE_TYPES.JOIN_ACCEPTED:
        setConnected(true);
        cbs.onJoinAccepted?.();
        break;
      case BLE_MESSAGE_TYPES.JOIN_DENIED:
        cbs.onJoinDenied?.();
        break;
      case BLE_MESSAGE_TYPES.GAME_START:
        cbs.onGameStart?.(msg);
        break;
      case BLE_MESSAGE_TYPES.ROUND_START:
        cbs.onRoundStart?.(msg);
        break;
      case BLE_MESSAGE_TYPES.ROUND_REVEAL:
        cbs.onRoundReveal?.(msg);
        break;
      case BLE_MESSAGE_TYPES.PLAYER_SCORE:
        cbs.onScore?.(msg);
        break;
      case BLE_MESSAGE_TYPES.GAME_RESULTS:
        cbs.onGameResults?.(msg);
        break;
    }
  }

  // Write to host with retry — fix #6
  async function writeToHost(messageObj) {
    const chunks = encodeMessage(messageObj);
    for (const chunk of chunks) {
      let sent = false;
      for (let attempt = 0; attempt <= BLE_WRITE_RETRIES; attempt++) {
        try {
          await managerRef.current?.updateCharacteristicForService?.(BT_SERVICE_UUID, BT_CHAR_UUID, chunk);
          sent = true;
          break;
        } catch {
          if (attempt < BLE_WRITE_RETRIES) {
            await delay(BLE_WRITE_RETRY_DELAY_MS);
          }
        }
      }
      if (!sent) return false;
    }
    return true;
  }

  async function sendJoinRequest(playerName) {
    return writeToHost({ type: BLE_MESSAGE_TYPES.JOIN_REQUEST, playerName });
  }

  async function sendAnswer(roundIndex, answers) {
    return writeToHost({ type: BLE_MESSAGE_TYPES.PLAYER_ANSWER, roundIndex, answers });
  }

  function disconnect() {
    stopAdvertising();
    bufferRef.current.clear();
    setConnected(false);
  }

  return {
    bleReady,
    bleError: btError ?? advertiseError,
    advertising,
    connected,
    startAdvertising,
    stopAdvertising,
    sendJoinRequest,
    sendAnswer,
    disconnect,
  };
}
