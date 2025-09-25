import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography } from '@/styles/globalStyles';
import { getAiRestaurantSuggestion } from '@/services/restaurantService';
import { MaterialIcons } from '@expo/vector-icons';

interface Message {
  text: string;
  isUser: boolean;
}

export default function AIChatScreen() {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await getAiRestaurantSuggestion(input);
      const aiMessage: Message = { text: aiResponse, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: 'Sorry, I had trouble getting a suggestion. Please try again.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    title: {
      fontSize: typography.fontSize.huge,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      marginBottom: spacing.md,
      textAlign: 'center',
      paddingTop: spacing.lg,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    messageContainer: {
      padding: spacing.md,
      borderRadius: 12,
      marginBottom: spacing.md,
      maxWidth: '80%',
    },
    userMessage: {
      backgroundColor: themeColors.secondary,
      alignSelf: 'flex-end',
    },
    aiMessage: {
      backgroundColor: themeColors.backgroundWhite,
      alignSelf: 'flex-start',
    },
    messageText: {
      fontSize: typography.fontSize.md,
    },
    userMessageText: {
      color: '#ffffff',
    },
    aiMessageText: {
      color: themeColors.textPrimary,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: themeColors.borderLight,
      backgroundColor: themeColors.backgroundWhite,
      marginBottom: spacing.massive, // Drastically increase spacing to ensure the search bar is much lower
    },
    textInput: {
      flex: 1,
      height: 40,
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      backgroundColor: themeColors.background,
      color: themeColors.textPrimary,
    },
    sendButton: {
      marginLeft: spacing.md,
      padding: spacing.sm,
      backgroundColor: themeColors.secondary,
      borderRadius: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>AI Restaurant Search</Text>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                msg.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  msg.isUser
                    ? styles.userMessageText
                    : styles.aiMessageText,
                ]}
              >
                {msg.text}
              </Text>
            </View>
          ))}
          {loading && (
            <ActivityIndicator
              style={{ alignSelf: 'center' }}
              color={themeColors.secondary}
            />
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder="Ask for a restaurant..."
            placeholderTextColor={themeColors.textSecondary}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={loading}
          >
            <MaterialIcons name="send" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}