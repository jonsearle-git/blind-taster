import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HostStackParamList } from '../types/navigation';
import { Colors } from '../constants/colors';
import { FontFamily, FontSize, FontWeight } from '../constants/typography';
import QuestionnairesScreen from '../screens/host/QuestionnairesScreen';
import QuestionPickerScreen from '../screens/host/QuestionPickerScreen';
import HostGameScreen from '../screens/host/HostGameScreen';

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
      <Stack.Screen name="Questionnaires" component={QuestionnairesScreen} options={{ title: 'Games' }} />
      <Stack.Screen name="QuestionPicker" component={QuestionPickerScreen} options={{ title: 'Set Up Game' }} />
      <Stack.Screen name="HostGame"       component={HostGameScreen}       options={{ headerShown: false, gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
