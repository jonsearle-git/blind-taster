import { Question, MultipleChoiceTextQuestion, MultipleChoiceNumberQuestion, PriceQuestion, TextInputQuestion, NumberInputQuestion } from '../types/questionnaire';
import { Answer } from '../types/answer';
import { QuestionType } from '../constants/gameConstants';
import { PARTYKIT_HOST } from './config';

const ANALYSE_URL = `https://${PARTYKIT_HOST}/analyse`;

export type GeminiRoundResult = {
  label: string;
  answers: Answer[];
};

function buildPrompt(questions: Question[]): string {
  const questionDescriptions = questions.map((q, i) => {
    switch (q.type) {
      case QuestionType.MultipleChoiceText:
      case QuestionType.MultipleChoiceNumber: {
        const mcq = q as MultipleChoiceTextQuestion | MultipleChoiceNumberQuestion;
        const opts = mcq.options.map((o) => `  - id: "${o.id}", label: "${o.label}"`).join('\n');
        return `Q${i + 1} (id: "${q.id}", type: multiple_choice, prompt: "${q.prompt}")\n  Options:\n${opts}`;
      }
      case QuestionType.Price: {
        const pq = q as PriceQuestion;
        return `Q${i + 1} (id: "${q.id}", type: price, prompt: "${q.prompt}", currency: "${pq.currencySymbol}")`;
      }
      case QuestionType.Tags:
        return `Q${i + 1} (id: "${q.id}", type: tags, prompt: "${q.prompt}") — return tags as array of synonym arrays, e.g. [["grass","vegetal","herbaceous"],["cherry","red fruit"]]`;
      case QuestionType.TextInput: {
        const tq = q as TextInputQuestion;
        return `Q${i + 1} (id: "${tq.id}", type: text_input, prompt: "${tq.prompt}")`;
      }
      case QuestionType.NumberInput: {
        const nq = q as NumberInputQuestion;
        const unit = nq.unit ? `, unit: "${nq.unit}"` : '';
        return `Q${i + 1} (id: "${nq.id}", type: number_input, prompt: "${nq.prompt}"${unit})`;
      }
    }
  }).join('\n\n');

  return `Questions:\n${questionDescriptions}`;
}

export async function analyseLabel(
  base64Image: string,
  mimeType: string,
  questions: Question[],
): Promise<GeminiRoundResult> {
  const res = await fetch(ANALYSE_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      image:    base64Image,
      mimeType,
      prompt:   buildPrompt(questions),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Analysis failed (${res.status}): ${text}`);
  }

  const json = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  const raw  = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const parsed  = JSON.parse(cleaned) as { label: string; answers: Answer[] };

  return { label: parsed.label, answers: parsed.answers };
}
