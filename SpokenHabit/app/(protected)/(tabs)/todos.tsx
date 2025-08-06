//import styles
import { StyleSheet, Platform, TouchableOpacity, Alert, Dimensions, Modal, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import { supabase } from '@/utils/supabase';
import { Habit, Task } from '@/utils/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
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
    const [showModal, setShowModal] = useState(false);
    const [realtimeTranscription, setRealtimeTranscription] = useState('');
    const [editableCommand, setEditableCommand] = useState('');

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
        const transcript = result.results[0]?.transcript || '';
        setRealtimeTranscription(transcript);
        
        if(result.isFinal) {
            setTranscription(transcript);
            setEditableCommand(transcript);
            setIsListening(false);
        }
    });

    const handleSubmission = async (command: string) => {
        if (command.trim()) {
            try {
                const { data, error } = await supabase.functions.invoke('voice-worker', {
                    body: { transcription: command },
                });
                console.log('Function response:', data);
                if(data){
                    await addToDatabase(data);
                    await fetchHabits();
                    await fetchTasks();
                }
                if (error) {
                    console.error('Error invoking function:', error);
                    Alert.alert('Error', 'Failed to process voice command.');
                }
                setTranscription('');
                setEditableCommand('');
                setRealtimeTranscription('');
                setShowModal(false);
            } catch (error) {
                console.error('Error processing command:', error);
                Alert.alert('Error', 'Failed to process command.');
            }
        }
    };

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

    const handlePlusPress = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        if (isListening) {
            ExpoSpeechRecognitionModule.stop();
            setIsListening(false);
        }
        setShowModal(false);
        setRealtimeTranscription('');
        setEditableCommand('');
    };

    const handleConfirmCommand = () => {
        if (editableCommand.trim()) {
            handleSubmission(editableCommand);
        }
    };
    return (
        <ThemedView style={[styles.container, { backgroundColor }]}>
            <ThemedView style={[styles.header, { backgroundColor: surfaceColor, borderBottomColor: borderColor }]}>
                <ThemedView style={[styles.greeting, { backgroundColor: surfaceColor }]}>
                    <ThemedText type="title" style={[styles.headerTitle, { color: textColor }]}>
                        Hello, User! 👋
                    </ThemedText>
                    <ThemedText type="subtitle" style={[styles.headerSubtitle, { color: textColor, opacity: 0.85 }]}>
                        Here's your daily overview
                    </ThemedText>
                </ThemedView>
            </ThemedView>
            
            <ScrollView 
                style={styles.mainContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {/* <ThemedView style={styles.section}>
                    <ThemedView style={styles.sectionHeader}>
                        <MaterialIcons name="task-alt" size={24} color={iconColor} />
                        <ThemedText type="title" style={[styles.sectionTitle, { color: textColor }]}>
                            Habits
                        </ThemedText>
                    </ThemedView>
                    {habits.length === 0 ? (
                        <ThemedView style={[styles.emptyState, { backgroundColor: surfaceColor, borderColor: borderColor }]}>
                            <ThemedText style={[styles.emptyText, { color: textSecondaryColor }]}>
                                No habits yet. Add one using voice commands!
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        habits.map((habit) => (
                            <TouchableOpacity 
                                key={habit.id} 
                                style={[styles.item, { backgroundColor: surfaceColor, borderColor: borderColor }]}
                                onPress={() => toggleHabit(habit.id)}
                            >
                                <MaterialIcons 
                                    name={habit.completed ? "check-circle" : "radio-button-unchecked"} 
                                    size={24} 
                                    color={habit.completed ? Colors.light.success : Colors.light.tabIconDefault} 
                                />
                                <ThemedText style={[
                                    styles.itemText, 
                                    { color: textColor },
                                    habit.completed && styles.completedText
                                ]}>
                                    {habit.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))
                    )}
                </ThemedView> */}

                <ThemedView style={styles.section}>
                    <ThemedView style={styles.sectionHeader}>
                        <MaterialIcons name="assignment" size={24} color={iconColor} />
                        <ThemedText type="title" style={[styles.sectionTitle, { color: textColor }]}>
                            Tasks
                        </ThemedText>
                    </ThemedView>
                    {tasks.length === 0 ? (
                        <ThemedView style={[styles.emptyState, { backgroundColor: surfaceColor, borderColor: borderColor }]}>
                            <ThemedText style={[styles.emptyText, { color: textSecondaryColor }]}>
                                No tasks yet. Add one using voice commands!
                            </ThemedText>
                        </ThemedView>
                    ) : (
                        tasks.map((task) => (
                            <TouchableOpacity 
                                key={task.id} 
                                style={[styles.item, { backgroundColor: surfaceColor, borderColor: borderColor }]}
                                onPress={() => toggleTask(task.id)}
                            >
                                <MaterialIcons 
                                    name={task.completed ? "check-circle" : "radio-button-unchecked"} 
                                    size={24} 
                                    color={task.completed ? Colors.light.success : iconColor} 
                                />
                                <ThemedText style={[
                                    styles.itemText, 
                                    { color: textColor },
                                    task.completed && styles.completedText
                                ]}>
                                    {task.name}
                                </ThemedText>
                            </TouchableOpacity>
                        ))
                    )}
                </ThemedView>
            </ScrollView>

            <TouchableOpacity 
                style={[
                    styles.plusButton, 
                    { 
                        backgroundColor: tintColor,
                        shadowColor: tintColor,
                    }
                ]} 
                onPress={handlePlusPress}
            >
                <MaterialIcons 
                    name="add" 
                    size={32} 
                    color={surfaceColor} 
                />
            </TouchableOpacity>

            {/* Voice Command Modal */}
            <Modal
                visible={showModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseModal}
            >
                <ThemedView style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                    <ThemedView style={[styles.modalContent, { backgroundColor: surfaceColor, borderColor: borderColor }]}>
                        <ThemedView style={styles.modalHeader}>
                            <ThemedText type="title" style={[styles.modalTitle, { color: textColor }]}>
                                Voice Command
                            </ThemedText>
                            <TouchableOpacity onPress={handleCloseModal}>
                                <MaterialIcons name="close" size={24} color={iconColor} />
                            </TouchableOpacity>
                        </ThemedView>

                        {/* Real-time transcription display */}
                        {(isListening || realtimeTranscription) && (
                            <ThemedView style={[styles.transcriptionContainer, { backgroundColor: backgroundColor, borderColor: borderColor }]}>
                                <ThemedText style={[styles.transcriptionLabel, { color: textSecondaryColor }]}>
                                    {isListening ? 'Listening...' : 'Heard:'}
                                </ThemedText>
                                <ThemedText style={[styles.transcriptionText, { color: textColor }]}>
                                    {realtimeTranscription || 'Say something...'}
                                </ThemedText>
                            </ThemedView>
                        )}

                        {/* Microphone button in modal */}
                        <TouchableOpacity 
                            style={[
                                styles.modalMicButton, 
                                { 
                                    backgroundColor: isListening ? Colors.light.secondary : tintColor,
                                    shadowColor: tintColor,
                                }
                            ]} 
                            onPress={handleMicPress}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <MaterialIcons name="hourglass-empty" size={32} color={surfaceColor} />
                            ) : (
                                <MaterialIcons 
                                    name={isListening ? "mic" : "mic-none"} 
                                    size={32} 
                                    color={surfaceColor} 
                                />
                            )}
                        </TouchableOpacity>

                        {/* Editable command input */}
                        {editableCommand && (
                            <ThemedView style={styles.editSection}>
                                <ThemedText style={[styles.editLabel, { color: textSecondaryColor }]}>
                                    Edit command:
                                </ThemedText>
                                <TextInput
                                    style={[styles.commandInput, { 
                                        backgroundColor: backgroundColor, 
                                        borderColor: borderColor, 
                                        color: textColor 
                                    }]}
                                    value={editableCommand}
                                    onChangeText={setEditableCommand}
                                    placeholder="Enter your command..."
                                    placeholderTextColor={textSecondaryColor}
                                    multiline
                                />
                                <TouchableOpacity 
                                    style={[styles.confirmButton, { backgroundColor: tintColor }]}
                                    onPress={handleConfirmCommand}
                                >
                                    <ThemedText style={[styles.confirmButtonText, { color: surfaceColor }]}>
                                        Confirm Command
                                    </ThemedText>
                                </TouchableOpacity>
                            </ThemedView>
                        )}
                    </ThemedView>
                </ThemedView>
            </Modal>
            
            {isListening && (
                <ThemedView style={[styles.listeningIndicator, { backgroundColor: tintColor + "20", borderColor: tintColor + "40" }]}>
                    <MaterialIcons name="hearing" size={20} color={tintColor} />
                    <ThemedText style={[styles.listeningText, { color: tintColor }]}>
                        Listening...
                    </ThemedText>
                </ThemedView>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingHorizontal: 24,
        paddingBottom: 24,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
    },
    greeting: {
        marginBottom: 0,

    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContainer: {
        paddingTop: 20,
        paddingBottom: 100,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        gap: 12,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    emptyState: {
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    plusButton: {
        position: 'absolute',
        bottom: 32,
        right: 32,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    transcriptionContainer: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 20,
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
    listeningIndicator: {
        position: 'absolute',
        bottom: 110,
        right: 32,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    listeningText: {
        fontSize: 14,
        fontWeight: '500',
    },
    // Legacy styles - can be removed later
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
    micButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
    },
});
