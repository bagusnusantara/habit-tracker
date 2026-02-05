import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '../lib/supabase';
import { router, Stack } from 'expo-router';

export default function AddHabit() {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [loading, setLoading] = useState(false);

  const saveHabit = async () => {
    if (!title.trim()) return Alert.alert('Validation', 'Please enter a habit title.');
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        Alert.alert('Error', 'You must be logged in.');
        setLoading(false);
        return;
    }

    const { error } = await supabase.from('habits').insert({
        user_id: user.id,
        title: title.trim(),
        frequency,
        preferred_time_of_day: timeOfDay,
    });

    setLoading(false);

    if (error) {
        Alert.alert('Error', error.message);
    } else {
        router.back();
    }
  };

  const Option = ({ label, value, selected, onSelect }: any) => (
       <TouchableOpacity 
           style={[styles.option, selected === value && styles.optionSelected]} 
           onPress={() => onSelect(value)}
           activeOpacity={0.7}
       >
           <Text style={[styles.optionText, selected === value && styles.optionTextSelected]}>{label}</Text>
       </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                 <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Habit</Text>
            <TouchableOpacity onPress={saveHabit} disabled={loading} style={styles.headerBtn}>
                 <Text style={[styles.saveText, loading && { opacity: 0.5 }]}>Save</Text>
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
            <View style={styles.section}>
                <Text style={styles.label}>Name</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="E.g., Drink water, Read a book" 
                    placeholderTextColor="#64748B"
                    value={title}
                    onChangeText={setTitle}
                    autoFocus
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Frequency</Text>
                <View style={styles.optionsRow}>
                    <Option label="Daily" value="daily" selected={frequency} onSelect={setFrequency} />
                    <Option label="Weekly" value="weekly" selected={frequency} onSelect={setFrequency} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Time of Day</Text>
                <View style={[styles.optionsRow, { flexWrap: 'wrap' }]}>
                     <Option label="Morning" value="morning" selected={timeOfDay} onSelect={setTimeOfDay} />
                     <Option label="Afternoon" value="afternoon" selected={timeOfDay} onSelect={setTimeOfDay} />
                     <Option label="Evening" value="evening" selected={timeOfDay} onSelect={setTimeOfDay} />
                </View>
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 20, // adjust for status bar if needed, modal usually handles it
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  headerBtn: {
    padding: 8,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '600',
  },
  closeText: {
    color: '#94A3B8',
    fontSize: 17,
  },
  saveText: {
    color: '#6366F1',
    fontSize: 17,
    fontWeight: '600',
  },
  form: {
    padding: 24,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#1E293B',
    color: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  optionText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
});
