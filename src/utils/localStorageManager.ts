export interface UserPreferences {
  boardTheme: string;
  pieceStyle: string;
  soundEnabled: boolean;
  autoPromoteToQueen: boolean;
  showMoveHints: boolean;
  animationSpeed: string;
  language: string;
}

export interface GameSession {
  id: string;
  startTime: string;
  endTime?: string;
  opponent: string;
  result?: 'win' | 'loss' | 'draw';
  moves: any[];
  timeControl: string;
  initialRating: number;
  finalRating?: number;
  ratingChange?: number;
}

class LocalStorageManager {
  private preferencesKey = 'chess-user-preferences';
  private sessionsKey = 'chess-game-sessions';
  private bookmarksKey = 'chess-bookmarks';
  private notesKey = 'chess-game-notes';

  // Preferences Management
  getPreferences(): UserPreferences {
    const defaultPreferences: UserPreferences = {
      boardTheme: 'classic',
      pieceStyle: 'classic',
      soundEnabled: true,
      autoPromoteToQueen: false,
      showMoveHints: true,
      animationSpeed: 'normal',
      language: 'en',
    };

    try {
      const stored = localStorage.getItem(this.preferencesKey);
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch (error) {
      console.error('Error reading preferences:', error);
      return defaultPreferences;
    }
  }

  savePreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getPreferences();
    const updated = { ...current, ...preferences };
    
    try {
      localStorage.setItem(this.preferencesKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }

  // Game Sessions Management
  getGameSessions(): GameSession[] {
    try {
      const sessions = localStorage.getItem(this.sessionsKey);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error reading game sessions:', error);
      return [];
    }
  }

  saveGameSession(session: GameSession): void {
    const sessions = this.getGameSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session); // Add to beginning
    }
    
    // Keep only last 500 sessions
    const limitedSessions = sessions.slice(0, 500);
    
    try {
      localStorage.setItem(this.sessionsKey, JSON.stringify(limitedSessions));
    } catch (error) {
      console.error('Error saving game session:', error);
    }
  }

  getRecentSessions(limit: number = 10): GameSession[] {
    const sessions = this.getGameSessions();
    return sessions.slice(0, limit);
  }

  // Bookmarks Management
  getBookmarks(): string[] {
    try {
      const bookmarks = localStorage.getItem(this.bookmarksKey);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error reading bookmarks:', error);
      return [];
    }
  }

  addBookmark(gameId: string): void {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.includes(gameId)) {
      bookmarks.unshift(gameId);
      // Keep only last 100 bookmarks
      const limitedBookmarks = bookmarks.slice(0, 100);
      
      try {
        localStorage.setItem(this.bookmarksKey, JSON.stringify(limitedBookmarks));
      } catch (error) {
        console.error('Error saving bookmark:', error);
      }
    }
  }

  removeBookmark(gameId: string): void {
    const bookmarks = this.getBookmarks();
    const updated = bookmarks.filter(id => id !== gameId);
    
    try {
      localStorage.setItem(this.bookmarksKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  }

  // Notes Management
  getGameNotes(): Record<string, string> {
    try {
      const notes = localStorage.getItem(this.notesKey);
      return notes ? JSON.parse(notes) : {};
    } catch (error) {
      console.error('Error reading game notes:', error);
      return {};
    }
  }

  saveGameNote(gameId: string, note: string): void {
    const notes = this.getGameNotes();
    notes[gameId] = note;
    
    try {
      localStorage.setItem(this.notesKey, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving game note:', error);
    }
  }

  removeGameNote(gameId: string): void {
    const notes = this.getGameNotes();
    delete notes[gameId];
    
    try {
      localStorage.setItem(this.notesKey, JSON.stringify(notes));
    } catch (error) {
      console.error('Error removing game note:', error);
    }
  }

  // Statistics and Analytics
  getPlayingStats(): {
    totalGames: number;
    winRate: number;
    averageGameLength: number;
    favoriteTimeControl: string;
    playingTrends: { date: string; games: number }[];
  } {
    const sessions = this.getGameSessions();
    const completed = sessions.filter(s => s.result);
    
    const wins = completed.filter(s => s.result === 'win').length;
    const winRate = completed.length > 0 ? (wins / completed.length) * 100 : 0;
    
    const timeControls = sessions.reduce((acc, session) => {
      acc[session.timeControl] = (acc[session.timeControl] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteTimeControl = Object.entries(timeControls)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'blitz';
    
    // Calculate average game length (in minutes)
    const gamesWithDuration = sessions.filter(s => s.endTime);
    const averageGameLength = gamesWithDuration.length > 0 
      ? gamesWithDuration.reduce((sum, game) => {
          const duration = new Date(game.endTime!).getTime() - new Date(game.startTime).getTime();
          return sum + (duration / (1000 * 60)); // Convert to minutes
        }, 0) / gamesWithDuration.length
      : 0;
    
    // Playing trends for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = sessions.filter(s => new Date(s.startTime) >= thirtyDaysAgo);
    const playingTrends = this.groupSessionsByDate(recentSessions);
    
    return {
      totalGames: sessions.length,
      winRate,
      averageGameLength,
      favoriteTimeControl,
      playingTrends,
    };
  }

  private groupSessionsByDate(sessions: GameSession[]): { date: string; games: number }[] {
    const grouped = sessions.reduce((acc, session) => {
      const date = new Date(session.startTime).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped)
      .map(([date, games]) => ({ date, games }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Clear all data (for privacy/reset)
  clearAllData(): void {
    const keys = [
      this.preferencesKey,
      this.sessionsKey,
      this.bookmarksKey,
      this.notesKey,
    ];
    
    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error clearing ${key}:`, error);
      }
    });
  }

  // Export data for backup
  exportUserData(): string {
    const data = {
      preferences: this.getPreferences(),
      sessions: this.getGameSessions(),
      bookmarks: this.getBookmarks(),
      notes: this.getGameNotes(),
      exportDate: new Date().toISOString(),
    };
    
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  importUserData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.preferences) {
        localStorage.setItem(this.preferencesKey, JSON.stringify(data.preferences));
      }
      if (data.sessions) {
        localStorage.setItem(this.sessionsKey, JSON.stringify(data.sessions));
      }
      if (data.bookmarks) {
        localStorage.setItem(this.bookmarksKey, JSON.stringify(data.bookmarks));
      }
      if (data.notes) {
        localStorage.setItem(this.notesKey, JSON.stringify(data.notes));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing user data:', error);
      return false;
    }
  }
}

export const localStorageManager = new LocalStorageManager();
