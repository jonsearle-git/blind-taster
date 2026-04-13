import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HostStackParamList, HostInGameTabParamList } from '../types/navigation';
import { Colors } from '../constants/colors';
import { FontSize, FontWeight } from '../constants/typography';
import SetupGameScreen from '../screens/host/SetupGameScreen';
import QuestionnairesScreen from '../screens/host/QuestionnairesScreen';
import GamesScreen from '../screens/host/GamesScreen';
import QuestionnaireBuilderScreen from '../screens/host/QuestionnaireBuilderScreen';
import RoundsBuilderScreen from '../screens/host/RoundsBuilderScreen';
import HostLobbyScreen from '../screens/host/HostLobbyScreen';
import HostRoundScreen from '../screens/host/HostRoundScreen';
import HostPlayersScreen from '../screens/host/HostPlayersScreen';
import HostLeaderboardScreen from '../screens/host/HostLeaderboardScreen';
import HostResultsScreen from '../screens/host/HostResultsScreen';

const Stack = createNativeStackNavigator<HostStackParamList>();
const Tab   = createBottomTabNavigator<HostInGameTabParamList>();

function HostInGameTabs(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor:  Colors.border,
        },
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.textDisabled,
        tabBarLabelStyle: { fontSize: FontSize.xs },
      }}
    >
      <Tab.Screen name="HostRound"       component={HostRoundScreen}       options={{ title: 'Round' }} />
      <Tab.Screen name="HostPlayers"     component={HostPlayersScreen}     options={{ title: 'Players' }} />
      <Tab.Screen name="HostLeaderboard" component={HostLeaderboardScreen} options={{ title: 'Scores' }} />
    </Tab.Navigator>
  );
}

export function HostNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle:      { backgroundColor: Colors.surface },
        headerTintColor:  Colors.textPrimary,
        headerTitleStyle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="SetupGame"            component={SetupGameScreen}            options={{ title: 'Host a Game' }} />
      <Stack.Screen name="Questionnaires"       component={QuestionnairesScreen}       options={{ title: 'Questionnaires' }} />
      <Stack.Screen name="Games"                component={GamesScreen}                options={{ title: 'Games' }} />
      <Stack.Screen name="QuestionnaireBuilder" component={QuestionnaireBuilderScreen} options={{ title: 'Questionnaire' }} />
      <Stack.Screen name="RoundsBuilder"        component={RoundsBuilderScreen}        options={{ title: 'Set Up Rounds' }} />
      <Stack.Screen name="HostLobby"            component={HostLobbyScreen}            options={{ headerShown: false }} />
      <Stack.Screen name="HostInGame"           component={HostInGameTabs}             options={{ headerShown: false }} />
      <Stack.Screen name="HostResults"          component={HostResultsScreen}          options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
