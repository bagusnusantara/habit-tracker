import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { router, Stack } from 'expo-router'; // Stack restored
import { Ionicons } from '@expo/vector-icons';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) {
        Alert.alert("Error", "Please fill in both email and password.");
        return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert("Sign In Error", error.message);
    else router.replace('/(tabs)'); // Redirect on success
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!email || !password) {
        Alert.alert("Error", "Please fill in both email and password.");
        return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'habit-tracker://auth/callback',
      }
    });

    if (error) {
        Alert.alert("Sign Up Error", error.message);
    } else if (data.session) {
        // Session exists (auto-confirm enabled), log in immediately
        router.replace('/(tabs)');
    } else {
        // No session (email confirmation required)
        Alert.alert("Success", "Please checks your inbox for email verification!");
    }
    setLoading(false);
  }

  async function signInAnonymously() {
    console.log("Attempting anonymous sign-in...");
    setLoading(true);
    const { error } = await supabase.auth.signInAnonymously();
    if (error) Alert.alert("Anonymous Error", error.message + "\n\nMake sure 'Enable Anonymous Sign-ins' is checked in your Supabase Project Settings > Authentication > Providers.");
    else router.replace('/(tabs)'); // Redirect on success
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
            <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                    <Ionicons name="leaf" size={48} color="#10B981" />
                </View>
            </View>
            <Text style={styles.title}>Habit Tracker</Text>
            <Text style={styles.subtitle}>Build better habits, one day at a time.</Text>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                />
                <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={true}
                onChangeText={setPassword}
                value={password}
                autoCapitalize="none"
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => { console.log('Sign In pressed'); signInWithEmail(); }} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign In'}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => { console.log('Sign Up pressed'); signUpWithEmail(); }} disabled={loading}>
                     <Text style={[styles.buttonText, styles.secondaryText]}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: 'transparent', borderColor: '#94A3B8', borderWidth: 1 }]} onPress={() => { console.log('Guest pressed'); signInAnonymously(); }} disabled={loading}>
                    <Text style={[styles.buttonText, { color: '#94A3B8' }]}>Continue as Guest</Text>
                </TouchableOpacity>
            </View>
        </View>
        <Text style={styles.authorText}>Created by Adetiya Bagus Nusantara & Google Antigravity</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F8FAFC', // Slate 50
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8', // Slate 400
    marginBottom: 24,
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  authorText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#1E293B', // Slate 800
    color: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155', // Slate 700
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#6366F1', // Indigo 500
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366F1',
  },
  secondaryText: {
    color: '#6366F1',
  },
});
