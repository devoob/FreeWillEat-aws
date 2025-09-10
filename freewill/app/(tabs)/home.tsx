// app/(tabs)/home.tsx
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated, } from 'react-native'
import React, { useState, useEffect, useRef } from 'react' 
import { useRouter } from 'expo-router'
import { useTheme } from '@/contexts/ThemeContext'
import { MaterialIcons } from '@expo/vector-icons'
import SafeScreenContainer from '@/components/ui/SafeScreenContainer'
import ScrollHeader from '@/components/ui/ScrollHeader'
import { getColors, getThemeStyles, spacing, typography, borderRadius, shadows } from '@/styles/globalStyles'
import api from '@/services/apiClient'
import { useAuth } from '@/contexts/UserContext'


interface StatsData {
  caloriesToday: number;
  caloriesThisMonth: number;
  mealsToday: number;
  mealsThisMonth: number;
  averageCaloriesPerMeal: number;
  weeklyCaloriesTrend: number[];
}

const Home = () => {
  const { activeTheme } = useTheme();
  const router = useRouter();
  const themeColors = getColors(activeTheme);
  const themeStyles = getThemeStyles(activeTheme);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { logout, user } = useAuth();

  return (
    <SafeScreenContainer style={[themeStyles.safeScreenContainer, { backgroundColor: themeColors.background }]}>
      <ScrollHeader title="Dashboard" scrollY={scrollY} />
      <Animated.ScrollView
        style={themeStyles.scrollContainer}
        contentContainerStyle={themeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <TouchableOpacity onPress={async () => {await logout(); router.replace('/login')}}>
          <Text>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </SafeScreenContainer>  
  )
}

export default Home

const styles = StyleSheet.create({
  dashboardContainer: {
    gap: spacing.md,
  },
  widgetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  squareWidget: {
    flex: 1,
    aspectRatio: 1,
  },
  rectangleWidget: {
    flex: 1,
    minHeight: 120,
  },
  // Styles for the custom "View All" widget
  widget: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  viewAllWidget: {
    height: '100%',
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  widgetTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewAllContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});