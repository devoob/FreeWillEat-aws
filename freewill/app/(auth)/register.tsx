import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useAuth } from '@/contexts/UserContext';
import { useRouter } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinkText from '@/components/ui/LinkText';
import Button from '@/components/ui/Button';
import SafeScreenContainer from '@/components/ui/SafeScreenContainer';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  getColors, 
  spacing, 
  typography,
  getThemeStyles 
} from '@/styles/globalStyles';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { activeTheme } = useTheme();
  const themeColors = getColors(activeTheme);
  const themeStyles = getThemeStyles(activeTheme);

  const router = useRouter();

  const { register, resetOnboarding } = useAuth();

  const handleRegister = useCallback(() => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    register(email, password)
      .then(async () => {
        await resetOnboarding(); // ensure onboarding sequence starts fresh for new account
        router.replace('/onboarding/intro');
      })
      .catch((error) => {
        Alert.alert('Error1', error.message,);
      });
  }, [email, password, confirmPassword, register, router]);

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
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Register</Text>

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

          <View style={themeStyles.section}>
            <Text style={[themeStyles.sectionTitle, styles.label]}>Confirm Password</Text>
            <TextInput
              style={[themeStyles.textInput, styles.input]}
              placeholder="••••••••"
              secureTextEntry
              placeholderTextColor={themeColors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <Button 
            title="Register" 
            onPress={handleRegister} 
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: themeColors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <LinkText to="/login">Login</LinkText>
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
  registerButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontSize: typography.fontSize.md,
  },
  backLandingButton: { position: 'absolute', top: spacing.massive, right: spacing.md, zIndex: 10, padding: spacing.sm },
  backLandingText: { fontSize: typography.fontSize.lg, fontWeight: '700', letterSpacing: 0.5 },
});
