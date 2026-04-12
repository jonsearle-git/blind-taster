import { StyleSheet, View, Text } from 'react-native';
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
  options:  MultipleChoiceOption[];
  onChange: (options: MultipleChoiceOption[]) => void;
};

export function MultipleChoiceBuilder({ options, onChange }: Props): React.ReactElement {
  function addOption(): void {
    onChange([...options, { id: uuidv4(), label: '' }]);
  }

  function updateOption(id: string, label: string): void {
    onChange(options.map((o) => (o.id === id ? { ...o, label } : o)));
  }

  function removeOption(id: string): void {
    onChange(options.filter((o) => o.id !== id));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Options</Text>
      {options.map((option, index) => (
        <View key={option.id} style={styles.optionRow}>
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
  optionInput: {
    flex: 1,
  },
});
