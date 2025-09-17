// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/globalStyles';


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
            case 'liked':
              IconComponent = Ionicons;
              iconName = focused ? 'heart' : 'heart-outline';
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
          backgroundColor: themeColors.backgroundWhite,
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 90,
          paddingHorizontal: 20,
          elevation: 0,
          shadowOpacity: 0,
        },
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
          name="liked" 
          options={{ 
            headerShown: false, 
            title: 'Liked',
            tabBarLabel: 'Liked'
          }}
        />
      </Tabs>
    </>
  );
}