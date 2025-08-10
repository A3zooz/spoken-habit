import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface FloatingActionButtonProps {
    onPress: () => void;
    isListening?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    onPress,
    isListening = false,
}) => {
    const tintColor = useThemeColor(
        { light: Colors.light.tint, dark: Colors.dark.tint },
        'tint'
    );

    return (
        <TouchableOpacity
            style={[
                styles.floatingButton,
                {
                    backgroundColor: isListening
                        ? Colors.light.error
                        : tintColor,
                },
            ]}
            onPress={onPress}
        >
            <MaterialIcons
                name="add"
                size={32}
                color="white"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
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
});
