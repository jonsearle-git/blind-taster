import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { Button } from './Button';

type Props = {
  visible:        boolean;
  title:          string;
  message:        string;
  confirmLabel?:  string;
  cancelLabel?:   string;
  destructive?:   boolean;
  onConfirm:      () => void;
  onCancel?:      () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: Props): React.ReactElement {
  const dismiss = onCancel ?? onConfirm;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <Pressable style={styles.backdrop} onPress={dismiss}>
        <Pressable style={styles.wrapper} onPress={() => {}}>
          <View style={styles.shadow} />
          <View style={styles.dialog}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={[styles.actions, !cancelLabel && styles.actionsCenter]}>
              {cancelLabel !== undefined && onCancel !== undefined && (
                <Button
                  label={cancelLabel}
                  onPress={onCancel}
                  variant="secondary"
                  style={styles.button}
                />
              )}
              <Button
                label={confirmLabel}
                onPress={onConfirm}
                variant={destructive ? 'destructive' : 'primary'}
                style={cancelLabel ? styles.button : styles.buttonFull}
              />
            </View>
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
  wrapper: {
    width:    '100%',
    position: 'relative',
  },
  shadow: {
    position:        'absolute',
    top:             6,
    left:            6,
    right:           -6,
    bottom:          -6,
    borderRadius:    BorderRadius.xl,
    backgroundColor: Colors.ink,
  },
  dialog: {
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.xl,
    borderWidth:     2.5,
    borderColor:     Colors.border,
    padding:         Spacing.lg,
    gap:             Spacing.md,
  },
  title: {
    fontFamily: FontFamily.heading,
    color:      Colors.textPrimary,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  message: {
    fontFamily: FontFamily.body,
    color:      Colors.textSecondary,
    fontSize:   FontSize.md,
    lineHeight: FontSize.md * 1.5,
  },
  actions: {
    flexDirection: 'row',
    gap:           Spacing.sm,
    marginTop:     Spacing.xs,
  },
  actionsCenter: {
    justifyContent: 'center',
  },
  button:     { flex: 1 },
  buttonFull: { flex: 1 },
});
