import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { NumberInputQuestion as NumberInputQ } from '../../types/questionnaire';

type Props = {
  question: NumberInputQ;
  value:    number | null;
  onChange: (value: number) => void;
  locked?:  boolean;
};

export function NumberInputQuestion({ question, value, onChange, locked = false }: Props): React.ReactElement {
  const [text, setText] = useState(value !== null ? String(value) : '');

  function handleChange(input: string): void {
    const stripped = input.replace(/[^0-9]/g, '');
    setText(stripped);
    const parsed = parseInt(stripped, 10);
    if (!isNaN(parsed)) onChange(parsed);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, locked && styles.locked, !question.unit && styles.inputFull]}
          value={text}
          onChangeText={handleChange}
          keyboardType="number-pad"
          editable={!locked}
          placeholder={question.placeholder ?? '0'}
          placeholderTextColor={Colors.ink + '66'}
        />
        {question.unit && (
          <View style={styles.unit}>
            <Text style={styles.unitText}>{question.unit}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  prompt: {
    fontFamily: FontFamily.heading,
    color:      Colors.ink,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.black,
    lineHeight: FontSize.lg * 1.3,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'stretch',
  },
  input: {
    flex:                   1,
    backgroundColor:        Colors.cream,
    borderWidth:            2.5,
    borderColor:            Colors.ink,
    borderTopLeftRadius:    BorderRadius.sm,
    borderBottomLeftRadius: BorderRadius.sm,
    paddingHorizontal:      Spacing.md,
    color:                  Colors.ink,
    fontSize:               FontSize.xl,
    fontWeight:             FontWeight.black,
    minHeight:              56,
    fontFamily:             FontFamily.heading,
  },
  inputFull: {
    borderRadius: BorderRadius.sm,
  },
  unit: {
    backgroundColor:         Colors.sun,
    borderWidth:             2.5,
    borderColor:             Colors.ink,
    borderLeftWidth:         0,
    borderTopRightRadius:    BorderRadius.sm,
    borderBottomRightRadius: BorderRadius.sm,
    paddingHorizontal:       Spacing.md,
    alignItems:              'center',
    justifyContent:          'center',
    minHeight:               56,
  },
  unitText: {
    fontFamily: FontFamily.display,
    color:      Colors.ink,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.black,
  },
  locked: { opacity: 0.6 },
});
