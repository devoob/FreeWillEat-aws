import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/UserContext';
import SafeScreenContainer from '@/components/ui/SafeScreenContainer';
import Button from '@/components/ui/Button';
import { getColors, spacing, typography, borderRadius, shadows } from '@/styles/globalStyles';

interface MealPreference {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

const Settings = () => {
  const { activeTheme, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const themeColors = getColors(activeTheme);

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

  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

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

  return (
    <SafeScreenContainer style={[{ backgroundColor: themeColors.background }, styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
            Settings
          </Text>
        </View>

        {/* Profile Section */}
        <View style={[styles.section, { backgroundColor: themeColors.backgroundWhite }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="person" size={24} color={themeColors.secondary} />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Profile
            </Text>
          </View>
          
          <View style={styles.profileInfo}>
            <View style={[styles.profileAvatar, { backgroundColor: themeColors.secondary }]}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: themeColors.textPrimary }]}>
                {user?.email || 'User'}
              </Text>
              <Text style={[styles.profileEmail, { color: themeColors.textSecondary }]}>
                Member since today
              </Text>
            </View>
          </View>
        </View>

        {/* Meal Preferences Section */}
        <View style={[styles.section, { backgroundColor: themeColors.backgroundWhite }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="restaurant-menu" size={24} color={themeColors.secondary} />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Meal Preferences
            </Text>
          </View>
          
          <Text style={[styles.sectionDescription, { color: themeColors.textSecondary }]}>
            Select your dietary preferences to get better restaurant recommendations
          </Text>

          <View style={styles.preferencesGrid}>
            {mealPreferences.map((preference) => (
              <TouchableOpacity
                key={preference.id}
                style={[
                  styles.preferenceCard,
                  {
                    backgroundColor: preference.enabled 
                      ? `${themeColors.secondary}15` 
                      : themeColors.background,
                    borderColor: preference.enabled 
                      ? themeColors.secondary 
                      : themeColors.border,
                  }
                ]}
                onPress={() => togglePreference(preference.id)}
              >
                <MaterialIcons 
                  name={preference.icon as any} 
                  size={24} 
                  color={preference.enabled ? themeColors.secondary : themeColors.textSecondary} 
                />
                <Text style={[
                  styles.preferenceText,
                  { 
                    color: preference.enabled 
                      ? themeColors.secondary 
                      : themeColors.textSecondary 
                  }
                ]}>
                  {preference.name}
                </Text>
                {preference.enabled && (
                  <MaterialIcons 
                    name="check-circle" 
                    size={20} 
                    color={themeColors.secondary} 
                    style={styles.checkIcon}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Settings Section */}
        <View style={[styles.section, { backgroundColor: themeColors.backgroundWhite }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="settings" size={24} color={themeColors.secondary} />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              App Settings
            </Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon" size={20} color={themeColors.textSecondary} />
              <Text style={[styles.settingText, { color: themeColors.textPrimary }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={activeTheme === 'dark'}
              onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
              trackColor={{ false: themeColors.border, true: `${themeColors.secondary}50` }}
              thumbColor={activeTheme === 'dark' ? themeColors.secondary : '#f4f3f4'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={20} color={themeColors.textSecondary} />
              <Text style={[styles.settingText, { color: themeColors.textPrimary }]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: themeColors.border, true: `${themeColors.secondary}50` }}
              thumbColor={pushNotifications ? themeColors.secondary : '#f4f3f4'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="location-on" size={20} color={themeColors.textSecondary} />
              <Text style={[styles.settingText, { color: themeColors.textPrimary }]}>
                Location Services
              </Text>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: themeColors.border, true: `${themeColors.secondary}50` }}
              thumbColor={locationServices ? themeColors.secondary : '#f4f3f4'}
            />
          </TouchableOpacity>
        </View>

        {/* Account Actions */}
        <View style={[styles.section, { backgroundColor: themeColors.backgroundWhite }]}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="account-circle" size={24} color={themeColors.secondary} />
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
              Account
            </Text>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={20} color={themeColors.textSecondary} />
              <Text style={[styles.settingText, { color: themeColors.textPrimary }]}>
                Help & Support
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="privacy-tip" size={20} color={themeColors.textSecondary} />
              <Text style={[styles.settingText, { color: themeColors.textPrimary }]}>
                Privacy Policy
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="info" size={20} color={themeColors.textSecondary} />
              <Text style={[styles.settingText, { color: themeColors.textPrimary }]}>
                About
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            variant="danger"
            onPress={handleLogout}
            icon="logout"
          />
        </View>
      </ScrollView>
    </SafeScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  sectionDescription: {
    fontSize: typography.fontSize.md,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#ffffff',
  },
  profileDetails: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  profileEmail: {
    fontSize: typography.fontSize.md,
    marginTop: spacing.xs,
  },
  preferencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  preferenceCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
    position: 'relative',
  },
  preferenceText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  checkIcon: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: typography.fontSize.md,
    marginLeft: spacing.md,
    flex: 1,
  },
  logoutSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
});

export default Settings;