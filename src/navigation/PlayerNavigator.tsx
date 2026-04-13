import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayerStackParamList } from '../types/navigation';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import JoinGameScreen from '../screens/player/JoinGameScreen';
import PlayerLobbyScreen from '../screens/player/PlayerLobbyScreen';
import PlayerRoundScreen from '../screens/player/PlayerRoundScreen';
import PlayerResultsScreen from '../screens/player/PlayerResultsScreen';

const Stack = createNativeStackNavigator<PlayerStackParamList>();

export function PlayerNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:      { backgroundColor: Colors.surface },
        headerTintColor:  Colors.textPrimary,
        headerTitleStyle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="JoinGame"      component={JoinGameScreen}      options={{ title: 'Join Game' }} />
      <Stack.Screen name="PlayerLobby"   component={PlayerLobbyScreen}   options={{ headerShown: false }} />
      <Stack.Screen name="PlayerRound"   component={PlayerRoundScreen}   options={{ headerShown: false }} />
      <Stack.Screen name="PlayerResults" component={PlayerResultsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
