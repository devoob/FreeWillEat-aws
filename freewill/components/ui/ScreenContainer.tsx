import React from 'react';
import { StyleSheet, ViewProps, View } from 'react-native';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
}

export default function ScreenContainer({ children, style, ...props }: ScreenContainerProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: 'white',
    alignItems: 'center',
  },
});
