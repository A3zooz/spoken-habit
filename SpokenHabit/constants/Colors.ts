/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Improved color palette optimized for both light and dark modes
const COLOR_PALETTE = {
  // Pure colors
  "Pure_White": "#FFFFFF",
  "Pure_Black": "#000000",
  
  // Light mode colors
  "Light_Background": "#FAFAFA",
  "Light_Surface": "#FFFFFF",
  "Light_Text_Primary": "#1A1A1A",
  "Light_Text_Secondary": "#666666",
  
  // Dark mode colors
  "Dark_Background": "#0F0F0F",
  "Dark_Surface": "#1A1A1A",
  "Dark_Text_Primary": "#FFFFFF",
  "Dark_Text_Secondary": "#B3B3B3",
  
  // Brand colors (work well in both modes)
  "Primary": "#6366F1",        // Indigo - main brand color
  "Primary_Light": "#818CF8",  // Lighter indigo for interactions
  "Primary_Dark": "#4F46E5",   // Darker indigo for emphasis
  
  // Accent colors
  "Secondary": "#8B5CF6",      // Purple - secondary actions
  "Success": "#10B981",        // Green - success states
  "Warning": "#F59E0B",        // Amber - warnings
  "Error": "#EF4444",          // Red - errors
  
  // Neutral colors
  "Gray_50": "#F9FAFB",
  "Gray_100": "#F3F4F6",
  "Gray_200": "#E5E7EB",
  "Gray_300": "#D1D5DB",
  "Gray_400": "#9CA3AF",
  "Gray_500": "#6B7280",
  "Gray_600": "#4B5563",
  "Gray_700": "#374151",
  "Gray_800": "#1F2937",
  "Gray_900": "#111827",
}

export const Colors = {
  light: {
    text: COLOR_PALETTE.Light_Text_Primary,
    textSecondary: COLOR_PALETTE.Light_Text_Secondary,
    background: COLOR_PALETTE.Light_Background,
    surface: COLOR_PALETTE.Light_Surface,
    tint: COLOR_PALETTE.Primary,
    tintLight: COLOR_PALETTE.Primary_Light,
    tintDark: COLOR_PALETTE.Primary_Dark,
    icon: COLOR_PALETTE.Gray_600,
    iconActive: COLOR_PALETTE.Primary,
    tabIconDefault: COLOR_PALETTE.Gray_400,
    tabIconSelected: COLOR_PALETTE.Primary,
    border: COLOR_PALETTE.Gray_200,
    borderLight: COLOR_PALETTE.Gray_100,
    success: COLOR_PALETTE.Success,
    warning: COLOR_PALETTE.Warning,
    error: COLOR_PALETTE.Error,
    secondary: COLOR_PALETTE.Secondary,
  },
  dark: {
    text: COLOR_PALETTE.Dark_Text_Primary,
    textSecondary: COLOR_PALETTE.Dark_Text_Secondary,
    background: COLOR_PALETTE.Dark_Background,
    surface: COLOR_PALETTE.Dark_Surface,
    tint: COLOR_PALETTE.Primary_Light,
    tintLight: COLOR_PALETTE.Primary,
    tintDark: COLOR_PALETTE.Primary_Dark,
    icon: COLOR_PALETTE.Gray_400,
    iconActive: COLOR_PALETTE.Primary_Light,
    tabIconDefault: COLOR_PALETTE.Gray_500,
    tabIconSelected: COLOR_PALETTE.Primary_Light,
    border: COLOR_PALETTE.Gray_700,
    borderLight: COLOR_PALETTE.Gray_800,
    success: COLOR_PALETTE.Success,
    warning: COLOR_PALETTE.Warning,
    error: COLOR_PALETTE.Error,
    secondary: COLOR_PALETTE.Secondary,
  },
};
