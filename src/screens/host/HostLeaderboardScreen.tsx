import { StyleSheet, View, FlatList } from 'react-native';
import { useState } from 'react';
import { Spacing } from '../../constants/spacing';
import { useGameContext } from '../../context/GameContext';
import { useHostControls } from '../../hooks/useHostControls';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { LeaderboardRow } from '../../components/LeaderboardRow';
import { EmptyState } from '../../components/EmptyState';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { HostDropdown } from '../../components/HostDropdown';
import { Divider } from '../../components/Divider';

export default function HostLeaderboardScreen(): React.ReactElement {
  const { state }              = useGameContext();
  const [showMenu, setShowMenu] = useState(false);
  const { kickPlayer, endGame } = useHostControls();

  const players  = state.gameState?.players ?? [];
  const roomCode = state.gameState?.roomCode ?? '';

  const sorted = [...players]
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ player: p, position: i + 1 }));

  return (
    <ScreenContainer noPadding>
      <Banner title="Scores" onHostMenuPress={() => setShowMenu(true)} />

      <View style={styles.inner}>
        {sorted.length === 0 ? (
          <EmptyState title="No scores yet" message="Scores appear after the first round is revealed." />
        ) : (
          <FlatList
            data={sorted}
            keyExtractor={(item) => item.player.id}
            ItemSeparatorComponent={() => <Divider spacing={Spacing.xs} />}
            renderItem={({ item, index }) => (
              <LeaderboardRow
                result={{ player: item.player, rounds: [], totalScore: item.player.score, position: item.position }}
                highlight={index === 0}
              />
            )}
          />
        )}
      </View>

      <GamePausedOverlay visible={state.isPaused} />

      <HostDropdown
        visible={showMenu}
        roomCode={roomCode}
        players={players}
        onClose={() => setShowMenu(false)}
        onKick={kickPlayer}
        onEndGame={endGame}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner: { flex: 1, padding: Spacing.md },
});
