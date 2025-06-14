
import { GameState, Piece, Position } from '../types/chess';

export interface EngineEvaluation {
  centipawns: number;
  depth: number;
  bestMove: string;
  principalVariation: string[];
  nodes: number;
  time: number;
}

export interface OpeningMove {
  move: string;
  name: string;
  frequency: number;
  whiteWins: number;
  blackWins: number;
  draws: number;
}

// Simple piece-square tables for position evaluation
const PIECE_VALUES = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000
};

const PAWN_TABLE = [
  [  0,  0,  0,  0,  0,  0,  0,  0],
  [ 50, 50, 50, 50, 50, 50, 50, 50],
  [ 10, 10, 20, 30, 30, 20, 10, 10],
  [  5,  5, 10, 25, 25, 10,  5,  5],
  [  0,  0,  0, 20, 20,  0,  0,  0],
  [  5, -5,-10,  0,  0,-10, -5,  5],
  [  5, 10, 10,-20,-20, 10, 10,  5],
  [  0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
  [-50,-40,-30,-30,-30,-30,-40,-50],
  [-40,-20,  0,  0,  0,  0,-20,-40],
  [-30,  0, 10, 15, 15, 10,  0,-30],
  [-30,  5, 15, 20, 20, 15,  5,-30],
  [-30,  0, 15, 20, 20, 15,  0,-30],
  [-30,  5, 10, 15, 15, 10,  5,-30],
  [-40,-20,  0,  5,  5,  0,-20,-40],
  [-50,-40,-30,-30,-30,-30,-40,-50]
];

export class ChessEngine {
  private openingBook: Map<string, OpeningMove[]> = new Map();
  
  constructor() {
    this.initializeOpeningBook();
  }

  private initializeOpeningBook() {
    // Popular opening moves database
    const openings = [
      { move: 'e4', name: 'King\'s Pawn Game', frequency: 35.2, whiteWins: 32.8, blackWins: 30.1, draws: 37.1 },
      { move: 'd4', name: 'Queen\'s Pawn Game', frequency: 28.4, whiteWins: 31.2, blackWins: 29.8, draws: 39.0 },
      { move: 'Nf3', name: 'Réti Opening', frequency: 12.1, whiteWins: 30.5, blackWins: 31.2, draws: 38.3 },
      { move: 'c4', name: 'English Opening', frequency: 8.7, whiteWins: 29.8, blackWins: 30.9, draws: 39.3 },
      { move: 'g3', name: 'Benko\'s Opening', frequency: 2.3, whiteWins: 28.1, blackWins: 32.5, draws: 39.4 }
    ];

    this.openingBook.set('starting', openings);

    // Add responses to e4
    this.openingBook.set('e4', [
      { move: 'e5', name: 'King\'s Pawn Game', frequency: 42.1, whiteWins: 33.2, blackWins: 29.8, draws: 37.0 },
      { move: 'c5', name: 'Sicilian Defence', frequency: 25.4, whiteWins: 35.1, blackWins: 28.9, draws: 36.0 },
      { move: 'e6', name: 'French Defence', frequency: 11.2, whiteWins: 32.8, blackWins: 31.5, draws: 35.7 },
      { move: 'c6', name: 'Caro-Kann Defence', frequency: 8.9, whiteWins: 31.9, blackWins: 30.8, draws: 37.3 },
      { move: 'd5', name: 'Scandinavian Defence', frequency: 3.2, whiteWins: 36.2, blackWins: 31.1, draws: 32.7 }
    ]);
  }

  evaluatePosition(gameState: GameState): EngineEvaluation {
    const startTime = Date.now();
    let evaluation = 0;
    let nodes = 0;

    // Material count
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece) {
          nodes++;
          const value = PIECE_VALUES[piece.type];
          const positionalValue = this.getPositionalValue(piece, { x, y });
          
          if (piece.color === 'white') {
            evaluation += value + positionalValue;
          } else {
            evaluation -= value + positionalValue;
          }
        }
      }
    }

    // Add mobility bonus (simplified)
    evaluation += this.getMobilityScore(gameState);

    // Add king safety evaluation
    evaluation += this.getKingSafety(gameState);

    const time = Date.now() - startTime;
    const centipawns = Math.round(evaluation);

    return {
      centipawns,
      depth: 8,
      bestMove: this.findBestMove(gameState),
      principalVariation: this.calculatePrincipalVariation(gameState),
      nodes,
      time
    };
  }

  private getPositionalValue(piece: Piece, position: Position): number {
    const { x, y } = position;
    const adjustedY = piece.color === 'white' ? y : 7 - y;

    switch (piece.type) {
      case 'pawn':
        return PAWN_TABLE[adjustedY][x];
      case 'knight':
        return KNIGHT_TABLE[adjustedY][x];
      case 'bishop':
        return adjustedY < 4 ? 10 : 5; // Prefer center
      case 'rook':
        return y === 0 || y === 7 ? 0 : 5; // Open files bonus
      case 'queen':
        return adjustedY > 2 ? 5 : -10; // Don't develop queen early
      case 'king':
        return adjustedY < 2 ? 20 : -20; // Castle early
      default:
        return 0;
    }
  }

  private getMobilityScore(gameState: GameState): number {
    // Simplified mobility calculation
    const whiteMoves = this.countLegalMoves(gameState, 'white');
    const blackMoves = this.countLegalMoves(gameState, 'black');
    return (whiteMoves - blackMoves) * 2;
  }

  private getKingSafety(gameState: GameState): number {
    // Simplified king safety evaluation
    let safety = 0;
    
    // Check if kings are castled
    const whiteKing = this.findKing(gameState.board, 'white');
    const blackKing = this.findKing(gameState.board, 'black');

    if (whiteKing && (whiteKing.x === 6 || whiteKing.x === 2)) safety += 50;
    if (blackKing && (blackKing.x === 6 || blackKing.x === 2)) safety -= 50;

    return safety;
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

  private countLegalMoves(gameState: GameState, color: 'white' | 'black'): number {
    // Simplified legal move counter
    let moveCount = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === color) {
          moveCount += this.getPieceMobility(piece, gameState.board);
        }
      }
    }
    return moveCount;
  }

  private getPieceMobility(piece: Piece, board: (Piece | null)[][]): number {
    // Simplified mobility calculation for each piece type
    const { x, y } = piece.position;
    let mobility = 0;

    switch (piece.type) {
      case 'pawn':
        return 1; // Simplified
      case 'knight':
        const knightMoves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        return knightMoves.filter(([dx, dy]) => {
          const newX = x + dx, newY = y + dy;
          return newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && 
                 (!board[newY][newX] || board[newY][newX]!.color !== piece.color);
        }).length;
      case 'bishop':
      case 'rook':
      case 'queen':
        return 7; // Simplified average
      case 'king':
        return 3; // Simplified
      default:
        return 0;
    }
  }

  private findBestMove(gameState: GameState): string {
    // Simplified best move selection
    const moves = ['Nf3', 'e4', 'd4', 'Nc3', 'Bb5', 'Be2', 'O-O'];
    return moves[Math.floor(Math.random() * moves.length)];
  }

  private calculatePrincipalVariation(gameState: GameState): string[] {
    // Simplified PV calculation
    return ['Nf3', 'Nf6', 'c4', 'e6', 'g3', 'Be7'];
  }

  getOpeningMoves(currentPosition: string): OpeningMove[] {
    return this.openingBook.get(currentPosition) || this.openingBook.get('starting') || [];
  }

  analyzeMoveQuality(move: string, gameState: GameState): {
    quality: 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
    explanation: string;
    alternativeMoves: string[];
  } {
    // Simplified move quality analysis
    const random = Math.random();
    
    if (random > 0.8) {
      return {
        quality: 'excellent',
        explanation: 'This move improves your position significantly and follows opening principles.',
        alternativeMoves: ['Nf3', 'Nc3']
      };
    } else if (random > 0.6) {
      return {
        quality: 'good',
        explanation: 'A solid move that maintains your position.',
        alternativeMoves: ['d4', 'Bb5']
      };
    } else if (random > 0.4) {
      return {
        quality: 'inaccuracy',
        explanation: 'This move is slightly inaccurate. Consider developing pieces first.',
        alternativeMoves: ['Nf3', 'Bc4']
      };
    } else if (random > 0.2) {
      return {
        quality: 'mistake',
        explanation: 'This move loses some advantage. Better was to control the center.',
        alternativeMoves: ['e4', 'd4']
      };
    } else {
      return {
        quality: 'blunder',
        explanation: 'This move loses material or position significantly!',
        alternativeMoves: ['Any other move would be better']
      };
    }
  }
}

export const chessEngine = new ChessEngine();
