import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Spacing } from '../../constants/spacing';
import { useGameContext } from '../../context/GameContext';
import { useHostControls } from '../../hooks/useHostControls';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { PlayerStatusList } from '../../components/PlayerStatusList';
import { EmptyState } from '../../components/EmptyState';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { HostDropdown } from '../../components/HostDropdown';

export default function HostPlayersScreen(): React.ReactElement {
  const { state }              = useGameContext();
  const [showMenu, setShowMenu] = useState(false);
  const { kickPlayer, endGame } = useHostControls();

  const players  = state.gameState?.players ?? [];
  const roomCode = state.gameState?.roomCode ?? '';

  return (
    <ScreenContainer noPadding>
      <Banner title="Players" onHostMenuPress={() => setShowMenu(true)} />

      <View style={styles.inner}>
        {players.length === 0 ? (
          <EmptyState title="No players" />
        ) : (
          <PlayerStatusList players={players} onKick={kickPlayer} />
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
