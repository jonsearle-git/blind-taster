import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { QuestionResult as QuestionResultType } from '../../types/results';

type Props = {
  result: QuestionResultType;
};

export function QuestionResult({ result }: Props): React.ReactElement {
  const correct = result.pointsAwarded > 0;

  return (
    <View style={[styles.container, correct ? styles.correct : styles.incorrect]}>
      <View style={styles.header}>
        <Text style={styles.prompt}>{result.prompt}</Text>
        <View style={[styles.pointsBadge, { backgroundColor: correct ? Colors.mint : Colors.melon + '33' }]}>
          <Text style={[styles.points, { color: correct ? Colors.ink : Colors.melon }]}>
            {correct ? `+${result.pointsAwarded}` : '0'}
          </Text>
        </View>
      </View>

      <View style={styles.answers}>
        <AnswerLine label="Your answer" value={result.playerAnswerLabel} />
        <AnswerLine label="Correct" value={result.correctAnswerLabel} correct={correct} />
      </View>
    </View>
  );
}

type AnswerLineProps = {
  label:   string;
  value:   string;
  correct?: boolean;
};

function AnswerLine({ label, value, correct = false }: AnswerLineProps): React.ReactElement {
  return (
    <View style={styles.answerLine}>
      <Text style={styles.answerLabel}>{label}</Text>
      <Text style={[styles.answerValue, correct && styles.answerValueCorrect]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius:    BorderRadius.md,
    padding:         Spacing.md,
    gap:             Spacing.sm,
    borderLeftWidth: 8,
    backgroundColor: Colors.cream,
    borderWidth:     2.5,
    borderColor:     Colors.ink,
  },
  correct:   { borderLeftColor: Colors.mint },
  incorrect: { borderLeftColor: Colors.melon },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    gap:            Spacing.sm,
  },
  prompt: {
    flex:        1,
    fontFamily:  FontFamily.heading,
    color:       Colors.ink,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.black,
    lineHeight:  FontSize.sm * 1.3,
  },
  pointsBadge: {
    borderRadius:      BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   2,
    borderWidth:       2,
    borderColor:       Colors.ink,
  },
  points: {
    fontFamily:    FontFamily.heading,
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.black,
    letterSpacing: 0.3,
  },
  answers:    { gap: Spacing.xs, marginTop: Spacing.xs },
  answerLine: { gap: 4 },
  answerLabel: {
    fontFamily:    FontFamily.body,
    color:         Colors.ink,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity:       0.6,
  },
  answerValue: {
    fontFamily: FontFamily.body,
    color:      Colors.ink,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  answerValueCorrect: {
    fontFamily: FontFamily.heading,
    color:      Colors.melon,
    fontWeight: FontWeight.black,
  },
});
