import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { PlayerStatus } from '../constants/gameConstants';
import { Player } from '../types/player';
import { IconButton } from './IconButton';

type Props = {
  player: Player;
  showScore?: boolean;
  answered?: boolean;
  onKick?: (playerId: string) => void;
};

export function PlayerRow({ player, showScore, answered, onKick }: Props): React.ReactElement {
  const statusColor =
    player.status === PlayerStatus.Connected    ? Colors.success :
    player.status === PlayerStatus.Disconnected ? Colors.textDisabled :
    Colors.error;

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />

      <Text style={styles.name} numberOfLines={1}>{player.name}</Text>

      {answered !== undefined && (
        <Text style={[styles.status, { color: answered ? Colors.success : Colors.textDisabled }]}>
          {answered ? '✓' : '…'}
        </Text>
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
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: Spacing.sm,
    gap:             Spacing.sm,
  },
  dot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  name: {
    flex:       1,
    color:      Colors.textPrimary,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.medium,
  },
  status: {
    fontSize:   FontSize.lg,
    fontWeight: FontWeight.bold,
    width:      24,
    textAlign:  'center',
  },
  score: {
    color:      Colors.gold,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.bold,
    minWidth:   56,
    textAlign:  'right',
  },
});
