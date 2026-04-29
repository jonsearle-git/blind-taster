import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { BorderRadius, Spacing } from '../../constants/spacing';

type Props = {
  label: string;
  selected?: boolean;
  color?: string;
  textColor?: string;
  onPress?: () => void;
  onRemove?: () => void;
  style?: ViewStyle;
};

export function Chip({
  label,
  selected = false,
  color = Colors.sun,
  textColor = Colors.ink,
  onPress,
  onRemove,
  style,
}: Props): React.ReactElement {
  return (
    <View style={[styles.wrapper, style]}>
      {selected && <View style={styles.shadow} />}
      <Pressable
        onPress={onPress}
        style={[
          styles.chip,
          { backgroundColor: selected ? color : Colors.transparent },
          selected && styles.chipSelected,
        ]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text style={[styles.label, { color: selected ? textColor : Colors.ink }]}>
          {label}
        </Text>
        {onRemove && (
          <Pressable onPress={onRemove} hitSlop={8} style={styles.removeBtn}>
            <Text style={[styles.removeText, { color: selected ? textColor : Colors.ink }]}>×</Text>
          </Pressable>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf:  'flex-start',
    position:   'relative',
  },
  shadow: {
    position:        'absolute',
    top:             3,
    left:            3,
    right:           -3,
    bottom:          -3,
    borderRadius:    BorderRadius.pill,
    backgroundColor: Colors.ink,
  },
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical:   10,
    borderRadius:      BorderRadius.pill,
    borderWidth:       2.5,
    borderColor:       Colors.ink,
  },
  chipSelected: {
    transform: [{ translateX: -1 }, { translateY: -1 }],
  },
  label: {
    fontFamily:    FontFamily.bodyBold,
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.black,
    letterSpacing: 0.5,
  },
  removeBtn: {
    marginLeft: 2,
  },
  removeText: {
    fontFamily:  FontFamily.body,
    fontSize:    FontSize.lg,
    fontWeight:  FontWeight.bold,
    lineHeight:  FontSize.lg,
  },
});
