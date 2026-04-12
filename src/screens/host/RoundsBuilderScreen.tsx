import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Round } from '../../types/game';
import { Answer } from '../../types/answer';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
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
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { questionnaireId } = route.params;
  const { questionnaires }  = useQuestionnaires();

  const questionnaire = questionnaires.find((q) => q.id === questionnaireId) ?? null;
  const questions     = questionnaire?.questions ?? [];

  const [rounds, setRounds]     = useState<Round[]>(makeRounds(3));
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError]       = useState<string | null>(null);

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

  function handleContinue(): void {
    if (!questionnaire) { setError('Questionnaire not found.'); return; }
    // Validate: every round must have a correct answer for every question
    for (const round of rounds) {
      for (const q of questions) {
        if (!round.correctAnswers.find((a) => a.questionId === q.id)) {
          setError(`Round ${round.number}: set a correct answer for every question.`);
          setExpanded(round.number);
          return;
        }
      }
    }
    setError(null);
    navigation.navigate('HostLobby', { questionnaireId, rounds });
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Set Up Rounds</Text>
        <Text style={styles.subtitle}>How many items are being tested?</Text>
      </View>

      <TextInput
        label="Number of Rounds"
        value={String(rounds.length)}
        onChangeText={handleCountChange}
        keyboardType="number-pad"
      />

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Round labels and correct answers are hidden from players until the end of the game.
        </Text>
      </View>

      {error !== null && <ErrorMessage message={error} />}

      <Divider />

      <FlatList
        data={rounds}
        keyExtractor={(item) => String(item.number)}
        ItemSeparatorComponent={() => <Divider spacing={Spacing.sm} />}
        renderItem={({ item }) => (
          <RoundEditor
            round={item}
            questions={questions}
            expanded={expanded === item.number}
            onToggle={() => setExpanded(expanded === item.number ? null : item.number)}
            onLabelChange={(label) => handleLabelChange(item.number, label)}
            onAnswerChange={(answer) => handleAnswerChange(item.number, answer)}
          />
        )}
      />

      <Button
        label="Continue to Lobby"
        onPress={handleContinue}
        style={styles.proceed}
      />
    </ScreenContainer>
  );
}

type RoundEditorProps = {
  round:          Round;
  questions:      import('../../types/questionnaire').Question[];
  expanded:       boolean;
  onToggle:       () => void;
  onLabelChange:  (label: string) => void;
  onAnswerChange: (answer: Answer) => void;
};

function RoundEditor({ round, questions, expanded, onToggle, onLabelChange, onAnswerChange }: RoundEditorProps): React.ReactElement {
  const answeredCount = round.correctAnswers.length;
  const totalCount    = questions.length;
  const allAnswered   = answeredCount >= totalCount && totalCount > 0;

  return (
    <View>
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
            onPress={onToggle}
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

      {expanded && questions.length > 0 && (
        <View style={styles.answersSection}>
          <Text style={styles.answersTitle}>Correct answers for Round {round.number}</Text>
          {questions.map((q, index) => (
            <View key={q.id} style={styles.questionBlock}>
              <Text style={styles.questionIndex}>Q{index + 1} — {q.prompt || `Question ${index + 1}`}</Text>
              <QuestionInput
                question={q}
                answer={round.correctAnswers.find((a) => a.questionId === q.id) ?? null}
                onAnswer={onAnswerChange}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header:               { paddingVertical: Spacing.lg, gap: Spacing.xs },
  title:                { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  subtitle:             { color: Colors.textSecondary, fontSize: FontSize.md },
  notice:               { backgroundColor: Colors.surfaceElevated, borderRadius: Spacing.sm, borderLeftWidth: 3, borderLeftColor: Colors.gold, padding: Spacing.md, marginVertical: Spacing.sm },
  noticeText:           { color: Colors.textSecondary, fontSize: FontSize.sm },
  roundRow:             { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xs },
  badge:                { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  badgeText:            { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  labelInput:           { flex: 1 },
  answersBadge:         { width: 44, height: 36, borderRadius: Spacing.sm, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  answersBadgeDone:     { borderColor: Colors.success, backgroundColor: Colors.success + '22' },
  answersBadgeText:     { color: Colors.textDisabled, fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  answersBadgeTextDone: { color: Colors.success },
  answersSection:       { marginTop: Spacing.sm, marginLeft: Spacing.xl, backgroundColor: Colors.surface, borderRadius: Spacing.sm, padding: Spacing.md, gap: Spacing.lg, borderLeftWidth: 2, borderLeftColor: Colors.surfaceElevated },
  answersTitle:         { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  questionBlock:        { gap: Spacing.sm },
  questionIndex:        { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  proceed:              { marginTop: Spacing.lg },
});
