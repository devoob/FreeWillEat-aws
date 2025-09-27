import React, { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, Platform, TouchableOpacity } from 'react-native';
import Button from '@/components/ui/Button';
import LinkText from '@/components/ui/LinkText';
import SafeScreenContainer from '@/components/ui/SafeScreenContainer';
import { useAuth } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as SecureStore from 'expo-secure-store';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  getColors, 
  spacing, 
  typography,
  getThemeStyles 
} from '@/styles/globalStyles';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, appleLogin, user } = useAuth();
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  const themeStyles = getThemeStyles(activeTheme);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/home'); // always skip onboarding on login per new requirement
    }
  }, [user, router]);
  

  const handleLogin = useCallback(() => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    login(email, password)
    .then(() => {
      router.replace('/home');
    })
    .catch((error) => {
      Alert.alert('Error', error.message || 'Login failed');
    });
  }, [email, password, login, router]);

  const handleAppleLogin = useCallback(() => {
    appleLogin()
    .then(() => {
      router.replace('/home');
    })
    .catch((error) => {
      console.error('Apple login error:', error);
      Alert.alert('Error', error.message || 'Apple login failed');
    });
  }, [appleLogin, router]);

  return (
    <SafeScreenContainer style={[themeStyles.safeScreenContainer, { backgroundColor: themeColors.background }]}>
      <TouchableOpacity style={styles.backLandingButton} onPress={() => router.replace('/')}> 
        <Text style={[styles.backLandingText, { color: themeColors.secondary }]}>Back</Text>
      </TouchableOpacity>
      <KeyboardAwareScrollView 
        style={themeStyles.scrollContainer}
        contentContainerStyle={[themeStyles.scrollContent, styles.container]}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Login</Text>

          <View style={themeStyles.section}>
            <Text style={[themeStyles.sectionTitle, styles.label]}>Email</Text>
            <TextInput
              style={[themeStyles.textInput, styles.input]}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={themeColors.textSecondary}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={themeStyles.section}>
            <Text style={[themeStyles.sectionTitle, styles.label]}>Password</Text>
            <TextInput
              style={[themeStyles.textInput, styles.input]}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor={themeColors.textSecondary}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button 
            title="Login" 
            onPress={handleLogin} 
            style={styles.loginButton}
          />

          {Platform.OS === 'ios' && (
            <>
              <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: themeColors.borderLight }]} />
                <Text style={[styles.dividerText, { color: themeColors.textSecondary }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: themeColors.borderLight }]} />
              </View>

              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={activeTheme === 'dark' 
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={8}
                style={styles.appleButton}
                onPress={handleAppleLogin}
              />
            </>
          )}

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: themeColors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <LinkText to="/register">Register</LinkText>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: spacing.xxxl,
  },
  formContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  input: {
    marginBottom: spacing.md,
  },
  loginButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    paddingHorizontal: spacing.sm,
  },
  appleButton: {
    width: '100%',
    height: 50,
    marginBottom: spacing.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  registerText: {
    fontSize: typography.fontSize.md,
  },
  backLandingButton: { position: 'absolute', top: spacing.massive, right: spacing.md, zIndex: 10, padding: spacing.sm },
  backLandingText: { fontSize: typography.fontSize.lg, fontWeight: '700', letterSpacing: 0.5 },
});
