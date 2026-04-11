import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import { QuestionnairesProvider } from './src/context/QuestionnairesContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App(): React.ReactElement {
  return (
    <GameProvider>
      <QuestionnairesProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </QuestionnairesProvider>
    </GameProvider>
  );
}
