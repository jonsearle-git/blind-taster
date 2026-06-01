import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const RED_WINE: Questionnaire = {
  id: 'seed-q-red-wine', name: 'Red Wine', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'rwe-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'rwe-body-light',  label: 'Light — pale, delicate' },
        { id: 'rwe-body-medium', label: 'Medium — smooth and balanced' },
        { id: 'rwe-body-full',   label: 'Full — rich and structured' },
      ],
    },
    {
      id: 'rwe-tannin', type: QuestionType.MultipleChoiceText,
      prompt: 'How are the tannins?',
      options: [
        { id: 'rwe-tannin-soft',   label: 'Soft — silky, barely noticeable' },
        { id: 'rwe-tannin-med',    label: 'Medium — gentle grip' },
        { id: 'rwe-tannin-firm',   label: 'Firm — drying and grippy' },
        { id: 'rwh-tannin-silky',  label: 'Silky — very fine, polished' },
        { id: 'rwh-tannin-grippy', label: 'Grippy — coarse, very drying, astringent' },
      ],
    },
    { id: 'rwe-alcohol', type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '13', unit: '%' },
    {
      id: 'rwe-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      options: [
        { id: 'rwe-fin-short',  label: 'Short — fades within seconds' },
        { id: 'rwe-fin-medium', label: 'Medium — lingers pleasantly' },
        { id: 'rwe-fin-long',   label: 'Long — stays with you a good while' },
      ],
    },
    {
      id: 'rwh-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      difficulty: 'hard',
      options: [
        { id: 'rwh-acid-low',    label: 'Low — soft, round, flat' },
        { id: 'rwh-acid-medium', label: 'Medium — fresh, balanced' },
        { id: 'rwh-acid-high',   label: 'High — lively, vibrant' },
      ],
    },
    {
      id: 'rwh-oak', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you detect oak influence?',
      difficulty: 'hard',
      options: [
        { id: 'rwh-oak-none',      label: 'Unoaked — pure fruit' },
        { id: 'rwh-oak-light',     label: 'Light — subtle spice & vanilla' },
        { id: 'rwh-oak-medium',    label: 'Medium — cedar, tobacco, vanilla' },
        { id: 'rwh-oak-heavy',     label: 'Heavy — dominant wood, smoke, espresso' },
        { id: 'rwh-oak-oxidative', label: 'Oxidative / nutty — aged without oxygen exclusion' },
      ],
    },
    {
      id: 'rwh-climate', type: QuestionType.MultipleChoiceText,
      prompt: 'What climate does this wine come from?',
      difficulty: 'hard',
      options: [
        { id: 'rwh-clim-cool',     label: 'Cool — red fruit, high acid, low alcohol, savoury' },
        { id: 'rwh-clim-moderate', label: 'Moderate — balanced fruit and structure' },
        { id: 'rwh-clim-warm',     label: 'Warm — black/jammy fruit, low acid, high alcohol' },
      ],
    },
    {
      id: 'rwh-world', type: QuestionType.MultipleChoiceText,
      prompt: 'Old World or New World?',
      difficulty: 'hard',
      options: [
        { id: 'rwh-world-old', label: 'Old World — earthy, savoury, restrained, leathery' },
        { id: 'rwh-world-new', label: 'New World — fruit-forward, ripe, oaky, generous' },
      ],
    },
    {
      id: 'rwe-age', type: QuestionType.MultipleChoiceText,
      prompt: 'How old does this wine taste?',
      options: [
        { id: 'rwh-age-young',  label: 'Young — primary fruit, vibrant, fresh oak' },
        { id: 'rwh-age-mature', label: 'Mature — tertiary notes, leather, forest floor, dried fruit' },
        { id: 'rwh-age-old',    label: 'Old — fading fruit, mushroom, tobacco, faded colour' },
      ],
    },
    {
      id: 'rwh-mlf', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you detect malolactic fermentation?',
      difficulty: 'hard',
      options: [
        { id: 'rwh-mlf-none',    label: 'Not perceptible — sharper, brighter acid' },
        { id: 'rwh-mlf-present', label: 'Present — creamy, buttery, rounded mouthfeel' },
      ],
    },
    { id: 'rwe-nose',    type: QuestionType.Tags,        prompt: 'Nose' },
    { id: 'rwe-palate',  type: QuestionType.Tags,        prompt: 'Palate' },
    { id: 'rwh-year',    type: QuestionType.NumberInput, prompt: 'Vintage year?', placeholder: '2019', difficulty: 'hard' },
    { id: 'rwh-grape',   type: QuestionType.TextInput,   prompt: 'What grape variety is this?', placeholder: 'e.g. Cabernet Sauvignon', difficulty: 'hard' },
    { id: 'rwh-region',  type: QuestionType.TextInput,   prompt: 'What region is it from?', placeholder: 'e.g. Bordeaux', difficulty: 'hard' },
    { id: 'rwe-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. France' },
    { id: 'rwe-price',   type: QuestionType.Price,       prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
