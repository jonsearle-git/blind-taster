import { StyleSheet, View, Text, FlatList, Pressable, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { QuestionType } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { Question, Questionnaire, SliderNumberQuestion, TagsQuestion } from '../../types/questionnaire';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { ErrorMessage } from '../../components/ErrorMessage';
import { QuestionAccordionItem } from '../../components/builder/QuestionAccordionItem';
import { QuestionDraftDialog } from '../../components/builder/QuestionDraftDialog';

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'QuestionnaireBuilder'>;

const TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.MultipleChoiceText]:   'Multiple Choice — Text',
  [QuestionType.MultipleChoiceNumber]: 'Multiple Choice — Number',
  [QuestionType.SliderNumber]:         'Slider / Number',
  [QuestionType.Tags]:                 'Tags',
  [QuestionType.Price]:                'Price',
};

function validateQuestion(q: Question, index: number): string | null {
  if (!q.prompt.trim()) return `Question ${index + 1} is missing a prompt.`;
  if (q.type === QuestionType.MultipleChoiceText || q.type === QuestionType.MultipleChoiceNumber) {
    if (q.options.length < 2) return `Question ${index + 1} needs at least 2 options.`;
    if (q.options.some((o) => !o.label.trim())) return `Question ${index + 1} has an empty option label.`;
  }
  if (q.type === QuestionType.SliderNumber) {
    if ((q as SliderNumberQuestion).min >= (q as SliderNumberQuestion).max)
      return `Question ${index + 1}: min must be less than max.`;
  }
  if (q.type === QuestionType.Tags) {
    const tq = q as TagsQuestion;
    if (tq.tags.length === 0) return `Question ${index + 1} needs at least one tag.`;
    if (tq.tags.some((t) => !t.label.trim())) return `Question ${index + 1} has an empty tag label.`;
  }
  return null;
}

export default function QuestionnaireBuilderScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { questionnaires, save, update } = useQuestionnaires();

  const existingId = route.params?.questionnaireId;

  const [name, setName]             = useState('');
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [error,          setError]          = useState<string | null>(null);
  const [saving,         setSaving]         = useState(false);
  const [showPicker,     setShowPicker]     = useState(false);
  const [draftType,      setDraftType]      = useState<QuestionType | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: existingId ? 'Edit Questionnaire' : 'New Questionnaire' });
  }, [existingId, navigation]);

  useEffect(() => {
    if (!existingId) return;
    const existing = questionnaires.find((q) => q.id === existingId);
    if (existing) { setName(existing.name); setQuestions(existing.questions); }
  }, [existingId, questionnaires]);

  function handleConfirm(q: Question): void {
    if (editingQuestion !== null) {
      setQuestions((prev) => prev.map((x) => (x.id === q.id ? q : x)));
      setEditingQuestion(null);
    } else {
      setQuestions((prev) => [...prev, q]);
      setDraftType(null);
    }
  }

  async function handleSave(): Promise<void> {
    const trimmedName = name.trim();
    if (!trimmedName) { setError('Give your questionnaire a name.'); return; }
    if (questions.length === 0) { setError('Add at least one question.'); return; }
    for (let i = 0; i < questions.length; i++) {
      const err = validateQuestion(questions[i], i);
      if (err) { setError(err); return; }
    }
    setError(null);
    setSaving(true);
    try {
      const now = Date.now();
      const q: Questionnaire = { id: existingId ?? uuidv4(), name: trimmedName, questions, createdAt: now, updatedAt: now };
      if (existingId) { await update(q); } else { await save(q); }
      Alert.alert(
        'Questionnaire Saved',
        'Remember to set the correct answer for each round in the Rounds screen.',
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
        <TextInput label="Questionnaire Name" value={name} onChangeText={setName} placeholder="e.g. Wine Tasting 2025" />
        {error !== null && <ErrorMessage message={error} />}
        <Divider />

        <FlatList
          data={questions}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.gap} />}
          ListEmptyComponent={<Text style={styles.hint}>No questions yet. Tap Add Question to start.</Text>}
          renderItem={({ item, index }) => (
            <QuestionAccordionItem
              question={item}
              index={index}
              onEdit={() => setEditingQuestion(item)}
              onRemove={(id) => setQuestions((prev) => prev.filter((x) => x.id !== id))}
            />
          )}
        />

        <Button label="+ Add Question" onPress={() => setShowPicker(true)} variant="secondary" />
        <Button label="Save Questionnaire" onPress={handleSave} loading={saving} />
      </View>

      {/* Type picker sheet */}
      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={() => setShowPicker(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowPicker(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Choose Question Type</Text>
            {Object.values(QuestionType).map((type) => (
              <Pressable
                key={type}
                onPress={() => { setDraftType(type); setShowPicker(false); }}
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

      <QuestionDraftDialog
        draftType={draftType}
        editQuestion={editingQuestion}
        onConfirm={handleConfirm}
        onCancel={() => { setDraftType(null); setEditingQuestion(null); }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner:             { flex: 1, padding: Spacing.md, gap: Spacing.md },
  hint:              { color: Colors.textDisabled, fontSize: FontSize.md, textAlign: 'center', paddingVertical: Spacing.xl },
  gap:               { height: Spacing.sm },
  backdrop:          { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet:             { backgroundColor: Colors.surface, borderTopLeftRadius: Spacing.lg, borderTopRightRadius: Spacing.lg, padding: Spacing.lg, gap: Spacing.sm, borderTopWidth: 1, borderColor: Colors.border },
  sheetTitle:        { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  sheetOption:       { paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm, borderRadius: Spacing.sm },
  sheetOptionPressed:{ backgroundColor: Colors.surfaceElevated },
  sheetOptionText:   { color: Colors.textPrimary, fontSize: FontSize.md },
});
