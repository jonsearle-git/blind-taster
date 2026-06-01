import { QuestionType } from '../../constants/gameConstants';
import { Questionnaire } from '../../types/questionnaire';

const T = 1700000000000;

export const BEER: Questionnaire = {
  id: 'seed-q-beer', name: 'Beer', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'be-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of beer is this?',
      options: [
        { id: 'be-style-lager',    label: 'Lager' },
        { id: 'be-style-pilsner',  label: 'Pilsner' },
        { id: 'be-style-pale-ale', label: 'Pale Ale' },
        { id: 'be-style-ale',      label: 'Ale' },
        { id: 'be-style-ipa',      label: 'IPA' },
        { id: 'be-style-dipa',     label: 'Double IPA' },
        { id: 'be-style-stout',    label: 'Stout' },
        { id: 'be-style-porter',   label: 'Porter' },
        { id: 'be-style-wheat',    label: 'Wheat Beer' },
        { id: 'be-style-sour',     label: 'Sour / Lambic' },
        { id: 'be-style-belgian',  label: 'Belgian Ale' },
        { id: 'be-style-saison',   label: 'Saison / Farmhouse' },
      ],
    },
    {
      id: 'be-bitter', type: QuestionType.MultipleChoiceText,
      prompt: 'How bitter is it?',
      options: [
        { id: 'be-bitter-low',  label: 'Not very bitter' },
        { id: 'be-bitter-med',  label: 'Moderately bitter' },
        { id: 'be-bitter-high', label: 'Very bitter' },
      ],
    },
    {
      id: 'be-hops', type: QuestionType.MultipleChoiceText,
      prompt: 'What hop character do you detect?',
      options: [
        { id: 'be-hops-none',   label: 'Little or none' },
        { id: 'be-hops-floral', label: 'Floral & herbal' },
        { id: 'be-hops-citrus', label: 'Citrus & fruity' },
        { id: 'be-hops-piney',  label: 'Piney & resinous' },
        { id: 'be-hops-earthy', label: 'Earthy & spicy' },
      ],
    },
    {
      id: 'be-clarity', type: QuestionType.MultipleChoiceText,
      prompt: 'How clear is the beer?',
      options: [
        { id: 'be-clarity-brilliant', label: 'Brilliant — crystal clear' },
        { id: 'be-clarity-clear',     label: 'Clear — slight haze acceptable' },
        { id: 'be-clarity-hazy',      label: 'Hazy — visible cloudiness' },
        { id: 'be-clarity-cloudy',    label: 'Very cloudy / opaque' },
      ],
    },
    {
      id: 'be-head', type: QuestionType.MultipleChoiceText,
      prompt: 'How is the head retention?',
      options: [
        { id: 'be-head-poor',    label: 'Poor — collapses quickly' },
        { id: 'be-head-medium',  label: 'Medium — fades steadily' },
        { id: 'be-head-good',    label: 'Good — long-lasting' },
        { id: 'be-head-lasting', label: 'Sustained — leaves heavy lacing' },
      ],
    },
    {
      id: 'be-hop-aroma', type: QuestionType.MultipleChoiceText,
      prompt: 'How intense is the hop aroma?',
      options: [
        { id: 'be-aroma-low',     label: 'Low — barely detectable' },
        { id: 'be-aroma-medium',  label: 'Medium — present, balanced' },
        { id: 'be-aroma-high',    label: 'High — pronounced, dry-hopped' },
        { id: 'be-aroma-intense', label: 'Intense — heavily dry-hopped, juicy bomb' },
      ],
    },
    {
      id: 'be-sweetness', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is the beer?',
      options: [
        { id: 'be-sweet-bone-dry', label: 'Bone dry — no residual sweetness' },
        { id: 'be-sweet-dry',      label: 'Dry — minimal residual' },
        { id: 'be-sweet-balanced', label: 'Balanced — perceptible malt sweetness' },
        { id: 'be-sweet-sweet',    label: 'Sweet — noticeable residual sugar' },
      ],
    },
    {
      id: 'be-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      options: [
        { id: 'be-fin-short',  label: 'Short — fades within seconds' },
        { id: 'be-fin-medium', label: 'Medium — lingers pleasantly' },
        { id: 'be-fin-long',   label: 'Long — sustained complexity' },
      ],
    },
    {
      id: 'bh-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body and carbonation?',
      difficulty: 'hard',
      options: [
        { id: 'bh-body-light',  label: 'Light & crisp — thin, highly carbonated' },
        { id: 'bh-body-medium', label: 'Medium & lively — balanced weight' },
        { id: 'bh-body-full',   label: 'Full & creamy — thick, low carbonation' },
      ],
    },
    {
      id: 'bh-malt', type: QuestionType.MultipleChoiceText,
      prompt: 'What malt character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'bh-malt-none',     label: 'None — clean, neutral' },
        { id: 'bh-malt-biscuit',  label: 'Biscuit & bread — toasty, cracker-like' },
        { id: 'bh-malt-caramel',  label: 'Caramel & toffee — sweet, amber' },
        { id: 'bh-malt-roasted',  label: 'Roasted & coffee — dark, bitter, chocolate' },
      ],
    },
    {
      id: 'bh-yeast', type: QuestionType.MultipleChoiceText,
      prompt: 'What yeast character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'bh-yeast-clean',   label: 'Clean — no yeast influence detectable' },
        { id: 'bh-yeast-fruity',  label: 'Fruity esters — banana, pear, apple' },
        { id: 'bh-yeast-spicy',   label: 'Spicy phenols — clove, pepper' },
        { id: 'bh-yeast-funky',   label: 'Funky / Brett — barnyard, earthy, sour' },
      ],
    },
    {
      id: 'bh-hops-variety', type: QuestionType.MultipleChoiceText,
      prompt: 'Which hop variety or family does this most resemble?',
      difficulty: 'hard',
      options: [
        { id: 'bh-hops-saaz',      label: 'Saaz / Noble — delicate, herbal, spicy' },
        { id: 'bh-hops-fuggles',   label: 'Fuggles / EKG — earthy, woody, floral' },
        { id: 'bh-hops-cascade',   label: 'Cascade — grapefruit, citrus, floral' },
        { id: 'bh-hops-citra',     label: 'Citra / Simcoe — tropical, lime, passion fruit' },
        { id: 'bh-hops-mosaic',    label: 'Mosaic / Galaxy — juicy, berry, mango' },
        { id: 'bh-hops-amarillo',  label: 'Amarillo / Centennial — orange, tangerine, pine' },
        { id: 'bh-hops-columbus',  label: 'Columbus / Chinook — piney, resinous, dank' },
        { id: 'bh-hops-hallertau', label: 'Hallertau / Tettnang — soft, grassy, floral' },
      ],
    },
    {
      id: 'bh-alcohol', type: QuestionType.MultipleChoiceText,
      prompt: 'How does the alcohol warmth present?',
      difficulty: 'hard',
      options: [
        { id: 'bh-alc-low',    label: 'Low — under 5%, no warmth' },
        { id: 'bh-alc-medium', label: 'Warming — 5–8%, noticeable' },
        { id: 'bh-alc-high',   label: 'Hot — 8%+, prominent heat' },
      ],
    },
    {
      id: 'bh-ferment', type: QuestionType.MultipleChoiceText,
      prompt: 'What fermentation type do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'bh-ferm-ale',   label: 'Ale — top-fermented, warm, fruity esters' },
        { id: 'bh-ferm-lager', label: 'Lager — bottom-fermented, cold, clean and crisp' },
        { id: 'bh-ferm-wild',  label: 'Wild / mixed — Brett, sour, funky' },
      ],
    },
    {
      id: 'bh-region', type: QuestionType.MultipleChoiceText,
      prompt: 'What regional tradition does this beer follow?',
      difficulty: 'hard',
      options: [
        { id: 'bh-reg-belgian',  label: 'Belgian — yeast-driven, complex, often spicy' },
        { id: 'bh-reg-german',   label: 'German — clean, precise, malt-focused' },
        { id: 'bh-reg-british',  label: 'British — balanced, earthy hops, biscuit malt' },
        { id: 'bh-reg-american', label: 'American craft — bold, hop-forward, expressive' },
        { id: 'bh-reg-czech',    label: 'Czech — soft water, noble hops, Pilsner heritage' },
        { id: 'bh-reg-other',    label: 'Other / hybrid' },
      ],
    },
    {
      id: 'bh-adjuncts', type: QuestionType.MultipleChoiceText,
      prompt: 'What adjuncts do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'bh-adj-none',   label: 'None — all malt' },
        { id: 'bh-adj-rice',   label: 'Rice / corn — light lager, crisp, neutral' },
        { id: 'bh-adj-wheat',  label: 'Wheat — soft, tart, hazy mouthfeel' },
        { id: 'bh-adj-oats',   label: 'Oats — creamy, silky, NEIPA or stout body' },
        { id: 'bh-adj-spices', label: 'Spices / fruit — added flavours, fruit purée, herbs' },
      ],
    },
    { id: 'be-nose',    type: QuestionType.Tags,        prompt: 'Aroma (nose)' },
    { id: 'be-palate',  type: QuestionType.Tags,        prompt: 'Palate (flavour)' },
    { id: 'be-abv',     type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '5', unit: '%' },
    { id: 'bh-ibu',     type: QuestionType.NumberInput, prompt: 'What is the IBU?', placeholder: '35', difficulty: 'hard' },
    { id: 'be-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. Germany' },
    { id: 'be-price',   type: QuestionType.Price,       prompt: 'Price per pint?', currencySymbol: '£' },
  ],
};
