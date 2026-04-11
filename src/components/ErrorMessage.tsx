import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
    borderRadius:    Spacing.xs,
    padding:         Spacing.md,
    marginVertical:  Spacing.sm,
  },
  text: {
    color:    Colors.error,
    fontSize: FontSize.sm,
  },
});
