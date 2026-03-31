import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useGame } from '../../context/GameContext';
import { PLAYER_STATES, GAME_STATES } from '../../constants/gameConstants';
import COLORS from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import { useBle } from '../../context/BleContext';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function HostLobbyScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const { gameName, questionnaire, rounds, revealMode, hostMode } = state;
  const { host: ble } = useBle();
  const bleRef = useRef(ble);
  bleRef.current = ble;

  const [pendingRequests, setPendingRequests] = useState([]); // [{ playerId, playerName }]
  const [acceptedPlayers, setAcceptedPlayers] = useState([]);

  useEffect(() => {
    if (!ble.bleReady) return;
    ble.startScanning({
      onJoinRequest: ({ playerId, playerName }) => {
        setPendingRequests(prev => {
          if (prev.find(p => p.playerId === playerId)) return prev;
          return [...prev, { playerId, playerName }];
        });
      },
      onPlayerAnswer: () => {}, // not needed in lobby
    });
    return () => ble.stopScanning();
  }, [ble.bleReady]);

  function handleAccept(request) {
    // Duplicate name check — fix #8
    const nameTaken = acceptedPlayers.some(
      p => p.name.toLowerCase() === request.playerName.toLowerCase()
    );
    if (nameTaken) {
      Alert.alert(
        'Name already taken',
        `There is already a player called "${request.playerName}". Ask them to rejoin with a different name.`,
        [{ text: 'OK' }]
      );
      return;
    }
    bleRef.current.acceptPlayer(request.playerId);
    setAcceptedPlayers(prev => [...prev, { id: request.playerId, name: request.playerName, state: PLAYER_STATES.ACCEPTED, answers: [], score: 0 }]);
    setPendingRequests(prev => prev.filter(p => p.playerId !== request.playerId));
    dispatch({ type: 'ADD_PLAYER', payload: { id: request.playerId, name: request.playerName, state: PLAYER_STATES.ACCEPTED, answers: [], score: 0 } });
  }

  function handleDeny(request) {
    bleRef.current.denyPlayer(request.playerId);
    setPendingRequests(prev => prev.filter(p => p.playerId !== request.playerId));
  }

  function handleStartGame() {
    if (acceptedPlayers.length === 0) {
      Alert.alert('No players', 'Accept at least one player before starting.');
      return;
    }
    ble.stopScanning();
    ble.startGame(questionnaire, rounds, revealMode, hostMode);
    dispatch({ type: 'SET_GAME_STATE', payload: GAME_STATES.IN_ROUND });
    navigation.navigate('RoundMonitor');
  }

  if (ble.bleError) {
    return (
      <ScreenContainer>
        <Text style={styles.errorText}>{ble.bleError}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.gameName}>{gameName}</Text>
        <View style={[styles.scanBadge, ble.scanning && styles.scanBadgeActive]}>
          <Text style={styles.scanBadgeText}>{ble.scanning ? '● Scanning…' : '○ Idle'}</Text>
        </View>
      </View>
      <Text style={styles.hint}>Players nearby can discover and join your game.</Text>

      {pendingRequests.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Requests</Text>
          {pendingRequests.map(req => (
            <Card key={req.playerId} style={styles.requestCard}>
              <Text style={styles.playerName}>{req.playerName}</Text>
              <View style={styles.requestActions}>
                <Button title="Accept" onPress={() => handleAccept(req)} style={styles.acceptBtn} />
                <Button title="Deny" onPress={() => handleDeny(req)} variant="danger" style={styles.denyBtn} />
              </View>
            </Card>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Players ({acceptedPlayers.length})</Text>
        {acceptedPlayers.length === 0
          ? <Text style={styles.empty}>Waiting for players to join…</Text>
          : (
            <FlatList
              data={acceptedPlayers}
              keyExtractor={p => p.id}
              renderItem={({ item }) => (
                <Card style={styles.playerCard}>
                  <Text style={styles.playerName}>{item.name}</Text>
                  <View style={styles.statusDot} />
                </Card>
              )}
              scrollEnabled={false}
            />
          )
        }
      </View>

      <Button
        title={`Start Game  (${acceptedPlayers.length} player${acceptedPlayers.length !== 1 ? 's' : ''})`}
        onPress={handleStartGame}
        disabled={acceptedPlayers.length === 0}
        style={styles.startBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  gameName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  scanBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundElevated,
  },
  scanBadgeActive: {
    backgroundColor: COLORS.primaryDark,
  },
  scanBadgeText: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.xs,
  },
  hint: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  requestCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  requestActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  acceptBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    minHeight: 0,
  },
  denyBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    minHeight: 0,
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  playerName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
  },
  empty: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
  },
  startBtn: {
    marginTop: 'auto',
    marginBottom: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});
