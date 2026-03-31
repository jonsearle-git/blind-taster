/**
 * useBleHost
 *
 * HOST acts as BLE central — scans for and connects to each player peripheral.
 * Connections persist for the entire game session.
 *
 * Fixes applied:
 *  - BLE state monitor kept alive (not removed after PoweredOn) → detects BT off mid-game
 *  - onDisconnected handler per device → triggers reconnect with capped backoff
 *  - Reconnect capped at BLE_MAX_RECONNECT_ATTEMPTS to prevent battery drain
 *  - sendToPlayer retries on write failure (BLE_WRITE_RETRIES times)
 *  - setCallbacks() updates callbacks without restarting the scan (prevents Android throttle)
 *  - gameStartedRef blocks late join requests once game is underway
 *  - Buffer evictStale() called on disconnect to prevent chunk corruption on reconnect
 *  - Disconnected/reconnected player state exposed to UI via disconnectedPlayers
 */

import { useState, useRef, useCallback } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import {
  BT_SERVICE_UUID,
  BT_CHAR_UUID,
  BLE_SCAN_TIMEOUT,
  BLE_CONNECT_TIMEOUT,
  BLE_MAX_RECONNECT_ATTEMPTS,
  BLE_RECONNECT_DELAY_MS,
  BLE_WRITE_RETRIES,
  BLE_WRITE_RETRY_DELAY_MS,
} from './bleConstants';
import { encodeMessage, ReassemblyBuffer } from './bleProtocol';
import { BLE_MESSAGE_TYPES } from '../constants/gameConstants';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// BT state (bleReady, btError) is owned by BleContext and passed in — no subscription here.
// scanError covers local errors (permissions, scan failures).
export default function useBleHost(managerRef, bleReady, btError) {
  const connectionsRef = useRef({});
  const buffersRef = useRef({});
  const reconnectAttemptsRef = useRef({});
  const gameStartedRef = useRef(false);

  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [disconnectedPlayers, setDisconnectedPlayers] = useState([]);

  const onJoinRequestRef = useRef(null);
  const onPlayerAnswerRef = useRef(null);
  const onPlayerDroppedRef = useRef(null);
  const onPlayerReconnectedRef = useRef(null);

  async function requestPermissions() {
    if (Platform.OS !== 'android') return true;
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);
    return Object.values(grants).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
  }

  // Subscribe to notifications from a connected device and attach the disconnect handler.
  function attachDevice(device) {
    buffersRef.current[device.id] = buffersRef.current[device.id] ?? new ReassemblyBuffer();
    reconnectAttemptsRef.current[device.id] = 0;

    // Incoming messages
    device.monitorCharacteristicForService(
      BT_SERVICE_UUID,
      BT_CHAR_UUID,
      (err, char) => {
        if (err || !char?.value) return;
        const buffer = buffersRef.current[device.id];
        if (!buffer) return;
        const msg = buffer.feed(char.value);
        if (!msg) return;
        handleIncoming(device.id, msg);
      }
    );

    // Disconnect handler — fix #1, #2
    device.onDisconnected((_err, disconnectedDevice) => {
      const id = disconnectedDevice?.id ?? device.id;
      delete connectionsRef.current[id];

      // Evict stale partial messages so they don't corrupt the reconnect session — fix #5
      buffersRef.current[id]?.evictStale();

      setDisconnectedPlayers(prev => prev.includes(id) ? prev : [...prev, id]);

      if (gameStartedRef.current) {
        attemptReconnect(id, disconnectedDevice ?? device);
      }
    });
  }

  async function attemptReconnect(playerId, device) {
    const attempts = (reconnectAttemptsRef.current[playerId] ?? 0) + 1;
    reconnectAttemptsRef.current[playerId] = attempts;

    if (attempts > BLE_MAX_RECONNECT_ATTEMPTS) {
      // Give up — fix #11
      onPlayerDroppedRef.current?.({ playerId });
      setDisconnectedPlayers(prev => prev.filter(id => id !== playerId));
      delete buffersRef.current[playerId];
      delete reconnectAttemptsRef.current[playerId];
      return;
    }

    await delay(BLE_RECONNECT_DELAY_MS * attempts); // exponential-ish backoff

    try {
      const reconnected = await device.connect({ timeout: BLE_CONNECT_TIMEOUT });
      await reconnected.discoverAllServicesAndCharacteristics();
      connectionsRef.current[playerId] = reconnected;
      reconnectAttemptsRef.current[playerId] = 0;
      setDisconnectedPlayers(prev => prev.filter(id => id !== playerId));
      attachDevice(reconnected);
      onPlayerReconnectedRef.current?.({ playerId });
    } catch {
      // Still failing — try again (will stop at max attempts)
      attemptReconnect(playerId, device);
    }
  }

  const startScanning = useCallback(async ({ onJoinRequest, onPlayerAnswer, onPlayerDropped, onPlayerReconnected }) => {
    onJoinRequestRef.current = onJoinRequest;
    onPlayerAnswerRef.current = onPlayerAnswer;
    onPlayerDroppedRef.current = onPlayerDropped ?? null;
    onPlayerReconnectedRef.current = onPlayerReconnected ?? null;

    const ok = await requestPermissions();
    if (!ok) { setScanError('Bluetooth permissions denied.'); return; }

    setScanning(true);
    setScanError(null);

    managerRef.current.startDeviceScan(
      [BT_SERVICE_UUID],
      { allowDuplicates: false },
      async (error, device) => {
        if (error) {
          setScanError(error.message);
          setScanning(false);
          return;
        }
        if (!device || connectionsRef.current[device.id]) return;

        // Don't allow new players once game has started — fix #9
        if (gameStartedRef.current) return;

        try {
          const connected = await device.connect({ timeout: BLE_CONNECT_TIMEOUT });
          await connected.discoverAllServicesAndCharacteristics();
          connectionsRef.current[device.id] = connected;
          attachDevice(connected);
        } catch {
          // Ignore individual connection failures
        }
      }
    );

    setTimeout(() => {
      managerRef.current?.stopDeviceScan();
      setScanning(false);
    }, BLE_SCAN_TIMEOUT);
  }, []);

  // Update answer/event callbacks without restarting the scan — fix #7
  function setCallbacks({ onPlayerAnswer, onPlayerDropped, onPlayerReconnected }) {
    if (onPlayerAnswer) onPlayerAnswerRef.current = onPlayerAnswer;
    if (onPlayerDropped) onPlayerDroppedRef.current = onPlayerDropped;
    if (onPlayerReconnected) onPlayerReconnectedRef.current = onPlayerReconnected;
  }

  function stopScanning() {
    managerRef.current?.stopDeviceScan();
    setScanning(false);
  }

  function handleIncoming(playerId, msg) {
    switch (msg.type) {
      case BLE_MESSAGE_TYPES.JOIN_REQUEST:
        if (!gameStartedRef.current) {
          onJoinRequestRef.current?.({ playerId, playerName: msg.playerName });
        }
        break;
      case BLE_MESSAGE_TYPES.PLAYER_ANSWER:
        onPlayerAnswerRef.current?.({ playerId, roundIndex: msg.roundIndex, answers: msg.answers });
        break;
    }
  }

  // Write with retry — fix #6, #12
  async function sendToPlayer(playerId, messageObj) {
    const device = connectionsRef.current[playerId];
    if (!device) return false;

    const chunks = encodeMessage(messageObj);
    for (const chunk of chunks) {
      let sent = false;
      for (let attempt = 0; attempt <= BLE_WRITE_RETRIES; attempt++) {
        try {
          await device.writeCharacteristicWithResponseForService(BT_SERVICE_UUID, BT_CHAR_UUID, chunk);
          sent = true;
          break;
        } catch {
          if (attempt < BLE_WRITE_RETRIES) {
            await delay(BLE_WRITE_RETRY_DELAY_MS);
          }
        }
      }
      if (!sent) return false; // Caller knows the message didn't get through
    }
    return true;
  }

  async function broadcastToAll(messageObj) {
    const results = await Promise.all(
      Object.keys(connectionsRef.current).map(id => sendToPlayer(id, messageObj))
    );
    return results.every(Boolean);
  }

  async function acceptPlayer(playerId) {
    return sendToPlayer(playerId, { type: BLE_MESSAGE_TYPES.JOIN_ACCEPTED });
  }

  async function denyPlayer(playerId) {
    await sendToPlayer(playerId, { type: BLE_MESSAGE_TYPES.JOIN_DENIED });
    connectionsRef.current[playerId]?.cancelConnection().catch(() => {});
    delete connectionsRef.current[playerId];
    delete buffersRef.current[playerId];
    delete reconnectAttemptsRef.current[playerId];
  }

  async function startGame(questionnaire, rounds, revealMode, hostMode) {
    gameStartedRef.current = true;
    return broadcastToAll({
      type: BLE_MESSAGE_TYPES.GAME_START,
      questionnaire,
      rounds: rounds.map(r => ({ number: r.number })),
      revealMode,
      hostMode,
    });
  }

  async function sendRound(roundIndex) {
    return broadcastToAll({ type: BLE_MESSAGE_TYPES.ROUND_START, roundIndex });
  }

  async function sendReveal(roundIndex, answers) {
    return broadcastToAll({ type: BLE_MESSAGE_TYPES.ROUND_REVEAL, roundIndex, answers });
  }

  async function sendScore(playerId, score, breakdown) {
    return sendToPlayer(playerId, { type: BLE_MESSAGE_TYPES.PLAYER_SCORE, score, breakdown });
  }

  async function sendGameResults(allPlayerData) {
    return broadcastToAll({ type: BLE_MESSAGE_TYPES.GAME_RESULTS, allPlayerData });
  }

  function disconnectAll() {
    gameStartedRef.current = false;
    Object.values(connectionsRef.current).forEach(d => d.cancelConnection().catch(() => {}));
    connectionsRef.current = {};
    buffersRef.current = {};
    reconnectAttemptsRef.current = {};
    setDisconnectedPlayers([]);
  }

  return {
    bleReady,
    bleError: btError ?? scanError,
    scanning,
    disconnectedPlayers,
    startScanning,
    stopScanning,
    setCallbacks,
    acceptPlayer,
    denyPlayer,
    startGame,
    sendRound,
    sendReveal,
    sendScore,
    sendGameResults,
    disconnectAll,
  };
}
