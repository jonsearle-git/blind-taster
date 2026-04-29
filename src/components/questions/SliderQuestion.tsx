import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { SliderNumberQuestion as SliderQ } from '../../types/questionnaire';
import { RatingSlider } from '../brand/RatingSlider';

type Props = {
  question: SliderQ;
  value:    number | null;
  onChange: (value: number) => void;
  locked?:  boolean;
};

export function SliderQuestion({ question, value, onChange, locked = false }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <RatingSlider
        min={question.min}
        max={question.max}
        step={question.step}
        value={value}
        onChange={onChange}
        minLabel={String(question.min)}
        maxLabel={String(question.max)}
        locked={locked}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  prompt:    {
    fontFamily: FontFamily.heading,
    color:      Colors.ink,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.black,
  },
});
