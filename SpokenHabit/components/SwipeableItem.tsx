import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Animated, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { Habit, Task } from '@/utils/supabase';
import * as Haptics from 'expo-haptics';

interface SwipeableItemProps {
    item: Habit | Task;
    surfaceColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
    item,
    surfaceColor,
    borderColor,
    textColor,
    iconColor,
    onToggle,
    onDelete,
}) => {
    const swipeableRef = useRef<Swipeable>(null);

    const handleDelete = () => {
        Alert.alert(
            'Delete Item',
            `Are you sure you want to delete "${item.name}"?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => swipeableRef.current?.close(),
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        onDelete(item.id);
                        swipeableRef.current?.close();
                    },
                    style: 'destructive',
                },
            ]
        );
    };

    const renderRightActions = (progress: Animated.AnimatedAddition<number>) => {
        const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.rightActionsContainer}>
                <Animated.View style={[styles.deleteAction, { transform: [{ translateX }] }]}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="delete" size={24} color="white" />
                        <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    };

    const handleSwipeableWillOpen = (direction: 'left' | 'right') => {
        console.log('Swipeable will open:', direction);
        if (direction === 'right') {
            // This means user is swiping left (revealing right actions)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handleSwipeableOpen = (direction: 'left' | 'right') => {
        console.log('Swipeable opened:', direction);
        if (direction === 'right') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    };

    return (
        <View style={styles.container}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                onSwipeableWillOpen={handleSwipeableWillOpen}
                onSwipeableOpen={handleSwipeableOpen}
                rightThreshold={40}
                friction={1.5}
            >
                <TouchableOpacity
                    style={[
                        styles.item,
                        {
                            backgroundColor: surfaceColor,
                            borderColor: borderColor,
                        },
                    ]}
                    onPress={() => onToggle(item.id)}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name={
                            item.completed
                                ? 'check-circle'
                                : 'radio-button-unchecked'
                        }
                        size={24}
                        color={
                            item.completed
                                ? Colors.light.success
                                : iconColor
                        }
                    />
                    <ThemedText
                        style={[
                            styles.itemText,
                            { color: textColor },
                            item.completed && styles.completedText,
                        ]}
                    >
                        {item.name}
                    </ThemedText>
                </TouchableOpacity>
            </Swipeable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
        backgroundColor: 'white',
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
    },
    completedText: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
    },
    rightActionsContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        width: 100,
    },
    deleteAction: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
        width: 100,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
    },
    actionText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
});
