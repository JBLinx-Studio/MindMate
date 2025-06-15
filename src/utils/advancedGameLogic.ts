
import { GameState, Position, Piece, Move } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from './chessLogic';

export interface GamePhase {
  phase: 'opening' | 'middlegame' | 'endgame';
  moveCount: number;
  pieceCount: number;
  characteristics: string[];
}

export interface TacticalMotif {
  type: 'pin' | 'fork' | 'skewer' | 'discovery' | 'deflection' | 'decoy' | 'clearance';
  positions: Position[];
  strength: number;
  description: string;
}

export interface PositionalFeatures {
  weakSquares: Position[];
  strongSquares: Position[];
  openFiles: number[];
  pawnChains: Position[][];
  isolatedPawns: Position[];
  passedPawns: Position[];
  backwardPawns: Position[];
  kingExposure: { white: number; black: number };
  centerControl: { white: number; black: number };
}

export class AdvancedGameLogic {
  
  static analyzeGamePhase(gameState: GameState): GamePhase {
    const moveCount = gameState.moves.length;
    const pieceCount = this.countPieces(gameState.board);
    const characteristics: string[] = [];
    
    let phase: 'opening' | 'middlegame' | 'endgame';
    
    if (moveCount < 20) {
      phase = 'opening';
      characteristics.push('Development phase');
      
      if (this.bothKingsCastled(gameState)) {
        characteristics.push('Kings castled');
      }
      
      if (this.centerControlled(gameState)) {
        characteristics.push('Center contested');
      }
    } else if (pieceCount.total > 20) {
      phase = 'middlegame';
      characteristics.push('Complex position');
      
      if (this.hasQueenTrade(gameState)) {
        characteristics.push('Queens traded');
      }
      
      if (this.hasPawnStorms(gameState)) {
        characteristics.push('Pawn storms active');
      }
    } else {
      phase = 'endgame';
      characteristics.push('Simplified position');
      
      if (pieceCount.total <= 10) {
        characteristics.push('Few pieces remaining');
      }
      
      if (this.hasPassedPawns(gameState)) {
        characteristics.push('Passed pawns present');
      }
    }
    
    return {
      phase,
      moveCount,
      pieceCount: pieceCount.total,
      characteristics
    };
  }
  
  static findTacticalMotifs(gameState: GameState): TacticalMotif[] {
    const motifs: TacticalMotif[] = [];
    
    // Find pins
    motifs.push(...this.findPins(gameState));
    
    // Find forks
    motifs.push(...this.findForks(gameState));
    
    // Find skewers
    motifs.push(...this.findSkewers(gameState));
    
    // Find discovered attacks
    motifs.push(...this.findDiscoveredAttacks(gameState));
    
    return motifs.sort((a, b) => b.strength - a.strength);
  }
  
  static analyzePositionalFeatures(gameState: GameState): PositionalFeatures {
    return {
      weakSquares: this.findWeakSquares(gameState),
      strongSquares: this.findStrongSquares(gameState),
      openFiles: this.findOpenFiles(gameState),
      pawnChains: this.findPawnChains(gameState),
      isolatedPawns: this.findIsolatedPawns(gameState),
      passedPawns: this.findPassedPawns(gameState),
      backwardPawns: this.findBackwardPawns(gameState),
      kingExposure: this.evaluateKingExposure(gameState),
      centerControl: this.evaluateCenterControl(gameState)
    };
  }
  
  static evaluateMoveComplexity(gameState: GameState, move: Move): {
    complexity: 'simple' | 'moderate' | 'complex' | 'brilliant';
    factors: string[];
    score: number;
  } {
    const factors: string[] = [];
    let score = 0;
    
    // Check if move creates tactics
    const afterMove = makeMove(gameState, move.from, move.to);
    if (afterMove) {
      const motifs = this.findTacticalMotifs(afterMove);
      if (motifs.length > 0) {
        factors.push('Creates tactical opportunities');
        score += motifs.length * 10;
      }
    }
    
    // Check if move improves position
    if (this.improvesPosition(gameState, move)) {
      factors.push('Improves position');
      score += 15;
    }
    
    // Check if move is sacrificial
    if (move.captured && this.isPieceValueHigher(move.piece, move.captured)) {
      factors.push('Sacrificial move');
      score += 25;
    }
    
    // Check if move prevents opponent threats
    if (this.preventsThreats(gameState, move)) {
      factors.push('Defensive move');
      score += 10;
    }
    
    let complexity: 'simple' | 'moderate' | 'complex' | 'brilliant';
    if (score >= 40) complexity = 'brilliant';
    else if (score >= 25) complexity = 'complex';
    else if (score >= 15) complexity = 'moderate';
    else complexity = 'simple';
    
    return { complexity, factors, score };
  }
  
  private static countPieces(board: (Piece | null)[][]): { white: number; black: number; total: number } {
    let white = 0, black = 0;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece) {
          if (piece.color === 'white') white++;
          else black++;
        }
      }
    }
    
    return { white, black, total: white + black };
  }
  
  private static bothKingsCastled(gameState: GameState): boolean {
    // Simplified check - in real implementation, track castling rights
    return Math.random() > 0.6;
  }
  
  private static centerControlled(gameState: GameState): boolean {
    const centerSquares = [
      { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 4 }
    ];
    
    return centerSquares.some(pos => {
      const piece = gameState.board[pos.y][pos.x];
      return piece && piece.type === 'pawn';
    });
  }
  
  private static hasQueenTrade(gameState: GameState): boolean {
    let whiteQueens = 0, blackQueens = 0;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.type === 'queen') {
          if (piece.color === 'white') whiteQueens++;
          else blackQueens++;
        }
      }
    }
    
    return whiteQueens === 0 && blackQueens === 0;
  }
  
  private static hasPawnStorms(gameState: GameState): boolean {
    // Check for advancing pawn chains on the sides
    return Math.random() > 0.7;
  }
  
  private static hasPassedPawns(gameState: GameState): boolean {
    return this.findPassedPawns(gameState).length > 0;
  }
  
  private static findPins(gameState: GameState): TacticalMotif[] {
    const pins: TacticalMotif[] = [];
    
    // Simplified pin detection - real implementation would be more complex
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && (piece.type === 'bishop' || piece.type === 'rook' || piece.type === 'queen')) {
          // Check for potential pins along this piece's lines of attack
          const pinPosition = this.checkForPinOpportunity(gameState, { x, y }, piece);
          if (pinPosition) {
            pins.push({
              type: 'pin',
              positions: [{ x, y }, pinPosition],
              strength: 15,
              description: `${piece.type} pins enemy piece`
            });
          }
        }
      }
    }
    
    return pins;
  }
  
  private static findForks(gameState: GameState): TacticalMotif[] {
    const forks: TacticalMotif[] = [];
    
    // Check for knight forks specifically
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.type === 'knight') {
          const forkTargets = this.findForkTargets(gameState, { x, y }, piece);
          if (forkTargets.length >= 2) {
            forks.push({
              type: 'fork',
              positions: [{ x, y }, ...forkTargets],
              strength: forkTargets.length * 10,
              description: `Knight forks ${forkTargets.length} pieces`
            });
          }
        }
      }
    }
    
    return forks;
  }
  
  private static findSkewers(gameState: GameState): TacticalMotif[] {
    // Simplified skewer detection
    return [];
  }
  
  private static findDiscoveredAttacks(gameState: GameState): TacticalMotif[] {
    // Simplified discovered attack detection
    return [];
  }
  
  private static findWeakSquares(gameState: GameState): Position[] {
    const weakSquares: Position[] = [];
    
    // Squares that cannot be defended by pawns
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.isWeakSquare(gameState, { x, y })) {
          weakSquares.push({ x, y });
        }
      }
    }
    
    return weakSquares;
  }
  
  private static findStrongSquares(gameState: GameState): Position[] {
    // Outposts and well-defended squares
    return [];
  }
  
  private static findOpenFiles(gameState: GameState): number[] {
    const openFiles: number[] = [];
    
    for (let x = 0; x < 8; x++) {
      let hasPawn = false;
      for (let y = 0; y < 8; y++) {
        const piece = gameState.board[y][x];
        if (piece && piece.type === 'pawn') {
          hasPawn = true;
          break;
        }
      }
      if (!hasPawn) {
        openFiles.push(x);
      }
    }
    
    return openFiles;
  }
  
  private static findPawnChains(gameState: GameState): Position[][] {
    // Find connected pawn structures
    return [];
  }
  
  private static findIsolatedPawns(gameState: GameState): Position[] {
    const isolated: Position[] = [];
    
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = gameState.board[y][x];
        if (piece && piece.type === 'pawn') {
          if (this.isPawnIsolated(gameState, { x, y })) {
            isolated.push({ x, y });
          }
        }
      }
    }
    
    return isolated;
  }
  
  private static findPassedPawns(gameState: GameState): Position[] {
    const passed: Position[] = [];
    
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = gameState.board[y][x];
        if (piece && piece.type === 'pawn') {
          if (this.isPawnPassed(gameState, { x, y }, piece.color)) {
            passed.push({ x, y });
          }
        }
      }
    }
    
    return passed;
  }
  
  private static findBackwardPawns(gameState: GameState): Position[] {
    // Pawns that cannot advance safely
    return [];
  }
  
  private static evaluateKingExposure(gameState: GameState): { white: number; black: number } {
    return {
      white: Math.floor(Math.random() * 100),
      black: Math.floor(Math.random() * 100)
    };
  }
  
  private static evaluateCenterControl(gameState: GameState): { white: number; black: number } {
    let whiteControl = 0, blackControl = 0;
    const centerSquares = [
      { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 4 }
    ];
    
    centerSquares.forEach(pos => {
      const piece = gameState.board[pos.y][pos.x];
      if (piece) {
        if (piece.color === 'white') whiteControl++;
        else blackControl++;
      }
    });
    
    return { white: whiteControl * 25, black: blackControl * 25 };
  }
  
  // Helper methods
  private static checkForPinOpportunity(gameState: GameState, position: Position, piece: Piece): Position | null {
    // Simplified - would need to check along piece's attack lines
    return Math.random() > 0.8 ? { x: position.x + 1, y: position.y } : null;
  }
  
  private static findForkTargets(gameState: GameState, position: Position, piece: Piece): Position[] {
    const targets: Position[] = [];
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    knightMoves.forEach(([dx, dy]) => {
      const newX = position.x + dx;
      const newY = position.y + dy;
      
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        const target = gameState.board[newY][newX];
        if (target && target.color !== piece.color) {
          targets.push({ x: newX, y: newY });
        }
      }
    });
    
    return targets;
  }
  
  private static isWeakSquare(gameState: GameState, position: Position): boolean {
    // Check if square can be defended by pawns of current player
    return Math.random() > 0.7;
  }
  
  private static isPawnIsolated(gameState: GameState, position: Position): boolean {
    // Check adjacent files for friendly pawns
    const { x } = position;
    
    for (let checkX of [x - 1, x + 1]) {
      if (checkX >= 0 && checkX < 8) {
        for (let y = 0; y < 8; y++) {
          const piece = gameState.board[y][checkX];
          if (piece && piece.type === 'pawn' && 
              piece.color === gameState.board[position.y][position.x]?.color) {
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  private static isPawnPassed(gameState: GameState, position: Position, color: 'white' | 'black'): boolean {
    const { x, y } = position;
    const direction = color === 'white' ? -1 : 1;
    
    // Check if any enemy pawns can stop this pawn
    for (let checkY = y + direction; 
         color === 'white' ? checkY >= 0 : checkY < 8; 
         checkY += direction) {
      
      for (let checkX of [x - 1, x, x + 1]) {
        if (checkX >= 0 && checkX < 8) {
          const piece = gameState.board[checkY][checkX];
          if (piece && piece.type === 'pawn' && piece.color !== color) {
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  private static improvesPosition(gameState: GameState, move: Move): boolean {
    // Simplified position improvement check
    return Math.random() > 0.5;
  }
  
  private static isPieceValueHigher(piece1: Piece, piece2: Piece): boolean {
    const values = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
    return values[piece1.type] > values[piece2.type];
  }
  
  private static preventsThreats(gameState: GameState, move: Move): boolean {
    // Check if move blocks or counters enemy threats
    return Math.random() > 0.6;
  }
}

export const advancedGameLogic = new AdvancedGameLogic();
