
export interface User {
  id: string;
  username: string;
  email?: string;
  isGuest: boolean;
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    theme: string;
    language: string;
    notifications: boolean;
  };
  stats: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    rating: number;
    highestRating: number;
    currentStreak: number;
    longestStreak: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class LocalAuthManager {
  private storageKey = 'chess-auth-user';
  private guestCounter = 'chess-guest-counter';

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.storageKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error reading user data:', error);
      return null;
    }
  }

  createGuestUser(): User {
    const guestNumber = this.getNextGuestNumber();
    const user: User = {
      id: `guest_${Date.now()}`,
      username: `Guest${guestNumber}`,
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        theme: 'classic',
        language: 'en',
        notifications: true,
      },
      stats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        rating: 1200,
        highestRating: 1200,
        currentStreak: 0,
        longestStreak: 0,
      },
    };
    
    this.saveUser(user);
    return user;
  }

  registerUser(username: string, email?: string): User {
    const user: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      isGuest: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        theme: 'classic',
        language: 'en',
        notifications: true,
      },
      stats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        rating: 1200,
        highestRating: 1200,
        currentStreak: 0,
        longestStreak: 0,
      },
    };
    
    this.saveUser(user);
    return user;
  }

  updateUserStats(user: User, gameResult: 'win' | 'loss' | 'draw', ratingChange: number = 0): User {
    const updatedUser = { ...user };
    updatedUser.stats.gamesPlayed++;
    
    switch (gameResult) {
      case 'win':
        updatedUser.stats.wins++;
        updatedUser.stats.currentStreak++;
        updatedUser.stats.longestStreak = Math.max(
          updatedUser.stats.longestStreak,
          updatedUser.stats.currentStreak
        );
        break;
      case 'loss':
        updatedUser.stats.losses++;
        updatedUser.stats.currentStreak = 0;
        break;
      case 'draw':
        updatedUser.stats.draws++;
        break;
    }
    
    updatedUser.stats.rating = Math.max(100, updatedUser.stats.rating + ratingChange);
    updatedUser.stats.highestRating = Math.max(
      updatedUser.stats.highestRating,
      updatedUser.stats.rating
    );
    
    this.saveUser(updatedUser);
    return updatedUser;
  }

  updateLastLogin(user: User): User {
    const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
    this.saveUser(updatedUser);
    return updatedUser;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private getNextGuestNumber(): number {
    const current = parseInt(localStorage.getItem(this.guestCounter) || '0');
    const next = current + 1;
    localStorage.setItem(this.guestCounter, next.toString());
    return next;
  }

  getAllUsers(): User[] {
    // In a real app, this would come from a database
    // For local storage, we'll track users in a separate key
    const usersData = localStorage.getItem('chess-all-users');
    return usersData ? JSON.parse(usersData) : [];
  }

  saveAllUsers(users: User[]): void {
    localStorage.setItem('chess-all-users', JSON.stringify(users));
  }
}

export const localAuthManager = new LocalAuthManager();
