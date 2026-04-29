// Candy Pop palette — Y2K light theme
const palette = {
  cream:  '#FFF4E0',
  sun:    '#FFD166',
  melon:  '#EF476F',
  mint:   '#06D6A0',
  ocean:  '#118AB2',
  plum:   '#3D1766',
  ink:    '#2B1055',
} as const;

export const Colors = {
  // Palette (use for design-specific references)
  ...palette,

  // Backgrounds
  background:      palette.cream,
  surface:         '#FFFFFF',
  surfaceElevated: '#FFF8EC',

  // Brand
  primary:         palette.melon,
  primaryLight:    '#FF6E9C',
  primaryDark:     palette.plum,

  // Accents
  gold:            palette.sun,
  goldLight:       '#FFE14D',

  // Text (ink on light backgrounds)
  textPrimary:     palette.ink,
  textSecondary:   '#5C3B70',
  textDisabled:    '#9B8AA6',

  // Semantic
  success:         palette.mint,
  warning:         palette.sun,
  error:           palette.melon,

  // UI
  border:          palette.ink,
  overlay:         'rgba(43,16,85,0.6)',
  transparent:     'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
