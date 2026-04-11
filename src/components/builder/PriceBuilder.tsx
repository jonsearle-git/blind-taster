import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { TextInput } from '../TextInput';

type Props = {
  currencySymbol: string;
  correctValue: number | null;
  onChange: (currencySymbol: string, correctValue: number | null) => void;
};

export function PriceBuilder({ currencySymbol, correctValue, onChange }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Price Settings</Text>
      <View style={styles.row}>
        <TextInput
          label="Currency Symbol"
          value={currencySymbol}
          onChangeText={(t) => onChange(t, correctValue)}
          placeholder="£"
          containerStyle={styles.symbolField}
          maxLength={3}
        />
        <TextInput
          label="Correct Answer"
          value={correctValue !== null ? String(correctValue) : ''}
          onChangeText={(t) => onChange(currencySymbol, parseFloat(t) || null)}
          keyboardType="decimal-pad"
          placeholder="0.00"
          containerStyle={styles.valueField}
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
  symbolField: {
    width: 100,
  },
  valueField: {
    flex: 1,
  },
});
