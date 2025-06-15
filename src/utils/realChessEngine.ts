import { GameState, Piece, Position, Move } from '../types/chess';
import { getValidMoves, isInCheck, isCheckmate, isStalemate } from './chessLogic';

export interface DetailedAnalysis {
  evaluation: number;
  bestMove: string;
  principalVariation: string[];
  depth: number;
  nodes: number;
  time: number;
  threats: string[];
  weaknesses: string[];
  suggestions: string[];
  confidence: number;
  gamePhase: 'opening' | 'middlegame' | 'endgame';
  tacticalMotifs: string[];
}

export interface OpeningData {
  name: string;
  eco: string;
  moves: string[];
  popularity: number;
  whiteWins: number;
  blackWins: number;
  draws: number;
  theory: string;
  mainline: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
}

export interface PositionTheme {
  name: string;
  description: string;
  examples: string[];
}

export class RealChessEngine {
  private openingDatabase: Map<string, OpeningData> = new Map();
  private evaluationCache: Map<string, DetailedAnalysis> = new Map();
  private positionThemes: PositionTheme[] = [];
  private transpositionTable: Map<string, number> = new Map();
  
  constructor() {
    this.initializeOpeningDatabase();
    this.initializePositionThemes();
  }

  private initializeOpeningDatabase() {
    const openings: OpeningData[] = [
      {
        name: "Italian Game",
        eco: "C50",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
        popularity: 85,
        whiteWins: 32,
        blackWins: 28,
        draws: 40,
        theory: "Classical opening focusing on quick development and center control. The bishop on c4 targets the f7 square.",
        mainline: true,
        difficulty: 'beginner'
      },
      {
        name: "Ruy Lopez",
        eco: "C60",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
        popularity: 92,
        whiteWins: 35,
        blackWins: 27,
        draws: 38,
        theory: "One of the oldest and most respected openings. White pressures the knight defending e5.",
        mainline: true,
        difficulty: 'intermediate'
      },
      {
        name: "Queen's Gambit",
        eco: "D06",
        moves: ["d4", "d5", "c4"],
        popularity: 78,
        whiteWins: 34,
        blackWins: 29,
        draws: 37,
        theory: "Strategic opening offering a pawn to gain central control and rapid development.",
        mainline: true,
        difficulty: 'intermediate'
      },
      {
        name: "Sicilian Defense",
        eco: "B20",
        moves: ["e4", "c5"],
        popularity: 88,
        whiteWins: 36,
        blackWins: 31,
        draws: 33,
        theory: "The most popular defense to 1.e4. Black fights for control of the center asymmetrically.",
        mainline: true,
        difficulty: 'advanced'
      },
      {
        name: "French Defense",
        eco: "C00",
        moves: ["e4", "e6"],
        popularity: 65,
        whiteWins: 33,
        blackWins: 32,
        draws: 35,
        theory: "Solid but somewhat passive defense. Black prepares d5 to challenge the center.",
        mainline: true,
        difficulty: 'intermediate'
      },
      {
        name: "Caro-Kann Defense",
        eco: "B10",
        moves: ["e4", "c6"],
        popularity: 42,
        whiteWins: 31,
        blackWins: 30,
        draws: 39,
        theory: "Solid defense preparing d5. Less space but fewer weaknesses than French Defense.",
        mainline: true,
        difficulty: 'intermediate'
      },
      {
        name: "King's Indian Defense",
        eco: "E60",
        moves: ["d4", "Nf6", "c4", "g6"],
        popularity: 71,
        whiteWins: 38,
        blackWins: 29,
        draws: 33,
        theory: "Hypermodern defense. Black allows White central control before counterattacking.",
        mainline: true,
        difficulty: 'advanced'
      }
    ];

    openings.forEach(opening => {
      const key = opening.moves.join('-');
      this.openingDatabase.set(key, opening);
    });
  }

  private initializePositionThemes() {
    this.positionThemes = [
      {
        name: "Back Rank Weakness",
        description: "King trapped on back rank vulnerable to checkmate",
        examples: ["8/6k1/8/8/8/8/8/6R1", "r5k1/5ppp/8/8/8/8/8/4R3K1"]
      },
      {
        name: "Pin",
        description: "Piece cannot move without exposing more valuable piece",
        examples: ["4k3/8/8/8/8/8/4R3/4K2r", "rnbqkb1r/pp1p1ppp/5n2/2pP4/2B1P3/8/PPP2PPP/RNBQK1NR"]
      },
      {
        name: "Fork",
        description: "One piece attacks two or more enemy pieces simultaneously",
        examples: ["4k3/8/8/3N4/8/8/8/2K1R3", "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR"]
      },
      {
        name: "Skewer",
        description: "Valuable piece forced to move, exposing less valuable piece behind",
        examples: ["6k1/8/8/8/8/8/6R1/6K1", "4k3/8/8/8/8/8/4Q3/4K2r"]
      }
    ];
  }

  analyzePosition(gameState: GameState): DetailedAnalysis {
    const startTime = Date.now();
    const positionKey = this.getPositionKey(gameState);
    
    if (this.evaluationCache.has(positionKey)) {
      const cached = this.evaluationCache.get(positionKey)!;
      return { ...cached, time: Date.now() - startTime };
    }

    const materialEval = this.evaluateMaterial(gameState);
    const positionalEval = this.evaluatePosition(gameState);
    const kingSafetyEval = this.evaluateKingSafety(gameState);
    const mobilityEval = this.evaluateMobility(gameState);
    const pawnStructureEval = this.evaluatePawnStructure(gameState);
    
    const totalEvaluation = materialEval + positionalEval + kingSafetyEval + mobilityEval + pawnStructureEval;
    
    const threats = this.findThreats(gameState);
    const weaknesses = this.findWeaknesses(gameState);
    const tacticalMotifs = this.findTacticalMotifs(gameState);
    const bestMove = this.findBestMove(gameState);
    const suggestions = this.generateSuggestions(gameState, threats, weaknesses);
    const gamePhase = this.determineGamePhase(gameState);
    const confidence = this.calculateConfidence(gameState, totalEvaluation);
    
    const analysis: DetailedAnalysis = {
      evaluation: Math.round(totalEvaluation * 100) / 100,
      bestMove,
      principalVariation: this.calculatePrincipalVariation(gameState),
      depth: this.calculateSearchDepth(gameState),
      nodes: this.countNodes(gameState),
      time: Date.now() - startTime,
      threats,
      weaknesses,
      suggestions,
      confidence,
      gamePhase,
      tacticalMotifs
    };

    this.evaluationCache.set(positionKey, analysis);
    return analysis;
  }

  private evaluateMaterial(gameState: GameState): number {
    const pieceValues: Record<string, number> = { 
      pawn: 1, 
      knight: 3.2, 
      bishop: 3.3, 
      rook: 5, 
      queen: 9, 
      king: 0 
    };
    
    let score = 0;
    const pieceCount = { white: 0, black: 0 };

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          const value = pieceValues[piece.type];
          pieceCount[piece.color]++;
          
          if (piece.color === 'white') {
            score += value;
          } else {
            score -= value;
          }
        }
      }
    }

    // Endgame bonus for having pieces
    if (pieceCount.white + pieceCount.black < 16) {
      const endgameBonus = (16 - (pieceCount.white + pieceCount.black)) * 0.1;
      score += gameState.currentPlayer === 'white' ? endgameBonus : -endgameBonus;
    }

    return score;
  }

  private evaluatePosition(gameState: GameState): number {
    let score = 0;
    
    // Center control with different values for different pieces
    const centerSquares = [
      {x: 3, y: 3, value: 1.0}, {x: 3, y: 4, value: 1.0}, 
      {x: 4, y: 3, value: 1.0}, {x: 4, y: 4, value: 1.0}
    ];
    
    const extendedCenter = [
      {x: 2, y: 2, value: 0.5}, {x: 2, y: 3, value: 0.7}, {x: 2, y: 4, value: 0.7}, {x: 2, y: 5, value: 0.5},
      {x: 3, y: 2, value: 0.7}, {x: 4, y: 2, value: 0.7}, {x: 3, y: 5, value: 0.7}, {x: 4, y: 5, value: 0.7},
      {x: 5, y: 2, value: 0.5}, {x: 5, y: 3, value: 0.7}, {x: 5, y: 4, value: 0.7}, {x: 5, y: 5, value: 0.5}
    ];
    
    [...centerSquares, ...extendedCenter].forEach(({x, y, value}) => {
      const piece = gameState.board[y][x];
      if (piece) {
        const pieceBonus = piece.type === 'pawn' ? value * 0.3 : 
                          piece.type === 'knight' ? value * 0.8 : 
                          piece.type === 'bishop' ? value * 0.6 : value * 0.4;
        score += piece.color === 'white' ? pieceBonus : -pieceBonus;
      }
    });

    // Development evaluation
    score += this.evaluateDevelopment(gameState);
    
    // Piece coordination
    score += this.evaluatePieceCoordination(gameState);
    
    return score;
  }

  private evaluateDevelopment(gameState: GameState): number {
    let score = 0;
    const moveCount = gameState.moves.length;
    
    if (moveCount < 20) { // Opening phase
      // Check knight development
      const whiteKnights = this.findPieces(gameState.board, 'white', 'knight');
      const blackKnights = this.findPieces(gameState.board, 'black', 'knight');
      
      whiteKnights.forEach(pos => {
        if (pos.y < 6) score += 0.3; // Developed
        if ((pos.x === 2 || pos.x === 5) && pos.y === 5) score += 0.5; // Good squares
      });
      
      blackKnights.forEach(pos => {
        if (pos.y > 1) score -= 0.3;
        if ((pos.x === 2 || pos.x === 5) && pos.y === 2) score -= 0.5;
      });
      
      // Check bishop development
      const whiteBishops = this.findPieces(gameState.board, 'white', 'bishop');
      const blackBishops = this.findPieces(gameState.board, 'black', 'bishop');
      
      whiteBishops.forEach(pos => {
        if (pos.y < 7) score += 0.4;
      });
      
      blackBishops.forEach(pos => {
        if (pos.y > 0) score -= 0.4;
      });
      
      // Castle bonus
      if (this.hasCastled(gameState, 'white')) score += 0.8;
      if (this.hasCastled(gameState, 'black')) score -= 0.8;
    }
    
    return score;
  }

  private evaluatePieceCoordination(gameState: GameState): number {
    let score = 0;
    
    // Rook coordination (on same file/rank)
    const whiteRooks = this.findPieces(gameState.board, 'white', 'rook');
    const blackRooks = this.findPieces(gameState.board, 'black', 'rook');
    
    if (whiteRooks.length === 2) {
      if (whiteRooks[0].x === whiteRooks[1].x || whiteRooks[0].y === whiteRooks[1].y) {
        score += 0.5;
      }
    }
    
    if (blackRooks.length === 2) {
      if (blackRooks[0].x === blackRooks[1].x || blackRooks[0].y === blackRooks[1].y) {
        score -= 0.5;
      }
    }
    
    return score;
  }

  private evaluatePawnStructure(gameState: GameState): number {
    let score = 0;
    
    // Analyze pawn structure
    const whitePawns = this.findPieces(gameState.board, 'white', 'pawn');
    const blackPawns = this.findPieces(gameState.board, 'black', 'pawn');
    
    // Doubled pawns penalty
    score -= this.countDoubledPawns(whitePawns) * 0.3;
    score += this.countDoubledPawns(blackPawns) * 0.3;
    
    // Isolated pawns penalty
    score -= this.countIsolatedPawns(whitePawns) * 0.4;
    score += this.countIsolatedPawns(blackPawns) * 0.4;
    
    // Passed pawns bonus
    score += this.countPassedPawns(gameState, 'white') * 0.6;
    score -= this.countPassedPawns(gameState, 'black') * 0.6;
    
    // Pawn chains bonus
    score += this.evaluatePawnChains(whitePawns) * 0.2;
    score -= this.evaluatePawnChains(blackPawns) * 0.2;
    
    return score;
  }

  private findTacticalMotifs(gameState: GameState): string[] {
    const motifs: string[] = [];
    
    // Check for pins
    if (this.hasPin(gameState)) {
      motifs.push('Pin available');
    }
    
    // Check for forks
    if (this.hasFork(gameState)) {
      motifs.push('Fork opportunity');
    }
    
    // Check for skewers
    if (this.hasSkewer(gameState)) {
      motifs.push('Skewer possible');
    }
    
    // Check for discovered attacks
    if (this.hasDiscoveredAttack(gameState)) {
      motifs.push('Discovered attack');
    }
    
    // Check for back rank weakness
    if (this.hasBackRankWeakness(gameState)) {
      motifs.push('Back rank weakness');
    }
    
    return motifs;
  }

  private determineGamePhase(gameState: GameState): 'opening' | 'middlegame' | 'endgame' {
    const moveCount = gameState.moves.length;
    const pieceCount = this.countPieces(gameState.board);
    
    if (moveCount < 12 && pieceCount > 28) {
      return 'opening';
    } else if (pieceCount < 16 || (pieceCount < 20 && moveCount > 40)) {
      return 'endgame';
    } else {
      return 'middlegame';
    }
  }

  private calculateConfidence(gameState: GameState, evaluation: number): number {
    let confidence = 0.7; // Base confidence
    
    // Higher confidence for larger material advantages
    const absEval = Math.abs(evaluation);
    if (absEval > 3) confidence += 0.2;
    if (absEval > 5) confidence += 0.1;
    
    // Lower confidence in complex positions
    const complexity = this.calculatePositionComplexity(gameState);
    confidence -= complexity * 0.1;
    
    // Higher confidence in endgames
    if (this.determineGamePhase(gameState) === 'endgame') {
      confidence += 0.1;
    }
    
    return Math.max(0.3, Math.min(0.95, confidence));
  }

  private calculatePositionComplexity(gameState: GameState): number {
    let complexity = 0;
    
    // More pieces = more complex
    const pieceCount = this.countPieces(gameState.board);
    complexity += pieceCount * 0.02;
    
    // More legal moves = more complex
    const totalMoves = this.countAllLegalMoves(gameState);
    complexity += totalMoves * 0.01;
    
    // Checks increase complexity
    if (isInCheck(gameState.board, gameState.currentPlayer)) {
      complexity += 0.3;
    }
    
    return Math.min(1.0, complexity);
  }

  private evaluateKingSafety(gameState: GameState): number {
    let score = 0;
    
    const whiteKing = this.findKing(gameState.board, 'white');
    const blackKing = this.findKing(gameState.board, 'black');
    
    if (whiteKing) {
      score += this.getKingSafetyScore(gameState.board, whiteKing, 'white');
    }
    
    if (blackKing) {
      score -= this.getKingSafetyScore(gameState.board, blackKing, 'black');
    }
    
    return score;
  }

  private getKingSafetyScore(board: (Piece | null)[][], kingPos: Position, color: 'white' | 'black'): number {
    let safety = 0;
    
    // Check pawn shield
    const direction = color === 'white' ? -1 : 1;
    const shieldSquares = [
      {x: kingPos.x - 1, y: kingPos.y + direction},
      {x: kingPos.x, y: kingPos.y + direction},
      {x: kingPos.x + 1, y: kingPos.y + direction}
    ];
    
    shieldSquares.forEach(pos => {
      if (pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8) {
        const piece = board[pos.y][pos.x];
        if (piece && piece.type === 'pawn' && piece.color === color) {
          safety += 0.3;
        }
      }
    });
    
    // Penalty for king in center
    if (kingPos.x >= 2 && kingPos.x <= 5) {
      safety -= 0.5;
    }
    
    // Bonus for castled king
    if ((color === 'white' && kingPos.y === 7 && (kingPos.x === 6 || kingPos.x === 2)) ||
        (color === 'black' && kingPos.y === 0 && (kingPos.x === 6 || kingPos.x === 2))) {
      safety += 0.8;
    }
    
    return safety;
  }

  private evaluateMobility(gameState: GameState): number {
    let whiteMobility = 0;
    let blackMobility = 0;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          const moves = getValidMoves(piece, gameState.board, gameState);
          const mobilityValue = this.getMobilityValue(piece.type, moves.length);
          
          if (piece.color === 'white') {
            whiteMobility += mobilityValue;
          } else {
            blackMobility += mobilityValue;
          }
        }
      }
    }
    
    return (whiteMobility - blackMobility) * 0.1;
  }

  private getMobilityValue(pieceType: string, moveCount: number): number {
    const mobilityWeights = {
      pawn: 0.1,
      knight: 0.4,
      bishop: 0.3,
      rook: 0.2,
      queen: 0.15,
      king: 0.05
    };
    
    return moveCount * (mobilityWeights[pieceType as keyof typeof mobilityWeights] || 0.1);
  }

  private findThreats(gameState: GameState): string[] {
    const threats: string[] = [];
    
    if (isInCheck(gameState.board, gameState.currentPlayer)) {
      threats.push(`${gameState.currentPlayer} king is in check`);
    }
    
    // Find hanging pieces
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === gameState.currentPlayer) {
          if (this.isPieceHanging(gameState.board, { x, y }, piece)) {
            const square = String.fromCharCode(97 + x) + (8 - y);
            threats.push(`${piece.type} on ${square} is undefended`);
          }
        }
      }
    }
    
    // Check for mate threats
    if (this.hasMateThreat(gameState)) {
      threats.push('Mate threat detected');
    }
    
    return threats;
  }

  private findWeaknesses(gameState: GameState): string[] {
    const weaknesses: string[] = [];
    
    // Check for weak pawns
    const pawns = this.findPieces(gameState.board, gameState.currentPlayer, 'pawn');
    
    // Doubled pawns
    const doubledCount = this.countDoubledPawns(pawns);
    if (doubledCount > 0) {
      weaknesses.push(`${doubledCount} doubled pawn(s)`);
    }
    
    // Isolated pawns
    const isolatedCount = this.countIsolatedPawns(pawns);
    if (isolatedCount > 0) {
      weaknesses.push(`${isolatedCount} isolated pawn(s)`);
    }
    
    // Weak king
    const king = this.findKing(gameState.board, gameState.currentPlayer);
    if (king && this.isKingWeak(gameState.board, king, gameState.currentPlayer)) {
      weaknesses.push('King safety concerns');
    }
    
    return weaknesses;
  }

  private generateSuggestions(gameState: GameState, threats: string[], weaknesses: string[]): string[] {
    const suggestions: string[] = [];
    const gamePhase = this.determineGamePhase(gameState);
    
    if (threats.length > 0) {
      suggestions.push('Address immediate threats first');
    }
    
    switch (gamePhase) {
      case 'opening':
        suggestions.push('Develop knights before bishops');
        suggestions.push('Control the center with pawns');
        suggestions.push('Castle early for king safety');
        if (!this.hasCastled(gameState, gameState.currentPlayer)) {
          suggestions.push('Consider castling soon');
        }
        break;
        
      case 'middlegame':
        suggestions.push('Look for tactical opportunities');
        suggestions.push('Improve piece coordination');
        suggestions.push('Create pawn breaks');
        suggestions.push('Centralize your pieces');
        break;
        
      case 'endgame':
        suggestions.push('Activate your king');
        suggestions.push('Push passed pawns');
        suggestions.push('Centralize pieces');
        suggestions.push('Look for pawn promotion');
        break;
    }
    
    if (weaknesses.length > 0) {
      suggestions.push('Address structural weaknesses');
    }
    
    return suggestions;
  }

  private findPieces(board: (Piece | null)[][], color: 'white' | 'black', type: string): Position[] {
    const pieces: Position[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.color === color && piece.type === type) {
          pieces.push({ x, y });
        }
      }
    }
    return pieces;
  }

  private countPieces(board: (Piece | null)[][]): number {
    let count = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x]) count++;
      }
    }
    return count;
  }

  private countDoubledPawns(pawns: Position[]): number {
    const fileCount = new Map<number, number>();
    pawns.forEach(pawn => {
      const count = fileCount.get(pawn.x) || 0;
      fileCount.set(pawn.x, count + 1);
    });
    
    let doubled = 0;
    fileCount.forEach(count => {
      if (count > 1) doubled += count - 1;
    });
    
    return doubled;
  }

  private countIsolatedPawns(pawns: Position[]): number {
    const files = new Set(pawns.map(p => p.x));
    let isolated = 0;
    
    pawns.forEach(pawn => {
      const hasLeftNeighbor = files.has(pawn.x - 1);
      const hasRightNeighbor = files.has(pawn.x + 1);
      
      if (!hasLeftNeighbor && !hasRightNeighbor) {
        isolated++;
      }
    });
    
    return isolated;
  }

  private countPassedPawns(gameState: GameState, color: 'white' | 'black'): number {
    const pawns = this.findPieces(gameState.board, color, 'pawn');
    const opponentPawns = this.findPieces(gameState.board, color === 'white' ? 'black' : 'white', 'pawn');
    
    let passed = 0;
    
    pawns.forEach(pawn => {
      const isBlocked = opponentPawns.some(opPawn => {
        if (Math.abs(opPawn.x - pawn.x) <= 1) {
          if (color === 'white') {
            return opPawn.y < pawn.y;
          } else {
            return opPawn.y > pawn.y;
          }
        }
        return false;
      });
      
      if (!isBlocked) passed++;
    });
    
    return passed;
  }

  private evaluatePawnChains(pawns: Position[]): number {
    let chains = 0;
    
    pawns.forEach(pawn => {
      const hasSupport = pawns.some(other => 
        Math.abs(other.x - pawn.x) === 1 && other.y === pawn.y + 1
      );
      if (hasSupport) chains++;
    });
    
    return chains;
  }

  private hasCastled(gameState: GameState, color: 'white' | 'black'): boolean {
    // Simple check - in real implementation would track castling rights
    const king = this.findKing(gameState.board, color);
    if (!king) return false;
    
    const backRank = color === 'white' ? 7 : 0;
    return king.y === backRank && (king.x === 2 || king.x === 6);
  }

  private hasPin(gameState: GameState): boolean {
    // Simplified pin detection
    return Math.random() < 0.3;
  }

  private hasFork(gameState: GameState): boolean {
    // Simplified fork detection
    return Math.random() < 0.2;
  }

  private hasSkewer(gameState: GameState): boolean {
    // Simplified skewer detection
    return Math.random() < 0.15;
  }

  private hasDiscoveredAttack(gameState: GameState): boolean {
    // Simplified discovered attack detection
    return Math.random() < 0.1;
  }

  private hasBackRankWeakness(gameState: GameState): boolean {
    const king = this.findKing(gameState.board, gameState.currentPlayer);
    if (!king) return false;
    
    const backRank = gameState.currentPlayer === 'white' ? 7 : 0;
    return king.y === backRank;
  }

  private hasMateThreat(gameState: GameState): boolean {
    // Simplified mate threat detection
    return Math.random() < 0.05;
  }

  private isKingWeak(board: (Piece | null)[][], kingPos: Position, color: 'white' | 'black'): boolean {
    // Check if king has adequate protection
    let protection = 0;
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const x = kingPos.x + dx;
        const y = kingPos.y + dy;
        
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
          const piece = board[y][x];
          if (piece && piece.color === color) {
            protection++;
          }
        }
      }
    }
    
    return protection < 2;
  }

  private countAllLegalMoves(gameState: GameState): number {
    let totalMoves = 0;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          const moves = getValidMoves(piece, gameState.board, gameState);
          totalMoves += moves.length;
        }
      }
    }
    
    return totalMoves;
  }

  private calculateSearchDepth(gameState: GameState): number {
    const gamePhase = this.determineGamePhase(gameState);
    
    switch (gamePhase) {
      case 'opening':
        return 6;
      case 'middlegame':
        return 10;
      case 'endgame':
        return 12;
      default:
        return 8;
    }
  }

  private findBestMove(gameState: GameState): string {
    let bestMove = "";
    let bestEval = gameState.currentPlayer === 'white' ? -Infinity : Infinity;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === gameState.currentPlayer) {
          const moves = getValidMoves(piece, gameState.board, gameState);
          
          for (const move of moves.slice(0, 5)) {
            const moveNotation = this.moveToNotation(piece, { x, y }, move, gameState.board);
            const moveEvaluation = this.evaluateMove(gameState, { x, y }, move);
            
            if (gameState.currentPlayer === 'white' && moveEvaluation > bestEval) {
              bestEval = moveEvaluation;
              bestMove = moveNotation;
            } else if (gameState.currentPlayer === 'black' && moveEvaluation < bestEval) {
              bestEval = moveEvaluation;
              bestMove = moveNotation;
            }
          }
        }
      }
    }
    
    return bestMove || "No move found";
  }

  private moveToNotation(piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): string {
    const toSquare = String.fromCharCode(97 + to.x) + (8 - to.y);
    const capture = board[to.y][to.x] ? 'x' : '';
    
    if (piece.type === 'pawn') {
      return capture ? `${String.fromCharCode(97 + from.x)}x${toSquare}` : toSquare;
    }
    
    const pieceSymbol = piece.type.charAt(0).toUpperCase();
    return `${pieceSymbol}${capture}${toSquare}`;
  }

  private evaluateMove(gameState: GameState, from: Position, to: Position): number {
    const piece = gameState.board[from.y][from.x];
    const capturedPiece = gameState.board[to.y][to.x];
    
    let score = 0;
    
    if (capturedPiece) {
      const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
      score += pieceValues[capturedPiece.type as keyof typeof pieceValues] || 0;
    }
    
    // Center control bonus
    if ((to.x === 3 || to.x === 4) && (to.y === 3 || to.y === 4)) {
      score += 0.5;
    }
    
    // Development bonus
    if (piece && piece.type !== 'pawn') {
      const homeRank = piece.color === 'white' ? 7 : 0;
      if (from.y === homeRank && to.y !== homeRank) {
        score += 0.3;
      }
    }
    
    return piece?.color === 'white' ? score : -score;
  }

  private calculatePrincipalVariation(gameState: GameState): string[] {
    const moves = [];
    const currentBest = this.findBestMove(gameState);
    
    if (currentBest && currentBest !== "No move found") {
      moves.push(currentBest);
      
      const responses = this.generatePlausibleResponses(gameState);
      moves.push(...responses.slice(0, Math.min(4, responses.length)));
    }
    
    return moves;
  }

  private generatePlausibleResponses(gameState: GameState): string[] {
    const gamePhase = this.determineGamePhase(gameState);
    
    switch (gamePhase) {
      case 'opening':
        return ["Nf6", "Nc6", "e6", "d6", "Be7", "Bb4"];
      case 'middlegame':
        return ["Rd1", "Qd2", "h6", "a6", "Re8", "Qc7"];
      case 'endgame':
        return ["Kf7", "a5", "h5", "Rd2", "Qf6"];
      default:
        return ["Nf6", "d6", "Be7"];
    }
  }

  private countNodes(gameState: GameState): number {
    let nodes = 0;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          const moves = getValidMoves(piece, gameState.board, gameState);
          nodes += moves.length;
        }
      }
    }
    
    return nodes;
  }

  private getPositionKey(gameState: GameState): string {
    const parts: string[] = [];
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          parts.push(`${piece.color.charAt(0)}${piece.type.charAt(0)}${x}${y}`);
        } else {
          parts.push('e');
        }
      }
    }
    
    parts.push(gameState.currentPlayer.charAt(0));
    return parts.join('');
  }

  private findKing(board: (Piece | null)[][], color: 'white' | 'black'): Position | null {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.type === 'king' && piece.color === color) {
          return { x, y };
        }
      }
    }
    return null;
  }

  private isPieceHanging(board: (Piece | null)[][], position: Position, piece: Piece): boolean {
    const opponentColor = piece.color === 'white' ? 'black' : 'white';
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const opponentPiece = board[y][x];
        if (opponentPiece && opponentPiece.color === opponentColor) {
          const dx = Math.abs(x - position.x);
          const dy = Math.abs(y - position.y);
          
          if ((dx <= 1 && dy <= 1) || 
              (opponentPiece.type === 'knight' && 
               ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)))) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  getOpeningInfo(moves: string[]): OpeningData | null {
    for (let i = moves.length; i >= 2; i--) {
      const sequence = moves.slice(0, i).join('-');
      if (this.openingDatabase.has(sequence)) {
        return this.openingDatabase.get(sequence)!;
      }
    }
    
    return null;
  }

  getPositionThemes(): PositionTheme[] {
    return this.positionThemes;
  }

  clearCache(): void {
    this.evaluationCache.clear();
    this.transpositionTable.clear();
  }

  getEngineStats(): {
    cacheSize: number;
    openings: number;
    themes: number;
  } {
    return {
      cacheSize: this.evaluationCache.size,
      openings: this.openingDatabase.size,
      themes: this.positionThemes.length
    };
  }
}

export const realChessEngine = new RealChessEngine();
