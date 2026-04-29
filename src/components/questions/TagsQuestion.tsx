import { StyleSheet, View, Text, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { TagsQuestion as TagsQ } from '../../types/questionnaire';
import { Chip } from '../brand/Chip';

type Props = {
  question: TagsQ;
  tags:     string[];
  onChange: (tags: string[]) => void;
  locked?:  boolean;
};

export function TagsQuestion({ question, tags, onChange, locked = false }: Props): React.ReactElement {
  const [input, setInput] = useState('');

  function handleAdd(): void {
    const trimmed = input.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed]);
    setInput('');
  }

  function handleRemove(tag: string): void {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      {!locked && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAdd}
            placeholder="Type a note and press Add…"
            placeholderTextColor={Colors.textDisabled}
            returnKeyType="done"
            blurOnSubmit={false}
          />
          <Pressable onPress={handleAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>
      )}

      {tags.length > 0 && (
        <View style={styles.chips}>
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selected
              color={Colors.plum}
              textColor={Colors.cream}
              onRemove={locked ? undefined : () => handleRemove(tag)}
            />
          ))}
        </View>
      )}

      {tags.length === 0 && locked && (
        <Text style={styles.empty}>No notes added.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  prompt:    {
    fontFamily: FontFamily.heading,
    color:      Colors.ink,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.black,
  },
  inputRow: { flexDirection: 'row', gap: Spacing.sm },
  input: {
    flex:              1,
    backgroundColor:   Colors.surface,
    borderWidth:       2.5,
    borderColor:       Colors.border,
    borderRadius:      BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    color:             Colors.textPrimary,
    fontSize:          FontSize.md,
    fontWeight:        FontWeight.medium,
    minHeight:         52,
    fontFamily:        FontFamily.body,
  },
  addButton: {
    backgroundColor:   Colors.melon,
    borderRadius:      BorderRadius.md,
    paddingHorizontal: Spacing.md,
    justifyContent:    'center',
    alignItems:        'center',
    borderWidth:       2.5,
    borderColor:       Colors.ink,
    minHeight:         52,
  },
  addButtonText: {
    fontFamily:  FontFamily.bodyBold,
    color:       Colors.cream,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.bold,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  empty: {
    fontFamily: FontFamily.body,
    color:      Colors.textDisabled,
    fontSize:   FontSize.sm,
  },
});
