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
  username?: string;
};

type SavedRestaurant = {
  id: string;
  name: string;
  image?: string;
  cuisine?: string;
  rating?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  savedRestaurants: SavedRestaurant[];
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  appleLogin: () => Promise<{ needsAccountLinking?: boolean; identityToken?: string }>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  saveRestaurant: (restaurant: SavedRestaurant) => void;
  unsaveRestaurant: (restaurantId: string) => void;
  isRestaurantSaved: (restaurantId: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCALHOST = process.env.EXPO_PUBLIC_LOCALHOST || 'localhost';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedRestaurants, setSavedRestaurants] = useState<SavedRestaurant[]>([]);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const ONBOARDING_KEY = 'onboardingCompleted';

  const saveRestaurant = (restaurant: SavedRestaurant) => {
    setSavedRestaurants(prev => {
      if (!prev.find(r => r.id === restaurant.id)) {
        return [...prev, restaurant];
      }
      return prev;
    });
  };

  const unsaveRestaurant = (restaurantId: string) => {
    setSavedRestaurants(prev => prev.filter(r => r.id !== restaurantId));
  };

  const isRestaurantSaved = (restaurantId: string) => {
    return savedRestaurants.some(r => r.id === restaurantId);
  };

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

  const updateUser = async (updates: Partial<User>) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No token found');

      const res = await fetch(`http://${LOCALHOST}:3001/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        throw new Error(data.msg || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
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

  const loadOnboarding = async () => {
    try {
      const val = await SecureStore.getItemAsync(ONBOARDING_KEY);
      if (val === 'true') setOnboardingCompleted(true);
    } catch {}
  };

  const completeOnboarding = async () => {
    setOnboardingCompleted(true);
    try { await SecureStore.setItemAsync(ONBOARDING_KEY, 'true'); } catch {}
  };

  const resetOnboarding = async () => {
    setOnboardingCompleted(false);
    try { await SecureStore.deleteItemAsync(ONBOARDING_KEY); } catch {}
  };

  useEffect(() => { loadOnboarding(); }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      savedRestaurants,
      onboardingCompleted,
      completeOnboarding,
      resetOnboarding,
      register, 
      login, 
      appleLogin, 
      logout,
      verifyToken,
      setUser,
      updateUser,
      saveRestaurant,
      unsaveRestaurant,
      isRestaurantSaved
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
