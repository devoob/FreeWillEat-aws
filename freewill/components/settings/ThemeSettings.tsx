import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { getColors, spacing, borderRadius } from '@/styles/globalStyles';
import SelectionCard from '@/components/ui/SelectionCard';
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
    icon: 'light-mode' as const,
  },
  {
    value: 'dark' as const,
    title: 'Dark Theme',
    description: 'Dark colors and reduced eye strain',
    icon: 'dark-mode' as const,
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
    <View style={!showThemeSettings ? styles.closedSection : undefined}>
      <CollapsibleSectionHeader
        title="Appearance"
        subtitle={`Choose your preferred theme (Currently: ${activeTheme})`}
        icon="palette"
        isExpanded={showThemeSettings}
        onToggle={onToggle}
      />
      {showThemeSettings && (
        <View style={[
          styles.collapsibleContent,
          {
            backgroundColor: themeColors.backgroundWhite,
            borderColor: themeColors.borderLight,
          }
        ]}>
          <View style={[styles.sectionDivider, { backgroundColor: themeColors.borderLight }]} />
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
  );
};

const styles = StyleSheet.create({
  closedSection: {
    marginBottom: spacing.lg,
  },
  collapsibleContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
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