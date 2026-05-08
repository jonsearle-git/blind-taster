import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlayerStackParamList } from '../types/navigation';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import PlayerGameScreen from '../screens/player/PlayerGameScreen';

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
      <Stack.Screen name="PlayerGame" component={PlayerGameScreen} options={{ headerShown: false, gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
