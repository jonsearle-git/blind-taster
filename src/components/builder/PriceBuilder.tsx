import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { TextInput } from '../TextInput';

// Unicode currency symbols (Sc category) — covers all common currency glyphs.
const CURRENCY_SYMBOL_RE = /^\p{Sc}+$/u;

type Props = {
  currencySymbol: string;
  onChange:       (currencySymbol: string) => void;
};

export function PriceBuilder({ currencySymbol, onChange }: Props): React.ReactElement {
  function handleChange(text: string): void {
    if (text === '' || CURRENCY_SYMBOL_RE.test(text)) {
      onChange(text);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Currency</Text>
      <TextInput
        label="Currency Symbol"
        value={currencySymbol}
        onChangeText={handleChange}
        placeholder="£"
        containerStyle={styles.symbolField}
        maxLength={3}
      />
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
  symbolField: {
    width: 120,
  },
});
