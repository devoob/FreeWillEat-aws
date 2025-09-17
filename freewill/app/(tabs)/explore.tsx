import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography } from '@/styles/globalStyles';

export default function ExploreScreen() {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    title: {
      fontSize: typography.fontSize.huge,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      marginBottom: spacing.md,
    },
    subtitle: {
      fontSize: typography.fontSize.lg,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Discover new content and features</Text>
    </SafeAreaView>
  );
}