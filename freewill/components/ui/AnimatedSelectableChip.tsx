import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';
// (Optional) Could migrate to Reanimated later for more performance-driven animations.
// import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type Props = {
  label: string;
  selected: boolean;
  onToggle: () => void;
  activeColor: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

// Using classic Animated from react-native for wide compatibility
// (react-native 0.81 supports interpolateColor on Animated.Value)
import { Animated as RNAnimated } from 'react-native';

export const AnimatedSelectableChip: React.FC<Props> = ({ label, selected, onToggle, activeColor, style, textStyle }) => {
  const pressScale = useRef(new RNAnimated.Value(1)).current;
  const selectValue = useRef(new RNAnimated.Value(selected ? 1 : 0)).current;

  // Animate when selection state changes
  useEffect(() => {
    RNAnimated.timing(selectValue, {
      toValue: selected ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [selected, selectValue]);

  // Background color interpolation
  const backgroundColor = selectValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', activeColor],
  });

  const textColor = selectValue.interpolate({
    inputRange: [0, 1],
    outputRange: [activeColor, '#ffffff'],
  });

  const handlePressIn = () => {
    RNAnimated.spring(pressScale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    RNAnimated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePress = () => {
    // Light haptic feedback (skip on web)
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    onToggle();
    // Pulse if becoming selected
    if (!selected) {
      RNAnimated.sequence([
        RNAnimated.spring(pressScale, { toValue: 1.06, useNativeDriver: true, speed: 20, bounciness: 6 }),
        RNAnimated.spring(pressScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
      ]).start();
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <RNAnimated.View
        style={[
          styles.chip,
          { borderColor: activeColor, backgroundColor, transform: [{ scale: pressScale }] },
          style,
        ]}
      >
        <RNAnimated.Text style={[styles.text, { color: textColor }, textStyle]}>{label}</RNAnimated.Text>
      </RNAnimated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AnimatedSelectableChip;
