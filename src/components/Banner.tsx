import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  title: string;
  score?: number;
  onHostMenuPress?: () => void;
};

export function Banner({ title, score, onHostMenuPress }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      <View style={styles.right}>
        {score !== undefined && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{score} pts</Text>
          </View>
        )}
        {onHostMenuPress !== undefined && (
          <Pressable
            onPress={onHostMenuPress}
            style={styles.menuButton}
            accessibilityLabel="Host controls"
            accessibilityRole="button"
            hitSlop={Spacing.sm}
          >
            <Text style={styles.menuIcon}>⋮</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    backgroundColor:  Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    flex:       1,
    color:      Colors.textPrimary,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  right: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  scoreBadge: {
    backgroundColor: Colors.primaryDark,
    borderRadius:    Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   Spacing.xs / 2,
  },
  scoreText: {
    color:      Colors.textPrimary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  menuIcon: {
    color:    Colors.textPrimary,
    fontSize: FontSize.xl,
  },
});
