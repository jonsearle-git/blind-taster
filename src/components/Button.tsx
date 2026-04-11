import { StyleSheet, Text, Pressable, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';

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

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? Colors.primary : Colors.textPrimary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`], isDisabled && styles.disabledLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius:    Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems:      'center',
    justifyContent:  'center',
    minHeight:       52,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.transparent,
    borderWidth:     1,
    borderColor:     Colors.primary,
  },
  destructive: {
    backgroundColor: Colors.error,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize:   FontSize.md,
    fontWeight: FontWeight.bold,
  },
  primaryLabel: {
    color: Colors.textPrimary,
  },
  secondaryLabel: {
    color: Colors.primary,
  },
  destructiveLabel: {
    color: Colors.textPrimary,
  },
  disabledLabel: {
    color: Colors.textDisabled,
  },
});
