import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import { Question } from '../../types/questionnaire';
import { IconButton } from '../IconButton';

const TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.MultipleChoiceText]:   'Multiple Choice — Text',
  [QuestionType.MultipleChoiceNumber]: 'Multiple Choice — Number',
  [QuestionType.SliderNumber]:         'Slider / Number',
  [QuestionType.Tags]:                 'Tags',
  [QuestionType.Price]:                'Price',
};

type Props = {
  question: Question;
  index:    number;
  onEdit:   () => void;
  onRemove: (id: string) => void;
};

export function QuestionAccordionItem({ question, index, onEdit, onRemove }: Props): React.ReactElement {
  return (
    <Pressable
      onPress={onEdit}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}
      accessibilityRole="button"
      accessibilityLabel={`Edit question ${index + 1}: ${question.prompt || TYPE_LABELS[question.type]}`}
    >
      <View style={styles.left}>
        <Text style={styles.index}>Q{index + 1}</Text>
        <View style={styles.text}>
          <Text style={styles.typeLabel}>{TYPE_LABELS[question.type]}</Text>
          {question.prompt.trim().length > 0 && (
            <Text style={styles.promptPreview} numberOfLines={1}>{question.prompt}</Text>
          )}
        </View>
      </View>
      <IconButton
        icon="✕"
        onPress={() => onRemove(question.id)}
        color={Colors.error}
        accessibilityLabel={`Remove question ${index + 1}`}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.surface,
    borderRadius:    Spacing.sm,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         Spacing.md,
    gap:             Spacing.sm,
  },
  containerPressed: { backgroundColor: Colors.surfaceElevated },
  left: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  index:         { color: Colors.primary, fontSize: FontSize.sm, fontWeight: FontWeight.bold, minWidth: 28 },
  text:          { flex: 1, gap: 2 },
  typeLabel:     { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  promptPreview: { color: Colors.textSecondary, fontSize: FontSize.sm },
});
