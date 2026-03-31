import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { useGame } from '../../context/GameContext';
import { QUESTION_TYPES, MAX_CHOICES_PER_QUESTION } from '../../constants/gameConstants';
import COLORS from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import TextInput from '../../components/TextInput';
import OptionPicker from '../../components/OptionPicker';
import Button from '../../components/Button';
import Card from '../../components/Card';

const TYPE_OPTIONS = [
  { label: 'Multiple choice (text)', value: QUESTION_TYPES.MULTIPLE_CHOICE_TEXT },
  { label: 'Multiple choice (number)', value: QUESTION_TYPES.MULTIPLE_CHOICE_NUMBER },
  { label: 'Text + keywords', value: QUESTION_TYPES.TEXT_KEYWORDS },
];

function buildEmptyQuestion() {
  return {
    id: Date.now().toString(),
    type: QUESTION_TYPES.MULTIPLE_CHOICE_TEXT,
    prompt: '',
    choices: ['', ''],
    keywords: [],
  };
}

export default function QuestionnaireBuilderScreen({ navigation }) {
  const { dispatch } = useGame();
  const [questions, setQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [choiceInput, setChoiceInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [promptError, setPromptError] = useState('');
  const [choicesError, setChoicesError] = useState('');

  function openAddModal() {
    setEditingQuestion(buildEmptyQuestion());
    setPromptError('');
    setChoicesError('');
    setChoiceInput('');
    setKeywordInput('');
    setModalVisible(true);
  }

  function openEditModal(question) {
    setEditingQuestion({ ...question, choices: [...question.choices], keywords: [...question.keywords] });
    setPromptError('');
    setChoicesError('');
    setChoiceInput('');
    setKeywordInput('');
    setModalVisible(true);
  }

  function updateField(field, value) {
    setEditingQuestion(q => ({ ...q, [field]: value }));
  }

  function addChoice() {
    const val = choiceInput.trim();
    if (!val) return;
    if (editingQuestion.choices.length >= MAX_CHOICES_PER_QUESTION) return;
    updateField('choices', [...editingQuestion.choices, val]);
    setChoiceInput('');
  }

  function removeChoice(index) {
    updateField('choices', editingQuestion.choices.filter((_, i) => i !== index));
  }

  function addKeyword() {
    const val = keywordInput.trim().toLowerCase();
    if (!val) return;
    if (editingQuestion.keywords.includes(val)) return;
    updateField('keywords', [...editingQuestion.keywords, val]);
    setKeywordInput('');
  }

  function removeKeyword(kw) {
    updateField('keywords', editingQuestion.keywords.filter(k => k !== kw));
  }

  function saveQuestion() {
    if (!editingQuestion.prompt.trim()) {
      setPromptError('Question text is required.');
      return;
    }
    if (
      editingQuestion.type !== QUESTION_TYPES.TEXT_KEYWORDS &&
      editingQuestion.choices.filter(c => c.trim()).length < 2
    ) {
      setChoicesError('Add at least 2 choices.');
      return;
    }
    setPromptError('');
    setChoicesError('');

    const cleaned = {
      ...editingQuestion,
      prompt: editingQuestion.prompt.trim(),
      choices: editingQuestion.choices.filter(c => c.trim()),
    };

    setQuestions(prev => {
      const existing = prev.findIndex(q => q.id === cleaned.id);
      return existing >= 0
        ? prev.map(q => q.id === cleaned.id ? cleaned : q)
        : [...prev, cleaned];
    });
    setModalVisible(false);
  }

  function deleteQuestion(id) {
    Alert.alert('Remove Question', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setQuestions(prev => prev.filter(q => q.id !== id)) },
    ]);
  }

  function handleNext() {
    if (questions.length === 0) {
      Alert.alert('No questions', 'Add at least one question to continue.');
      return;
    }
    dispatch({ type: 'SET_QUESTIONNAIRE', payload: questions });
    navigation.navigate('RoundsBuilder');
  }

  function typeLabel(type) {
    return TYPE_OPTIONS.find(o => o.value === type)?.label ?? type;
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Questionnaire</Text>
      <Text style={styles.hint}>These questions are asked for every round.</Text>

      {questions.length === 0 && (
        <Text style={styles.empty}>No questions yet. Tap + to add one.</Text>
      )}

      {questions.map((q, i) => (
        <Card key={q.id} style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.questionMeta}>
              <Text style={styles.questionIndex}>Q{i + 1}</Text>
              <Text style={styles.questionType}>{typeLabel(q.type)}</Text>
            </View>
            <View style={styles.questionActions}>
              <TouchableOpacity onPress={() => openEditModal(q)} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteQuestion(q.id)} style={[styles.actionBtn, styles.actionBtnDanger]}>
                <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.questionPrompt}>{q.prompt}</Text>
          {q.type !== QUESTION_TYPES.TEXT_KEYWORDS && (
            <Text style={styles.questionChoices}>{q.choices.join(' · ')}</Text>
          )}
          {q.type === QUESTION_TYPES.TEXT_KEYWORDS && q.keywords.length > 0 && (
            <Text style={styles.questionChoices}>Keywords: {q.keywords.join(', ')}</Text>
          )}
        </Card>
      ))}

      <Button title="+ Add Question" onPress={openAddModal} variant="secondary" style={styles.addBtn} />
      <Button title="Next: Set Up Rounds" onPress={handleNext} style={styles.cta} disabled={questions.length === 0} />

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Question</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {editingQuestion && (
            <FlatList
              data={[]}
              ListHeaderComponent={
                <View style={styles.modalContent}>
                  <OptionPicker
                    label="Question type"
                    options={TYPE_OPTIONS}
                    value={editingQuestion.type}
                    onChange={v => updateField('type', v)}
                  />

                  <TextInput
                    label="Question text"
                    placeholder="e.g. What colour is this wine?"
                    value={editingQuestion.prompt}
                    onChangeText={v => updateField('prompt', v)}
                    error={promptError}
                    multiline
                  />

                  {editingQuestion.type !== QUESTION_TYPES.TEXT_KEYWORDS && (
                    <View>
                      <Text style={styles.sectionLabel}>Choices</Text>
                      {choicesError ? <Text style={styles.errorText}>{choicesError}</Text> : null}
                      {editingQuestion.choices.map((c, i) => (
                        <View key={i} style={styles.chipRow}>
                          <View style={styles.chip}>
                            <Text style={styles.chipText}>{c}</Text>
                          </View>
                          <TouchableOpacity onPress={() => removeChoice(i)}>
                            <Text style={styles.chipRemove}>✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                      <View style={styles.addRow}>
                        <TextInput
                          placeholder="Add choice…"
                          value={choiceInput}
                          onChangeText={setChoiceInput}
                          onSubmitEditing={addChoice}
                          style={styles.addInput}
                        />
                        <Button title="Add" onPress={addChoice} variant="secondary" style={styles.addInlineBtn} />
                      </View>
                    </View>
                  )}

                  {editingQuestion.type === QUESTION_TYPES.TEXT_KEYWORDS && (
                    <View>
                      <Text style={styles.sectionLabel}>Scoring keywords (optional)</Text>
                      <Text style={styles.hint}>Answers containing these words score a point each.</Text>
                      <View style={styles.keywordWrap}>
                        {editingQuestion.keywords.map(kw => (
                          <TouchableOpacity key={kw} onPress={() => removeKeyword(kw)} style={styles.keyword}>
                            <Text style={styles.keywordText}>{kw} ✕</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      <View style={styles.addRow}>
                        <TextInput
                          placeholder="Add keyword…"
                          value={keywordInput}
                          onChangeText={setKeywordInput}
                          onSubmitEditing={addKeyword}
                          style={styles.addInput}
                        />
                        <Button title="Add" onPress={addKeyword} variant="secondary" style={styles.addInlineBtn} />
                      </View>
                    </View>
                  )}

                  <Button title="Save Question" onPress={saveQuestion} style={{ marginTop: SPACING.lg }} />
                </View>
              }
            />
          )}
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  hint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  empty: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },
  questionCard: {
    marginBottom: SPACING.sm,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  questionIndex: {
    color: COLORS.accent,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.sm,
  },
  questionType: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
  questionActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnDanger: {
    borderColor: COLORS.error,
  },
  actionBtnText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
  },
  actionBtnTextDanger: {
    color: COLORS.error,
  },
  questionPrompt: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.xs,
  },
  questionChoices: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
  addBtn: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  cta: {
    marginTop: SPACING.sm,
  },
  // Modal
  modal: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalClose: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
  },
  modalContent: {
    padding: SPACING.md,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginBottom: SPACING.xs,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    gap: SPACING.sm,
  },
  chip: {
    backgroundColor: COLORS.backgroundElevated,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    flex: 1,
  },
  chipText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.sm,
  },
  chipRemove: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    padding: SPACING.xs,
  },
  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  keyword: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  keywordText: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.xs,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  addInput: {
    flex: 1,
    marginBottom: 0,
  },
  addInlineBtn: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    minHeight: 0,
    marginTop: 0,
  },
});
