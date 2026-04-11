import { StyleSheet, View, Text, Modal } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  visible: boolean;
};

export function KickedOverlay({ visible }: Props): React.ReactElement {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Removed from Game</Text>
          <Text style={styles.message}>
            You have been removed from this game by the host.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.overlay,
    alignItems:      'center',
    justifyContent:  'center',
    padding:         Spacing.xl,
  },
  card: {
    width:           '100%',
    backgroundColor: Colors.surface,
    borderRadius:    Spacing.md,
    padding:         Spacing.xl,
    alignItems:      'center',
    gap:             Spacing.md,
    borderWidth:     1,
    borderColor:     Colors.border,
  },
  title: {
    color:      Colors.textPrimary,
    fontSize:   FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign:  'center',
  },
  message: {
    color:     Colors.textSecondary,
    fontSize:  FontSize.md,
    textAlign: 'center',
  },
});
