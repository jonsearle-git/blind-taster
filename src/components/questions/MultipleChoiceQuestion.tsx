import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import {
  MultipleChoiceTextQuestion as TextQ,
  MultipleChoiceNumberQuestion as NumberQ,
} from '../../types/questionnaire';
import {
  MultipleChoiceTextAnswer,
  MultipleChoiceNumberAnswer,
} from '../../types/answer';

type Props = {
  question: TextQ | NumberQ;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  locked?: boolean;
};

export function MultipleChoiceQuestion({
  question,
  selectedOptionId,
  onSelect,
  locked = false,
}: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.options}>
        {question.options.map((option) => {
          const selected = selectedOptionId === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => !locked && onSelect(option.id)}
              style={[styles.option, selected && styles.optionSelected]}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled: locked }}
              accessibilityLabel={option.label}
            >
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  prompt: {
    color:      Colors.textPrimary,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.medium,
  },
  options: {
    gap: Spacing.sm,
  },
  option: {
    backgroundColor:  Colors.surface,
    borderWidth:      1,
    borderColor:      Colors.border,
    borderRadius:     Spacing.sm,
    paddingVertical:  Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  optionSelected: {
    borderColor:     Colors.primary,
    backgroundColor: Colors.primaryDark,
  },
  optionLabel: {
    color:    Colors.textPrimary,
    fontSize: FontSize.md,
  },
  optionLabelSelected: {
    fontWeight: FontWeight.bold,
  },
});
