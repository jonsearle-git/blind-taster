import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props): React.ReactElement {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={() => {}}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Button
              label={cancelLabel}
              onPress={onCancel}
              variant="secondary"
              style={styles.button}
            />
            <Button
              label={confirmLabel}
              onPress={onConfirm}
              variant={destructive ? 'destructive' : 'primary'}
              style={styles.button}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: Colors.overlay,
    alignItems:      'center',
    justifyContent:  'center',
    padding:         Spacing.xl,
  },
  dialog: {
    width:           '100%',
    backgroundColor: Colors.surface,
    borderRadius:    Spacing.md,
    padding:         Spacing.lg,
    gap:             Spacing.md,
    borderWidth:     1,
    borderColor:     Colors.border,
  },
  title: {
    color:      Colors.textPrimary,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  message: {
    color:    Colors.textSecondary,
    fontSize: FontSize.md,
  },
  actions: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    marginTop:     Spacing.sm,
  },
  button: {
    flex: 1,
  },
});
