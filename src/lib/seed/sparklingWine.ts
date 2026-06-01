import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const SPARKLING: Questionnaire = {
  id: 'seed-q-sparkling', name: 'Sparkling Wine', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'spe-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of sparkling wine is this?',
      options: [
        { id: 'spe-style-champagne',    label: 'Champagne' },
        { id: 'spe-style-prosecco',     label: 'Prosecco' },
        { id: 'spe-style-cava',         label: 'Cava' },
        { id: 'sph-style-english',      label: 'English Sparkling' },
        { id: 'sph-style-cremant',      label: 'Crémant' },
        { id: 'sph-style-franciacorta', label: 'Franciacorta' },
        { id: 'sph-style-sekt',         label: 'Sekt' },
        { id: 'sph-style-newworld',     label: 'New World Sparkling' },
        { id: 'spe-style-other',        label: 'Other sparkling' },
      ],
    },
    {
      id: 'spe-sweet', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it?',
      options: [
        { id: 'spe-sweet-dry',    label: 'Dry (Brut)' },
        { id: 'spe-sweet-offdry', label: 'Off-dry (Extra Dry)' },
        { id: 'spe-sweet-sweet',  label: 'Sweet (Demi-Sec or sweeter)' },
      ],
    },
    {
      id: 'spe-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'spe-body-light',  label: 'Light — crisp, lean, delicate' },
        { id: 'spe-body-medium', label: 'Medium — balanced weight' },
        { id: 'spe-body-full',   label: 'Full — rich, weighty, often oaked or aged' },
      ],
    },
    { id: 'spe-alcohol', type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '12', unit: '%' },
    {
      id: 'sph-method', type: QuestionType.MultipleChoiceText,
      prompt: 'What production method do you detect on the nose?',
      difficulty: 'hard',
      options: [
        { id: 'sph-method-traditional', label: 'Traditional method — bready, biscuity, yeasty autolysis' },
        { id: 'sph-method-tank',        label: 'Tank method — fresh, floral, fruity, light' },
        { id: 'sph-method-transfer',    label: 'Transfer method — some autolysis, clean finish' },
      ],
    },
    {
      id: 'sph-dosage', type: QuestionType.MultipleChoiceText,
      prompt: 'What is the dosage level?',
      difficulty: 'hard',
      options: [
        { id: 'sph-dosage-extra-brut', label: 'Extra Brut — bone dry, under 6g/L' },
        { id: 'sph-dosage-brut',       label: 'Brut — dry, under 12g/L' },
        { id: 'sph-dosage-extra-dry',  label: 'Extra Dry — off-dry, 12–17g/L' },
        { id: 'sph-dosage-sec',        label: 'Sec — medium, 17–32g/L' },
        { id: 'sph-dosage-demi-sec',   label: 'Demi-Sec — sweet, 32–50g/L' },
      ],
    },
    {
      id: 'sph-bead', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the mousse and bead?',
      difficulty: 'hard',
      options: [
        { id: 'sph-bead-fine',    label: 'Fine & persistent — elegant string of pearls' },
        { id: 'sph-bead-medium',  label: 'Medium — consistent but not ultra-fine' },
        { id: 'sph-bead-large',   label: 'Large & aggressive — disperses quickly' },
        { id: 'sph-bead-creamy',  label: 'Creamy mousse — velvety, almost no visible bead' },
      ],
    },
    {
      id: 'sph-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      difficulty: 'hard',
      options: [
        { id: 'sph-acid-low',    label: 'Low — gentle and rounded' },
        { id: 'sph-acid-medium', label: 'Medium — lively and refreshing' },
        { id: 'sph-acid-high',   label: 'High — piercing and mineral' },
      ],
    },
    {
      id: 'sph-vintage', type: QuestionType.MultipleChoiceText,
      prompt: 'What vintage status is this?',
      difficulty: 'hard',
      options: [
        { id: 'sph-vint-nv',       label: 'Non-vintage — consistent house style, blended years' },
        { id: 'sph-vint-vintage',  label: 'Vintage — single year, declared, more complexity' },
        { id: 'sph-vint-prestige', label: 'Prestige cuvée — top expression, long lees aging' },
      ],
    },
    {
      id: 'sph-autolysis', type: QuestionType.MultipleChoiceText,
      prompt: 'How intense is the autolytic character?',
      difficulty: 'hard',
      options: [
        { id: 'sph-aut-none',  label: 'None — fresh, fruit-driven, tank method likely' },
        { id: 'sph-aut-light', label: 'Light — subtle brioche, fresh bread' },
        { id: 'sph-aut-heavy', label: 'Heavy — deep biscuit, toasted nuts, long lees aging' },
      ],
    },
    {
      id: 'sph-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      difficulty: 'hard',
      options: [
        { id: 'sph-fin-short',  label: 'Short — fades within seconds' },
        { id: 'sph-fin-medium', label: 'Medium — lingers pleasantly' },
        { id: 'sph-fin-long',   label: 'Long — sustained complexity' },
      ],
    },
    { id: 'spe-nose',    type: QuestionType.Tags,      prompt: 'Nose' },
    { id: 'spe-palate',  type: QuestionType.Tags,      prompt: 'Palate' },
    { id: 'sph-grape',   type: QuestionType.TextInput, prompt: 'What grape variety or blend is this?', placeholder: 'e.g. Chardonnay', difficulty: 'hard' },
    { id: 'sph-region',  type: QuestionType.TextInput, prompt: 'What region is it from?', placeholder: 'e.g. Champagne', difficulty: 'hard' },
    { id: 'spe-country', type: QuestionType.TextInput, prompt: 'What country is it from?', placeholder: 'e.g. France' },
    { id: 'spe-price',   type: QuestionType.Price,     prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
