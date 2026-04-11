import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types/navigation';
import { HostNavigator } from './HostNavigator';
import { PlayerNavigator } from './PlayerNavigator';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const prefix = Linking.createURL('/');

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'blindtaster://'],
  config: {
    screens: {
      Home:   '',
      Host:   'host',
      Player: {
        screens: {
          JoinGame:      'join/:roomCode',
          PlayerLobby:   'lobby',
          PlayerRound:   'round',
          PlayerResults: 'results',
        },
      },
    },
  },
};

export function AppNavigator(): React.ReactElement {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home"   component={HomeScreen} />
        <Stack.Screen name="Host"   component={HostNavigator} />
        <Stack.Screen name="Player" component={PlayerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
