import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';

type Props = {
  spacing?: number;
};

export function Divider({ spacing = Spacing.md }: Props): React.ReactElement {
  return <View style={[styles.divider, { marginVertical: spacing }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height:          1,
    backgroundColor: Colors.border,
  },
});
