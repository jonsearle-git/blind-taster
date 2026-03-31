import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGame } from '../../context/GameContext';
import { useBle } from '../../context/BleContext';
import { GAME_STATES } from '../../constants/gameConstants';
import COLORS from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

const STATUS = {
  IDLE: 'idle',
  ADVERTISING: 'advertising',
  WAITING: 'waiting',   // join request sent, awaiting host response
  DENIED: 'denied',
};

export default function JoinGameScreen({ navigation }) {
  const { dispatch } = useGame();
  const { player: ble } = useBle();
  const [playerName, setPlayerName] = useState('');
  const [nameError, setNameError] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);

  useEffect(() => {
    return () => {
      // If the user navigates back, stop advertising
      ble.stopAdvertising();
    };
  }, []);

  async function handleJoin() {
    if (!playerName.trim()) {
      setNameError('Please enter your name.');
      return;
    }
    setNameError('');
    dispatch({ type: 'SET_ROLE', payload: { isHost: false, localPlayerName: playerName.trim() } });

    setStatus(STATUS.ADVERTISING);

    await ble.startAdvertising({
      onJoinAccepted: () => {
        setStatus(STATUS.WAITING); // already waiting, now accepted → go to lobby
        navigation.navigate('PlayerLobby');
      },
      onJoinDenied: () => {
        setStatus(STATUS.DENIED);
        ble.stopAdvertising();
      },
      onGameStart: (msg) => {
        dispatch({
          type: 'SET_GAME_CONFIG',
          payload: {
            questionnaire: msg.questionnaire,
            rounds: msg.rounds,
            revealMode: msg.revealMode,
          },
        });
        dispatch({ type: 'SET_GAME_STATE', payload: GAME_STATES.IN_ROUND });
        navigation.navigate('PlayerRound');
      },
      onRoundStart: (msg) => {
        dispatch({ type: 'SET_CURRENT_ROUND', payload: msg.roundIndex });
        navigation.navigate('PlayerRound');
      },
      onRoundReveal: (msg) => {
        // Handled inside PlayerRoundScreen via context
      },
      onScore: (msg) => {
        navigation.navigate('PlayerResults', { score: msg.score, breakdown: msg.breakdown });
      },
      onGameResults: (msg) => {
        navigation.navigate('PlayerResults', { results: msg.allPlayerData });
      },
    });

    // After advertising starts, send join request
    await ble.sendJoinRequest(playerName.trim());
    setStatus(STATUS.WAITING);
  }

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <Text style={styles.heading}>Join a Game</Text>
      <Text style={styles.hint}>Make sure Bluetooth is on. Your device will advertise so the host can find you.</Text>

      <TextInput
        label="Your Name"
        placeholder="e.g. Sarah"
        value={playerName}
        onChangeText={setPlayerName}
        error={nameError}
        maxLength={30}
        autoFocus
        editable={status === STATUS.IDLE || status === STATUS.DENIED}
      />

      {status === STATUS.DENIED && (
        <View style={styles.deniedBanner}>
          <Text style={styles.deniedText}>The host didn't let you in. Try again or ask the host.</Text>
        </View>
      )}

      {status === STATUS.WAITING && (
        <View style={styles.waitingRow}>
          <ActivityIndicator color={COLORS.accent} />
          <Text style={styles.waitingText}>Request sent — waiting for host…</Text>
        </View>
      )}

      {status === STATUS.ADVERTISING && (
        <View style={styles.waitingRow}>
          <ActivityIndicator color={COLORS.accent} />
          <Text style={styles.waitingText}>Connecting…</Text>
        </View>
      )}

      {ble.bleError && (
        <Text style={styles.errorText}>{ble.bleError}</Text>
      )}

      <Button
        title="Request to Join"
        onPress={handleJoin}
        loading={status === STATUS.ADVERTISING || status === STATUS.WAITING}
        disabled={status === STATUS.ADVERTISING || status === STATUS.WAITING}
        style={styles.cta}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  waitingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  waitingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  deniedBanner: {
    backgroundColor: COLORS.backgroundElevated,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  deniedText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.md,
  },
  cta: {
    marginTop: SPACING.lg,
  },
});
