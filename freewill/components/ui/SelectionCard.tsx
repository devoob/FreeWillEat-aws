import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, borderRadius, typography } from '@/styles/globalStyles';

interface SelectionCardProps {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  icon,
  selected,
  onPress,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: selected ? `${themeColors.secondary}15` : themeColors.backgroundWhite,
          borderColor: selected ? themeColors.secondary : themeColors.borderLight,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={icon as any}
          size={24}
          color={selected ? themeColors.secondary : themeColors.textSecondary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            {
              color: selected ? themeColors.secondary : themeColors.textPrimary,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.description,
            {
              color: themeColors.textSecondary,
            },
          ]}
        >
          {description}
        </Text>
      </View>
      {selected && (
        <View style={styles.checkContainer}>
          <MaterialIcons
            name="check-circle"
            size={20}
            color={themeColors.secondary}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderRadius: borderRadius.lg,
  borderWidth: 1,
  marginBottom: spacing.md,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
  },
  checkContainer: {
    marginLeft: spacing.sm,
  },
});

export default SelectionCard;
