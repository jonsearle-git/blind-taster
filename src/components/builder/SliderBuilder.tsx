import { StyleSheet, View, Text, Pressable } from 'react-native';
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
  const allowDecimals = step < 1;

  function toggleDecimals(): void {
    onChange({ min, max, step: allowDecimals ? 1 : 0.01 });
  }

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
      </View>

      <Pressable onPress={toggleDecimals} style={styles.checkRow} accessibilityRole="checkbox" accessibilityState={{ checked: allowDecimals }}>
        <View style={[styles.checkbox, allowDecimals && styles.checkboxChecked]}>
          {allowDecimals && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkLabel}>Allow decimals</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  label: {
    color:      Colors.textSecondary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  row:   { flexDirection: 'row', gap: Spacing.sm },
  field: { flex: 1 },

  checkRow: {
    flexDirection: 'row',
    alignItems:    'center',
    alignSelf:     'flex-start',
    gap:           Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  checkbox: {
    width:        22,
    height:       22,
    borderRadius: 4,
    borderWidth:  2,
    borderColor:  Colors.border,
    alignItems:   'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor:     Colors.primary,
  },
  checkmark: { color: Colors.textPrimary, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  checkLabel: { color: Colors.textPrimary, fontSize: FontSize.md },

});
