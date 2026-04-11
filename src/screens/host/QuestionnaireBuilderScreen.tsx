import { StyleSheet, View, Text, FlatList, Pressable, Alert, Modal } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import {
  Question, Questionnaire,
  MultipleChoiceTextQuestion, MultipleChoiceNumberQuestion,
  SliderNumberQuestion, TagsQuestion, PriceQuestion,
} from '../../types/questionnaire';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Divider } from '../../components/Divider';
import { ErrorMessage } from '../../components/ErrorMessage';
import { MultipleChoiceBuilder } from '../../components/builder/MultipleChoiceBuilder';
import { SliderBuilder } from '../../components/builder/SliderBuilder';
import { TagsBuilder } from '../../components/builder/TagsBuilder';
import { PriceBuilder } from '../../components/builder/PriceBuilder';

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'QuestionnaireBuilder'>;

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
      return { id, type, prompt: '', options: [{ id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }], correctOptionId: '' };
    case QuestionType.MultipleChoiceNumber:
      return { id, type, prompt: '', options: [{ id: uuidv4(), label: '' }, { id: uuidv4(), label: '' }], correctOptionId: '' };
    case QuestionType.SliderNumber:
      return { id, type, prompt: '', min: 0, max: 100, step: 1, correctValue: 50 };
    case QuestionType.Tags:
      return { id, type, prompt: '', tags: [], correctTagIds: [], maxSelections: null };
    case QuestionType.Price:
      return { id, type, prompt: '', currencySymbol: '£', correctValue: 0 };
  }
}

export default function QuestionnaireBuilderScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { save }   = useQuestionnaires();

  const [name, setName]         = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError]       = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  function addQuestion(type: QuestionType): void {
    setQuestions((prev) => [...prev, makeDefault(type)]);
    setShowPicker(false);
  }

  function updateQuestion(updated: Question): void {
    setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
  }

  function removeQuestion(id: string): void {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  async function handleSave(): Promise<void> {
    if (name.trim() === '') { setError('Give your questionnaire a name.'); return; }
    if (questions.length === 0) { setError('Add at least one question.'); return; }
    setError(null);
    setSaving(true);
    try {
      const now = Date.now();
      const q: Questionnaire = {
        id: route.params.questionnaireId ?? uuidv4(),
        name: name.trim(),
        questions,
        createdAt: now,
        updatedAt: now,
      };
      await save(q);
      Alert.alert(
        'Questionnaire Saved',
        'Remember to label the items you are testing in the Rounds screen. These labels are hidden from players until the end.',
        [{ text: 'Got it', onPress: () => navigation.goBack() }]
      );
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer noPadding>
      <View style={styles.inner}>
        <Text style={styles.title}>Build Questionnaire</Text>

        <TextInput
          label="Questionnaire Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Wine Tasting 2025"
        />

        {error !== null && <ErrorMessage message={error} />}

        <Divider />

        <FlatList
          data={questions}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={<Text style={styles.hint}>Tap Add Question to get started.</Text>}
          renderItem={({ item, index }) => (
            <QuestionEditor question={item} index={index} onUpdate={updateQuestion} onRemove={removeQuestion} />
          )}
        />

        <Button label="+ Add Question" onPress={() => setShowPicker(true)} variant="secondary" />
        <Button label="Save Questionnaire" onPress={handleSave} loading={saving} />
      </View>

      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowPicker(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Choose Question Type</Text>
            {Object.values(QuestionType).map((type) => (
              <Pressable
                key={type}
                onPress={() => addQuestion(type)}
                style={({ pressed }) => [styles.sheetOption, pressed && styles.sheetOptionPressed]}
                accessibilityRole="button"
                accessibilityLabel={TYPE_LABELS[type]}
              >
                <Text style={styles.sheetOptionText}>{TYPE_LABELS[type]}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

type EditorProps = {
  question: Question;
  index:    number;
  onUpdate: (q: Question) => void;
  onRemove: (id: string) => void;
};

function QuestionEditor({ question, index, onUpdate, onRemove }: EditorProps): React.ReactElement {
  return (
    <View style={styles.editor}>
      <View style={styles.editorHeader}>
        <Text style={styles.editorLabel}>Q{index + 1} · {TYPE_LABELS[question.type]}</Text>
        <IconButton icon="✕" onPress={() => onRemove(question.id)} color={Colors.error} accessibilityLabel={`Remove question ${index + 1}`} />
      </View>
      <TextInput label="Question" value={question.prompt} onChangeText={(p) => onUpdate({ ...question, prompt: p } as Question)} placeholder="What is the question?" />
      {question.type === QuestionType.MultipleChoiceText && (
        <MultipleChoiceBuilder
          options={(question as MultipleChoiceTextQuestion).options}
          correctOptionId={(question as MultipleChoiceTextQuestion).correctOptionId}
          onChange={(o, c) => onUpdate({ ...question, options: o, correctOptionId: c ?? '' } as MultipleChoiceTextQuestion)}
        />
      )}
      {question.type === QuestionType.MultipleChoiceNumber && (
        <MultipleChoiceBuilder
          options={(question as MultipleChoiceNumberQuestion).options}
          correctOptionId={(question as MultipleChoiceNumberQuestion).correctOptionId}
          onChange={(o, c) => onUpdate({ ...question, options: o, correctOptionId: c ?? '' } as MultipleChoiceNumberQuestion)}
        />
      )}
      {question.type === QuestionType.SliderNumber && (
        <SliderBuilder
          min={(question as SliderNumberQuestion).min}
          max={(question as SliderNumberQuestion).max}
          step={(question as SliderNumberQuestion).step}
          correctValue={(question as SliderNumberQuestion).correctValue}
          onChange={(f) => onUpdate({ ...question, ...f } as SliderNumberQuestion)}
        />
      )}
      {question.type === QuestionType.Tags && (
        <TagsBuilder
          tags={(question as TagsQuestion).tags}
          correctTagIds={(question as TagsQuestion).correctTagIds}
          maxSelections={(question as TagsQuestion).maxSelections}
          onChange={(t, c, m) => onUpdate({ ...question, tags: t, correctTagIds: c, maxSelections: m } as TagsQuestion)}
        />
      )}
      {question.type === QuestionType.Price && (
        <PriceBuilder
          currencySymbol={(question as PriceQuestion).currencySymbol}
          correctValue={(question as PriceQuestion).correctValue}
          onChange={(sym, val) => onUpdate({ ...question, currencySymbol: sym, correctValue: val ?? 0 } as PriceQuestion)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inner:               { flex: 1, padding: Spacing.md, gap: Spacing.md },
  title:               { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.black, paddingVertical: Spacing.md },
  hint:                { color: Colors.textDisabled, fontSize: FontSize.md, textAlign: 'center', paddingVertical: Spacing.xl },
  editor:              { gap: Spacing.md, paddingVertical: Spacing.sm },
  editorHeader:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editorLabel:         { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  backdrop:            { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet:               { backgroundColor: Colors.surface, borderTopLeftRadius: Spacing.lg, borderTopRightRadius: Spacing.lg, padding: Spacing.lg, gap: Spacing.sm, borderTopWidth: 1, borderColor: Colors.border },
  sheetTitle:          { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  sheetOption:         { paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm, borderRadius: Spacing.sm },
  sheetOptionPressed:  { backgroundColor: Colors.surfaceElevated },
  sheetOptionText:     { color: Colors.textPrimary, fontSize: FontSize.md },
});
