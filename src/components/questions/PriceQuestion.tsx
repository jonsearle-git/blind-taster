import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { PriceQuestion as PriceQ } from '../../types/questionnaire';

type Props = {
  question: PriceQ;
  value:    number | null;
  onChange: (value: number) => void;
  locked?:  boolean;
};

export function PriceQuestion({ question, value, onChange, locked = false }: Props): React.ReactElement {
  function handleChange(text: string): void {
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) onChange(parsed);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.row}>
        <View style={styles.symbol}>
          <Text style={styles.symbolText}>{question.currencySymbol}</Text>
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
          fontFamily={FontFamily.heading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  prompt: {
    fontFamily:  FontFamily.heading,
    color:       Colors.ink,
    fontSize:    FontSize.lg,
    fontWeight:  FontWeight.black,
    lineHeight:  FontSize.lg * 1.3,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'stretch',
  },
  symbol: {
    backgroundColor:        Colors.sun,
    borderWidth:            2.5,
    borderColor:            Colors.ink,
    borderRightWidth:       0,
    borderTopLeftRadius:    BorderRadius.sm,
    borderBottomLeftRadius: BorderRadius.sm,
    paddingHorizontal:      Spacing.md,
    alignItems:             'center',
    justifyContent:         'center',
    minHeight:              56,
  },
  symbolText: {
    fontFamily:  FontFamily.display,
    color:       Colors.ink,
    fontSize:    FontSize.xl,
    fontWeight:  FontWeight.black,
  },
  input: {
    flex:                    1,
    backgroundColor:         Colors.surface,
    borderWidth:             2.5,
    borderColor:             Colors.ink,
    borderTopRightRadius:    BorderRadius.sm,
    borderBottomRightRadius: BorderRadius.sm,
    paddingHorizontal:       Spacing.md,
    color:                   Colors.ink,
    fontSize:                FontSize.xl,
    fontWeight:              FontWeight.black,
    minHeight:               56,
    fontFamily:              FontFamily.heading,
  },
  locked: { opacity: 0.6 },
});
