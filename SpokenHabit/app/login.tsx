import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Alert,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/utils/supabase';
import { AuthContext } from '@/utils/authContext';

export default function LoginScreen() {
    const authcontext = useContext(AuthContext) || {
        login: async () => {},
        logout: async () => {},
    };
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Use consistent color palette
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

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            await authcontext.login(email.trim(), password)
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    const handleForgotPassword = () => {
        if (!email.trim()) {
            Alert.alert('Email Required', 'Please enter your email address first');
            return;
        }

        Alert.alert(
            'Reset Password',
            `Send password reset instructions to ${email}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Send',
                    onPress: async () => {
                        try {
                            const { error } = await supabase.auth.resetPasswordForEmail(email);
                            if (error) {
                                Alert.alert('Error', error.message);
                            } else {
                                Alert.alert('Success', 'Password reset instructions sent to your email');
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to send reset instructions');
                        }
                    },
                },
            ]
        );
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <ThemedView style={[styles.header, { backgroundColor }]}>
                    <TouchableOpacity
                        style={[styles.backButton, { borderColor: borderColor }]}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={iconColor} />
                    </TouchableOpacity>
                </ThemedView>

                {/* Main Content */}
                <ThemedView style={[styles.content, { backgroundColor }]}>
                    {/* Logo/Title Section */}
                    <ThemedView style={[styles.titleSection, { backgroundColor }]}>
                        <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                            Welcome Back! 👋
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: textSecondaryColor }]}>
                            Sign in to continue building your speaking habits
                        </ThemedText>
                    </ThemedView>

                    {/* Form */}
                    <ThemedView style={[styles.form, { backgroundColor }]}>
                        {/* Email Input */}
                        <ThemedView style={[styles.inputContainer, { backgroundColor }]}>
                            <ThemedText style={[styles.inputLabel, { color: textColor }]}>
                                Email
                            </ThemedText>
                            <ThemedView style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor }]}>
                                <MaterialIcons name="email" size={20} color={iconColor} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.textInput, { color: textColor }]}
                                    placeholder="Enter your email"
                                    placeholderTextColor={textSecondaryColor}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </ThemedView>
                        </ThemedView>

                        {/* Password Input */}
                        <ThemedView style={[styles.inputContainer, { backgroundColor }]}>
                            <ThemedText style={[styles.inputLabel, { color: textColor }]}>
                                Password
                            </ThemedText>
                            <ThemedView style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor }]}>
                                <MaterialIcons name="lock" size={20} color={iconColor} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.textInput, { color: textColor }]}
                                    placeholder="Enter your password"
                                    placeholderTextColor={textSecondaryColor}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <MaterialIcons
                                        name={showPassword ? "visibility" : "visibility-off"}
                                        size={20}
                                        color={iconColor}
                                    />
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>

                        {/* Forgot Password */}
                        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
                            <ThemedText style={[styles.forgotPasswordText, { color: tintColor }]}>
                                Forgot Password?
                            </ThemedText>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, { backgroundColor: tintColor }]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.light.surface} size="small" />
                            ) : (
                                <ThemedText style={[styles.loginButtonText, { color: Colors.light.surface }]}>
                                    Sign In
                                </ThemedText>
                            )}
                        </TouchableOpacity>

                        {/* Divider */}
                        <ThemedView style={[styles.divider, { backgroundColor }]}>
                            <ThemedView style={[styles.dividerLine, { backgroundColor: borderColor }]} />
                            <ThemedText style={[styles.dividerText, { color: textSecondaryColor }]}>
                                or
                            </ThemedText>
                            <ThemedView style={[styles.dividerLine, { backgroundColor: borderColor }]} />
                        </ThemedView>

                        {/* Social Login Options */}
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: surfaceColor, borderColor }]}
                            onPress={() => Alert.alert('Coming Soon', 'Google sign-in will be available soon')}
                        >
                            <MaterialIcons name="account-circle" size={24} color={iconColor} />
                            <ThemedText style={[styles.socialButtonText, { color: textColor }]}>
                                Continue with Google
                            </ThemedText>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <ThemedView style={[styles.signUpSection, { backgroundColor }]}>
                            <ThemedText style={[styles.signUpText, { color: textSecondaryColor }]}>
                                Don't have an account?{' '}
                            </ThemedText>
                            <TouchableOpacity onPress={handleSignUp}>
                                <ThemedText style={[styles.signUpLink, { color: tintColor }]}>
                                    Sign Up
                                </ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    titleSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    inputIcon: {
        marginRight: 4,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 4,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -8,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loginButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
        gap: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        fontSize: 14,
        fontWeight: '500',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    signUpSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 24,
    },
    signUpText: {
        fontSize: 16,
    },
    signUpLink: {
        fontSize: 16,
        fontWeight: '600',
    },
});
