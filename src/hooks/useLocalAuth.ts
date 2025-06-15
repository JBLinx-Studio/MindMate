
import { useState, useEffect, createContext, useContext } from 'react';
import { localAuthManager, User, AuthState } from '../utils/localAuth';

const AuthContext = createContext<{
  authState: AuthState;
  loginAsGuest: () => void;
  register: (username: string, email?: string) => void;
  logout: () => void;
  updateUserStats: (result: 'win' | 'loss' | 'draw', ratingChange?: number) => void;
} | null>(null);

export const useLocalAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const user = localAuthManager.getCurrentUser();
    if (user) {
      const updatedUser = localAuthManager.updateLastLogin(user);
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const loginAsGuest = () => {
    const user = localAuthManager.createGuestUser();
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const register = (username: string, email?: string) => {
    const user = localAuthManager.registerUser(username, email);
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localAuthManager.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUserStats = (result: 'win' | 'loss' | 'draw', ratingChange: number = 0) => {
    if (authState.user) {
      const updatedUser = localAuthManager.updateUserStats(authState.user, result, ratingChange);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return {
    authState,
    loginAsGuest,
    register,
    logout,
    updateUserStats,
  };
};

export const AuthProvider = AuthContext.Provider;
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
