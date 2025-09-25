// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/globalStyles';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';


export default function Layout() {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  return (
    <>
      <Tabs screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent: any = MaterialIcons;
          let iconName: string = 'home';

          switch (route.name) {
            case 'home':
              IconComponent = MaterialIcons;
              iconName = 'home';
              break;
            case 'explore':
              IconComponent = MaterialIcons;
              iconName = 'grid-view';
              break;
            case 'ai-chat':
              IconComponent = Ionicons;
              iconName = 'chatbubble';
              break;
            case 'profile':
              IconComponent = Ionicons;
              iconName = 'person';
              break;
            case 'settings':
              IconComponent = Ionicons;
              iconName = 'settings';
              break;
            default:
              IconComponent = MaterialIcons;
              iconName = 'circle';
          }

          return <IconComponent name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.secondary,
        tabBarInactiveTintColor: themeColors.textTertiary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 90,
          paddingHorizontal: 20,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === 'ios' ? 100 : 80}
            tint={activeTheme === 'dark' ? 'dark' : 'light'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              backgroundColor: activeTheme === 'dark'
                ? 'rgba(0, 0, 0, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              overflow: 'hidden',
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}>
        <Tabs.Screen 
          name="home" 
          options={{ 
            headerShown: false, 
            title: 'Discover',
            tabBarLabel: 'Discover'
          }}
        />
        <Tabs.Screen 
          name="explore" 
          options={{ 
            headerShown: false, 
            title: 'Explore',
            tabBarLabel: 'Explore'
          }}
        />
        <Tabs.Screen 
          name="ai-chat" 
          options={{ 
            headerShown: false, 
            title: 'AI Chat',
            tabBarLabel: 'AI Chat'
          }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            headerShown: false, 
            title: 'Profile',
            tabBarLabel: 'Profile'
          }}
        />
        <Tabs.Screen 
          name="settings" 
          options={{ 
            headerShown: false, 
            title: 'Settings',
            tabBarLabel: 'Settings'
          }}
        />
      </Tabs>
    </>
  );
}