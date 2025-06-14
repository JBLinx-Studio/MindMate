
import { GameState, Piece, Position, Move } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from './chessLogic';

export interface MoveValidationResult {
  isValid: boolean;
  reason?: string;
  warningMessage?: string;
  moveType: 'normal' | 'capture' | 'castle' | 'enPassant' | 'promotion';
  tacticalImplications?: string[];
}

export interface EnhancedMoveData {
  from: Position;
  to: Position;
  piece: Piece;
  capturedPiece?: Piece;
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  notation: string;
  evaluation: number;
}

export class EnhancedMoveValidator {
  
  validateMove(gameState: GameState, from: Position, to: Position): MoveValidationResult {
    const piece = gameState.board[from.y][from.x];
    
    if (!piece) {
      return {
        isValid: false,
        reason: 'No piece at source position',
        moveType: 'normal'
      };
    }
    
    if (piece.color !== gameState.currentPlayer) {
      return {
        isValid: false,
        reason: `It's ${gameState.currentPlayer}'s turn`,
        moveType: 'normal'
      };
    }
    
    const validMoves = getValidMoves(piece, gameState.board, gameState);
    const isValidDestination = validMoves.some(move => move.x === to.x && move.y === to.y);
    
    if (!isValidDestination) {
      return {
        isValid: false,
        reason: 'Invalid move for this piece',
        moveType: 'normal'
      };
    }
    
    // Determine move type and implications
    const targetPiece = gameState.board[to.y][to.x];
    let moveType: MoveValidationResult['moveType'] = 'normal';
    const tacticalImplications: string[] = [];
    
    if (targetPiece) {
      moveType = 'capture';
      tacticalImplications.push(`Captures ${targetPiece.type}`);
      
      if (targetPiece.type === 'queen') {
        tacticalImplications.push('Major piece captured!');
      }
    }
    
    // Check for special moves
    if (piece.type === 'king' && Math.abs(to.x - from.x) === 2) {
      moveType = 'castle';
      tacticalImplications.push('Castling - improves king safety');
    }
    
    if (piece.type === 'pawn' && !targetPiece && from.x !== to.x) {
      moveType = 'enPassant';
      tacticalImplications.push('En passant capture');
    }
    
    if (piece.type === 'pawn' && (to.y === 0 || to.y === 7)) {
      moveType = 'promotion';
      tacticalImplications.push('Pawn promotion to queen');
    }
    
    // Test if move would leave king in check
    const testGameState = makeMove(gameState, from, to);
    if (!testGameState) {
      return {
        isValid: false,
        reason: 'Move would leave king in check',
        moveType
      };
    }
    
    // Check for tactical warnings
    const warnings = this.checkForTacticalWarnings(gameState, from, to, piece);
    
    return {
      isValid: true,
      moveType,
      tacticalImplications,
      warningMessage: warnings.length > 0 ? warnings[0] : undefined
    };
  }
  
  private checkForTacticalWarnings(
    gameState: GameState, 
    from: Position, 
    to: Position, 
    piece: Piece
  ): string[] {
    const warnings: string[] = [];
    
    // Check if piece is moving away from defense
    if (this.isDefendingImportantPiece(gameState, from, piece)) {
      warnings.push('This piece is defending an important piece');
    }
    
    // Check if moving into attack
    if (this.isMovingIntoAttack(gameState, to, piece)) {
      warnings.push('This move puts your piece under attack');
    }
    
    // Check if missing obvious captures
    const obviousCaptures = this.findObviousCaptures(gameState);
    if (obviousCaptures.length > 0 && !this.isCapture(gameState, to)) {
      warnings.push('There might be better captures available');
    }
    
    return warnings;
  }
  
  private isDefendingImportantPiece(gameState: GameState, position: Position, piece: Piece): boolean {
    // Simplified check for piece defense
    const validMoves = getValidMoves(piece, gameState.board, gameState);
    
    for (const move of validMoves) {
      const defendedPiece = gameState.board[move.y][move.x];
      if (defendedPiece && 
          defendedPiece.color === piece.color && 
          (defendedPiece.type === 'queen' || defendedPiece.type === 'king')) {
        return true;
      }
    }
    
    return false;
  }
  
  private isMovingIntoAttack(gameState: GameState, to: Position, piece: Piece): boolean {
    // Check if enemy pieces can attack the destination
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const enemyPiece = gameState.board[y][x];
        if (enemyPiece && enemyPiece.color !== piece.color) {
          const enemyMoves = getValidMoves(enemyPiece, gameState.board, gameState);
          if (enemyMoves.some(move => move.x === to.x && move.y === to.y)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
  private findObviousCaptures(gameState: GameState): Position[] {
    const captures: Position[] = [];
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === gameState.currentPlayer) {
          const moves = getValidMoves(piece, gameState.board, gameState);
          
          for (const move of moves) {
            const target = gameState.board[move.y][move.x];
            if (target && target.color !== piece.color) {
              captures.push(move);
            }
          }
        }
      }
    }
    
    return captures;
  }
  
  private isCapture(gameState: GameState, to: Position): boolean {
    const targetPiece = gameState.board[to.y][to.x];
    return targetPiece !== null;
  }
  
  generateMoveData(gameState: GameState, from: Position, to: Position): EnhancedMoveData | null {
    const piece = gameState.board[from.y][from.x];
    if (!piece) return null;
    
    const capturedPiece = gameState.board[to.y][to.x];
    const newGameState = makeMove(gameState, from, to);
    
    if (!newGameState) return null;
    
    const isCheck = isInCheck(newGameState.board, newGameState.currentPlayer);
    const isCheckmate = newGameState.isGameOver && newGameState.winner !== 'draw';
    const isStalemate = newGameState.isGameOver && newGameState.winner === 'draw';
    
    // Generate proper notation
    let notation = '';
    if (piece.type === 'king' && Math.abs(to.x - from.x) === 2) {
      notation = to.x > from.x ? 'O-O' : 'O-O-O';
    } else {
      const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
      const capture = capturedPiece ? 'x' : '';
      const square = String.fromCharCode(97 + to.x) + (8 - to.y);
      notation = `${pieceSymbol}${capture}${square}`;
    }
    
    if (isCheckmate) notation += '#';
    else if (isCheck) notation += '+';
    
    return {
      from,
      to,
      piece,
      capturedPiece: capturedPiece || undefined,
      isCheck,
      isCheckmate,
      isStalemate,
      notation,
      evaluation: this.evaluateMove(gameState, newGameState)
    };
  }
  
  private evaluateMove(oldState: GameState, newState: GameState): number {
    // Simplified move evaluation
    const materialDiff = this.calculateMaterialDifference(oldState, newState);
    const positionalDiff = this.calculatePositionalDifference(oldState, newState);
    
    return materialDiff + positionalDiff;
  }
  
  private calculateMaterialDifference(oldState: GameState, newState: GameState): number {
    const pieceValues = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 };
    
    const oldMaterial = this.countMaterial(oldState.board, pieceValues);
    const newMaterial = this.countMaterial(newState.board, pieceValues);
    
    return newMaterial - oldMaterial;
  }
  
  private calculatePositionalDifference(oldState: GameState, newState: GameState): number {
    // Simplified positional evaluation
    const oldCenter = this.evaluateCenterControl(oldState.board);
    const newCenter = this.evaluateCenterControl(newState.board);
    
    return (newCenter - oldCenter) * 0.1;
  }
  
  private countMaterial(board: (Piece | null)[][], values: any): number {
    let total = 0;
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece) {
          const value = values[piece.type] || 0;
          total += piece.color === 'white' ? value : -value;
        }
      }
    }
    
    return total;
  }
  
  private evaluateCenterControl(board: (Piece | null)[][]): number {
    let score = 0;
    const centerSquares = [
      { x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 3 }, { x: 4, y: 4 }
    ];
    
    for (const square of centerSquares) {
      const piece = board[square.y][square.x];
      if (piece) {
        score += piece.color === 'white' ? 1 : -1;
      }
    }
    
    return score;
  }
}

export const enhancedMoveValidator = new EnhancedMoveValidator();
