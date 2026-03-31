import 'expo-dev-client';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider } from './src/context/GameContext';
import { BleProvider } from './src/context/BleContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <BleProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </BleProvider>
      </GameProvider>
    </SafeAreaProvider>
  );
}
