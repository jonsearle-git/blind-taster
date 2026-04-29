import 'react-native-get-random-values';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { AlfaSlabOne_400Regular } from '@expo-google-fonts/alfa-slab-one';
import { Fraunces_700Bold, Fraunces_900Black } from '@expo-google-fonts/fraunces';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold, DMSans_900Black } from '@expo-google-fonts/dm-sans';
import { GameProvider } from './src/context/GameContext';
import { QuestionnairesProvider } from './src/context/QuestionnairesContext';
import { GamesProvider } from './src/context/GamesContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App(): React.ReactElement | null {
  const [fontsLoaded] = useFonts({
    AlfaSlabOne_400Regular,
    Fraunces_700Bold,
    Fraunces_900Black,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    DMSans_900Black,
  });

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <GameProvider>
        <QuestionnairesProvider>
          <GamesProvider>
            <AppNavigator />
            <StatusBar style="dark" />
          </GamesProvider>
        </QuestionnairesProvider>
      </GameProvider>
    </ErrorBoundary>
  );
}
