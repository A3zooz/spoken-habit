import React from 'react';
import {
    Modal,
    TouchableOpacity,
    TextInput,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface VoiceModalProps {
    visible: boolean;
    isListening: boolean;
    isProcessing: boolean;
    realtimeTranscription: string;
    editableCommand: string;
    onClose: () => void;
    onMicPress: () => void;
    onConfirm: () => void;
    onEditableCommandChange: (text: string) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const VoiceModal: React.FC<VoiceModalProps> = ({
    visible,
    isListening,
    isProcessing,
    realtimeTranscription,
    editableCommand,
    onClose,
    onMicPress,
    onConfirm,
    onEditableCommandChange,
}) => {
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
    const borderColor = useThemeColor(
        { light: Colors.light.border, dark: Colors.dark.border },
        'border'
    );

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <ThemedView style={styles.modalOverlay}>
                <ThemedView
                    style={[
                        styles.modalContainer,
                        {
                            backgroundColor: surfaceColor,
                            borderColor: borderColor,
                        },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <MaterialIcons name="close" size={24} color={textColor} />
                    </TouchableOpacity>

                    <ThemedText
                        type="title"
                        style={[styles.modalTitle, { color: textColor }]}
                    >
                        Voice Command
                    </ThemedText>

                    <TouchableOpacity
                        style={[
                            styles.modalMicButton,
                            {
                                backgroundColor: isListening
                                    ? Colors.light.error
                                    : tintColor,
                            },
                        ]}
                        onPress={onMicPress}
                        disabled={isProcessing}
                    >
                        <MaterialIcons
                            name={isListening ? 'stop' : 'mic'}
                            size={32}
                            color="white"
                        />
                    </TouchableOpacity>

                    <ThemedView
                        style={[
                            styles.transcriptionContainer,
                            {
                                backgroundColor: backgroundColor,
                                borderColor: borderColor,
                            },
                        ]}
                    >
                        <ThemedText
                            style={[
                                styles.transcriptionLabel,
                                { color: textColor },
                            ]}
                        >
                            Live Transcription:
                        </ThemedText>
                        <ThemedText
                            style={[
                                styles.transcriptionText,
                                { color: textSecondaryColor },
                            ]}
                        >
                            {realtimeTranscription || 'Tap the microphone to start...'}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.editSection}>
                        <ThemedText
                            style={[styles.editLabel, { color: textColor }]}
                        >
                            Edit Command:
                        </ThemedText>
                        <TextInput
                            style={[
                                styles.commandInput,
                                {
                                    borderColor: borderColor,
                                    backgroundColor: backgroundColor,
                                    color: textColor,
                                },
                            ]}
                            value={editableCommand}
                            onChangeText={onEditableCommandChange}
                            placeholder="Your voice command will appear here..."
                            placeholderTextColor={textSecondaryColor}
                            multiline
                        />
                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                {
                                    backgroundColor: tintColor,
                                    opacity: editableCommand.trim() ? 1 : 0.5,
                                },
                            ]}
                            onPress={onConfirm}
                            disabled={!editableCommand.trim()}
                        >
                            <ThemedText
                                style={[
                                    styles.confirmButtonText,
                                    { color: 'white' },
                                ]}
                            >
                                Confirm Command
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        width: screenWidth - 40,
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        elevation: 10,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    modalTitle: {
        textAlign: 'center',
        marginBottom: 24,
        fontSize: 20,
        fontWeight: 'bold',
    },
    transcriptionContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        minHeight: 80,
    },
    transcriptionLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    transcriptionText: {
        fontSize: 16,
        lineHeight: 22,
        minHeight: 22,
    },
    modalMicButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        elevation: 6,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    editSection: {
        marginTop: 16,
    },
    editLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    commandInput: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    confirmButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
