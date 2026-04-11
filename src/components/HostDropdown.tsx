import { StyleSheet, View, Text, Modal, Pressable, FlatList } from 'react-native';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { Player } from '../types/player';
import { PlayerStatus } from '../constants/gameConstants';
import { QRCodeDisplay } from './QRCodeDisplay';
import { ConfirmDialog } from './ConfirmDialog';
import { Divider } from './Divider';
import { useState } from 'react';

type Tab = 'players' | 'roomCode' | 'endGame';

type Props = {
  visible: boolean;
  roomCode: string;
  players: Player[];
  onClose: () => void;
  onKick: (playerId: string) => void;
  onEndGame: () => void;
};

export function HostDropdown({
  visible,
  roomCode,
  players,
  onClose,
  onKick,
  onEndGame,
}: Props): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('players');
  const [kickTarget, setKickTarget] = useState<Player | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  function handleKickRequest(player: Player): void {
    setKickTarget(player);
  }

  function handleKickConfirm(): void {
    if (kickTarget) {
      onKick(kickTarget.id);
      setKickTarget(null);
    }
  }

  function handleEndGameRequest(): void {
    setShowEndConfirm(true);
  }

  function handleEndGameConfirm(): void {
    setShowEndConfirm(false);
    onClose();
    onEndGame();
  }

  return (
    <>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={() => {}}>

            <View style={styles.tabs}>
              {(['players', 'roomCode', 'endGame'] as Tab[]).map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: activeTab === tab }}
                >
                  <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
                    {tab === 'players' ? 'Players' : tab === 'roomCode' ? 'Room Code' : 'End Game'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Divider spacing={0} />

            <View style={styles.content}>
              {activeTab === 'players' && (
                <FlatList
                  data={players}
                  keyExtractor={(p) => p.id}
                  ItemSeparatorComponent={() => <Divider spacing={0} />}
                  renderItem={({ item }) => (
                    <View style={styles.playerRow}>
                      <View style={[
                        styles.dot,
                        { backgroundColor: item.status === PlayerStatus.Connected ? Colors.success : Colors.textDisabled },
                      ]} />
                      <Text style={styles.playerName} numberOfLines={1}>{item.name}</Text>
                      <Pressable
                        onPress={() => handleKickRequest(item)}
                        style={styles.kickButton}
                        accessibilityLabel={`Kick ${item.name}`}
                        accessibilityRole="button"
                        hitSlop={Spacing.sm}
                      >
                        <Text style={styles.kickIcon}>✕</Text>
                      </Pressable>
                    </View>
                  )}
                />
              )}

              {activeTab === 'roomCode' && (
                <View style={styles.qrContainer}>
                  <QRCodeDisplay roomCode={roomCode} />
                </View>
              )}

              {activeTab === 'endGame' && (
                <View style={styles.endGameContainer}>
                  <Text style={styles.endGameMessage}>
                    End the game now and jump to results with data collected so far.
                  </Text>
                  <Pressable
                    onPress={handleEndGameRequest}
                    style={styles.endGameButton}
                    accessibilityLabel="End game early"
                    accessibilityRole="button"
                  >
                    <Text style={styles.endGameButtonLabel}>End Game Early</Text>
                  </Pressable>
                </View>
              )}
            </View>

          </Pressable>
        </Pressable>
      </Modal>

      <ConfirmDialog
        visible={kickTarget !== null}
        title="Remove Player"
        message={`Remove ${kickTarget?.name ?? ''} from the game?`}
        confirmLabel="Remove"
        destructive
        onConfirm={handleKickConfirm}
        onCancel={() => setKickTarget(null)}
      />

      <ConfirmDialog
        visible={showEndConfirm}
        title="End Game Early"
        message="This will end the game immediately and show results with data collected so far."
        confirmLabel="End Game"
        destructive
        onConfirm={handleEndGameConfirm}
        onCancel={() => setShowEndConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: Colors.overlay,
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius:  Spacing.lg,
    borderTopRightRadius: Spacing.lg,
    maxHeight:        '70%',
    borderTopWidth:   1,
    borderColor:      Colors.border,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex:            1,
    paddingVertical: Spacing.md,
    alignItems:      'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    color:      Colors.textDisabled,
    fontSize:   FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  activeTabLabel: {
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing.md,
    flex:    1,
  },
  playerRow: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: Spacing.sm,
    gap:             Spacing.sm,
  },
  dot: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  playerName: {
    flex:       1,
    color:      Colors.textPrimary,
    fontSize:   FontSize.md,
  },
  kickButton: {
    padding:    Spacing.xs,
    minWidth:   44,
    minHeight:  44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kickIcon: {
    color:    Colors.error,
    fontSize: FontSize.md,
  },
  qrContainer: {
    paddingVertical: Spacing.lg,
    alignItems:      'center',
  },
  endGameContainer: {
    gap:             Spacing.lg,
    paddingVertical: Spacing.md,
  },
  endGameMessage: {
    color:    Colors.textSecondary,
    fontSize: FontSize.md,
  },
  endGameButton: {
    backgroundColor: Colors.error,
    borderRadius:    Spacing.sm,
    paddingVertical: Spacing.md,
    alignItems:      'center',
  },
  endGameButtonLabel: {
    color:      Colors.textPrimary,
    fontSize:   FontSize.md,
    fontWeight: FontWeight.bold,
  },
});
