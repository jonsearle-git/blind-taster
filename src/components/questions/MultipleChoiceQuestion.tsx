import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import {
  MultipleChoiceTextQuestion as TextQ,
  MultipleChoiceNumberQuestion as NumberQ,
} from '../../types/questionnaire';
import { Chip } from '../brand/Chip';

const OPTION_COLORS = [
  { bg: Colors.melon, text: Colors.cream },
  { bg: Colors.ocean, text: Colors.cream },
  { bg: Colors.mint,  text: Colors.ink  },
  { bg: Colors.sun,   text: Colors.ink  },
  { bg: Colors.plum,  text: Colors.cream },
] as const;

type Props = {
  question: TextQ | NumberQ;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  locked?: boolean;
};

export function MultipleChoiceQuestion({
  question,
  selectedOptionId,
  onSelect,
  locked = false,
}: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <View style={styles.options}>
        {question.options.map((option, i) => {
          const selected = selectedOptionId === option.id;
          const palette  = OPTION_COLORS[i % OPTION_COLORS.length];
          return (
            <Chip
              key={option.id}
              label={option.label}
              selected={selected}
              color={palette.bg}
              textColor={palette.text}
              onPress={locked ? undefined : () => onSelect(option.id)}
              style={styles.chip}
            />
          );
        })}
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
  options: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           Spacing.sm,
  },
  chip: {
    alignSelf: 'auto',
  },
});
