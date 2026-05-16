import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
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
    <View style={[styles.shadowWrap, highlight && styles.shadowWrapHighlight]}>
      {highlight && <View style={styles.shadow} />}
      <View style={[styles.row, highlight && styles.highlighted]}>
        <View style={[styles.positionBadge, { backgroundColor: highlight ? Colors.melon : Colors.sun }]}>
          <Text style={[styles.position, { color: highlight ? Colors.cream : Colors.ink }]}>
            {positionLabel(result.position)}
          </Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>{result.player.name}</Text>
        <View style={styles.scoreBadge}>
          <Text style={styles.score}>{result.totalScore} pts</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap:          { position: 'relative' },
  shadowWrapHighlight: {},
  shadow:              { position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap:             Spacing.sm,
    borderRadius:    BorderRadius.md,
    borderWidth:     2.5,
    borderColor:     Colors.ink,
    backgroundColor: Colors.cream,
  },
  highlighted: {
    backgroundColor: Colors.mint,
  },
  positionBadge: {
    width:          36,
    height:         36,
    borderRadius:   BorderRadius.xs,
    borderWidth:    2,
    borderColor:    Colors.ink,
    alignItems:     'center',
    justifyContent: 'center',
  },
  position: {
    fontFamily:  FontFamily.display,
    fontSize:    FontSize.xs,
    fontWeight:  FontWeight.black,
  },
  name: {
    flex:        1,
    fontFamily:  FontFamily.heading,
    color:       Colors.ink,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.black,
  },
  scoreBadge: {
    backgroundColor:   Colors.mint,
    borderRadius:      BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   3,
    borderWidth:       2,
    borderColor:       Colors.ink,
  },
  score: {
    fontFamily:  FontFamily.heading,
    color:       Colors.ink,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.black,
  },
});
