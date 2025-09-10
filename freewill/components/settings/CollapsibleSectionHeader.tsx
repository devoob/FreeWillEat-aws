import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography, borderRadius } from '@/styles/globalStyles';

interface CollapsibleSectionHeaderProps {
  title: string;
  subtitle: string;
  icon: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const CollapsibleSectionHeader: React.FC<CollapsibleSectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  isExpanded,
  onToggle,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  return (
    <TouchableOpacity
      style={[
        styles.collapsibleHeader, 
        { 
          backgroundColor: themeColors.backgroundWhite, 
          borderColor: themeColors.borderLight,
          borderBottomWidth: isExpanded ? 0 : 1,
          borderBottomLeftRadius: isExpanded ? 0 : borderRadius.md,
          borderBottomRightRadius: isExpanded ? 0 : borderRadius.md,
        }
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.headerContent}>
        <MaterialIcons name={icon as any} size={24} color={themeColors.primary} />
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>{title}</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>
        </View>
      </View>
      <MaterialIcons 
        name={isExpanded ? 'expand-less' : 'expand-more'} 
        size={24} 
        color={themeColors.textSecondary} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
  },
});

export default CollapsibleSectionHeader;