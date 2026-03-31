import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useGame } from '../../context/GameContext';
import { useBle } from '../../context/BleContext';
import { PLAYER_STATES, GAME_STATES, REVEAL_MODES, QUESTION_TYPES, BLE_MESSAGE_TYPES } from '../../constants/gameConstants';
import COLORS from '../../constants/colors';
import { SPACING, RADIUS } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import ScreenContainer from '../../components/ScreenContainer';
import Button from '../../components/Button';
import Card from '../../components/Card';

function scoreAnswers(questionnaire, correctAnswers, playerAnswers) {
  if (!correctAnswers) return null;
  let score = 0;
  let breakdown = {};
  questionnaire.forEach(q => {
    const correct = correctAnswers[q.id];
    const given = playerAnswers?.[q.id];
    if (correct === undefined || correct === '' || given === undefined) {
      breakdown[q.id] = null;
      return;
    }
    if (q.type === QUESTION_TYPES.TEXT_KEYWORDS) {
      // Score 1 point per keyword found in the player's answer
      const keywords = q.keywords ?? [];
      const lowerAnswer = given.toString().toLowerCase();
      const hit = keywords.filter(kw => lowerAnswer.includes(kw)).length;
      score += hit;
      breakdown[q.id] = hit;
    } else {
      const correct_val = correct.toString().trim().toLowerCase();
      const given_val = given.toString().trim().toLowerCase();
      const point = correct_val === given_val ? 1 : 0;
      score += point;
      breakdown[q.id] = point;
    }
  });
  return { score, breakdown };
}

export default function RoundMonitorScreen({ navigation }) {
  const { state, dispatch } = useGame();
  const { players, questionnaire, rounds, currentRoundIndex, revealMode, hasAnswers } = state;
  const { host: ble } = useBle();

  const round = rounds[currentRoundIndex];
  const isLastRound = currentRoundIndex >= rounds.length - 1;

  // Track per-round answers received from players
  const [playerAnswers, setPlayerAnswers] = useState({}); // playerId → answers map

  // Update answer callback without restarting the scan — fix #7 (Android throttle)
  useEffect(() => {
    ble.setCallbacks({
      onPlayerAnswer: ({ playerId, roundIndex, answers }) => {
        if (roundIndex !== currentRoundIndex) return;
        setPlayerAnswers(prev => ({ ...prev, [playerId]: answers }));
        dispatch({ type: 'UPDATE_PLAYER', payload: { id: playerId, state: PLAYER_STATES.ANSWERED } });
      },
      onPlayerDropped: ({ playerId }) => {
        dispatch({ type: 'UPDATE_PLAYER', payload: { id: playerId, state: PLAYER_STATES.DROPPED } });
      },
    });
  }, [currentRoundIndex]);

  const respondedCount = players.filter(p => playerAnswers[p.id]).length;
  const allResponded = respondedCount === players.length && players.length > 0;

  async function handleReveal() {
    const answers = round?.answers ?? null;
    if (revealMode === REVEAL_MODES.AFTER_EACH_QUESTION && answers) {
      await ble.sendReveal(currentRoundIndex, answers);
    }
  }

  async function handleNextRound() {
    if (revealMode === REVEAL_MODES.AFTER_EACH_QUESTION) {
      await handleReveal();
    }
    const next = currentRoundIndex + 1;
    dispatch({ type: 'SET_CURRENT_ROUND', payload: next });
    // Reset player answered states
    players.forEach(p => dispatch({ type: 'UPDATE_PLAYER', payload: { id: p.id, state: PLAYER_STATES.IN_GAME } }));
    setPlayerAnswers({});
    await ble.sendRound(next);
  }

  async function handleFinish() {
    dispatch({ type: 'SET_GAME_STATE', payload: GAME_STATES.FINISHED });

    if (hasAnswers) {
      // Score each player across all rounds and send them their score
      const allRoundAnswers = {}; // playerId → { questionId → answer } merged
      // For simplicity, we use the current round's answers (full scoring would require collecting per-round)
      // In a full implementation we'd store all round answers in state; here we do per-round scoring
      for (const player of players) {
        let totalScore = 0;
        let totalBreakdown = {};
        for (let ri = 0; ri <= currentRoundIndex; ri++) {
          const r = rounds[ri];
          const pa = playerAnswers[player.id]; // current round only in this simplified version
          if (r?.answers && pa) {
            const result = scoreAnswers(questionnaire, r.answers, pa);
            if (result) {
              totalScore += result.score;
              Object.assign(totalBreakdown, result.breakdown);
            }
          }
        }
        dispatch({ type: 'UPDATE_PLAYER', payload: { id: player.id, score: totalScore } });
        await ble.sendScore(player.id, totalScore, totalBreakdown);
      }
    } else {
      // No answers — send all player data to host display only
      const allPlayerData = players.map(p => ({
        name: p.name,
        answers: playerAnswers[p.id] ?? {},
      }));
      await ble.sendGameResults(allPlayerData);
    }

    navigation.navigate('HostResults');
  }

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.roundLabel}>ROUND</Text>
          <Text style={styles.roundNumber}>{round?.number ?? currentRoundIndex + 1}</Text>
        </View>
        <View style={styles.progressPill}>
          <Text style={styles.progressText}>{respondedCount} / {players.length} answered</Text>
        </View>
      </View>

      <FlatList
        data={players}
        keyExtractor={p => p.id}
        style={styles.list}
        renderItem={({ item }) => {
          const hasAnswered = !!playerAnswers[item.id];
          const isDropped = item.state === PLAYER_STATES.DROPPED;
          const isReconnecting = ble.disconnectedPlayers.includes(item.id);
          return (
            <Card style={[styles.playerRow, isDropped && styles.playerRowDropped]}>
              <Text style={[styles.playerName, isDropped && styles.playerNameDropped]}>{item.name}</Text>
              <View style={[
                styles.statusBadge,
                isDropped ? styles.statusDropped : isReconnecting ? styles.statusReconnecting : hasAnswered ? styles.statusDone : styles.statusWaiting,
              ]}>
                <Text style={[
                  styles.statusText,
                  isDropped ? styles.statusTextDropped : isReconnecting ? styles.statusTextReconnecting : hasAnswered ? styles.statusTextDone : styles.statusTextWaiting,
                ]}>
                  {isDropped ? 'Dropped' : isReconnecting ? 'Reconnecting…' : hasAnswered ? 'Answered' : 'Waiting…'}
                </Text>
              </View>
            </Card>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No players connected.</Text>}
      />

      <View style={styles.actions}>
        {revealMode === REVEAL_MODES.AFTER_EACH_QUESTION && round?.answers && (
          <Button
            title="Reveal Answers"
            onPress={handleReveal}
            variant="secondary"
            style={styles.actionBtn}
          />
        )}
        {isLastRound ? (
          <Button
            title="Finish Game"
            onPress={handleFinish}
            style={styles.actionBtn}
          />
        ) : (
          <Button
            title="Next Round →"
            onPress={handleNextRound}
            style={styles.actionBtn}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  roundLabel: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    letterSpacing: 2,
  },
  roundNumber: {
    color: COLORS.accent,
    fontSize: FONT_SIZES.display,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 44,
  },
  progressPill: {
    backgroundColor: COLORS.backgroundElevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
  },
  list: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  playerName: {
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusDone: {
    backgroundColor: 'rgba(76,175,125,0.15)',
  },
  statusWaiting: {
    backgroundColor: COLORS.backgroundElevated,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
  },
  statusTextDone: {
    color: COLORS.success,
  },
  statusTextWaiting: {
    color: COLORS.textMuted,
  },
  playerRowDropped: {
    opacity: 0.5,
  },
  playerNameDropped: {
    color: COLORS.textMuted,
  },
  statusDropped: {
    backgroundColor: 'rgba(217,79,79,0.12)',
  },
  statusTextDropped: {
    color: COLORS.error,
  },
  statusReconnecting: {
    backgroundColor: 'rgba(201,151,58,0.12)',
  },
  statusTextReconnecting: {
    color: COLORS.warning,
  },
  empty: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  actions: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  actionBtn: {
    width: '100%',
  },
});
