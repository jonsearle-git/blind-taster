import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Tag } from '../../types/questionnaire';
import { TextInput } from '../TextInput';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  tags: Tag[];
  correctTagIds: string[];
  maxSelections: number | null;
  onChange: (tags: Tag[], correctTagIds: string[], maxSelections: number | null) => void;
};

export function TagsBuilder({ tags, correctTagIds, maxSelections, onChange }: Props): React.ReactElement {
  function addTag(): void {
    onChange([...tags, { id: uuidv4(), label: '' }], correctTagIds, maxSelections);
  }

  function updateTag(id: string, label: string): void {
    onChange(tags.map((t) => (t.id === id ? { ...t, label } : t)), correctTagIds, maxSelections);
  }

  function removeTag(id: string): void {
    onChange(
      tags.filter((t) => t.id !== id),
      correctTagIds.filter((cid) => cid !== id),
      maxSelections
    );
  }

  function toggleCorrect(id: string): void {
    const updated = correctTagIds.includes(id)
      ? correctTagIds.filter((cid) => cid !== id)
      : [...correctTagIds, id];
    onChange(tags, updated, maxSelections);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags (tap circle to mark correct)</Text>
      {tags.map((tag, index) => (
        <View key={tag.id} style={styles.tagRow}>
          <Pressable
            onPress={() => toggleCorrect(tag.id)}
            style={[styles.correctDot, correctTagIds.includes(tag.id) && styles.correctDotActive]}
            accessibilityLabel={`Mark tag ${index + 1} as correct`}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: correctTagIds.includes(tag.id) }}
          />
          <TextInput
            value={tag.label}
            onChangeText={(text) => updateTag(tag.id, text)}
            placeholder={`Tag ${index + 1}`}
            containerStyle={styles.tagInput}
          />
          <IconButton
            icon="✕"
            onPress={() => removeTag(tag.id)}
            color={Colors.error}
            accessibilityLabel={`Remove tag ${index + 1}`}
          />
        </View>
      ))}
      <Button label="Add Tag" onPress={addTag} variant="secondary" />

      <TextInput
        label="Max selections (leave blank for unlimited)"
        value={maxSelections !== null ? String(maxSelections) : ''}
        onChangeText={(t) => onChange(tags, correctTagIds, t === '' ? null : parseInt(t, 10) || null)}
        keyboardType="numeric"
        placeholder="Unlimited"
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
  tagRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  correctDot: {
    width:        22,
    height:       22,
    borderRadius: 4,
    borderWidth:  2,
    borderColor:  Colors.border,
    flexShrink:   0,
  },
  correctDotActive: {
    backgroundColor: Colors.success,
    borderColor:     Colors.success,
  },
  tagInput: {
    flex: 1,
  },
});
