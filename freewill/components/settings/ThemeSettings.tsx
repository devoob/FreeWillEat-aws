import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { getColors, spacing, borderRadius, shadows, typography } from '@/styles/globalStyles';
import { MaterialIcons } from '@expo/vector-icons';

// Removed detailed modes list; quick pills handle switching.

interface ThemeSettingsProps {
  showThemeSettings: boolean; // kept for backward compatibility
  onToggle: () => void;       // unused now
}

// mode meta for quick pills
const modeMeta: Record<ThemeMode, { icon: string; label: string }> = {
  system: { icon: 'phone-android', label: 'System' },
  light: { icon: 'light-mode', label: 'Light' },
  dark: { icon: 'dark-mode', label: 'Dark' },
};

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ showThemeSettings, onToggle }) => {
  const { themeMode, setThemeMode, activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  const fadeAnim = useRef(new Animated.Value(showThemeSettings ? 1 : 0)).current;

  useEffect(() => {
    if (showThemeSettings) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    }
  }, [showThemeSettings]);

  return (
    <View style={styles.cardSectionWrapper}>
      <View style={[styles.cardSection]}> 
        <View style={styles.appearanceHeaderRow}>
          <MaterialIcons name="palette" size={22} color={themeColors.textSecondary} />
          <Text style={[styles.appearanceTitle, { color: themeColors.textPrimary }]}>Appearance</Text>
        </View>
        <Text style={[styles.appearanceSubtitle, { color: themeColors.textSecondary }]}>Choose your preferred appearance style • Current: {(themeMode.charAt(0).toUpperCase() + themeMode.slice(1))}</Text>

        {/* Quick pills */}
        <View style={[styles.quickRow, { marginTop: spacing.md, marginBottom: showThemeSettings ? 0 : spacing.lg }]}> 
          {(Object.keys(modeMeta) as ThemeMode[]).map(mode => {
            const active = themeMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.modePill, { backgroundColor: active ? `${themeColors.secondary}20` : themeColors.background, borderColor: active ? themeColors.secondary : themeColors.borderLight }]}
                onPress={() => setThemeMode(mode)}
                activeOpacity={0.7}
              >
                <MaterialIcons name={modeMeta[mode].icon as any} size={18} color={active ? themeColors.secondary : themeColors.textSecondary} />
                <Text style={[styles.modePillText, { color: active ? themeColors.secondary : themeColors.textPrimary }]}>{modeMeta[mode].label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

  <Animated.View style={[styles.contentInner, { opacity: fadeAnim }] }>
            <View style={styles.previewBarWrapper}>
              <View style={[styles.previewBar, { borderColor: themeColors.borderLight, backgroundColor: themeColors.background }]}> 
                <View style={[styles.previewAvatar, { backgroundColor: `${themeColors.secondary}25` }]}> 
                  <MaterialIcons name="restaurant" size={18} color={themeColors.secondary} />
                </View>
                <View style={styles.previewTextBlock}> 
                  <View style={[styles.previewLine, { backgroundColor: themeColors.textSecondary, opacity: 0.5 }]} />
                  <View style={[styles.previewLineShort, { backgroundColor: themeColors.textSecondary, opacity: 0.3 }]} />
                </View>
                <View style={[styles.previewBadge, { backgroundColor: themeColors.secondary }]}> 
                  <Text style={styles.previewBadgeText}>New</Text>
                </View>
              </View>
            </View>

            {/* Modes list removed per request */}
  </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardSectionWrapper: {
    marginBottom: spacing.xs, // tighter spacing to next preferences row
  },
  cardSection: {
    borderWidth: 0,
    borderRadius: 0,
    paddingVertical: spacing.sm,
    marginHorizontal: 0,
    marginBottom: 0,
  },
  appearanceTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.semibold, paddingLeft: 0, paddingRight: spacing.lg },
  appearanceSubtitle: { fontSize: typography.fontSize.sm, paddingLeft: spacing.sm, paddingRight: spacing.lg, marginTop: spacing.xs },
  appearanceHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingLeft: spacing.xs, paddingRight: spacing.lg },
  contentInner: {
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sectionDivider: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: spacing.lg,
  },
  quickRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  modePill: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: 30, borderWidth: 1 },
  modePillText: { marginLeft: spacing.xs, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium },
  previewBarWrapper: { marginBottom: spacing.lg },
  previewBar: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1 },
  previewAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  previewTextBlock: { flex: 1 },
  previewLine: { height: 8, borderRadius: 4, marginBottom: 6 },
  previewLineShort: { height: 8, width: '50%', borderRadius: 4 },
  previewBadge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 20 },
  previewBadgeText: { color: '#fff', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  // Removed styles for list group / rows
});

export default ThemeSettings;