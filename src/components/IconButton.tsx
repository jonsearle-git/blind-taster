import { StyleSheet, Pressable, Text, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  icon: string;
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
  accessibilityLabel: string;
  disabled?: boolean;
};

export function IconButton({
  icon,
  onPress,
  color = Colors.textPrimary,
  size = FontSize.xl,
  style,
  accessibilityLabel,
  disabled = false,
}: Props): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      hitSlop={Spacing.sm}
    >
      <Text style={[styles.icon, { color, fontSize: size }]}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth:   44,
    minHeight:  44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.3,
  },
  icon: {
    textAlign: 'center',
  },
});
