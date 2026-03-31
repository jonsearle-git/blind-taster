import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FONT_SIZES } from '../constants/typography';

export default function TextInput({ label, error, style, ...props }) {
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <RNTextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={COLORS.textMuted}
        selectionColor={COLORS.accent}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.backgroundCard,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZES.md,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
});
