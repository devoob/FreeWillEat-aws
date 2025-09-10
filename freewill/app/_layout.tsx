import { Stack } from 'expo-router'
import './globals.css'
import { AuthProvider } from '@/contexts/UserContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
              <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
            </Stack>
          </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  )
}