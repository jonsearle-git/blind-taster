import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const FORTIFIED: Questionnaire = {
  id: 'seed-q-fortified', name: 'Fortified Wine', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'fe-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of fortified wine is this?',
      options: [
        { id: 'fe-style-port',    label: 'Port — rich, sweet, red fruit or nutty' },
        { id: 'fe-style-sherry',  label: 'Sherry — ranges from bone dry to very sweet, nutty or saline' },
        { id: 'fe-style-madeira', label: 'Madeira — high acid, baked fruit, smoky, tangy' },
        { id: 'fe-style-other',   label: 'Other — Marsala, Muscat, Vin Doux Naturel' },
      ],
    },
    {
      id: 'fe-sweet', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it?',
      options: [
        { id: 'fe-sweet-dry',    label: 'Dry — Fino, Manzanilla, Oloroso' },
        { id: 'fe-sweet-medium', label: 'Medium — Amontillado, Palo Cortado, some Madeira' },
        { id: 'fe-sweet-sweet',  label: 'Sweet — Ruby Port, LBV, Cream Sherry' },
        { id: 'fe-sweet-very',   label: 'Very sweet / luscious — Vintage Port, PX, Malmsey Madeira' },
      ],
    },
    {
      id: 'fe-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      options: [
        { id: 'fe-acid-low',    label: 'Low — soft, round' },
        { id: 'fe-acid-medium', label: 'Medium — balanced' },
        { id: 'fe-acid-high',   label: 'High — vibrant, mouthwatering (Madeira marker)' },
      ],
    },
    {
      id: 'fe-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'fe-body-light',  label: 'Light — Fino, Manzanilla' },
        { id: 'fe-body-medium', label: 'Medium — Tawny, Amontillado' },
        { id: 'fe-body-full',   label: 'Full — Vintage Port, Oloroso' },
        { id: 'fe-body-syrupy', label: 'Syrupy — PX, Malmsey Madeira' },
      ],
    },
    { id: 'fe-alcohol', type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '17', unit: '%' },
    {
      id: 'fh-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What specific style of fortified wine is this?',
      difficulty: 'hard',
      options: [
        { id: 'fh-style-ruby',    label: 'Port — Ruby (deep red, fresh cherry, young, reductive)' },
        { id: 'fh-style-tawny',   label: 'Port — Tawny (amber, walnut, dried fruit, oxidative aging)' },
        { id: 'fh-style-lbv',     label: 'Port — LBV (medium sweet, tannic, garnet, bottle aged)' },
        { id: 'fh-style-vintage', label: 'Port — Vintage (very tannic, grippy, deep ruby, long finish)' },
        { id: 'fh-style-fino',    label: 'Sherry — Fino / Manzanilla (bone dry, saline, chamomile, under flor)' },
        { id: 'fh-style-amontill',label: 'Sherry — Amontillado (dry, nutty, hazelnut, amber, dual aging)' },
        { id: 'fh-style-oloroso', label: 'Sherry — Oloroso (dry, full, raisin, rancio, oxidative only)' },
        { id: 'fh-style-palo',    label: 'Sherry — Palo Cortado (dry, complex, between Amontillado and Oloroso)' },
        { id: 'fh-style-pedro',   label: 'Sherry — Pedro Ximénez (very sweet, treacle, fig, near-black)' },
        { id: 'fh-style-madeira', label: 'Madeira (high acid + sweetness, baked/smoky, tangy, all levels)' },
        { id: 'fh-style-muscat',  label: 'Muscat / Vin Doux Naturel (sweet, grapey, orange flower, fresh)' },
      ],
    },
    {
      id: 'fh-oxidation', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the oxidative character?',
      difficulty: 'hard',
      options: [
        { id: 'fh-ox-none',   label: 'None — fresh, floral, saline, under flor yeast (Fino/Manzanilla)' },
        { id: 'fh-ox-light',  label: 'Light — subtle nuttiness, almond, beginning to show' },
        { id: 'fh-ox-medium', label: 'Medium — walnut, hazelnut, dried fruit, toasty' },
        { id: 'fh-ox-heavy',  label: 'Heavy — rancio, fig, treacle, caramel, coffee (quality marker)' },
      ],
    },
    {
      id: 'fh-tannin', type: QuestionType.MultipleChoiceText,
      prompt: 'How are the tannins?',
      difficulty: 'hard',
      options: [
        { id: 'fh-tannin-none',   label: 'None — Sherry, White Port, Tawny' },
        { id: 'fh-tannin-low',    label: 'Low — Tawny with age indication' },
        { id: 'fh-tannin-medium', label: 'Medium — LBV, Ruby Reserve' },
        { id: 'fh-tannin-high',   label: 'High / grippy — Vintage Port (most tannic fortified wine)' },
      ],
    },
    {
      id: 'fh-fruit', type: QuestionType.MultipleChoiceText,
      prompt: 'What fruit character do you detect on the nose?',
      difficulty: 'hard',
      options: [
        { id: 'fh-fruit-fresh', label: 'Fresh red fruit — cherry, plum, raspberry (young Ruby/Vintage Port)' },
        { id: 'fh-fruit-dried', label: 'Dried fruit — prune, date, fig, raisin (aged Port, Amontillado, Oloroso)' },
        { id: 'fh-fruit-jammy', label: 'Preserved / jam — cooked fruit, Ruby Reserve' },
        { id: 'fh-fruit-baked', label: 'Baked fruit / marmalade — Madeira, Bual, Malmsey' },
        { id: 'fh-fruit-none',  label: 'No fruit — savouriness dominates (Fino, dry Oloroso)' },
      ],
    },
    {
      id: 'fh-alcohol', type: QuestionType.MultipleChoiceText,
      prompt: 'How does the alcohol heat present?',
      difficulty: 'hard',
      options: [
        { id: 'fh-alc-gentle', label: 'Gentle — 15%, soft, low-fortified Muscat / Madeira' },
        { id: 'fh-alc-warm',   label: 'Warm — 17–18%, balanced fortification, Sherry / Port' },
        { id: 'fh-alc-hot',    label: 'Hot — 20%+, intense heat, Vintage Port, PX' },
      ],
    },
    {
      id: 'fh-age', type: QuestionType.MultipleChoiceText,
      prompt: 'What age category does this fall into?',
      difficulty: 'hard',
      options: [
        { id: 'fh-age-young',    label: 'Young / reductive — fresh, primary fruit, no oxidative notes' },
        { id: 'fh-age-10',       label: '10-year — early oxidative notes, light nuttiness' },
        { id: 'fh-age-20',       label: '20-year — pronounced rancio, dried fruit, walnut' },
        { id: 'fh-age-30plus',   label: '30+ year — intense complexity, treacle, coffee, very long finish' },
        { id: 'fh-age-colheita', label: 'Colheita / vintage — single year, declared, distinct character' },
      ],
    },
    {
      id: 'fh-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      difficulty: 'hard',
      options: [
        { id: 'fh-fin-short',  label: 'Short — fades within seconds' },
        { id: 'fh-fin-medium', label: 'Medium — lingers pleasantly' },
        { id: 'fh-fin-long',   label: 'Long — stays with you a good while' },
        { id: 'fh-fin-epic',   label: 'Epic — minutes of complexity' },
      ],
    },
    { id: 'fe-nose',    type: QuestionType.Tags,      prompt: 'Nose' },
    { id: 'fe-palate',  type: QuestionType.Tags,      prompt: 'Palate' },
    { id: 'fh-region',  type: QuestionType.TextInput, prompt: 'What region is it from?', placeholder: 'e.g. Douro', difficulty: 'hard' },
    { id: 'fe-country', type: QuestionType.TextInput, prompt: 'What country is it from?', placeholder: 'e.g. Portugal' },
    { id: 'fe-price',   type: QuestionType.Price,     prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
