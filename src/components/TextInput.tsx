import {
  StyleSheet,
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
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
        <View style={[styles.inputShadow, error !== undefined && styles.inputShadowError]} />
        <RNTextInput
          style={[styles.input, error !== undefined && styles.inputError, style]}
          placeholderTextColor={Colors.ink + '66'}
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
    fontFamily:    FontFamily.body,
    color:         Colors.ink,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity:       0.7,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputShadow: {
    position:        'absolute',
    top:             3,
    left:            3,
    right:           -3,
    bottom:          -3,
    borderRadius:    BorderRadius.pill,
    backgroundColor: Colors.ink,
  },
  inputShadowError: {
    backgroundColor: Colors.melon,
  },
  input: {
    backgroundColor:   Colors.cream,
    borderWidth:       2.5,
    borderColor:       Colors.ink,
    borderRadius:      BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical:   Spacing.sm,
    color:             Colors.ink,
    fontFamily:        FontFamily.body,
    fontSize:          FontSize.md,
    fontWeight:        FontWeight.medium,
    minHeight:         52,
  },
  inputError: {
    borderColor: Colors.melon,
  },
  error: {
    fontFamily:  FontFamily.body,
    color:       Colors.melon,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.bold,
  },
});
