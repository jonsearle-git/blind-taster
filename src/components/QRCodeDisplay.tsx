import { StyleSheet, View, Text, Pressable } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import { Spacing } from '../constants/spacing';

type Props = {
  roomCode: string;
};

export function QRCodeDisplay({ roomCode }: Props): React.ReactElement {
  const deepLink = `blindtaster://join/${roomCode}`;

  async function handleCopy(): Promise<void> {
    await Clipboard.setStringAsync(roomCode);
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={deepLink}
          size={180}
          color={Colors.textPrimary}
          backgroundColor={Colors.surface}
        />
      </View>

      <Pressable
        onPress={handleCopy}
        style={({ pressed }) => [styles.codeRow, pressed && styles.pressed]}
        accessibilityLabel={`Room code ${roomCode}. Tap to copy.`}
        accessibilityRole="button"
      >
        <Text style={styles.code}>{roomCode}</Text>
        <Text style={styles.copyHint}>Tap to copy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap:        Spacing.lg,
  },
  qrWrapper: {
    padding:         Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius:    Spacing.md,
    borderWidth:     1,
    borderColor:     Colors.border,
  },
  codeRow: {
    alignItems: 'center',
    gap:        Spacing.xs,
  },
  code: {
    color:         Colors.textPrimary,
    fontSize:      FontSize.hero,
    fontWeight:    FontWeight.black,
    letterSpacing: 6,
  },
  copyHint: {
    color:    Colors.textDisabled,
    fontSize: FontSize.sm,
  },
  pressed: {
    opacity: 0.7,
  },
});
