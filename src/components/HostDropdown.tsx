import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ConfirmDialog } from './ConfirmDialog';

type Props = {
  visible:    boolean;
  roomCode:   string;
  onClose:    () => void;
  onEndGame:  () => void;
};

export function HostDropdown({ visible, roomCode, onClose, onEndGame }: Props): React.ReactElement {
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  function handleEndGameConfirm(): void {
    setShowEndConfirm(false);
    onClose();
    onEndGame();
  }

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={() => {}}>

            <View style={styles.handle} />

            <View style={styles.roomCodeSection}>
              <Text style={styles.sectionLabel}>ROOM CODE</Text>
              <Text style={styles.roomCode}>{roomCode}</Text>
            </View>

            <QRCodeDisplay roomCode={roomCode} />

            <View style={styles.footer}>
              <Pressable
                onPress={() => setShowEndConfirm(true)}
                style={styles.endBtn}
                accessibilityLabel="End game early"
                accessibilityRole="button"
              >
                <Text style={styles.endBtnLabel}>End Game Early</Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                style={styles.cancelBtn}
                accessibilityRole="button"
              >
                <Text style={styles.cancelBtnLabel}>Close</Text>
              </Pressable>
            </View>

          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={showEndConfirm}
        title="End Game Early"
        message="This will end the game immediately and show results with data collected so far."
        confirmLabel="End Game"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleEndGameConfirm}
        onCancel={() => setShowEndConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: Colors.overlay,
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor:      Colors.cream,
    borderTopLeftRadius:  BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth:       2.5,
    borderLeftWidth:      2.5,
    borderRightWidth:     2.5,
    borderColor:          Colors.ink,
    paddingBottom:        Spacing.xl,
    alignItems:           'center',
    gap:                  Spacing.md,
  },
  handle: {
    width:           48,
    height:          4,
    borderRadius:    2,
    backgroundColor: Colors.ink,
    opacity:         0.2,
    marginTop:       Spacing.sm,
  },
  roomCodeSection: {
    alignItems: 'center',
    gap:        Spacing.xs,
    paddingTop: Spacing.sm,
  },
  sectionLabel: {
    fontFamily:    FontFamily.bodyBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    color:         Colors.ink,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity:       0.6,
  },
  roomCode: {
    fontFamily:    FontFamily.display,
    fontSize:      FontSize.jumbo,
    fontWeight:    FontWeight.black,
    color:         Colors.ink,
    letterSpacing: 4,
  },
  footer: {
    width:         '100%',
    paddingHorizontal: Spacing.lg,
    gap:           Spacing.sm,
    marginTop:     Spacing.sm,
  },
  endBtn: {
    backgroundColor: Colors.error,
    borderRadius:    BorderRadius.pill,
    paddingVertical: Spacing.md,
    alignItems:      'center',
    borderWidth:     2.5,
    borderColor:     Colors.ink,
  },
  endBtnLabel: {
    fontFamily:  FontFamily.heading,
    color:       Colors.cream,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.black,
  },
  cancelBtn: {
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.pill,
    paddingVertical: Spacing.md,
    alignItems:      'center',
    borderWidth:     2.5,
    borderColor:     Colors.ink,
  },
  cancelBtnLabel: {
    fontFamily:  FontFamily.heading,
    color:       Colors.ink,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.black,
  },
});
