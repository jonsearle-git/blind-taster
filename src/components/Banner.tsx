import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';

type Props = {
  title:            string;
  subtitle?:        string;
  score?:           number;
  onHostMenuPress?: () => void;
};

export function Banner({ title, subtitle, score, onHostMenuPress }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        {subtitle !== undefined && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>

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
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.border,
  },
  titleBlock: {
    flex: 1,
  },
  subtitle: {
    color:       Colors.textSecondary,
    fontSize:    FontSize.xs,
    fontWeight:  FontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    color:       Colors.textPrimary,
    fontSize:    FontSize.lg,
    fontWeight:  FontWeight.black,
    letterSpacing: 0.3,
  },
  right: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  scoreBadge: {
    backgroundColor:   Colors.sun,
    borderRadius:      BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   Spacing.xs / 2,
    borderWidth:       2,
    borderColor:       Colors.ink,
  },
  scoreText: {
    color:       Colors.ink,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.black,
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  menuIcon: {
    color:    Colors.ink,
    fontSize: FontSize.xl,
  },
});
