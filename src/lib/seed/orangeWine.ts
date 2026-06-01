import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const ORANGE: Questionnaire = {
  id: 'seed-q-orange', name: 'Orange Wine', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'oe-tannin', type: QuestionType.MultipleChoiceText,
      prompt: 'How are the tannins?',
      options: [
        { id: 'oe-tannin-low',    label: 'Low — chalky dryness on finish only, short maceration' },
        { id: 'oe-tannin-medium', label: 'Medium — tea-like astringency, noticeable texture' },
        { id: 'oe-tannin-high',   label: 'High — significant grip, red-wine-like drying, long maceration' },
      ],
    },
    {
      id: 'oe-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      options: [
        { id: 'oe-acid-low',    label: 'Low — soft and flat' },
        { id: 'oe-acid-medium', label: 'Medium — fresh and balanced' },
        { id: 'oe-acid-high',   label: 'High — crisp and mouthwatering' },
      ],
    },
    {
      id: 'oe-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'oe-body-light',  label: 'Light — delicate, near-white-wine weight' },
        { id: 'oe-body-medium', label: 'Medium — balanced, textured' },
        { id: 'oe-body-full',   label: 'Full — heavy, red-wine-like, extended maceration' },
      ],
    },
    { id: 'oe-alcohol', type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '13', unit: '%' },
    {
      id: 'oe-sweetness', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it?',
      options: [
        { id: 'oe-sweet-bone-dry', label: 'Bone dry — no perceptible sugar' },
        { id: 'oe-sweet-dry',      label: 'Dry — minimal sweetness' },
        { id: 'oe-sweet-off-dry',  label: 'Off-dry — slight perceptible sweetness' },
      ],
    },
    {
      id: 'oe-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      options: [
        { id: 'oe-fin-short',  label: 'Short — fades within seconds' },
        { id: 'oe-fin-medium', label: 'Medium — lingers pleasantly' },
        { id: 'oe-fin-long',   label: 'Long — sustained complexity' },
      ],
    },
    {
      id: 'oh-maceration', type: QuestionType.MultipleChoiceText,
      prompt: 'How long was the grape skin contact?',
      difficulty: 'hard',
      options: [
        { id: 'oh-mac-days',   label: 'Days — pale gold, low tannin, white grape variety recognisable' },
        { id: 'oh-mac-weeks',  label: 'Weeks — amber, medium tannin, tea-like texture' },
        { id: 'oh-mac-months', label: 'Months — deep amber/copper, high tannin, grippy, qvevri likely' },
      ],
    },
    {
      id: 'oh-vessel', type: QuestionType.MultipleChoiceText,
      prompt: 'What vessel character do you detect on the nose and palate?',
      difficulty: 'hard',
      options: [
        { id: 'oh-vessel-amphora', label: 'Amphora / Qvevri — earthy, chalky mineral, beeswax, savoury' },
        { id: 'oh-vessel-oak',     label: 'Oak — vanilla, spice, toasty' },
        { id: 'oh-vessel-neutral', label: 'Neutral / steel — pure fruit, no vessel influence' },
      ],
    },
    {
      id: 'oh-oxidation', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the oxidative character?',
      difficulty: 'hard',
      options: [
        { id: 'oh-ox-none',   label: 'None — fresh, reductive, fruit forward' },
        { id: 'oh-ox-light',  label: 'Light — dried apricot, chamomile, beeswax, honey' },
        { id: 'oh-ox-medium', label: 'Medium — walnut skin, bruised apple, savoury, umami' },
        { id: 'oh-ox-heavy',  label: 'Heavy — sherry-like, rancio, coffee, very oxidative (possible fault)' },
      ],
    },
    {
      id: 'oh-ferment', type: QuestionType.MultipleChoiceText,
      prompt: 'What fermentation character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'oh-ferment-clean',   label: 'Clean — no wild yeast influence' },
        { id: 'oh-ferment-wild',    label: 'Wild — sourdough, bread, yeasty autolysis' },
        { id: 'oh-ferment-funky',   label: 'Funky — barnyard, leathery, phenolic, Brett influence' },
        { id: 'oh-ferment-savoury', label: 'Savoury — soy, umami, dried mushroom (Georgian long-maceration)' },
      ],
    },
    {
      id: 'oh-bitter', type: QuestionType.MultipleChoiceText,
      prompt: 'How bitter is the finish?',
      difficulty: 'hard',
      options: [
        { id: 'oh-bitter-none',   label: 'None — clean, no phenolic bitterness' },
        { id: 'oh-bitter-low',    label: 'Low — subtle pithy edge' },
        { id: 'oh-bitter-medium', label: 'Medium — noticeable phenolic grip' },
        { id: 'oh-bitter-high',   label: 'High — pith-like, very bitter, long maceration' },
      ],
    },
    {
      id: 'oh-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style tradition does this follow?',
      difficulty: 'hard',
      options: [
        { id: 'oh-style-georgian',  label: 'Georgian Qvevri — long maceration, savoury, deep amber' },
        { id: 'oh-style-friulian',  label: 'Friulian — Italian moderate maceration, balanced' },
        { id: 'oh-style-slovenian', label: 'Slovenian — bold, expressive, often oak-aged' },
        { id: 'oh-style-modern',    label: 'Modern New World — shorter maceration, fresher, lighter' },
      ],
    },
    { id: 'oe-nose',    type: QuestionType.Tags,      prompt: 'Nose' },
    { id: 'oe-palate',  type: QuestionType.Tags,      prompt: 'Palate' },
    {
      id: 'oe-age', type: QuestionType.MultipleChoiceText,
      prompt: 'How old does this wine taste?',
      options: [
        { id: 'oe-age-young',  label: 'Young — bold tannin, sharp oxidative edge, vivid colour' },
        { id: 'oe-age-mature', label: 'Mature — integrated tannin, deeper amber, dried fruit notes' },
        { id: 'oe-age-old',    label: 'Old — complex, very deep amber, rancio, walnut' },
      ],
    },
    { id: 'oh-year',    type: QuestionType.NumberInput, prompt: 'Vintage year?', placeholder: '2020', difficulty: 'hard' },
    { id: 'oh-grape',   type: QuestionType.TextInput,   prompt: 'What grape variety is this?', placeholder: 'e.g. Rkatsiteli', difficulty: 'hard' },
    { id: 'oh-region',  type: QuestionType.TextInput,   prompt: 'What region is it from?', placeholder: 'e.g. Kakheti', difficulty: 'hard' },
    { id: 'oe-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. Georgia' },
    { id: 'oe-price',   type: QuestionType.Price,       prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
