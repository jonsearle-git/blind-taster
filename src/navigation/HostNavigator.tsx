import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HostStackParamList } from '../types/navigation';
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
import HostResultsScreen from '../screens/host/HostResultsScreen';

const Stack = createNativeStackNavigator<HostStackParamList>();

export function HostNavigator(): React.ReactElement {
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
      <Stack.Screen name="SetupGame"            component={SetupGameScreen}            options={{ title: 'Host a Game' }} />
      <Stack.Screen name="Questionnaires"       component={QuestionnairesScreen}       options={{ title: 'Questionnaires' }} />
      <Stack.Screen name="Games"                component={GamesScreen}                options={{ title: 'Games' }} />
      <Stack.Screen name="QuestionnaireBuilder" component={QuestionnaireBuilderScreen} options={{ title: 'Questionnaire' }} />
      <Stack.Screen name="QuestionEditor"       component={QuestionEditorScreen}       options={{ title: 'New Question' }} />
      <Stack.Screen name="RoundsBuilder"        component={RoundsBuilderScreen}        options={{ title: 'Set Up Rounds' }} />
      <Stack.Screen name="HostLobby"            component={HostLobbyScreen}            options={{ title: 'Start Game', gestureEnabled: false }} />
      {/* detachPreviousScreen keeps HostLobbyScreen mounted (and its socket alive) while in-game */}
      <Stack.Screen name="HostInGame"           component={HostRoundScreen}            options={{ headerShown: false, gestureEnabled: false, ...{ detachPreviousScreen: false } }} />
      <Stack.Screen name="HostResults"          component={HostResultsScreen}          options={{ headerShown: false, gestureEnabled: false, ...{ detachPreviousScreen: false } }} />
    </Stack.Navigator>
  );
}
