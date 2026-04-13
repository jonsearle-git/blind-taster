import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import { QuestionnairesProvider } from './src/context/QuestionnairesContext';
import { GamesProvider } from './src/context/GamesContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';

export default function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <GameProvider>
        <QuestionnairesProvider>
          <GamesProvider>
            <AppNavigator />
            <StatusBar style="light" />
          </GamesProvider>
        </QuestionnairesProvider>
      </GameProvider>
    </ErrorBoundary>
  );
}
