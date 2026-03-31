import { Platform } from 'react-native';

const FONTS = {
  regular: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  bold: Platform.OS === 'ios' ? 'Georgia-Bold' : 'serif',
  mono: Platform.OS === 'ios' ? 'Courier' : 'monospace',
};

const FONT_SIZES = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 36,
};

const LINE_HEIGHTS = {
  xs: 16,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 30,
  xxl: 36,
  display: 44,
};

const FONT_WEIGHTS = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export { FONTS, FONT_SIZES, LINE_HEIGHTS, FONT_WEIGHTS };
