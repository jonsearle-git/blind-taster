import { StyleSheet, View, Pressable, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

type Props = {
  children:  React.ReactNode;
  style?:    ViewStyle;
  noPadding?: boolean;
  onPress?:  () => void;
};

export function ScreenContainer({ children, style, noPadding = false, onPress }: Props): React.ReactElement {
  const content = (
    <View style={[styles.container, noPadding ? undefined : styles.padding, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {onPress !== undefined
          ? <Pressable style={styles.fill} onPress={onPress}>{content}</Pressable>
          : content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  padding: {
    paddingHorizontal: Spacing.md,
  },
  fill: {
    flex: 1,
  },
});
