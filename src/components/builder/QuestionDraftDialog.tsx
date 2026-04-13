import {
  StyleSheet, View, Text, Modal, ScrollView, Keyboard, Pressable,
  TextInput as RNTextInput, useWindowDimensions,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import {
  Question,
  MultipleChoiceTextQuestion, MultipleChoiceNumberQuestion,
  SliderNumberQuestion, TagsQuestion, PriceQuestion,
} from '../../types/questionnaire';
import { TextInput } from '../TextInput';
import { Button } from '../Button';
import { ErrorMessage } from '../ErrorMessage';
import { MultipleChoiceBuilder } from './MultipleChoiceBuilder';
import { MultipleChoiceNumberBuilder } from './MultipleChoiceNumberBuilder';
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

function makeDefault(type: QuestionType): Question {
  const id = uuidv4();
  switch (type) {
    case QuestionType.MultipleChoiceText:
      return { id, type, prompt: '', options: [{ id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }] };
    case QuestionType.MultipleChoiceNumber:
      return { id, type, prompt: '', options: [{ id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }] };
    case QuestionType.SliderNumber:
      return { id, type, prompt: '', min: 0, max: 100, step: 1 };
    case QuestionType.Tags:
      return { id, type, prompt: '', tags: [], maxSelections: null };
    case QuestionType.Price:
      return { id, type, prompt: '', currencySymbol: '£' };
  }
}

function validate(q: Question): string | null {
  if (!q.prompt.trim()) return 'Question is missing a prompt.';
  if (q.type === QuestionType.MultipleChoiceText || q.type === QuestionType.MultipleChoiceNumber) {
    if (q.options.length < 2) return 'Add at least 2 options.';
    if (q.options.some((o) => !o.label.trim())) return 'All options need a label.';
  }
  if (q.type === QuestionType.SliderNumber) {
    if ((q as SliderNumberQuestion).min >= (q as SliderNumberQuestion).max) return 'Min must be less than max.';
  }
  if (q.type === QuestionType.Tags) {
    const tq = q as TagsQuestion;
    if (tq.tags.length === 0) return 'Add at least one tag.';
    if (tq.tags.some((t) => !t.label.trim())) return 'All tags need a label.';
  }
  return null;
}

type Props = {
  draftType:    QuestionType | null;
  editQuestion: Question | null;
  onConfirm:    (q: Question) => void;
  onCancel:     () => void;
};

export function QuestionDraftDialog({ draftType, editQuestion, onConfirm, onCancel }: Props): React.ReactElement {
  const { height: windowHeight }          = useWindowDimensions();
  const [draft, setDraft]                 = useState<Question>(() => makeDefault(QuestionType.MultipleChoiceText));
  const [error, setError]                 = useState<string | null>(null);
  const [scrollPadding, setScrollPadding] = useState<number>(Spacing.xl);
  const scrollRef                         = useRef<ScrollView>(null);
  const scrollAreaRef                     = useRef<View>(null);
  const scrollOffset                      = useRef(0);
  const keyboardTopRef                    = useRef(0); // top of keyboard on screen

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      const kbTop = e.endCoordinates.screenY;
      keyboardTopRef.current = kbTop;

      // Measure how much the keyboard overlaps the scroll area to set correct paddingBottom.
      // This lets scrollToEnd land correctly when options are added.
      scrollAreaRef.current?.measure((_x, _y, _w, svH, _px, svPy) => {
        const svBottom = svPy + svH;
        const overlap  = Math.max(0, svBottom - kbTop);
        setScrollPadding(overlap + Spacing.xl);
      });

      // Scroll focused input into view
      setTimeout(() => {
        const focused = RNTextInput.State.currentlyFocusedInput();
        if (!focused) return;
        focused.measure((_x, _y, _w, h, _px, py) => {
          const inputBottom = py + h + Spacing.md;
          if (inputBottom > kbTop) {
            scrollRef.current?.scrollTo({
              y: scrollOffset.current + (inputBottom - kbTop),
              animated: true,
            });
          }
        });
      }, 50);
    });

    const hide = Keyboard.addListener('keyboardDidHide', () => {
      keyboardTopRef.current = 0;
      setScrollPadding(Spacing.xl);
    });

    return () => { show.remove(); hide.remove(); };
  }, []);

  useEffect(() => {
    if (draftType !== null) { setDraft(makeDefault(draftType)); setError(null); }
  }, [draftType]);

  useEffect(() => {
    if (editQuestion !== null) { setDraft(editQuestion); setError(null); }
  }, [editQuestion]);

  const optionCount = 'options' in draft ? (draft as { options: unknown[] }).options.length : 0;
  const tagCount    = 'tags'    in draft ? (draft as { tags: unknown[] }).tags.length       : 0;

  useEffect(() => {
    if (optionCount > 0 || tagCount > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [optionCount, tagCount]);

  function handleConfirm(): void {
    const err = validate(draft);
    if (err) { setError(err); return; }
    onConfirm(draft);
    setError(null);
  }

  const dialogMaxHeight = windowHeight * 0.65;

  const isEditing = editQuestion !== null;
  const visible   = draftType !== null || isEditing;
  const title     = isEditing ? TYPE_LABELS[editQuestion.type] : (draftType !== null ? TYPE_LABELS[draftType] : '');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Pressable style={[styles.dialog, { maxHeight: dialogMaxHeight }]} onPress={Keyboard.dismiss}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.promptSection}>
            <TextInput
              label="Question"
              value={draft.prompt}
              onChangeText={(p) => setDraft({ ...draft, prompt: p } as Question)}
              placeholder="What is the question?"
            />
          </View>

          <View ref={scrollAreaRef} style={styles.scrollArea}>
            <ScrollView
              ref={scrollRef}
              style={styles.fill}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              onScroll={(e) => { scrollOffset.current = e.nativeEvent.contentOffset.y; }}
              contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPadding }]}
            >
              {draft.type === QuestionType.MultipleChoiceText && (
                <MultipleChoiceBuilder
                  options={(draft as MultipleChoiceTextQuestion).options}
                  onChange={(opts) => setDraft({ ...draft, options: opts } as Question)}
                />
              )}
              {draft.type === QuestionType.MultipleChoiceNumber && (
                <MultipleChoiceNumberBuilder
                  options={(draft as MultipleChoiceNumberQuestion).options}
                  onChange={(opts) => setDraft({ ...draft, options: opts } as Question)}
                />
              )}
              {draft.type === QuestionType.SliderNumber && (
                <SliderBuilder
                  min={(draft as SliderNumberQuestion).min}
                  max={(draft as SliderNumberQuestion).max}
                  step={(draft as SliderNumberQuestion).step}
                  onChange={(f) => setDraft({ ...draft, ...f } as SliderNumberQuestion)}
                />
              )}
              {draft.type === QuestionType.Tags && (
                <TagsBuilder
                  tags={(draft as TagsQuestion).tags}
                  maxSelections={(draft as TagsQuestion).maxSelections}
                  onChange={(t, m) => setDraft({ ...draft, tags: t, maxSelections: m } as TagsQuestion)}
                />
              )}
              {draft.type === QuestionType.Price && (
                <PriceBuilder
                  currencySymbol={(draft as PriceQuestion).currencySymbol}
                  onChange={(sym) => setDraft({ ...draft, currencySymbol: sym } as PriceQuestion)}
                />
              )}
            </ScrollView>
          </View>

          {error !== null && <ErrorMessage message={error} />}

          <View style={styles.actions}>
            <Button label="Cancel" onPress={onCancel} variant="secondary" style={styles.btn} />
            <Button label={isEditing ? 'Save' : 'Add'} onPress={handleConfirm} style={styles.btn} />
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:       { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'center', padding: Spacing.lg },
  dialog:        { flex: 1, backgroundColor: Colors.surface, borderRadius: Spacing.md, overflow: 'hidden' },
  title:         { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: FontWeight.bold, padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  promptSection: { padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  scrollArea:    { flex: 1 },
  fill:          { flex: 1 },
  scrollContent: { padding: Spacing.md },
  actions:       { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  btn:           { flex: 1 },
});
