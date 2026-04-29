import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HostStackParamList, HostInGameTabParamList } from '../types/navigation';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import SetupGameScreen from '../screens/host/SetupGameScreen';
import QuestionnairesScreen from '../screens/host/QuestionnairesScreen';
import GamesScreen from '../screens/host/GamesScreen';
import QuestionnaireBuilderScreen from '../screens/host/QuestionnaireBuilderScreen';
import QuestionEditorScreen from '../screens/host/QuestionEditorScreen';
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
          backgroundColor: Colors.cream,
          borderTopColor:  Colors.ink,
          borderTopWidth:  2.5,
        },
        tabBarActiveTintColor:   Colors.melon,
        tabBarInactiveTintColor: Colors.ink,
        tabBarLabelStyle: { fontSize: FontSize.xs, fontWeight: FontWeight.black as '900' },
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
        headerStyle:            { backgroundColor: Colors.cream },
        headerTintColor:        Colors.ink,
        headerTitleStyle:       { fontFamily: FontFamily.heading, fontSize: FontSize.lg, fontWeight: FontWeight.black as '900', color: Colors.ink },
        headerShadowVisible:    false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="SetupGame" component={SetupGameScreen} options={{ title: 'Host a Game' }} />
      <Stack.Screen name="Questionnaires"       component={QuestionnairesScreen}       options={{ title: 'Questionnaires' }} />
      <Stack.Screen name="Games"                component={GamesScreen}                options={{ title: 'Games' }} />
      <Stack.Screen name="QuestionnaireBuilder" component={QuestionnaireBuilderScreen} options={{ title: 'Questionnaire' }} />
      <Stack.Screen name="QuestionEditor"       component={QuestionEditorScreen}       options={{ title: 'New Question' }} />
      <Stack.Screen name="RoundsBuilder"        component={RoundsBuilderScreen}        options={{ title: 'Set Up Rounds' }} />
      <Stack.Screen name="HostLobby"            component={HostLobbyScreen}            options={{ headerShown: false }} />
      <Stack.Screen name="HostInGame"           component={HostInGameTabs}             options={{ headerShown: false }} />
      <Stack.Screen name="HostResults"          component={HostResultsScreen}          options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
