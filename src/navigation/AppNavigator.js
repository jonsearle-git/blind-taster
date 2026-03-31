import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '../constants/colors';

// Screens
import HomeScreen from '../screens/HomeScreen';
// Host
import SetupGameScreen from '../screens/host/SetupGameScreen';
import QuestionnaireBuilderScreen from '../screens/host/QuestionnaireBuilderScreen';
import RoundsBuilderScreen from '../screens/host/RoundsBuilderScreen';
import HostLobbyScreen from '../screens/host/HostLobbyScreen';
import RoundMonitorScreen from '../screens/host/RoundMonitorScreen';
import HostResultsScreen from '../screens/host/HostResultsScreen';
// Player
import JoinGameScreen from '../screens/player/JoinGameScreen';
import PlayerLobbyScreen from '../screens/player/PlayerLobbyScreen';
import PlayerRoundScreen from '../screens/player/PlayerRoundScreen';
import PlayerResultsScreen from '../screens/player/PlayerResultsScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: COLORS.primaryDark },
  headerTintColor: COLORS.textPrimary,
  headerTitleStyle: { fontWeight: '600' },
  headerBackTitle: '',
  contentStyle: { backgroundColor: COLORS.background },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />

        {/* Host flow */}
        <Stack.Screen name="SetupGame" component={SetupGameScreen} options={{ title: 'Create Game' }} />
        <Stack.Screen name="QuestionnaireBuilder" component={QuestionnaireBuilderScreen} options={{ title: 'Build Questionnaire' }} />
        <Stack.Screen name="RoundsBuilder" component={RoundsBuilderScreen} options={{ title: 'Set Up Rounds' }} />
        <Stack.Screen name="HostLobby" component={HostLobbyScreen} options={{ title: 'Lobby', headerBackVisible: false }} />
        <Stack.Screen name="RoundMonitor" component={RoundMonitorScreen} options={{ title: 'Round Monitor', headerBackVisible: false }} />
        <Stack.Screen name="HostResults" component={HostResultsScreen} options={{ title: 'Results', headerBackVisible: false }} />

        {/* Player flow */}
        <Stack.Screen name="JoinGame" component={JoinGameScreen} options={{ title: 'Join Game' }} />
        <Stack.Screen name="PlayerLobby" component={PlayerLobbyScreen} options={{ title: 'Waiting for Host', headerBackVisible: false }} />
        <Stack.Screen name="PlayerRound" component={PlayerRoundScreen} options={{ title: 'Round', headerBackVisible: false }} />
        <Stack.Screen name="PlayerResults" component={PlayerResultsScreen} options={{ title: 'Results', headerBackVisible: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
