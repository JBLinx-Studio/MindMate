import { GameState, Move } from '../types/chess';
import { sampleGames } from './sampleGames';

export interface StoredGame {
  id: string;
  playerWhite: string;
  playerBlack: string;
  result: 'white' | 'black' | 'draw';
  moves: Move[];
  pgn: string;
  fen: string;
  timeControl: string;
  rating: { white: number; black: number };
  date: string;
  opening: string;
  eco: string;
  tags: string[];
  notes: string;
  analysis?: {
    evaluation: number;
    accuracy: { white: number; black: number };
    blunders: number;
    mistakes: number;
    inaccuracies: number;
  };
}

export interface GameFilter {
  player?: string;
  result?: 'white' | 'black' | 'draw';
  opening?: string;
  minRating?: number;
  maxRating?: number;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageRating: number;
  favoriteOpenings: { opening: string; count: number; winRate: number }[];
  recentForm: ('W' | 'L' | 'D')[];
  ratingHistory: { date: string; rating: number }[];
}

export class GameDatabase {
  private games: Map<string, StoredGame> = new Map();
  private playerStats: Map<string, PlayerStats> = new Map();
  
  constructor() {
    this.loadFromStorage();
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Only add sample data if the database is empty
    if (this.games.size === 0) {
      sampleGames.forEach(game => {
        this.games.set(game.id, game);
        this.updatePlayerStats(game);
      });
      this.saveToStorage();
    }
  }

  saveGame(gameState: GameState, gameInfo: Partial<StoredGame>): string {
    const gameId = this.generateGameId();
    
    const storedGame: StoredGame = {
      id: gameId,
      playerWhite: gameInfo.playerWhite || 'Player',
      playerBlack: gameInfo.playerBlack || 'Computer',
      result: gameState.winner as 'white' | 'black' | 'draw' || 'draw',
      moves: gameState.moves,
      pgn: this.generatePGN(gameState, gameInfo),
      fen: this.generateFEN(gameState),
      timeControl: gameInfo.timeControl || 'Unlimited',
      rating: gameInfo.rating || { white: 1500, black: 1500 },
      date: new Date().toISOString().split('T')[0],
      opening: gameInfo.opening || 'Unknown Opening',
      eco: gameInfo.eco || '',
      tags: gameInfo.tags || [],
      notes: gameInfo.notes || '',
      analysis: gameInfo.analysis
    };

    this.games.set(gameId, storedGame);
    this.updatePlayerStats(storedGame);
    this.saveToStorage();
    
    return gameId;
  }

  getGame(gameId: string): StoredGame | null {
    return this.games.get(gameId) || null;
  }

  getAllGames(): StoredGame[] {
    return Array.from(this.games.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  filterGames(filter: GameFilter): StoredGame[] {
    return this.getAllGames().filter(game => {
      if (filter.player && 
          !game.playerWhite.toLowerCase().includes(filter.player.toLowerCase()) &&
          !game.playerBlack.toLowerCase().includes(filter.player.toLowerCase())) {
        return false;
      }
      
      if (filter.result && game.result !== filter.result) {
        return false;
      }
      
      if (filter.opening && 
          !game.opening.toLowerCase().includes(filter.opening.toLowerCase())) {
        return false;
      }
      
      if (filter.minRating && 
          Math.max(game.rating.white, game.rating.black) < filter.minRating) {
        return false;
      }
      
      if (filter.maxRating && 
          Math.min(game.rating.white, game.rating.black) > filter.maxRating) {
        return false;
      }
      
      if (filter.dateFrom && game.date < filter.dateFrom) {
        return false;
      }
      
      if (filter.dateTo && game.date > filter.dateTo) {
        return false;
      }
      
      if (filter.tags && filter.tags.length > 0) {
        const hasTag = filter.tags.some(tag => 
          game.tags.some(gameTag => 
            gameTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasTag) return false;
      }
      
      return true;
    });
  }

  getPlayerStats(playerName: string): PlayerStats | null {
    return this.playerStats.get(playerName.toLowerCase()) || null;
  }

  deleteGame(gameId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) return false;
    
    this.games.delete(gameId);
    this.recalculatePlayerStats();
    this.saveToStorage();
    
    return true;
  }

  exportGames(format: 'pgn' | 'json' = 'pgn'): string {
    const games = this.getAllGames();
    
    if (format === 'json') {
      return JSON.stringify(games, null, 2);
    }
    
    return games.map(game => game.pgn).join('\n\n');
  }

  importGames(data: string, format: 'pgn' | 'json' = 'pgn'): number {
    let importedCount = 0;
    
    try {
      if (format === 'json') {
        const games: StoredGame[] = JSON.parse(data);
        games.forEach(game => {
          game.id = this.generateGameId();
          this.games.set(game.id, game);
          this.updatePlayerStats(game);
          importedCount++;
        });
      } else {
        // Simple PGN import (would need more sophisticated parsing for real use)
        const pgnGames = data.split('\n\n').filter(pgn => pgn.trim());
        pgnGames.forEach(pgn => {
          const game = this.parsePGN(pgn);
          if (game) {
            this.games.set(game.id, game);
            this.updatePlayerStats(game);
            importedCount++;
          }
        });
      }
      
      this.saveToStorage();
    } catch (error) {
      console.error('Import failed:', error);
    }
    
    return importedCount;
  }

  getGameStatistics(): {
    totalGames: number;
    whiteWins: number;
    blackWins: number;
    draws: number;
    averageGameLength: number;
    mostPlayedOpenings: { opening: string; count: number }[];
    recentActivity: { date: string; games: number }[];
  } {
    const games = this.getAllGames();
    
    const stats = {
      totalGames: games.length,
      whiteWins: games.filter(g => g.result === 'white').length,
      blackWins: games.filter(g => g.result === 'black').length,
      draws: games.filter(g => g.result === 'draw').length,
      averageGameLength: games.reduce((sum, g) => sum + g.moves.length, 0) / games.length || 0,
      mostPlayedOpenings: this.getMostPlayedOpenings(games),
      recentActivity: this.getRecentActivity(games)
    };
    
    return stats;
  }

  private generateGameId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generatePGN(gameState: GameState, gameInfo: Partial<StoredGame>): string {
    const headers = [
      `[Event "Local Game"]`,
      `[Site "Lovable Chess"]`,
      `[Date "${new Date().toISOString().split('T')[0]}"]`,
      `[Round "1"]`,
      `[White "${gameInfo.playerWhite || 'Player'}"]`,
      `[Black "${gameInfo.playerBlack || 'Computer'}"]`,
      `[Result "${this.getResultString(gameState.winner)}"]`,
      `[TimeControl "${gameInfo.timeControl || 'Unlimited'}"]`,
      `[Opening "${gameInfo.opening || 'Unknown'}"]`
    ];
    
    const moves = gameState.moves.map((move, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      const isWhiteMove = index % 2 === 0;
      
      if (isWhiteMove) {
        return `${moveNumber}. ${move.notation}`;
      } else {
        return move.notation;
      }
    }).join(' ');
    
    const result = this.getResultString(gameState.winner);
    
    return `${headers.join('\n')}\n\n${moves} ${result}`;
  }

  private generateFEN(gameState: GameState): string {
    // Simplified FEN generation
    let fen = '';
    
    for (let y = 0; y < 8; y++) {
      let emptyCount = 0;
      let rank = '';
      
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        
        if (piece) {
          if (emptyCount > 0) {
            rank += emptyCount;
            emptyCount = 0;
          }
          
          const symbol = this.getPieceSymbol(piece);
          rank += piece.color === 'white' ? symbol.toUpperCase() : symbol.toLowerCase();
        } else {
          emptyCount++;
        }
      }
      
      if (emptyCount > 0) {
        rank += emptyCount;
      }
      
      fen += rank;
      if (y < 7) fen += '/';
    }
    
    fen += ` ${gameState.currentPlayer[0]} KQkq - 0 ${Math.ceil(gameState.moves.length / 2)}`;
    
    return fen;
  }

  private getPieceSymbol(piece: any): string {
    const symbols = {
      king: 'k', queen: 'q', rook: 'r', 
      bishop: 'b', knight: 'n', pawn: 'p'
    };
    return symbols[piece.type] || 'p';
  }

  private getResultString(winner?: 'white' | 'black' | 'draw'): string {
    switch (winner) {
      case 'white': return '1-0';
      case 'black': return '0-1';
      case 'draw': return '1/2-1/2';
      default: return '*';
    }
  }

  private updatePlayerStats(game: StoredGame): void {
    [game.playerWhite, game.playerBlack].forEach((playerName, index) => {
      const isWhite = index === 0;
      const playerKey = playerName.toLowerCase();
      
      let stats = this.playerStats.get(playerKey) || {
        totalGames: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
        averageRating: isWhite ? game.rating.white : game.rating.black,
        favoriteOpenings: [],
        recentForm: [],
        ratingHistory: []
      };

      stats.totalGames++;
      
      if (game.result === 'draw') {
        stats.draws++;
      } else if ((isWhite && game.result === 'white') || (!isWhite && game.result === 'black')) {
        stats.wins++;
      } else {
        stats.losses++;
      }
      
      stats.winRate = stats.wins / stats.totalGames;
      
      // Update recent form (last 10 games)
      const result = game.result === 'draw' ? 'D' : 
                   ((isWhite && game.result === 'white') || (!isWhite && game.result === 'black')) ? 'W' : 'L';
      stats.recentForm.unshift(result as 'W' | 'L' | 'D');
      if (stats.recentForm.length > 10) {
        stats.recentForm.pop();
      }
      
      // Add to rating history
      stats.ratingHistory.push({
        date: game.date,
        rating: isWhite ? game.rating.white : game.rating.black
      });
      
      this.playerStats.set(playerKey, stats);
    });
  }

  private recalculatePlayerStats(): void {
    this.playerStats.clear();
    this.getAllGames().forEach(game => this.updatePlayerStats(game));
  }

  private getMostPlayedOpenings(games: StoredGame[]): { opening: string; count: number }[] {
    const openingCounts = new Map<string, number>();
    
    games.forEach(game => {
      const count = openingCounts.get(game.opening) || 0;
      openingCounts.set(game.opening, count + 1);
    });
    
    return Array.from(openingCounts.entries())
      .map(([opening, count]) => ({ opening, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getRecentActivity(games: StoredGame[]): { date: string; games: number }[] {
    const activityMap = new Map<string, number>();
    
    games.forEach(game => {
      const count = activityMap.get(game.date) || 0;
      activityMap.set(game.date, count + 1);
    });
    
    return Array.from(activityMap.entries())
      .map(([date, games]) => ({ date, games }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);
  }

  private parsePGN(pgn: string): StoredGame | null {
    // Simplified PGN parsing - would need more robust implementation
    try {
      const lines = pgn.split('\n');
      const headers: Record<string, string> = {};
      
      lines.forEach(line => {
        const match = line.match(/\[(\w+)\s+"([^"]+)"\]/);
        if (match) {
          headers[match[1]] = match[2];
        }
      });
      
      return {
        id: this.generateGameId(),
        playerWhite: headers.White || 'Unknown',
        playerBlack: headers.Black || 'Unknown',
        result: this.parseResult(headers.Result),
        moves: [], // Would need move parsing
        pgn,
        fen: '',
        timeControl: headers.TimeControl || 'Unknown',
        rating: { white: 1500, black: 1500 },
        date: headers.Date || new Date().toISOString().split('T')[0],
        opening: headers.Opening || 'Unknown',
        eco: headers.ECO || '',
        tags: [],
        notes: ''
      };
    } catch (error) {
      return null;
    }
  }

  private parseResult(result: string): 'white' | 'black' | 'draw' {
    switch (result) {
      case '1-0': return 'white';
      case '0-1': return 'black';
      case '1/2-1/2': return 'draw';
      default: return 'draw';
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        games: Array.from(this.games.entries()),
        playerStats: Array.from(this.playerStats.entries())
      };
      localStorage.setItem('chess-game-database', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem('chess-game-database');
      if (data) {
        const parsed = JSON.parse(data);
        this.games = new Map(parsed.games || []);
        this.playerStats = new Map(parsed.playerStats || []);
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }
}

export const gameDatabase = new GameDatabase();
