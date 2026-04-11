import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight } from '../../constants/typography';
import { Spacing } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { JoinRequest } from '../../types/player';
import { useGameContext } from '../../context/GameContext';
import { useQuestionnairesContext } from '../../context/QuestionnairesContext';
import { usePartySocket } from '../../hooks/usePartySocket';
import { useGameState } from '../../hooks/useGameState';
import { useHostControls } from '../../hooks/useHostControls';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Button } from '../../components/Button';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { Divider } from '../../components/Divider';
import { PlayerRow } from '../../components/PlayerRow';
import { EmptyState } from '../../components/EmptyState';

type Nav   = NativeStackNavigationProp<HostStackParamList>;
type Route = RouteProp<HostStackParamList, 'HostLobby'>;

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateHostToken(): string {
  // 128 bits via CSPRNG (react-native-get-random-values polyfills crypto.getRandomValues)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

export default function HostLobbyScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { questionnaireId, rounds } = route.params;

  const { state, sendRef }         = useGameContext();
  const { questionnaires }         = useQuestionnairesContext();
  const { handleMessage }          = useGameState();
  const { admitPlayer, denyPlayer, startGame } = useHostControls();

  const [roomCode]   = useState(generateRoomCode);
  const [hostToken]  = useState(generateHostToken);

  const questionnaire = questionnaires.find((q) => q.id === questionnaireId) ?? null;

  const { send } = usePartySocket({ roomCode, isHost: true, hostToken, onMessage: handleMessage });

  useEffect(() => {
    sendRef.current = send;
    return () => { sendRef.current = null; };
  }, [send, sendRef]);

  useEffect(() => {
    if (state.gameState?.phase === GamePhase.InRound) {
      navigation.navigate('HostInGame');
    }
  }, [state.gameState?.phase, navigation]);

  const admittedPlayers = state.gameState?.players ?? [];
  const pendingRequests = state.pendingRequests;
  const canStart        = admittedPlayers.length >= 1 && questionnaire !== null;

  function handleStartGame(): void {
    if (!questionnaire) return;
    startGame(questionnaire, rounds);
  }

  return (
    <ScreenContainer noPadding>
      <View style={styles.inner}>
        <View style={styles.codeSection}>
          <QRCodeDisplay roomCode={roomCode} />
        </View>

        <Divider />

        {pendingRequests.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Waiting to Join</Text>
            <FlatList
              data={pendingRequests}
              keyExtractor={(item) => item.playerId}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <Divider spacing={0} />}
              renderItem={({ item }) => (
                <JoinRequestRow
                  request={item}
                  onAdmit={admitPlayer}
                  onDeny={denyPlayer}
                />
              )}
            />
            <Divider />
          </>
        )}

        <Text style={styles.sectionLabel}>
          Players ({admittedPlayers.length})
        </Text>

        {admittedPlayers.length === 0 ? (
          <EmptyState title="No players yet" message="Share the room code to invite players." />
        ) : (
          <FlatList
            data={admittedPlayers}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <Divider spacing={0} />}
            renderItem={({ item }) => <PlayerRow player={item} />}
          />
        )}

        <Button
          label="Start Game"
          onPress={handleStartGame}
          disabled={!canStart}
          style={styles.startButton}
          accessibilityLabel={canStart ? 'Start the game' : 'Need at least one player to start'}
        />
      </View>
    </ScreenContainer>
  );
}

type JoinRowProps = {
  request: JoinRequest;
  onAdmit: (id: string) => void;
  onDeny:  (id: string) => void;
};

function JoinRequestRow({ request, onAdmit, onDeny }: JoinRowProps): React.ReactElement {
  return (
    <View style={styles.joinRow}>
      <Text style={styles.joinName} numberOfLines={1}>{request.name}</Text>
      <View style={styles.joinActions}>
        <Button label="Admit" onPress={() => onAdmit(request.playerId)} style={styles.admitButton} />
        <Button label="Deny" onPress={() => onDeny(request.playerId)} variant="destructive" style={styles.denyButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner:        { flex: 1, padding: Spacing.md, gap: Spacing.md },
  codeSection:  { alignItems: 'center', paddingVertical: Spacing.lg },
  sectionLabel: { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  joinRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.sm },
  joinName:     { flex: 1, color: Colors.textPrimary, fontSize: FontSize.md },
  joinActions:  { flexDirection: 'row', gap: Spacing.sm },
  admitButton:  { minHeight: 40, paddingVertical: Spacing.sm },
  denyButton:   { minHeight: 40, paddingVertical: Spacing.sm },
  startButton:  { marginTop: 'auto' as unknown as number },
});
