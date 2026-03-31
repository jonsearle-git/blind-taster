import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView,
} from 'react-native';
import { useGame } from '../../context/GameContext';
import { QUESTION_TYPES, HOST_MODES, MAX_ROUNDS } from '../../constants/gameConstants';
import COLORS from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Card from '../../components/Card';

function buildEmptyRound(number) {
  return { number, answers: null }; // answers = null means not set
}

export default function RoundsBuilderScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const { questionnaire, hostMode } = state;

  const [rounds, setRounds] = useState([buildEmptyRound(1)]);
  const [editingRoundIndex, setEditingRoundIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [draftAnswers, setDraftAnswers] = useState({});

  function addRound() {
    if (rounds.length >= MAX_ROUNDS) return;
    setRounds(prev => [...prev, buildEmptyRound(prev.length + 1)]);
  }

  function removeRound(index) {
    if (rounds.length <= 1) return;
    Alert.alert('Remove Round', `Remove Round ${rounds[index].number}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove', style: 'destructive', onPress: () =>
          setRounds(prev => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, number: i + 1 }))),
      },
    ]);
  }

  function openAnswerModal(index) {
    const round = rounds[index];
    // Initialise draft from existing answers or empty
    const initial = {};
    questionnaire.forEach(q => {
      initial[q.id] = round.answers ? round.answers[q.id] ?? '' : '';
    });
    setDraftAnswers(initial);
    setEditingRoundIndex(index);
    setModalVisible(true);
  }

  function saveAnswers() {
    // Only save if at least one answer was provided
    const hasAny = Object.values(draftAnswers).some(v => v.toString().trim() !== '');
    setRounds(prev => prev.map((r, i) =>
      i === editingRoundIndex
        ? { ...r, answers: hasAny ? { ...draftAnswers } : null }
        : r
    ));
    setModalVisible(false);
  }

  function clearAnswers(index) {
    setRounds(prev => prev.map((r, i) => i === index ? { ...r, answers: null } : r));
  }

  function handleNext() {
    const hasAnswers = rounds.some(r => r.answers !== null);
    // If host set answers, they cannot be a player — enforce this silently via context
    if (hasAnswers && hostMode === HOST_MODES.HOST_AND_PLAYER) {
      Alert.alert(
        'Answers set',
        'Because you set correct answers, you cannot play as a player. Your role has been changed to Host Only.',
        [{ text: 'OK', onPress: () => proceed(HOST_MODES.HOST_ONLY) }]
      );
    } else {
      proceed(hostMode);
    }
  }

  function proceed(resolvedHostMode) {
    dispatch({ type: 'SET_ROUNDS', payload: rounds });
    dispatch({ type: 'SET_GAME_CONFIG', payload: { hostMode: resolvedHostMode } });
    navigation.navigate('HostLobby');
  }

  function renderAnswerInput(question, questionIndex) {
    const value = draftAnswers[question.id] ?? '';

    if (question.type === QUESTION_TYPES.TEXT_KEYWORDS) {
      return (
        <TextInput
          key={question.id}
          label={`Q${questionIndex + 1}: ${question.prompt}`}
          placeholder="Correct answer…"
          value={value}
          onChangeText={v => setDraftAnswers(prev => ({ ...prev, [question.id]: v }))}
          multiline
        />
      );
    }

    // Multiple choice
    return (
      <View key={question.id} style={styles.answerGroup}>
        <Text style={styles.answerLabel}>Q{questionIndex + 1}: {question.prompt}</Text>
        <View style={styles.choiceRow}>
          {question.choices.map(choice => (
            <TouchableOpacity
              key={choice}
              style={[styles.choice, value === choice && styles.choiceSelected]}
              onPress={() => setDraftAnswers(prev => ({ ...prev, [question.id]: choice }))}
            >
              <Text style={[styles.choiceText, value === choice && styles.choiceTextSelected]}>
                {choice}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <Text style={styles.heading}>Rounds</Text>
      <Text style={styles.hint}>Each round corresponds to one item being tested. Optionally set correct answers — if set, the app will score players automatically.</Text>

      {rounds.map((round, i) => (
        <Card key={i} style={styles.roundCard}>
          <View style={styles.roundHeader}>
            <Text style={styles.roundNumber}>Round {round.number}</Text>
            <View style={styles.roundActions}>
              <TouchableOpacity onPress={() => openAnswerModal(i)} style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>{round.answers ? 'Edit answers' : 'Set answers'}</Text>
              </TouchableOpacity>
              {round.answers && (
                <TouchableOpacity onPress={() => clearAnswers(i)} style={[styles.actionBtn, styles.actionBtnDanger]}>
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>Clear</Text>
                </TouchableOpacity>
              )}
              {rounds.length > 1 && (
                <TouchableOpacity onPress={() => removeRound(i)} style={[styles.actionBtn, styles.actionBtnDanger]}>
                  <Text style={[styles.actionBtnText, styles.actionBtnTextDanger]}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {round.answers
            ? <Text style={styles.answersSet}>✓ Answers set</Text>
            : <Text style={styles.answersEmpty}>No answers set — results only</Text>
          }
        </Card>
      ))}

      {rounds.length < MAX_ROUNDS && (
        <Button title="+ Add Round" onPress={addRound} variant="secondary" style={styles.addBtn} />
      )}

      <Button title="Next: Open Lobby" onPress={handleNext} style={styles.cta} />

      {/* Answers Modal */}
      <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingRoundIndex !== null ? `Round ${rounds[editingRoundIndex]?.number} Answers` : 'Answers'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.hint}>These answers are hidden from players. Leave blank to skip scoring for that question.</Text>
            {questionnaire.map((q, qi) => renderAnswerInput(q, qi))}
            <Button title="Save Answers" onPress={saveAnswers} style={{ marginTop: SPACING.md }} />
          </ScrollView>
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
  roundCard: {
    marginBottom: SPACING.sm,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  roundNumber: {
    color: COLORS.accent,
    fontWeight: FONT_WEIGHTS.bold,
    fontSize: FONT_SIZES.md,
  },
  roundActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
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
  answersSet: {
    color: COLORS.success,
    fontSize: FONT_SIZES.xs,
  },
  answersEmpty: {
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
    paddingBottom: SPACING.xxl,
  },
  answerGroup: {
    marginBottom: SPACING.md,
  },
  answerLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  choice: {
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
  },
  choiceSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.backgroundElevated,
  },
  choiceText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  choiceTextSelected: {
    color: COLORS.accent,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});
