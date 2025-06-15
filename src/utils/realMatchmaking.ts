
import { realPlayerDatabase, ChessPlayer } from './realPlayerDatabase';
import { toast } from 'sonner';

export interface MatchmakingConfig {
  timeControl: string;
  ratingRange: [number, number];
  color: 'white' | 'black' | 'random';
  rated: boolean;
  gameMode: string;
}

export interface MatchResult {
  success: boolean;
  opponent?: ChessPlayer;
  gameId?: string;
  estimatedWaitTime?: number;
  message: string;
}

class RealMatchmakingSystem {
  private searchingPlayers: Map<string, MatchmakingConfig> = new Map();
  private matchingQueue: Array<{ playerId: string; config: MatchmakingConfig; timestamp: number }> = [];

  async findMatch(config: MatchmakingConfig): Promise<MatchResult> {
    console.log('Starting real matchmaking with config:', config);
    
    // Simulate player rating (in real app, this would come from user data)
    const playerRating = 1200 + Math.floor(Math.random() * 600);
    
    // Try to find immediate match
    const opponent = realPlayerDatabase.findOpponent(
      playerRating, 
      config.timeControl, 
      config.ratingRange
    );

    if (opponent) {
      const gameId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        success: true,
        opponent,
        gameId,
        message: `Match found! Playing against ${opponent.username} (${opponent.rating})`
      };
    }

    // No immediate match, add to queue
    const searchId = Math.random().toString(36).substr(2, 9);
    this.searchingPlayers.set(searchId, config);
    this.matchingQueue.push({
      playerId: searchId,
      config,
      timestamp: Date.now()
    });

    // Calculate estimated wait time based on queue and preferences
    const estimatedWaitTime = this.calculateWaitTime(config);

    return {
      success: false,
      estimatedWaitTime,
      message: `Searching for opponent... Estimated wait: ${estimatedWaitTime}s`
    };
  }

  private calculateWaitTime(config: MatchmakingConfig): number {
    const baseWaitTime = 30; // 30 seconds base
    
    // Adjust based on time control popularity
    const timeControlMultiplier = this.getTimeControlPopularity(config.timeControl);
    
    // Adjust based on rating range
    const ratingRangeSize = config.ratingRange[1] - config.ratingRange[0];
    const ratingMultiplier = Math.max(0.5, 1 - (ratingRangeSize / 1000));
    
    return Math.floor(baseWaitTime * timeControlMultiplier * ratingMultiplier);
  }

  private getTimeControlPopularity(timeControl: string): number {
    const popularityMap: { [key: string]: number } = {
      "1+0": 1.2,    // Very popular
      "3+0": 1.0,    // Most popular
      "5+0": 1.1,    // Popular
      "10+0": 1.4,   // Less popular
      "15+10": 1.6   // Least popular
    };
    return popularityMap[timeControl] || 1.5;
  }

  cancelSearch(searchId?: string): boolean {
    if (searchId && this.searchingPlayers.has(searchId)) {
      this.searchingPlayers.delete(searchId);
      this.matchingQueue = this.matchingQueue.filter(item => item.playerId !== searchId);
      return true;
    }
    return false;
  }

  getQueueStatus(): { playersSearching: number; averageWaitTime: number } {
    const now = Date.now();
    const activeSearches = this.matchingQueue.filter(item => now - item.timestamp < 300000); // 5 min timeout
    
    const totalWaitTime = activeSearches.reduce((sum, item) => sum + (now - item.timestamp), 0);
    const averageWaitTime = activeSearches.length > 0 ? totalWaitTime / activeSearches.length / 1000 : 0;

    return {
      playersSearching: activeSearches.length,
      averageWaitTime: Math.floor(averageWaitTime)
    };
  }
}

export const realMatchmaking = new RealMatchmakingSystem();
