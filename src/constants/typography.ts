export const FontSize = {
  xs:   11,
  sm:   13,
  md:   15,
  lg:   18,
  xl:   22,
  xxl:  28,
  hero: 40,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium:  '500' as const,
  bold:    '700' as const,
  black:   '900' as const,
};

export const FontFamily = {
  display: 'AlfaSlabOne_400Regular',
  heading: 'Fraunces_700Bold',
  body:    'DMSans_400Regular',
  bodyBold:'DMSans_700Bold',
} as const;
