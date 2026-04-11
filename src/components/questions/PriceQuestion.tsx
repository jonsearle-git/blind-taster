import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { PriceQuestion as PriceQ } from '../../types/questionnaire';

type Props = {
  question: PriceQ;
  value: number | null;
  onChange: (value: number) => void;
  locked?: boolean;
};

export function PriceQuestion({ question, value, onChange, locked = false }: Props): React.ReactElement {
  function handleChange(text: string): void {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.inputRow}>
        <View style={styles.symbolWrapper}>
          <Text style={styles.symbol}>{question.currencySymbol}</Text>
        </View>
        <TextInput
          style={[styles.input, locked && styles.locked]}
          defaultValue={value !== null ? value.toFixed(2) : ''}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          editable={!locked}
          placeholder="0.00"
          placeholderTextColor={Colors.textDisabled}
          accessibilityLabel={`${question.prompt} price in ${question.currencySymbol}`}
        />
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
  inputRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  symbolWrapper: {
    backgroundColor:  Colors.surfaceElevated,
    borderWidth:      1,
    borderColor:      Colors.border,
    borderRightWidth: 0,
    borderTopLeftRadius:    Spacing.sm,
    borderBottomLeftRadius: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    minHeight:         48,
    alignItems:        'center',
    justifyContent:    'center',
  },
  symbol: {
    color:      Colors.textSecondary,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  input: {
    flex:             1,
    backgroundColor:  Colors.surface,
    borderWidth:      1,
    borderColor:      Colors.border,
    borderTopRightRadius:    Spacing.sm,
    borderBottomRightRadius: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    color:            Colors.textPrimary,
    fontSize:         FontSize.lg,
    fontWeight:       FontWeight.bold,
    minHeight:        48,
  },
  locked: {
    opacity: 0.6,
  },
});
