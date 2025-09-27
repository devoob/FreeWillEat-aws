import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/UserContext';
import SafeScreenContainer from '@/components/ui/SafeScreenContainer';
import Button from '@/components/ui/Button';
import ThemeSettings from '@/components/settings/ThemeSettings';
import { getColors, spacing, typography, borderRadius, shadows } from '@/styles/globalStyles';

interface MealPreference {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

const Settings = () => {
  const { activeTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const themeColors = getColors(activeTheme);

  const [showMealPrefs, setShowMealPrefs] = useState(false);

  const [mealPreferences, setMealPreferences] = useState<MealPreference[]>([
    { id: 'vegetarian', name: 'Vegetarian', icon: 'eco', enabled: false },
    { id: 'vegan', name: 'Vegan', icon: 'spa', enabled: false },
    { id: 'glutenFree', name: 'Gluten Free', icon: 'no-food', enabled: false },
    { id: 'keto', name: 'Keto', icon: 'fitness-center', enabled: false },
    { id: 'halal', name: 'Halal', icon: 'restaurant', enabled: false },
    { id: 'kosher', name: 'Kosher', icon: 'restaurant-menu', enabled: false },
    { id: 'spicy', name: 'Spicy Food', icon: 'local-fire-department', enabled: true },
    { id: 'seafood', name: 'Seafood', icon: 'set-meal', enabled: true },
  ]);

  const togglePreference = (id: string) => {
    setMealPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const enabledPreferences = mealPreferences.filter(p=>p.enabled).length;

  return (
    <SafeScreenContainer style={[{ backgroundColor: themeColors.backgroundWhite }, styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Compact Header */}
        <Text style={[styles.screenTitle, { color: themeColors.textPrimary }]}>Settings</Text>

        {/* User summary row */}
        <View style={[styles.userCard, { backgroundColor: themeColors.backgroundWhite, borderColor: themeColors.borderLight }]}> 
          <View style={[styles.avatar, { backgroundColor: `${themeColors.secondary}20` }]}> 
            <Text style={{ color: themeColors.secondary, fontWeight: '600', fontSize: 18 }}>
              {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: themeColors.textPrimary }]} numberOfLines={1}>
              {user?.fullName || user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text style={[styles.userSub, { color: themeColors.textSecondary }]} numberOfLines={1}>
              {user?.email || 'No email'}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
        </View>

        {/* Preferences Group */}
        <View style={styles.groupWrapper}>
          <Text style={[styles.groupLabel, { color: themeColors.textSecondary }]}>PREFERENCES</Text>
          <View style={[styles.groupContainer, { backgroundColor: themeColors.backgroundWhite, borderColor: themeColors.borderLight }]}> 
            <View style={[styles.inlineThemeSettings, { paddingTop: spacing.md }]}> 
              <ThemeSettings showThemeSettings={true} onToggle={() => {}} />
            </View>
            <TouchableOpacity style={styles.row} activeOpacity={0.6} onPress={()=> setShowMealPrefs(prev=>!prev)}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="restaurant-menu" size={22} color={themeColors.textSecondary} />
                <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Meal Preferences</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.metaText, { color: themeColors.textSecondary, marginRight: 4 }]}>{enabledPreferences} selected</Text>
                <MaterialIcons name={showMealPrefs ? 'expand-less' : 'expand-more'} size={22} color={themeColors.textSecondary} />
              </View>
            </TouchableOpacity>
            {showMealPrefs && (
              <View style={styles.preferenceList}>
                {mealPreferences.map(pref => (
                  <TouchableOpacity
                    key={pref.id}
                    style={styles.preferenceRow}
                    activeOpacity={0.6}
                    onPress={()=> togglePreference(pref.id)}
                  >
                    <View style={styles.rowLeft}>
                      <MaterialIcons name={pref.icon as any} size={20} color={pref.enabled ? themeColors.secondary : themeColors.textSecondary} />
                      <Text style={[styles.preferenceLabel, { color: pref.enabled ? themeColors.secondary : themeColors.textPrimary }]}>{pref.name}</Text>
                    </View>
                    <MaterialIcons name={pref.enabled ? 'check-circle' : 'radio-button-unchecked'} size={20} color={pref.enabled ? themeColors.secondary : themeColors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.separator} />
            <View style={styles.row}> 
              <View style={styles.rowLeft}>
                <MaterialIcons name="notifications" size={22} color={themeColors.textSecondary} />
                <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Push Notifications</Text>
              </View>
              <Switch value={true} trackColor={{ false: themeColors.borderLight, true: `${themeColors.secondary}50` }} thumbColor={themeColors.secondary} />
            </View>
            <View style={styles.row}> 
              <View style={styles.rowLeft}>
                <MaterialIcons name="location-on" size={22} color={themeColors.textSecondary} />
                <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Location Services</Text>
              </View>
              <Switch value={true} trackColor={{ false: themeColors.borderLight, true: `${themeColors.secondary}50` }} thumbColor={themeColors.secondary} />
            </View>
          </View>
        </View>

        {/* Account & Support */}
        <View style={styles.groupWrapper}>
          <Text style={[styles.groupLabel, { color: themeColors.textSecondary }]}>ACCOUNT & SUPPORT</Text>
          <View style={[styles.groupContainer, { backgroundColor: themeColors.backgroundWhite, borderColor: themeColors.borderLight }]}> 
            <TouchableOpacity style={styles.row} activeOpacity={0.6}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="help" size={22} color={themeColors.textSecondary} />
                <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Help & Support</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} activeOpacity={0.6}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="privacy-tip" size={22} color={themeColors.textSecondary} />
                <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>Privacy Policy</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} activeOpacity={0.6}>
              <View style={styles.rowLeft}>
                <MaterialIcons name="info" size={22} color={themeColors.textSecondary} />
                <Text style={[styles.rowText, { color: themeColors.textPrimary }]}>About</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={themeColors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger / Logout */}
        <View style={[styles.groupContainer, styles.logoutContainer, { backgroundColor: themeColors.backgroundWhite, borderColor: themeColors.borderLight }]}> 
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={handleLogout}>
            <View style={styles.rowLeft}>
              <MaterialIcons name="logout" size={22} color={themeColors.error || themeColors.secondary} />
              <Text style={[styles.rowText, { color: themeColors.error || '#d00' }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: { paddingBottom: spacing.huge },
  screenTitle: { fontSize: typography.fontSize.xxl, fontWeight: typography.fontWeight.bold, marginHorizontal: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.lg },
  userCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.xl, borderRadius: borderRadius.lg, borderWidth: 1 },
  avatar: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  userName: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold },
  userSub: { fontSize: typography.fontSize.sm },
  groupWrapper: { marginBottom: spacing.xl },
  groupLabel: { fontSize: typography.fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginLeft: spacing.lg, marginBottom: spacing.sm },
  groupContainer: { marginHorizontal: spacing.lg, borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.lg, paddingHorizontal: spacing.lg },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowText: { marginLeft: spacing.md, fontSize: typography.fontSize.md, flex: 1 },
  metaText: { fontSize: typography.fontSize.sm },
  separator: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginHorizontal: spacing.lg },
  inlineThemeSettings: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  // Reduce bottom spacing specifically for appearance section tightness
  logoutContainer: { marginTop: spacing.xl },
  preferenceList: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: 4 },
  preferenceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  preferenceLabel: { marginLeft: spacing.md, fontSize: typography.fontSize.md },
});

export default Settings;