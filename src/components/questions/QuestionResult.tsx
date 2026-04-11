import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import { QuestionResult as QuestionResultType } from '../../types/results';
import {
  MultipleChoiceTextAnswer,
  MultipleChoiceNumberAnswer,
  SliderNumberAnswer,
  TagsAnswer,
  PriceAnswer,
} from '../../types/answer';

type Props = {
  result: QuestionResultType;
};

export function QuestionResult({ result }: Props): React.ReactElement {
  const correct = result.pointsAwarded > 0;

  return (
    <View style={[styles.container, correct ? styles.correct : styles.incorrect]}>
      <View style={styles.header}>
        <Text style={styles.prompt}>{result.prompt}</Text>
        <Text style={[styles.points, correct ? styles.pointsCorrect : styles.pointsWrong]}>
          {correct ? `+${result.pointsAwarded}` : '0'}
        </Text>
      </View>

      <View style={styles.answers}>
        <AnswerLine label="Your answer" answer={result.playerAnswer} />
        <AnswerLine label="Correct answer" answer={result.correctAnswer} correct />
      </View>
    </View>
  );
}

type AnswerLineProps = {
  label: string;
  answer: QuestionResultType['playerAnswer'];
  correct?: boolean;
};

function AnswerLine({ label, answer, correct = false }: AnswerLineProps): React.ReactElement {
  return (
    <View style={styles.answerLine}>
      <Text style={styles.answerLabel}>{label}:</Text>
      <Text style={[styles.answerValue, correct && styles.answerValueCorrect]}>
        {formatAnswer(answer)}
      </Text>
    </View>
  );
}

function formatAnswer(answer: QuestionResultType['playerAnswer']): string {
  switch (answer.type) {
    case QuestionType.MultipleChoiceText:
    case QuestionType.MultipleChoiceNumber:
      return (answer as MultipleChoiceTextAnswer | MultipleChoiceNumberAnswer).selectedOptionId;
    case QuestionType.SliderNumber:
      return String((answer as SliderNumberAnswer).value);
    case QuestionType.Tags:
      return (answer as TagsAnswer).selectedTagIds.join(', ');
    case QuestionType.Price:
      return `${(answer as PriceAnswer).value.toFixed(2)}`;
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius:    Spacing.sm,
    padding:         Spacing.md,
    gap:             Spacing.sm,
    borderLeftWidth: 3,
    backgroundColor: Colors.surface,
  },
  correct: {
    borderLeftColor: Colors.success,
  },
  incorrect: {
    borderLeftColor: Colors.error,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
    gap:            Spacing.sm,
  },
  prompt: {
    flex:       1,
    color:      Colors.textPrimary,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.medium,
  },
  points: {
    fontSize:   FontSize.md,
    fontWeight: FontWeight.bold,
  },
  pointsCorrect: {
    color: Colors.success,
  },
  pointsWrong: {
    color: Colors.textDisabled,
  },
  answers: {
    gap: Spacing.xs,
  },
  answerLine: {
    flexDirection: 'row',
    gap:           Spacing.sm,
  },
  answerLabel: {
    color:    Colors.textSecondary,
    fontSize: FontSize.sm,
    minWidth: 100,
  },
  answerValue: {
    color:    Colors.textPrimary,
    fontSize: FontSize.sm,
    flex:     1,
  },
  answerValueCorrect: {
    color:      Colors.success,
    fontWeight: FontWeight.bold,
  },
});
