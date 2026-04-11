import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { RoundPhase } from '../../constants/gameConstants';
import { PlayerStackParamList } from '../../types/navigation';
import { useGameContext } from '../../context/GameContext';
import { useAnswers } from '../../hooks/useAnswers';
import { usePlayerActions } from '../../hooks/usePlayerActions';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { RoundBadge } from '../../components/RoundBadge';
import { KickedOverlay } from '../../components/KickedOverlay';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { QuestionResult } from '../../components/questions/QuestionResult';
import { QuestionInput } from '../../components/questions/QuestionInput';

type Nav = NativeStackNavigationProp<PlayerStackParamList>;

export default function PlayerRoundScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { state }  = useGameContext();
  const { submitAnswers } = usePlayerActions();
  const [submitted, setSubmitted] = useState(false);

  const game         = state.gameState;
  const questions    = game?.questionnaire?.questions ?? [];
  const currentRound = game?.currentRound ?? 1;
  const totalRounds  = game?.totalRounds ?? 1;
  const roundPhase   = game?.roundPhase ?? RoundPhase.Answering;
  const localPlayer  = game?.players.find((p) => p.id === state.localPlayerId);
  const score        = localPlayer?.score ?? 0;

  const { answers, setAnswer, clearAnswers, isComplete } = useAnswers(questions);
  const roundResults = state.lastRoundResults;
  const isRevealed   = roundPhase === RoundPhase.AnswersRevealed;

  useEffect(() => {
    setSubmitted(false);
    clearAnswers();
  }, [currentRound, clearAnswers]);

  useEffect(() => {
    if (state.gameResults) {
      navigation.navigate('PlayerResults', { results: state.gameResults });
    }
  }, [state.gameResults, navigation]);

  function handleSubmit(): void {
    setSubmitted(true);
    submitAnswers(Array.from(answers.values()));
  }

  return (
    <ScreenContainer noPadding>
      <Banner title="Round" score={score} />

      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <RoundBadge current={currentRound} total={totalRounds} />

        {isRevealed && roundResults ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Round Results</Text>
            <View style={styles.resultsList}>
              {roundResults.map((qr) => (
                <QuestionResult key={qr.questionId} result={qr} />
              ))}
            </View>
          </View>
        ) : submitted ? (
          <View style={styles.waitingSection}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.waitingText}>Waiting for other players…</Text>
          </View>
        ) : (
          <View style={styles.section}>
            {questions.map((q, index) => (
              <View key={q.id} style={styles.questionBlock}>
                <Text style={styles.questionIndex}>Question {index + 1}</Text>
                <QuestionInput
                  question={q}
                  answer={answers.get(q.id) ?? null}
                  onAnswer={setAnswer}
                />
              </View>
            ))}
          </View>
        )}

        {!submitted && !isRevealed && (
          <Button
            label="Submit Answers"
            onPress={handleSubmit}
            disabled={!isComplete}
            style={styles.submitButton}
          />
        )}
      </ScrollView>

      <KickedOverlay visible={state.isKicked} />
      <GamePausedOverlay visible={state.isPaused} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner:          { flexGrow: 1, padding: Spacing.md, gap: Spacing.lg },
  section:        { gap: Spacing.xl },
  questionBlock:  { gap: Spacing.sm },
  questionIndex:  { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  sectionLabel:   { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  waitingSection: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  waitingText:    { color: Colors.textSecondary, fontSize: FontSize.md },
  resultsList:    { gap: Spacing.md },
  submitButton:   { marginTop: Spacing.md },
});
