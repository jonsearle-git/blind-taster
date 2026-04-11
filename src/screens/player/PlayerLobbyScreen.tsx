import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { PlayerStackParamList } from '../../types/navigation';
import { useGameContext } from '../../context/GameContext';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { PlayerRow } from '../../components/PlayerRow';
import { KickedOverlay } from '../../components/KickedOverlay';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { Divider } from '../../components/Divider';

type Nav = NativeStackNavigationProp<PlayerStackParamList>;

export default function PlayerLobbyScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { state }  = useGameContext();

  const players  = state.gameState?.players ?? [];
  const roomCode = state.gameState?.roomCode ?? '';

  useEffect(() => {
    if (state.gameState?.phase === GamePhase.InRound) {
      navigation.navigate('PlayerRound');
    }
  }, [state.gameState?.phase, navigation]);

  return (
    <ScreenContainer noPadding>
      <Banner title="Waiting Room" />

      <View style={styles.inner}>
        <View style={styles.waitingSection}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.waitingText}>Waiting for the host to start…</Text>
          {roomCode.length > 0 && (
            <Text style={styles.roomCode}>{roomCode}</Text>
          )}
        </View>

        <Divider />

        <Text style={styles.sectionLabel}>Players ({players.length})</Text>

        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <Divider spacing={0} />}
          renderItem={({ item }) => <PlayerRow player={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No other players yet.</Text>
          }
        />
      </View>

      <KickedOverlay visible={state.isKicked} />
      <GamePausedOverlay visible={state.isPaused} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  inner:          { flex: 1, padding: Spacing.md, gap: Spacing.md },
  waitingSection: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.md },
  waitingText:    { color: Colors.textSecondary, fontSize: FontSize.md },
  roomCode:       { color: Colors.gold, fontSize: FontSize.xxl, fontWeight: FontWeight.black, letterSpacing: 4 },
  sectionLabel:   { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  emptyText:      { color: Colors.textDisabled, fontSize: FontSize.sm, paddingVertical: Spacing.md, textAlign: 'center' },
});
