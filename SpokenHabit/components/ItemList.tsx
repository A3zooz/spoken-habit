import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { Habit, Task } from '@/utils/supabase';

interface ItemListProps {
    items: Habit[] | Task[];
    title: string;
    iconName: 'task-alt' | 'assignment';
    emptyMessage: string;
    onToggle: (id: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
    items,
    title,
    iconName,
    emptyMessage,
    onToggle,
}) => {
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
    const iconColor = useThemeColor(
        { light: Colors.light.icon, dark: Colors.dark.icon },
        'icon'
    );
    const borderColor = useThemeColor(
        { light: Colors.light.border, dark: Colors.dark.border },
        'border'
    );

    return (
        <ThemedView style={styles.section}>
            <ThemedView style={styles.sectionHeader}>
                <MaterialIcons name={iconName} size={24} color={iconColor} />
                <ThemedText
                    type="title"
                    style={[styles.sectionTitle, { color: textColor }]}
                >
                    {title}
                </ThemedText>
            </ThemedView>
            {items.length === 0 ? (
                <ThemedView
                    style={[
                        styles.emptyState,
                        {
                            backgroundColor: surfaceColor,
                            borderColor: borderColor,
                        },
                    ]}
                >
                    <ThemedText
                        style={[
                            styles.emptyText,
                            { color: textSecondaryColor },
                        ]}
                    >
                        {emptyMessage}
                    </ThemedText>
                </ThemedView>
            ) : (
                items.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.item,
                            {
                                backgroundColor: surfaceColor,
                                borderColor: borderColor,
                            },
                        ]}
                        onPress={() => onToggle(item.id)}
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
                ))
            )}
        </ThemedView>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 18,
        fontWeight: '600',
    },
    emptyState: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
        gap: 12,
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
});
