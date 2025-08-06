import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useContext } from 'react';
import { AuthContext } from '@/utils/authContext';

export default function ProtectedLayout() {
  const authContext = useContext(AuthContext) || {
    login: async () => {},
    logout: async () => {},
    isAuthenticated: false,
  };
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  if(!authContext.isReady) {
    // If auth state is not ready, we can show a loading indicator or similar
    return null; // or a loading component
  }
  if(!authContext.isAuthenticated) {
    // If the user is not authenticated, redirect to login
    <Redirect href="/login" />
  }



  return (
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}
