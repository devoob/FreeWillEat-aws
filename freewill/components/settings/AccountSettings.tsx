import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing } from '@/styles/globalStyles';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';

const AccountSettings: React.FC = () => {
  const { logout } = useAuth();
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  return (
    <View>
      <SectionHeader
        title="Account"
        subtitle="Manage your account settings"
        icon="account-circle"
      />
      <View style={[styles.sectionDivider, { backgroundColor: themeColors.borderLight }]} />
      <Button 
        title='Logout' 
        onPress={async () => {
          await logout();
          router.replace('/login');
        }}
        variant="secondary"
        icon="logout"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionDivider: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: spacing.lg,
  },
});

export default AccountSettings;