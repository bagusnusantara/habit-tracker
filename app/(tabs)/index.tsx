import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

type ScheduleItem = {
    id: string;
    habit: { title: string; preferred_time_of_day: string };
    completed_at: string | null;
};

export default function TodayScreen() {
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSchedules = useCallback(async () => {
        setRefreshing(true);
        const today = new Date().toISOString().split('T')[0];
        
        // 1. Get existing schedules
        const { data: existingSchedules, error: fetchError } = await supabase
            .from('schedules')
            .select('*, habit:habits(title, preferred_time_of_day)')
            .eq('scheduled_date', today)
            .order('created_at');

        if (fetchError) {
            console.error('Error fetching schedules:', fetchError);
            setRefreshing(false);
            // It might fail if table doesn't exist or RLS issue
            return;
        }

        // 2. Simple Client-Side Scheduler Logic
        // In a clearer implementation, this would be an Edge Function or DB trigger
        if (!existingSchedules || existingSchedules.length === 0) {
            const { data: habits } = await supabase
                .from('habits')
                .select('*')
                .eq('frequency', 'daily');
            
            if (habits && habits.length > 0) {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const newSchedules = habits.map(h => ({
                        habit_id: h.id,
                        user_id: user.id,
                        scheduled_date: today,
                    }));
                    
                    const { error: insertError } = await supabase.from('schedules').insert(newSchedules);
                    if (!insertError) {
                        // Recursively call to fetch the formatted data
                        setRefreshing(false);
                        return fetchSchedules(); 
                    } else {
                        console.error('Error creating schedules:', insertError);
                    }
                }
            }
        }
        
        setSchedules(existingSchedules || []);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    const toggleComplete = async (id: string, currentCompleted: boolean) => {
        const { error } = await supabase
            .from('schedules')
            .update({ completed_at: currentCompleted ? null : new Date().toISOString() })
            .eq('id', id);
        
        if (error) Alert.alert('Error', error.message);
        else fetchSchedules();
    };

    const renderItem = ({ item }: { item: ScheduleItem }) => {
        const isCompleted = !!item.completed_at;
        return (
            <TouchableOpacity 
                style={[styles.card, isCompleted && styles.cardCompleted]} 
                onPress={() => toggleComplete(item.id, isCompleted)}
                activeOpacity={0.7}
            >
                <View style={styles.cardContent}>
                    <Text style={[styles.habitTitle, isCompleted && styles.textCompleted]}>
                        {item.habit?.title || 'Unknown Habit'}
                    </Text>
                    <View style={styles.metaContainer}>
                         <Ionicons name="time-outline" size={14} color="#94A3B8" />
                         <Text style={styles.habitTime}>
                            {item.habit?.preferred_time_of_day || 'Anytime'}
                         </Text>
                    </View>
                </View>
                <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                    {isCompleted && <Ionicons name="checkmark" size={20} color="#fff" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateText}>{format(new Date(), 'EEEE, d MMMM')}</Text>
                <Text style={styles.subText}>Your Daily Goals</Text>
            </View>
            <FlatList
                data={schedules}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchSchedules} tintColor="#6366F1" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="leaf-outline" size={64} color="#334155" />
                        <Text style={styles.emptyText}>No habits scheduled.</Text>
                        <Text style={styles.emptySubText}>Head to the Habits tab to create your first daily habit!</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        padding: 24,
        paddingBottom: 12,
    },
    dateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#6366F1',
        marginBottom: 4,
    },
    subText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    listContent: {
        padding: 24,
        gap: 16,
    },
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardCompleted: {
        opacity: 0.7,
        borderColor: '#10B981',
    },
    cardContent: {
        flex: 1,
    },
    habitTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#F8FAFC',
        marginBottom: 8,
    },
    textCompleted: {
        textDecorationLine: 'line-through',
        color: '#94A3B8',
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    habitTime: {
        fontSize: 14,
        color: '#94A3B8',
        textTransform: 'capitalize',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    checkboxChecked: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#F8FAFC',
        fontWeight: '600',
    },
    emptySubText: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
    },
});
