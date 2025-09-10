import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/globalStyles';

interface ScrollHeaderProps {
  title: string;
  scrollY: Animated.Value;
  threshold?: number;
}

const ScrollHeader: React.FC<ScrollHeaderProps> = ({ 
  title, 
  scrollY, 
  threshold = 50 
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, threshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, threshold],
    outputRange: [-80, 0],
    extrapolate: 'clamp',
  });

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  const styles = StyleSheet.create({
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: themeColors.backgroundWhite,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderLight,
      paddingHorizontal: 20,
      paddingBottom: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: themeColors.textPrimary,
      textAlign: 'center',
    },
  });

  return (
    <Animated.View 
      style={[
        styles.header,
        {
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
          paddingTop: statusBarHeight,
        }
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  );
};

export default ScrollHeader;