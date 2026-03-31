import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useGame } from '../../context/GameContext';
import { useBle } from '../../context/BleContext';
import COLORS from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function HostResultsScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const { players, hasAnswers, questionnaire } = state;
  const { host: ble } = useBle();

  // Sort players by score descending if we have answers
  const sorted = hasAnswers
    ? [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    : players;

  function handlePlayAgain() {
    ble.disconnectAll();
    dispatch({ type: 'RESET' });
    navigation.navigate('Home');
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Game Over</Text>
      <Text style={styles.subheading}>{state.gameName}</Text>

      {hasAnswers ? (
        <>
          <Text style={styles.sectionTitle}>Scoreboard</Text>
          {sorted.map((player, index) => (
            <Card key={player.id} style={[styles.playerCard, index === 0 && styles.winnerCard]}>
              <View style={styles.rank}>
                <Text style={[styles.rankText, index === 0 && styles.rankTextWinner]}>
                  {index === 0 ? '🏆' : `#${index + 1}`}
                </Text>
              </View>
              <Text style={[styles.playerName, index === 0 && styles.playerNameWinner]}>
                {player.name}
              </Text>
              <Text style={[styles.score, index === 0 && styles.scoreWinner]}>
                {player.score ?? 0} pts
              </Text>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Collected Responses</Text>
          {players.map(player => (
            <Card key={player.id} style={styles.playerCard}>
              <Text style={styles.playerName}>{player.name}</Text>
              {questionnaire.map((q, qi) => (
                <View key={q.id} style={styles.answerRow}>
                  <Text style={styles.questionText}>Q{qi + 1}: {q.prompt}</Text>
                  <Text style={styles.answerText}>
                    {player.answers?.[qi]?.[q.id] ?? '—'}
                  </Text>
                </View>
              ))}
            </Card>
          ))}
        </>
      )}

      <Button title="Play Again" onPress={handlePlayAgain} style={styles.playAgainBtn} />
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
  subheading: {
    fontSize: FONT_SIZES.md,
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  winnerCard: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(201,151,58,0.08)',
  },
  rank: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  rankTextWinner: {
    fontSize: FONT_SIZES.lg,
  },
  playerName: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  playerNameWinner: {
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.accent,
  },
  score: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  scoreWinner: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.lg,
  },
  answerRow: {
    marginTop: SPACING.xs,
  },
  questionText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
  answerText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  playAgainBtn: {
    marginTop: SPACING.xl,
  },
});
