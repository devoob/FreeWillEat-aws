import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing } from '@/styles/globalStyles';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/UserContext';

export default function Intro() {
  const { activeTheme } = useTheme();
  const colors = getColors(activeTheme);
  const router = useRouter();
  const { completeOnboarding, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [dietary, setDietary] = useState<string[]>([]);

  const dietaryOptions = ['Vegan', 'Vegetarian', 'Halal', 'Gluten-Free', 'Dairy-Free'];
  const toggleDiet = (option: string) => {
    setDietary(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleNext = async () => {
    if (name.trim()) {
      try {
        await updateUser({ username: name.trim() });
        router.replace('/onboarding/preferences');
      } catch (error: any) {
        console.error('Error saving username:', error);
        if (error.message && error.message.includes('Username already taken')) {
          Alert.alert('Username Taken', 'This username is already taken. Please choose another one.');
        } else {
          Alert.alert('Error', 'Failed to save username. Please try again.');
        }
      }
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      <TouchableOpacity style={styles.skipButton} onPress={() => { completeOnboarding(); router.replace('/home'); }}>
        <Text style={[styles.skipText, { color: colors.secondary }]}>Skip</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDotActive, { backgroundColor: colors.secondary }]} />
          <View style={[styles.progressDot]} />
          <View style={[styles.progressDot]} />
        </View>
        <View style={styles.content}>        
          <Text style={[styles.title, { color: colors.textPrimary }]}>Tell us about you</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>We’ll personalize recommendations based on your profile.</Text>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Username</Text>
            <TextInput
              placeholder="Choose a username"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              style={[styles.textInput, { borderColor: colors.secondary, color: colors.textPrimary }]}
              maxLength={20}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Location</Text>
            <TextInput
              placeholder="City / Region"
              placeholderTextColor={colors.textSecondary}
              value={location}
              onChangeText={setLocation}
              style={[styles.textInput, { borderColor: colors.secondary, color: colors.textPrimary }]}
              maxLength={40}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Dietary Preferences (optional)</Text>
            <View style={styles.chipRow}>
              {dietaryOptions.map(option => {
                const isSelected = dietary.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dietaryChip,
                      {
                        borderColor: colors.secondary,
                        backgroundColor: isSelected ? colors.secondary : 'transparent',
                      }
                    ]}
                    onPress={() => toggleDiet(option)}
                    activeOpacity={1}
                  >
                    <Text style={[
                      styles.dietaryChipText,
                      { color: isSelected ? '#ffffff' : colors.secondary }
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
        <View style={styles.footer}>        
          <TouchableOpacity
            disabled={!name.trim()}
            style={[styles.primaryButton, { backgroundColor: colors.secondary, opacity: name.trim() ? 1 : 0.4 }]}
            onPress={handleNext}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  scrollContent: { paddingBottom: spacing.huge },
  content: { marginTop: spacing.xxxl },
  title: { fontSize: 32, fontWeight: '800', marginBottom: spacing.md },
  subtitle: { fontSize: 16, lineHeight: 22 },
  footer: { },
  primaryButton: { paddingVertical: spacing.lg, borderRadius: 16, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skipButton: { position: 'absolute', top: spacing.massive, right: spacing.md, padding: spacing.sm, zIndex: 10 },
  skipText: { fontSize: 16, fontWeight: '600' },
  fieldGroup: { marginTop: spacing.xl },
  fieldLabel: { fontSize: 13, fontWeight: '600', marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 14 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.sm },
  dietaryChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 12
  },
  dietaryChipText: {
    fontSize: 14,
    fontWeight: '600'
  },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxxl, gap: 8 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.15)' },
  progressDotActive: { width: 24, height: 10, borderRadius: 5 },
});
