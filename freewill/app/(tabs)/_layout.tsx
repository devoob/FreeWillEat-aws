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

          // Enlarge icons slightly (focused a bit larger)
          const finalSize = focused ? size + 4 : size + 2;
          return <IconComponent name={iconName} size={finalSize} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: themeColors.secondary,
        tabBarInactiveTintColor: themeColors.textTertiary,
        tabBarStyle: {
          backgroundColor: themeColors.backgroundWhite,
          borderTopWidth: 0,
          paddingBottom: 14,
          paddingTop: 14,
          height: 80,
          paddingHorizontal: 20,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}>
        <Tabs.Screen 
          name="home" 
          options={{ 
            headerShown: false, 
             title: 'Home'
          }}
        />
        <Tabs.Screen 
          name="explore" 
          options={{ 
            headerShown: false, 
            title: 'Explore'
          }}
        />
        <Tabs.Screen 
          name="ai-chat" 
          options={{ 
            headerShown: false, 
            title: 'AI Chat'
          }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{ 
            headerShown: false, 
            title: 'Profile'
          }}
        />
        <Tabs.Screen 
          name="settings" 
          options={{ 
            headerShown: false, 
            title: 'Settings'
          }}
        />
      </Tabs>
    </>
  );
}