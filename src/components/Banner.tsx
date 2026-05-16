import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';

type Props = {
  title:            string;
  subtitle?:        string;
  score?:           number;
  onHostMenuPress?: () => void;
  onBackPress?:     () => void;
};

export function Banner({ title, subtitle, score, onHostMenuPress, onBackPress }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      {onBackPress !== undefined && (
        <Pressable
          onPress={onBackPress}
          style={styles.backButton}
          accessibilityLabel="Back"
          accessibilityRole="button"
          hitSlop={Spacing.sm}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      )}

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
    backgroundColor:   Colors.cream,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.sm,
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.ink,
  },
  titleBlock: {
    flex: 1,
  },
  subtitle: {
    color:         Colors.melon,
    fontFamily:    FontFamily.body,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color:         Colors.ink,
    fontFamily:    FontFamily.display,
    fontSize:      FontSize.xl,
    fontWeight:    FontWeight.black,
    letterSpacing: -0.3,
  },
  right: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  scoreBadge: {
    backgroundColor:   Colors.sun,
    borderRadius:      BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical:   Spacing.xs,
    borderWidth:       2.5,
    borderColor:       Colors.ink,
    shadowColor:       Colors.ink,
    shadowOffset:      { width: 3, height: 3 },
    shadowOpacity:     1,
    shadowRadius:      0,
    elevation:         3,
  },
  scoreText: {
    color:         Colors.ink,
    fontFamily:    FontFamily.display,
    fontSize:      FontSize.sm,
    fontWeight:    FontWeight.black,
    letterSpacing: 0.5,
  },
  menuButton: {
    width:           40,
    height:          40,
    borderRadius:    BorderRadius.sm,
    backgroundColor: Colors.cream,
    borderWidth:     2,
    borderColor:     Colors.ink,
    alignItems:      'center',
    justifyContent:  'center',
  },
  menuIcon: {
    color:      Colors.ink,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.black,
  },
  backButton: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: Colors.cream,
    borderWidth:     2.5,
    borderColor:     Colors.ink,
    shadowColor:     Colors.ink,
    shadowOffset:    { width: 3, height: 3 },
    shadowOpacity:   1,
    shadowRadius:    0,
    elevation:       3,
    alignItems:      'center',
    justifyContent:  'center',
  },
  backIcon: {
    color:      Colors.ink,
    fontSize:   FontSize.lg,
    fontWeight: '900',
    lineHeight: FontSize.lg + 2,
    marginLeft: -2,
  },
});
