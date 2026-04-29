import { QuestionType } from '../constants/gameConstants';
import { Questionnaire } from '../types/questionnaire';
import { SavedGame } from '../types/savedGame';
import { saveQuestionnaire, saveSavedGame } from './database';

const T = 1700000000000; // fixed timestamp so IDs stay stable across reloads

// ─── Beer ──────────────────────────────────────────────────────────────────

const BEER: Questionnaire = {
  id: 'seed-q-beer', name: 'Beer', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'beer-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of beer is this?',
      options: [
        { id: 'beer-style-lager',    label: 'Lager' },
        { id: 'beer-style-pale-ale', label: 'Pale Ale' },
        { id: 'beer-style-ipa',      label: 'IPA' },
        { id: 'beer-style-stout',    label: 'Stout' },
        { id: 'beer-style-porter',   label: 'Porter' },
        { id: 'beer-style-wheat',    label: 'Wheat Beer' },
        { id: 'beer-style-sour',     label: 'Sour' },
        { id: 'beer-style-belgian',  label: 'Belgian Ale' },
        { id: 'beer-style-pilsner',  label: 'Pilsner' },
      ],
    },
    {
      id: 'beer-bitterness', type: QuestionType.MultipleChoiceText,
      prompt: 'How bitter is it?',
      options: [
        { id: 'beer-bitter-low',    label: 'Low — soft & barely there' },
        { id: 'beer-bitter-medium', label: 'Medium — balanced, clean finish' },
        { id: 'beer-bitter-high',   label: 'High — sharp & lingering' },
      ],
    },
    {
      id: 'beer-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the body and carbonation?',
      options: [
        { id: 'beer-body-light',  label: 'Light & crisp — thin, fizzy' },
        { id: 'beer-body-medium', label: 'Medium & lively — balanced weight' },
        { id: 'beer-body-full',   label: 'Full & creamy — thick, smooth' },
      ],
    },
    { id: 'beer-aroma', type: QuestionType.Tags, prompt: 'Aroma & flavour notes' },
    {
      id: 'beer-country', type: QuestionType.MultipleChoiceText,
      prompt: 'What country is it from?',
      options: [
        { id: 'beer-country-uk',      label: 'UK' },
        { id: 'beer-country-ireland', label: 'Ireland' },
        { id: 'beer-country-germany', label: 'Germany' },
        { id: 'beer-country-belgium', label: 'Belgium' },
        { id: 'beer-country-czech',   label: 'Czech Republic' },
        { id: 'beer-country-usa',     label: 'USA' },
        { id: 'beer-country-japan',   label: 'Japan' },
        { id: 'beer-country-italy',   label: 'Italy' },
        { id: 'beer-country-mexico',  label: 'Mexico' },
        { id: 'beer-country-aus',     label: 'Australia' },
      ],
    },
    { id: 'beer-price', type: QuestionType.Price, prompt: 'Price per pint?', currencySymbol: '£' },
  ],
};

const BEER_GAME: SavedGame = {
  id: 'seed-game-beer', name: 'Beer Night', questionnaireId: 'seed-q-beer', createdAt: T, updatedAt: T,
  rounds: [
    {
      number: 1, label: 'Peroni Nastro Azzurro',
      correctAnswers: [
        { questionId: 'beer-style',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-style-lager' },
        { questionId: 'beer-bitterness',type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-bitter-low' },
        { questionId: 'beer-body',     type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-body-light' },
        { questionId: 'beer-aroma',    type: QuestionType.Tags, tags: ['Caramel & Toffee', 'Earthy & Herbal'] },
        { questionId: 'beer-country',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-country-italy' },
        { questionId: 'beer-price',    type: QuestionType.Price,              value: 3.5 },
      ],
    },
    {
      number: 2, label: 'BrewDog Punk IPA',
      correctAnswers: [
        { questionId: 'beer-style',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-style-ipa' },
        { questionId: 'beer-bitterness',type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-bitter-high' },
        { questionId: 'beer-body',     type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-body-medium' },
        { questionId: 'beer-aroma',    type: QuestionType.Tags, tags: ['Citrus & Tropical', 'Piney & Resinous'] },
        { questionId: 'beer-country',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-country-uk' },
        { questionId: 'beer-price',    type: QuestionType.Price,              value: 4.2 },
      ],
    },
    {
      number: 3, label: 'Guinness Draught',
      correctAnswers: [
        { questionId: 'beer-style',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-style-stout' },
        { questionId: 'beer-bitterness',type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-bitter-medium' },
        { questionId: 'beer-body',     type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-body-full' },
        { questionId: 'beer-aroma',    type: QuestionType.Tags, tags: ['Roasted & Coffee', 'Caramel & Toffee'] },
        { questionId: 'beer-country',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'beer-country-ireland' },
        { questionId: 'beer-price',    type: QuestionType.Price,              value: 3.8 },
      ],
    },
  ],
};

// ─── Wine ──────────────────────────────────────────────────────────────────

const WINE: Questionnaire = {
  id: 'seed-q-wine', name: 'Wine', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'wine-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      options: [
        { id: 'wine-acidity-low',    label: 'Low — soft, round, flat' },
        { id: 'wine-acidity-medium', label: 'Medium — fresh, balanced' },
        { id: 'wine-acidity-high',   label: 'High — crisp, mouthwatering, tingly' },
      ],
    },
    {
      id: 'wine-oak', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you detect oak influence?',
      options: [
        { id: 'wine-oak-none',   label: 'Unoaked — pure fruit, no wood' },
        { id: 'wine-oak-light',  label: 'Lightly oaked — subtle vanilla & spice' },
        { id: 'wine-oak-heavy',  label: 'Heavily oaked — vanilla, toast, butter, cream' },
      ],
    },
    { id: 'wine-notes', type: QuestionType.Tags, prompt: 'Tasting notes' },
    {
      id: 'wine-year', type: QuestionType.SliderNumber,
      prompt: 'Vintage year', min: 2000, max: 2024, step: 1,
    },
    {
      id: 'wine-country', type: QuestionType.MultipleChoiceText,
      prompt: 'What country is it from?',
      options: [
        { id: 'wine-country-france',    label: 'France' },
        { id: 'wine-country-italy',     label: 'Italy' },
        { id: 'wine-country-spain',     label: 'Spain' },
        { id: 'wine-country-nz',        label: 'New Zealand' },
        { id: 'wine-country-aus',       label: 'Australia' },
        { id: 'wine-country-argentina', label: 'Argentina' },
        { id: 'wine-country-usa',       label: 'USA' },
        { id: 'wine-country-chile',     label: 'Chile' },
        { id: 'wine-country-sa',        label: 'South Africa' },
        { id: 'wine-country-germany',   label: 'Germany' },
        { id: 'wine-country-portugal',  label: 'Portugal' },
      ],
    },
    { id: 'wine-price', type: QuestionType.Price, prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};

const WINE_GAME: SavedGame = {
  id: 'seed-game-wine', name: 'Wine Night', questionnaireId: 'seed-q-wine', createdAt: T, updatedAt: T,
  rounds: [
    {
      number: 1, label: 'Château Margaux 2018',
      correctAnswers: [
        { questionId: 'wine-acidity', type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-acidity-medium' },
        { questionId: 'wine-oak',     type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-oak-heavy' },
        { questionId: 'wine-notes',   type: QuestionType.Tags, tags: ['Dark Fruit', 'Earthy & Leathery', 'Floral'] },
        { questionId: 'wine-year',    type: QuestionType.SliderNumber,       value: 2018 },
        { questionId: 'wine-country', type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-country-france' },
        { questionId: 'wine-price',   type: QuestionType.Price,              value: 22 },
      ],
    },
    {
      number: 2, label: 'Cloudy Bay Sauvignon Blanc 2022',
      correctAnswers: [
        { questionId: 'wine-acidity', type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-acidity-high' },
        { questionId: 'wine-oak',     type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-oak-none' },
        { questionId: 'wine-notes',   type: QuestionType.Tags, tags: ['Citrus', 'Herbaceous', 'Floral'] },
        { questionId: 'wine-year',    type: QuestionType.SliderNumber,       value: 2022 },
        { questionId: 'wine-country', type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-country-nz' },
        { questionId: 'wine-price',   type: QuestionType.Price,              value: 18 },
      ],
    },
    {
      number: 3, label: 'Whispering Angel Rosé 2023',
      correctAnswers: [
        { questionId: 'wine-acidity', type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-acidity-medium' },
        { questionId: 'wine-oak',     type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-oak-none' },
        { questionId: 'wine-notes',   type: QuestionType.Tags, tags: ['Red Berry', 'Floral', 'Stone Fruit'] },
        { questionId: 'wine-year',    type: QuestionType.SliderNumber,       value: 2023 },
        { questionId: 'wine-country', type: QuestionType.MultipleChoiceText, selectedOptionId: 'wine-country-france' },
        { questionId: 'wine-price',   type: QuestionType.Price,              value: 14 },
      ],
    },
  ],
};

// ─── Sparkling Wine ────────────────────────────────────────────────────────

const SPARKLING: Questionnaire = {
  id: 'seed-q-sparkling', name: 'Sparkling Wine', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'spark-style', type: QuestionType.MultipleChoiceText,
      prompt: 'What style of sparkling wine is this?',
      options: [
        { id: 'spark-style-champagne', label: 'Champagne' },
        { id: 'spark-style-prosecco',  label: 'Prosecco' },
        { id: 'spark-style-cava',      label: 'Cava' },
        { id: 'spark-style-english',   label: 'English Sparkling' },
        { id: 'spark-style-cremant',   label: 'Crémant' },
        { id: 'spark-style-sekt',      label: 'Sekt' },
        { id: 'spark-style-newworld',  label: 'New World Sparkling' },
      ],
    },
    {
      id: 'spark-method', type: QuestionType.MultipleChoiceText,
      prompt: 'What do you smell on the nose?',
      options: [
        { id: 'spark-method-traditional', label: 'Bready, biscuity & yeasty — aged on lees' },
        { id: 'spark-method-tank',        label: 'Fresh, floral & fruity — light and aromatic' },
      ],
    },
    {
      id: 'spark-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity?',
      options: [
        { id: 'spark-acid-low',    label: 'Low — gentle & rounded' },
        { id: 'spark-acid-medium', label: 'Medium — lively & refreshing' },
        { id: 'spark-acid-high',   label: 'High — piercing & mineral' },
      ],
    },
    {
      id: 'spark-bead', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the bubbles?',
      options: [
        { id: 'spark-bead-fine',  label: 'Fine & persistent — like a string of pearls' },
        { id: 'spark-bead-large', label: 'Large & frothy — disperses quickly' },
      ],
    },
    {
      id: 'spark-dosage', type: QuestionType.MultipleChoiceText,
      prompt: 'How sweet is it? (dosage level)',
      options: [
        { id: 'spark-dosage-extra-brut', label: 'Extra Brut — bone dry' },
        { id: 'spark-dosage-brut',       label: 'Brut — dry' },
        { id: 'spark-dosage-extra-dry',  label: 'Extra Dry — off-dry' },
        { id: 'spark-dosage-sec',        label: 'Sec — medium sweet' },
        { id: 'spark-dosage-demi-sec',   label: 'Demi-Sec — sweet' },
      ],
    },
    { id: 'spark-price', type: QuestionType.Price, prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};

const SPARKLING_GAME: SavedGame = {
  id: 'seed-game-sparkling', name: 'Sparkling Wine Tasting', questionnaireId: 'seed-q-sparkling', createdAt: T, updatedAt: T,
  rounds: [
    {
      number: 1, label: 'Moët & Chandon Imperial Brut NV',
      correctAnswers: [
        { questionId: 'spark-style',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-style-champagne' },
        { questionId: 'spark-method', type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-method-traditional' },
        { questionId: 'spark-acidity',type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-acid-high' },
        { questionId: 'spark-bead',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-bead-fine' },
        { questionId: 'spark-dosage', type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-dosage-brut' },
        { questionId: 'spark-price',  type: QuestionType.Price,              value: 45 },
      ],
    },
    {
      number: 2, label: 'Valdobbiadene Prosecco Superiore',
      correctAnswers: [
        { questionId: 'spark-style',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-style-prosecco' },
        { questionId: 'spark-method', type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-method-tank' },
        { questionId: 'spark-acidity',type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-acid-low' },
        { questionId: 'spark-bead',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-bead-large' },
        { questionId: 'spark-dosage', type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-dosage-extra-dry' },
        { questionId: 'spark-price',  type: QuestionType.Price,              value: 14 },
      ],
    },
    {
      number: 3, label: 'Nyetimber Classic Cuvée NV',
      correctAnswers: [
        { questionId: 'spark-style',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-style-english' },
        { questionId: 'spark-method', type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-method-traditional' },
        { questionId: 'spark-acidity',type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-acid-high' },
        { questionId: 'spark-bead',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-bead-fine' },
        { questionId: 'spark-dosage', type: QuestionType.MultipleChoiceText, selectedOptionId: 'spark-dosage-brut' },
        { questionId: 'spark-price',  type: QuestionType.Price,              value: 40 },
      ],
    },
  ],
};

// ─── Chocolate ─────────────────────────────────────────────────────────────

const CHOCOLATE: Questionnaire = {
  id: 'seed-q-chocolate', name: 'Chocolate', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'choc-cacao', type: QuestionType.SliderNumber,
      prompt: 'Cacao percentage?', min: 30, max: 100, step: 5,
    },
    {
      id: 'choc-snap', type: QuestionType.MultipleChoiceText,
      prompt: 'How does it snap when broken?',
      options: [
        { id: 'choc-snap-crisp', label: 'Clean & crisp — sharp break, firm' },
        { id: 'choc-snap-soft',  label: 'Soft — bends before it breaks' },
        { id: 'choc-snap-none',  label: 'No snap — crumbles or waxy' },
      ],
    },
    {
      id: 'choc-melt', type: QuestionType.MultipleChoiceText,
      prompt: 'How does it melt on your tongue?',
      options: [
        { id: 'choc-melt-smooth',  label: 'Smooth & quick — melts evenly, coats the palate' },
        { id: 'choc-melt-grainy',  label: 'Slightly grainy — some texture as it melts' },
        { id: 'choc-melt-chalky',  label: 'Chalky or waxy — slow to melt, gritty' },
      ],
    },
    { id: 'choc-notes', type: QuestionType.Tags, prompt: 'Flavour notes' },
    {
      id: 'choc-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the finish?',
      options: [
        { id: 'choc-finish-short-sweet', label: 'Short & sweet — fades quickly, pleasant' },
        { id: 'choc-finish-medium',      label: 'Medium — lingers with some depth' },
        { id: 'choc-finish-long-bitter', label: 'Long & bitter — cocoa persists, slightly drying' },
      ],
    },
    { id: 'choc-price', type: QuestionType.Price, prompt: 'Price per 100g bar?', currencySymbol: '£' },
  ],
};

const CHOCOLATE_GAME: SavedGame = {
  id: 'seed-game-chocolate', name: 'Chocolate Tasting', questionnaireId: 'seed-q-chocolate', createdAt: T, updatedAt: T,
  rounds: [
    {
      number: 1, label: 'Valrhona Manjari 64%',
      correctAnswers: [
        { questionId: 'choc-cacao',   type: QuestionType.SliderNumber,       value: 65 },
        { questionId: 'choc-snap',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-snap-crisp' },
        { questionId: 'choc-melt',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-melt-smooth' },
        { questionId: 'choc-notes',   type: QuestionType.Tags, tags: ['Fruity', 'Earthy', 'Bitter Cocoa'] },
        { questionId: 'choc-finish',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-finish-long-bitter' },
        { questionId: 'choc-price',   type: QuestionType.Price,              value: 4.5 },
      ],
    },
    {
      number: 2, label: 'Godiva Milk Chocolate',
      correctAnswers: [
        { questionId: 'choc-cacao',   type: QuestionType.SliderNumber,       value: 35 },
        { questionId: 'choc-snap',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-snap-crisp' },
        { questionId: 'choc-melt',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-melt-smooth' },
        { questionId: 'choc-notes',   type: QuestionType.Tags, tags: ['Sweet & Milky', 'Caramel', 'Nutty'] },
        { questionId: 'choc-finish',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-finish-short-sweet' },
        { questionId: 'choc-price',   type: QuestionType.Price,              value: 2.8 },
      ],
    },
    {
      number: 3, label: "Green & Black's 90%",
      correctAnswers: [
        { questionId: 'choc-cacao',   type: QuestionType.SliderNumber,       value: 90 },
        { questionId: 'choc-snap',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-snap-crisp' },
        { questionId: 'choc-melt',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-melt-grainy' },
        { questionId: 'choc-notes',   type: QuestionType.Tags, tags: ['Bitter Cocoa', 'Earthy', 'Spice'] },
        { questionId: 'choc-finish',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'choc-finish-long-bitter' },
        { questionId: 'choc-price',   type: QuestionType.Price,              value: 3.2 },
      ],
    },
  ],
};

// ─── Whisky ────────────────────────────────────────────────────────────────

const WHISKY: Questionnaire = {
  id: 'seed-q-whisky', name: 'Whisky', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'whisk-region', type: QuestionType.MultipleChoiceText,
      prompt: 'What region is this whisky from?',
      options: [
        { id: 'whisk-region-speyside',    label: 'Speyside' },
        { id: 'whisk-region-islay',       label: 'Islay' },
        { id: 'whisk-region-highland',    label: 'Highland' },
        { id: 'whisk-region-lowland',     label: 'Lowland' },
        { id: 'whisk-region-bourbon',     label: 'Bourbon (USA)' },
        { id: 'whisk-region-irish',       label: 'Irish' },
        { id: 'whisk-region-japanese',    label: 'Japanese' },
        { id: 'whisk-region-campbeltown', label: 'Campbeltown' },
      ],
    },
    {
      id: 'whisk-age', type: QuestionType.SliderNumber,
      prompt: 'Age in years', min: 3, max: 30, step: 1,
    },
    {
      id: 'whisk-peat', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the peat and smoke?',
      options: [
        { id: 'whisk-peat-none',     label: 'Unpeated — no smoke at all' },
        { id: 'whisk-peat-heathery', label: 'Lightly heathery — floral, honeyed smoke' },
        { id: 'whisk-peat-coastal',  label: 'Coastal & briny — salty, marine smoke' },
        { id: 'whisk-peat-medicinal',label: 'Heavily medicinal — TCP, iodine, seaweed' },
      ],
    },
    { id: 'whisk-notes', type: QuestionType.Tags, prompt: 'Tasting notes' },
    {
      id: 'whisk-finish', type: QuestionType.MultipleChoiceText,
      prompt: 'How long is the finish?',
      options: [
        { id: 'whisk-finish-short',  label: 'Short — fades within seconds' },
        { id: 'whisk-finish-medium', label: 'Medium — lingers pleasantly' },
        { id: 'whisk-finish-long',   label: 'Long — stays with you a good while' },
      ],
    },
    { id: 'whisk-price', type: QuestionType.Price, prompt: 'Price per bottle?', currencySymbol: '£' },
  ],
};

const WHISKY_GAME: SavedGame = {
  id: 'seed-game-whisky', name: 'Whisky Tasting', questionnaireId: 'seed-q-whisky', createdAt: T, updatedAt: T,
  rounds: [
    {
      number: 1, label: 'Laphroaig 10 Year Old',
      correctAnswers: [
        { questionId: 'whisk-region', type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-region-islay' },
        { questionId: 'whisk-age',    type: QuestionType.SliderNumber,       value: 10 },
        { questionId: 'whisk-peat',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-peat-medicinal' },
        { questionId: 'whisk-notes',  type: QuestionType.Tags, tags: ['Maritime & Briny', 'Vanilla & Oak', 'Spicy'] },
        { questionId: 'whisk-finish', type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-finish-long' },
        { questionId: 'whisk-price',  type: QuestionType.Price,              value: 45 },
      ],
    },
    {
      number: 2, label: 'Glenfiddich 12 Year Old',
      correctAnswers: [
        { questionId: 'whisk-region', type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-region-speyside' },
        { questionId: 'whisk-age',    type: QuestionType.SliderNumber,       value: 12 },
        { questionId: 'whisk-peat',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-peat-none' },
        { questionId: 'whisk-notes',  type: QuestionType.Tags, tags: ['Fruity', 'Vanilla & Oak', 'Floral & Heather'] },
        { questionId: 'whisk-finish', type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-finish-medium' },
        { questionId: 'whisk-price',  type: QuestionType.Price,              value: 38 },
      ],
    },
    {
      number: 3, label: "Maker's Mark Bourbon",
      correctAnswers: [
        { questionId: 'whisk-region', type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-region-bourbon' },
        { questionId: 'whisk-age',    type: QuestionType.SliderNumber,       value: 6 },
        { questionId: 'whisk-peat',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-peat-none' },
        { questionId: 'whisk-notes',  type: QuestionType.Tags, tags: ['Vanilla & Oak', 'Caramel & Toffee', 'Spicy'] },
        { questionId: 'whisk-finish', type: QuestionType.MultipleChoiceText, selectedOptionId: 'whisk-finish-medium' },
        { questionId: 'whisk-price',  type: QuestionType.Price,              value: 35 },
      ],
    },
  ],
};

// ─── Coffee ────────────────────────────────────────────────────────────────

const COFFEE: Questionnaire = {
  id: 'seed-q-coffee', name: 'Coffee', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'coffee-origin', type: QuestionType.MultipleChoiceText,
      prompt: 'Where are the beans from?',
      options: [
        { id: 'coffee-origin-ethiopian',  label: 'Ethiopian' },
        { id: 'coffee-origin-colombian',  label: 'Colombian' },
        { id: 'coffee-origin-brazilian',  label: 'Brazilian' },
        { id: 'coffee-origin-kenyan',     label: 'Kenyan' },
        { id: 'coffee-origin-guatemalan', label: 'Guatemalan' },
        { id: 'coffee-origin-jamaican',   label: 'Jamaican' },
        { id: 'coffee-origin-vietnamese', label: 'Vietnamese' },
      ],
    },
    {
      id: 'coffee-roast', type: QuestionType.MultipleChoiceText,
      prompt: 'What is the roast level?',
      options: [
        { id: 'coffee-roast-light',  label: 'Light — bright, acidic, complex' },
        { id: 'coffee-roast-medium', label: 'Medium — balanced, rounded, sweet' },
        { id: 'coffee-roast-dark',   label: 'Dark — bold, bitter, smoky' },
      ],
    },
    {
      id: 'coffee-acidity', type: QuestionType.MultipleChoiceText,
      prompt: 'How would you describe the acidity (brightness)?',
      options: [
        { id: 'coffee-acid-low',    label: 'Low — flat, smooth, gentle' },
        { id: 'coffee-acid-medium', label: 'Medium — bright, lively, balanced' },
        { id: 'coffee-acid-high',   label: 'High — vivid, snappy, almost sparkling' },
      ],
    },
    {
      id: 'coffee-body', type: QuestionType.MultipleChoiceText,
      prompt: 'How does it feel in your mouth?',
      options: [
        { id: 'coffee-body-light',  label: 'Light — thin, tea-like, delicate' },
        { id: 'coffee-body-medium', label: 'Medium — smooth, balanced' },
        { id: 'coffee-body-full',   label: 'Full — heavy, syrupy, coating' },
      ],
    },
    { id: 'coffee-notes', type: QuestionType.Tags, prompt: 'Tasting notes' },
    { id: 'coffee-price', type: QuestionType.Price, prompt: 'Price per 250g bag?', currencySymbol: '£' },
  ],
};

const COFFEE_GAME: SavedGame = {
  id: 'seed-game-coffee', name: 'Coffee Tasting', questionnaireId: 'seed-q-coffee', createdAt: T, updatedAt: T,
  rounds: [
    {
      number: 1, label: 'Yirgacheffe Natural Process',
      correctAnswers: [
        { questionId: 'coffee-origin',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-origin-ethiopian' },
        { questionId: 'coffee-roast',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-roast-light' },
        { questionId: 'coffee-acidity', type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-acid-high' },
        { questionId: 'coffee-body',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-body-light' },
        { questionId: 'coffee-notes',   type: QuestionType.Tags, tags: ['Fruity & Jammy', 'Floral', 'Citrus'] },
        { questionId: 'coffee-price',   type: QuestionType.Price,              value: 12 },
      ],
    },
    {
      number: 2, label: 'Colombian Supremo',
      correctAnswers: [
        { questionId: 'coffee-origin',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-origin-colombian' },
        { questionId: 'coffee-roast',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-roast-medium' },
        { questionId: 'coffee-acidity', type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-acid-medium' },
        { questionId: 'coffee-body',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-body-medium' },
        { questionId: 'coffee-notes',   type: QuestionType.Tags, tags: ['Dark Chocolate', 'Caramel', 'Nutty'] },
        { questionId: 'coffee-price',   type: QuestionType.Price,              value: 9 },
      ],
    },
    {
      number: 3, label: 'Santos Dark Roast',
      correctAnswers: [
        { questionId: 'coffee-origin',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-origin-brazilian' },
        { questionId: 'coffee-roast',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-roast-dark' },
        { questionId: 'coffee-acidity', type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-acid-low' },
        { questionId: 'coffee-body',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'coffee-body-full' },
        { questionId: 'coffee-notes',   type: QuestionType.Tags, tags: ['Dark Chocolate', 'Smoky & Bitter', 'Earthy'] },
        { questionId: 'coffee-price',   type: QuestionType.Price,              value: 8 },
      ],
    },
  ],
};

// ─── Olive Oil ─────────────────────────────────────────────────────────────

const OLIVE_OIL: Questionnaire = {
  id: 'seed-q-olive-oil', name: 'Olive Oil', createdAt: T, updatedAt: T,
  questions: [
    {
      id: 'oil-country', type: QuestionType.MultipleChoiceText,
      prompt: 'Which country is this oil from?',
      options: [
        { id: 'oil-country-italian',    label: 'Italian' },
        { id: 'oil-country-spanish',    label: 'Spanish' },
        { id: 'oil-country-greek',      label: 'Greek' },
        { id: 'oil-country-tunisian',   label: 'Tunisian' },
        { id: 'oil-country-moroccan',   label: 'Moroccan' },
        { id: 'oil-country-portuguese', label: 'Portuguese' },
        { id: 'oil-country-australian', label: 'Australian' },
      ],
    },
    {
      id: 'oil-fruit-char', type: QuestionType.MultipleChoiceText,
      prompt: 'What character does the fruitiness have?',
      options: [
        { id: 'oil-fruit-green', label: 'Green — grassy, artichoke, green almond, tomato leaf' },
        { id: 'oil-fruit-ripe',  label: 'Ripe — melon, fig, stone fruit, sweet' },
      ],
    },
    {
      id: 'oil-intensity', type: QuestionType.MultipleChoiceText,
      prompt: 'How intense is the overall flavour?',
      options: [
        { id: 'oil-intensity-delicate', label: 'Delicate — subtle, mild, gentle' },
        { id: 'oil-intensity-medium',   label: 'Medium — clear olive character' },
        { id: 'oil-intensity-robust',   label: 'Robust — powerful, assertive' },
      ],
    },
    {
      id: 'oil-pungency', type: QuestionType.MultipleChoiceText,
      prompt: 'Do you feel peppery pungency in the back of your throat?',
      options: [
        { id: 'oil-pung-none',   label: 'None — no burn at all' },
        { id: 'oil-pung-mild',   label: 'Mild — gentle warmth' },
        { id: 'oil-pung-strong', label: 'Strong — makes you want to cough' },
      ],
    },
    { id: 'oil-notes', type: QuestionType.Tags, prompt: 'Tasting notes' },
    { id: 'oil-price', type: QuestionType.Price, prompt: 'Price per 500ml?', currencySymbol: '£' },
  ],
};

const OLIVE_OIL_GAME: SavedGame = {
  id: 'seed-game-olive-oil', name: 'Olive Oil Tasting', questionnaireId: 'seed-q-olive-oil', createdAt: T, updatedAt: T,
  rounds: [
    {
      number: 1, label: 'Frantoio Muraglia EVOO',
      correctAnswers: [
        { questionId: 'oil-country',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-country-italian' },
        { questionId: 'oil-fruit-char', type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-fruit-green' },
        { questionId: 'oil-intensity',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-intensity-robust' },
        { questionId: 'oil-pungency',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-pung-strong' },
        { questionId: 'oil-notes',      type: QuestionType.Tags, tags: ['Peppery', 'Artichoke & Herbal', 'Bitter'] },
        { questionId: 'oil-price',      type: QuestionType.Price,              value: 18 },
      ],
    },
    {
      number: 2, label: 'Iliada PDO Kalamata',
      correctAnswers: [
        { questionId: 'oil-country',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-country-greek' },
        { questionId: 'oil-fruit-char', type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-fruit-green' },
        { questionId: 'oil-intensity',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-intensity-medium' },
        { questionId: 'oil-pungency',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-pung-mild' },
        { questionId: 'oil-notes',      type: QuestionType.Tags, tags: ['Grassy & Green', 'Artichoke & Herbal', 'Almond & Nutty'] },
        { questionId: 'oil-price',      type: QuestionType.Price,              value: 12 },
      ],
    },
    {
      number: 3, label: 'Carbonell Extra Virgin',
      correctAnswers: [
        { questionId: 'oil-country',    type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-country-spanish' },
        { questionId: 'oil-fruit-char', type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-fruit-ripe' },
        { questionId: 'oil-intensity',  type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-intensity-delicate' },
        { questionId: 'oil-pungency',   type: QuestionType.MultipleChoiceText, selectedOptionId: 'oil-pung-none' },
        { questionId: 'oil-notes',      type: QuestionType.Tags, tags: ['Buttery & Round', 'Almond & Nutty', 'Fig & Melon'] },
        { questionId: 'oil-price',      type: QuestionType.Price,              value: 9 },
      ],
    },
  ],
};

// ─── Seed function ──────────────────────────────────────────────────────────

const ALL_QUESTIONNAIRES = [BEER, WINE, SPARKLING, CHOCOLATE, WHISKY, COFFEE, OLIVE_OIL];
const ALL_GAMES          = [BEER_GAME, WINE_GAME, SPARKLING_GAME, CHOCOLATE_GAME, WHISKY_GAME, COFFEE_GAME, OLIVE_OIL_GAME];

export async function seedDatabase(): Promise<void> {
  for (const q of ALL_QUESTIONNAIRES) await saveQuestionnaire(q);
  for (const g of ALL_GAMES)          await saveSavedGame(g);
}
