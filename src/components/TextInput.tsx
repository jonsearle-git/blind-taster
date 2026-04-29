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
import { Spacing, BorderRadius } from '../constants/spacing';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
};

export function TextInput({ label, error, containerStyle, style, ...rest }: Props): React.ReactElement {
  return (
    <View style={[styles.container, containerStyle]}>
      {label !== undefined && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <View style={styles.inputShadow} />
        <RNTextInput
          style={[styles.input, error !== undefined && styles.inputError, style]}
          placeholderTextColor={Colors.textDisabled}
          accessibilityLabel={label}
          {...rest}
        />
      </View>
      {error !== undefined && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    color:       Colors.textSecondary,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputShadow: {
    position:        'absolute',
    top:             4,
    left:            4,
    right:           -4,
    bottom:          -4,
    borderRadius:    BorderRadius.md,
    backgroundColor: Colors.ink,
  },
  input: {
    backgroundColor:   Colors.surface,
    borderWidth:       2.5,
    borderColor:       Colors.border,
    borderRadius:      BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    color:             Colors.textPrimary,
    fontSize:          FontSize.md,
    fontWeight:        FontWeight.medium,
    minHeight:         52,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color:     Colors.error,
    fontSize:  FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
