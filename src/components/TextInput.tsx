import {
  StyleSheet,
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export function TextInput({ label, error, containerStyle, style, ...rest }: Props): React.ReactElement {
  return (
    <View style={[styles.container, containerStyle]}>
      {label !== undefined && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error !== undefined && styles.inputError, style]}
        placeholderTextColor={Colors.textDisabled}
        accessibilityLabel={label}
        {...rest}
      />
      {error !== undefined && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    color:      Colors.textSecondary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  input: {
    backgroundColor:  Colors.surface,
    borderWidth:      1,
    borderColor:      Colors.border,
    borderRadius:     Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    color:            Colors.textPrimary,
    fontSize:         FontSize.md,
    minHeight:        48,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color:    Colors.error,
    fontSize: FontSize.sm,
  },
});
