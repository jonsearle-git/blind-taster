import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import { Question } from '../../types/questionnaire';

const TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.MultipleChoiceText]:   'Multiple Choice — Text',
  [QuestionType.MultipleChoiceNumber]: 'Multiple Choice — Number',
  [QuestionType.SliderNumber]:         'Slider / Number',
  [QuestionType.Tags]:                 'Tags',
  [QuestionType.Price]:                'Price',
};

const TILE_COLORS = [Colors.melon, Colors.sun, Colors.mint, Colors.ocean, Colors.plum] as const;
const TILE_TEXT   = [Colors.cream, Colors.ink, Colors.ink, Colors.cream, Colors.cream] as const;

type Props = {
  question: Question;
  index:    number;
  onEdit:   () => void;
  onRemove: (id: string) => void;
};

export function QuestionAccordionItem({ question, index, onEdit, onRemove }: Props): React.ReactElement {
  const tileColor = TILE_COLORS[index % TILE_COLORS.length];
  const tileText  = TILE_TEXT[index % TILE_TEXT.length];

  return (
    <View style={styles.shadowWrap}>
      <View style={styles.shadow} />
      <View style={styles.container}>
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [styles.main, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Edit question ${index + 1}: ${question.prompt || TYPE_LABELS[question.type]}`}
        >
          <View style={[styles.tile, { backgroundColor: tileColor }]}>
            <Text style={[styles.tileText, { color: tileText }]}>Q{index + 1}</Text>
          </View>
          <View style={styles.text}>
            <Text style={styles.typeLabel}>{TYPE_LABELS[question.type]}</Text>
            {question.prompt.trim().length > 0 && (
              <Text style={styles.promptPreview} numberOfLines={1}>{question.prompt}</Text>
            )}
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <Pressable
          onPress={() => onRemove(question.id)}
          style={styles.removeBtn}
          accessibilityRole="button"
          accessibilityLabel={`Remove question ${index + 1}`}
        >
          <Text style={styles.removeBtnText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap:    { position: 'relative' },
  shadow:        { position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  container:     { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.cream, borderRadius: BorderRadius.md, borderWidth: 2.5, borderColor: Colors.ink, overflow: 'hidden' },
  main:          { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, padding: Spacing.sm },
  pressed:       { opacity: 0.7 },
  tile:          { width: 40, height: 40, borderRadius: BorderRadius.xs, borderWidth: 2, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tileText:      { fontFamily: FontFamily.display, fontSize: FontSize.sm, fontWeight: FontWeight.black },
  text:          { flex: 1, gap: 3, paddingTop: 2 },
  typeLabel:     { fontFamily: FontFamily.body, color: Colors.ink, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.55 },
  promptPreview: { fontFamily: FontFamily.heading, color: Colors.ink, fontSize: FontSize.sm, fontWeight: FontWeight.bold, lineHeight: FontSize.sm * 1.25 },
  chevron:       { color: Colors.textDisabled, fontSize: FontSize.xl, paddingRight: Spacing.xs, alignSelf: 'center' },
  removeBtn:     { padding: Spacing.md, borderLeftWidth: 1.5, borderLeftColor: Colors.ink + '33' },
  removeBtnText: { color: Colors.melon, fontSize: FontSize.md },
});
