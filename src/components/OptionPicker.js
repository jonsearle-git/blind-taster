import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../constants/typography';

export default function OptionPicker({ label, options, value, onChange }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map(opt => {
          const selected = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onChange(opt.value)}
              activeOpacity={0.75}
            >
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  option: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.backgroundCard,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryDark,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  optionTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});
