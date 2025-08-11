import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/utils/authContext';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
export default function LandingPage() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const backgroundColor = useThemeColor(
        { light: Colors.light.background, dark: Colors.dark.background },
        'background'
    );
    const surfaceColor = useThemeColor(
        { light: Colors.light.surface, dark: Colors.dark.surface },
        'surface'
    );
    const textColor = useThemeColor(
        { light: Colors.light.text, dark: Colors.dark.text },
        'text'
    );
    const textSecondaryColor = useThemeColor(
        { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary },
        'textSecondary'
    );
    const tintColor = useThemeColor(
        { light: Colors.light.tint, dark: Colors.dark.tint },
        'tint'
    );
    const iconColor = useThemeColor(
        { light: Colors.light.icon, dark: Colors.dark.icon },
        'icon'
    );
    const borderColor = useThemeColor(
        { light: Colors.light.border, dark: Colors.dark.border },
        'border'
    );
    useEffect(() => {
        if (authContext?.isReady) {
            if (authContext.isAuthenticated) {
                // User is authenticated, redirect to protected area
                router.replace('/(protected)/(tabs)/todos');
            }
            // If not authenticated, stay on landing page
        }
    }, [authContext?.isReady, authContext?.isAuthenticated]);
    if (!authContext?.isReady) {
        return (
            <View style={[styles.container, { justifyContent: 'center' }]}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.loadingIcon}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>SpokenHabit</Text>
                <Text style={styles.subtitle}>
                    Tracking your habits has never been easier
                </Text>
                <Text style={styles.description}>
                    Speak your goals and let us help you achieve them.
                </Text>

                <TouchableOpacity
                    style={[
                        styles.primaryButton,
                        { backgroundColor: tintColor },
                    ]}
                    onPress={() => router.push('/signup')}
                >
                    <Text style={styles.primaryButtonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.secondaryButton,
                        { borderColor: borderColor },
                    ]}
                    onPress={() => router.push('/login')}
                >
                    <Text
                        style={[
                            styles.secondaryButtonText,
                            { color: textColor },
                        ]}
                    >
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    loadingIcon: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    primaryButton: {
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 15,
        width: '100%',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    secondaryButton: {
        borderWidth: 1,
        borderColor: '#007AFF',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 8,
        width: '100%',
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});
