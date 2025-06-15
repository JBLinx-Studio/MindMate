
export interface RatingHistory {
  date: string;
  rating: number;
  gameType: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  ratingChange: number;
}

export interface PlayerStatistics {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  longestWinStreak: number;
  averageGameLength: number;
  favoriteOpenings: { name: string; games: number; winRate: number }[];
  timeControlStats: {
    [key: string]: {
      games: number;
      rating: number;
      wins: number;
      losses: number;
      draws: number;
    };
  };
  recentPerformance: {
    last10Games: number; // Rating performance
    last30Days: number;
    thisMonth: number;
  };
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

class RatingSystem {
  private readonly K_FACTOR = 32;
  private readonly PROVISIONAL_GAMES = 20;
  
  calculateRatingChange(
    playerRating: number, 
    opponentRating: number, 
    result: 'win' | 'loss' | 'draw',
    gamesPlayed: number = 100
  ): number {
    const isProvisional = gamesPlayed < this.PROVISIONAL_GAMES;
    const kFactor = isProvisional ? 40 : this.K_FACTOR;
    
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
    
    let actualScore = 0.5; // draw
    if (result === 'win') actualScore = 1;
    if (result === 'loss') actualScore = 0;
    
    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    
    // Prevent rating from going below 100
    const newRating = playerRating + ratingChange;
    if (newRating < 100) {
      return 100 - playerRating;
    }
    
    return ratingChange;
  }

  calculateExpectedScore(playerRating: number, opponentRating: number): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  getRatingCategory(rating: number): {
    title: string;
    range: string;
    color: string;
    percentage: number;
  } {
    if (rating >= 2400) return { 
      title: 'Super Grandmaster', 
      range: '2400+', 
      color: '#ff6b6b', 
      percentage: 0.1 
    };
    if (rating >= 2300) return { 
      title: 'Grandmaster', 
      range: '2300-2399', 
      color: '#4ecdc4', 
      percentage: 0.5 
    };
    if (rating >= 2200) return { 
      title: 'International Master', 
      range: '2200-2299', 
      color: '#45b7d1', 
      percentage: 1.2 
    };
    if (rating >= 2000) return { 
      title: 'Expert', 
      range: '2000-2199', 
      color: '#f9ca24', 
      percentage: 5.8 
    };
    if (rating >= 1800) return { 
      title: 'Class A', 
      range: '1800-1999', 
      color: '#6c5ce7', 
      percentage: 12.5 
    };
    if (rating >= 1600) return { 
      title: 'Class B', 
      range: '1600-1799', 
      color: '#a29bfe', 
      percentage: 22.3 
    };
    if (rating >= 1400) return { 
      title: 'Class C', 
      range: '1400-1599', 
      color: '#fd79a8', 
      percentage: 25.1 
    };
    if (rating >= 1200) return { 
      title: 'Class D', 
      range: '1200-1399', 
      color: '#fdcb6e', 
      percentage: 20.7 
    };
    if (rating >= 1000) return { 
      title: 'Class E', 
      range: '1000-1199', 
      color: '#e17055', 
      percentage: 8.9 
    };
    return { 
      title: 'Beginner', 
      range: '0-999', 
      color: '#636e72', 
      percentage: 2.9 
    };
  }

  checkForAchievements(
    stats: PlayerStatistics, 
    gameResult: 'win' | 'loss' | 'draw',
    currentRating: number,
    previousRating: number
  ): Achievement[] {
    const newAchievements: Achievement[] = [];
    
    // Rating milestones
    const ratingMilestones = [1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400];
    ratingMilestones.forEach(milestone => {
      if (currentRating >= milestone && previousRating < milestone) {
        newAchievements.push({
          id: `rating_${milestone}`,
          name: `Rating ${milestone}`,
          description: `Reached ${milestone} rating!`,
          icon: '🏆',
          unlockedAt: new Date().toISOString(),
          rarity: milestone >= 2000 ? 'epic' : milestone >= 1800 ? 'rare' : 'common'
        });
      }
    });

    // Game milestones
    const gameMilestones = [10, 50, 100, 250, 500, 1000, 2500, 5000];
    gameMilestones.forEach(milestone => {
      if (stats.totalGames === milestone) {
        newAchievements.push({
          id: `games_${milestone}`,
          name: `${milestone} Games`,
          description: `Played ${milestone} games!`,
          icon: '🎯',
          unlockedAt: new Date().toISOString(),
          rarity: milestone >= 1000 ? 'rare' : 'common'
        });
      }
    });

    // Win streaks
    if (gameResult === 'win') {
      const streakMilestones = [5, 10, 15, 20, 25];
      streakMilestones.forEach(milestone => {
        if (stats.currentStreak === milestone) {
          newAchievements.push({
            id: `streak_${milestone}`,
            name: `${milestone} Win Streak`,
            description: `Won ${milestone} games in a row!`,
            icon: '🔥',
            unlockedAt: new Date().toISOString(),
            rarity: milestone >= 15 ? 'epic' : milestone >= 10 ? 'rare' : 'common'
          });
        }
      });
    }

    // Win rate achievements
    if (stats.totalGames >= 20) {
      const winRate = stats.winRate;
      if (winRate >= 80 && !stats.achievements.some(a => a.id === 'winrate_80')) {
        newAchievements.push({
          id: 'winrate_80',
          name: 'Domination',
          description: '80%+ win rate over 20+ games',
          icon: '👑',
          unlockedAt: new Date().toISOString(),
          rarity: 'legendary'
        });
      }
    }

    // Perfect game (no blunders/mistakes)
    // This would be implemented with game analysis

    return newAchievements;
  }

  calculatePerformanceRating(games: { opponentRating: number; result: 'win' | 'loss' | 'draw' }[]): number {
    if (games.length === 0) return 0;
    
    let totalScore = 0;
    let averageOpponentRating = 0;
    
    games.forEach(game => {
      averageOpponentRating += game.opponentRating;
      if (game.result === 'win') totalScore += 1;
      else if (game.result === 'draw') totalScore += 0.5;
    });
    
    averageOpponentRating /= games.length;
    const scorePercentage = totalScore / games.length;
    
    // Performance rating calculation
    if (scorePercentage === 1) return averageOpponentRating + 400;
    if (scorePercentage === 0) return averageOpponentRating - 400;
    
    const expectedScore = scorePercentage;
    const ratingDifference = -400 * Math.log10(1 / expectedScore - 1);
    
    return Math.round(averageOpponentRating + ratingDifference);
  }

  getPlayerTitle(rating: number, achievements: Achievement[]): string {
    const ratingCategory = this.getRatingCategory(rating);
    
    // Special titles based on achievements
    if (achievements.some(a => a.id === 'winrate_80')) return 'Tactical Genius';
    if (achievements.some(a => a.id === 'streak_25')) return 'Unstoppable Force';
    if (achievements.some(a => a.id === 'games_5000')) return 'Chess Veteran';
    
    return ratingCategory.title;
  }

  predictRatingChange(
    playerRating: number,
    opponentRating: number,
    gamesPlayed: number = 100
  ): { win: number; draw: number; loss: number } {
    return {
      win: this.calculateRatingChange(playerRating, opponentRating, 'win', gamesPlayed),
      draw: this.calculateRatingChange(playerRating, opponentRating, 'draw', gamesPlayed),
      loss: this.calculateRatingChange(playerRating, opponentRating, 'loss', gamesPlayed)
    };
  }

  getRatingProgress(currentRating: number): {
    currentCategory: string;
    nextCategory: string;
    pointsToNext: number;
    progressPercentage: number;
  } {
    const current = this.getRatingCategory(currentRating);
    
    // Find next milestone
    const milestones = [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2300, 2400];
    const nextMilestone = milestones.find(m => m > currentRating) || 2500;
    const previousMilestone = milestones.filter(m => m <= currentRating).pop() || 0;
    
    const pointsToNext = nextMilestone - currentRating;
    const progress = (currentRating - previousMilestone) / (nextMilestone - previousMilestone) * 100;
    
    return {
      currentCategory: current.title,
      nextCategory: this.getRatingCategory(nextMilestone).title,
      pointsToNext,
      progressPercentage: Math.max(0, Math.min(100, progress))
    };
  }
}

export const ratingSystem = new RatingSystem();
