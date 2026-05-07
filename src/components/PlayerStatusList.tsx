import { StyleSheet, View } from 'react-native';
import { Player } from '../types/player';
import { PlayerRow } from './PlayerRow';
import { Divider } from './Divider';
import { Spacing } from '../constants/spacing';

type Props = {
  players: Player[];
  answeredIds?: Set<string>;
  onKick?: (playerId: string) => void;
  showScore?: boolean;
};

export function PlayerStatusList({ players, answeredIds, onKick, showScore }: Props): React.ReactElement {
  return (
    <View style={styles.list}>
      {players.map((item, index) => (
        <View key={item.id}>
          {index > 0 && <Divider spacing={0} />}
          <PlayerRow
            player={item}
            answered={answeredIds !== undefined ? answeredIds.has(item.id) : undefined}
            onKick={onKick}
            showScore={showScore}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: Spacing.sm,
  },
});
