import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/UserContext';
import SafeScreenContainer from '@/components/ui/SafeScreenContainer';
import { getColors, spacing, typography, borderRadius, shadows } from '@/styles/globalStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileMenuItem {
  id: string;
  title: string;
  icon: string;
  iconFamily: 'MaterialIcons' | 'Ionicons';
  color: string;
  backgroundColor: string;
}

const Profile = () => {
  const { activeTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const themeColors = getColors(activeTheme);

  const profileMenuItems: ProfileMenuItem[] = [
    {
      id: 'reservations',
      title: 'Reservations',
      icon: 'restaurant',
      iconFamily: 'MaterialIcons',
      color: '#8B4513',
      backgroundColor: '#F5DEB3',
    },
    {
      id: 'dining-records',
      title: 'Dining Records',
      icon: 'receipt',
      iconFamily: 'MaterialIcons',
      color: '#FF6B35',
      backgroundColor: '#FFE5DB',
    },
    {
      id: 'coupons',
      title: 'Vouchers',
      icon: 'local-offer',
      iconFamily: 'MaterialIcons',
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
    },
    {
      id: 'discounts',
      title: 'Coupons',
      icon: 'discount',
      iconFamily: 'MaterialIcons',
      color: '#2196F3',
      backgroundColor: '#E3F2FD',
    },
    {
      id: 'payment',
      title: 'Payment History',
      icon: 'credit-card',
      iconFamily: 'MaterialIcons',
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
    },
    {
      id: 'search',
      title: 'Search',
      icon: 'search',
      iconFamily: 'MaterialIcons',
      color: '#9C27B0',
      backgroundColor: '#F3E5F5',
    },
  ];

  const handleMenuPress = (itemId: string) => {
    console.log(`Pressed: ${itemId}`);
    // Handle navigation to different sections
  };

  return (
    <SafeScreenContainer style={[{ backgroundColor: themeColors.background }, styles.container]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: themeColors.backgroundWhite }]}>
          <View style={styles.profileTop}>
            <View style={styles.profileLeft}>
              <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>
                <Text style={styles.avatarText}>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: themeColors.textPrimary }]}>
                  {user?.fullName || 'User'}
                </Text>
                <View style={styles.levelContainer}>
                  <Text style={[styles.levelText, { color: themeColors.textSecondary }]}>
                    Level 1
                  </Text>
                  <Text style={[styles.locationText, { color: themeColors.textSecondary }]}>
                    Hong Kong
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.profileRight}>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>0</Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>0</Text>
                  <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Following</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.editButton, { borderColor: themeColors.border }]}>
                <Text style={[styles.editButtonText, { color: themeColors.textSecondary }]}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Points Section */}
        <View style={[styles.pointsSection, { backgroundColor: themeColors.backgroundWhite }]}>
          <Text style={[styles.pointsTitle, { color: themeColors.textSecondary }]}>
            Points Balance
          </Text>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsP}>P</Text>
            </View>
            <Text style={[styles.pointsValue, { color: themeColors.textPrimary }]}>0</Text>
          </View>
          
          <View style={styles.otherPointsContainer}>
            <View style={styles.otherPointsLeft}>
              <Text style={[styles.otherPointsTitle, { color: themeColors.textPrimary }]}>
                Other Points
              </Text>
            </View>
            <View style={styles.otherPointsRight}>
              <Text style={[styles.connectionStatus, { color: themeColors.textSecondary }]}>
                Not Connected
              </Text>
              <Text style={[styles.connectionSubtext, { color: themeColors.textTertiary }]}>
                Asia Miles
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={[styles.menuGrid, { backgroundColor: themeColors.backgroundWhite }]}>
          {profileMenuItems.map((item) => {
            const IconComponent = item.iconFamily === 'MaterialIcons' ? MaterialIcons : Ionicons;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.id)}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: item.backgroundColor }]}>
                  <IconComponent name={item.icon as any} size={28} color={item.color} />
                </View>
                <Text style={[styles.menuItemText, { color: themeColors.textPrimary }]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* OpenRice Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🍚</Text>
            </View>
            <Text style={[styles.logoText, { color: themeColors.secondary }]}>
              FreeWillEat
            </Text>
          </View>
        </View>

        {/* Close Account Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={[styles.closeAccountButton, { borderColor: themeColors.border }]}
            onPress={() => {
              // Handle close account
            }}
          >
            <Text style={[styles.closeAccountText, { color: themeColors.textSecondary }]}>
              Close Account
            </Text>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.massive,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  profileTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    marginLeft: spacing.md,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  levelContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  levelText: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 14,
  },
  profileRight: {
    alignItems: 'flex-end',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  editButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  editButtonText: {
    fontSize: 12,
  },
  pointsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  pointsTitle: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  pointsBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  pointsP: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  otherPointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  otherPointsLeft: {},
  otherPointsTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  otherPointsRight: {
    alignItems: 'flex-end',
  },
  connectionStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  connectionSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  menuItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: spacing.sm,
  },
  logoEmoji: {
    fontSize: 24,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.massive * 2,
    marginBottom: spacing.xl,
  },
  closeAccountButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeAccountText: {
    fontSize: 14,
  },
});

export default Profile;