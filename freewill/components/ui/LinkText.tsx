import React from 'react';
import { Text, Pressable, PressableProps } from 'react-native';
import { useRouter } from 'expo-router';

interface LinkTextProps extends PressableProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export default function LinkText({ to, className = 'text-blue-600 font-semibold', children, ...props }: LinkTextProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(to);
  };

  return (
    <Pressable onPress={handlePress} {...props}>
      <Text className={className}>
        {children}
      </Text>
    </Pressable>
  );
}
