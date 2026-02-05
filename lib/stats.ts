import { differenceInDays, isSameDay, subDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export type Schedule = {
    id: string;
    habit_id: string;
    scheduled_date: string;
    completed_at: string | null;
};

export type CalendarStats = Record<string, 'full' | 'partial' | 'none'>;

export function calculateStreak(schedules: Schedule[]): number {
    // 1. Filter only completed schedules
    const completedDates = schedules
        .filter(s => s.completed_at)
        .map(s => s.scheduled_date)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // Descending order

    if (completedDates.length === 0) return 0;

    // Remove duplicates
    const uniqueDates = Array.from(new Set(completedDates));

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    // Check if the most recent completion is today or yesterday to start the count
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0;
    }

    let currentDate = new Date(uniqueDates[0]);

    for (let i = 0; i < uniqueDates.length; i++) {
        // For the first item, we already checked relevant start date
        if (i > 0) {
            const expectedDate = subDays(currentDate, 1);
            const actualDate = parseISO(uniqueDates[i]);

            if (!isSameDay(expectedDate, actualDate)) {
                break;
            }
            currentDate = expectedDate;
        }
        streak++;
    }

    return streak;
}

export function getMonthStats(schedules: Schedule[], currentMonth: Date): CalendarStats {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start, end });

    const stats: CalendarStats = {};

    daysInMonth.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');

        const daySchedules = schedules.filter(s => s.scheduled_date === dateStr);

        if (daySchedules.length === 0) {
            stats[dateStr] = 'none';
            return;
        }

        const completedCount = daySchedules.filter(s => s.completed_at).length;

        if (completedCount === daySchedules.length) {
            stats[dateStr] = 'full';
        } else if (completedCount > 0) {
            stats[dateStr] = 'partial';
        } else {
            stats[dateStr] = 'none';
        }
    });

    return stats;
}

export function getCompletionRate(schedules: Schedule[]): number {
    if (schedules.length === 0) return 0;
    const completed = schedules.filter(s => s.completed_at).length;
    return Math.round((completed / schedules.length) * 100);
}
