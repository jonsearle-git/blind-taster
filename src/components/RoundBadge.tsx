import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  current: number;
  total: number;
};

export function RoundBadge({ current, total }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Round {current} of {total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:  Colors.surfaceElevated,
    borderRadius:     Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.xs,
    alignSelf:        'center',
  },
  text: {
    color:      Colors.gold,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
