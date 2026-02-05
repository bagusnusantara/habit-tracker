import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';

type Habit = {
  id: string;
  title: string;
  frequency: string;
  preferred_time_of_day: string;
};

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHabits = async () => {
    setRefreshing(true);
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setHabits(data);
    }
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [])
  );

  const renderItem = ({ item }: { item: Habit }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metaRow}>
             <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.frequency}</Text>
             </View>
             <View style={[styles.badge, styles.badgeTime]}>
                <Text style={[styles.badgeText, styles.badgeTimeText]}>{item.preferred_time_of_day}</Text>
             </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => { /* Edit/Delete logic could go here */ }}>
        <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchHabits} tintColor="#6366F1" />
        }
        ListEmptyComponent={
            <View style={styles.empty}>
                <Text style={styles.emptyText}>No habits found.</Text>
            </View>
        }
      />
      <Link href="/add-habit" asChild>
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="add" size={30} color="#FFF" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#CBD5E1',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  badgeTime: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  badgeTimeText: {
    color: '#818CF8',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
  },
});
