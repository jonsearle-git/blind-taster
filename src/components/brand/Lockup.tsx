import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { Monogram } from './Monogram';

type Layout = 'horizontal' | 'stacked';
type Tone   = 'color' | 'dark' | 'light';

type Props = {
  layout?:       Layout;
  tone?:         Tone;
  monogramSize?: number;
  style?:        ViewStyle;
};

const TONE_COLOR: Record<Tone, string> = {
  color: Colors.ink,
  dark:  Colors.ink,
  light: Colors.cream,
};

export function Lockup({
  layout       = 'horizontal',
  tone         = 'color',
  monogramSize = 80,
  style,
}: Props): React.ReactElement {
  const textColor = TONE_COLOR[tone];
  const nameSize  = monogramSize * 0.55;

  const Wordmark = (
    <View style={styles.wordmark}>
      <Text style={[styles.word, { color: textColor, fontSize: nameSize }]}>
        BLIND
      </Text>
      <Text style={[styles.word, { color: textColor, fontSize: nameSize }]}>
        TASTER
      </Text>
    </View>
  );

  if (layout === 'stacked') {
    return (
      <View style={[styles.stacked, style]}>
        <Monogram size={monogramSize} />
        <Text style={[styles.stackedWord, { color: textColor, fontSize: nameSize }]}>
          BLIND TASTER
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.horizontal, style]}>
      <Monogram size={monogramSize} />
      {Wordmark}
    </View>
  );
}

const styles = StyleSheet.create({
  horizontal: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.md,
  },
  stacked: {
    alignItems: 'center',
    gap:        Spacing.sm,
  },
  wordmark: {
    flexDirection:  'column',
    justifyContent: 'center',
  },
  word: {
    fontFamily:    FontFamily.display,
    fontWeight:    FontWeight.black,
    letterSpacing: -1,
    lineHeight:    FontSize.xl * 1.1,
  },
  stackedWord: {
    fontFamily:    FontFamily.display,
    fontWeight:    FontWeight.black,
    letterSpacing: -1,
    textAlign:     'center',
  },
});
