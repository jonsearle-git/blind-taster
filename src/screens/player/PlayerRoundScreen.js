import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useGame } from '../../context/GameContext';
import { useBle } from '../../context/BleContext';
import { QUESTION_TYPES, REVEAL_MODES } from '../../constants/gameConstants';
import COLORS from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function PlayerRoundScreen({ navigation }) {
  const { state } = useGame();
  const { questionnaire, currentRoundIndex, rounds, revealMode } = state;
  const { player: ble } = useBle();

  const round = rounds[currentRoundIndex];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [revealData, setRevealData] = useState(null); // answers revealed by host

  // Register reveal callback
  useEffect(() => {
    // Re-register the onRoundReveal callback to update this screen
    // (BleContext callbacks were set on JoinGameScreen — we update them here)
    // Simplest approach: expose a setter on the ble hook
    // For now, we handle reveals via navigation event / shared context update
  }, []);

  function setAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }

  function allAnswered() {
    return questionnaire.every(q => {
      const a = answers[q.id];
      return a !== undefined && a.toString().trim() !== '';
    });
  }

  async function handleSubmit() {
    if (!allAnswered()) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting.');
      return;
    }
    try {
      await ble.sendAnswer(currentRoundIndex, answers);
      setSubmitted(true);
    } catch {
      Alert.alert('Error', 'Could not send your answers. Check your Bluetooth connection.');
    }
  }

  function renderQuestion(question, index) {
    const value = answers[question.id] ?? '';
    const revealed = revealData?.[question.id];

    if (question.type === QUESTION_TYPES.TEXT_KEYWORDS) {
      return (
        <Card key={question.id} style={styles.questionCard}>
          <Text style={styles.questionIndex}>Question {index + 1}</Text>
          <Text style={styles.questionPrompt}>{question.prompt}</Text>
          <TextInput
            placeholder="Your answer…"
            value={value}
            onChangeText={v => setAnswer(question.id, v)}
            editable={!submitted}
            multiline
          />
          {revealed !== undefined && (
            <View style={styles.revealBox}>
              <Text style={styles.revealLabel}>Answer:</Text>
              <Text style={styles.revealValue}>{revealed}</Text>
            </View>
          )}
        </Card>
      );
    }

    // Multiple choice
    return (
      <Card key={question.id} style={styles.questionCard}>
        <Text style={styles.questionIndex}>Question {index + 1}</Text>
        <Text style={styles.questionPrompt}>{question.prompt}</Text>
        <View style={styles.choiceList}>
          {question.choices.map(choice => {
            const selected = value === choice;
            const isCorrect = revealed !== undefined && choice === revealed;
            const isWrong = revealed !== undefined && selected && choice !== revealed;
            return (
              <TouchableOpacity
                key={choice}
                style={[
                  styles.choice,
                  selected && styles.choiceSelected,
                  isCorrect && styles.choiceCorrect,
                  isWrong && styles.choiceWrong,
                ]}
                onPress={() => !submitted && setAnswer(question.id, choice)}
                activeOpacity={submitted ? 1 : 0.75}
                disabled={submitted}
              >
                <Text style={[
                  styles.choiceText,
                  selected && styles.choiceTextSelected,
                  isCorrect && styles.choiceTextCorrect,
                  isWrong && styles.choiceTextWrong,
                ]}>
                  {choice}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.roundBadge}>
        <Text style={styles.roundLabel}>ROUND</Text>
        <Text style={styles.roundNumber}>{round?.number ?? currentRoundIndex + 1}</Text>
      </View>

      {questionnaire.map((q, i) => renderQuestion(q, i))}

      {!submitted ? (
        <Button
          title="Submit Answers"
          onPress={handleSubmit}
          disabled={!allAnswered()}
          style={styles.submitBtn}
        />
      ) : (
        <View style={styles.submittedBanner}>
          <Text style={styles.submittedText}>
            {revealMode === REVEAL_MODES.AFTER_EACH_QUESTION
              ? revealData ? '✓ Submitted — see reveals above' : '✓ Submitted — waiting for reveal…'
              : '✓ Submitted — waiting for next round…'
            }
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  roundBadge: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  roundLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  roundNumber: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 44,
  },
  questionCard: {
    marginBottom: SPACING.md,
  },
  questionIndex: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  questionPrompt: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    marginBottom: SPACING.md,
  },
  choiceList: {
    gap: SPACING.xs,
  },
  choice: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
  },
  choiceSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryDark,
  },
  choiceCorrect: {
    borderColor: COLORS.success,
    backgroundColor: 'rgba(76,175,125,0.12)',
  },
  choiceWrong: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(217,79,79,0.1)',
  },
  choiceText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  choiceTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  choiceTextCorrect: {
    color: COLORS.success,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  choiceTextWrong: {
    color: COLORS.error,
  },
  revealBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.backgroundElevated,
    borderRadius: RADIUS.sm,
  },
  revealLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
  },
  revealValue: {
    color: COLORS.success,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  submitBtn: {
    marginTop: SPACING.md,
  },
  submittedBanner: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundElevated,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  submittedText: {
    color: COLORS.success,
    fontSize: FONT_SIZES.sm,
  },
});
