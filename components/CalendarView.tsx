import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay } from 'date-fns';
import { CalendarStats } from '../lib/stats';

type CalendarViewProps = {
    currentDate: Date;
    stats: CalendarStats;
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView({ currentDate, stats }: CalendarViewProps) {
    const days = useMemo(() => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        const daysInMonth = eachDayOfInterval({ start, end });
        
        // Add padding days for the start of the week
        const startDayOfWeek = getDay(start);
        const paddingDays = Array(startDayOfWeek).fill(null);
        
        return [...paddingDays, ...daysInMonth];
    }, [currentDate]);

    const getColor = (dateStr: string) => {
        const stat = stats[dateStr];
        switch (stat) {
            case 'full': return '#10B981'; // Emerald 500
            case 'partial': return '#F59E0B'; // Amber 500
            default: return '#334155'; // Slate 700
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.monthTitle}>{format(currentDate, 'MMMM yyyy')}</Text>
            </View>
            
            <View style={styles.grid}>
                {WEEK_DAYS.map(day => (
                    <Text key={day} style={styles.weekDay}>{day}</Text>
                ))}
                
                {days.map((day, index) => {
                    if (!day) return <View key={`padding-${index}`} style={styles.dayCell} />;
                    
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const backgroundColor = getColor(dateStr);
                    
                    return (
                        <View key={dateStr} style={[styles.dayCell, { backgroundColor }]}>
                            <Text style={styles.dayText}>{format(day, 'd')}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    header: {
        marginBottom: 16,
        alignItems: 'center',
    },
    monthTitle: {
        color: '#F8FAFC',
        fontSize: 18,
        fontWeight: 'bold',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    weekDay: {
        width: '14.28%',
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 12,
        marginBottom: 8,
    },
    dayCell: {
        width: '14.28%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginVertical: 2,
        padding: 2,
    },
    dayText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
});
