import React from 'react';
import { Text, Pressable, PressableProps, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, typography } from '@/styles/globalStyles';

interface LinkTextProps extends PressableProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export default function LinkText({ to, className, children, ...props }: LinkTextProps) {
  const router = useRouter();
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  const handlePress = () => {
    router.push(to);
  };

  return (
    <Pressable onPress={handlePress} {...props}>
      <Text style={[styles.linkText, { color: themeColors.secondary }]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linkText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
