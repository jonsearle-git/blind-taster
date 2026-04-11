export const Colors = {
  // Backgrounds
  background:      '#0F0A0B',
  surface:         '#1C1418',
  surfaceElevated: '#2A1E23',

  // Brand
  primary:         '#C0392B',
  primaryLight:    '#E74C3C',
  primaryDark:     '#922B21',

  // Accents
  gold:            '#D4AC0D',
  goldLight:       '#F1C40F',

  // Text
  textPrimary:     '#F5F0F1',
  textSecondary:   '#A89298',
  textDisabled:    '#5C4A50',

  // Semantic
  success:         '#27AE60',
  warning:         '#E67E22',
  error:           '#C0392B',

  // UI
  border:          '#2A1E23',
  overlay:         'rgba(0,0,0,0.6)',
  transparent:     'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
