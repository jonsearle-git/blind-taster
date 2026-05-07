import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NavigationAction } from '@react-navigation/native';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { GamePhase } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { JoinRequest } from '../../types/player';
import { useGameContext } from '../../context/GameContext';
import { useQuestionnairesContext } from '../../context/QuestionnairesContext';
import { usePartySocket } from '../../hooks/usePartySocket';
import { signRoomCode } from '../../lib/roomSigning';
import { saveHostSession, clearHostSession } from '../../lib/hostSession';
import { useGameState } from '../../hooks/useGameState';
import { useHostControls } from '../../hooks/useHostControls';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { PlayerRow } from '../../components/PlayerRow';
import { EmptyState } from '../../components/EmptyState';
import { Sparkle } from '../../components/brand/Sparkle';

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
  const { questionnaireId, rounds, savedRoomCode, savedHostToken } = route.params;

  const { state, sendRef, dispatch } = useGameContext();
  const { questionnaires }         = useQuestionnairesContext();
  const { handleMessage }          = useGameState();
  const { admitPlayer, denyPlayer, startGame } = useHostControls();

  const [roomCode]         = useState(() => savedRoomCode ?? generateRoomCode());
  const [hostToken]        = useState(() => savedHostToken ?? generateHostToken());
  const [roomSig, setRoomSig] = useState('');
  const [showAbandon, setShowAbandon] = useState(false);
  const pendingNavRef      = useRef<NavigationAction | null>(null);

  const questionnaire = questionnaires.find((q) => q.id === questionnaireId) ?? null;

  useEffect(() => {
    signRoomCode(roomCode).then((sig) => {
      setRoomSig(sig);
      void saveHostSession({ questionnaireId, rounds, roomCode, hostToken });
    });
  }, [roomCode, hostToken, questionnaireId, rounds]);

  const { send } = usePartySocket({ roomCode, isHost: true, hostToken, sig: roomSig, onMessage: handleMessage });

  useEffect(() => {
    sendRef.current = send;
    return () => { sendRef.current = null; };
  }, [send, sendRef]);

  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_GAME_ID', payload: roomCode });
    return () => { dispatch({ type: 'SET_ACTIVE_GAME_ID', payload: null }); };
  }, [dispatch, roomCode]);

  // Intercept back navigation — prompt before abandoning the room
  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      pendingNavRef.current = e.data.action;
      setShowAbandon(true);
    });
  }, [navigation]);

  useEffect(() => {
    if (state.gameState?.phase === GamePhase.InRound) {
      navigation.navigate('HostInGame');
    }
  }, [state.gameState?.phase, navigation]);

  function handleAbandonConfirm(): void {
    setShowAbandon(false);
    sendRef.current?.({ type: 'end_game' }); // server kicks admitted players before we reset
    void clearHostSession();
    dispatch({ type: 'RESET' });
    if (pendingNavRef.current) navigation.dispatch(pendingNavRef.current);
  }

  const admittedPlayers = state.gameState?.players ?? [];
  const pendingRequests = state.pendingRequests;
  const canStart        = admittedPlayers.length >= 1 && questionnaire !== null;

  function handleStartGame(): void {
    if (!questionnaire) return;
    startGame(questionnaire, rounds);
  }

  return (
    <LinearGradient colors={[Colors.sun, Colors.melon]} style={styles.gradient}>
      {/* Decorative sparkles */}
      <View style={styles.sparkle1} pointerEvents="none">
        <Sparkle size={28} color={Colors.cream} />
      </View>
      <View style={styles.sparkle2} pointerEvents="none">
        <Sparkle size={18} color={Colors.ink} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
        {/* Game name + QR code */}
        <View style={styles.codeSection}>
          {questionnaire?.name ? (
            <Text style={styles.gameName}>{questionnaire.name}</Text>
          ) : null}
          <QRCodeDisplay roomCode={roomCode} />
        </View>

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
                <PlayerRow key={item.id} player={item} />
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
      </View>

      <ConfirmDialog
        visible={showAbandon}
        title="Abandon Room?"
        message="Players waiting in the lobby will be disconnected."
        confirmLabel="Abandon"
        cancelLabel="Stay"
        destructive
        onConfirm={handleAbandonConfirm}
        onCancel={() => setShowAbandon(false)}
      />
    </LinearGradient>
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
  gameName: {
    fontFamily:   FontFamily.display,
    fontSize:     FontSize.xl,
    fontWeight:   FontWeight.black,
    color:        Colors.ink,
    letterSpacing: -0.3,
    textAlign:    'center',
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
    fontSize:      FontSize.jumbo,
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
    fontSize:    FontSize.lg,
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
