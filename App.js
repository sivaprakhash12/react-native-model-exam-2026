import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import RootNavigator from './src/navigation/RootNavigator';
import { Toast } from './src/components/Toast';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer documentTitle={{ formatter: () => 'Grocery App' }}>
          <StatusBar style="dark" />
          <RootNavigator />
          <Toast />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
