import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
    AudioModule,
    setAudioModeAsync,
} from 'expo-audio';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { supabase } from '@/utils/supabase';

type ActionType = 'add_habit' | 'add_task';

interface UseVoiceCommandsProps {
    actionType: ActionType;
    onSuccess?: () => void;
}

export const useVoiceCommands = ({ actionType, onSuccess }: UseVoiceCommandsProps) => {
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [realtimeTranscription, setRealtimeTranscription] = useState('');
    const [editableCommand, setEditableCommand] = useState('');

    useEffect(() => {
        setupAudio();
        requestSpeechPermissions();
    }, []);

    const setupAudio = async () => {
        try {
            await AudioModule.requestRecordingPermissionsAsync();
            await setAudioModeAsync({
                allowsRecording: true,
                playsInSilentMode: true,
            });
        } catch (error) {
            console.error('Error setting up audio:', error);
        }
    };

    useSpeechRecognitionEvent('start', () => {
        console.log('Speech started');
    });

    useSpeechRecognitionEvent('end', () => {
        console.log('Speech ended');
        setIsListening(false);
    });

    useSpeechRecognitionEvent('error', (error) => {
        console.error('Speech recognition error:', error);
    });

    useSpeechRecognitionEvent('result', (result) => {
        const transcript = result.results[0]?.transcript || '';
        setRealtimeTranscription(transcript);
        console.log('Speech recognition result:', result);
        if (result.isFinal) {
            setTranscription(transcript);
            setEditableCommand(transcript);
            setIsListening(false);
        }
    });

    const requestSpeechPermissions = async () => {
        try {
            const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!result.granted) {
                Alert.alert(
                    'Permission Required',
                    'Speech recognition permission is required for voice commands.'
                );
            }
        } catch (error) {
            console.error('Error requesting speech permissions:', error);
        }
    };

    const handleSubmission = async (command: string) => {
        if (command.trim()) {
            try {
                const user = await supabase.auth.getUser();
                const userId = user?.data.user?.id || null;

                const { data } = await supabase.functions.invoke('voice-worker', {
                    body: {
                        transcription: command,
                        userId: userId,
                        action: actionType,
                    },
                });
                
                console.log('Function response:', data);
                if (data) {
                    onSuccess?.();
                    console.log('Command processed successfully');
                }
                
                setTranscription('');
                setEditableCommand('');
                setRealtimeTranscription('');
            } catch (error) {
                console.error('Error processing command:', error);
                Alert.alert('Error', 'Failed to process command.');
                throw error;
            }
        }
    };

    const startListening = async () => {
        if (isListening) {
            await ExpoSpeechRecognitionModule.stop();
            setIsListening(false);
        } else {
            try {
                setIsProcessing(true);
                setRealtimeTranscription('');
                setEditableCommand('');
                setIsListening(true);
                await ExpoSpeechRecognitionModule.start({
                    lang: 'en-US',
                    interimResults: true,
                    maxAlternatives: 1,
                    continuous: false,
                    requiresOnDeviceRecognition: false,
                });
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                Alert.alert(
                    'Error',
                    'Failed to start speech recognition. Please try again.'
                );
                setIsListening(false);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const stopListening = async () => {
        if (isListening) {
            await ExpoSpeechRecognitionModule.stop();
            setIsListening(false);
        }
    };

    const resetState = () => {
        setTranscription('');
        setEditableCommand('');
        setRealtimeTranscription('');
    };

    return {
        isListening,
        isProcessing,
        transcription,
        realtimeTranscription,
        editableCommand,
        setEditableCommand,
        handleSubmission,
        startListening,
        stopListening,
        resetState,
    };
};
