import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '../ThemedView';

interface Item {
    id: string;
    title: string;
    completed: boolean;
    description?: string;
}

interface ItemListProps {
    items: Item[];
    title: string;
    onToggleItem: (id: string) => void;
    onAddItem: () => void;
}

export default function ItemList({
    items,
    title,
    onToggleItem,
    onAddItem,
}: ItemListProps) {
    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onToggleItem(item.id)}
        >
            <ThemedView style={styles.itemContent}>
                <Ionicons
                    name={
                        item.completed ? 'checkmark-circle' : 'ellipse-outline'
                    }
                    size={24}
                    color={item.completed ? '#4CAF50' : '#ccc'}
                />
                <ThemedView style={styles.textContainer}>
                    <Text
                        style={[
                            styles.itemTitle,
                            item.completed && styles.completedText,
                        ]}
                    >
                        {item.title}
                    </Text>
                    {item.description && (
                        <Text style={styles.itemDescription}>
                            {item.description}
                        </Text>
                    )}
                </ThemedView>
            </ThemedView>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </ThemedView>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
    },
    itemContainer: {
        marginBottom: 12,
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
});
