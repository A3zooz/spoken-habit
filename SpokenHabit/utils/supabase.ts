import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
console.log(process.env)
console.log("Supabase URL:", supabaseUrl);
if (!supabaseUrl) {
    throw new Error("Supabase URL is not defined. Please set the EXPO_PUBLIC_SUPABASE_URL environment variable.");
}
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
if (!supabaseAnonKey) {
    throw new Error("Supabase Anon Key is not defined. Please set the EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    },

})

// const { data, error } = await supabase.functions.invoke('voice-worker', {
//   body: { name: 'Functions' },
// })

// Database types
export interface Habit {
    id: number
    name: string
    completed: boolean
    time: string
    user_id?: string
    created_at?: string
}

export interface Task {
    id: number
    name: string
    completed: boolean
    time: string
    user_id?: string
    created_at?: string
}