import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const GIN: Questionnaire = {
  id: 'seed-q-gin', name: 'Gin', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'ge-juniper', type: QuestionType.MultipleChoiceText,
      prompt: 'How prominent is the juniper on the nose?',
      options: [
        { id: 'ge-juniper-low',    label: 'Low — barely detectable, other botanicals dominate' },
        { id: 'ge-juniper-medium', label: 'Medium — present and clear, well balanced' },
        { id: 'ge-juniper-high',   label: 'High — dominant, piney, resinous' },
      ],
    },
    {
      id: 'ge-botanicals', type: QuestionType.MultipleChoiceText,
      prompt: 'What botanical family leads the nose?',
      options: [
        { id: 'ge-bot-citrus',  label: 'Citrus — lemon peel, orange, grapefruit' },
        { id: 'ge-bot-floral',  label: 'Floral — elderflower, lavender, rose' },
        { id: 'ge-bot-spice',   label: 'Spice — coriander, cardamom, pepper' },
        { id: 'ge-bot-herbal',  label: 'Herbal — angelica, camomile, earthy' },
        { id: 'ge-bot-fruit',   label: 'Fruit — tropical, berry, stone fruit' },
      ],
    },
    {
      id: 'ge-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body / mouthfeel?',
      options: [
        { id: 'ge-body-light',  label: 'Light & clean — lean, neutral, column-still character' },
        { id: 'ge-body-medium', label: 'Medium — balanced weight' },
        { id: 'ge-body-oily',   label: 'Oily & viscous — premium, Navy, or pot-still character' },
      ],
    },
    {
      id: 'ge-citrus', type: QuestionType.MultipleChoiceText,
      prompt: 'What citrus character do you detect?',
      options: [
        { id: 'ge-cit-none',       label: 'None — no citrus' },
        { id: 'ge-cit-lemon',      label: 'Lemon — bright, zesty, classic' },
        { id: 'ge-cit-lime',       label: 'Lime — sharp, green, fresh' },
        { id: 'ge-cit-orange',     label: 'Orange — sweet, round, warming' },
        { id: 'ge-cit-grapefruit', label: 'Grapefruit — bitter, pithy, pink or yellow' },
        { id: 'ge-cit-mixed',      label: 'Mixed peels — complex blend of multiple citrus' },
      ],
    },
    {
      id: 'ge-floral', type: QuestionType.MultipleChoiceText,
      prompt: 'What floral character do you detect?',
      options: [
        { id: 'ge-flor-none',       label: 'None — no floral notes' },
        { id: 'ge-flor-soft',       label: 'Soft — chamomile, mild blossoms' },
        { id: 'ge-flor-pronounced', label: 'Pronounced — rose, violet, lavender' },
        { id: 'ge-flor-elder',      label: 'Elderflower — distinct, hedgerow' },
      ],
    },
    {
      id: 'ge-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of gin is this?',
      options: [
        { id: 'ge-style-london-dry',   label: 'London Dry — juniper-led, bone dry' },
        { id: 'ge-style-contemporary', label: 'Contemporary — fruit or floral forward, softer juniper' },
        { id: 'ge-style-old-tom',      label: 'Old Tom — slightly sweet, rounder' },
        { id: 'ge-style-sloe',         label: 'Sloe / Fruit — macerated, sweet, coloured' },
        { id: 'ge-style-barrel',       label: 'Barrel Aged — vanilla, woody, amber colour' },
        { id: 'gh-style-navy',         label: 'Navy Strength — 57%+ ABV, intense heat and botanical concentration' },
      ],
    },
    {
      id: 'gh-base', type: QuestionType.MultipleChoiceText,
      prompt: 'What base spirit character do you detect on the palate?',
      difficulty: 'hard',
      options: [
        { id: 'gh-base-grain',  label: 'Grain — neutral, clean, very light body' },
        { id: 'gh-base-grape',  label: 'Grape — soft, slightly fruity, rounded' },
        { id: 'gh-base-potato', label: 'Potato — creamy, full, slightly oily' },
        { id: 'gh-base-malt',   label: 'Malt — cereal, biscuity, sweet undertone' },
      ],
    },
    {
      id: 'gh-sweetness', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the sweetness?',
      difficulty: 'hard',
      options: [
        { id: 'gh-sweet-bone-dry', label: 'Bone dry — no sweetness (London Dry)' },
        { id: 'gh-sweet-off-dry',  label: 'Off-dry — just a hint (some contemporary)' },
        { id: 'gh-sweet-sweet',    label: 'Sweet — perceptible (Old Tom, fruit gins)' },
      ],
    },
    {
      id: 'gh-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the finish length and character?',
      difficulty: 'hard',
      options: [
        { id: 'gh-finish-short',  label: 'Short — fades within seconds' },
        { id: 'gh-finish-medium', label: 'Medium — warming, botanicals fade gradually' },
        { id: 'gh-finish-long',   label: 'Long — sustained complexity, juniper and spice persist' },
      ],
    },
    {
      id: 'gh-distillation', type: QuestionType.MultipleChoiceText,
      prompt: 'What distillation method do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'gh-dist-pot',      label: 'Pot still — rich, full-bodied, botanically complex' },
        { id: 'gh-dist-column',   label: 'Column still — light, neutral, clean' },
        { id: 'gh-dist-compound', label: 'Compound — flavourings added without redistillation, simple' },
      ],
    },
    {
      id: 'gh-spice', type: QuestionType.MultipleChoiceText,
      prompt: 'What spice character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'gh-spice-none',      label: 'None — no spice' },
        { id: 'gh-spice-coriander', label: 'Coriander — citrusy, ginger-like, sage' },
        { id: 'gh-spice-cardamom',  label: 'Cardamom — sweet, warming, perfumed' },
        { id: 'gh-spice-pepper',    label: 'Pepper — black or Sichuan, peppery heat' },
        { id: 'gh-spice-anise',     label: 'Anise / star anise — liquorice, sweet' },
        { id: 'gh-spice-cinnamon',  label: 'Cinnamon / cassia — warming, sweet bark' },
      ],
    },
    { id: 'ge-nose',    type: QuestionType.Tags,        prompt: 'Nose' },
    { id: 'ge-palate',  type: QuestionType.Tags,        prompt: 'Palate' },
    { id: 'ge-abv',     type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '42', unit: '%' },
    { id: 'ge-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. Scotland' },
    { id: 'ge-price',   type: QuestionType.Price,       prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
