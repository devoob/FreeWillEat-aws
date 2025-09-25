import React, { useState, useRef, useEffect } from 'react';
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
  Keyboard,
  Image,
  LayoutAnimation,
  UIManager,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, spacing, typography } from '@/styles/globalStyles';
import { getAiRestaurantSuggestion, fetchRestaurants } from '@/services/restaurantService';
import type { Restaurant } from '@/components/ui/SwipeCard';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Message {
  text: string;
  isUser: boolean;
  imageUrl?: string;
  restaurantName?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export default function AIChatScreen() {
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const insets = useSafeAreaInsets();

  // Chat session management
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Load chat sessions on mount
  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = () => {
    // For now, create a default session if none exist
    const defaultSession: ChatSession = {
      id: Date.now().toString(),
      title: 'Restaurant Chat',
      messages: [],
      createdAt: new Date(),
    };
    setChatSessions([defaultSession]);
    setCurrentSessionId(defaultSession.id);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setSidebarVisible(false);
  };

  const deleteChat = (sessionId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setChatSessions(prev => prev.filter(s => s.id !== sessionId));
            if (currentSessionId === sessionId) {
              const remaining = chatSessions.filter(s => s.id !== sessionId);
              if (remaining.length > 0) {
                setCurrentSessionId(remaining[0].id);
                setMessages(remaining[0].messages);
              } else {
                // Create new default session
                const newSession: ChatSession = {
                  id: Date.now().toString(),
                  title: 'Restaurant Chat',
                  messages: [],
                  createdAt: new Date(),
                };
                setChatSessions([newSession]);
                setCurrentSessionId(newSession.id);
                setMessages([]);
              }
            }
          },
        },
      ]
    );
  };

  const switchToChat = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setSidebarVisible(false);
    }
  };

  // Update current session messages when messages change
  useEffect(() => {
    if (currentSessionId) {
      setChatSessions(prev => 
        prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages }
            : session
        )
      );
    }
  }, [messages, currentSessionId]);

  useEffect(() => {
    // Enable smooth layout animation on Android
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    // Preload restaurants for name->image matching
    fetchRestaurants()
      .then(setRestaurants)
      .catch((e) => console.log('Failed to preload restaurants for AI chat images:', e));
  }, []);

  const findRestaurantInText = (text: string): Restaurant | undefined => {
    if (!restaurants || restaurants.length === 0) return undefined;

    const sanitize = (s: string) =>
      s
        .toLowerCase()
        .replace(/[“”"'`]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const lower = sanitize(text);

    // 1) Exact match
    const exact = restaurants.find(r => sanitize(r.name) === lower);
    if (exact) return exact;

    // 2) Includes match (text contains restaurant name)
    let best: { r: Restaurant; score: number } | undefined;
    for (const r of restaurants) {
      const rn = sanitize(r.name);
      if (!rn) continue;
      if (lower.includes(rn)) {
        const score = rn.length;
        if (!best || score > best.score) best = { r, score };
      }
    }
    if (best) return best.r;

    // 3) Try to extract quoted or first line segment and match again
    const quoteMatch = text.match(/"([^"]+)"|“([^”]+)”/);
    const candidateRaw = quoteMatch?.[1] || quoteMatch?.[2] || text.split('\n')[0].split(':').slice(1).join(':');
    if (candidateRaw) {
      const cand = sanitize(candidateRaw);
      const byCandidate = restaurants.find(r => sanitize(r.name) === cand || cand.includes(sanitize(r.name)) || sanitize(r.name).includes(cand));
      if (byCandidate) return byCandidate;
    }

    return undefined;
  };

  // After restaurants load or messages update, try to attach images to AI messages that don't have one yet
  useEffect(() => {
    if (!restaurants.length || !messages.length) return;
    let changed = false;
    const updated = messages.map((m) => {
      if (m.isUser || m.imageUrl) return m;
      const match = findRestaurantInText(m.text);
      if (match) {
        changed = true;
        return { ...m, imageUrl: match.image, restaurantName: match.name };
      }
      return m;
    });
    if (changed) setMessages(updated);
  }, [restaurants, messages.length]);

  const handleSend = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await getAiRestaurantSuggestion(input);
      const match = findRestaurantInText(aiResponse);
      const aiMessage: Message = match
        ? { text: aiResponse, isUser: false, imageUrl: match.image, restaurantName: match.name }
        : { text: aiResponse, isUser: false };
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
    modernHeader: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      backgroundColor: themeColors.backgroundWhite,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderLight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerContent: {
      flex: 1,
      alignItems: 'center',
      gap: 4,
    },
    modernTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: typography.fontSize.sm,
      color: themeColors.textSecondary,
      textAlign: 'center',
    },
    statsBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      backgroundColor: themeColors.backgroundWhite,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderLight,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    statText: {
      fontSize: typography.fontSize.sm,
      color: themeColors.textSecondary,
      fontWeight: typography.fontWeight.medium,
    },
    statDivider: {
      width: 1,
      height: 16,
      backgroundColor: themeColors.borderLight,
      marginHorizontal: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderLight,
    },
    menuButton: {
      padding: spacing.sm,
      borderRadius: 12,
      backgroundColor: themeColors.background,
    },
    title: {
      fontSize: typography.fontSize.huge,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      textAlign: 'center',
    },
    sidebarContainer: {
      flex: 1,
    },
    sidebarHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderLight,
    },
    sidebarTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
    },
    closeButton: {
      padding: spacing.sm,
      borderRadius: 8,
    },
    newChatButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themeColors.secondary,
      marginHorizontal: spacing.lg,
      marginVertical: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: 16,
      gap: spacing.sm,
      shadowColor: themeColors.secondary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    newChatText: {
      color: '#ffffff',
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.bold,
    },
    chatHistory: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    chatHistoryItem: {
      paddingVertical: spacing.md,
      borderRadius: 16,
      marginBottom: spacing.sm,
      backgroundColor: themeColors.background,
      borderWidth: 1,
      borderColor: themeColors.borderLight,
    },
    activeChatItem: {
      backgroundColor: themeColors.backgroundWhite,
      borderColor: themeColors.secondary,
      borderWidth: 2,
    },
    chatItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
    },
    chatItemText: {
      flex: 1,
    },
    chatTitle: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      marginBottom: 2,
    },
    chatDate: {
      fontSize: typography.fontSize.sm,
      color: themeColors.textSecondary,
    },
    deleteButton: {
      padding: spacing.sm,
      borderRadius: 8,
    },
    chatContainer: {
      flex: 1,
      paddingHorizontal: spacing.lg,
    },
    messageContainer: {
      padding: spacing.lg,
      borderRadius: 20,
      marginBottom: spacing.md,
      maxWidth: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    userMessage: {
      backgroundColor: themeColors.secondary,
      alignSelf: 'flex-end',
      borderBottomRightRadius: 8,
    },
    aiMessage: {
      backgroundColor: themeColors.backgroundWhite,
      alignSelf: 'flex-start',
      borderBottomLeftRadius: 8,
      borderWidth: 1,
      borderColor: themeColors.borderLight,
      width: '90%',
    },
    aiImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginTop: spacing.md,
      backgroundColor: themeColors.background,
      overflow: 'hidden',
    },
    messageText: {
      fontSize: typography.fontSize.md,
      lineHeight: 22,
    },
    userMessageText: {
      color: '#ffffff',
      fontWeight: typography.fontWeight.medium,
    },
    aiMessageText: {
      color: themeColors.textPrimary,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.sm,
      backgroundColor: themeColors.backgroundWhite,
      borderTopWidth: 1,
      borderTopColor: themeColors.borderLight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    textInput: {
      flex: 1,
      height: 48,
      fontSize: typography.fontSize.md,
      color: themeColors.textPrimary,
      backgroundColor: themeColors.background,
      paddingVertical: spacing.sm,
    },
    sendButton: {
      marginLeft: spacing.md,
      padding: spacing.md,
      backgroundColor: themeColors.secondary,
      borderRadius: 24,
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: themeColors.secondary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xl,
    },
    emptyTitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.bold,
      color: themeColors.textPrimary,
      textAlign: 'center',
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    emptySubtitle: {
      fontSize: typography.fontSize.md,
      color: themeColors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: spacing.xl,
    },
    suggestionContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: spacing.md,
      maxWidth: width - (spacing.xl * 2),
    },
    suggestionChip: {
      backgroundColor: themeColors.backgroundWhite,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: themeColors.borderLight,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    suggestionText: {
      fontSize: typography.fontSize.sm,
      color: themeColors.textPrimary,
      fontWeight: typography.fontWeight.medium,
    },
    aiMessageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    aiLabel: {
      fontSize: typography.fontSize.sm,
      color: themeColors.secondary,
      fontWeight: typography.fontWeight.semibold,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
    },
    loadingText: {
      fontSize: typography.fontSize.md,
      color: themeColors.textSecondary,
      fontStyle: 'italic',
    },
    searchInputWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.background,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: themeColors.borderLight,
      paddingHorizontal: spacing.lg,
    },
    clearButton: {
      padding: spacing.xs,
      marginLeft: spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Modern Header with Search Theme */}
      <View style={styles.modernHeader}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setSidebarVisible(true)}
        >
          <MaterialIcons name="menu" size={24} color={themeColors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.modernTitle}>AI-Powered Finder</Text>
          <Text style={styles.subtitle}>Intelligent Search Assistant</Text>
        </View>
        <View style={{ width: 48 }} />
      </View>

        {/* Search Stats Bar */}
        {messages.length > 0 && (
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statText}>{messages.length} messages</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statText}>Restaurant search</Text>
            </View>
          </View>
        )}      {/* Chat Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <SafeAreaView style={[styles.sidebarContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Search History</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSidebarVisible(false)}
            >
              <MaterialIcons name="close" size={24} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* New Chat Button */}
          <TouchableOpacity style={styles.newChatButton} onPress={createNewChat}>
            <MaterialIcons name="add-circle" size={20} color="#ffffff" />
            <Text style={styles.newChatText}>New Search Session</Text>
          </TouchableOpacity>

          {/* Chat History */}
          <ScrollView style={styles.chatHistory}>
            {chatSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.chatHistoryItem,
                  session.id === currentSessionId && styles.activeChatItem,
                ]}
                onPress={() => switchToChat(session.id)}
              >
                <View style={styles.chatItemContent}>
                  <MaterialIcons 
                    name="search" 
                    size={20} 
                    color={session.id === currentSessionId ? themeColors.secondary : themeColors.textSecondary} 
                  />
                  <View style={styles.chatItemText}>
                    <Text
                      style={[
                        styles.chatTitle,
                        { color: session.id === currentSessionId ? themeColors.secondary : themeColors.textPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {session.title}
                    </Text>
                    <Text style={styles.chatDate}>
                      {session.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteChat(session.id)}
                  >
                    <MaterialIcons name="delete-outline" size={18} color={themeColors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Modern Main Chat Interface */}
      {messages.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Welcome to AI Restaurant Finder</Text>
          <Text style={styles.emptySubtitle}>
            Ask me anything about restaurants, cuisines, or food preferences. I'll help you find the perfect dining experience!
          </Text>
          <View style={styles.suggestionContainer}>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => setInput("Find me a romantic restaurant for dinner")}
            >
              <Text style={styles.suggestionText}>Romantic dinner</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => setInput("Best sushi restaurants nearby")}
            >
              <Text style={styles.suggestionText}>Best sushi</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => setInput("Family-friendly restaurants with kids menu")}
            >
              <Text style={styles.suggestionText}>Family dining</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.suggestionChip}
              onPress={() => setInput("Vegetarian restaurants with outdoor seating")}
            >
              <Text style={styles.suggestionText}>Vegetarian options</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.chatContainer}
          contentContainerStyle={{
            paddingBottom: spacing.lg,
            paddingTop: messages.length > 0 ? spacing.lg : 0,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="never"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onContentSizeChange={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
              {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageContainer,
                  msg.isUser ? styles.userMessage : styles.aiMessage,
                ]}
              >
                {!msg.isUser && (
                  <View style={styles.aiMessageHeader}>
                    <Text style={styles.aiLabel}>AI-Powered Restaurant Finder</Text>
                  </View>
                )}
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
                {/* If AI provided a restaurant image, show it below the text */}
                {!msg.isUser && msg.imageUrl && (
                  <Image source={{ uri: msg.imageUrl }} style={styles.aiImage} resizeMode="cover" />
                )}
              </View>
            ))}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={themeColors.secondary} />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            )}
        </ScrollView>
      </View>

      {/* Modern Search Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -insets.bottom : 0}
      >
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 70 }]}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Describe your ideal restaurant experience..."
              placeholderTextColor={themeColors.textSecondary}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            {input.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setInput('')}
              >
                <MaterialIcons name="clear" size={18} color={themeColors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: input.trim().length === 0 || loading ? 0.5 : 1 }
            ]}
            onPress={handleSend}
            disabled={loading || input.trim().length === 0}
          >
            {loading ? (
              <ActivityIndicator size={18} color="#ffffff" />
            ) : (
              <MaterialIcons name="send" size={20} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}