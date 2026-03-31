import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import { SPACING, RADIUS } from '../constants/spacing';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
});
