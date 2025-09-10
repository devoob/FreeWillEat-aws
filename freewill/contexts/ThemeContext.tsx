import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ActiveTheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  activeTheme: ActiveTheme;
  setThemeMode: (mode: ThemeMode) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'user_theme_preference';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>('light');
  const [loading, setLoading] = useState(true);

  // Get system theme
  const getSystemTheme = (): ActiveTheme => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === 'dark' ? 'dark' : 'light';
  };

  // Calculate active theme based on mode
  const calculateActiveTheme = (mode: ThemeMode): ActiveTheme => {
    switch (mode) {
      case 'light':
        return 'light';
      case 'dark':
        return 'dark';
      case 'system':
        return getSystemTheme();
      default:
        return 'light';
    }
  };

  // Load theme preference from storage
  const loadThemePreference = async () => {
    try {
      const stored = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
      if (stored && ['system', 'light', 'dark'].includes(stored)) {
        const mode = stored as ThemeMode;
        setThemeModeState(mode);
        setActiveTheme(calculateActiveTheme(mode));
      } else {
        // Default to system theme
        setActiveTheme(getSystemTheme());
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
      setActiveTheme(getSystemTheme());
    } finally {
      setLoading(false);
    }
  };

  // Save theme preference to storage
  const saveThemePreference = async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Set theme mode and update active theme
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setActiveTheme(calculateActiveTheme(mode));
    saveThemePreference(mode);
  };

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeMode === 'system') {
        setActiveTheme(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription?.remove();
  }, [themeMode]);

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const value: ThemeContextType = {
    themeMode,
    activeTheme,
    setThemeMode,
    loading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};