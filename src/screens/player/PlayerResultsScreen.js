import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGame } from '../../context/GameContext';
import { useBle } from '../../context/BleContext';
import COLORS from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function PlayerResultsScreen({ navigation, route }) {
  const { state, dispatch } = useGame();
  const { player: ble } = useBle();
  const { score, breakdown, results } = route.params ?? {};
  const { localPlayerName, questionnaire, hasAnswers } = state;

  function handleDone() {
    ble.disconnect();
    dispatch({ type: 'RESET' });
    navigation.navigate('Home');
  }

  const hasScore = score !== undefined;

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Results</Text>
      <Text style={styles.name}>{localPlayerName}</Text>

      {hasScore ? (
        <>
          <View style={styles.scoreBig}>
            <Text style={styles.scoreLabel}>YOUR SCORE</Text>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreUnit}>points</Text>
          </View>

          {breakdown && questionnaire.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Breakdown</Text>
              {questionnaire.map((q, i) => {
                const pts = breakdown[q.id];
                return (
                  <Card key={q.id} style={styles.breakdownRow}>
                    <Text style={styles.breakdownQ}>Q{i + 1}: {q.prompt}</Text>
                    <Text style={[styles.breakdownPts, pts > 0 ? styles.correct : styles.wrong]}>
                      {pts === null || pts === undefined ? '—' : `+${pts}`}
                    </Text>
                  </Card>
                );
              })}
            </>
          )}
        </>
      ) : (
        <Card style={styles.noScoreCard}>
          <Text style={styles.noScoreText}>
            The host didn't set correct answers — your responses have been recorded.
          </Text>
        </Card>
      )}

      <Button title="Done" onPress={handleDone} style={styles.doneBtn} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  scoreBig: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  scoreLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.accent,
    lineHeight: 80,
  },
  scoreUnit: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  breakdownQ: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    flex: 1,
    paddingRight: SPACING.sm,
  },
  breakdownPts: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  correct: {
    color: COLORS.success,
  },
  wrong: {
    color: COLORS.textMuted,
  },
  noScoreCard: {
    marginBottom: SPACING.lg,
  },
  noScoreText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  doneBtn: {
    marginTop: SPACING.xl,
  },
});
