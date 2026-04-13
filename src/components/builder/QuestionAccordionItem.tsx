import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import {
  Question,
  MultipleChoiceTextQuestion, MultipleChoiceNumberQuestion,
  SliderNumberQuestion, TagsQuestion, PriceQuestion,
} from '../../types/questionnaire';
import { IconButton } from '../IconButton';
import { TextInput } from '../TextInput';
import { MultipleChoiceBuilder } from './MultipleChoiceBuilder';
import { SliderBuilder } from './SliderBuilder';
import { TagsBuilder } from './TagsBuilder';
import { PriceBuilder } from './PriceBuilder';

const TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.MultipleChoiceText]:   'Multiple Choice — Text',
  [QuestionType.MultipleChoiceNumber]: 'Multiple Choice — Number',
  [QuestionType.SliderNumber]:         'Slider / Number',
  [QuestionType.Tags]:                 'Tags',
  [QuestionType.Price]:                'Price',
};

type Props = {
  question:   Question;
  index:      number;
  expanded:   boolean;
  onToggle:   () => void;
  onUpdate:   (q: Question) => void;
  onRemove:   (id: string) => void;
  hideHeader?: boolean;
};

export function QuestionAccordionItem({ question, index, expanded, onToggle, onUpdate, onRemove, hideHeader = false }: Props): React.ReactElement {
  return (
    <View style={hideHeader ? undefined : styles.container}>
      {!hideHeader && <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Question ${index + 1}: ${question.prompt || TYPE_LABELS[question.type]}`}
        accessibilityState={{ expanded }}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.index}>Q{index + 1}</Text>
          <View style={styles.headerText}>
            <Text style={styles.typeLabel}>{TYPE_LABELS[question.type]}</Text>
            {question.prompt.trim().length > 0 && (
              <Text style={styles.promptPreview} numberOfLines={1}>{question.prompt}</Text>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon="✕"
            onPress={() => onRemove(question.id)}
            color={Colors.error}
            accessibilityLabel={`Remove question ${index + 1}`}
          />
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </Pressable>}

      {(expanded || hideHeader) && (
        <View style={[styles.body, hideHeader && styles.bodyNoSeparator]}>
          <TextInput
            label="Question"
            value={question.prompt}
            onChangeText={(p) => onUpdate({ ...question, prompt: p } as Question)}
            placeholder="What is the question?"
          />
          {(question.type === QuestionType.MultipleChoiceText || question.type === QuestionType.MultipleChoiceNumber) && (
            <MultipleChoiceBuilder
              options={(question as MultipleChoiceTextQuestion | MultipleChoiceNumberQuestion).options}
              onChange={(opts) => onUpdate({ ...question, options: opts } as Question)}
            />
          )}
          {question.type === QuestionType.SliderNumber && (
            <SliderBuilder
              min={(question as SliderNumberQuestion).min}
              max={(question as SliderNumberQuestion).max}
              step={(question as SliderNumberQuestion).step}
              onChange={(f) => onUpdate({ ...question, ...f } as SliderNumberQuestion)}
            />
          )}
          {question.type === QuestionType.Tags && (
            <TagsBuilder
              tags={(question as TagsQuestion).tags}
              maxSelections={(question as TagsQuestion).maxSelections}
              onChange={(t, m) => onUpdate({ ...question, tags: t, maxSelections: m } as TagsQuestion)}
            />
          )}
          {question.type === QuestionType.Price && (
            <PriceBuilder
              currencySymbol={(question as PriceQuestion).currencySymbol}
              onChange={(sym) => onUpdate({ ...question, currencySymbol: sym } as PriceQuestion)}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius:    Spacing.sm,
    overflow:        'hidden',
    borderWidth:     1,
    borderColor:     Colors.border,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        Spacing.md,
  },
  headerPressed: { backgroundColor: Colors.surfaceElevated },
  headerLeft: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  index: {
    color:      Colors.primary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.bold,
    minWidth:   28,
  },
  headerText:    { flex: 1, gap: 2 },
  typeLabel:     { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  promptPreview: { color: Colors.textSecondary, fontSize: FontSize.sm },
  headerRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.xs,
  },
  chevron: { color: Colors.textSecondary, fontSize: FontSize.sm },
  body: {
    padding:        Spacing.md,
    gap:            Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bodyNoSeparator: {
    borderTopWidth: 0,
    padding:        0,
  },
});
