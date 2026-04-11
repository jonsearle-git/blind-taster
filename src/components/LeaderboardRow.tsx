import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { PlayerResult } from '../types/results';

type Props = {
  result: PlayerResult;
  highlight?: boolean;
};

const POSITION_LABELS: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd' };

function positionLabel(position: number): string {
  return POSITION_LABELS[position] ?? `${position}th`;
}

export function LeaderboardRow({ result, highlight = false }: Props): React.ReactElement {
  return (
    <View style={[styles.row, highlight && styles.highlighted]}>
      <Text style={[styles.position, highlight && styles.highlightedText]}>
        {positionLabel(result.position)}
      </Text>
      <Text style={[styles.name, highlight && styles.highlightedText]} numberOfLines={1}>
        {result.player.name}
      </Text>
      <Text style={[styles.score, highlight && styles.highlightedScore]}>
        {result.totalScore} pts
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap:             Spacing.sm,
  },
  highlighted: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius:    Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  position: {
    color:      Colors.textSecondary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.bold,
    width:      36,
  },
  name: {
    flex:       1,
    color:      Colors.textPrimary,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.medium,
  },
  score: {
    color:      Colors.gold,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.bold,
  },
  highlightedText: {
    color: Colors.textPrimary,
  },
  highlightedScore: {
    color: Colors.goldLight,
  },
});
