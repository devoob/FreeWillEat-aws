import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/globalStyles';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    icon: {
      marginRight: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: themeColors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: themeColors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={24}
            color={themeColors.primary}
            style={styles.icon}
          />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

export default SectionHeader;