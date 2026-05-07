import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useState } from 'react';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { QRCodeDisplay } from './QRCodeDisplay';

type Props = {
  visible:          boolean;
  roomCode:         string;
  onClose:          () => void;
  onEndGame:        () => void;
  onResyncPlayers?: () => void;
};

export function HostDropdown({ visible, roomCode, onClose, onEndGame, onResyncPlayers }: Props): React.ReactElement {
  const [showRoomCode, setShowRoomCode] = useState(false);

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={styles.dropdown}>

            {onResyncPlayers !== undefined && (
              <>
                <Pressable
                  onPress={() => { onResyncPlayers(); onClose(); }}
                  style={styles.item}
                  accessibilityRole="button"
                >
                  <Text style={styles.itemLabel}>Resync Players</Text>
                </Pressable>
                <View style={styles.divider} />
              </>
            )}

            <Pressable
              onPress={() => { onClose(); setShowRoomCode(true); }}
              style={styles.item}
              accessibilityRole="button"
            >
              <Text style={styles.itemLabel}>Show Room Code</Text>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              onPress={onEndGame}
              style={styles.item}
              accessibilityRole="button"
            >
              <Text style={[styles.itemLabel, styles.destructiveLabel]}>End Game Early</Text>
            </Pressable>

          </View>
        </Pressable>
      </Modal>

      <Modal visible={showRoomCode} transparent animationType="fade" onRequestClose={() => setShowRoomCode(false)}>
        <Pressable style={styles.roomCodeBackdrop} onPress={() => setShowRoomCode(false)}>
          <Pressable style={styles.roomCodeSheet} onPress={() => {}}>
            <Text style={styles.roomCodeLabel}>ROOM CODE</Text>
            <Text style={styles.roomCodeText}>{roomCode}</Text>
            <QRCodeDisplay roomCode={roomCode} />
            <Pressable
              onPress={() => setShowRoomCode(false)}
              style={styles.closeBtn}
              accessibilityRole="button"
            >
              <Text style={styles.closeBtnLabel}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
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

  roomCodeBackdrop: {
    flex:            1,
    backgroundColor: Colors.overlay,
    alignItems:      'center',
    justifyContent:  'center',
    padding:         Spacing.lg,
  },
  roomCodeSheet: {
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.xl,
    borderWidth:     2.5,
    borderColor:     Colors.border,
    padding:         Spacing.lg,
    alignItems:      'center',
    gap:             Spacing.md,
    width:           '100%',
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
});
