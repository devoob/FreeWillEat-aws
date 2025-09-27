// app/index.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography } from '@/styles/globalStyles';

export default function Landing() {
  const router = useRouter();
  const { user, onboardingCompleted, loading } = useAuth();
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  useEffect(() => {
    if (!loading) {
      if (user && onboardingCompleted) {
        router.replace('/home');
      } else if (user && !onboardingCompleted) {
        router.replace('/onboarding/intro');
      }
    }
  }, [user, onboardingCompleted, loading, router]);

  if (loading) {
    return null; // splash screen handles it
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}> 
      <StatusBar barStyle={activeTheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.heroContainer}>
  <Image source={require('@/assets/images/tasty-food.jpg')} style={styles.heroImage} />
        <View style={styles.overlay} />
        <View style={styles.heroContent}>
          <Text style={[styles.logo, { color: '#fff' }]}>FreeWillEat</Text>
          <Text style={[styles.tagline, { color: '#fff' }]}>Swipe.Macth.Eat</Text>
        </View>
      </View>
      <View style={styles.bottomPanel}>
        <Text style={[styles.heading, { color: themeColors.textPrimary }]}>Your next favorite meal is a swipe away</Text>
        <Text style={[styles.subheading, { color: themeColors.textSecondary }]}>Find restaurants you'll love, curated just for you.</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: themeColors.secondary }]} onPress={() => router.push('/register')}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { borderColor: themeColors.secondary }]} onPress={() => router.push('/login')}>
            <Text style={[styles.secondaryButtonText, { color: themeColors.secondary }]}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { flex: 0.62, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroContent: { position: 'absolute', bottom: spacing.xl, left: spacing.xl, right: spacing.xl },
  logo: { fontSize: 42, fontWeight: '800', letterSpacing: 0.5 },
  tagline: { fontSize: 16, fontWeight: '500', marginTop: spacing.sm },
  bottomPanel: { flex: 0.38, paddingHorizontal: spacing.xl, paddingTop: spacing.xl },
  heading: { fontSize: 30, fontWeight: '700', marginBottom: spacing.md },
  subheading: { fontSize: 14, lineHeight: 20, marginBottom: spacing.xl },
  actionsRow: { flexDirection: 'row', gap: spacing.md },
  primaryButton: { flex: 1, paddingVertical: spacing.md, borderRadius: 14, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: { flex: 1, paddingVertical: spacing.md, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
});