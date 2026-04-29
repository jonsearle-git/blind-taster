import { StyleSheet, Text, Pressable, ActivityIndicator, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';

type Variant = 'primary' | 'secondary' | 'destructive';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

const VARIANT_BG: Record<Variant, string> = {
  primary:     Colors.melon,
  secondary:   Colors.cream,
  destructive: Colors.error,
};

const VARIANT_LABEL: Record<Variant, string> = {
  primary:     Colors.cream,
  secondary:   Colors.ink,
  destructive: Colors.cream,
};

const VARIANT_SHADOW: Record<Variant, string> = {
  primary:     Colors.ink,
  secondary:   Colors.ink,
  destructive: Colors.primaryDark,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}: Props): React.ReactElement {
  const isDisabled = disabled || loading;
  const bgColor     = VARIANT_BG[variant];
  const labelColor  = VARIANT_LABEL[variant];
  const shadowColor = VARIANT_SHADOW[variant];

  return (
    <View style={[styles.wrapper, style]}>
      {/* Sticker offset shadow */}
      <View style={[styles.shadow, { backgroundColor: shadowColor }]} />
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.base,
          { backgroundColor: bgColor },
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
        ]}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gloss}
          pointerEvents="none"
        />

        {loading ? (
          <ActivityIndicator color={labelColor} size="small" />
        ) : (
          <Text style={[styles.label, { color: labelColor }]}>
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  shadow: {
    position:     'absolute',
    top:          5,
    left:         5,
    right:        -5,
    bottom:       -5,
    borderRadius: BorderRadius.pill,
  },
  base: {
    borderRadius:    BorderRadius.pill,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems:      'center',
    justifyContent:  'center',
    minHeight:       52,
    borderWidth:     3,
    borderColor:     Colors.ink,
    overflow:        'hidden',
  },
  gloss: {
    position:     'absolute',
    top:          4,
    left:         '10%' as unknown as number,
    right:        '10%' as unknown as number,
    height:       '40%' as unknown as number,
    borderRadius: BorderRadius.pill,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
  },
  label: {
    fontFamily:    FontFamily.heading,
    fontSize:      FontSize.md,
    fontWeight:    FontWeight.black,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
