import { StyleSheet } from 'react-native';
import { ActiveTheme } from '@/contexts/ThemeContext';

// Light theme colors
export const lightColors = {
  // Primary colors
  primary: '#22c55e',
  primaryLight: '#f0fdf4',
  primaryDark: '#16a34a',
  
  // Secondary colors
  secondary: '#f59e0b', // Orange - main accent color used across buttons, active states, etc.
  secondaryLight: '#fef3c7', // Light orange background
  
  // Background colors
  background: '#F2F2F6',
  backgroundWhite: '#ffffff',
  
  // Text colors
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  textLight: '#d1d5db',
  
  // Status colors
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Accent colors
  orange: '#f59e0b',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  red: '#ef4444',
  
  // Border colors
  borderLight: '#e5e7eb',
  borderMedium: '#d1d5db',
  
  // Transparent colors
  overlay: 'rgba(0,0,0,0.3)',
  overlayLight: 'rgba(0,0,0,0.1)',
};

// Dark theme colors
export const darkColors = {
  // Primary colors
  primary: '#22c55e',
  primaryLight: '#064e3b',
  primaryDark: '#16a34a',
  
  // Secondary colors
  secondary: '#f59e0b', // Orange - main accent color used across buttons, active states, etc.
  secondaryLight: '#92400e', // Darker orange for dark theme
  
  // Background colors
  background: '#111827',
  backgroundWhite: '#1f2937',
  
  // Text colors
  textPrimary: '#f9fafb',
  textSecondary: '#d1d5db',
  textTertiary: '#9ca3af',
  textLight: '#6b7280',
  
  // Status colors
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Accent colors
  orange: '#f59e0b',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  red: '#ef4444',
  
  // Border colors
  borderLight: '#374151',
  borderMedium: '#4b5563',
  
  // Transparent colors
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.3)',
};

// Function to get theme-specific colors
export const getColors = (theme: ActiveTheme) => {
  return theme === 'dark' ? darkColors : lightColors;
};

// Default colors (for backwards compatibility)
export const colors = lightColors;

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 60,
};

// Typography
export const typography = {
  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 28,
    massive: 32,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights
  lineHeight: {
    tight: 18,
    normal: 22,
    relaxed: 24,
  },
};

// Border radius
export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

// Shadow styles
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

// Global styles for common patterns
export const globalStyles = StyleSheet.create({
  // Screen containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  safeScreenContainer: {
    alignItems: 'stretch' as const,
  },
  
  // Scroll containers
  scrollContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  
  // Headers
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    alignItems: 'flex-start' as const,
  },
  
  headerCentered: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center' as const,
  },
  
  // Typography
  title: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: typography.lineHeight.normal,
  },
  
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  
  bodyText: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal,
  },
  
  captionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  
  // Sections
  section: {
    marginBottom: spacing.xxxl,
  },
  
  // Cards
  card: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.small,
  },
  
  cardHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  
  cardBody: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  
  cardFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  
  // Buttons
  button: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondaryLight,
    borderWidth: 1,
    borderColor: colors.borderMedium,
  },
  
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  
  buttonTextPrimary: {
    color: colors.backgroundWhite,
  },
  
  buttonTextSecondary: {
    color: colors.textPrimary,
  },
  
  // Form inputs
  textInput: {
    backgroundColor: colors.backgroundWhite,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
  },
  
  textInputFocused: {
    borderColor: colors.primary,
  },
  
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top' as const,
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  loadingText: {
    marginTop: spacing.lg,
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  
  // Empty states
  emptyState: {
    alignItems: 'center' as const,
    paddingVertical: spacing.massive,
  },
  
  emptyStateTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  
  emptyStateSubtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: typography.lineHeight.normal,
    marginBottom: spacing.xxl,
  },
  
  // Utility classes
  flex1: {
    flex: 1,
  },
  
  row: {
    flexDirection: 'row' as const,
  },
  
  column: {
    flexDirection: 'column' as const,
  },
  
  center: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  
  alignCenter: {
    alignItems: 'center' as const,
  },
  
  alignStart: {
    alignItems: 'flex-start' as const,
  },
  
  textCenter: {
    textAlign: 'center' as const,
  },
  
  textLeft: {
    textAlign: 'left' as const,
  },
  
  // Margins and padding
  mt_sm: { marginTop: spacing.sm },
  mt_md: { marginTop: spacing.md },
  mt_lg: { marginTop: spacing.lg },
  mt_xl: { marginTop: spacing.xl },
  mt_xxl: { marginTop: spacing.xxl },
  
  mb_sm: { marginBottom: spacing.sm },
  mb_md: { marginBottom: spacing.md },
  mb_lg: { marginBottom: spacing.lg },
  mb_xl: { marginBottom: spacing.xl },
  mb_xxl: { marginBottom: spacing.xxl },
  
  mr_sm: { marginRight: spacing.sm },
  mr_md: { marginRight: spacing.md },
  mr_lg: { marginRight: spacing.lg },
  
  ml_sm: { marginLeft: spacing.sm },
  ml_md: { marginLeft: spacing.md },
  ml_lg: { marginLeft: spacing.lg },
  
  p_sm: { padding: spacing.sm },
  p_md: { padding: spacing.md },
  p_lg: { padding: spacing.lg },
  p_xl: { padding: spacing.xl },
  
  px_sm: { paddingHorizontal: spacing.sm },
  px_md: { paddingHorizontal: spacing.md },
  px_lg: { paddingHorizontal: spacing.lg },
  px_xl: { paddingHorizontal: spacing.xl },
  
  py_sm: { paddingVertical: spacing.sm },
  py_md: { paddingVertical: spacing.md },
  py_lg: { paddingVertical: spacing.lg },
  py_xl: { paddingVertical: spacing.xl },
});

// Specialized component styles
export const componentStyles = StyleSheet.create({
  // Tab Bar Styles
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    paddingBottom: 8,
    paddingTop: 8,
    height: 90,
    paddingHorizontal: 20,
    elevation: 0,
    shadowOpacity: 0,
  },
  
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    marginTop: 4,
  },
  
  tabBarItem: {
    paddingVertical: 5,
  },

  // Floating Action Button
  fab: {
    position: 'absolute' as const,
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...shadows.large,
  },
  
  // Stats card
  statsCard: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    ...shadows.small,
  },
  
  statItem: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.md,
  },
  
  statContent: {
    flex: 1,
  },
  
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  
  statLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginTop: 2,
  },
  
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
  },
  
  // Tags and chips
  tag: {
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.lg,
  },
  
  tagText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  
  chip: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  
  chipContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  
  modalTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Badges
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
  },
  
  badgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});

// Function to get theme-aware styles
export const getThemeStyles = (theme: ActiveTheme) => {
  const themeColors = getColors(theme);
  
  return StyleSheet.create({
    // Screen containers
    screenContainer: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    
    safeScreenContainer: {
      alignItems: 'stretch' as const,
    },
    
    // Scroll containers
    scrollContainer: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.xl,
      paddingBottom: spacing.xl,
    },
    
    // Headers
    header: {
      paddingTop: spacing.xxl,
      paddingBottom: spacing.xxl,
      alignItems: 'flex-start' as const,
    },
    
    headerCentered: {
      paddingTop: spacing.xl,
      paddingBottom: spacing.xxxl,
      alignItems: 'center' as const,
    },
    
    // Typography
    title: {
      fontSize: typography.fontSize.huge,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      marginBottom: spacing.sm,
    },
    
    subtitle: {
      fontSize: typography.fontSize.lg,
      color: themeColors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: typography.lineHeight.normal,
    },
    
    sectionTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: themeColors.textPrimary,
      marginBottom: spacing.sm,
    },
    
    bodyText: {
      fontSize: typography.fontSize.lg,
      color: themeColors.textPrimary,
      lineHeight: typography.lineHeight.normal,
    },
    
    captionText: {
      fontSize: typography.fontSize.sm,
      color: themeColors.textSecondary,
      fontWeight: typography.fontWeight.medium,
    },
    
    // Sections
    section: {
      marginBottom: spacing.xxxl,
    },
    
    // Cards
    card: {
      backgroundColor: themeColors.backgroundWhite,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: themeColors.borderLight,
      ...shadows.small,
    },
    
    cardHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    
    cardBody: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    
    cardFooter: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.lg,
    },
    
    // Buttons
    button: {
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    
    buttonPrimary: {
      backgroundColor: themeColors.primary,
    },
    
    buttonSecondary: {
      backgroundColor: themeColors.secondaryLight,
      borderWidth: 1,
      borderColor: themeColors.borderMedium,
    },
    
    buttonText: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
    },
    
    buttonTextPrimary: {
      color: themeColors.backgroundWhite,
    },
    
    buttonTextSecondary: {
      color: themeColors.textPrimary,
    },
    
    // Form inputs
    textInput: {
      backgroundColor: themeColors.backgroundWhite,
      borderWidth: 1,
      borderColor: themeColors.borderMedium,
      borderRadius: borderRadius.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      fontSize: typography.fontSize.lg,
      color: themeColors.textPrimary,
    },
    
    textInputFocused: {
      borderColor: themeColors.primary,
    },
    
    textArea: {
      minHeight: 80,
      textAlignVertical: 'top' as const,
    },
    
    // Loading states
    loadingContainer: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    
    loadingText: {
      marginTop: spacing.lg,
      fontSize: typography.fontSize.lg,
      color: themeColors.textSecondary,
    },
    
    // Empty states
    emptyState: {
      alignItems: 'center' as const,
      paddingVertical: spacing.massive,
    },
    
    emptyStateTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: themeColors.textPrimary,
      marginTop: spacing.lg,
      marginBottom: spacing.sm,
    },
    
    emptyStateSubtitle: {
      fontSize: typography.fontSize.lg,
      color: themeColors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: typography.lineHeight.normal,
      marginBottom: spacing.xxl,
    },
    
    // Utility classes
    flex1: {
      flex: 1,
    },
    
    row: {
      flexDirection: 'row' as const,
    },
    
    column: {
      flexDirection: 'column' as const,
    },
    
    center: {
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    
    spaceBetween: {
      justifyContent: 'space-between' as const,
    },
    
    alignCenter: {
      alignItems: 'center' as const,
    },
    
    alignStart: {
      alignItems: 'flex-start' as const,
    },
    
    textCenter: {
      textAlign: 'center' as const,
    },
    
    textLeft: {
      textAlign: 'left' as const,
    },
    
    // Margins and padding
    mt_sm: { marginTop: spacing.sm },
    mt_md: { marginTop: spacing.md },
    mt_lg: { marginTop: spacing.lg },
    mt_xl: { marginTop: spacing.xl },
    mt_xxl: { marginTop: spacing.xxl },
    
    mb_sm: { marginBottom: spacing.sm },
    mb_md: { marginBottom: spacing.md },
    mb_lg: { marginBottom: spacing.lg },
    mb_xl: { marginBottom: spacing.xl },
    mb_xxl: { marginBottom: spacing.xxl },
    
    mr_sm: { marginRight: spacing.sm },
    mr_md: { marginRight: spacing.md },
    mr_lg: { marginRight: spacing.lg },
    
    ml_sm: { marginLeft: spacing.sm },
    ml_md: { marginLeft: spacing.md },
    ml_lg: { marginLeft: spacing.lg },
    
    p_sm: { padding: spacing.sm },
    p_md: { padding: spacing.md },
    p_lg: { padding: spacing.lg },
    p_xl: { padding: spacing.xl },
    
    px_sm: { paddingHorizontal: spacing.sm },
    px_md: { paddingHorizontal: spacing.md },
    px_lg: { paddingHorizontal: spacing.lg },
    px_xl: { paddingHorizontal: spacing.xl },
    
    py_sm: { paddingVertical: spacing.sm },
    py_md: { paddingVertical: spacing.md },
    py_lg: { paddingVertical: spacing.lg },
    py_xl: { paddingVertical: spacing.xl },
  });
};

// Function to get theme-aware component styles
export const getComponentStyles = (theme: ActiveTheme) => {
  const themeColors = getColors(theme);
  
  return StyleSheet.create({
    // Tab Bar Styles (Theme-aware)
    tabBar: {
      backgroundColor: themeColors.backgroundWhite,
      borderTopWidth: 0,
      paddingBottom: 8,
      paddingTop: 8,
      height: 90,
      paddingHorizontal: 20,
      elevation: 0,
      shadowOpacity: 0,
    },
    
    tabBarLabel: {
      fontSize: 12,
      fontWeight: '500' as const,
      marginTop: 4,
    },
    
    tabBarItem: {
      paddingVertical: 5,
    },

    // Floating Action Button
    fab: {
      position: 'absolute' as const,
      bottom: 30,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: themeColors.primary,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      ...shadows.large,
    },
    
    // Stats card
    statsCard: {
      backgroundColor: themeColors.backgroundWhite,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      marginBottom: spacing.xxl,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      ...shadows.small,
    },
    
    statItem: {
      flex: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.md,
    },
    
    statContent: {
      flex: 1,
    },
    
    statValue: {
      fontSize: typography.fontSize.xxl,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
    },
    
    statLabel: {
      fontSize: typography.fontSize.md,
      color: themeColors.textSecondary,
      marginTop: 2,
    },
    
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: themeColors.borderLight,
      marginHorizontal: spacing.lg,
    },
    
    // Tags and chips
    tag: {
      backgroundColor: themeColors.secondaryLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.lg,
    },
    
    tagText: {
      fontSize: typography.fontSize.xs,
      color: themeColors.textSecondary,
      fontWeight: typography.fontWeight.medium,
    },
    
    chip: {
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
    },
    
    chipContainer: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: spacing.sm,
    },
    
    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    
    modalHeader: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'space-between' as const,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderLight,
    },
    
    modalTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      color: themeColors.textPrimary,
    },
    
    closeButton: {
      width: 40,
      height: 40,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    
    // Badges
    badge: {
      backgroundColor: themeColors.primaryLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.md,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: spacing.xs,
    },
    
    badgeText: {
      fontSize: typography.fontSize.xs,
      color: themeColors.primary,
      fontWeight: typography.fontWeight.semibold,
    },

    // Swipe Card Styles
    swipeCardContainer: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingHorizontal: spacing.xl,
    },
    
    swipeCard: {
      borderRadius: 20,
      ...shadows.large,
      backgroundColor: themeColors.backgroundWhite,
    },
    
    swipeCardImage: {
      borderRadius: 20,
    },
    
    swipeCardOverlay: {
      flex: 1,
      borderRadius: 20,
      justifyContent: 'flex-end' as const,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    
    swipeCardContent: {
      padding: spacing.xl,
    },
    
    swipeCardName: {
      fontSize: typography.fontSize.huge,
      fontWeight: typography.fontWeight.bold,
      color: '#ffffff',
      marginBottom: spacing.sm,
    },
    
    swipeCardType: {
      fontSize: typography.fontSize.lg,
      color: '#e5e7eb',
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing.xs,
    },
    
    swipeCardAddress: {
      fontSize: typography.fontSize.md,
      color: '#d1d5db',
    },
    
    swipeActionButtons: {
      flexDirection: 'row' as const,
      justifyContent: 'space-around' as const,
      alignItems: 'center' as const,
      paddingHorizontal: spacing.massive,
      paddingVertical: spacing.xl,
    },
    
    swipeActionButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      ...shadows.medium,
    },
    
    swipeRejectButton: {
      backgroundColor: '#ffffff',
      borderWidth: 2,
      borderColor: '#ef4444',
    },
    
    swipeLikeButton: {
      backgroundColor: themeColors.secondary,
    },
  });
};

export default globalStyles;