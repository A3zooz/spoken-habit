import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Habit, Task } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Netinfo from '@react-native-community/netinfo';
type ItemType = 'habits' | 'tasks';

interface PendingSync {
    action: 'create' | 'update' | 'delete';
    item: Habit | Task;
    timestamp: number;
}

export const useItems = (itemType: ItemType) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

    useEffect(() => {
        fetchItems();
        const unsubscribe = setupNetworkListener();
        return () => {
            unsubscribe();
        };
    }, [itemType]);

    const isOnline = async (): Promise<boolean | null> => {
        const netInfo = await Netinfo.fetch();
        return netInfo.isConnected && netInfo.isInternetReachable;
    };

    const setupNetworkListener = () => {
        const unsubscribe = Netinfo.addEventListener((state) => {
            if (state.isConnected && state.isInternetReachable) {
                fetchItems();
            }
        });
        return unsubscribe;
    };

    const fetchItems = async () => {
        loadFromLocalStorage();
        if (await isOnline()) {
            await Promise.all([fetchHabits(), fetchTasks()]);
        }
    };
    const loadFromLocalStorage = async () => {
        try {
            const habits = await AsyncStorage.getItem('habits');
            const tasks = await AsyncStorage.getItem('tasks');
            if (habits) setHabits(JSON.parse(habits));
            if (tasks) setTasks(JSON.parse(tasks));
            console.log('Loaded from local storage:', { habits, tasks });
        } catch (error) {
            console.error('Error loading from local storage:', error);
        }
    };

    const fetchHabits = async () => {
        const user = await supabase.auth.getUser();
        const userId = user?.data.user?.id;
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (data) {
            await AsyncStorage.setItem('habits', JSON.stringify(data));
        }
        if (error) {
            console.error('Error fetching habits:', error);
        } else {
            setHabits(data || []);
        }
    };

    const fetchTasks = async () => {
        const user = await supabase.auth.getUser();
        const userId = user?.data.user?.id;
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (data) {
            await AsyncStorage.setItem('tasks', JSON.stringify(data));
        }
        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            setTasks(data || []);
        }
    };

    const toggleHabit = (id: number) => {
        setHabits((prevHabits) =>
            prevHabits.map((habit) =>
                habit.id === id
                    ? { ...habit, completed: !habit.completed }
                    : habit
            )
        );
    };

    const toggleTask = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    return {
        habits,
        tasks,
        fetchItems,
        fetchHabits,
        fetchTasks,
        toggleHabit,
        toggleTask,
    };
};
