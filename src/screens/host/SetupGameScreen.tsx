import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { FontSize, FontWeight, FontFamily } from '../../constants/typography';
import { Spacing, BorderRadius } from '../../constants/spacing';
import { HostStackParamList } from '../../types/navigation';
import { Monogram } from '../../components/brand/Monogram';

type Nav = NativeStackNavigationProp<HostStackParamList>;

export default function SetupGameScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.getParent()?.goBack()}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={28} color={Colors.ink} />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <Monogram size={88} />
          <Text style={styles.heroTitle}>Host a Game</Text>
          <Text style={styles.heroSub}>Manage your questionnaires and saved games</Text>
        </View>

        {/* Questionnaires tile */}
        <View style={styles.tileShadowWrap}>
          <View style={styles.tileShadow} />
          <Pressable
            onPress={() => navigation.navigate('Questionnaires')}
            style={({ pressed }) => [styles.tile, styles.tileMelon, pressed && styles.tilePressed]}
            accessibilityRole="button"
            accessibilityLabel="Questionnaires"
          >
            <View style={styles.tileIcon}>
              <Text style={styles.tileIconText}>≡</Text>
            </View>
            <View style={styles.tileText}>
              <Text style={[styles.tileName, { color: Colors.cream }]}>Questionnaires</Text>
              <Text style={[styles.tileSub, { color: Colors.cream }]}>Build your taste-test forms</Text>
            </View>
          </Pressable>
        </View>

        {/* Games tile */}
        <View style={styles.tileShadowWrap}>
          <View style={styles.tileShadow} />
          <Pressable
            onPress={() => navigation.navigate('Games')}
            style={({ pressed }) => [styles.tile, styles.tileMint, pressed && styles.tilePressed]}
            accessibilityRole="button"
            accessibilityLabel="Games"
          >
            <View style={styles.tileIcon}>
              <Text style={styles.tileIconText}>⬡</Text>
            </View>
            <View style={styles.tileText}>
              <Text style={[styles.tileName, { color: Colors.ink }]}>Games</Text>
              <Text style={[styles.tileSub, { color: Colors.ink }]}>Pick a game and start hosting</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: Colors.cream },
  container:     { flex: 1, padding: Spacing.lg, justifyContent: 'center', gap: Spacing.lg },
  hero:          { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  heroTitle:     { fontFamily: FontFamily.display, color: Colors.ink, fontSize: FontSize.xxl, fontWeight: FontWeight.black, letterSpacing: -0.5 },
  heroSub:       { color: Colors.ink, fontSize: FontSize.md, opacity: 0.7, textAlign: 'center' },
  tileShadowWrap:{ position: 'relative' },
  tileShadow:    { position: 'absolute', top: 6, left: 6, right: -6, bottom: -6, borderRadius: BorderRadius.lg, backgroundColor: Colors.ink },
  tile:          { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg, borderRadius: BorderRadius.lg, borderWidth: 2.5, borderColor: Colors.ink },
  tileMelon:     { backgroundColor: Colors.melon },
  tileMint:      { backgroundColor: Colors.mint },
  tilePressed:   { opacity: 0.85 },
  tileIcon:      { width: 56, height: 56, borderRadius: BorderRadius.sm, backgroundColor: Colors.cream, borderWidth: 2.5, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.ink, shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  tileIconText:  { color: Colors.ink, fontSize: FontSize.xxl, fontWeight: FontWeight.black },
  tileText:      { flex: 1, gap: 4 },
  tileName:      { fontFamily: FontFamily.display, fontSize: FontSize.xl, fontWeight: FontWeight.black, letterSpacing: -0.3, textTransform: 'uppercase' },
  tileSub:       { fontSize: FontSize.sm, opacity: 0.85 },
});
