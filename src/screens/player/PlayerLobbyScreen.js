import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGame } from '../../context/GameContext';
import COLORS from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';

export default function PlayerLobbyScreen() {
  const { state } = useGame();
  const { localPlayerName, gameName } = state;

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.accent} style={styles.spinner} />
      <Text style={styles.name}>You're in, {localPlayerName}!</Text>
      {gameName ? <Text style={styles.game}>{gameName}</Text> : null}
      <Text style={styles.hint}>Waiting for the host to start the game…</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: SPACING.lg,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  game: {
    fontSize: FONT_SIZES.md,
    color: COLORS.accent,
    marginBottom: SPACING.md,
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
