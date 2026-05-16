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
  const dismiss      = onCancel ?? onConfirm;
  const iconLabel    = destructive ? '!' : '?';
  const iconBg       = destructive ? Colors.melon : Colors.sun;
  const iconText     = destructive ? Colors.cream : Colors.ink;
  const confirmColor = destructive ? Colors.melon : Colors.melon;
  const confirmText  = destructive ? Colors.cream : Colors.cream;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <Pressable style={styles.backdrop} onPress={dismiss}>
        <Pressable style={styles.wrapper} onPress={() => {}}>
          <View style={styles.dialogShadow} />
          <View style={styles.dialog}>
            {/* Icon tile */}
            <View style={[styles.iconTile, { backgroundColor: iconBg }]}>
              <Text style={[styles.iconText, { color: iconText }]}>{iconLabel}</Text>
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.actions}>
              <Button
                label={confirmLabel}
                onPress={onConfirm}
                variant={destructive ? 'destructive' : 'primary'}
                style={styles.buttonFull}
              />
              {cancelLabel !== undefined && onCancel !== undefined && (
                <Button
                  label={cancelLabel}
                  onPress={onCancel}
                  variant="secondary"
                  style={styles.buttonFull}
                />
              )}
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
    maxWidth: 320,
    transform: [{ rotate: '-1deg' }],
  },
  dialogShadow: {
    position:        'absolute',
    top:             8,
    left:            8,
    right:           -8,
    bottom:          -8,
    borderRadius:    BorderRadius.lg,
    backgroundColor: Colors.ink,
  },
  dialog: {
    backgroundColor: Colors.cream,
    borderRadius:    BorderRadius.lg,
    borderWidth:     3,
    borderColor:     Colors.ink,
    padding:         Spacing.lg,
    gap:             Spacing.sm,
  },
  iconTile: {
    width:        54,
    height:       54,
    borderRadius: BorderRadius.sm,
    borderWidth:  2.5,
    borderColor:  Colors.ink,
    shadowColor:  Colors.ink,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius:  0,
    elevation:     3,
    alignItems:    'center',
    justifyContent:'center',
    alignSelf:     'flex-start',
    marginBottom:  Spacing.xs,
    transform:     [{ rotate: '-3deg' }],
  },
  iconText: {
    fontFamily:  FontFamily.display,
    fontSize:    FontSize.xxl,
    fontWeight:  FontWeight.black,
  },
  title: {
    fontFamily:    FontFamily.heading,
    color:         Colors.ink,
    fontSize:      FontSize.xl,
    fontWeight:    FontWeight.black,
    letterSpacing: -0.2,
    lineHeight:    FontSize.xl * 1.15,
  },
  message: {
    fontFamily:  FontFamily.body,
    color:       Colors.ink,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.medium,
    lineHeight:  FontSize.sm * 1.5,
    opacity:     0.75,
  },
  actions: {
    gap:       Spacing.sm,
    marginTop: Spacing.xs,
  },
  buttonFull: { width: '100%' },
});
