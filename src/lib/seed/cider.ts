import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const CIDER: Questionnaire = {
  id: 'seed-q-cider', name: 'Cider', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'ce-sweet', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it?',
      options: [
        { id: 'ce-sweet-dry',    label: 'Dry' },
        { id: 'ce-sweet-medium', label: 'Medium' },
        { id: 'ce-sweet-sweet',  label: 'Sweet' },
      ],
    },
    {
      id: 'ce-bubbles', type: QuestionType.MultipleChoiceText,
      prompt: 'How is the carbonation?',
      options: [
        { id: 'ce-bub-still',     label: 'Still — no bubbles' },
        { id: 'ce-bub-petillant', label: 'Pétillant — lightly fizzy' },
        { id: 'ce-bub-sparkling', label: 'Sparkling' },
      ],
    },
    {
      id: 'ce-apple', type: QuestionType.MultipleChoiceText,
      prompt: 'What apple character do you detect?',
      options: [
        { id: 'ce-apple-fresh',  label: 'Fresh apple — clean, bright, culinary variety' },
        { id: 'ce-apple-cooked', label: 'Cooked apple — warm, baked, softer' },
        { id: 'ce-apple-dried',  label: 'Dried apple — concentrated, complex, tannic variety' },
      ],
    },
    {
      id: 'ce-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body?',
      options: [
        { id: 'ce-body-light',  label: 'Light — delicate, watery' },
        { id: 'ce-body-medium', label: 'Medium — balanced weight' },
        { id: 'ce-body-full',   label: 'Full — rich, weighty, tannic' },
      ],
    },
    {
      id: 'ce-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      options: [
        { id: 'ce-fin-short',  label: 'Short — fades within seconds' },
        { id: 'ce-fin-medium', label: 'Medium — lingers pleasantly' },
        { id: 'ce-fin-long',   label: 'Long — sustained complexity' },
      ],
    },
    {
      id: 'ce-fruit', type: QuestionType.MultipleChoiceText,
      prompt: 'What fruit additions do you detect?',
      options: [
        { id: 'ce-fruit-none',     label: 'None — pure apple' },
        { id: 'ce-fruit-berry',    label: 'Berry — blackcurrant, raspberry, strawberry' },
        { id: 'ce-fruit-citrus',   label: 'Citrus — lemon, lime, orange' },
        { id: 'ce-fruit-stone',    label: 'Stone fruit — peach, plum, cherry' },
        { id: 'ce-fruit-tropical', label: 'Tropical — mango, passion fruit, pineapple' },
      ],
    },
    {
      id: 'ch-apple', type: QuestionType.MultipleChoiceText,
      prompt: 'What apple variety character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'ch-apple-bittersweet', label: 'Bittersweet — high tannin, low acid, rich, earthy (e.g. Dabinett, Yarlington Mill)' },
        { id: 'ch-apple-bittersharp', label: 'Bittersharp — high tannin AND high acid, complex (e.g. Kingston Black)' },
        { id: 'ch-apple-sharp',       label: 'Sharp — high acid, low tannin, bright, green (culinary varieties)' },
        { id: 'ch-apple-sweet',       label: 'Sweet — low acid, low tannin, simple, dessert apple character' },
      ],
    },
    {
      id: 'ch-tannin', type: QuestionType.MultipleChoiceText,
      prompt: 'How are the tannins?',
      difficulty: 'hard',
      options: [
        { id: 'ch-tannin-none',   label: 'None — soft, no grip (commercial/culinary apple)' },
        { id: 'ch-tannin-light',  label: 'Light — powdery dryness on finish' },
        { id: 'ch-tannin-medium', label: 'Medium — pleasantly astringent, red-wine-like' },
        { id: 'ch-tannin-firm',   label: 'Firm — grippy, drying, tannic variety' },
      ],
    },
    {
      id: 'ch-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      difficulty: 'hard',
      options: [
        { id: 'ch-acid-low',    label: 'Low — soft, round, bittersweet variety' },
        { id: 'ch-acid-medium', label: 'Medium — refreshing, balanced' },
        { id: 'ch-acid-high',   label: 'High — bright, sharp, malic acid dominant' },
        { id: 'ch-acid-lactic', label: 'Lactic — soft, creamy, malolactic character' },
      ],
    },
    {
      id: 'ch-ferment', type: QuestionType.MultipleChoiceText,
      prompt: 'What fermentation character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'ch-ferment-clean',     label: 'Clean — neutral, no yeast influence' },
        { id: 'ch-ferment-wild',      label: 'Wild / farmhouse — funky, barnyard, earthy, leathery' },
        { id: 'ch-ferment-brett',     label: 'Brett — horsey, phenolic, smoky (acceptable in traditional styles)' },
        { id: 'ch-ferment-oxidative', label: 'Oxidative — sherry-like, walnut, bruised apple' },
      ],
    },
    {
      id: 'ch-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of cider is this?',
      difficulty: 'hard',
      options: [
        { id: 'ch-style-english',    label: 'English West Country — tannic, complex, bittersweet apples' },
        { id: 'ch-style-french',     label: 'French Normandy / Brittany — fuller, often sweeter, malolactic influence' },
        { id: 'ch-style-commercial', label: 'Commercial — light, highly carbonated, clean, simple' },
        { id: 'ch-style-keeved',     label: 'Keeved — naturally sweet, low alcohol, petillant' },
        { id: 'ch-style-ice',        label: 'Ice Cider — concentrated, very sweet, high acid, dessert' },
      ],
    },
    {
      id: 'ch-hop', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you detect hop character?',
      difficulty: 'hard',
      options: [
        { id: 'ch-hop-none',       label: 'None — pure apple, no hop influence' },
        { id: 'ch-hop-subtle',     label: 'Subtle — light dry-hop, hint of citrus or herb' },
        { id: 'ch-hop-pronounced', label: 'Pronounced — clearly hopped cider, American craft style' },
      ],
    },
    {
      id: 'ch-wood', type: QuestionType.MultipleChoiceText,
      prompt: 'What wood / barrel character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'ch-wood-none',   label: 'None — neutral steel or plastic vessel' },
        { id: 'ch-wood-light',  label: 'Lightly oaked — subtle vanilla, hint of spice' },
        { id: 'ch-wood-heavy',  label: 'Heavily oaked — pronounced vanilla, toast' },
        { id: 'ch-wood-barrel', label: 'Barrel-aged — bourbon, wine cask, rum character' },
      ],
    },
    {
      id: 'ch-conditioning', type: QuestionType.MultipleChoiceText,
      prompt: 'What conditioning method do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'ch-cond-force',  label: 'Force-carbonated — clean, fruit-forward, no sediment' },
        { id: 'ch-cond-bottle', label: 'Bottle conditioned — yeasty, autolytic, may have sediment' },
        { id: 'ch-cond-petnat', label: 'Pet-Nat / méthode ancestrale — single fermentation in bottle, lively' },
      ],
    },
    {
      id: 'ch-region', type: QuestionType.MultipleChoiceText,
      prompt: 'What regional origin does this follow?',
      difficulty: 'hard',
      options: [
        { id: 'ch-reg-westcountry', label: 'West Country English — tannic, bittersweet apples' },
        { id: 'ch-reg-eastern',     label: 'Eastern English — sharper, dessert/culinary apples' },
        { id: 'ch-reg-normandy',    label: 'Normandy — fuller, malolactic, keeved tradition' },
        { id: 'ch-reg-brittany',    label: 'Brittany — dry, mineral, terroir-driven' },
        { id: 'ch-reg-asturian',    label: 'Asturian / Basque — wild, funky, lactic, sidra' },
        { id: 'ch-reg-american',    label: 'American craft — innovative, modern, often hopped/fruited' },
        { id: 'ch-reg-other',       label: 'Other' },
      ],
    },
    { id: 'ce-nose',    type: QuestionType.Tags,        prompt: 'Nose' },
    { id: 'ce-palate',  type: QuestionType.Tags,        prompt: 'Palate' },
    { id: 'ce-abv',     type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '5', unit: '%' },
    { id: 'ce-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. England' },
    { id: 'ce-price',   type: QuestionType.Price,       prompt: 'Price per 500ml?', currencySymbol: '£' },
  ],
};
