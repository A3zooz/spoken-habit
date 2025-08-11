# SpokenHabit 🎤

*Transform your habits through the power of voice*

A voice-controlled habit tracking and todo management app that lets you manage your daily routines and tasks hands-free.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/A3zooz/spoken-habit)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~53.0.20-000020.svg)](https://expo.dev)
<!--[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) -->

---

## 📱 Demo
<p align="center">

<img width="500" height="1280" alt="image" src="https://github.com/user-attachments/assets/91f91050-313c-44a2-8d74-dc901803738f" />
<br>
<br>
  <img src="https://github.com/user-attachments/assets/fd0514e6-c4bc-4426-93be-568edb461cbb" alt="Demo" width="500"/>
<br>
<br>
<!-- ![Screen_recording_20250811_151424](https://github.com/user-attachments/assets/fd0514e6-c4bc-4426-93be-568edb461cbb) -->
<img  width="500" height="1280" alt="image" src="https://github.com/user-attachments/assets/283da2b1-3106-4296-8502-2ef51e5d9d87" />
<br>
<br>
<!-- ![Screen_recording_20250811_151847](https://github.com/user-attachments/assets/7ac502c9-fdbb-4ac8-b65e-15a364d86122) -->
  <img src="https://github.com/user-attachments/assets/7ac502c9-fdbb-4ac8-b65e-15a364d86122" alt="Demo" width="500"/>
  <br>
<br>
<!-- ![Screen_recording_20250811_151942](https://github.com/user-attachments/assets/e7729995-4b9e-429c-bd2c-0c7b7f9a5236) -->
  <img src="https://github.com/user-attachments/assets/e7729995-4b9e-429c-bd2c-0c7b7f9a5236" alt="Demo" width="500"/>
</p>




---

## ✨ Features

### Core Functionality
- 🎤 **Voice Recognition**: Add, edit, and manage habits and todos using natural speech
- 📊 **Habit Tracking**: Track daily habits with completion statistics
- ✅ **Todo Management**: Organize tasks with voice commands
- 🔄 **Swipe Gestures**: Intuitive swipe-to-complete and swipe-to-delete actions
- 🌓 **Theme Support**: Light and dark mode with system preference detection
- 🔐 **Secure Authentication**: User accounts with Supabase authentication

### Key Differentiators
- **Hands-free Operation**: Complete habit tracking without touching your device
- **Natural Language Processing**: Understands conversational commands
- **Cross-platform Sync**: Access your data across iOS, Android, and Web
- **Offline-ready**: Works without internet connection with sync when online
- **Haptic Feedback**: Enhanced user experience with tactile responses

### Voice Recognition Capabilities
- Add new habits and todos with voice commands
- Mark items as complete/incomplete
- Delete items using speech
- Navigate through the app with voice controls

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React Native** | Cross-platform mobile development |
| **Expo** | Development platform and deployment |
| **TypeScript** | Type-safe JavaScript development |
| **Supabase** | Backend-as-a-Service (Authentication, Database, Real-time) |
| **Expo Router** | File-based navigation system |
| **Expo Speech Recognition** | Voice input processing |
| **React Native Gesture Handler** | Touch and gesture management |
| **React Native Reanimated** | Smooth animations |
| **Async Storage** | Local data persistence |

### Platform Support
- 📱 **iOS** (iPhone & iPad)
- 🤖 **Android** (Phone & Tablet)
- 🌐 **Web** (PWA support)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** or **yarn** package manager
- **Expo CLI**: Install globally with `npm install -g @expo/cli`

### Development Environment Setup

#### For iOS Development
- **Xcode** (latest version)
- **iOS Simulator** (included with Xcode)
- **macOS** (required for iOS development)

#### For Android Development
- **Android Studio**
- **Android SDK** (API level 21 or higher)
- **Android Emulator** or physical device

#### For Web Development
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/A3zooz/spoken-habit.git
cd spoken-habit/SpokenHabit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) for your tables
4. Configure authentication providers as needed

### 5. Platform-specific Setup

#### iOS Setup
```bash
npx expo run:ios
```

#### Android Setup
```bash
npx expo run:android
```



---

## 🧑‍💻 Development

### Running the App Locally

Start the development server:
```bash
npx expo start
```

This will open the Expo Developer Tools in your browser with options to:
- Run on iOS simulator
- Run on Android emulator
- Run on physical device via Expo Go
- Run on web browser

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run on web browser |
| `npm run lint` | Run ESLint for code quality |
| `npm run reset-project` | Reset to a clean project state |

### Development Workflow

1. **Hot Reloading**: Changes are automatically reflected in the app
2. **TypeScript**: Full type checking during development
3. **ESLint**: Code quality and style enforcement
4. **Expo DevTools**: Debug and monitor your app



## 📁 Project Structure

```
SpokenHabit/
├── app/                    # File-based routing (Expo Router)
│   ├── (protected)/        # Protected routes requiring authentication
│   │   ├── (tabs)/         # Tab-based navigation
│   │   │   ├── habits.tsx  # Habits tracking screen
│   │   │   └── todos.tsx   # Todo management screen
│   │   └── _layout.tsx     # Protected layout wrapper
│   ├── _layout.tsx         # Root layout with auth provider
│   ├── index.tsx           # Landing/redirect page
│   ├── login.tsx           # Authentication screen
│   └── signup.tsx          # User registration screen
├── components/             # Reusable UI components
│   ├── ui/                 # Platform-specific UI components
│   ├── ItemList.tsx        # Generic list component
│   ├── SwipeableItem.tsx   # Swipe gesture component
│   ├── VoiceModal.tsx      # Voice input modal
│   └── FloatingActionButton.tsx
├── hooks/                  # Custom React hooks
│   ├── useVoiceCommands.ts # Voice recognition logic
│   ├── useItems.ts         # Data management
│   └── useAppTheme.ts      # Theme management
├── utils/                  # Utility functions
│   ├── authContext.tsx     # Authentication context
│   └── supabase.ts         # Supabase client configuration
├── constants/              # App constants
│   └── Colors.ts           # Theme colors
├── assets/                 # Static assets
│   ├── images/             # App icons and images
│   └── fonts/              # Custom fonts
└── supabase/              # Database schema and functions
    ├── schema.sql          # Database schema
    └── voice-worker.ts     # Voice processing utilities
```

### Key Directories Explanation

- **`app/`**: Contains all screens using Expo Router's file-based routing
- **`components/`**: Reusable UI components with platform-specific variants
- **`hooks/`**: Custom hooks for voice commands, data management, and theming
- **`utils/`**: Authentication context and Supabase configuration
- **`supabase/`**: Database schema and backend-related utilities

### Navigation Structure

```
App Root
├── Authentication Flow
│   ├── Login
│   └── Signup
└── Protected App
    ├── Tab Navigation
    │   ├── Habits Tab
    │   └── Todos Tab
    └── Settings/Profile
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |

### Expo Configuration

Key configurations in `app.json`:

```json
{
  "expo": {
    "name": "SpokenHabit",
    "slug": "SpokenHabit",
    "version": "1.0.0",
    "scheme": "spokenhabit",
    "platforms": ["ios", "android", "web"]
  }
}
```

### Platform-specific Settings

#### iOS Permissions
- **Speech Recognition**: Required for voice commands
- **Microphone**: Required for audio input

#### Android Permissions
- **RECORD_AUDIO**: For voice recognition
- **INTERNET**: For Supabase connectivity
- **VIBRATE**: For haptic feedback

### Permissions Required

| Permission | Platform | Purpose |
|------------|----------|---------|
| Microphone | iOS/Android | Voice input for commands |
| Speech Recognition | iOS/Android | Converting speech to text |
| Internet | All | Syncing data with Supabase |
| Vibrate | Android | Haptic feedback |

---

## 🔌 API Documentation

### Supabase Integration

#### Database Tables

**Habits Table**
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Todos Table**
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Authentication Flow

1. **Sign Up**: Create new user account
2. **Sign In**: Authenticate existing user
3. **Session Management**: Automatic token refresh
4. **Protected Routes**: Redirect unauthenticated users

### Data Models

#### Habit Model
```typescript
interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}
```

#### Todo Model
```typescript
interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}
```

### Voice Recognition Setup

The app uses `expo-speech-recognition` for voice input:

```typescript
// Voice command processing
const handleVoiceCommand = async (command: string) => {
  // Parse natural language commands
  // Execute corresponding actions
  // Provide voice feedback
};
```

#### Supported Voice Commands

- **"Add habit [habit name]"** - Create new habit
- **"Add todo [task name]"** - Create new todo
- **"Complete [item name]"** - Mark item as completed
- **"Delete [item name]"** - Remove item
- **"Show habits"** - Navigate to habits screen
- **"Show todos"** - Navigate to todos screen

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup for Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **Supabase** for the backend infrastructure
- **React Native Community** for the ecosystem
- **Contributors** who helped shape this project

---

## 📞 Support

If you encounter any issues or have questions:

- **Issues**: [GitHub Issues](https://github.com/A3zooz/spoken-habit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/A3zooz/spoken-habit/discussions)


---

*Built with ❤️ using React Native and Expo*
