import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Button } from './Button';

type Props = {
  visible:           boolean;
  roomCode:          string;
  onClose:           () => void;
  onEndGame:         () => void;
  onResyncPlayers?:  () => void;
  endGameLabel?:     string;
  endGameConfirm?:   { title: string; message: string; confirmLabel: string };
};

type View_ = 'menu' | 'roomCode' | 'confirmEnd';

export function HostDropdown({
  visible,
  roomCode,
  onClose,
  onEndGame,
  onResyncPlayers,
  endGameLabel = 'End Game Early',
  endGameConfirm,
}: Props): React.ReactElement {
  const [view, setView] = useState<View_>('menu');

  // Reset to menu view whenever the modal is reopened.
  useEffect(() => {
    if (visible) setView('menu');
  }, [visible]);

  function handleClose(): void {
    setView('menu');
    onClose();
  }

  function handleEndGameTap(): void {
    if (endGameConfirm) setView('confirmEnd');
    else { handleClose(); onEndGame(); }
  }

  function handleConfirmEnd(): void {
    setView('menu');
    onClose();
    onEndGame();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        {view === 'menu' && (
          <Pressable style={styles.dropdown} onPress={() => {}}>
            {onResyncPlayers !== undefined && (
              <>
                <Pressable
                  onPress={() => { onResyncPlayers(); handleClose(); }}
                  style={styles.item}
                  accessibilityRole="button"
                >
                  <Text style={styles.itemLabel}>Resync Players</Text>
                </Pressable>
                <View style={styles.divider} />
              </>
            )}

            <Pressable
              onPress={() => setView('roomCode')}
              style={styles.item}
              accessibilityRole="button"
            >
              <Text style={styles.itemLabel}>Show Room Code</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              onPress={handleEndGameTap}
              style={styles.item}
              accessibilityRole="button"
            >
              <Text style={[styles.itemLabel, styles.destructiveLabel]}>{endGameLabel}</Text>
            </Pressable>
          </Pressable>
        )}

        {view === 'roomCode' && (
          <Pressable style={styles.roomCodeSheet} onPress={() => {}}>
            <Text style={styles.roomCodeLabel}>ROOM CODE</Text>
            <Text style={styles.roomCodeText}>{roomCode}</Text>
            <QRCodeDisplay roomCode={roomCode} />
            <Pressable
              onPress={handleClose}
              style={styles.closeBtn}
              accessibilityRole="button"
            >
              <Text style={styles.closeBtnLabel}>Close</Text>
            </Pressable>
          </Pressable>
        )}

        {view === 'confirmEnd' && endGameConfirm !== undefined && (
          <Pressable style={styles.confirmSheet} onPress={() => {}}>
            <Text style={styles.confirmTitle}>{endGameConfirm.title}</Text>
            <Text style={styles.confirmMessage}>{endGameConfirm.message}</Text>
            <View style={styles.confirmActions}>
              <Button
                label={endGameConfirm.confirmLabel}
                onPress={handleConfirmEnd}
                variant="destructive"
                style={styles.confirmBtn}
              />
              <Button
                label="Cancel"
                onPress={() => setView('menu')}
                variant="secondary"
                style={styles.confirmBtn}
              />
            </View>
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: Colors.overlay,
  },
  dropdown: {
    position:        'absolute',
    top:             52,
    right:           Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.md,
    borderWidth:     2,
    borderColor:     Colors.border,
    minWidth:        180,
    shadowColor:     Colors.ink,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.25,
    shadowRadius:    8,
    elevation:       12,
    overflow:        'hidden',
  },
  item: {
    paddingVertical:   Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  itemLabel: {
    fontFamily:  FontFamily.body,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.bold,
    color:       Colors.textPrimary,
  },
  destructiveLabel: {
    color: Colors.error,
  },
  divider: {
    height:          1.5,
    backgroundColor: Colors.border,
  },

  roomCodeSheet: {
    position:        'absolute',
    top:             '20%',
    left:            Spacing.lg,
    right:           Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.xl,
    borderWidth:     2.5,
    borderColor:     Colors.border,
    padding:         Spacing.lg,
    alignItems:      'center',
    gap:             Spacing.md,
  },
  roomCodeLabel: {
    fontFamily:    FontFamily.bodyBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    color:         Colors.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  roomCodeText: {
    fontFamily:    FontFamily.display,
    fontSize:      FontSize.xxl,
    fontWeight:    FontWeight.black,
    color:         Colors.textPrimary,
    letterSpacing: 4,
  },
  closeBtn: {
    backgroundColor:   Colors.surfaceElevated,
    borderRadius:      BorderRadius.pill,
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderWidth:       2,
    borderColor:       Colors.border,
    marginTop:         Spacing.xs,
  },
  closeBtnLabel: {
    fontFamily:  FontFamily.heading,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.black,
    color:       Colors.textPrimary,
  },

  confirmSheet: {
    position:        'absolute',
    top:             '25%',
    left:            Spacing.lg,
    right:           Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.xl,
    borderWidth:     2.5,
    borderColor:     Colors.border,
    padding:         Spacing.lg,
    gap:             Spacing.md,
  },
  confirmTitle: {
    fontFamily: FontFamily.heading,
    color:      Colors.textPrimary,
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  confirmMessage: {
    fontFamily: FontFamily.body,
    color:      Colors.textSecondary,
    fontSize:   FontSize.md,
    lineHeight: FontSize.md * 1.5,
  },
  confirmActions: {
    gap:       Spacing.sm,
    marginTop: Spacing.xs,
  },
  confirmBtn: { width: '100%' },
});
