import {
  StyleSheet, View, Text, ScrollView, KeyboardAvoidingView,
  Platform, TextInput as RNTextInput, Keyboard,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import {
  Question,
  MultipleChoiceTextQuestion,
  MultipleChoiceNumberQuestion,
  SliderNumberQuestion,
  PriceQuestion,
} from '../../types/questionnaire';
import { Button } from '../../components/Button';
import { ErrorMessage } from '../../components/ErrorMessage';
import { MultipleChoiceBuilder } from '../../components/builder/MultipleChoiceBuilder';
import { MultipleChoiceNumberBuilder } from '../../components/builder/MultipleChoiceNumberBuilder';
import { SliderBuilder } from '../../components/builder/SliderBuilder';
import { PriceBuilder } from '../../components/builder/PriceBuilder';

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'QuestionEditor'>;

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
      return { id, type, prompt: '' };
    case QuestionType.Price:
      return { id, type, prompt: '', currencySymbol: '£' };
  }
}

function validate(q: Question): string | null {
  if (!q.prompt.trim()) return 'Add a question prompt.';
  if (q.type === QuestionType.MultipleChoiceText || q.type === QuestionType.MultipleChoiceNumber) {
    if (q.options.length < 2) return 'Add at least 2 options.';
    if (q.options.some((o) => !o.label.trim())) return 'All options need a label.';
  }
  if (q.type === QuestionType.SliderNumber) {
    if ((q as SliderNumberQuestion).min >= (q as SliderNumberQuestion).max) return 'Min must be less than max.';
  }
  return null;
}

export default function QuestionEditorScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { questionType, question } = route.params ?? {};

  const isEditing = question !== undefined;

  const [draft, setDraft]           = useState<Question>(() =>
    question ?? makeDefault(questionType ?? QuestionType.MultipleChoiceText)
  );
  const [promptError, setPromptError]   = useState<string | undefined>(undefined);
  const [configError, setConfigError]   = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: isEditing ? 'Edit Question' : 'New Question' });
  }, [isEditing, navigation]);

  function handleSave(): void {
    Keyboard.dismiss();
    const err = validate(draft);
    if (err) {
      if (err.startsWith('Add a question prompt')) { setPromptError(err); setConfigError(null); }
      else { setConfigError(err); setPromptError(undefined); }
      return;
    }
    setPromptError(undefined);
    setConfigError(null);
    route.params?.onSave?.(draft);
    navigation.goBack();
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.inner}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type badge */}
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{TYPE_LABELS[draft.type]}</Text>
          </View>

          {/* Prompt card — styled like the player question card */}
          <View style={styles.cardWrapper}>
            <View style={styles.cardShadow} />
            <View style={[styles.card, promptError !== undefined && styles.cardError]}>
              <Text style={styles.fieldLabel}>QUESTION</Text>
              <RNTextInput
                style={styles.promptInput}
                value={draft.prompt}
                onChangeText={(p) => { setDraft({ ...draft, prompt: p } as Question); setPromptError(undefined); }}
                placeholder="What should players answer?"
                placeholderTextColor={Colors.textDisabled}
                multiline
                returnKeyType="default"
                accessibilityLabel="Question prompt"
              />
            </View>
          </View>
          {promptError !== undefined && <ErrorMessage message={promptError} />}

          {/* Type-specific config card */}
          {draft.type !== QuestionType.Tags && (
            <View style={styles.cardWrapper}>
              <View style={styles.cardShadow} />
              <View style={[styles.card, styles.configCard]}>
                <Text style={styles.fieldLabel}>OPTIONS</Text>
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
                {draft.type === QuestionType.Price && (
                  <PriceBuilder
                    currencySymbol={(draft as PriceQuestion).currencySymbol}
                    onChange={(sym) => setDraft({ ...draft, currencySymbol: sym } as PriceQuestion)}
                  />
                )}
              </View>
            </View>
          )}

          {configError !== null && <ErrorMessage message={configError} />}

          <Button
            label={isEditing ? 'Save Question' : 'Add Question'}
            onPress={handleSave}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.background },
  flex:  { flex: 1 },
  inner: { flexGrow: 1, padding: Spacing.md, gap: Spacing.lg },

  typeBadge: {
    alignSelf:         'flex-start',
    backgroundColor:   Colors.sun,
    borderRadius:      BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.xs,
    borderWidth:       2.5,
    borderColor:       Colors.ink,
  },
  typeBadgeText: {
    fontFamily:    FontFamily.bodyBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    color:         Colors.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  cardWrapper: { position: 'relative' },
  cardShadow:  {
    position:        'absolute',
    top:             4,
    left:            4,
    right:           -4,
    bottom:          -4,
    borderRadius:    BorderRadius.md,
    backgroundColor: Colors.ink,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth:     2.5,
    borderColor:     Colors.ink,
    borderRadius:    BorderRadius.md,
    padding:         Spacing.md,
    gap:             Spacing.sm,
  },
  configCard: {
    backgroundColor: Colors.surfaceElevated,
  },
  cardError: {
    borderColor: Colors.error,
  },

  fieldLabel: {
    fontFamily:    FontFamily.bodyBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    color:         Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  promptInput: {
    fontFamily:   FontFamily.heading,
    fontSize:     FontSize.xl,
    fontWeight:   FontWeight.black,
    color:        Colors.ink,
    lineHeight:   FontSize.xl * 1.3,
    minHeight:    64,
    textAlignVertical: 'top',
  },

  saveButton: { marginTop: Spacing.sm },
});
