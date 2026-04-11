import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { TagsQuestion as TagsQ } from '../../types/questionnaire';

type Props = {
  question: TagsQ;
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
  locked?: boolean;
};

export function TagsQuestion({ question, selectedTagIds, onToggle, locked = false }: Props): React.ReactElement {
  const atLimit =
    question.maxSelections !== null && selectedTagIds.length >= question.maxSelections;

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      {question.maxSelections !== null && (
        <Text style={styles.hint}>
          Select up to {question.maxSelections} ({selectedTagIds.length} chosen)
        </Text>
      )}
      <View style={styles.tagGrid}>
        {question.tags.map((tag) => {
          const selected = selectedTagIds.includes(tag.id);
          const disabled = locked || (!selected && atLimit);
          return (
            <Pressable
              key={tag.id}
              onPress={() => !disabled && onToggle(tag.id)}
              style={[
                styles.tag,
                selected && styles.tagSelected,
                disabled && !selected && styles.tagDisabled,
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected, disabled }}
              accessibilityLabel={tag.label}
            >
              <Text style={[styles.tagLabel, selected && styles.tagLabelSelected]}>
                {tag.label}
              </Text>
            </Pressable>
          );
        })}
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
  hint: {
    color:    Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           Spacing.sm,
  },
  tag: {
    backgroundColor:  Colors.surface,
    borderWidth:      1,
    borderColor:      Colors.border,
    borderRadius:     Spacing.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
  },
  tagSelected: {
    backgroundColor: Colors.primaryDark,
    borderColor:     Colors.primary,
  },
  tagDisabled: {
    opacity: 0.4,
  },
  tagLabel: {
    color:    Colors.textPrimary,
    fontSize: FontSize.sm,
  },
  tagLabelSelected: {
    fontWeight: FontWeight.bold,
  },
});
