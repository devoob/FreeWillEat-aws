import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Conditional import for Apple Authentication (iOS only)
let AppleAuthentication: any = null;
if (Platform.OS === 'ios') {
  AppleAuthentication = require('expo-apple-authentication');
}

type User = {
  id: string;
  email: string;
  fullName?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  appleLogin: () => Promise<{ needsAccountLinking?: boolean; identityToken?: string }>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCALHOST = process.env.EXPO_PUBLIC_LOCALHOST || 'localhost';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (email: string, password: string) => {
    const res = await fetch(`http://${LOCALHOST}:3001/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      await SecureStore.setItemAsync('token', data.token);
      setUser(data.user);
    } else {
      throw new Error(data.msg || 'Registration failed');
    }
  };

  const login = async (email: string, password: string) => {
    console.log(process.env.LOCALHOST);
    const res = await fetch(`http://${LOCALHOST}:3001/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      await SecureStore.setItemAsync('token', data.token);
      setUser(data.user);
    } else {
      throw new Error(data.msg || 'Login failed');
    }
  };

  const appleLogin = async () => {
    // Check if Apple Authentication is available (iOS only)
    if (Platform.OS !== 'ios' || !AppleAuthentication) {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const res = await fetch(`http://${LOCALHOST}:3001/api/auth/apple`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          user: credential.user,
          email: credential.email,
          fullName: credential.fullName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        await SecureStore.setItemAsync('token', data.token);
        setUser(data.user);
        
        return {
          needsAccountLinking: data.needsAccountLinking,
          identityToken: credential.identityToken,
        };
      } else {
        throw new Error(data.msg || 'Apple login failed');
      }
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        return {};
      }
      throw error;
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  const verifyToken = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
      try {
        const res = await fetch(`http://${LOCALHOST}:3001/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          await logout();
        }
      } catch {
        await logout();
      }
    }
  };

  const updateProfile = async (fullName: string) => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const res = await fetch(`http://${LOCALHOST}:3001/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Update the user state with the new data
        setUser(data.user);
      } else {
        throw new Error(data.msg || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };


  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        try {
          const res = await fetch(`http://${LOCALHOST}:3001/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            await logout();
          }
        } catch {
          await logout();
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, appleLogin, logout, verifyToken, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
