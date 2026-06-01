import { QuestionType } from '../constants/gameConstants';
import { Questionnaire } from '../types/questionnaire';
import { clearQuestionnaires, saveQuestionnaire } from './database';

const T = 1700000000000;

// ─── Beer ──────────────────────────────────────────────────────────────────

const BEER: Questionnaire = {
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

// ─── White Wine ────────────────────────────────────────────────────────────

const WHITE_WINE: Questionnaire = {
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

// ─── Red Wine ──────────────────────────────────────────────────────────────

const RED_WINE: Questionnaire = {
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

// ─── Sparkling Wine ────────────────────────────────────────────────────────

const SPARKLING: Questionnaire = {
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

// ─── Whisky ────────────────────────────────────────────────────────────────

const WHISKY: Questionnaire = {
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
        { id: 'wsh-cereal-none',    label: 'None — neutral, no grain character' },
        { id: 'wsh-cereal-biscuit', label: 'Biscuit / cracker — light, dry, malty' },
        { id: 'wsh-cereal-honey',   label: 'Honey-malt — sweet, rich, golden cereal' },
        { id: 'wsh-cereal-porridge',label: 'Porridge / oat — full, grainy, hearty' },
      ],
    },
    {
      id: 'wsh-mash', type: QuestionType.MultipleChoiceText,
      prompt: 'What mash bill / grain base do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'wsh-mash-malt',     label: 'Single malt — 100% malted barley, fruity, malty' },
        { id: 'wsh-mash-bourbon',  label: 'Bourbon — corn-led (≥51%), sweet, vanilla, caramel' },
        { id: 'wsh-mash-rye',      label: 'Rye-dominant — spicy, peppery, dry' },
        { id: 'wsh-mash-wheated',  label: 'Wheated bourbon — soft, sweet, gentle' },
        { id: 'wsh-mash-grain',    label: 'Single grain — wheat or corn base, light, neutral' },
        { id: 'wsh-mash-blended',  label: 'Blended — malt + grain whisky combined' },
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

// ─── Gin ───────────────────────────────────────────────────────────────────

const GIN: Questionnaire = {
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
        { id: 'gh-dist-pot',     label: 'Pot still — rich, full-bodied, botanically complex' },
        { id: 'gh-dist-column',  label: 'Column still — light, neutral, clean' },
        { id: 'gh-dist-compound',label: 'Compound — flavourings added without redistillation, simple' },
      ],
    },
    {
      id: 'gh-spice', type: QuestionType.MultipleChoiceText,
      prompt: 'What spice character do you detect?',
      difficulty: 'hard',
      options: [
        { id: 'gh-spice-none',     label: 'None — no spice' },
        { id: 'gh-spice-coriander',label: 'Coriander — citrusy, ginger-like, sage' },
        { id: 'gh-spice-cardamom', label: 'Cardamom — sweet, warming, perfumed' },
        { id: 'gh-spice-pepper',   label: 'Pepper — black or Sichuan, peppery heat' },
        { id: 'gh-spice-anise',    label: 'Anise / star anise — liquorice, sweet' },
        { id: 'gh-spice-cinnamon', label: 'Cinnamon / cassia — warming, sweet bark' },
      ],
    },
    { id: 'ge-nose',    type: QuestionType.Tags,        prompt: 'Nose' },
    { id: 'ge-palate',  type: QuestionType.Tags,        prompt: 'Palate' },
    { id: 'ge-abv',     type: QuestionType.NumberInput, prompt: 'What is the ABV?', placeholder: '42', unit: '%' },
    { id: 'ge-country', type: QuestionType.TextInput,   prompt: 'What country is it from?', placeholder: 'e.g. Scotland' },
    { id: 'ge-price',   type: QuestionType.Price,       prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};

// ─── Rosé Wine ─────────────────────────────────────────────────────────────

const ROSE: Questionnaire = {
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
    { id: 'roh-grape',   type: QuestionType.TextInput,  prompt: 'What grape variety or blend is this?', placeholder: 'e.g. Grenache', difficulty: 'hard' },
    { id: 'roh-region',  type: QuestionType.TextInput,  prompt: 'What region is it from?', placeholder: 'e.g. Provence', difficulty: 'hard' },
    { id: 'roe-country', type: QuestionType.TextInput,  prompt: 'What country is it from?', placeholder: 'e.g. France' },
    { id: 'roe-price',   type: QuestionType.Price,      prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};

// ─── Cider ─────────────────────────────────────────────────────────────────

const CIDER: Questionnaire = {
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

// ─── Fortified Wine ────────────────────────────────────────────────────────

const FORTIFIED: Questionnaire = {
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

// ─── Orange Wine ───────────────────────────────────────────────────────────

const ORANGE: Questionnaire = {
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
    { id: 'oh-grape',   type: QuestionType.TextInput,  prompt: 'What grape variety is this?', placeholder: 'e.g. Rkatsiteli', difficulty: 'hard' },
    { id: 'oh-region',  type: QuestionType.TextInput,  prompt: 'What region is it from?', placeholder: 'e.g. Kakheti', difficulty: 'hard' },
    { id: 'oe-country', type: QuestionType.TextInput,  prompt: 'What country is it from?', placeholder: 'e.g. Georgia' },
    { id: 'oe-price',   type: QuestionType.Price,      prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};

// ─── Seed function ──────────────────────────────────────────────────────────

const ALL_QUESTIONNAIRES: Questionnaire[] = [
  WHITE_WINE,
  RED_WINE,
  ROSE,
  ORANGE,
  SPARKLING,
  FORTIFIED,
  CIDER,
  BEER,
  GIN,
  WHISKY,
];

export async function seedDatabase(): Promise<void> {
  await clearQuestionnaires();
  for (const q of ALL_QUESTIONNAIRES) await saveQuestionnaire(q);
}

export { seedDatabase as seedIfNeeded };
