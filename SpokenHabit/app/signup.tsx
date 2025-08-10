import React, { useState } from 'react';
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

export default function SignUpScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const validateForm = () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter a password');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
                options: {
                    data: {
                        full_name: fullName.trim(),
                    },
                },
            });

            if (error) {
                Alert.alert('Sign Up Failed', error.message);
            } else {
                Alert.alert(
                    'Success!',
                    'Account created successfully! Please check your email to verify your account.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/login'),
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
            console.error('Sign up error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        router.replace('/login');
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
                            Create Account 🚀
                        </ThemedText>
                        <ThemedText style={[styles.subtitle, { color: textSecondaryColor }]}>
                            Join us to start building your speaking habits
                        </ThemedText>
                    </ThemedView>

                    {/* Form */}
                    <ThemedView style={[styles.form, { backgroundColor }]}>
                        {/* Full Name Input */}
                        <ThemedView style={[styles.inputContainer, { backgroundColor }]}>
                            <ThemedText style={[styles.inputLabel, { color: textColor }]}>
                                Full Name
                            </ThemedText>
                            <ThemedView style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor }]}>
                                <MaterialIcons name="person" size={20} color={iconColor} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.textInput, { color: textColor }]}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={textSecondaryColor}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                />
                            </ThemedView>
                        </ThemedView>

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

                        {/* Confirm Password Input */}
                        <ThemedView style={[styles.inputContainer, { backgroundColor }]}>
                            <ThemedText style={[styles.inputLabel, { color: textColor }]}>
                                Confirm Password
                            </ThemedText>
                            <ThemedView style={[styles.inputWrapper, { backgroundColor: surfaceColor, borderColor }]}>
                                <MaterialIcons name="lock" size={20} color={iconColor} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.textInput, { color: textColor }]}
                                    placeholder="Confirm your password"
                                    placeholderTextColor={textSecondaryColor}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <MaterialIcons
                                        name={showConfirmPassword ? "visibility" : "visibility-off"}
                                        size={20}
                                        color={iconColor}
                                    />
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>

                        {/* Password Requirements */}
                        <ThemedView style={[styles.passwordRequirements, { backgroundColor }]}>
                            <ThemedText style={[styles.requirementText, { color: textSecondaryColor }]}>
                                • Password must be at least 6 characters long
                            </ThemedText>
                            <ThemedText style={[styles.requirementText, { color: textSecondaryColor }]}>
                                • Use a mix of letters, numbers, and symbols for better security
                            </ThemedText>
                        </ThemedView>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signUpButton, { backgroundColor: tintColor }]}
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={Colors.light.surface} size="small" />
                            ) : (
                                <ThemedText style={[styles.signUpButtonText, { color: Colors.light.surface }]}>
                                    Create Account
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

                        {/* Social Sign Up Options */}
                        <TouchableOpacity
                            style={[styles.socialButton, { backgroundColor: surfaceColor, borderColor }]}
                            onPress={() => Alert.alert('Coming Soon', 'Google sign-up will be available soon')}
                        >
                            <MaterialIcons name="account-circle" size={24} color={iconColor} />
                            <ThemedText style={[styles.socialButtonText, { color: textColor }]}>
                                Continue with Google
                            </ThemedText>
                        </TouchableOpacity>

                        {/* Terms and Privacy */}
                        <ThemedView style={[styles.termsSection, { backgroundColor }]}>
                            <ThemedText style={[styles.termsText, { color: textSecondaryColor }]}>
                                By creating an account, you agree to our{' '}
                            </ThemedText>
                            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Terms of Service will be available soon')}>
                                <ThemedText style={[styles.termsLink, { color: tintColor }]}>
                                    Terms of Service
                                </ThemedText>
                            </TouchableOpacity>
                            <ThemedText style={[styles.termsText, { color: textSecondaryColor }]}>
                                {' '}and{' '}
                            </ThemedText>
                            <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Privacy Policy will be available soon')}>
                                <ThemedText style={[styles.termsLink, { color: tintColor }]}>
                                    Privacy Policy
                                </ThemedText>
                            </TouchableOpacity>
                        </ThemedView>

                        {/* Login Link */}
                        <ThemedView style={[styles.loginSection, { backgroundColor }]}>
                            <ThemedText style={[styles.loginText, { color: textSecondaryColor }]}>
                                Already have an account?{' '}
                            </ThemedText>
                            <TouchableOpacity onPress={handleLogin}>
                                <ThemedText style={[styles.loginLink, { color: tintColor }]}>
                                    Sign In
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
        marginBottom: 32,
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
    passwordRequirements: {
        gap: 4,
        marginTop: -12,
    },
    requirementText: {
        fontSize: 12,
        lineHeight: 16,
    },
    signUpButton: {
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
    signUpButtonText: {
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
    termsSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        paddingHorizontal: 16,
    },
    termsText: {
        fontSize: 14,
        textAlign: 'center',
    },
    termsLink: {
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    loginSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 24,
    },
    loginText: {
        fontSize: 16,
    },
    loginLink: {
        fontSize: 16,
        fontWeight: '600',
    },
});
