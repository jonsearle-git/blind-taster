import { StyleSheet, View, Text, Pressable, Keyboard, ScrollView, BackHandler } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Round } from '../../types/game';
import { Answer } from '../../types/answer';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { useGames } from '../../hooks/useGames';
import { ScreenContainer } from '../../components/ScreenContainer';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import { Divider } from '../../components/Divider';
import { ErrorMessage } from '../../components/ErrorMessage';
import { QuestionInput } from '../../components/questions/QuestionInput';
import { Dropdown } from '../../components/Dropdown';

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'RoundsBuilder'>;

function makeRounds(n: number, existing: Round[] = []): Round[] {
  return Array.from({ length: n }, (_, i) => existing[i] ?? { number: i + 1, label: null, correctAnswers: [] });
}

export default function RoundsBuilderScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { gameId, questionnaireId: paramQuestionnaireId } = route.params ?? {};
  const { questionnaires }        = useQuestionnaires();
  const { games, save: saveGame } = useGames();
  const existingGame = gameId ? games.find((g) => g.id === gameId) : undefined;

  const scrollRef = useRef<ScrollView>(null);
  const [step,               setStep]               = useState(0);
  const [gameName,           setGameName]           = useState('');
  const [questionnaireId,    setQuestionnaireId]    = useState<string | null>(paramQuestionnaireId ?? null);
  const [rounds,             setRounds]             = useState<Round[]>(makeRounds(3));
  const [error,              setError]              = useState<string | null>(null);
  const [gameNameError,      setGameNameError]      = useState<string | undefined>(undefined);
  const [questionnaireError, setQuestionnaireError] = useState<string | undefined>(undefined);
  const [roundLabelError,    setRoundLabelError]    = useState<string | undefined>(undefined);
  const [questionErrors,     setQuestionErrors]     = useState<Set<string>>(new Set());
  const [saving,             setSaving]             = useState(false);

  useEffect(() => {
    if (existingGame) {
      setGameName(existingGame.name);
      setQuestionnaireId(existingGame.questionnaireId);
      setRounds(existingGame.rounds);
    }
  }, [existingGame]);

  useEffect(() => {
    if (step === 0) {
      navigation.setOptions({
        title: existingGame ? 'Edit Game' : 'New Game',
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()} style={styles.headerBack} accessibilityRole="button" accessibilityLabel="Back">
            <Text style={styles.headerBackText}>‹</Text>
          </Pressable>
        ),
      });
    } else {
      navigation.setOptions({
        title: `Round ${step} of ${rounds.length}`,
        headerLeft: () => (
          <Pressable onPress={goBack} style={styles.headerBack} accessibilityRole="button" accessibilityLabel="Back">
            <Text style={styles.headerBackText}>‹</Text>
          </Pressable>
        ),
      });
    }
  }, [step, rounds.length, existingGame]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 0) { navigation.goBack(); } else { goBack(); }
      return true;
    });
    return () => sub.remove();
  }, [step]);

  useEffect(() => {
    if (step > 0) scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  const questionnaire = questionnaires.find((q) => q.id === questionnaireId) ?? null;
  const questions     = questionnaire?.questions ?? [];

  function goBack(): void { setStep((s) => Math.max(0, s - 1)); setError(null); setRoundLabelError(undefined); setQuestionErrors(new Set()); }

  function handleCountChange(text: string): void {
    const n = Math.min(Math.max(parseInt(text, 10) || 1, 1), 20);
    setRounds((prev) => makeRounds(n, prev));
  }

  function handleLabelChange(num: number, label: string): void {
    setRounds((prev) => prev.map((r) => (r.number === num ? { ...r, label: label || null } : r)));
  }

  function handleAnswerChange(num: number, answer: Answer): void {
    setRounds((prev) => prev.map((r) => {
      if (r.number !== num) return r;
      const rest = r.correctAnswers.filter((a) => a.questionId !== answer.questionId);
      return { ...r, correctAnswers: [...rest, answer] };
    }));
    setQuestionErrors((prev) => { const next = new Set(prev); next.delete(answer.questionId); return next; });
  }

  function handleSetupContinue(): void {
    const nameErr = !gameName.trim() ? 'Give this game a name.' : undefined;
    const qErr    = !questionnaireId ? 'Select a questionnaire.'
                  : questions.length === 0 ? 'This questionnaire has no questions.'
                  : undefined;
    setGameNameError(nameErr);
    setQuestionnaireError(qErr);
    if (nameErr || qErr) return;
    setStep(1);
  }

  async function handleRoundNext(): Promise<void> {
    const round = rounds[step - 1];
    if (!round.label?.trim()) { setRoundLabelError('Enter the answer for this round.'); return; }
    setRoundLabelError(undefined);
    const missing = new Set(
      questions.filter((q) => !round.correctAnswers.find((a) => a.questionId === q.id)).map((q) => q.id)
    );
    setQuestionErrors(missing);
    if (missing.size > 0) return;
    setError(null);
    if (step < rounds.length) { setStep(step + 1); setRoundLabelError(undefined); setQuestionErrors(new Set()); return; }
    setSaving(true);
    let saved = false;
    try {
      const now = Date.now();
      await saveGame({
        id: existingGame?.id ?? uuidv4(), name: gameName.trim(),
        questionnaireId: questionnaireId!, rounds,
        createdAt: existingGame?.createdAt ?? now, updatedAt: now,
      });
      saved = true;
    } catch (e) {
      console.error('[RoundsBuilder] saveGame failed:', e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
    if (saved) navigation.reset({ index: 1, routes: [{ name: 'SetupGame' }, { name: 'Games' }] });
  }

  // ── Step 0: setup ──────────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <ScreenContainer onPress={Keyboard.dismiss}>
        <View style={styles.setupForm}>
          <TextInput label="Game Name" value={gameName} onChangeText={(t) => { setGameName(t); setGameNameError(undefined); }} placeholder="e.g. Wine Night 2025" error={gameNameError} />

          <Dropdown
            label="Questionnaire"
            placeholder="Tap to select…"
            options={questionnaires.map((q) => ({ value: q.id, label: q.name, subLabel: `${q.questions.length} questions` }))}
            value={questionnaireId}
            onChange={(v) => { setQuestionnaireId(v); setQuestionnaireError(undefined); }}
            error={questionnaireError}
          />

          <TextInput label="Number of Rounds" value={String(rounds.length)} onChangeText={handleCountChange} keyboardType="number-pad" />
        </View>

        <View style={styles.spacer} />

        <View style={styles.setupFooter}>
          <Button label="Continue →" onPress={handleSetupContinue} />
        </View>

      </ScreenContainer>
    );
  }

  // ── Steps 1..N: round answers ──────────────────────────────────────────────
  const currentRound = rounds[step - 1];

  return (
    <ScreenContainer noPadding>
      <ScrollView ref={scrollRef} style={styles.flex1} contentContainerStyle={styles.roundContent}
        keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled">
        <TextInput label="Answer (revealed after the round is over)" value={currentRound.label ?? ''}
          onChangeText={(l) => { handleLabelChange(currentRound.number, l); setRoundLabelError(undefined); }}
          placeholder="e.g. Château Margaux 2018"
          error={roundLabelError} />
        <Divider />
        {questions.map((q, i) => (
          <View key={`${step}-${q.id}`} style={styles.questionBlock}>
            <Text style={styles.questionIndex}>Q{i + 1}</Text>
            <QuestionInput
              question={q}
              answer={currentRound.correctAnswers.find((a) => a.questionId === q.id) ?? null}
              onAnswer={(answer) => handleAnswerChange(currentRound.number, answer)}
              error={questionErrors.has(q.id) ? 'Select an answer for this question.' : undefined}
            />
          </View>
        ))}
      </ScrollView>
      {error !== null && <View style={styles.errorWrap}><ErrorMessage message={error} /></View>}
      <View style={styles.actions}>
        <Button label="← Back" onPress={goBack} variant="secondary" style={styles.actionBtn} />
        <Button label={step < rounds.length ? 'Next →' : existingGame ? 'Update Game' : 'Create Game'} onPress={handleRoundNext} loading={saving} style={styles.actionBtn} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerBack:           { paddingHorizontal: Spacing.sm },
  headerBackText:       { color: Colors.textPrimary, fontSize: FontSize.xl },
  setupForm:            { gap: Spacing.lg },
  spacer:               { flex: 1 },
  setupFooter:          { gap: Spacing.sm, paddingBottom: Spacing.sm },
  flex1:                { flex: 1 },
  roundContent:         { padding: Spacing.md, gap: Spacing.lg },
  questionBlock:        { gap: Spacing.sm },
  questionIndex:        { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  errorWrap:            { paddingHorizontal: Spacing.md },
  actions:              { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border },
  actionBtn:            { flex: 1 },
});
