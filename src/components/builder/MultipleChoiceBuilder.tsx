import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { MultipleChoiceOption } from '../../types/questionnaire';
import { TextInput } from '../TextInput';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  options: MultipleChoiceOption[];
  correctOptionId: string | null;
  onChange: (options: MultipleChoiceOption[], correctOptionId: string | null) => void;
};

export function MultipleChoiceBuilder({ options, correctOptionId, onChange }: Props): React.ReactElement {
  function addOption(): void {
    const newOption: MultipleChoiceOption = { id: uuidv4(), label: '' };
    onChange([...options, newOption], correctOptionId);
  }

  function updateOption(id: string, label: string): void {
    onChange(options.map((o) => (o.id === id ? { ...o, label } : o)), correctOptionId);
  }

  function removeOption(id: string): void {
    const updated = options.filter((o) => o.id !== id);
    const newCorrect = correctOptionId === id ? null : correctOptionId;
    onChange(updated, newCorrect);
  }

  function setCorrect(id: string): void {
    onChange(options, id);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Options</Text>
      {options.map((option, index) => (
        <View key={option.id} style={styles.optionRow}>
          <Pressable
            onPress={() => setCorrect(option.id)}
            style={[styles.correctDot, option.id === correctOptionId && styles.correctDotActive]}
            accessibilityLabel={`Mark option ${index + 1} as correct`}
            accessibilityRole="radio"
            accessibilityState={{ checked: option.id === correctOptionId }}
          />
          <TextInput
            value={option.label}
            onChangeText={(text) => updateOption(option.id, text)}
            placeholder={`Option ${index + 1}`}
            containerStyle={styles.optionInput}
          />
          <IconButton
            icon="✕"
            onPress={() => removeOption(option.id)}
            color={Colors.error}
            accessibilityLabel={`Remove option ${index + 1}`}
            disabled={options.length <= 2}
          />
        </View>
      ))}
      <Button label="Add Option" onPress={addOption} variant="secondary" />
      {correctOptionId === null && options.length > 0 && (
        <Text style={styles.hint}>Tap the circle to mark the correct answer</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  label: {
    color:      Colors.textSecondary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  correctDot: {
    width:        22,
    height:       22,
    borderRadius: 11,
    borderWidth:  2,
    borderColor:  Colors.border,
    flexShrink:   0,
  },
  correctDotActive: {
    backgroundColor: Colors.success,
    borderColor:     Colors.success,
  },
  optionInput: {
    flex: 1,
  },
  hint: {
    color:    Colors.textDisabled,
    fontSize: FontSize.xs,
  },
});
