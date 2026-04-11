import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
};

export function ScreenContainer({ children, style, noPadding = false }: Props): React.ReactElement {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, noPadding ? undefined : styles.padding, style]}>
        {children}
      </View>
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
});
