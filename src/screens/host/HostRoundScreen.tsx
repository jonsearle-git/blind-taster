import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { RoundPhase } from '../../constants/gameConstants';
import { HostStackParamList } from '../../types/navigation';
import { Player, JoinRequest } from '../../types/player';
import { useGameContext } from '../../context/GameContext';
import { clearHostSession } from '../../lib/hostSession';
import { useHostControls } from '../../hooks/useHostControls';
import { ScreenContainer } from '../../components/ScreenContainer';
import { Banner } from '../../components/Banner';
import { PlayerRow } from '../../components/PlayerRow';
import { PlayerStatusList } from '../../components/PlayerStatusList';
import { Button } from '../../components/Button';
import { GamePausedOverlay } from '../../components/GamePausedOverlay';
import { HostDropdown } from '../../components/HostDropdown';
import { ConfirmDialog } from '../../components/ConfirmDialog';

type Nav = NativeStackNavigationProp<HostStackParamList>;

type SectionProps = {
  title:        string;
  players:      Player[];
  defaultOpen?: boolean;
  onKick:       (id: string) => void;
  showScore?:   boolean;
};

function CollapsibleSection({ title, players, defaultOpen = true, onKick, showScore }: SectionProps): React.ReactElement {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.sectionHeader} accessibilityRole="button">
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.textSecondary} />
      </Pressable>

      {open && players.map((p, i) => (
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

export default function HostRoundScreen(): React.ReactElement {
  const navigation              = useNavigation<Nav>();
  const { state }               = useGameContext();
  const [showMenu, setShowMenu]             = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [kickTarget, setKickTarget]         = useState<{ id: string; name: string } | null>(null);
  const { revealAnswers, advanceRound, endGame, kickPlayer, admitPlayer, denyPlayer, resyncPlayers } = useHostControls();

  const game            = state.gameState;
  const players         = game?.players ?? [];
  const pendingRequests = state.pendingRequests;
  const currentRound    = game?.currentRound ?? 1;
  const totalRounds     = game?.totalRounds ?? 1;
  const gameName        = game?.questionnaire?.name ?? '';
  const roundPhase      = game?.roundPhase ?? RoundPhase.Answering;
  const answeredIds     = new Set(game?.answeredPlayerIds ?? []);
  const roomCode        = game?.roomCode ?? '';
  const isLastRound     = currentRound === totalRounds;
  const isAnswering     = roundPhase === RoundPhase.Answering;

  const sorted  = [...players].sort((a, b) => b.score - a.score);
  const waiting = sorted.filter((p) => !answeredIds.has(p.id));
  const answered = sorted.filter((p) =>  answeredIds.has(p.id));

  useEffect(() => {
    if (state.gameResults) {
      void clearHostSession();
      navigation.navigate('HostResults', { results: state.gameResults });
    }
  }, [state.gameResults, navigation]);

  function handleKickRequest(playerId: string): void {
    const player = players.find((p) => p.id === playerId);
    if (player) setKickTarget({ id: player.id, name: player.name });
  }

  return (
    <ScreenContainer noPadding>
      <Banner title={`Round ${currentRound} of ${totalRounds}`} subtitle={gameName || undefined} onHostMenuPress={() => setShowMenu(true)} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
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
            <CollapsibleSection
              title="Not answered"
              players={waiting}
              defaultOpen
              onKick={handleKickRequest}
              showScore
            />
            <CollapsibleSection
              title="Answered"
              players={answered}
              defaultOpen={false}
              onKick={handleKickRequest}
              showScore
            />
          </>
        ) : (
          <PlayerStatusList
            players={sorted}
            showScore
            onKick={handleKickRequest}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Reveal Answers"
          onPress={revealAnswers}
          disabled={roundPhase !== RoundPhase.AllAnswered}
        />
        <Button
          label={isLastRound ? 'End Game' : 'Next Round'}
          onPress={isLastRound ? endGame : advanceRound}
          disabled={roundPhase !== RoundPhase.AnswersRevealed}
        />
      </View>

      <GamePausedOverlay visible={state.isPaused} />

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

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  inner:  { padding: Spacing.md, gap: Spacing.md, paddingBottom: Spacing.md },

  footer: {
    gap:               Spacing.sm,
    padding:           Spacing.md,
    paddingBottom:     Spacing.lg,
    borderTopWidth:    1.5,
    borderTopColor:    Colors.border,
    backgroundColor:   Colors.background,
  },

  playersHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  playersHeading: {
    fontFamily:  FontFamily.body,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.bold,
    color:       Colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  pendingSection: {
    gap:           Spacing.xs,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.border,
    marginBottom:  Spacing.xs,
  },

  sectionHeader: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    fontFamily:  FontFamily.body,
    fontSize:    FontSize.sm,
    fontWeight:  FontWeight.bold,
    color:       Colors.textSecondary,
    paddingVertical: Spacing.xs,
  },

  joinRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: Spacing.xs,
    gap:            Spacing.sm,
  },
  joinName: {
    flex:        1,
    fontFamily:  FontFamily.body,
    color:       Colors.textPrimary,
    fontSize:    FontSize.md,
    fontWeight:  FontWeight.bold,
  },
  joinActions: {
    flexDirection: 'row',
    gap:           Spacing.sm,
  },
  admitBtn: {
    backgroundColor:   Colors.primary,
    borderRadius:      BorderRadius.sm,
    paddingVertical:   Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  admitText: {
    color:      Colors.textPrimary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  denyBtn: {
    backgroundColor:   Colors.surfaceElevated,
    borderRadius:      BorderRadius.sm,
    paddingVertical:   Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderWidth:       1.5,
    borderColor:       Colors.border,
  },
  denyText: {
    color:      Colors.textSecondary,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.bold,
  },

});
