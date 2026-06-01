import { StyleSheet, View, Text, TextInput } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { TextInputQuestion as TextInputQ } from '../../types/questionnaire';

type Props = {
  question: TextInputQ;
  value:    string;
  onChange: (value: string) => void;
  locked?:  boolean;
};

export function TextInputQuestion({ question, value, onChange, locked = false }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <TextInput
        style={[styles.input, locked && styles.locked]}
        value={value}
        onChangeText={onChange}
        editable={!locked}
        placeholder={question.placeholder ?? 'Type your answer…'}
        placeholderTextColor={Colors.ink + '66'}
        returnKeyType="done"
        autoCapitalize="words"
      />
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
  input: {
    backgroundColor:   Colors.cream,
    borderWidth:       2.5,
    borderColor:       Colors.ink,
    borderRadius:      BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    color:             Colors.ink,
    fontSize:          FontSize.md,
    fontWeight:        FontWeight.medium,
    minHeight:         56,
    fontFamily:        FontFamily.body,
    shadowColor:       Colors.ink,
    shadowOffset:      { width: 2, height: 2 },
    shadowOpacity:     1,
    shadowRadius:      0,
    elevation:         2,
  },
  locked: { opacity: 0.6 },
});
