import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const ROSE: Questionnaire = {
  id: 'seed-q-rose', name: 'Rosé', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'roe-sweetness', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it?',
      options: [
        { id: 'roe-sweet-bone-dry', label: 'Bone dry — no perceptible sweetness' },
        { id: 'roe-sweet-dry',      label: 'Dry — minimal sweetness' },
        { id: 'roe-sweet-off-dry',  label: 'Off-dry — hint of sweetness' },
        { id: 'roe-sweet-sweet',    label: 'Sweet — noticeable sweetness' },
      ],
    },
    {
      id: 'roe-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      options: [
        { id: 'roe-acid-low',    label: 'Low — soft and flat' },
        { id: 'roe-acid-medium', label: 'Medium — fresh and balanced' },
        { id: 'roe-acid-high',   label: 'High — crisp and mouthwatering' },
      ],
    },
    {
      id: 'roe-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'roe-body-light',  label: 'Light — delicate, watery weight' },
        { id: 'roe-body-medium', label: 'Medium — balanced weight' },
        { id: 'roe-body-full',   label: 'Full — rich, weighty, almost red-wine-like' },
      ],
    },
    { id: 'roe-alcohol', type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '13', unit: '%' },
    {
      id: 'roh-method', type: QuestionType.MultipleChoiceText,
      prompt: 'What production method do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'roh-method-direct',   label: 'Direct press — pale, precise, high acid, no tannin' },
        { id: 'roh-method-saignee',  label: 'Saignée — deeper colour, broader body, perceptible tannin' },
        { id: 'roh-method-blending', label: 'Blending — New World, can be confected fruit character' },
      ],
    },
    {
      id: 'roh-tannin', type: QuestionType.MultipleChoiceText,
      prompt: 'Is there any tannin on the palate?',
      difficulty: 'hard',
      options: [
        { id: 'roh-tannin-none',   label: 'None — clean finish, direct press likely' },
        { id: 'roh-tannin-low',    label: 'Low — chalky or powdery dryness' },
        { id: 'roh-tannin-medium', label: 'Medium — noticeable grip, saignée or maceration likely' },
      ],
    },
    {
      id: 'roh-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of rosé is this?',
      difficulty: 'hard',
      options: [
        { id: 'roh-style-provence', label: 'Provence — pale, dry, citrus and herb, mineral' },
        { id: 'roh-style-loire',    label: 'Loire — Cabernet Franc / Pinot, herbal, savoury, crisp' },
        { id: 'roh-style-rosado',   label: 'Spanish Rosado — deeper colour, fuller, riper fruit' },
        { id: 'roh-style-rosato',   label: 'Italian Rosato — fresh, light, savoury, food-friendly' },
        { id: 'roh-style-newworld', label: 'New World — fruit-forward, ripe berries, often off-dry' },
      ],
    },
    {
      id: 'roh-climate', type: QuestionType.MultipleChoiceText,
      prompt: 'What climate does this wine come from?',
      difficulty: 'hard',
      options: [
        { id: 'roh-clim-cool',     label: 'Cool — pale, high acid, restrained fruit, citrus and herb' },
        { id: 'roh-clim-moderate', label: 'Moderate — stone fruit, balanced acid and body' },
        { id: 'roh-clim-warm',     label: 'Warm — deeper colour, riper fruit, lower acid' },
      ],
    },
    { id: 'roe-nose',    type: QuestionType.Tags,      prompt: 'Nose' },
    { id: 'roe-palate',  type: QuestionType.Tags,      prompt: 'Palate' },
    {
      id: 'roe-age', type: QuestionType.MultipleChoiceText,
      prompt: 'How old does this wine taste?',
      options: [
        { id: 'roe-age-young',  label: 'Young — fresh, vibrant, primary fruit' },
        { id: 'roe-age-mature', label: 'Mature — slightly deeper, richer fruit, less acid' },
        { id: 'roe-age-old',    label: 'Old — fading, oxidative notes' },
      ],
    },
    { id: 'roh-year',    type: QuestionType.NumberInput, prompt: 'Vintage year?', placeholder: '2022', difficulty: 'hard' },
    { id: 'roh-grape',   type: QuestionType.TextInput,   prompt: 'What grape variety or blend is this?', placeholder: 'e.g. Grenache', difficulty: 'hard' },
    { id: 'roh-region',  type: QuestionType.TextInput,   prompt: 'What region is it from?', placeholder: 'e.g. Provence', difficulty: 'hard' },
    { id: 'roe-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. France' },
    { id: 'roe-price',   type: QuestionType.Price,       prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
