//import styles
import { StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import { supabase } from '@/utils/supabase';
import { Habit, Task } from '@/utils/supabase';
import {
    useAudioRecorder,
    AudioModule,
    RecordingPresets,
    setAudioModeAsync,
    useAudioRecorderState,
} from 'expo-audio';
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from 'expo-speech-recognition';




export default function Home() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcription, setTranscription] = useState('');

    const micButtonColor = useThemeColor(
        { light: '#A1CEDC', dark: '#1D3D47' },
        'tint'
    );
    const micButtonTextColor = useThemeColor(
        { light: '#FFFFFF', dark: '#FFFFFF' },
        'text'
    );

    useEffect(() => {
        console.log('HomeScreen component is rendering!'); // Debug log

        fetchHabits();
        fetchTasks();
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
        // handleSubmission();
    });
    useSpeechRecognitionEvent('error', (error) => {
        console.error('Speech recognition error:', error);
    });

    useSpeechRecognitionEvent('result', (result) => {
        if(result.isFinal)
        {
            setTranscription(result.results[0]?.transcript || '');
            handleSubmission(result.results[0]?.transcript || '');
        }
    });

    const handleSubmission = async (transcription: string) => {
        if (transcription.trim()) {
            Alert.alert('Transcription', transcription, [
                {
                    text: 'OK',
                    onPress: async () => {
                        const { data, error } = await supabase.functions.invoke('voice-worker', {
                            body: { transcription: transcription },
                        });
                        console.log('Function response:', data);
                        if(data){
                            addToDatabase(data);
                        }
                        if (error) {
                            console.error('Error invoking function:', error);
                            Alert.alert('Error', 'Failed to process voice command.');
                        }
                        setTranscription('');
                        setIsListening(false);
                    }
                }
            ]);
        }
    }

    const addToDatabase = async (data: any) => {
        if (data.action === 'add_habit') {
            const { habit } = data;
            const { error } = await supabase.from('habits').insert([habit]);
            if (error) {
                console.error('Error adding habit:', error);
            }
        }
        else if (data.action === 'add_task') {
            const { task } = data;
            const { error } = await supabase.from('tasks').insert([task]);
            if (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const handleStart = async () => {
        const result =
            await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
            console.warn('Permissions not granted', result);
            return;
        }
        // Start speech recognition
        ExpoSpeechRecognitionModule.start({
            lang: 'en-US',
            interimResults: true,
            continuous: false,
        });
    };
    const requestSpeechPermissions = async () => {
        try {
            const result =
                await ExpoSpeechRecognitionModule.requestPermissionsAsync();
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
    const fetchHabits = async () => {
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching habits:', error);
        } else {
            setHabits(data || []);
        }
    };

    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            setTasks(data || []);
        }
    };
    const toggleHabit = (id: number) => {
        setHabits((prevHabits) =>
            prevHabits.map((habit) =>
                habit.id === id ? { ...habit, completed: !habit.completed } : habit
            )
        );
    };

    const toggleTask = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleMicPress = async () => {
        if (isListening) {
            await ExpoSpeechRecognitionModule.stop();
            if (transcription.trim()) {
                Alert.alert('Transcription', transcription, [
                    {
                        text: 'OK',
                        onPress: () => console.log('OK Pressed'),
                    },
                ]);
            }
            setIsListening(false);
        } else {
            try {
                setIsProcessing(true);
                setTranscription('');
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
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedView style={styles.greeting}>
                    <ThemedText type="title">Hello, User!</ThemedText>
                    <ThemedText type="subtitle">
                        Here's your daily overview
                    </ThemedText>
                </ThemedView>
            </ThemedView>
            <ScrollView style={styles.mainContent}>
                <ThemedView style={styles.habitsContainer}>
                    <ThemedText type="title">Habits</ThemedText>
                    {habits.map((habit) => (
                        <ThemedView key={habit.id} style={styles.habitItem}>
                            <ThemedText>{habit.name}</ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>
                <ThemedView style={styles.tasksContainer}>
                    <ThemedText type="title">Tasks</ThemedText>
                    {tasks.map((task) => (
                        <ThemedView key={task.id} style={styles.taskItem}>
                            <ThemedText>{task.name}</ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>
            </ScrollView>

            <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
                <ThemedText style={styles.micButtonText}>🎤</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        padding: 16,
        backgroundColor: '#6200EE',
    },
    greeting: {
        marginBottom: 8,
    },
    mainContent: {
        flex: 1,
        padding: 16,
    },
    habitsContainer: {
        marginBottom: 24,
    },
    habitItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tasksContainer: {
        marginBottom: 24,
    },
    taskItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    micButton: {
        position: 'absolute',
        bottom: 32,
        right: 32,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    micButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
    },
});
