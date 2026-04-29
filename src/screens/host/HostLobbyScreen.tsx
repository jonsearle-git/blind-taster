import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { JoinRequest } from '../../types/player';
import { useGameContext } from '../../context/GameContext';
import { useQuestionnairesContext } from '../../context/QuestionnairesContext';
import { usePartySocket } from '../../hooks/usePartySocket';
import { useGameState } from '../../hooks/useGameState';
import { useHostControls } from '../../hooks/useHostControls';
import { Button } from '../../components/Button';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { PlayerRow } from '../../components/PlayerRow';
import { EmptyState } from '../../components/EmptyState';
import { Sparkle } from '../../components/brand/Sparkle';
import { StickerCard } from '../../components/brand/StickerCard';

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
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[Colors.sun, Colors.melon]} style={styles.gradient}>
        {/* Decorative sparkles */}
        <View style={styles.sparkle1} pointerEvents="none">
          <Sparkle size={28} color={Colors.cream} />
        </View>
        <View style={styles.sparkle2} pointerEvents="none">
          <Sparkle size={18} color={Colors.ink} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
          {/* Room code sticker */}
          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>Room code</Text>
            <StickerCard shadowOffset={5} borderRadius={16} style={styles.codeStickerWrapper}>
              <Text style={styles.codeText}>{roomCode}</Text>
            </StickerCard>
          </View>

          {/* QR code */}
          <QRCodeDisplay roomCode={roomCode} />

          {/* Pending join requests */}
          {pendingRequests.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Waiting to Join</Text>
              <View style={styles.cardList}>
                {pendingRequests.map((item) => (
                  <JoinRequestRow
                    key={item.playerId}
                    request={item}
                    onAdmit={admitPlayer}
                    onDeny={denyPlayer}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Player list */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>
              The crew ({admittedPlayers.length})
            </Text>
            {admittedPlayers.length === 0 ? (
              <EmptyState title="No players yet" message="Share the room code to invite players." />
            ) : (
              <View style={styles.cardList}>
                {admittedPlayers.map((item, index) => (
                  <PlayerRow key={item.id} player={item} index={index} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label="Start Game"
            onPress={handleStartGame}
            disabled={!canStart}
            style={styles.footerButton}
            accessibilityLabel={canStart ? 'Start the game' : 'Need at least one player to start'}
          />
          <Button
            label="Cancel"
            onPress={() => navigation.reset({ index: 1, routes: [{ name: 'SetupGame' }, { name: 'Games' }] })}
            variant="secondary"
            style={styles.footerButton}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
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
      <View style={styles.joinAvatar}>
        <Text style={styles.joinAvatarText}>{request.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.joinName} numberOfLines={1}>{request.name}</Text>
      <View style={styles.joinActions}>
        <Button label="Admit" onPress={() => onAdmit(request.playerId)} style={styles.joinActionButton} />
        <Button label="Deny"  onPress={() => onDeny(request.playerId)} variant="destructive" style={styles.joinActionButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.sun,
  },
  gradient: {
    flex: 1,
  },
  sparkle1: {
    position: 'absolute',
    top:      80,
    right:    28,
    zIndex:   1,
  },
  sparkle2: {
    position: 'absolute',
    top:      150,
    left:     24,
    zIndex:   1,
  },
  scroll:  { flex: 1 },
  inner:   { padding: Spacing.md, gap: Spacing.lg, paddingBottom: Spacing.md },
  codeSection: {
    alignItems: 'center',
    gap:        Spacing.sm,
    paddingTop: Spacing.lg,
  },
  codeLabel: {
    fontFamily:   FontFamily.body,
    fontSize:     FontSize.xs,
    fontWeight:   FontWeight.black,
    color:        Colors.ink,
    letterSpacing: 3,
    textTransform: 'uppercase',
    opacity:       0.7,
  },
  codeStickerWrapper: {
    alignSelf: 'center',
  },
  codeText: {
    fontFamily:    FontFamily.display,
    fontSize:      42,
    fontWeight:    FontWeight.black,
    color:         Colors.ink,
    letterSpacing: 4,
    paddingHorizontal: Spacing.lg,
    paddingVertical:   Spacing.sm,
  },
  section:      { gap: Spacing.sm },
  sectionLabel: {
    fontFamily:   FontFamily.heading,
    color:        Colors.ink,
    fontSize:     FontSize.lg,
    fontWeight:   FontWeight.black,
    letterSpacing: -0.2,
  },
  cardList: { gap: Spacing.sm },
  joinRow: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius:    BorderRadius.lg,
    borderWidth:     2.5,
    borderColor:     Colors.border,
    padding:         Spacing.sm,
  },
  joinAvatar: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: Colors.sun,
    borderWidth:     2,
    borderColor:     Colors.ink,
    alignItems:      'center',
    justifyContent:  'center',
  },
  joinAvatarText: {
    fontFamily:  FontFamily.display,
    color:       Colors.ink,
    fontSize:    16,
    fontWeight:  FontWeight.black,
  },
  joinName: {
    flex:        1,
    fontFamily:  FontFamily.body,
    color:       Colors.textPrimary,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.bold,
  },
  joinActions:      { flexDirection: 'row', gap: Spacing.sm },
  joinActionButton: { paddingVertical: Spacing.xs, minHeight: 40 },
  footer: {
    padding: Spacing.md,
    gap:     Spacing.sm,
  },
  footerButton: {
    width: '100%',
  },
});
