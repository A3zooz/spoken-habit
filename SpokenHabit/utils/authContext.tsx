type AuthState = {
    isAuthenticated: boolean;
    user: {
        id: string;
        email: string;
    } | null;
    isReady: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
};

import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from 'react';
import { supabase } from './supabase';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isReanimated3 } from 'react-native-reanimated';
export const AuthContext = createContext<AuthState>({
    isAuthenticated: false,
    user: null,
    isReady: false,
    token: null,
    login: async () => {},
    logout: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ id: string; email: string } | null>(
        null
    );
    const [token, setToken] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const getAuthState = async () => {
            try {
                const storedState = await AsyncStorage.getItem('authState');
                if (storedState) {
                    const parsedState = JSON.parse(storedState);
                    setIsAuthenticated(parsedState.isAuthenticated);
                    setUser(parsedState.user);
                    setToken(parsedState.token);
                }
            } catch (error) {
                console.error('Error retrieving auth state:', error);
            }
            setIsReady(true);
        };
        getAuthState();
    }, []);

    const storeAuthState = async (newState: {
        isAuthenticated: boolean;
        user: { id: string; email: string } | null;
        token: string | null;
    }) => {
        try {
            await AsyncStorage.setItem('authState', JSON.stringify(newState));
        } catch (error) {
            console.error('Error storing auth state:', error);
        }
    };

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        });
        if (error) {
            throw new Error(error.message);
        }
        setIsAuthenticated(true);
        setUser({
            id: data.user.id,
            email: data.user.email || '',
        });
        setToken(data.session?.access_token || null);
        await storeAuthState({
            isAuthenticated: true,
            user: {
                id: data.user.id,
                email: data.user.email || '',
            },
            token: data.session?.access_token || null,
        });
        console.log('Login successful:', data);
        // Navigate to the main app or perform any other actions after login
        // For example, you can use a navigation library to redirect the user
        router.replace('/(protected)/(tabs)/todos');
    };
    const logout = () => {
        supabase.auth.signOut().then(() => {
            setIsAuthenticated(false);
            setUser(null);
            setToken(null);
            AsyncStorage.removeItem('authState');
        });
    };
    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isReady, user, token, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}
