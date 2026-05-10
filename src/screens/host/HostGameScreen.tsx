import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect } from 'react';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { GamePhase, RoundPhase } from '../../constants/gameConstants';
import { HostStackParamList, RootStackParamList } from '../../types/navigation';
import { Player, JoinRequest } from '../../types/player';
import { PlayerResult } from '../../types/results';
import { useGameContext } from '../../context/GameContext';
import { useQuestionnairesContext } from '../../context/QuestionnairesContext';
import { clearHostSession } from '../../lib/hostSession';
import { useHostControls } from '../../hooks/useHostControls';
import { useHostSetup } from '../../hooks/useHostSetup';
import { useHostGame } from '../../hooks/useHostGame';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { QRCodeDisplay } from '../../components/QRCodeDisplay';
import { PlayerRow } from '../../components/PlayerRow';
import { PlayerStatusList } from '../../components/PlayerStatusList';
import { EmptyState } from '../../components/EmptyState';
import { HostDropdown } from '../../components/HostDropdown';
import { LeaderboardRow } from '../../components/LeaderboardRow';
import { Divider } from '../../components/Divider';
import { QuestionResult as QuestionResultComponent } from '../../components/questions/QuestionResult';
import { Sparkle } from '../../components/brand/Sparkle';

type Nav   = NativeStackNavigationProp<HostStackParamList & RootStackParamList>;
type Route = RouteProp<HostStackParamList, 'HostGame'>;

// ─── Sub-components ──────────────────────────────────────────────────────────

type SectionProps = { title: string; players: Player[]; defaultOpen?: boolean; onKick: (id: string) => void; showScore?: boolean };

function CollapsibleSection({ title, players, defaultOpen = true, onKick, showScore }: SectionProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.sectionHeader} accessibilityRole="button">
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.textSecondary} />
      </Pressable>
      {open && players.map((p) => (
        <PlayerRow key={p.id} player={p} showScore={showScore} onKick={onKick} />
      ))}
    </View>
  );
}

type JoinRowProps = { request: JoinRequest; onAdmit: (id: string) => void; onDeny: (id: string) => void };

function PendingJoinRow({ request, onAdmit, onDeny }: JoinRowProps): React.ReactElement {
  return (
    <View style={styles.joinRow}>
      <Text style={styles.joinName} numberOfLines={1}>{request.name}</Text>
      <View style={styles.joinActions}>
        <Pressable onPress={() => onAdmit(request.playerId)} style={styles.admitBtn} accessibilityRole="button">
          <Text style={styles.admitText}>Admit</Text>
        </Pressable>
        <Pressable onPress={() => onDeny(request.playerId)} style={styles.denyBtn} accessibilityRole="button">
          <Text style={styles.denyText}>Deny</Text>
        </Pressable>
      </View>
    </View>
  );
}

type LobbyJoinRowProps = { request: JoinRequest; onAdmit: (id: string) => void; onDeny: (id: string) => void };

function LobbyJoinRow({ request, onAdmit, onDeny }: LobbyJoinRowProps): React.ReactElement {
  return (
    <View style={styles.lobbyJoinRow}>
      <View style={styles.lobbyJoinAvatar}>
        <Text style={styles.lobbyJoinAvatarText}>{request.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.lobbyJoinName} numberOfLines={1}>{request.name}</Text>
      <View style={styles.lobbyJoinActions}>
        <Button label="Admit" onPress={() => onAdmit(request.playerId)} style={styles.lobbyJoinBtn} />
        <Button label="Deny" onPress={() => onDeny(request.playerId)} variant="destructive" style={styles.lobbyJoinBtn} />
      </View>
    </View>
  );
}

type ResultSectionProps = { result: PlayerResult; highlight: boolean; expanded: boolean; onToggle: () => void };

function PlayerResultSection({ result, highlight, expanded, onToggle }: ResultSectionProps): React.ReactElement {
  return (
    <View>
      <Pressable onPress={onToggle} accessibilityRole="button" accessibilityLabel={`${result.player.name} results`}>
        <LeaderboardRow result={result} highlight={highlight} />
      </Pressable>
      {expanded && (
        <View style={styles.breakdown}>
          {result.rounds.map((round) => (
            <View key={round.roundNumber} style={styles.roundBreakdown}>
              <Text style={styles.roundBreakdownLabel}>
                Round {round.roundNumber}{round.roundLabel !== null ? ` — ${round.roundLabel}` : ''}
              </Text>
              {round.questionResults.map((qr) => (
                <QuestionResultComponent key={qr.questionId} result={qr} />
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function HostGameScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { questionnaireId, rounds: paramRounds, savedRoomCode } = route.params;

  const { state, dispatch, send, disconnect } = useGameContext();
  const { questionnaires }   = useQuestionnairesContext();
  const { admitPlayer, denyPlayer, startGame, revealAnswers, advanceRound, endGame, kickPlayer, resyncPlayers } = useHostControls();
  // After reconnect, the server's host_state message provides authoritative rounds (with correctAnswers).
  const rounds = state.hostRounds ?? paramRounds;
  const { roomCode }         = useHostSetup({ questionnaireId, rounds: paramRounds, savedRoomCode });
  const { players, sorted, waiting, answered, currentRound, totalRounds, gameName, roundPhase, isLastRound, isAnswering } = useHostGame();

  const [showAbandon,    setShowAbandon]    = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showMenu,       setShowMenu]       = useState(false);
  const [kickTarget,     setKickTarget]     = useState<{ id: string; name: string } | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  const questionnaire   = questionnaires.find((q) => q.id === questionnaireId) ?? null;
  const phase           = state.gameState?.phase;
  const pendingRequests = state.pendingRequests;
  const gameResults     = state.gameResults;

  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_GAME_ID', payload: roomCode });
    return () => { dispatch({ type: 'SET_ACTIVE_GAME_ID', payload: null }); };
  }, [dispatch, roomCode]);

  useEffect(() => {
    return navigation.addListener('beforeRemove', (e) => {
      if (!state.gameState || phase === GamePhase.GameOver) return;
      e.preventDefault();
      setShowAbandon(true);
    });
  }, [navigation, state.gameState, phase]);

  function handleDone(): void {
    disconnect();
    void clearHostSession();
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }));
  }

  function handleAbandonConfirm(): void {
    setShowAbandon(false);
    send({ type: 'end_game' });
    disconnect();
    void clearHostSession();
    dispatch({ type: 'RESET' });
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }));
  }

  function handleKickRequest(playerId: string): void {
    const player = players.find((p) => p.id === playerId);
    if (player) setKickTarget({ id: player.id, name: player.name });
  }

  // ── Results view ────────────────────────────────────────────────────────
  if (phase === GamePhase.GameOver && gameResults) {
    return (
      <ScreenContainer noPadding>
        <Banner title="Results" />
        <View style={styles.resultsInner}>
          <View style={styles.winner}>
            <Text style={styles.winnerLabel}>Winner</Text>
            <Text style={styles.winnerName}>{gameResults.winner.name}</Text>
            <Text style={styles.winnerScore}>{gameResults.winner.score} pts</Text>
          </View>
          <Divider />
          <FlatList
            data={gameResults.players}
            keyExtractor={(item) => item.player.id}
            ItemSeparatorComponent={() => <Divider spacing={Spacing.xs} />}
            renderItem={({ item, index }) => (
              <PlayerResultSection
                result={item}
                highlight={index === 0}
                expanded={expandedResult === item.player.id}
                onToggle={() => setExpandedResult(expandedResult === item.player.id ? null : item.player.id)}
              />
            )}
          />
        </View>
        <Button label="Done" onPress={handleDone} style={styles.doneButton} />
      </ScreenContainer>
    );
  }

  // ── Round view ──────────────────────────────────────────────────────────
  if (phase === GamePhase.InRound || phase === GamePhase.AllAnswered || phase === GamePhase.AnswersRevealed) {
    return (
      <ScreenContainer noPadding>
        <Banner title={`Round ${currentRound} of ${totalRounds}`} subtitle={gameName || undefined} onHostMenuPress={() => setShowMenu(true)} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          {pendingRequests.length > 0 && (
            <View style={styles.pendingSection}>
              <Text style={styles.sectionTitle}>Waiting to Join ({pendingRequests.length})</Text>
              {pendingRequests.map((req) => (
                <PendingJoinRow key={req.playerId} request={req} onAdmit={admitPlayer} onDeny={denyPlayer} />
              ))}
            </View>
          )}

          <View style={styles.playersHeader}>
            <Text style={styles.playersHeading}>Players</Text>
            <Pressable onPress={resyncPlayers} hitSlop={Spacing.sm} accessibilityRole="button" accessibilityLabel="Resync players">
              <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
            </Pressable>
          </View>

          {isAnswering ? (
            <>
              <CollapsibleSection title="Not answered" players={waiting} defaultOpen onKick={handleKickRequest} showScore />
              <CollapsibleSection title="Answered" players={answered} defaultOpen={false} onKick={handleKickRequest} showScore />
            </>
          ) : (
            <PlayerStatusList players={sorted} showScore onKick={handleKickRequest} />
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Reveal Answers" onPress={revealAnswers} disabled={roundPhase !== RoundPhase.AllAnswered} />
          <Button label={isLastRound ? 'End Game' : 'Next Round'} onPress={isLastRound ? endGame : advanceRound} disabled={roundPhase !== RoundPhase.AnswersRevealed} />
        </View>

        <HostDropdown
          visible={showMenu}
          roomCode={roomCode}
          onClose={() => setShowMenu(false)}
          onEndGame={() => { setShowMenu(false); setShowEndConfirm(true); }}
          onResyncPlayers={resyncPlayers}
        />

        <ConfirmDialog
          visible={showEndConfirm}
          title="End Game Early"
          message="This will end the game immediately and show results with data collected so far."
          confirmLabel="End Game"
          cancelLabel="Cancel"
          destructive
          onConfirm={() => { setShowEndConfirm(false); endGame(); }}
          onCancel={() => setShowEndConfirm(false)}
        />

        <ConfirmDialog
          visible={kickTarget !== null}
          title="Remove Player"
          message={`Remove ${kickTarget?.name ?? 'this player'} from the game?`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          destructive
          onConfirm={() => { if (kickTarget) kickPlayer(kickTarget.id); setKickTarget(null); }}
          onCancel={() => setKickTarget(null)}
        />
      </ScreenContainer>
    );
  }

  // ── Lobby view (default) ────────────────────────────────────────────────
  const admittedPlayers = state.gameState?.players ?? [];
  const canStart        = admittedPlayers.length >= 1 && questionnaire !== null;

  return (
    <LinearGradient colors={[Colors.sun, Colors.melon]} style={styles.gradient}>
      <View style={styles.sparkle1} pointerEvents="none"><Sparkle size={28} color={Colors.cream} /></View>
      <View style={styles.sparkle2} pointerEvents="none"><Sparkle size={18} color={Colors.ink} /></View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.inner}>
        <View style={styles.codeSection}>
          {questionnaire?.name ? <Text style={styles.gameName}>{questionnaire.name}</Text> : null}
          <QRCodeDisplay roomCode={roomCode} />
        </View>

        {pendingRequests.length > 0 && (
          <View style={styles.lobbySection}>
            <Text style={styles.lobbySectionLabel}>Waiting to Join</Text>
            <View style={styles.cardList}>
              {pendingRequests.map((item) => (
                <LobbyJoinRow key={item.playerId} request={item} onAdmit={admitPlayer} onDeny={denyPlayer} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.lobbySection}>
          <Text style={styles.lobbySectionLabel}>The crew ({admittedPlayers.length})</Text>
          {admittedPlayers.length === 0 ? (
            <EmptyState title="No players yet" message="Share the room code to invite players." />
          ) : (
            <View style={styles.cardList}>
              {admittedPlayers.map((item) => (
                <PlayerRow key={item.id} player={item} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.lobbyFooter}>
        <Button
          label="Start Game"
          onPress={() => { if (questionnaire) startGame(questionnaire, rounds); }}
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

const styles = StyleSheet.create({
  // Shared
  scroll: { flex: 1 },
  inner:  { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.md },
  footer: { gap: Spacing.sm, padding: Spacing.md, paddingBottom: Spacing.lg, borderTopWidth: 1.5, borderTopColor: Colors.border, backgroundColor: Colors.background },

  // Lobby
  gradient:  { flex: 1 },
  sparkle1:  { position: 'absolute', top: 80,  right: 28, zIndex: 1 },
  sparkle2:  { position: 'absolute', top: 150, left:  24, zIndex: 1 },
  codeSection:       { alignItems: 'center', gap: Spacing.sm, paddingTop: Spacing.lg },
  gameName:          { fontFamily: FontFamily.display, fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.ink, letterSpacing: -0.3, textAlign: 'center' },
  lobbySection:      { gap: Spacing.sm },
  lobbySectionLabel: { fontFamily: FontFamily.heading, color: Colors.ink, fontSize: FontSize.lg, fontWeight: FontWeight.black, letterSpacing: -0.2 },
  cardList:          { gap: Spacing.sm },
  lobbyJoinRow:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, borderWidth: 2.5, borderColor: Colors.border, padding: Spacing.sm },
  lobbyJoinAvatar:   { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.sun, borderWidth: 2, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  lobbyJoinAvatarText: { fontFamily: FontFamily.display, color: Colors.ink, fontSize: FontSize.lg, fontWeight: FontWeight.black },
  lobbyJoinName:     { flex: 1, fontFamily: FontFamily.body, color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  lobbyJoinActions:  { flexDirection: 'row', gap: Spacing.sm },
  lobbyJoinBtn:      { paddingVertical: Spacing.xs, minHeight: 40 },
  lobbyFooter:       { padding: Spacing.md, gap: Spacing.sm },
  footerButton:      { width: '100%' },

  // Round
  pendingSection:  { gap: Spacing.xs, paddingBottom: Spacing.xs, borderBottomWidth: 1.5, borderBottomColor: Colors.border, marginBottom: Spacing.xs },
  playersHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  playersHeading:  { fontFamily: FontFamily.body, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary, letterSpacing: 1, textTransform: 'uppercase' },
  sectionHeader:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.sm },
  sectionTitle:    { fontFamily: FontFamily.body, fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textSecondary, paddingVertical: Spacing.xs },
  joinRow:         { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs, gap: Spacing.sm },
  joinName:        { flex: 1, fontFamily: FontFamily.body, color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  joinActions:     { flexDirection: 'row', gap: Spacing.sm },
  admitBtn:        { backgroundColor: Colors.primary, borderRadius: BorderRadius.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm },
  admitText:       { color: Colors.textPrimary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  denyBtn:         { backgroundColor: Colors.surfaceElevated, borderRadius: BorderRadius.sm, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border },
  denyText:        { color: Colors.textSecondary, fontSize: FontSize.sm, fontWeight: FontWeight.bold },

  // Results
  resultsInner: { flex: 1, padding: Spacing.md, gap: Spacing.md },
  doneButton:   { margin: Spacing.md },
  winner:       { alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.lg },
  winnerLabel:  { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  winnerName:   { color: Colors.textPrimary, fontSize: FontSize.hero, fontWeight: FontWeight.black },
  winnerScore:  { color: Colors.textSecondary, fontSize: FontSize.lg },
  breakdown:          { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.md },
  roundBreakdown:     { gap: Spacing.sm },
  roundBreakdownLabel: { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
});
