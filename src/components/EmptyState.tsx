import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  title:    string;
  message?: string;
};

export function EmptyState({ title, message }: Props): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message !== undefined && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        Spacing.xl,
  },
  title: {
    fontFamily:   FontFamily.heading,
    color:        Colors.textPrimary,
    fontSize:     FontSize.lg,
    fontWeight:   FontWeight.black,
    textAlign:    'center',
    marginBottom: Spacing.sm,
  },
  message: {
    fontFamily: FontFamily.body,
    color:      Colors.textSecondary,
    fontSize:   FontSize.md,
    textAlign:  'center',
    lineHeight: FontSize.md * 1.5,
  },
});
