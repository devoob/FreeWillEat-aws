import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/globalStyles';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

export default function SafeScreenContainer({ children, style, ...props }: ScreenContainerProps) {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 24,
      paddingHorizontal: 0,
      backgroundColor: themeColors.background,
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={[styles.container, style]} edges={['top', 'left', 'right']} {...props}>
      {children}
    </SafeAreaView>
  );
}
