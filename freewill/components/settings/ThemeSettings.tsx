import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { getColors, spacing, borderRadius, shadows } from '@/styles/globalStyles';
import SelectionCard from '../ui/SelectionCard';
import CollapsibleSectionHeader from './CollapsibleSectionHeader';

const themeOptions = [
  {
    value: 'system' as const,
    title: 'System Default',
    description: 'Follow your device settings',
    icon: 'phone-android' as const,
  },
  {
    value: 'light' as const,
    title: 'Light Theme',
    description: 'Light colors and bright interface',
    icon: 'wb-sunny' as const,
  },
  {
    value: 'dark' as const,
    title: 'Dark Theme',
    description: 'Dark colors and reduced eye strain',
    icon: 'brightness-2' as const,
  },
];

interface ThemeSettingsProps {
  showThemeSettings: boolean;
  onToggle: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ showThemeSettings, onToggle }) => {
  const { themeMode, setThemeMode, activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  return (
    <View style={styles.cardSectionWrapper}>
      <View
        style={[
          styles.cardSection,
          { backgroundColor: themeColors.backgroundWhite, borderColor: themeColors.borderLight },
        ]}
      >
        <CollapsibleSectionHeader
          title="Appearance"
          subtitle={`Choose your preferred appearance style • Current: ${
            (themeMode.charAt(0).toUpperCase() + themeMode.slice(1)) as string
          }`}
          icon="palette"
          isExpanded={showThemeSettings}
          onToggle={onToggle}
        />

        {showThemeSettings && (
          <View style={styles.contentInner}>
            {themeOptions.map((theme) => (
              <SelectionCard
                key={theme.value}
                title={theme.title}
                description={theme.description}
                icon={theme.icon}
                selected={themeMode === theme.value}
                onPress={() => setThemeMode(theme.value)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardSectionWrapper: {
    marginBottom: spacing.lg,
  },
  cardSection: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  ...shadows.medium,
  },
  contentInner: {
    paddingTop: spacing.md,
  },
  sectionDivider: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: spacing.lg,
  },
});

export default ThemeSettings;