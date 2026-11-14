import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import { FavouritesProvider } from './context/FavouritesContext';
import { AuthProvider } from './context/AuthContext';
import { COLORS } from './constants/theme';

const MovieShelfTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.primary,
    background: COLORS.background,
    card: COLORS.background,
    text: COLORS.text,
    border: '#333333',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FavouritesProvider>
          <NavigationContainer theme={MovieShelfTheme}>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </FavouritesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
