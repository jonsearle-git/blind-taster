import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayerStackParamList } from '../types/navigation';
import JoinGameScreen from '../screens/player/JoinGameScreen';
import PlayerLobbyScreen from '../screens/player/PlayerLobbyScreen';
import PlayerRoundScreen from '../screens/player/PlayerRoundScreen';
import PlayerResultsScreen from '../screens/player/PlayerResultsScreen';

const Stack = createNativeStackNavigator<PlayerStackParamList>();

export function PlayerNavigator(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JoinGame"      component={JoinGameScreen} />
      <Stack.Screen name="PlayerLobby"   component={PlayerLobbyScreen} />
      <Stack.Screen name="PlayerRound"   component={PlayerRoundScreen} />
      <Stack.Screen name="PlayerResults" component={PlayerResultsScreen} />
    </Stack.Navigator>
  );
}
