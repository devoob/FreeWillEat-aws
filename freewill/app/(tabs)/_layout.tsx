// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, shadows } from '@/styles/globalStyles';


export default function Layout() {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);


  const styles = StyleSheet.create({
    addButton: {
      position: 'absolute',
      bottom: 42,
      left: '50%',
      marginLeft: -28,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: themeColors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.medium,
      zIndex: 1000,
    },
    modalContent: {
      padding: spacing.lg,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    actionButton: {
      width: '48%',
      height: 120,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: themeColors.secondaryLight,
      borderWidth: 1,
      borderColor: themeColors.borderMedium,
      borderRadius: 12,
      gap: 8,
    },
    actionButtonIcon: {
      marginBottom: 4,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <>
      <Tabs screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: React.ComponentProps<typeof MaterialIcons>['name'] = 'home';

          switch (route.name) {
            case 'home':
              iconName = 'home';
              break;
            default:
              iconName = 'circle'; // fallback icon
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.textSecondary,
        tabBarStyle: {
          backgroundColor: themeColors.backgroundWhite,
          borderTopColor: themeColors.borderLight,
          paddingBottom: 8,
          height: 85,
          paddingHorizontal: 20,
        },
      })}>
        <Tabs.Screen name="home" options={{ headerShown: false, title: 'Home' }}/>
      </Tabs>
    </>
  );
}