import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayerStackParamList } from '../types/navigation';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import JoinGameScreen from '../screens/player/JoinGameScreen';
import PlayerLobbyScreen from '../screens/player/PlayerLobbyScreen';
import PlayerRoundScreen from '../screens/player/PlayerRoundScreen';
import PlayerResultsScreen from '../screens/player/PlayerResultsScreen';

const Stack = createNativeStackNavigator<PlayerStackParamList>();

export function PlayerNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:                 { backgroundColor: Colors.cream },
        headerTintColor:             Colors.ink,
        headerTitleStyle:            { fontFamily: FontFamily.heading, fontSize: FontSize.lg, fontWeight: FontWeight.black as '900', color: Colors.ink },
        headerTitleAlign:            'center',
        headerShadowVisible:         false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="JoinGame"      component={JoinGameScreen}      options={{ title: 'Join Game' }} />
      {/* detachPreviousScreen keeps JoinGameScreen mounted (and its socket alive) while in-game */}
      <Stack.Screen name="PlayerLobby"   component={PlayerLobbyScreen}   options={{ headerShown: false, gestureEnabled: false, ...{ detachPreviousScreen: false } }} />
      <Stack.Screen name="PlayerRound"   component={PlayerRoundScreen}   options={{ headerShown: false, gestureEnabled: false, ...{ detachPreviousScreen: false } }} />
      <Stack.Screen name="PlayerResults" component={PlayerResultsScreen} options={{ headerShown: false, gestureEnabled: false, ...{ detachPreviousScreen: false } }} />
    </Stack.Navigator>
  );
}
