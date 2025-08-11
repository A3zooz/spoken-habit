import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ScrollView } from 'react-native-gesture-handler';
import { ItemList } from '@/components/ItemList';
import { VoiceModal } from '@/components/VoiceModal';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { useItems } from '@/hooks/useItems';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function TodosScreen() {
    const [showModal, setShowModal] = useState(false);
    const { backgroundColor, surfaceColor, textColor, borderColor } = useAppTheme();
    
    const { tasks, fetchItems, toggleTask, deleteTask } = useItems('tasks');
    
    const voiceCommands = useVoiceCommands({
        actionType: 'add_task',
        onSuccess: fetchItems,
    });

    const handlePlusPress = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        voiceCommands.stopListening();
        voiceCommands.resetState();
        setShowModal(false);
    };

    const handleConfirmCommand = async () => {
        try {
            await voiceCommands.handleSubmission(voiceCommands.editableCommand);
            setShowModal(false);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    return (
        <ThemedView style={[styles.container, { backgroundColor }]}>
            <ThemedView
                style={[
                    styles.header,
                    {
                        backgroundColor: surfaceColor,
                        borderBottomColor: borderColor,
                    },
                ]}
            >
                <ThemedView
                    style={[styles.greeting, { backgroundColor: surfaceColor }]}
                >
                    <ThemedText
                        type="title"
                        style={[styles.headerTitle, { color: textColor }]}
                    >
                        Hello, User! 👋
                    </ThemedText>
                    <ThemedText
                        type="subtitle"
                        style={[
                            styles.headerSubtitle,
                            { color: textColor, opacity: 0.85 },
                        ]}
                    >
                        Here's your daily overview
                    </ThemedText>
                </ThemedView>
            </ThemedView>

            <ScrollView
                style={styles.mainContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                <ItemList
                    items={tasks}
                    title="Tasks"
                    iconName="assignment"
                    emptyMessage="No tasks yet. Add one using voice commands!"
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                />
            </ScrollView>

            <FloatingActionButton onPress={handlePlusPress} />

            <VoiceModal
                visible={showModal}
                isListening={voiceCommands.isListening}
                isProcessing={voiceCommands.isProcessing}
                realtimeTranscription={voiceCommands.realtimeTranscription}
                editableCommand={voiceCommands.editableCommand}
                onClose={handleCloseModal}
                onMicPress={voiceCommands.startListening}
                onConfirm={handleConfirmCommand}
                onEditableCommandChange={voiceCommands.setEditableCommand}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    greeting: {
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    mainContent: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        paddingBottom: 100,
    },
});
