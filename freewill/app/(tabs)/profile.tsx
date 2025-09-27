import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
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
  const { user, logout, savedRestaurants } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState((user?.fullName || 'User').substring(0, 7));
  const [location, setLocation] = useState('Hong Kong');
  const [bio, setBio] = useState('Food lover • Exploring tasty spots');
  // Removed tab switching – only showing Saved section statically
  const [selectedRestaurant, setSelectedRestaurant] = useState<any | null>(null);
  const points = 0; // TODO: replace with real points once available
  const level = Math.max(1, Math.floor(points / 500) + 1);

  const router = useRouter();
  const themeColors = getColors(activeTheme);

  const profileMenuItems: ProfileMenuItem[] = [
    {
      id: 'reservations',
      title: 'My Bookings',
      icon: 'event',
      iconFamily: 'MaterialIcons',
      color: '#8B4513',
      backgroundColor: '#F5DEB3',
    },
    {
      id: 'reviews',
      title: 'My Reviews',
      icon: 'rate-review',
      iconFamily: 'MaterialIcons',
      color: '#FF6B35',
      backgroundColor: '#FFE5DB',
    },
    {
      id: 'favorites',
      title: 'Favorites',
      icon: 'favorite',
      iconFamily: 'MaterialIcons',
      color: '#E91E63',
      backgroundColor: '#FCE4EC',
    },
    {
      id: 'points',
      title: 'Rewards',
      icon: 'stars',
      iconFamily: 'MaterialIcons',
      color: '#4CAF50',
      backgroundColor: '#E8F5E8',
    },
    {
      id: 'wallet',
      title: 'My Wallet',
      icon: 'account-balance-wallet',
      iconFamily: 'MaterialIcons',
      color: '#FF9800',
      backgroundColor: '#FFF3E0',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      iconFamily: 'MaterialIcons',
      color: '#607D8B',
      backgroundColor: '#ECEFF1',
    },
  ];

  const handleMenuPress = (itemId: string) => {
    console.log(`Pressed: ${itemId}`);
    // Handle navigation to different sections
  };

  return (
  <SafeScreenContainer style={[{ backgroundColor: themeColors.backgroundWhite }, styles.container]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl, minHeight: '100%' }}>
        {/* Profile Header (Enhanced) */}
        <View style={[styles.profileHeader, { backgroundColor: themeColors.backgroundWhite, borderBottomColor: themeColors.borderLight, borderBottomWidth: StyleSheet.hairlineWidth }]}>          
          {/* Avatar + Stats */}
          <View style={styles.headerRow}>
            <View style={styles.avatarWrapper}>
              <View style={[styles.avatarRing, { borderColor: themeColors.secondary }]}> 
                <View style={[styles.avatar, { backgroundColor: themeColors.secondary }]}>                
                  <Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase() || 'U'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>                
                <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>{savedRestaurants.length}</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Saved</Text>
              </View>
              <View style={styles.statBlock}>                
                <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>0</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Followers</Text>
              </View>
              <View style={styles.statBlock}>                
                <Text style={[styles.statNumber, { color: themeColors.textPrimary }]}>0</Text>
                <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Following</Text>
              </View>
            </View>
          </View>

          {/* Name / Level / Location */}
          <View style={styles.metaSection}>            
            <Text style={[styles.profileName, { color: themeColors.textPrimary }]} numberOfLines={1}>{draftName}</Text>
            <View style={styles.metaRow}>
              <View style={[styles.levelBadge, { backgroundColor: themeColors.secondary + '22', borderColor: themeColors.secondary }]}>                
                <Text style={[styles.levelBadgeText, { color: themeColors.secondary }]}>Lv {level}</Text>
              </View>
              <View style={styles.locationRow}>                
                <MaterialIcons name="place" size={16} color={themeColors.textSecondary} />
                <Text style={[styles.locationValue, { color: themeColors.textSecondary }]} numberOfLines={1}>{location}</Text>
              </View>
            </View>
            {!!bio && <Text style={[styles.bioText, { color: themeColors.textPrimary }]} numberOfLines={3}>{bio}</Text>}
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={[styles.smallActionBtn, { borderColor: themeColors.borderLight }]} onPress={() => setEditing(true)}>
              <Text style={[styles.smallActionBtnText, { color: themeColors.textPrimary }]}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.smallActionBtn, { borderColor: themeColors.borderLight }]}> 
              <Text style={[styles.smallActionBtnText, { color: themeColors.textPrimary }]}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Segmented Control */}
          <View style={[styles.igTabBar, { borderColor: themeColors.borderLight }]}> 
            <View style={styles.igTabItem}> 
              <MaterialIcons name="bookmark" size={22} color={themeColors.textPrimary} />
              <View style={[styles.igIndicator, { backgroundColor: themeColors.secondary }]} />
            </View>
            <View style={styles.igTabItem}> 
              <MaterialIcons name="favorite-border" size={22} color={themeColors.textSecondary} />
              <View style={styles.igIndicatorPlaceholder} />
            </View>
          </View>
        </View>

        {/* Tab Content */}

        {/* Saved Section (static) */}
        <View style={[styles.tabSection, { backgroundColor: themeColors.backgroundWhite }]}> 
          {savedRestaurants.length === 0 ? (
            <View style={styles.emptyTabState}> 
              <MaterialIcons name="bookmark-border" size={48} color={themeColors.textSecondary} />
              <Text style={[styles.emptyTabTitle, { color: themeColors.textPrimary }]}>No saved restaurants</Text>
              <Text style={[styles.emptyTabSubtitle, { color: themeColors.textSecondary }]}>Start saving places you like</Text>
            </View>
          ) : (
            <View style={styles.savedGrid}> 
              {savedRestaurants.map(r => (
                <TouchableOpacity key={r.id} style={styles.savedGridItem} activeOpacity={0.85} onPress={() => setSelectedRestaurant(r)}>
                  {r.image ? (
                    <Image source={{ uri: r.image }} style={styles.savedGridImage} />
                  ) : (
                    <View style={[styles.savedGridPlaceholder, { backgroundColor: themeColors.background }]}> 
                      <MaterialIcons name="restaurant" size={24} color={themeColors.secondary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

  <View style={[styles.pointsSection, { backgroundColor: themeColors.backgroundWhite }]}>          
          <View style={styles.pointsHeaderRow}>
            <Text style={[styles.pointsTitle, { color: themeColors.textSecondary }]}>Points</Text>
            <View style={[styles.tierBadge, { backgroundColor: themeColors.secondary + '22', borderColor: themeColors.secondary }]}> 
              <Text style={[styles.tierBadgeText, { color: themeColors.secondary }]}>Tier: Newbie</Text>
            </View>
          </View>
          <View style={styles.pointsContainer}>
            <View style={styles.pointsBadge}><Text style={styles.pointsP}>P</Text></View>
            <Text style={[styles.pointsValue, { color: themeColors.textPrimary }]}>{points}</Text>
            <View style={styles.pointsNextWrapper}>
              <Text style={[styles.pointsToNext, { color: themeColors.textSecondary }]}>500 pts to Level 2</Text>
              <View style={[styles.progressBar, { backgroundColor: themeColors.background }]}> 
                <View style={[styles.progressFill, { backgroundColor: themeColors.secondary, width: '0%' }]} />
              </View>
              <Text style={[styles.progressHint, { color: themeColors.textTertiary }]}>Earn points by saving & reviewing restaurants</Text>
            </View>
          </View>
          <View style={styles.linkedPrograms}>
            <Text style={[styles.linkedProgramsTitle, { color: themeColors.textPrimary }]}>Linked Programs</Text>
            <View style={styles.programList}>
              <View style={[styles.programRow, { borderColor: themeColors.borderLight }]}> 
                <View style={[styles.programIcon, { backgroundColor: '#002244' }]}>
                  <Text style={styles.programIconText}>AM</Text>
                </View>
                <View style={styles.programInfo}>
                  <Text style={[styles.programName, { color: themeColors.textPrimary }]}>Asia Miles</Text>
                  <Text style={[styles.programStatus, { color: themeColors.textSecondary }]}>Not Connected</Text>
                </View>
                <TouchableOpacity style={[styles.connectBtn, { borderColor: themeColors.secondary }]}> 
                  <Text style={[styles.connectBtnText, { color: themeColors.secondary }]}>Connect</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.programRow, { borderColor: themeColors.borderLight }]}> 
                <View style={[styles.programIcon, { backgroundColor: '#4B2E83' }]}>
                  <Text style={styles.programIconText}>GR</Text>
                </View>
                <View style={styles.programInfo}>
                  <Text style={[styles.programName, { color: themeColors.textPrimary }]}>GrabRewards</Text>
                  <Text style={[styles.programStatus, { color: themeColors.textSecondary }]}>Coming Soon</Text>
                </View>
                <View style={styles.connectBtnDisabled}> 
                  <Text style={[styles.connectBtnTextDisabled, { color: themeColors.textSecondary }]}>Soon</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Saved Restaurant Detail Modal */}
      <Modal
        visible={!!selectedRestaurant}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedRestaurant(null)}
      >
        <View style={styles.detailOverlay}>
          <View style={[styles.detailModalContent, { backgroundColor: themeColors.backgroundWhite }]}>            
            {selectedRestaurant?.image ? (
              <Image source={{ uri: selectedRestaurant.image }} style={styles.detailImage} />
            ) : (
              <View style={[styles.detailImagePlaceholder, { backgroundColor: themeColors.background }]}> 
                <MaterialIcons name="restaurant" size={48} color={themeColors.secondary} />
              </View>
            )}
            <View style={styles.detailBody}>
              <Text style={[styles.detailName, { color: themeColors.textPrimary }]} numberOfLines={2}>
                {selectedRestaurant?.name}
              </Text>
              {selectedRestaurant?.rating && (
                <View style={styles.detailRatingRow}>
                  <MaterialIcons name="star" size={18} color="#FFD700" />
                  <Text style={[styles.detailRatingText, { color: themeColors.textSecondary }]}>{selectedRestaurant.rating}</Text>
                </View>
              )}
              {/* Placeholder for more details (cuisine, address, etc.) */}
              <Text style={[styles.detailPlaceholder, { color: themeColors.textSecondary }]}>More details coming soon...</Text>
            </View>
            <TouchableOpacity style={[styles.detailCloseButton, { backgroundColor: themeColors.secondary }]} onPress={() => setSelectedRestaurant(null)}>
              <Text style={styles.detailCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

  <Modal visible={editing} animationType="slide" transparent onRequestClose={() => setEditing(false)}>
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.backgroundWhite }]}>          
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: themeColors.textPrimary }]}>Edit Profile</Text>
              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: themeColors.textSecondary }]}>Name (max 7 letters)</Text>
                <TextInput 
                  value={draftName} 
                  onChangeText={(text) => {
                    if (text.length <= 7) setDraftName(text);
                  }} 
                  style={[styles.modalInput, { borderColor: (themeColors as any).border || themeColors.textSecondary, color: themeColors.textPrimary }]} 
                  placeholder="Name" 
                  placeholderTextColor={themeColors.textSecondary}
                  maxLength={7}
                  returnKeyType="next"
                />
              </View>
              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: themeColors.textSecondary }]}>Location</Text>
                <TextInput 
                  value={location} 
                  onChangeText={setLocation} 
                  style={[styles.modalInput, { borderColor: (themeColors as any).border || themeColors.textSecondary, color: themeColors.textPrimary }]} 
                  placeholder="Location" 
                  placeholderTextColor={themeColors.textSecondary} 
                  returnKeyType="done"
                />
              </View>
              <View style={styles.modalField}>
                <Text style={[styles.modalLabel, { color: themeColors.textSecondary }]}>Bio (max 100 chars)</Text>
                <TextInput 
                  value={bio} 
                  onChangeText={(t) => { if (t.length <= 100) setBio(t); }} 
                  style={[styles.modalInput, { borderColor: (themeColors as any).border || themeColors.textSecondary, color: themeColors.textPrimary, height: 80, textAlignVertical: 'top' }]} 
                  placeholder="Tell people about your taste..." 
                  placeholderTextColor={themeColors.textSecondary}
                  multiline
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditing(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: themeColors.secondary }]} onPress={() => setEditing(false)}>
                  <Text style={[styles.modalButtonText, { color: '#fff' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    marginBottom: spacing.sm,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  avatarWrapper: { marginRight: spacing.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: { padding: 3, borderWidth: 2, borderRadius: 46 },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileName: { fontSize: 22, fontWeight: '700' },
  metaSection: { marginBottom: spacing.md },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xs },
  levelBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 16, borderWidth: 1 },
  levelBadgeText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  locationRow: { flexDirection: 'row', alignItems: 'center', maxWidth: SCREEN_WIDTH * 0.5, gap: 2 },
  locationValue: { fontSize: 13 },
  bioText: { marginTop: spacing.sm, fontSize: 13, lineHeight: 18 },
  statsRow: { flexDirection: 'row', flex: 1, justifyContent: 'flex-start', gap: spacing.xl },
  statBlock: { alignItems: 'center', marginRight: spacing.xl },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500'
  },
  editProfileFullBtn: { borderWidth: 1, borderRadius: 10, paddingVertical: spacing.sm, alignItems: 'center' },
  editProfileFullText: { fontSize: 14, fontWeight: '600' },
  actionButtonsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  smallActionBtn: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: spacing.sm, alignItems: 'center' },
  smallActionBtnText: { fontSize: 13, fontWeight: '600' },
  highlightsRow: { paddingVertical: spacing.md, paddingRight: spacing.lg },
  highlightItem: { width: 70, alignItems: 'center', marginRight: spacing.md },
  highlightCircle: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  highlightLabel: { fontSize: 11 },
  segmentedControl: { flexDirection: 'row', marginTop: spacing.sm },
  segmentItem: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  segmentLabel: { fontSize: 14, fontWeight: '600' },
  igTabBar: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderBottomWidth: 1, paddingTop: spacing.sm, marginTop: spacing.sm },
  igTabItem: { flex: 1, alignItems: 'center', paddingBottom: 4 },
  igIndicator: { height: 3, width: 28, borderRadius: 2, marginTop: 6 },
  igIndicatorPlaceholder: { height: 3, width: 28, borderRadius: 2, marginTop: 6, opacity: 0 },
  tabSection: { paddingHorizontal: spacing.sm, paddingTop: spacing.md, marginBottom: spacing.lg },
  emptyTabState: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  emptyTabTitle: { fontSize: 16, fontWeight: '600', marginTop: spacing.md },
  emptyTabSubtitle: { fontSize: 12, marginTop: 4 },
  savedGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  savedGridItem: { width: (SCREEN_WIDTH - spacing.sm * 2) / 3, aspectRatio: 1, padding: 2 },
  savedGridImage: { width: '100%', height: '100%', borderRadius: 10 },
  savedGridPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  pointsSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
  },
  pointsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  tierBadge: { paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  tierBadgeText: { fontSize: 12, fontWeight: '600' },
  pointsTitle: {
    fontSize: 14,
    marginBottom: spacing.md,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  pointsNextWrapper: { marginLeft: spacing.lg, flex: 1 },
  pointsToNext: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%' },
  progressHint: { fontSize: 11 },
  linkedPrograms: { marginTop: spacing.lg },
  linkedProgramsTitle: { fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  programList: { gap: spacing.sm },
  programRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderWidth: 1, borderRadius: 14 },
  programIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  programIconText: { color: '#fff', fontWeight: '700' },
  programInfo: { flex: 1 },
  programName: { fontSize: 14, fontWeight: '600' },
  programStatus: { fontSize: 12, marginTop: 2 },
  connectBtn: { borderWidth: 1, borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: 6 },
  connectBtnText: { fontSize: 12, fontWeight: '600' },
  connectBtnDisabled: { borderWidth: 1, borderRadius: 20, paddingHorizontal: spacing.md, paddingVertical: 6, opacity: 0.6, borderStyle: 'dashed' },
  connectBtnTextDisabled: { fontSize: 12, fontWeight: '600' },
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
    paddingBottom: spacing.xl,
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
  savedSection: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, marginBottom: spacing.sm },
  savedTitle: { fontSize: 16, fontWeight: '600', marginBottom: spacing.md },
  savedScroll: {},
  savedCard: { width: 110, marginRight: spacing.md },
  savedImage: { height: 80, width: '100%', borderRadius: 12, marginBottom: spacing.xs },
  savedImagePlaceholder: { height: 80, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.xs },
  savedName: { fontSize: 12, fontWeight: '500', marginBottom: 2 },
  savedRating: { flexDirection: 'row', alignItems: 'center' },
  savedRatingText: { fontSize: 10, marginLeft: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { padding: spacing.lg, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.lg },
  modalField: { marginBottom: spacing.md },
  modalLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  modalInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 14 },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.lg, gap: spacing.md },
  modalButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 8, backgroundColor: '#eee' },
  cancelButton: { backgroundColor: '#ddd' },
  modalButtonText: { fontSize: 14, fontWeight: '600' },
  // Detail modal styles
  detailOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.lg },
  detailModalContent: { borderRadius: 24, overflow: 'hidden' },
  detailImage: { width: '100%', height: 220 },
  detailImagePlaceholder: { width: '100%', height: 220, justifyContent: 'center', alignItems: 'center' },
  detailBody: { padding: spacing.lg },
  detailName: { fontSize: 20, fontWeight: '700', marginBottom: spacing.sm },
  detailRatingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  detailRatingText: { fontSize: 16, marginLeft: 6, fontWeight: '600' },
  detailPlaceholder: { fontSize: 12, marginTop: spacing.sm },
  detailCloseButton: { marginHorizontal: spacing.lg, marginBottom: spacing.lg, paddingVertical: spacing.md, borderRadius: 14, alignItems: 'center' },
  detailCloseText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default Profile;