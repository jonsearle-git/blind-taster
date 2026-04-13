import { StyleSheet, View, Text, FlatList, Pressable, Modal, Keyboard, TextInput as RNTextInput, ScrollView, useWindowDimensions } from 'react-native';
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

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'RoundsBuilder'>;

function makeRounds(n: number, existing: Round[] = []): Round[] {
  return Array.from({ length: n }, (_, i) => existing[i] ?? {
    number: i + 1,
    label: null,
    correctAnswers: [],
  });
}

export default function RoundsBuilderScreen(): React.ReactElement {
  const navigation              = useNavigation<Nav>();
  const route                   = useRoute<Route>();
  const { gameId, questionnaireId: paramQuestionnaireId } = route.params ?? {};
  const { questionnaires }      = useQuestionnaires();
  const { games, save: saveGame } = useGames();

  const existingGame = gameId ? games.find((g) => g.id === gameId) : undefined;

  const [gameName,          setGameName]          = useState('');
  const [questionnaireId,   setQuestionnaireId]   = useState<string | null>(paramQuestionnaireId ?? null);
  const [rounds,            setRounds]            = useState<Round[]>(makeRounds(3));
  const [answerDialogRound, setAnswerDialogRound] = useState<number | null>(null);
  const [error,             setError]             = useState<string | null>(null);
  const [saving,            setSaving]            = useState(false);
  const [showQPicker,       setShowQPicker]       = useState(false);

  const flatListRef      = useRef<FlatList>(null);
  const scrollOffsetRef  = useRef(0);
  const keyboardTopRef   = useRef(0);
  const [listPadding,    setListPadding]   = useState<number>(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      const kbTop = e.endCoordinates.screenY;
      keyboardTopRef.current = kbTop;
      // Pad content so FlatList has room to scroll
      setListPadding(e.endCoordinates.height + Spacing.xl);
      setTimeout(() => {
        const focused = RNTextInput.State.currentlyFocusedInput();
        if (!focused) return;
        focused.measure((_x, _y, _w, h, _px, py) => {
          const inputBottom = py + h + Spacing.md;
          if (inputBottom > kbTop) {
            flatListRef.current?.scrollToOffset({
              offset: scrollOffsetRef.current + (inputBottom - kbTop),
              animated: true,
            });
          }
        });
      }, 50);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      keyboardTopRef.current = 0;
      setListPadding(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  // Load existing game if editing
  useEffect(() => {
    if (existingGame) {
      setGameName(existingGame.name);
      setQuestionnaireId(existingGame.questionnaireId);
      setRounds(existingGame.rounds);
    }
  }, [existingGame]);

  // Auto-fill game name from questionnaire when first selected
  useEffect(() => {
    if (questionnaireId && !gameName) {
      const q = questionnaires.find((q) => q.id === questionnaireId);
      if (q) setGameName(q.name);
    }
  }, [questionnaireId]);

  const questionnaire = questionnaires.find((q) => q.id === questionnaireId) ?? null;
  const questions     = questionnaire?.questions ?? [];

  function handleCountChange(text: string): void {
    const n = Math.min(Math.max(parseInt(text, 10) || 1, 1), 20);
    setRounds((prev) => makeRounds(n, prev));
  }

  function handleLabelChange(number: number, label: string): void {
    setRounds((prev) =>
      prev.map((r) => (r.number === number ? { ...r, label: label || null } : r))
    );
  }

  function handleAnswerChange(roundNumber: number, answer: Answer): void {
    setRounds((prev) =>
      prev.map((r) => {
        if (r.number !== roundNumber) return r;
        const existing = r.correctAnswers.filter((a) => a.questionId !== answer.questionId);
        return { ...r, correctAnswers: [...existing, answer] };
      })
    );
  }

  async function handleContinue(): Promise<void> {
    if (!questionnaireId || !questionnaire) { setError('Select a questionnaire first.'); return; }
    if (!gameName.trim()) { setError('Give this game a name.'); return; }
    for (const round of rounds) {
      for (const q of questions) {
        if (!round.correctAnswers.find((a) => a.questionId === q.id)) {
          setError(`Round ${round.number}: set a correct answer for every question.`);
          setAnswerDialogRound(round.number);
          return;
        }
      }
    }
    setError(null);
    setSaving(true);
    try {
      const now = Date.now();
      await saveGame({
        id:              existingGame?.id ?? uuidv4(),
        name:            gameName.trim(),
        questionnaireId,
        rounds,
        createdAt:       existingGame?.createdAt ?? now,
        updatedAt:       now,
      });
      navigation.navigate('HostLobby', { questionnaireId, rounds });
    } catch {
      setError('Failed to save game. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const { height: windowHeight } = useWindowDimensions();
  const dialogRound = answerDialogRound !== null
    ? rounds.find((r) => r.number === answerDialogRound) ?? null
    : null;

  return (
    <ScreenContainer onPress={Keyboard.dismiss}>
      <TextInput
        label="Game Name"
        value={gameName}
        onChangeText={setGameName}
        placeholder="e.g. Wine Night 2025"
      />

      {/* Questionnaire selector */}
      <View style={styles.qSelectorContainer}>
        <Text style={styles.qSelectorLabel}>Questionnaire</Text>
        <Pressable
          onPress={() => setShowQPicker(true)}
          style={styles.qSelector}
          accessibilityRole="button"
          accessibilityLabel="Select questionnaire"
        >
          <Text style={[styles.qSelectorValue, !questionnaire && styles.qSelectorPlaceholder]}>
            {questionnaire ? questionnaire.name : 'Tap to select…'}
          </Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </View>

      <TextInput
        label="Number of Rounds"
        value={String(rounds.length)}
        onChangeText={handleCountChange}
        keyboardType="number-pad"
      />

      {error !== null && <ErrorMessage message={error} />}

      <Divider />

      <FlatList
        ref={flatListRef}
        data={rounds}
        keyExtractor={(item) => String(item.number)}
        onScroll={(e) => { scrollOffsetRef.current = e.nativeEvent.contentOffset.y; }}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: listPadding }}
        ItemSeparatorComponent={() => <Divider spacing={Spacing.sm} />}
        renderItem={({ item }) => (
          <RoundEditor
            round={item}
            questions={questions}
            onOpenAnswers={() => setAnswerDialogRound(item.number)}
            onLabelChange={(label) => handleLabelChange(item.number, label)}
          />
        )}
      />

      <Button label="Save & Continue to Lobby" onPress={handleContinue} loading={saving} style={styles.proceed} />

      {/* Answers dialog */}
      <Modal
        visible={answerDialogRound !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setAnswerDialogRound(null)}
      >
        <View style={styles.backdrop}>
          <View style={[styles.answersSheet, { maxHeight: windowHeight * 0.75 }]}>
            <Text style={styles.sheetTitle}>
              Round {dialogRound?.number}{dialogRound?.label ? `: ${dialogRound.label}` : ''}
            </Text>
            <ScrollView contentContainerStyle={styles.answersScrollContent}>
              {questions.map((q, index) => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.questionIndex}>Q{index + 1} — {q.prompt || `Question ${index + 1}`}</Text>
                  <QuestionInput
                    question={q}
                    answer={dialogRound?.correctAnswers.find((a) => a.questionId === q.id) ?? null}
                    onAnswer={(answer) => {
                      if (answerDialogRound !== null) handleAnswerChange(answerDialogRound, answer);
                    }}
                  />
                </View>
              ))}
            </ScrollView>
            <Button label="Done" onPress={() => setAnswerDialogRound(null)} style={styles.dialogDone} />
          </View>
        </View>
      </Modal>

      {/* Questionnaire picker modal */}
      <Modal visible={showQPicker} transparent animationType="slide" onRequestClose={() => setShowQPicker(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowQPicker(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Choose Questionnaire</Text>
            {questionnaires.map((q) => (
              <Pressable
                key={q.id}
                onPress={() => { setQuestionnaireId(q.id); setShowQPicker(false); }}
                style={({ pressed }) => [styles.sheetOption, pressed && styles.sheetOptionPressed]}
                accessibilityRole="button"
              >
                <Text style={styles.sheetOptionName}>{q.name}</Text>
                <Text style={styles.sheetOptionMeta}>{q.questions.length} questions</Text>
              </Pressable>
            ))}
            {questionnaires.length === 0 && (
              <Text style={styles.sheetEmpty}>No questionnaires yet. Create one first.</Text>
            )}
          </View>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

type RoundEditorProps = {
  round:          Round;
  questions:      import('../../types/questionnaire').Question[];
  onOpenAnswers:  () => void;
  onLabelChange:  (label: string) => void;
};

function RoundEditor({ round, questions, onOpenAnswers, onLabelChange }: RoundEditorProps): React.ReactElement {
  const answeredCount = round.correctAnswers.length;
  const totalCount    = questions.length;
  const allAnswered   = answeredCount >= totalCount && totalCount > 0;

  return (
    <View style={styles.roundRow}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{round.number}</Text>
      </View>
      <TextInput
        value={round.label ?? ''}
        onChangeText={onLabelChange}
        placeholder={`Round ${round.number} label…`}
        containerStyle={styles.labelInput}
      />
      {questions.length > 0 && (
        <Pressable
          onPress={onOpenAnswers}
          style={[styles.answersBadge, allAnswered && styles.answersBadgeDone]}
          accessibilityRole="button"
          accessibilityLabel={`Set correct answers for round ${round.number}`}
        >
          <Text style={[styles.answersBadgeText, allAnswered && styles.answersBadgeTextDone]}>
            {allAnswered ? '✓' : `${answeredCount}/${totalCount}`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  qSelectorContainer:   { gap: Spacing.xs },
  qSelector:            { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Spacing.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, minHeight: 48 },
  qSelectorLabel:       { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  qSelectorValue:       { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  qSelectorPlaceholder: { color: Colors.textDisabled },
  chevron:              { color: Colors.textDisabled, fontSize: FontSize.xl },
roundRow:             { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  badge:                { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  badgeText:            { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  labelInput:           { flex: 1 },
  answersBadge:         { width: 44, height: 36, borderRadius: Spacing.sm, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  answersBadgeDone:     { borderColor: Colors.success, backgroundColor: Colors.success + '22' },
  answersBadgeText:     { color: Colors.textDisabled, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  answersBadgeTextDone: { color: Colors.success },
  answersSheet:         { backgroundColor: Colors.surface, borderTopLeftRadius: Spacing.lg, borderTopRightRadius: Spacing.lg, padding: Spacing.lg, gap: Spacing.md, borderTopWidth: 1, borderColor: Colors.border },
  answersScrollContent: { gap: Spacing.lg },
  questionBlock:        { gap: Spacing.sm },
  questionIndex:        { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  dialogDone:           { marginTop: Spacing.xs },
  proceed:              { marginTop: Spacing.lg },
  backdrop:             { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  sheet:                { backgroundColor: Colors.surface, borderTopLeftRadius: Spacing.lg, borderTopRightRadius: Spacing.lg, padding: Spacing.lg, gap: Spacing.sm, borderTopWidth: 1, borderColor: Colors.border },
  sheetTitle:           { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: FontWeight.bold, marginBottom: Spacing.sm },
  sheetOption:          { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, borderRadius: Spacing.sm, gap: 2 },
  sheetOptionPressed:   { backgroundColor: Colors.surfaceElevated },
  sheetOptionName:      { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  sheetOptionMeta:      { color: Colors.textSecondary, fontSize: FontSize.sm },
  sheetEmpty:           { color: Colors.textDisabled, fontSize: FontSize.md, textAlign: 'center', paddingVertical: Spacing.md },
});
