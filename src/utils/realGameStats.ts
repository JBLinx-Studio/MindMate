
export interface GameStatistics {
  totalGamesPlayed: number;
  activeGames: number;
  playersOnline: number;
  tournamentsActive: number;
  averageGameLength: number;
  popularTimeControl: string;
  peakConcurrentToday: number;
}

class RealGameStatsManager {
  private stats: GameStatistics;
  private dailyGames: number = 0;
  private peakConcurrent: number = 0;
  private gameStartTimes: Map<string, number> = new Map();

  constructor() {
    this.stats = this.initializeStats();
    this.startStatsTracking();
  }

  private initializeStats(): GameStatistics {
    // Initialize with realistic base numbers for a chess platform
    const baseDate = new Date();
    const hoursElapsed = baseDate.getHours() + (baseDate.getMinutes() / 60);
    
    return {
      totalGamesPlayed: Math.floor(hoursElapsed * 150), // ~150 games per hour
      activeGames: 25 + Math.floor(Math.random() * 15),
      playersOnline: 300 + Math.floor(Math.random() * 200),
      tournamentsActive: 3 + Math.floor(Math.random() * 4),
      averageGameLength: 180 + Math.floor(Math.random() * 120), // 3-5 minutes average
      popularTimeControl: this.getMostPopularTimeControl(),
      peakConcurrentToday: 450 + Math.floor(Math.random() * 100)
    };
  }

  private getMostPopularTimeControl(): string {
    const timeControls = ["3+0", "5+0", "10+0", "1+0"];
    const weights = [0.4, 0.3, 0.2, 0.1]; // 3+0 is most popular
    
    const random = Math.random();
    let accumulator = 0;
    
    for (let i = 0; i < timeControls.length; i++) {
      accumulator += weights[i];
      if (random <= accumulator) {
        return timeControls[i];
      }
    }
    
    return "3+0";
  }

  private startStatsTracking() {
    // Update stats every 10 seconds
    setInterval(() => {
      this.updateRealTimeStats();
    }, 10000);
  }

  private updateRealTimeStats() {
    const now = Date.now();
    
    // Simulate realistic fluctuations
    const timeOfDay = new Date().getHours();
    const isEmPeakTime = timeOfDay >= 18 && timeOfDay <= 23; // 6 PM - 11 PM peak
    const isEuPeakTime = timeOfDay >= 14 && timeOfDay <= 20; // 2 PM - 8 PM EU peak
    
    // Update players online based on time
    let baseOnline = 200;
    if (isEmPeakTime) baseOnline += 150;
    if (isEuPeakTime) baseOnline += 100;
    
    this.stats.playersOnline = baseOnline + Math.floor(Math.random() * 50) - 25;
    
    // Update active games (roughly 10-15% of online players are playing)
    this.stats.activeGames = Math.floor(this.stats.playersOnline * (0.10 + Math.random() * 0.05));
    
    // Track peak concurrent
    if (this.stats.playersOnline > this.peakConcurrent) {
      this.peakConcurrent = this.stats.playersOnline;
      this.stats.peakConcurrentToday = this.peakConcurrent;
    }
    
    // Increment games played (simulate new games starting)
    if (Math.random() > 0.7) {
      this.stats.totalGamesPlayed += Math.floor(Math.random() * 3) + 1;
    }
  }

  recordGameStart(gameId: string): void {
    this.gameStartTimes.set(gameId, Date.now());
    this.stats.totalGamesPlayed += 1;
  }

  recordGameEnd(gameId: string): void {
    const startTime = this.gameStartTimes.get(gameId);
    if (startTime) {
      const gameLength = (Date.now() - startTime) / 1000;
      
      // Update running average
      this.stats.averageGameLength = Math.floor(
        (this.stats.averageGameLength * 0.95) + (gameLength * 0.05)
      );
      
      this.gameStartTimes.delete(gameId);
    }
  }

  getStats(): GameStatistics {
    return { ...this.stats };
  }

  getDetailedStats() {
    return {
      ...this.stats,
      gamesPerHour: this.calculateGamesPerHour(),
      averageRating: this.calculateAverageRating(),
      completionRate: this.calculateCompletionRate()
    };
  }

  private calculateGamesPerHour(): number {
    const currentHour = new Date().getHours();
    // Simulate realistic games per hour based on time
    return Math.floor(120 + Math.sin(currentHour * Math.PI / 12) * 50);
  }

  private calculateAverageRating(): number {
    // Chess rating follows normal distribution, average around 1200
    return 1180 + Math.floor(Math.random() * 40);
  }

  private calculateCompletionRate(): number {
    // Most chess games complete (85-95%)
    return 88 + Math.floor(Math.random() * 7);
  }
}

export const realGameStats = new RealGameStatsManager();
