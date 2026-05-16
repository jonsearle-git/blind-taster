import { StyleSheet, View, Text, Pressable, Keyboard, ScrollView, BackHandler } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Round } from '../../types/game';
import { Answer } from '../../types/answer';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { useGames } from '../../hooks/useGames';
import { isNameUnique } from '../../lib/questionnaires';
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
        headerLeft: undefined,
      });
    } else {
      navigation.setOptions({
        title: `Round ${step} of ${rounds.length}`,
        headerLeft: () => (
          <Pressable onPress={goBack} hitSlop={8} accessibilityRole="button" accessibilityLabel="Back">
            <Text style={styles.headerBack}>‹</Text>
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

  function adjustRoundCount(delta: number): void {
    setRounds((prev) => {
      const n = Math.min(Math.max(prev.length + delta, 1), 20);
      return makeRounds(n, prev);
    });
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
    const trimmed = gameName.trim();
    let nameErr: string | undefined;
    if (!trimmed) nameErr = 'Give this game a name.';
    else if (!isNameUnique(trimmed, games, existingGame?.id)) nameErr = 'A game with this name already exists.';
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
        <ScrollView contentContainerStyle={styles.setupScroll} keyboardShouldPersistTaps="handled">
          <View style={styles.setupForm}>
            {/* Game Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.sectionLabel}>Game Name</Text>
              <TextInput
                value={gameName}
                onChangeText={(t) => { setGameName(t); setGameNameError(undefined); }}
                placeholder="e.g. Wine Night 2025"
                error={gameNameError}
              />
            </View>

            {/* Questionnaire */}
            <View style={styles.fieldGroup}>
              <Text style={styles.sectionLabel}>Questionnaire</Text>
              <Dropdown
                placeholder="Tap to select…"
                options={questionnaires.map((q) => ({ value: q.id, label: q.name, subLabel: `${q.questions.length} questions` }))}
                value={questionnaireId}
                onChange={(v) => { setQuestionnaireId(v); setQuestionnaireError(undefined); }}
                error={questionnaireError}
              />
            </View>

            {/* Number of Rounds — stepper */}
            <View style={styles.fieldGroup}>
              <Text style={styles.sectionLabel}>Number of Rounds</Text>
              <View style={styles.stepper}>
                <View style={styles.stepBtnShadowWrap}>
                  <View style={styles.stepBtnShadow} />
                  <Pressable
                    onPress={() => adjustRoundCount(-1)}
                    style={({ pressed }) => [styles.stepBtn, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel="Decrease rounds"
                  >
                    <Text style={styles.stepBtnText}>−</Text>
                  </Pressable>
                </View>

                <View style={styles.stepCountWrap}>
                  <View style={styles.stepCountShadow} />
                  <View style={styles.stepCount}>
                    <Text style={styles.stepCountText}>{rounds.length}</Text>
                  </View>
                </View>

                <View style={styles.stepBtnShadowWrap}>
                  <View style={styles.stepBtnShadowMint} />
                  <Pressable
                    onPress={() => adjustRoundCount(1)}
                    style={({ pressed }) => [styles.stepBtn, styles.stepBtnMint, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel="Increase rounds"
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

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

        {/* Sample reveal field */}
        <View style={styles.revealCardShadowWrap}>
          <View style={[styles.revealCardShadow, { backgroundColor: Colors.sun }]} />
          <View style={styles.revealCard}>
            <Text style={styles.revealLabel}>Sample · Revealed after the round</Text>
            <TextInput
              value={currentRound.label ?? ''}
              onChangeText={(l) => { handleLabelChange(currentRound.number, l); setRoundLabelError(undefined); }}
              placeholder="e.g. Château Margaux 2018"
              error={roundLabelError}
            />
          </View>
        </View>

        <Divider />

        {questions.map((q, i) => (
          <View key={`${step}-${q.id}`} style={styles.questionBlock}>
            <Text style={styles.questionIndex}>Q{i + 1} · The correct answer</Text>
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
  // Step 0
  setupScroll:   { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.md },
  setupForm:     { gap: Spacing.xl },
  fieldGroup:    { gap: Spacing.sm },
  sectionLabel:  { fontFamily: FontFamily.body, color: Colors.ink, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 },
  stepper:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  stepBtnShadowWrap: { position: 'relative' },
  stepBtnShadow:     { position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, borderRadius: BorderRadius.pill, backgroundColor: Colors.ink },
  stepBtnShadowMint: { position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, borderRadius: BorderRadius.pill, backgroundColor: Colors.ink },
  stepBtn:       { width: 50, height: 50, borderRadius: BorderRadius.pill, backgroundColor: Colors.cream, borderWidth: 2.5, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  stepBtnMint:   { backgroundColor: Colors.mint },
  stepBtnText:   { fontFamily: FontFamily.display, fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.ink },
  pressed:       { opacity: 0.7 },
  stepCountWrap: { flex: 1, position: 'relative' },
  stepCountShadow:{ position: 'absolute', top: 3, left: 3, right: -3, bottom: -3, borderRadius: BorderRadius.pill, backgroundColor: Colors.ink },
  stepCount:     { height: 50, borderRadius: BorderRadius.pill, backgroundColor: Colors.cream, borderWidth: 2.5, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  stepCountText: { fontFamily: FontFamily.display, fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.ink },
  setupFooter:   { gap: Spacing.sm, padding: Spacing.md, paddingBottom: Spacing.sm },

  // Steps 1..N
  headerBack:    { color: Colors.ink, fontSize: FontSize.xxl, fontWeight: FontWeight.black, lineHeight: FontSize.xxl },
  flex1:         { flex: 1 },
  roundContent:  { padding: Spacing.md, gap: Spacing.lg },
  revealCardShadowWrap: { position: 'relative' },
  revealCardShadow:     { position: 'absolute', top: 4, left: 4, right: -4, bottom: -4, borderRadius: BorderRadius.md, backgroundColor: Colors.ink },
  revealCard:    { backgroundColor: Colors.plum, borderWidth: 2.5, borderColor: Colors.ink, borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.sm },
  revealLabel:   { fontFamily: FontFamily.body, color: Colors.sun, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1.5, textTransform: 'uppercase' },
  questionBlock: { gap: Spacing.sm },
  questionIndex: { color: Colors.melon, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 1, textTransform: 'uppercase', fontFamily: FontFamily.body },
  errorWrap:     { paddingHorizontal: Spacing.md },
  actions:       { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.md, borderTopWidth: 2.5, borderTopColor: Colors.ink, backgroundColor: Colors.cream },
  actionBtn:     { flex: 1 },
});
