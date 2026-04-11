import { StyleSheet, FlatList, View } from 'react-native';
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
    <FlatList
      data={players}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <Divider spacing={0} />}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PlayerRow
          player={item}
          answered={answeredIds !== undefined ? answeredIds.has(item.id) : undefined}
          onKick={onKick}
          showScore={showScore}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingVertical: Spacing.sm,
  },
});
