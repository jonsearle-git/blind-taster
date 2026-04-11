import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  message?: string;
};

export function LoadingSpinner({ message }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message !== undefined && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            Spacing.md,
  },
  message: {
    color:    Colors.textSecondary,
    fontSize: FontSize.md,
  },
});
