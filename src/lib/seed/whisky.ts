import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const WHISKY: Questionnaire = {
  id: 'seed-q-whisky', name: 'Whisky', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'wse-type', type: QuestionType.MultipleChoiceText,
      prompt: 'What type of whisky is this?',
      options: [
        { id: 'wse-type-scotch',   label: 'Scotch' },
        { id: 'wse-type-bourbon',  label: 'Bourbon' },
        { id: 'wse-type-irish',    label: 'Irish' },
        { id: 'wse-type-japanese', label: 'Japanese' },
        { id: 'wse-type-other',    label: 'Other' },
      ],
    },
    {
      id: 'wse-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'wse-body-light',  label: 'Light — delicate, lean' },
        { id: 'wse-body-medium', label: 'Medium — balanced weight' },
        { id: 'wse-body-full',   label: 'Full — rich, weighty' },
        { id: 'wse-body-oily',   label: 'Oily & viscous — thick, coating mouthfeel' },
      ],
    },
    {
      id: 'wse-sweet', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it?',
      options: [
        { id: 'wse-sweet-bone-dry', label: 'Bone dry — no residual sweetness' },
        { id: 'wse-sweet-dry',      label: 'Dry — minimal sweetness' },
        { id: 'wse-sweet-balanced', label: 'Balanced — perceptible sweetness' },
        { id: 'wse-sweet-sweet',    label: 'Sweet — pronounced (sherried or bourbon-led)' },
      ],
    },
    {
      id: 'wse-fruit', type: QuestionType.MultipleChoiceText,
      prompt: 'What fruit character dominates?',
      options: [
        { id: 'wse-fruit-none',     label: 'None — no fruit detected' },
        { id: 'wse-fruit-orchard',  label: 'Orchard — apple, pear' },
        { id: 'wse-fruit-red',      label: 'Red fruit — cherry, berry' },
        { id: 'wse-fruit-citrus',   label: 'Citrus — lemon, orange' },
        { id: 'wse-fruit-dried',    label: 'Dried — raisin, fig, sultana' },
        { id: 'wse-fruit-tropical', label: 'Tropical — banana, mango' },
      ],
    },
    {
      id: 'wse-smoke', type: QuestionType.MultipleChoiceText,
      prompt: 'How intense is the smoke?',
      options: [
        { id: 'wse-smoke-none',   label: 'None — no smoke' },
        { id: 'wse-smoke-light',  label: 'Light — wisp of smoke' },
        { id: 'wse-smoke-medium', label: 'Medium — noticeable, balanced' },
        { id: 'wse-smoke-heavy',  label: 'Heavy — Islay-level, dominant' },
      ],
    },
    {
      id: 'wsh-region', type: QuestionType.MultipleChoiceText,
      prompt: 'What region is this whisky from?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-region-speyside',    label: 'Speyside' },
        { id: 'wsh-region-islay',       label: 'Islay' },
        { id: 'wsh-region-highland',    label: 'Highland' },
        { id: 'wsh-region-lowland',     label: 'Lowland' },
        { id: 'wsh-region-campbeltown', label: 'Campbeltown' },
        { id: 'wsh-region-islands',     label: 'Islands' },
        { id: 'wsh-region-bourbon',     label: 'Bourbon (Kentucky)' },
        { id: 'wsh-region-tennessee',   label: 'Tennessee' },
        { id: 'wsh-region-irish',       label: 'Irish' },
        { id: 'wsh-region-japanese',    label: 'Japanese' },
      ],
    },
    {
      id: 'wsh-peat', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the peat and smoke character?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-peat-none',      label: 'Unpeated — no smoke' },
        { id: 'wsh-peat-floral',    label: 'Lightly heathery — floral, honeyed' },
        { id: 'wsh-peat-coastal',   label: 'Coastal & briny — salty, marine' },
        { id: 'wsh-peat-medicinal', label: 'Heavily medicinal — TCP, iodine, seaweed' },
        { id: 'wsh-peat-earthy',    label: 'Earthy & mossy — bog, damp wood' },
      ],
    },
    {
      id: 'wsh-cask', type: QuestionType.MultipleChoiceText,
      prompt: 'What cask type do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-cask-ex-bourbon', label: 'Ex-bourbon — vanilla, coconut, light oak' },
        { id: 'wsh-cask-sherry',     label: 'Sherry — dried fruit, Christmas cake, spice' },
        { id: 'wsh-cask-port',       label: 'Port — red fruit, chocolate, sweetness' },
        { id: 'wsh-cask-wine',       label: 'Wine cask — fresh fruit, delicate tannins' },
        { id: 'wsh-cask-new-oak',    label: 'New oak — strong vanilla, tannin, sawdust' },
      ],
    },
    {
      id: 'wsh-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-finish-short',  label: 'Short — fades within seconds' },
        { id: 'wsh-finish-medium', label: 'Medium — lingers pleasantly' },
        { id: 'wsh-finish-long',   label: 'Long — stays with you a good while' },
        { id: 'wsh-finish-epic',   label: 'Epic — minutes of complexity' },
      ],
    },
    {
      id: 'wsh-cereal', type: QuestionType.MultipleChoiceText,
      prompt: 'What cereal character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-cereal-none',     label: 'None — neutral, no grain character' },
        { id: 'wsh-cereal-biscuit',  label: 'Biscuit / cracker — light, dry, malty' },
        { id: 'wsh-cereal-honey',    label: 'Honey-malt — sweet, rich, golden cereal' },
        { id: 'wsh-cereal-porridge', label: 'Porridge / oat — full, grainy, hearty' },
      ],
    },
    {
      id: 'wsh-mash', type: QuestionType.MultipleChoiceText,
      prompt: 'What mash bill / grain base do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-mash-malt',    label: 'Single malt — 100% malted barley, fruity, malty' },
        { id: 'wsh-mash-bourbon', label: 'Bourbon — corn-led (≥51%), sweet, vanilla, caramel' },
        { id: 'wsh-mash-rye',     label: 'Rye-dominant — spicy, peppery, dry' },
        { id: 'wsh-mash-wheated', label: 'Wheated bourbon — soft, sweet, gentle' },
        { id: 'wsh-mash-grain',   label: 'Single grain — wheat or corn base, light, neutral' },
        { id: 'wsh-mash-blended', label: 'Blended — malt + grain whisky combined' },
      ],
    },
    {
      id: 'wsh-chill', type: QuestionType.MultipleChoiceText,
      prompt: 'Has this been chill filtered?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-chill-yes', label: 'Chill-filtered — clear when watered, cleaner mouthfeel' },
        { id: 'wsh-chill-no',  label: 'Non-chill filtered — may haze with water, fuller texture' },
      ],
    },
    {
      id: 'wsh-alcohol', type: QuestionType.MultipleChoiceText,
      prompt: 'How does the alcohol warmth present?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-alc-gentle',  label: 'Gentle — soft, integrated, no heat' },
        { id: 'wsh-alc-warming', label: 'Warming — noticeable, balanced' },
        { id: 'wsh-alc-hot',     label: 'Hot — prominent heat' },
        { id: 'wsh-alc-fiery',   label: 'Fiery — intense, cask strength or overproof' },
      ],
    },
    { id: 'wsh-age',    type: QuestionType.NumberInput, prompt: 'Age in years? (0 = NAS)', placeholder: '12', unit: 'yr', difficulty: 'hard' },
    { id: 'wse-nose',   type: QuestionType.Tags,        prompt: 'Nose' },
    { id: 'wse-palate', type: QuestionType.Tags,        prompt: 'Palate' },
    { id: 'wse-abv',    type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '43', unit: '%' },
    { id: 'wse-price',  type: QuestionType.Price,       prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};
