import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import type { Questionnaire, Question, MultipleChoiceOption } from '../types/questionnaire';
import { QuestionType } from '../constants/gameConstants';

// Case-insensitive, whitespace-trimmed uniqueness check.
export function isNameUnique(name: string, existing: { id: string; name: string }[], excludeId?: string): boolean {
  const target = name.trim().toLowerCase();
  if (!target) return true; // empty is its own error; not a uniqueness problem
  return !existing.some((e) => e.id !== excludeId && e.name.trim().toLowerCase() === target);
}

// Picks "Base (copy)", "Base (copy 2)", "Base (copy 3)" — first one that doesn't collide.
export function generateCopyName(base: string, existing: { name: string }[]): string {
  const taken = new Set(existing.map((e) => e.name.trim().toLowerCase()));
  const first = `${base.trim()} (copy)`;
  if (!taken.has(first.toLowerCase())) return first;
  let n = 2;
  while (taken.has(`${base.trim()} (copy ${n})`.toLowerCase())) n++;
  return `${base.trim()} (copy ${n})`;
}

// Deep-clone a questionnaire with new IDs for the questionnaire, every question,
// and every option. Caller is responsible for naming.
export function cloneQuestionnaire(source: Questionnaire, newName: string): Questionnaire {
  const now = Date.now();
  return {
    id:        uuid(),
    name:      newName,
    createdAt: now,
    updatedAt: now,
    questions: source.questions.map(cloneQuestion),
  };
}

function cloneQuestion(q: Question): Question {
  const id = uuid();
  switch (q.type) {
    case QuestionType.MultipleChoiceText:
    case QuestionType.MultipleChoiceNumber:
      return { ...q, id, options: q.options.map(cloneOption) };
    default:
      return { ...q, id };
  }
}

function cloneOption(o: MultipleChoiceOption): MultipleChoiceOption {
  return { id: uuid(), label: o.label };
}
