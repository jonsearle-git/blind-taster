import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const WHITE_WINE: Questionnaire = {
  id: 'seed-q-white-wine', name: 'White Wine', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'wwe-sweetness', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it?',
      options: [
        { id: 'wwe-sweet-bone-dry',  label: 'Bone dry — no perceptible sweetness' },
        { id: 'wwe-sweet-dry',       label: 'Dry — minimal sweetness' },
        { id: 'wwe-sweet-off-dry',   label: 'Off-dry — hint of sweetness' },
        { id: 'wwe-sweet-sweet',     label: 'Sweet — noticeable sweetness' },
        { id: 'wwe-sweet-very',      label: 'Very sweet — dessert, botrytis or late harvest' },
      ],
    },
    {
      id: 'wwe-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      options: [
        { id: 'wwe-acid-low',    label: 'Low — soft and flat' },
        { id: 'wwe-acid-med',    label: 'Medium — fresh and balanced' },
        { id: 'wwe-acid-high',   label: 'High — crisp and mouthwatering' },
        { id: 'wwh-acid-racy',   label: 'Racy — piercing, almost electric' },
      ],
    },
    {
      id: 'wwe-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'wwe-body-light',  label: 'Light — delicate, watery weight' },
        { id: 'wwe-body-medium', label: 'Medium — balanced, neither lean nor full' },
        { id: 'wwe-body-full',   label: 'Full — rich, weighty, oily' },
      ],
    },
    { id: 'wwe-alcohol', type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '13', unit: '%' },
    {
      id: 'wwe-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      options: [
        { id: 'wwe-fin-short',  label: 'Short — fades within seconds' },
        { id: 'wwe-fin-medium', label: 'Medium — lingers pleasantly' },
        { id: 'wwe-fin-long',   label: 'Long — stays with you a good while' },
      ],
    },
    {
      id: 'wwh-oak', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you detect oak influence?',
      difficulty: 'hard',
      options: [
        { id: 'wwh-oak-none',      label: 'Unoaked — pure fruit, no wood' },
        { id: 'wwh-oak-light',     label: 'Lightly oaked — subtle vanilla & spice' },
        { id: 'wwh-oak-medium',    label: 'Medium oak — vanilla, toast, some cream' },
        { id: 'wwh-oak-heavy',     label: 'Heavily oaked — dominant vanilla, toast, butter' },
        { id: 'wwh-oak-oxidative', label: 'Oxidative / nutty — aged without oxygen exclusion' },
      ],
    },
    {
      id: 'wwh-climate', type: QuestionType.MultipleChoiceText,
      prompt: 'What climate does this wine come from?',
      difficulty: 'hard',
      options: [
        { id: 'wwh-clim-cool',     label: 'Cool — green apple, citrus, high acid, low alcohol' },
        { id: 'wwh-clim-moderate', label: 'Moderate — stone fruit, balanced acid and alcohol' },
        { id: 'wwh-clim-warm',     label: 'Warm — tropical fruit, low acid, high alcohol' },
      ],
    },
    {
      id: 'wwh-world', type: QuestionType.MultipleChoiceText,
      prompt: 'Old World or New World?',
      difficulty: 'hard',
      options: [
        { id: 'wwh-world-old', label: 'Old World — earthy, mineral, restrained, savoury' },
        { id: 'wwh-world-new', label: 'New World — fruit-forward, ripe, generous' },
      ],
    },
    {
      id: 'wwh-mlf', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you detect malolactic fermentation?',
      difficulty: 'hard',
      options: [
        { id: 'wwh-mlf-none',    label: 'None — crisp, sharp malic acid' },
        { id: 'wwh-mlf-partial', label: 'Partial — softened, some creamy texture' },
        { id: 'wwh-mlf-full',    label: 'Full — buttery, creamy, rounded' },
      ],
    },
    {
      id: 'wwh-lees', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you detect lees character?',
      difficulty: 'hard',
      options: [
        { id: 'wwh-lees-none',  label: 'None — clean, fruit-driven' },
        { id: 'wwh-lees-light', label: 'Light — subtle bready or yeasty notes' },
        { id: 'wwh-lees-heavy', label: 'Heavy — pronounced bread, brioche, biscuit, savoury' },
      ],
    },
    { id: 'wwe-nose',    type: QuestionType.Tags,        prompt: 'Nose' },
    { id: 'wwe-palate',  type: QuestionType.Tags,        prompt: 'Palate' },
    {
      id: 'wwe-age', type: QuestionType.MultipleChoiceText,
      prompt: 'How old does this wine taste?',
      options: [
        { id: 'wwe-age-young',  label: 'Young — primary fruit, vibrant, fresh' },
        { id: 'wwe-age-mature', label: 'Mature — tertiary notes, honey, toast, nuttiness' },
        { id: 'wwe-age-old',    label: 'Old — fading fruit, waxy, oxidative, petrol' },
      ],
    },
    { id: 'wwh-year',    type: QuestionType.NumberInput, prompt: 'Vintage year?', placeholder: '2019', difficulty: 'hard' },
    { id: 'wwh-grape',   type: QuestionType.TextInput,   prompt: 'What grape variety is this?', placeholder: 'e.g. Chardonnay', difficulty: 'hard' },
    { id: 'wwh-region',  type: QuestionType.TextInput,   prompt: 'What region is it from?', placeholder: 'e.g. Burgundy', difficulty: 'hard' },
    { id: 'wwe-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. France' },
    { id: 'wwe-price',   type: QuestionType.Price,       prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
