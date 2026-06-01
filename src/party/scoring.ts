import { QuestionType } from '../constants/gameConstants';
import type { Answer } from '../types/answer';
import type { Question } from '../types/questionnaire';
import type { QuestionResult } from '../types/results';

// ─── Fuzzy text scoring ───────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/\p{M}/gu, '')  // strip diacritics
    .replace(/[^\w\s]/g, '')                  // strip punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeAccented(s: string): string {
  return s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

// Returns true if playerToken is close enough to correctToken given word length.
// Threshold: words ≤4 chars must match exactly; 5-7 allow 1 edit; 8+ allow 2 edits.
function fuzzyTokenMatch(playerToken: string, correctToken: string): boolean {
  if (playerToken === correctToken) return true;
  const maxLen = Math.max(playerToken.length, correctToken.length);
  const allowed = maxLen <= 4 ? 0 : maxLen <= 7 ? 1 : 2;
  return levenshtein(playerToken, correctToken) <= allowed;
}

// Levenshtein-corrected Jaccard: count a player token as matched if it fuzzy-matches
// any correct token. Score = matched / union, scaled to 80pts max.
function fuzzyJaccardScore(playerTokens: string[], correctTokens: string[]): number {
  if (correctTokens.length === 0) return 80;
  const union = new Set([...playerTokens, ...correctTokens]).size;
  let matched = 0;
  const usedCorrect = new Set<number>();
  for (const pt of playerTokens) {
    for (let i = 0; i < correctTokens.length; i++) {
      if (!usedCorrect.has(i) && fuzzyTokenMatch(pt, correctTokens[i])) {
        matched++;
        usedCorrect.add(i);
        break;
      }
    }
  }
  return Math.round((matched / union) * 80);
}

export function scoreTextAnswer(player: string, correct: string): number {
  if (!correct.trim()) return 100;
  if (!player.trim()) return 0;

  // Step 1+2: exact match with accents preserved → 100pts
  const pAccented = normalizeAccented(player);
  const cAccented = normalizeAccented(correct);
  if (pAccented === cAccented) return 100;

  // Step 1+2: exact match after accent strip → 95pts
  const p = normalize(player);
  const c = normalize(correct);
  if (p === c) return 95;

  // Step 4: token sort + exact match → 95pts
  const pSorted = p.split(' ').sort().join(' ');
  const cSorted = c.split(' ').sort().join(' ');
  if (pSorted === cSorted) return 95;

  // Step 5: player answer ⊂ correct answer (player subset only) → 90pts
  if (c.includes(p) && p.length > 0) return 90;

  // Steps 6+7: levenshtein-corrected Jaccard → max 80pts
  const pTokens = p.split(' ').filter(Boolean);
  const cTokens = c.split(' ').filter(Boolean);
  return fuzzyJaccardScore(pTokens, cTokens);
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

/**
 * Score a single answer against an explicit correct answer.
 * The question is needed for type context and range information (slider).
 */
export function scoreAnswer(question: Question, playerAnswer: Answer, correctAnswer: Answer): number {
  switch (question.type) {
    case QuestionType.MultipleChoiceText:
    case QuestionType.MultipleChoiceNumber: {
      if (playerAnswer.type !== question.type) return 0;
      if (correctAnswer.type !== question.type) return 0;
      return playerAnswer.selectedOptionId === correctAnswer.selectedOptionId ? 100 : 0;
    }
    case QuestionType.Tags: {
      if (playerAnswer.type !== QuestionType.Tags)  return 0;
      if (correctAnswer.type !== QuestionType.Tags) return 0;
      if (correctAnswer.tags.length === 0) return 100;

      const playerTags = playerAnswer.tags as string[];

      // Correct answer is string[][] (synonym groups from Gemini) or legacy string[].
      const isSynonymList = Array.isArray(correctAnswer.tags[0]);
      const correctGroups: string[][] = isSynonymList
        ? (correctAnswer.tags as string[][])
        : (correctAnswer.tags as string[]).map((t) => [t]);

      const usedCorrect = new Set<number>();
      let matched = 0;
      for (const pt of playerTags) {
        const pNorm = normalize(pt);
        for (let i = 0; i < correctGroups.length; i++) {
          if (!usedCorrect.has(i) && correctGroups[i].some((syn) => fuzzyTokenMatch(pNorm, normalize(syn)))) {
            matched++;
            usedCorrect.add(i);
            break;
          }
        }
      }
      // Union: player tags + one representative (first synonym) per correct group.
      const correctRep = correctGroups.map((g) => normalize(g[0]));
      const union = new Set([...playerTags.map(normalize), ...correctRep]).size;
      return Math.round((matched / union) * 100);
    }
    case QuestionType.Price: {
      if (playerAnswer.type !== QuestionType.Price)  return 0;
      if (correctAnswer.type !== QuestionType.Price) return 0;
      if (correctAnswer.value === 0) return playerAnswer.value === 0 ? 100 : 0;
      const pctError = Math.abs(playerAnswer.value - correctAnswer.value) / correctAnswer.value;
      return Math.max(0, Math.round(100 * (1 - Math.min(1, pctError))));
    }
    case QuestionType.TextInput: {
      if (playerAnswer.type !== QuestionType.TextInput)  return 0;
      if (correctAnswer.type !== QuestionType.TextInput) return 0;
      return scoreTextAnswer(playerAnswer.value, correctAnswer.value);
    }
    case QuestionType.NumberInput: {
      if (playerAnswer.type !== QuestionType.NumberInput)  return 0;
      if (correctAnswer.type !== QuestionType.NumberInput) return 0;
      if (correctAnswer.value === 0) return playerAnswer.value === 0 ? 100 : 0;
      const pctError = Math.abs(playerAnswer.value - correctAnswer.value) / correctAnswer.value;
      return Math.max(0, Math.round(100 * (1 - Math.min(1, pctError))));
    }
  }
}

// ─── Display helpers ─────────────────────────────────────────────────────────

/** Resolve an Answer to a human-readable string using the question's option/tag definitions. */
export function formatAnswerForDisplay(question: Question, answer: Answer): string {
  switch (question.type) {
    case QuestionType.MultipleChoiceText:
    case QuestionType.MultipleChoiceNumber: {
      if (answer.type !== question.type) return '—';
      return question.options.find((o) => o.id === answer.selectedOptionId)?.label ?? answer.selectedOptionId;
    }
    case QuestionType.Tags: {
      if (answer.type !== QuestionType.Tags) return '—';
      if (answer.tags.length === 0) return '(none)';
      const isSynonymList = Array.isArray(answer.tags[0]);
      const display = isSynonymList
        ? (answer.tags as string[][]).map((g) => g[0]).join(', ')
        : (answer.tags as string[]).join(', ');
      return display;
    }
    case QuestionType.Price: {
      if (answer.type !== QuestionType.Price) return '—';
      return `${question.currencySymbol}${answer.value.toFixed(2)}`;
    }
    case QuestionType.TextInput: {
      if (answer.type !== QuestionType.TextInput) return '—';
      return answer.value.trim() || '(no answer)';
    }
    case QuestionType.NumberInput: {
      if (answer.type !== QuestionType.NumberInput) return '—';
      return question.unit ? `${answer.value} ${question.unit}` : String(answer.value);
    }
  }
}

// ─── Grade ───────────────────────────────────────────────────────────────────

/**
 * Grade all of a player's answers for one round against the round's correct answers.
 * correctAnswers is the host-supplied answer key for this specific round.
 */
export function gradePlayerAnswers(
  questions: Question[],
  playerAnswers: Answer[],
  correctAnswers: Answer[],
): QuestionResult[] {
  const playerMap  = new Map<string, Answer>(playerAnswers.map((a) => [a.questionId, a]));
  const correctMap = new Map<string, Answer>(correctAnswers.map((a) => [a.questionId, a]));

  return questions.map((question) => {
    const correctAnswer = correctMap.get(question.id);
    const playerAnswer  = playerMap.get(question.id);

    if (!correctAnswer) {
      // No correct answer was provided for this question — award 0, display placeholder.
      const fallback = playerAnswer ?? { questionId: question.id, type: question.type } as Answer;
      return {
        questionId:         question.id,
        prompt:             question.prompt,
        playerAnswer:       fallback,
        correctAnswer:      fallback,
        playerAnswerLabel:  playerAnswer ? formatAnswerForDisplay(question, playerAnswer) : '—',
        correctAnswerLabel: '—',
        pointsAwarded:      0,
      };
    }

    const points = playerAnswer ? scoreAnswer(question, playerAnswer, correctAnswer) : 0;

    return {
      questionId:         question.id,
      prompt:             question.prompt,
      playerAnswer:       playerAnswer ?? correctAnswer,
      correctAnswer,
      playerAnswerLabel:  playerAnswer ? formatAnswerForDisplay(question, playerAnswer) : '(no answer)',
      correctAnswerLabel: formatAnswerForDisplay(question, correctAnswer),
      pointsAwarded:      points,
    };
  });
}
