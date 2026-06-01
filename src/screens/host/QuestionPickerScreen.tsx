import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { v4 as uuidv4 } from 'uuid';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { RevealMode } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { Round } from '../../types/game';
import { useQuestionnaires } from '../../hooks/useQuestionnaires';
import { useGames } from '../../hooks/useGames';
import { useGameContext } from '../../context/GameContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'QuestionPicker'>;

const TYPE_LABELS: Record<string, string> = {
  multiple_choice_text:   'Multiple Choice',
  multiple_choice_number: 'Multiple Choice',
  tags:                   'Tags',
  price:                  'Price',
  text_input:             'Text',
  number_input:           'Number',
};

export default function QuestionPickerScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { questionnaireId } = route.params;

  const { questionnaires } = useQuestionnaires();
  const { save: saveGame } = useGames();
  const { dispatch }       = useGameContext();

  const questionnaire = questionnaires.find((q) => q.id === questionnaireId) ?? null;
  const allQuestions  = questionnaire?.questions ?? [];

  const [difficulty,  setDifficulty]  = useState<'easy' | 'hard'>('easy');
  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [revealMode,  setRevealMode]  = useState<RevealMode>(RevealMode.AfterEachRound);
  const [starting,    setStarting]    = useState(false);

  function questionsForDifficulty(diff: 'easy' | 'hard'): Set<string> {
    return new Set(
      allQuestions
        .filter((q) => diff === 'hard' || q.difficulty !== 'hard')
        .map((q) => q.id)
    );
  }

  useEffect(() => {
    setDifficulty('easy');
    setSelected(questionsForDifficulty('easy'));
  }, [questionnaireId, allQuestions.length]);

  function handleDifficultyChange(diff: 'easy' | 'hard'): void {
    setDifficulty(diff);
    setSelected(questionsForDifficulty(diff));
  }

  function toggleQuestion(id: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  async function handleStart(): Promise<void> {
    if (!questionnaire || selected.size === 0) return;
    setStarting(true);
    try {
      const filteredQuestionnaire = {
        ...questionnaire,
        questions: questionnaire.questions.filter((q) => selected.has(q.id)),
      };
      // Start with a single placeholder round — more are added as photos are taken
      const rounds: Round[] = [{ number: 1, label: null, correctAnswers: [] }];
      const gameId = uuidv4();
      await saveGame({
        id:                gameId,
        name:              filteredQuestionnaire.name,
        questionnaireId:   filteredQuestionnaire.id,
        filteredQuestions: filteredQuestionnaire.questions,
        revealMode,
        rounds,
        createdAt:         Date.now(),
        updatedAt:         Date.now(),
      });
      dispatch({ type: 'RESET' });
      dispatch({ type: 'SET_ACTIVE_GAME_ID', payload: gameId });
      navigation.navigate('HostGame', { questionnaireId: filteredQuestionnaire.id, rounds, revealMode, filteredQuestions: filteredQuestionnaire.questions });
    } finally {
      setStarting(false);
    }
  }

  return (
    <ScreenContainer noPadding>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Reveal mode toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Reveal Answers</Text>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => setRevealMode(RevealMode.AfterEachRound)}
              style={[styles.toggleBtn, revealMode === RevealMode.AfterEachRound && styles.toggleBtnOn]}
              accessibilityRole="radio"
              accessibilityState={{ selected: revealMode === RevealMode.AfterEachRound }}
            >
              <Text style={[styles.toggleBtnText, revealMode === RevealMode.AfterEachRound && styles.toggleBtnTextOn]}>
                After Each Round
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setRevealMode(RevealMode.EndOfGame)}
              style={[styles.toggleBtn, revealMode === RevealMode.EndOfGame && styles.toggleBtnOn]}
              accessibilityRole="radio"
              accessibilityState={{ selected: revealMode === RevealMode.EndOfGame }}
            >
              <Text style={[styles.toggleBtnText, revealMode === RevealMode.EndOfGame && styles.toggleBtnTextOn]}>
                End of Game
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Difficulty toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Difficulty</Text>
          <View style={styles.toggleRow}>
            <Pressable
              onPress={() => handleDifficultyChange('easy')}
              style={[styles.toggleBtn, difficulty === 'easy' && styles.toggleBtnOn]}
              accessibilityRole="radio"
              accessibilityState={{ selected: difficulty === 'easy' }}
            >
              <Text style={[styles.toggleBtnText, difficulty === 'easy' && styles.toggleBtnTextOn]}>Easy</Text>
            </Pressable>
            <Pressable
              onPress={() => handleDifficultyChange('hard')}
              style={[styles.toggleBtn, difficulty === 'hard' && styles.toggleBtnOn]}
              accessibilityRole="radio"
              accessibilityState={{ selected: difficulty === 'hard' }}
            >
              <Text style={[styles.toggleBtnText, difficulty === 'hard' && styles.toggleBtnTextOn]}>Hard</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Questions</Text>
          <View style={styles.questionList}>
            {allQuestions.map((q, i) => {
              const on = selected.has(q.id);
              return (
                <Pressable
                  key={q.id}
                  onPress={() => toggleQuestion(q.id)}
                  style={({ pressed }) => [styles.questionRow, pressed && styles.pressed]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                >
                  <View style={[styles.checkbox, on && styles.checkboxOn]}>
                    {on && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={styles.questionText}>
                    <Text style={styles.questionPrompt} numberOfLines={2}>{q.prompt}</Text>
                    <Text style={styles.questionType}>{TYPE_LABELS[q.type] ?? q.type}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={'Start Game ▶︎'}
          onPress={handleStart}
          loading={starting}
          disabled={selected.size === 0}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll:         { padding: Spacing.md, gap: Spacing.xl, paddingBottom: Spacing.lg },
  section:        { gap: Spacing.sm },
  sectionLabel:   { fontFamily: FontFamily.body, color: Colors.ink, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7 },
  toggleRow:      { flexDirection: 'row', gap: Spacing.sm },
  toggleBtn:      { flex: 1, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.sm, borderRadius: BorderRadius.md, borderWidth: 2.5, borderColor: Colors.ink, alignItems: 'center', backgroundColor: Colors.cream, shadowColor: Colors.ink, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  toggleBtnOn:    { backgroundColor: Colors.melon },
  toggleBtnText:  { fontFamily: FontFamily.heading, color: Colors.ink, fontSize: FontSize.sm, fontWeight: FontWeight.black, textAlign: 'center' },
  toggleBtnTextOn:{ color: Colors.cream },
  questionList:   { gap: Spacing.sm },
  questionRow:    { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.cream, borderRadius: BorderRadius.md, borderWidth: 2.5, borderColor: Colors.ink, padding: Spacing.sm, shadowColor: Colors.ink, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  pressed:        { opacity: 0.7 },
  checkbox:       { width: 28, height: 28, borderRadius: 8, borderWidth: 2.5, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cream, flexShrink: 0 },
  checkboxOn:     { backgroundColor: Colors.melon, borderColor: Colors.melon },
  checkmark:      { color: Colors.cream, fontSize: FontSize.sm, fontWeight: FontWeight.black },
  questionText:   { flex: 1, gap: 2 },
  questionPrompt: { fontFamily: FontFamily.heading, color: Colors.ink, fontSize: FontSize.sm, fontWeight: FontWeight.black, lineHeight: FontSize.sm * 1.3 },
  questionType:   { fontFamily: FontFamily.body, color: Colors.ink, fontSize: FontSize.xs, opacity: 0.5, letterSpacing: 0.5, textTransform: 'uppercase' },
  hardBadge:      { backgroundColor: Colors.plum, borderRadius: BorderRadius.pill, paddingHorizontal: Spacing.sm, paddingVertical: 3, flexShrink: 0 },
  hardBadgeText:  { fontFamily: FontFamily.heading, color: Colors.cream, fontSize: FontSize.xs, fontWeight: FontWeight.black, letterSpacing: 0.5 },
  footer:         { padding: Spacing.md, borderTopWidth: 2.5, borderTopColor: Colors.ink, backgroundColor: Colors.cream },
});
