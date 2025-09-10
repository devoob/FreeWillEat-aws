import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/globalStyles';

type Variant = 'primary' | 'secondary' | 'danger' | 'pallet' | 'hero';
type Size = 'small' | 'medium' | 'large';

interface CustomButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
}


const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});


const textSizeStyles = StyleSheet.create({
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
});

const Button: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  className,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: themeColors.primary };
      case 'secondary':
        return { 
          backgroundColor: themeColors.backgroundWhite,
          borderWidth: 1,
          borderColor: themeColors.borderLight,
        };
      case 'danger':
        return { backgroundColor: '#ef4444' };
      case 'pallet':
        return { 
          backgroundColor: themeColors.backgroundWhite,
          borderRadius: 9999,
          paddingHorizontal: 24,
        };
      case 'hero':
        return { 
          backgroundColor: '#fff',
          borderRadius: 30,
          paddingHorizontal: 32,
          paddingVertical: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        };
      default:
        return { backgroundColor: themeColors.primary };
    }
  };

  const getTextColor = () => {
    if (disabled) return themeColors.textLight;
    
    switch (variant) {
      case 'primary':
        return '#fff';
      case 'secondary':
        return themeColors.textSecondary;
      case 'danger':
        return '#fff';
      case 'pallet':
        return themeColors.textPrimary;
      case 'hero':
        return '#1f2937'; // Always dark text for white background
      default:
        return '#fff';
    }
  };

  const getIconColor = () => {
    if (disabled) return themeColors.textLight;
    
    switch (variant) {
      case 'primary':
        return '#fff';
      case 'secondary':
        return themeColors.textSecondary;
      case 'danger':
        return '#fff';
      case 'pallet':
        return themeColors.textPrimary;
      case 'hero':
        return '#1f2937'; // Always dark icon for white background
      default:
        return '#fff';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 20;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.button,
        getVariantStyles(),
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      className={className}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} />
      ) : (
        <>
          {icon && (
            <MaterialIcons
              name={icon}
              size={getIconSize()}
              color={getIconColor()}
            />
          )}
          <Text style={[
            styles.text, 
            { color: getTextColor() },
            textSizeStyles[size],
            disabled && { color: themeColors.textLight },
            textStyle
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
