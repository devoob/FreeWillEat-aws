import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AnimatedSelectableChip from '@/components/ui/AnimatedSelectableChip';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing } from '@/styles/globalStyles';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/UserContext';

const GOALS = ['Discover new places', 'Healthy eating', 'Budget friendly', 'Luxury dining', 'Quick meals'];

export default function Goals() {
  const { activeTheme } = useTheme();
  const colors = getColors(activeTheme);
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (g: string) => setSelected(prev => prev.includes(g) ? prev.filter(i => i !== g) : [...prev, g]);
  const finish = () => { completeOnboarding(); router.replace('/home'); };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>      
      <TouchableOpacity style={styles.skipButton} onPress={() => { completeOnboarding(); router.replace('/home'); }}>
        <Text style={[styles.skipText, { color: colors.secondary }]}>Skip</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, { backgroundColor: 'rgba(0,0,0,0.15)' }]} />
          <View style={[styles.progressDot, { backgroundColor: 'rgba(0,0,0,0.15)' }]} />
            <View style={[styles.progressDotActive, { backgroundColor: colors.secondary }]} />
        </View>
        <View style={styles.content}>        
          <Text style={[styles.title, { color: colors.textPrimary }]}>Your goals</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Help us fine-tune your recommendations.</Text>
          <View style={styles.grid}>
            {GOALS.map(g => (
              <AnimatedSelectableChip
                key={g}
                label={g}
                selected={selected.includes(g)}
                onToggle={() => toggle(g)}
                activeColor={colors.secondary}
              />
            ))}
          </View>
        </View>
        <View style={styles.footer}>        
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.secondary, opacity: selected.length === 0 ? 0.5 : 1 }]} onPress={finish} disabled={selected.length === 0}>
            <Text style={styles.primaryButtonText}>Finish</Text>
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
  title: { fontSize: 30, fontWeight: '800', marginBottom: spacing.md },
  subtitle: { fontSize: 14, lineHeight: 20, marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 24, borderWidth: 1, marginRight: 8, marginBottom: 12 },
  chipText: { fontSize: 14, fontWeight: '600' },
  footer: {},
  primaryButton: { paddingVertical: spacing.lg, borderRadius: 16, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skipButton: { position: 'absolute', top: spacing.massive, right: spacing.md, padding: spacing.sm, zIndex: 10 },
  skipText: { fontSize: 16, fontWeight: '600' },
  progressContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxxl, gap: 8 },
  progressDot: { width: 10, height: 10, borderRadius: 5 },
  progressDotActive: { width: 24, height: 10, borderRadius: 5 },
});
