import { StyleSheet, View, Text } from 'react-native';
import { QuestionType } from '../../constants/gameConstants';
import type { Question } from '../../types/questionnaire';
import type { Answer } from '../../types/answer';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { SliderQuestion } from './SliderQuestion';
import { TagsQuestion } from './TagsQuestion';
import { PriceQuestion } from './PriceQuestion';

type Props = {
  question: Question;
  answer:   Answer | null;
  onAnswer: (answer: Answer) => void;
  error?:   string;
};

export function QuestionInput({ question, answer, onAnswer, error }: Props): React.ReactElement {
  let inner: React.ReactElement = <></>;
  switch (question.type) {
    case QuestionType.MultipleChoiceText: {
      const selectedId = answer?.type === QuestionType.MultipleChoiceText ? answer.selectedOptionId : null;
      inner = (
        <MultipleChoiceQuestion
          question={question}
          selectedOptionId={selectedId}
          onSelect={(id) => onAnswer({ questionId: question.id, type: QuestionType.MultipleChoiceText, selectedOptionId: id })}
        />
      );
      break;
    }
    case QuestionType.MultipleChoiceNumber: {
      const selectedId = answer?.type === QuestionType.MultipleChoiceNumber ? answer.selectedOptionId : null;
      inner = (
        <MultipleChoiceQuestion
          question={question}
          selectedOptionId={selectedId}
          onSelect={(id) => onAnswer({ questionId: question.id, type: QuestionType.MultipleChoiceNumber, selectedOptionId: id })}
        />
      );
      break;
    }
    case QuestionType.SliderNumber: {
      const value = answer?.type === QuestionType.SliderNumber ? answer.value : null;
      inner = (
        <SliderQuestion
          question={question}
          value={value}
          onChange={(v) => onAnswer({ questionId: question.id, type: QuestionType.SliderNumber, value: v })}
        />
      );
      break;
    }
    case QuestionType.Tags: {
      const tags = answer?.type === QuestionType.Tags ? answer.tags : [];
      inner = (
        <TagsQuestion
          question={question}
          tags={tags}
          onChange={(next) => onAnswer({ questionId: question.id, type: QuestionType.Tags, tags: next })}
        />
      );
      break;
    }
    case QuestionType.Price: {
      const value = answer?.type === QuestionType.Price ? answer.value : null;
      inner = (
        <PriceQuestion
          question={question}
          value={value}
          onChange={(v) => onAnswer({ questionId: question.id, type: QuestionType.Price, value: v })}
        />
      );
      break;
    }
  }

  return (
    <View style={styles.cardWrapper}>
      <View style={styles.cardShadow} />
      <View style={[styles.card, error !== undefined && styles.cardError]}>
        {inner}
        {error !== undefined && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: { position: 'relative' },
  cardShadow:  { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  card:        { backgroundColor: Colors.surface, borderWidth: 2.5, borderColor: Colors.border, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm },
  cardError:   { borderColor: Colors.error },
  error:       { color: Colors.error, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
