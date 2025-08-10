import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/utils/authContext';

export default function LandingPage() {
    const router = useRouter();
    const authContext = useContext(AuthContext);
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
                <Text style={styles.title}>Loading...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>SpokenHabit</Text>
                <Text style={styles.subtitle}>
                    Tracking your habits has never been easier
                </Text>
                <Text style={styles.description}>
                    Speak your goals and let us help you achieve them.
                </Text>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/signup')}
                >
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.secondaryButtonText}>Sign Up</Text>
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
    },
    description: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
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
