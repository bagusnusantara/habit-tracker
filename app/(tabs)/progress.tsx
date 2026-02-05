import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from 'expo-router';
import { calculateStreak, getMonthStats, getCompletionRate, CalendarStats, Schedule } from '../../lib/stats';
import CalendarView from '../../components/CalendarView';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressScreen() {
    const [streak, setStreak] = useState(0);
    const [completionRate, setCompletionRate] = useState(0);
    const [calendarStats, setCalendarStats] = useState<CalendarStats>({});
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        setRefreshing(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // Fetch all schedules for the user
            const { data } = await supabase
                .from('schedules')
                .select('*')
                .eq('user_id', user.id);
            
            const schedules = (data || []) as Schedule[];
            
            setStreak(calculateStreak(schedules));
            setCompletionRate(getCompletionRate(schedules));
            setCalendarStats(getMonthStats(schedules, new Date()));
        }
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchStats();
        }, [])
    );

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={fetchStats} tintColor="#6366F1" />
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>Your Progress</Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                        <Ionicons name="flame" size={24} color="#F59E0B" />
                    </View>
                    <Text style={styles.statValue}>{streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>

                <View style={styles.statCard}>
                    <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                        <Ionicons name="trophy" size={24} color="#10B981" />
                    </View>
                    <Text style={styles.statValue}>{completionRate}%</Text>
                    <Text style={styles.statLabel}>Completion Rate</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Monthly Overview</Text>
                <CalendarView currentDate={new Date()} stats={calendarStats} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    content: {
        padding: 20,
        gap: 24,
    },
    header: {
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F8FAFC',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#94A3B8',
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#F8FAFC',
        marginBottom: 4,
    },
});
