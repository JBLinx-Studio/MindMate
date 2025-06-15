
import { Position, Piece, GameState } from '../types/chess';

export interface EngineAnalysis {
  bestMove: { from: Position; to: Position } | null;
  evaluation: number; // In centipawns
  depth: number;
  principalVariation: string[];
  mate?: number; // Moves to mate (if applicable)
}

export interface OpeningInfo {
  name: string;
  eco: string;
  moves: string[];
  popularity: number;
  winRate: { white: number; black: number; draw: number };
}

class AdvancedChessEngine {
  private openingBook: Map<string, OpeningInfo> = new Map();
  private transpositionTable: Map<string, EngineAnalysis> = new Map();
  
  constructor() {
    this.initializeOpeningBook();
  }

  private initializeOpeningBook() {
    const openings: OpeningInfo[] = [
      {
        name: "Italian Game",
        eco: "C50",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
        popularity: 85,
        winRate: { white: 38, black: 35, draw: 27 }
      },
      {
        name: "Ruy Lopez",
        eco: "C60",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
        popularity: 92,
        winRate: { white: 40, black: 32, draw: 28 }
      },
      {
        name: "Queen's Gambit",
        eco: "D06",
        moves: ["d4", "d5", "c4"],
        popularity: 78,
        winRate: { white: 36, black: 34, draw: 30 }
      },
      {
        name: "Sicilian Defense",
        eco: "B20",
        moves: ["e4", "c5"],
        popularity: 95,
        winRate: { white: 35, black: 37, draw: 28 }
      },
      {
        name: "French Defense",
        eco: "C00",
        moves: ["e4", "e6"],
        popularity: 65,
        winRate: { white: 39, black: 33, draw: 28 }
      }
    ];

    openings.forEach(opening => {
      const key = opening.moves.join('|');
      this.openingBook.set(key, opening);
    });
  }

  analyzePosition(gameState: GameState, depth: number = 4): EngineAnalysis {
    const positionKey = this.getPositionKey(gameState);
    const cached = this.transpositionTable.get(positionKey);
    
    if (cached && cached.depth >= depth) {
      return cached;
    }

    const analysis = this.minimax(gameState, depth, -Infinity, Infinity, gameState.currentPlayer === 'white');
    
    this.transpositionTable.set(positionKey, analysis);
    return analysis;
  }

  private minimax(gameState: GameState, depth: number, alpha: number, beta: number, maximizing: boolean): EngineAnalysis {
    if (depth === 0 || gameState.isGameOver) {
      return {
        bestMove: null,
        evaluation: this.evaluatePosition(gameState),
        depth: 0,
        principalVariation: []
      };
    }

    const moves = this.getAllLegalMoves(gameState);
    let bestMove: { from: Position; to: Position } | null = null;
    let bestEval = maximizing ? -Infinity : Infinity;
    const pv: string[] = [];

    for (const move of moves) {
      const newGameState = this.makeMove(gameState, move.from, move.to);
      if (!newGameState) continue;

      const evaluation = this.minimax(newGameState, depth - 1, alpha, beta, !maximizing);
      
      if (maximizing && evaluation.evaluation > bestEval) {
        bestEval = evaluation.evaluation;
        bestMove = move;
      } else if (!maximizing && evaluation.evaluation < bestEval) {
        bestEval = evaluation.evaluation;
        bestMove = move;
      }

      if (maximizing) {
        alpha = Math.max(alpha, evaluation.evaluation);
      } else {
        beta = Math.min(beta, evaluation.evaluation);
      }

      if (beta <= alpha) break; // Alpha-beta pruning
    }

    return {
      bestMove,
      evaluation: bestEval,
      depth,
      principalVariation: pv
    };
  }

  private evaluatePosition(gameState: GameState): number {
    if (gameState.isGameOver) {
      if (gameState.result === 'checkmate') {
        return gameState.currentPlayer === 'white' ? -9999 : 9999;
      }
      return 0; // Draw
    }

    let evaluation = 0;
    const pieceValues = { 'pawn': 100, 'knight': 320, 'bishop': 330, 'rook': 500, 'queen': 900, 'king': 0 };

    // Material evaluation
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          const value = pieceValues[piece.type];
          evaluation += piece.color === 'white' ? value : -value;
        }
      }
    }

    // Positional evaluation
    evaluation += this.evaluatePositional(gameState);
    
    // King safety
    evaluation += this.evaluateKingSafety(gameState);
    
    // Pawn structure
    evaluation += this.evaluatePawnStructure(gameState);

    return evaluation;
  }

  private evaluatePositional(gameState: GameState): number {
    let positional = 0;
    
    // Center control
    const centerSquares = [
      { x: 3, y: 3 }, { x: 4, y: 3 },
      { x: 3, y: 4 }, { x: 4, y: 4 }
    ];
    
    centerSquares.forEach(square => {
      const piece = gameState.board[square.y][square.x];
      if (piece) {
        const value = piece.type === 'pawn' ? 20 : 10;
        positional += piece.color === 'white' ? value : -value;
      }
    });

    return positional;
  }

  private evaluateKingSafety(gameState: GameState): number {
    // Simplified king safety evaluation
    return 0;
  }

  private evaluatePawnStructure(gameState: GameState): number {
    // Simplified pawn structure evaluation
    return 0;
  }

  private getAllLegalMoves(gameState: GameState): { from: Position; to: Position }[] {
    const moves: { from: Position; to: Position }[] = [];
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === gameState.currentPlayer) {
          const pieceMoves = this.getPieceMoves(piece, { x, y }, gameState);
          moves.push(...pieceMoves.map(to => ({ from: { x, y }, to })));
        }
      }
    }
    
    return moves;
  }

  private getPieceMoves(piece: Piece, position: Position, gameState: GameState): Position[] {
    const moves: Position[] = [];
    const { x, y } = position;

    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward moves
        if (this.isValidSquare(x, y + direction) && !gameState.board[y + direction][x]) {
          moves.push({ x, y: y + direction });
          
          // Two squares from start
          if (y === startRow && !gameState.board[y + direction * 2][x]) {
            moves.push({ x, y: y + direction * 2 });
          }
        }
        
        // Captures
        [-1, 1].forEach(dx => {
          if (this.isValidSquare(x + dx, y + direction)) {
            const target = gameState.board[y + direction][x + dx];
            if (target && target.color !== piece.color) {
              moves.push({ x: x + dx, y: y + direction });
            }
          }
        });
        break;
        
      case 'rook':
        this.addLinearMoves(moves, position, gameState, [
          [0, 1], [0, -1], [1, 0], [-1, 0]
        ]);
        break;
        
      case 'bishop':
        this.addLinearMoves(moves, position, gameState, [
          [1, 1], [1, -1], [-1, 1], [-1, -1]
        ]);
        break;
        
      case 'queen':
        this.addLinearMoves(moves, position, gameState, [
          [0, 1], [0, -1], [1, 0], [-1, 0],
          [1, 1], [1, -1], [-1, 1], [-1, -1]
        ]);
        break;
        
      case 'knight':
        const knightMoves = [
          [2, 1], [2, -1], [-2, 1], [-2, -1],
          [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        knightMoves.forEach(([dx, dy]) => {
          const newX = x + dx;
          const newY = y + dy;
          if (this.isValidSquare(newX, newY)) {
            const target = gameState.board[newY][newX];
            if (!target || target.color !== piece.color) {
              moves.push({ x: newX, y: newY });
            }
          }
        });
        break;
        
      case 'king':
        const kingMoves = [
          [0, 1], [0, -1], [1, 0], [-1, 0],
          [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        kingMoves.forEach(([dx, dy]) => {
          const newX = x + dx;
          const newY = y + dy;
          if (this.isValidSquare(newX, newY)) {
            const target = gameState.board[newY][newX];
            if (!target || target.color !== piece.color) {
              moves.push({ x: newX, y: newY });
            }
          }
        });
        break;
    }

    return moves;
  }

  private addLinearMoves(moves: Position[], position: Position, gameState: GameState, directions: number[][]) {
    directions.forEach(([dx, dy]) => {
      let newX = position.x + dx;
      let newY = position.y + dy;
      
      while (this.isValidSquare(newX, newY)) {
        const target = gameState.board[newY][newX];
        
        if (!target) {
          moves.push({ x: newX, y: newY });
        } else {
          if (target.color !== gameState.board[position.y][position.x]?.color) {
            moves.push({ x: newX, y: newY });
          }
          break;
        }
        
        newX += dx;
        newY += dy;
      }
    });
  }

  private isValidSquare(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  private makeMove(gameState: GameState, from: Position, to: Position): GameState | null {
    // This would implement the actual move logic
    // For now, returning null to indicate invalid move
    return null;
  }

  private getPositionKey(gameState: GameState): string {
    let key = '';
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        key += piece ? `${piece.color[0]}${piece.type[0]}` : '..';
      }
    }
    key += gameState.currentPlayer[0];
    return key;
  }

  getOpeningInfo(moves: string[]): OpeningInfo | null {
    // Try to match progressively longer sequences
    for (let i = moves.length; i >= 2; i--) {
      const sequence = moves.slice(0, i).join('|');
      const opening = this.openingBook.get(sequence);
      if (opening) {
        return opening;
      }
    }
    return null;
  }

  suggestNextMove(gameState: GameState): { from: Position; to: Position } | null {
    const analysis = this.analyzePosition(gameState, 3);
    return analysis.bestMove;
  }

  evaluateMove(gameState: GameState, from: Position, to: Position): {
    quality: 'brilliant' | 'great' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
    evaluation: number;
    comment: string;
  } {
    const beforeEval = this.evaluatePosition(gameState);
    const afterGameState = this.makeMove(gameState, from, to);
    
    if (!afterGameState) {
      return {
        quality: 'blunder',
        evaluation: 0,
        comment: 'Illegal move'
      };
    }
    
    const afterEval = this.evaluatePosition(afterGameState);
    const evalDiff = Math.abs(afterEval - beforeEval);
    
    if (evalDiff < 25) return { quality: 'great', evaluation: afterEval, comment: 'Excellent move!' };
    if (evalDiff < 50) return { quality: 'good', evaluation: afterEval, comment: 'Good move' };
    if (evalDiff < 100) return { quality: 'inaccuracy', evaluation: afterEval, comment: 'Inaccurate move' };
    if (evalDiff < 200) return { quality: 'mistake', evaluation: afterEval, comment: 'Mistake' };
    
    return { quality: 'blunder', evaluation: afterEval, comment: 'Blunder!' };
  }
}

export const advancedChessEngine = new AdvancedChessEngine();
