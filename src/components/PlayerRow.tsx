import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { PlayerStatus } from '../constants/gameConstants';
import { Player } from '../types/player';
import { IconButton } from './IconButton';

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
  player: Player;
  showScore?: boolean;
  answered?: boolean;
  onKick?: (playerId: string) => void;
  index?: number;
};

export function PlayerRow({ player, showScore, answered, onKick, index = 0 }: Props): React.ReactElement {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const isLight = avatarColor === Colors.sun || avatarColor === Colors.mint;
  const avatarTextColor = isLight ? Colors.ink : Colors.cream;

  const isConnected = player.status === PlayerStatus.Connected;
  const statusLabel = isConnected ? 'Ready' : 'Away';

  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        <Text style={[styles.avatarText, { color: avatarTextColor }]}>
          {player.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name} numberOfLines={1}>{player.name}</Text>

      {answered !== undefined && (
        <View style={[styles.statusChip, answered ? styles.statusReady : styles.statusWaiting]}>
          <Text style={[styles.statusLabel, answered ? styles.statusReadyLabel : styles.statusWaitingLabel]}>
            {answered ? 'Done' : '…'}
          </Text>
        </View>
      )}

      {answered === undefined && (
        <View style={[styles.statusChip, isConnected ? styles.statusReady : styles.statusWaiting]}>
          <Text style={[styles.statusLabel, isConnected ? styles.statusReadyLabel : styles.statusWaitingLabel]}>
            {statusLabel}
          </Text>
        </View>
      )}

      {showScore === true && (
        <Text style={styles.score}>{player.score} pts</Text>
      )}

      {onKick !== undefined && (
        <IconButton
          icon="✕"
          onPress={() => onKick(player.id)}
          color={Colors.error}
          size={FontSize.sm}
          accessibilityLabel={`Kick ${player.name}`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    gap:             Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.lg,
    borderWidth:     2,
    borderColor:     Colors.border,
  },
  avatar: {
    width:           40,
    height:          40,
    borderRadius:    20,
    borderWidth:     2,
    borderColor:     Colors.ink,
    alignItems:      'center',
    justifyContent:  'center',
  },
  avatarText: {
    fontSize:   16,
    fontWeight: FontWeight.black,
  },
  name: {
    flex:       1,
    color:      Colors.textPrimary,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.bold,
  },
  statusChip: {
    borderRadius:    BorderRadius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical:  3,
    borderWidth:      2,
    borderColor:      Colors.ink,
  },
  statusReady: {
    backgroundColor: Colors.mint,
  },
  statusWaiting: {
    backgroundColor: Colors.transparent,
    opacity:          0.55,
  },
  statusLabel: {
    fontSize:    FontSize.xs,
    fontWeight:  FontWeight.black,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusReadyLabel: {
    color: Colors.ink,
  },
  statusWaitingLabel: {
    color: Colors.ink,
  },
  score: {
    color:      Colors.ink,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.black,
    minWidth:   56,
    textAlign:  'right',
  },
});
