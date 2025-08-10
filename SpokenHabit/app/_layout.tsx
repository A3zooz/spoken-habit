import { AuthContext, AuthProvider } from '@/utils/authContext';
import {
    ThemeProvider,
    DarkTheme,
    DefaultTheme,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }
    console.log('Fonts loaded successfully');
    // if (!authContext.isReady) {
    //     // If auth state is not ready, we can show a loading indicator or similar
    //     return null; // or a loading component
    // }
    // if (!authContext.isAuthenticated) {
    //     // If the user is not authenticated, redirect to login
    //     <Redirect href="/login" />;
    // }
    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider
                    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <Stack initialRouteName='(protected)'>
                        <Stack.Screen
                            name="(protected)"
                            options={{ headerShown: false, animation: 'none' }}
                        />
                        <Stack.Screen
                            name="index"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="login"
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="signup"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                </ThemeProvider>
            </GestureHandlerRootView>
        </AuthProvider>
    );
}
