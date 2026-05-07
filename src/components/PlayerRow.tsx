import { StyleSheet, View, Text, Modal, Pressable, useWindowDimensions } from 'react-native';
import { useState, useRef } from 'react';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { PlayerStatus } from '../constants/gameConstants';
import { Player } from '../types/player';

// Cycle through palette colors for player avatars
const AVATAR_COLORS = [
  Colors.melon,
  Colors.mint,
  Colors.sun,
  Colors.ocean,
  Colors.plum,
  Colors.primary,
] as const;

type Props = {
  player:     Player;
  showScore?: boolean;
  answered?:  boolean;
  onKick?:    (playerId: string) => void;
};

function stableIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash;
}

export function PlayerRow({ player, showScore, answered, onKick }: Props): React.ReactElement {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [menuPos, setMenuPos]     = useState({ top: 0, right: 0 });
  const menuBtnRef                = useRef<View>(null);
  const { width: screenWidth }    = useWindowDimensions();

  const avatarColor     = AVATAR_COLORS[stableIndex(player.id) % AVATAR_COLORS.length];
  const isLight         = avatarColor === Colors.sun || avatarColor === Colors.mint;
  const avatarTextColor = isLight ? Colors.ink : Colors.cream;
  const isConnected     = player.status === PlayerStatus.Connected;

  return (
    <>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={[styles.avatarText, { color: avatarTextColor }]}>
            {player.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name} numberOfLines={1}>{player.name}</Text>

        {answered === true && (
          <View style={[styles.statusChip, styles.statusDone]}>
            <Text style={styles.statusLabel}>Done</Text>
          </View>
        )}

        {answered === undefined && !isConnected && (
          <View style={[styles.statusChip, styles.statusAway]}>
            <Text style={styles.statusLabel}>Away</Text>
          </View>
        )}

        {showScore === true && (
          <Text style={styles.score}>{player.score} pts</Text>
        )}

        {onKick !== undefined && (
          <Pressable
            ref={menuBtnRef}
            onPress={() => {
              menuBtnRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
                setMenuPos({ top: pageY + height + 4, right: screenWidth - pageX - width });
                setMenuOpen(true);
              });
            }}
            hitSlop={8}
            style={styles.menuBtn}
            accessibilityRole="button"
            accessibilityLabel={`Options for ${player.name}`}
          >
            <Text style={styles.menuIcon}>⋮</Text>
          </Pressable>
        )}
      </View>

      {onKick !== undefined && (
        <Modal visible={menuOpen} transparent animationType="none" onRequestClose={() => setMenuOpen(false)}>
          <Pressable style={styles.dropdownBackdrop} onPress={() => setMenuOpen(false)}>
            <View style={[styles.dropdown, { top: menuPos.top, right: menuPos.right }]}>
              <Pressable
                onPress={() => { setMenuOpen(false); onKick(player.id); }}
                style={styles.dropdownItem}
                accessibilityRole="button"
              >
                <Text style={styles.dropdownKick}>Remove player</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.sm,
    gap:               Spacing.sm,
    backgroundColor:   Colors.surface,
    borderRadius:      BorderRadius.lg,
    borderWidth:       2,
    borderColor:       Colors.border,
  },
  avatar: {
    width:          40,
    height:         40,
    borderRadius:   20,
    borderWidth:    2,
    borderColor:    Colors.ink,
    alignItems:     'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.black,
  },
  name: {
    flex:       1,
    color:      Colors.textPrimary,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.bold,
  },
  statusChip: {
    borderRadius:      BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical:   3,
    borderWidth:       2,
    borderColor:       Colors.ink,
  },
  statusDone: { backgroundColor: Colors.mint },
  statusAway: { backgroundColor: Colors.transparent, opacity: 0.5 },
  statusLabel: {
    fontFamily:    FontFamily.bodyBold,
    fontSize:      FontSize.xs,
    fontWeight:    FontWeight.black,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color:         Colors.ink,
  },
  score: {
    fontFamily: FontFamily.bodyBold,
    color:      Colors.ink,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.black,
    minWidth:   56,
    textAlign:  'right',
  },
  menuBtn: {
    paddingHorizontal: Spacing.xs,
    alignItems:        'center',
    justifyContent:    'center',
    minWidth:          32,
    minHeight:         32,
  },
  menuIcon: {
    fontSize:   FontSize.xl,
    color:      Colors.textSecondary,
    lineHeight: FontSize.xl,
  },

  dropdownBackdrop: {
    flex: 1,
  },
  dropdown: {
    position:        'absolute',
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.sm,
    borderWidth:     1.5,
    borderColor:     Colors.ink,
    shadowColor:     Colors.ink,
    shadowOffset:    { width: 0, height: 3 },
    shadowOpacity:   0.15,
    shadowRadius:    6,
    elevation:       8,
    minWidth:        120,
    overflow:        'hidden',
  },
  dropdownItem: {
    paddingVertical:   Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  dropdownKick: {
    fontFamily:  FontFamily.bodyBold,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.bold,
    color:       Colors.error,
  },
});
