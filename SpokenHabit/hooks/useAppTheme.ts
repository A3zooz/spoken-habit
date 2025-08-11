import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export const useAppTheme = () => {
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

    return {
        backgroundColor,
        surfaceColor,
        textColor,
        textSecondaryColor,
        tintColor,
        iconColor,
        borderColor,
    };
};
