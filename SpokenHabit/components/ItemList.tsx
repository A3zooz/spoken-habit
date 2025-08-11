import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { Habit, Task } from '@/utils/supabase';
import { SwipeableItem } from '@/components/SwipeableItem';

interface ItemListProps {
    items: Habit[] | Task[];
    title: string;
    iconName: 'task-alt' | 'assignment';
    emptyMessage: string;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({
    items,
    title,
    iconName,
    emptyMessage,
    onToggle,
    onDelete,
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

    const renderItem = ({ item }: { item: Habit | Task }) => (
        <SwipeableItem
            item={item}
            surfaceColor={surfaceColor}
            borderColor={borderColor}
            textColor={textColor}
            iconColor={iconColor}
            onToggle={onToggle}
            onDelete={onDelete}
        />
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
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                />
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
});
