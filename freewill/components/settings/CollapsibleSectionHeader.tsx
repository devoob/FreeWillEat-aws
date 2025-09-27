import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography, borderRadius } from '@/styles/globalStyles';

interface CollapsibleSectionHeaderProps {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isExpanded: boolean;
  onToggle: () => void;
  iconColor?: string;
}

const CollapsibleSectionHeader: React.FC<CollapsibleSectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  isExpanded,
  onToggle,
  iconColor,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={[
          styles.collapsibleHeader,
          {
            backgroundColor: 'transparent',
          },
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeftRow}>
          <MaterialIcons name={icon} size={24} color={iconColor || themeColors.textPrimary} style={styles.leadingIcon} />
          <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <MaterialIcons
          name={isExpanded ? 'expand-less' : 'expand-more'}
          size={24}
          color={themeColors.textSecondary}
        />
      </TouchableOpacity>

      {!!subtitle && (
        <Text style={[styles.headerSubtitle, { color: themeColors.textSecondary, paddingHorizontal: spacing.lg }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginBottom: 0,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: 0,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  leadingIcon: {
    marginRight: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
    marginTop: spacing.xs,
  },
});

export default CollapsibleSectionHeader;