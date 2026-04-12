import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { TextInput } from '../TextInput';

type Props = {
  min:      number;
  max:      number;
  step:     number;
  onChange: (fields: { min: number; max: number; step: number }) => void;
};

export function SliderBuilder({ min, max, step, onChange }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Range</Text>
      <View style={styles.row}>
        <TextInput
          label="Min"
          value={String(min)}
          onChangeText={(t) => onChange({ min: parseFloat(t) || 0, max, step })}
          keyboardType="numeric"
          containerStyle={styles.field}
        />
        <TextInput
          label="Max"
          value={String(max)}
          onChangeText={(t) => onChange({ min, max: parseFloat(t) || 0, step })}
          keyboardType="numeric"
          containerStyle={styles.field}
        />
        <TextInput
          label="Step"
          value={String(step)}
          onChangeText={(t) => onChange({ min, max, step: parseFloat(t) || 1 })}
          keyboardType="numeric"
          containerStyle={styles.field}
        />
      </View>
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
  row: {
    flexDirection: 'row',
    gap:           Spacing.sm,
  },
  field: {
    flex: 1,
  },
});
