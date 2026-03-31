import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useGame } from '../context/GameContext';
import { HOST_MODES } from '../constants/gameConstants';
import COLORS from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';
import { APP_NAME } from '../constants/gameConstants';
import Button from '../components/Button';
import ScreenContainer from '../components/ScreenContainer';

export default function HomeScreen({ navigation }) {
  const { dispatch } = useGame();

  function handleHost() {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'SET_ROLE', payload: { isHost: true } });
    navigation.navigate('SetupGame');
  }

  function handleJoin() {
    dispatch({ type: 'RESET' });
    dispatch({ type: 'SET_ROLE', payload: { isHost: false } });
    navigation.navigate('JoinGame');
  }

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🍷</Text>
        </View>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>Blind testing, made social.</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Host a Game"
          onPress={handleHost}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="Join a Game"
          onPress={handleJoin}
          variant="outline"
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: SPACING.xxl,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  actions: {
    gap: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  button: {
    width: '100%',
  },
});
