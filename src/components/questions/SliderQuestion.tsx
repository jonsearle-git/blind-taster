import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import Slider from '@react-native-community/slider';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { SliderNumberQuestion as SliderQ } from '../../types/questionnaire';

type Props = {
  question: SliderQ;
  value: number | null;
  onChange: (value: number) => void;
  locked?: boolean;
};

export function SliderQuestion({ question, value, onChange, locked = false }: Props): React.ReactElement {
  const [inputText, setInputText] = useState(value !== null ? String(value) : '');

  const dp = question.step < 0.05 ? 2 : question.step < 0.5 ? 1 : 0;

  function snapToStep(v: number): number {
    return parseFloat((Math.round(v / question.step) * question.step).toFixed(dp));
  }

  function handleSliderChange(v: number): void {
    const snapped = snapToStep(v);
    setInputText(String(snapped));
    onChange(snapped);
  }

  function handleTextChange(text: string): void {
    setInputText(text);
    const parsed = parseFloat(text);
    if (!isNaN(parsed)) {
      const clamped = parseFloat(Math.min(Math.max(parsed, question.min), question.max).toFixed(dp));
      onChange(clamped);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.numberInput, locked && styles.locked]}
          value={inputText}
          onChangeText={handleTextChange}
          keyboardType={dp > 0 ? 'decimal-pad' : 'numeric'}
          editable={!locked}
          accessibilityLabel={`${question.prompt} value`}
          placeholderTextColor={Colors.textDisabled}
          placeholder={String(question.min)}
        />
        <Text style={styles.range}>
          {question.min} – {question.max}
        </Text>
      </View>

      <Slider
        minimumValue={question.min}
        maximumValue={question.max}
        step={question.step}
        value={value ?? question.min}
        onValueChange={handleSliderChange}
        disabled={locked}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.border}
        thumbTintColor={Colors.primaryLight}
        style={styles.slider}
        accessibilityLabel={`${question.prompt} slider`}
      />
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
    gap:           Spacing.md,
  },
  numberInput: {
    backgroundColor:  Colors.surface,
    borderWidth:      1,
    borderColor:      Colors.border,
    borderRadius:     Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    color:            Colors.textPrimary,
    fontSize:         FontSize.xl,
    fontWeight:       FontWeight.bold,
    minWidth:         90,
    textAlign:        'center',
  },
  locked: {
    opacity: 0.6,
  },
  range: {
    color:    Colors.textDisabled,
    fontSize: FontSize.sm,
  },
  slider: {
    width:  '100%',
    height: 40,
  },
});
