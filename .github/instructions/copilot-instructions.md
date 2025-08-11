# SpokenHabit - AI Agent Instructions

## Project Overview
Voice-powered habit tracker built with React Native, Expo Router, TypeScript, and Supabase. Features speech recognition for hands-free habit management with protected routes and real-time synchronization.

## Architecture Patterns

### Authentication & Protected Routes
- `utils/authContext.tsx` - Context provider managing auth state with AsyncStorage persistence
- `app/(protected)/_layout.tsx` - Protected route wrapper with auth checks
- `app/login.tsx` & `app/signup.tsx` - Authentication screens outside protected routes
- Auth state persists in AsyncStorage and validates on app launch

### File-Based Routing Structure
```
app/
├── _layout.tsx              # Root with AuthProvider & theme setup
├── login.tsx, signup.tsx    # Public auth screens
└── (protected)/             # Auth-required screens
    ├── _layout.tsx          # Protected wrapper with auth validation
    └── (tabs)/              # Main app navigation
        ├── habits.tsx       # Primary habit management screen
        └── todos.tsx        # Task management screen
```

### Supabase Integration
- `utils/supabase.ts` - Client setup with AsyncStorage auth persistence
- Environment variables: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `voice-worker.ts` - Edge function for AI-powered voice command parsing (Groq integration)
- Real-time subscriptions for habit/task updates across devices

### Voice Recognition System
- Uses `expo-speech-recognition` for voice commands
- `expo-audio` for recording audio for backend processing
- Voice commands parsed by Groq AI in Supabase Edge Functions
- Permissions configured in `app.json` for iOS/Android microphone access

### Theming System
- `constants/Colors.ts` - Centralized light/dark color definitions
- `hooks/useThemeColor.ts` - Dynamic color resolution hook
- `components/ThemedText.tsx` & `components/ThemedView.tsx` - Theme-aware base components

## Development Workflows

### Environment Setup
```bash
# Required environment variables in .env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Start Development
```bash
npx expo start           # Dev server with QR code
npm run android         # Android emulator
npm run ios            # iOS simulator (requires Xcode)
npm run web            # Web browser
```

### Key Dependencies
- **@supabase/supabase-js** - Backend integration with auth and real-time
- **expo-speech-recognition** - Voice command capture
- **expo-audio** - Audio recording for voice processing
- **@react-native-async-storage/async-storage** - Auth state persistence
- **expo-router** - File-based navigation with auth protection

## Critical Patterns

### Auth Context Usage
```tsx
// Always wrap auth-dependent components
const authContext = useContext(AuthContext) || {
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isReady: false
};
```

### Voice Command Integration
- Speech recognition requires platform-specific permissions
- Audio recording uses `expo-audio` with `RecordingPresets.HIGH_QUALITY`
- Voice data sent to `voice-worker` Supabase function for AI parsing
- Commands like "add habit", "complete task" parsed into structured actions

### Import Patterns
```tsx
// Always use @/ alias for local imports
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/utils/supabase';
import { AuthContext } from '@/utils/authContext';
```

### Supabase Data Patterns
```tsx
// Always use typed interfaces for database entities
interface Habit {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  // ... other fields
}

// Real-time subscriptions for live updates
const subscription = supabase
  .channel('habits')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'habits' }, payload => {
    // Handle real-time updates
  })
  .subscribe();
```

### Voice Command Workflow
1. User speaks command → `expo-speech-recognition` captures speech
2. Audio transcribed to text → sent to `voice-worker` Supabase function
3. Groq AI parses intent → returns structured JSON action
4. App processes action → updates Supabase → UI reflects changes

### Platform-Specific Considerations
- iOS requires `NSSpeechRecognitionUsageDescription` & `NSMicrophoneUsageDescription` in `app.json`
- Android needs `RECORD_AUDIO` permission
- Web platform has limited speech recognition support

## Debugging Tips
- Check auth state with console logs in `AuthContext` provider
- Voice commands may fail silently - always handle errors gracefully
- Supabase real-time requires proper row-level security (RLS) policies
- Use Expo Dev Tools for network requests and Supabase function logs
