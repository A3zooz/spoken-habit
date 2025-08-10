import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Habit, Task } from '@/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ItemType = 'habits' | 'tasks';

export const useItems = (itemType: ItemType) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        fetchItems();
    }, [itemType]);

    const fetchItems = async () => {
        await Promise.all([fetchHabits(), fetchTasks()]);
    };

    const fetchHabits = async () => {
        const user = await supabase.auth.getUser();
        const userId = user?.data.user?.id;
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

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
