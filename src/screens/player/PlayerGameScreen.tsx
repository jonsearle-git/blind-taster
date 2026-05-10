import { StyleSheet, View, Text, FlatList, ScrollView, KeyboardAvoidingView, Platform, Modal, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { GamePhase, RoundPhase } from '../../constants/gameConstants';
import { PlayerStackParamList, RootStackParamList } from '../../types/navigation';
import { RoundResult } from '../../types/results';
import { useGameContext } from '../../context/GameContext';
import { useGameState } from '../../hooks/useGameState';
import { usePlayerActions } from '../../hooks/usePlayerActions';
import { useAnswers } from '../../hooks/useAnswers';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { PlayerRow } from '../../components/PlayerRow';
import { KickedOverlay } from '../../components/KickedOverlay';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { QuestionResult as QuestionResultComponent } from '../../components/questions/QuestionResult';
import { QuestionInput } from '../../components/questions/QuestionInput';
import { Divider } from '../../components/Divider';
import { Sparkle } from '../../components/brand/Sparkle';
import { StickerCard } from '../../components/brand/StickerCard';

type Nav   = NativeStackNavigationProp<PlayerStackParamList & RootStackParamList>;
type Route = RouteProp<PlayerStackParamList, 'PlayerGame'>;

function extractRoomCode(data: string): string | null {
  const match = data.match(/join\/([A-Z0-9]{4,8})/i);
  return match ? match[1].toUpperCase() : null;
}

function ordinal(n: number): string {
  const suffix = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]);
}

type RoundSectionProps = { round: RoundResult; expanded: boolean; onToggle: () => void };

function RoundSection({ round, expanded, onToggle }: RoundSectionProps): React.ReactElement {
  return (
    <View>
      <Pressable onPress={onToggle} style={styles.roundHeader} accessibilityRole="button">
        <View style={styles.roundHeaderLeft}>
          <Text style={styles.roundLabel}>
            Round {round.roundNumber}{round.roundLabel !== null ? ` — ${round.roundLabel}` : ''}
          </Text>
        </View>
        <Text style={styles.roundScore}>+{round.roundScore} pts</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>
      {expanded && (
        <View style={styles.breakdown}>
          {round.questionResults.map((qr) => (
            <QuestionResultComponent key={qr.questionId} result={qr} />
          ))}
        </View>
      )}
    </View>
  );
}

export default function PlayerGameScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { roomCode: savedRoomCode } = route.params ?? {};

  const { state, dispatch, connect, disconnect, send, leaveGame } = useGameContext();
  const { handleMessage } = useGameState();
  const { requestJoin, submitAnswers } = usePlayerActions();

  // ── Join state ────────────────────────────────────────────────────────
  const [roomCodeInput, setRoomCodeInput] = useState(savedRoomCode?.toUpperCase() ?? '');
  const [name,          setName]          = useState('');
  const [isDenied,      setIsDenied]      = useState(false);
  const [isWaiting,     setIsWaiting]     = useState(false);
  const [roomCodeError, setRoomCodeError] = useState<string | undefined>();
  const [nameError,     setNameError]     = useState<string | undefined>();
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [scanning,      setScanning]      = useState(false);
  const [scanned,       setScanned]       = useState(false);
  const [permission, requestPermission]   = useCameraPermissions();
  const pendingJoinRef = useRef(false);

  // ── Round state ───────────────────────────────────────────────────────
  const [submitted, setSubmitted] = useState(false);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const phase       = state.gameState?.phase;
  const game        = state.gameState;
  const questions   = game?.questionnaire?.questions ?? [];
  const currentRound = game?.currentRound ?? 1;
  const totalRounds  = game?.totalRounds ?? 1;
  const gameName     = game?.questionnaire?.name ?? '';
  const roundPhase   = game?.roundPhase ?? RoundPhase.Answering;
  const localPlayer  = game?.players.find((p) => p.id === state.localPlayerId);
  const score        = localPlayer?.score ?? 0;
  const roundResults = state.lastRoundResults;
  const roundLabel   = state.lastRoundLabel;
  const isRevealed   = roundPhase === RoundPhase.AnswersRevealed;
  const gameResults  = state.gameResults;

  const { answers, setAnswer, clearAnswers, isComplete } = useAnswers(questions);

  // ── Periodic sync ─────────────────────────────────────────────────────
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    if (!state.localPlayerId) return;
    const id = setInterval(() => { sendRef.current({ type: 'sync_state' }); }, 10000);
    return () => clearInterval(id);
  }, [state.localPlayerId]);

  // ── Clear answers on new round ────────────────────────────────────────
  useEffect(() => {
    setSubmitted(false);
    clearAnswers();
  }, [currentRound, clearAnswers]);

  function buildOnMessage() {
    return (msg: Parameters<typeof handleMessage>[0]) => {
      if (msg.type === 'name_taken') {
        setIsWaiting(false);
        disconnect();
        setNameError('That name is already taken — pick another.');
      } else if (msg.type === 'you_were_denied') {
        setIsWaiting(false);
        setIsDenied(true);
        disconnect();
        dispatch({ type: 'RESET' });
      } else {
        handleMessage(msg);
      }
    };
  }

  function doJoin(): void {
    const trimmedCode = roomCodeInput.trim();
    const trimmedName = name.trim();
    setIsDenied(false);
    setIsWaiting(true);
    pendingJoinRef.current = true;
    void connect({
      roomCode:  trimmedCode,
      isHost:    false,
      onMessage: buildOnMessage(),
      onOpen: () => {
        if (pendingJoinRef.current) {
          pendingJoinRef.current = false;
          requestJoin(trimmedName);
        }
        // If already an admitted player on this room (server recognises clientId),
        // server auto-resumes via game_state — no action needed.
      },
    });
  }

  function handleJoin(): void {
    if (isWaiting) return;
    const trimmedCode = roomCodeInput.trim();
    const trimmedName = name.trim();
    const codeErr = trimmedCode.length < 4 ? 'Enter a room code (at least 4 characters).' : undefined;
    const nErr    = !trimmedName ? 'Enter your name.' : undefined;
    setRoomCodeError(codeErr);
    setNameError(nErr);
    if (codeErr || nErr) return;
    const activePhase = phase !== undefined && phase !== GamePhase.Lobby && phase !== GamePhase.GameOver;
    if (activePhase) { setShowLeaveDialog(true); return; }
    doJoin();
  }

  function handleLeave(): void {
    leaveGame();
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }));
  }

  function handleDone(): void {
    disconnect();
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] }));
  }

  async function handleScan(): Promise<void> {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setScanned(false);
    setScanning(true);
  }

  function handleBarcode({ data }: { data: string }): void {
    if (scanned) return;
    const code = extractRoomCode(data);
    if (!code) return;
    setScanned(true);
    setScanning(false);
    setRoomCodeInput(code);
    setIsDenied(false);
  }

  function handleSubmit(): void {
    setSubmitted(true);
    submitAnswers(Array.from(answers.values()));
  }

  // ── Results view ──────────────────────────────────────────────────────
  if (phase === GamePhase.GameOver && gameResults) {
    const myResult = gameResults.players.find((p) => p.player.id === state.localPlayerId) ?? gameResults.players[0] ?? null;
    if (!myResult) {
      return (
        <ScreenContainer>
          <Text style={styles.fallback}>No results available.</Text>
        </ScreenContainer>
      );
    }
    const isWinner = myResult.player.id === gameResults.winner.id;
    return (
      <ScreenContainer noPadding>
        <Banner title="Your Results" />
        <FlatList
          ListFooterComponent={<Button label="Done" onPress={handleDone} style={styles.doneButton} />}
          data={myResult.rounds}
          keyExtractor={(item) => String(item.roundNumber)}
          ListHeaderComponent={
            <>
              <View style={styles.hero}>
                {isWinner && <Text style={styles.winnerBadge}>Winner!</Text>}
                <Text style={styles.position}>{ordinal(myResult.position)}</Text>
                <Text style={styles.heroScore}>{myResult.totalScore} pts</Text>
              </View>
              <Divider />
            </>
          }
          ItemSeparatorComponent={() => <Divider spacing={Spacing.xs} />}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RoundSection
              round={item}
              expanded={expandedRound === item.roundNumber}
              onToggle={() => setExpandedRound(expandedRound === item.roundNumber ? null : item.roundNumber)}
            />
          )}
        />
        <KickedOverlay visible={state.isKicked} />
      </ScreenContainer>
    );
  }

  // ── Round view ────────────────────────────────────────────────────────
  if (state.localPlayerId && (phase === GamePhase.InRound || phase === GamePhase.AllAnswered || phase === GamePhase.AnswersRevealed || phase === GamePhase.Paused)) {
    return (
      <ScreenContainer noPadding>
        <Banner title={`Round ${currentRound} of ${totalRounds}`} subtitle={gameName || undefined} score={score} />
        <ScrollView contentContainerStyle={styles.roundInner} keyboardShouldPersistTaps="handled">
          {isRevealed && roundResults ? (
            <View style={styles.section}>
              {roundLabel ? <Text style={styles.roundRevealLabel}>{roundLabel}</Text> : null}
              <Text style={styles.sectionLabel}>Round Results</Text>
              <View style={styles.resultsList}>
                {roundResults.map((qr) => (
                  <QuestionResultComponent key={qr.questionId} result={qr} />
                ))}
              </View>
            </View>
          ) : submitted ? (
            <View style={styles.waitingSection}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.waitingText}>Waiting for other players…</Text>
            </View>
          ) : (
            <View style={styles.section}>
              {questions.map((q, index) => (
                <View key={q.id} style={styles.questionBlock}>
                  <Text style={styles.questionIndex}>Question {index + 1}</Text>
                  <QuestionInput question={q} answer={answers.get(q.id) ?? null} onAnswer={setAnswer} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        {!submitted && !isRevealed && (
          <View style={styles.roundFooter}>
            <Button label="Submit Answers" onPress={handleSubmit} disabled={!isComplete} />
          </View>
        )}
        <KickedOverlay visible={state.isKicked} />
        <GamePausedOverlay visible={phase === GamePhase.Paused} />
      </ScreenContainer>
    );
  }

  // ── Lobby view ────────────────────────────────────────────────────────
  if (state.localPlayerId && (phase === GamePhase.Lobby || phase === GamePhase.Abandoned)) {
    const players  = game?.players ?? [];
    const roomCode = game?.roomCode ?? '';
    const questionnaire = game?.questionnaire;
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={[Colors.sun, Colors.melon]} style={styles.gradient}>
          <View style={styles.sparkle1} pointerEvents="none"><Sparkle size={28} color={Colors.cream} /></View>
          <View style={styles.sparkle2} pointerEvents="none"><Sparkle size={18} color={Colors.ink} /></View>
          <View style={styles.lobbyHeader}>
            {questionnaire?.name ? <Text style={styles.lobbyGameName}>{questionnaire.name}</Text> : null}
            <Text style={styles.codeLabel}>Room code</Text>
            {roomCode.length > 0 && (
              <StickerCard shadowOffset={5} borderRadius={16} style={styles.codeStickerWrapper}>
                <Text style={styles.codeText}>{roomCode}</Text>
              </StickerCard>
            )}
            <View style={styles.waitingRow}>
              <ActivityIndicator size="small" color={Colors.ink} />
              <Text style={styles.waitingText2}>Waiting for host…</Text>
            </View>
          </View>
          <View style={styles.crewSection}>
            <Text style={styles.crewLabel}>The crew ({players.length})</Text>
            <FlatList
              data={players}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.playerList}
              renderItem={({ item }) => <PlayerRow player={item} />}
              ListEmptyComponent={<Text style={styles.emptyText}>No other players yet.</Text>}
            />
          </View>
          <View style={styles.lobbyFooter}>
            <Button label="Leave Game" onPress={handleLeave} variant="secondary" style={styles.leaveButton} />
          </View>
        </LinearGradient>
        <KickedOverlay visible={state.isKicked} />
        <KickedOverlay visible={phase === GamePhase.Abandoned} title="Game Abandoned" message="The game was abandoned by the host." />
      </SafeAreaView>
    );
  }

  // ── Join view (default) ───────────────────────────────────────────────
  return (
    <ScreenContainer>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.joinInner} keyboardShouldPersistTaps="handled">
          <View style={styles.fields}>
            <TextInput
              label="Room Code"
              value={roomCodeInput}
              error={roomCodeError}
              onChangeText={(t) => { setRoomCodeInput(t.toUpperCase()); setIsDenied(false); setIsWaiting(false); setRoomCodeError(undefined); }}
              placeholder="e.g. ABCD1234"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
            />
            <Button label="Scan QR Code" onPress={handleScan} variant="secondary" />
            <TextInput
              label="Your Name"
              value={name}
              error={isDenied ? 'You were not admitted into this game.' : nameError}
              onChangeText={(t) => { setName(t); setIsDenied(false); setNameError(undefined); }}
              placeholder="Enter your name"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={24}
            />
          </View>
          <Button label={isWaiting ? 'Waiting for host…' : 'Join Game'} onPress={handleJoin} loading={isWaiting} style={styles.joinButton} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={scanning} animationType="slide" onRequestClose={() => setScanning(false)}>
        <View style={styles.scannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={handleBarcode}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
          </View>
          <Text style={styles.scannerHint}>Point at the room QR code</Text>
          <Pressable onPress={() => setScanning(false)} style={styles.scannerClose}>
            <Text style={styles.scannerCloseText}>Cancel</Text>
          </Pressable>
        </View>
      </Modal>

      <ConfirmDialog
        visible={showLeaveDialog}
        title="Already in a Game"
        message="You're currently in another game. Would you like to leave and join this one?"
        confirmLabel="Leave & Join"
        cancelLabel="Stay"
        destructive
        onConfirm={() => { setShowLeaveDialog(false); doJoin(); }}
        onCancel={() => setShowLeaveDialog(false)}
      />
    </ScreenContainer>
  );
}

const FRAME = 220;

const styles = StyleSheet.create({
  // Join
  flex:             { flex: 1 },
  joinInner:        { flexGrow: 1, padding: Spacing.md, gap: Spacing.lg },
  fields:           { gap: Spacing.md },
  joinButton:       { marginTop: 'auto' as unknown as number },
  scannerContainer: { flex: 1, backgroundColor: Colors.ink },
  scannerOverlay:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scannerFrame:     { width: FRAME, height: FRAME, borderWidth: 3, borderColor: Colors.cream, borderRadius: BorderRadius.lg },
  scannerHint:      { position: 'absolute', bottom: 120, alignSelf: 'center', color: Colors.cream, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  scannerClose:     { position: 'absolute', bottom: Spacing.xl, alignSelf: 'center', backgroundColor: Colors.surface, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill, borderWidth: 2.5, borderColor: Colors.ink },
  scannerCloseText: { color: Colors.ink, fontSize: FontSize.md, fontWeight: FontWeight.bold },

  // Lobby
  safe:             { flex: 1, backgroundColor: Colors.sun },
  gradient:         { flex: 1 },
  sparkle1:         { position: 'absolute', top: 80,  right: 28 },
  sparkle2:         { position: 'absolute', top: 150, left:  24 },
  lobbyHeader:      { paddingTop: Spacing.xl, paddingHorizontal: Spacing.lg, alignItems: 'center', gap: Spacing.sm },
  lobbyGameName:    { fontFamily: FontFamily.display, fontSize: FontSize.xl, fontWeight: FontWeight.black, color: Colors.ink, letterSpacing: -0.3, textAlign: 'center' },
  codeLabel:        { fontFamily: FontFamily.body, fontSize: FontSize.xs, fontWeight: FontWeight.black, color: Colors.ink, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.7 },
  codeStickerWrapper: { alignSelf: 'center' },
  codeText:         { fontFamily: FontFamily.display, fontSize: FontSize.jumbo, fontWeight: FontWeight.black, color: Colors.ink, letterSpacing: 4, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  waitingRow:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.xs },
  waitingText2:     { fontFamily: FontFamily.body, color: Colors.ink, fontSize: FontSize.sm, fontWeight: FontWeight.bold, opacity: 0.75 },
  crewSection:      { flex: 1, padding: Spacing.md, gap: Spacing.sm, marginTop: Spacing.lg },
  crewLabel:        { fontFamily: FontFamily.heading, color: Colors.ink, fontSize: FontSize.lg, fontWeight: FontWeight.black, letterSpacing: -0.2 },
  playerList:       { gap: Spacing.sm },
  emptyText:        { fontFamily: FontFamily.body, color: Colors.ink, fontSize: FontSize.sm, textAlign: 'center', paddingVertical: Spacing.md, opacity: 0.65 },
  lobbyFooter:      { padding: Spacing.md },
  leaveButton:      { width: '100%' },

  // Round
  roundInner:       { flexGrow: 1, padding: Spacing.md, gap: Spacing.lg },
  section:          { gap: Spacing.xl },
  questionBlock:    { gap: Spacing.sm },
  questionIndex:    { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  roundRevealLabel: { color: Colors.textPrimary, fontSize: FontSize.xxl, fontWeight: FontWeight.black, letterSpacing: -0.5, textAlign: 'center' },
  sectionLabel:     { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 1 },
  waitingSection:   { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, paddingVertical: Spacing.xxl },
  waitingText:      { color: Colors.textSecondary, fontSize: FontSize.md },
  resultsList:      { gap: Spacing.md },
  roundFooter:      { padding: Spacing.md, paddingBottom: Spacing.lg, borderTopWidth: 1.5, borderTopColor: Colors.border, backgroundColor: Colors.background },

  // Results
  list:             { paddingBottom: Spacing.xxl },
  doneButton:       { margin: Spacing.md },
  hero:             { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl, paddingHorizontal: Spacing.md },
  winnerBadge:      { color: Colors.gold, fontSize: FontSize.sm, fontWeight: FontWeight.bold, letterSpacing: 2 },
  position:         { color: Colors.textPrimary, fontSize: FontSize.hero, fontWeight: FontWeight.black },
  heroScore:        { color: Colors.textSecondary, fontSize: FontSize.xl },
  roundHeader:      { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, gap: Spacing.sm },
  roundHeaderLeft:  { flex: 1 },
  roundLabel:       { color: Colors.textPrimary, fontSize: FontSize.md, fontWeight: FontWeight.medium },
  roundScore:       { color: Colors.success, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  chevron:          { color: Colors.textDisabled, fontSize: FontSize.sm },
  breakdown:        { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.md },
  fallback:         { color: Colors.textSecondary, fontSize: FontSize.md, textAlign: 'center' },
});
