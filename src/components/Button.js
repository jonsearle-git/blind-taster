import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

export default function Button({ title, onPress, variant = 'primary', disabled = false, loading = false, style }) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      {loading
        ? <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.textOnPrimary} />
        : <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.backgroundElevated,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  primaryText: {
    color: COLORS.textOnPrimary,
  },
  secondaryText: {
    color: COLORS.textPrimary,
  },
  outlineText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.textOnPrimary,
  },
});
