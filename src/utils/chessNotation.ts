
import { GameState, Piece, Position, Move } from '../types/chess';
import { initializeBoard } from './chessLogic';

export class ChessNotation {
  static boardToFEN(gameState: GameState): string {
    let fen = '';
    
    // Board position
    for (let y = 0; y < 8; y++) {
      let emptyCount = 0;
      let rowFen = '';
      
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        
        if (!piece) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            rowFen += emptyCount.toString();
            emptyCount = 0;
          }
          
          const pieceChar = this.pieceToFENChar(piece);
          rowFen += pieceChar;
        }
      }
      
      if (emptyCount > 0) {
        rowFen += emptyCount.toString();
      }
      
      fen += rowFen;
      if (y < 7) fen += '/';
    }
    
    // Active color
    fen += ` ${gameState.currentPlayer.charAt(0)}`;
    
    // Castling rights (simplified)
    let castling = '';
    const whiteKing = this.findPiece(gameState.board, 'king', 'white');
    const blackKing = this.findPiece(gameState.board, 'king', 'black');
    
    if (whiteKing && !whiteKing.hasMoved) {
      const whiteKingsideRook = gameState.board[7][7];
      const whiteQueensideRook = gameState.board[7][0];
      
      if (whiteKingsideRook && !whiteKingsideRook.hasMoved) castling += 'K';
      if (whiteQueensideRook && !whiteQueensideRook.hasMoved) castling += 'Q';
    }
    
    if (blackKing && !blackKing.hasMoved) {
      const blackKingsideRook = gameState.board[0][7];
      const blackQueensideRook = gameState.board[0][0];
      
      if (blackKingsideRook && !blackKingsideRook.hasMoved) castling += 'k';
      if (blackQueensideRook && !blackQueensideRook.hasMoved) castling += 'q';
    }
    
    fen += ` ${castling || '-'}`;
    
    // En passant (simplified)
    fen += ' -';
    
    // Halfmove and fullmove clocks
    const fullmoveNumber = Math.floor(gameState.moves.length / 2) + 1;
    fen += ` 0 ${fullmoveNumber}`;
    
    return fen;
  }
  
  static fenToBoard(fen: string): { board: (Piece | null)[][], currentPlayer: 'white' | 'black' } {
    const parts = fen.split(' ');
    const boardPart = parts[0];
    const activeColor = parts[1] === 'w' ? 'white' : 'black';
    
    const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    const rows = boardPart.split('/');
    
    for (let y = 0; y < 8; y++) {
      const row = rows[y];
      let x = 0;
      
      for (const char of row) {
        if (char >= '1' && char <= '8') {
          x += parseInt(char);
        } else {
          const piece = this.fenCharToPiece(char, { x, y });
          if (piece) {
            board[y][x] = piece;
          }
          x++;
        }
      }
    }
    
    return { board, currentPlayer: activeColor };
  }
  
  static movesToPGN(moves: Move[], gameResult?: string): string {
    let pgn = '[Event "Live Game"]\n';
    pgn += `[Date "${new Date().toISOString().split('T')[0]}"]\n`;
    pgn += '[White "Player 1"]\n';
    pgn += '[Black "Player 2"]\n';
    pgn += `[Result "${gameResult || '*'}"]\n\n`;
    
    for (let i = 0; i < moves.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      pgn += `${moveNumber}. ${moves[i].notation}`;
      
      if (moves[i + 1]) {
        pgn += ` ${moves[i + 1].notation}`;
      }
      
      pgn += ' ';
      
      // Line break every 8 moves for readability
      if (moveNumber % 4 === 0) {
        pgn += '\n';
      }
    }
    
    pgn += ` ${gameResult || '*'}`;
    return pgn;
  }
  
  static pgnToMoves(pgn: string): Move[] {
    // Remove headers and metadata
    const gameText = pgn.split('\n').filter(line => 
      !line.startsWith('[') && line.trim() !== ''
    ).join(' ');
    
    // Extract move notation
    const moveRegex = /\d+\.\s*([^\s]+)(?:\s+([^\s]+))?/g;
    const moves: Move[] = [];
    let match;
    
    while ((match = moveRegex.exec(gameText)) !== null) {
      const whiteMove = match[1];
      const blackMove = match[2];
      
      if (whiteMove && whiteMove !== '*' && !whiteMove.includes('-')) {
        moves.push(this.createMoveFromNotation(whiteMove, 'white'));
      }
      
      if (blackMove && blackMove !== '*' && !blackMove.includes('-')) {
        moves.push(this.createMoveFromNotation(blackMove, 'black'));
      }
    }
    
    return moves;
  }
  
  private static pieceToFENChar(piece: Piece): string {
    const chars = {
      pawn: 'p',
      rook: 'r',
      knight: 'n',
      bishop: 'b',
      queen: 'q',
      king: 'k'
    };
    
    const char = chars[piece.type];
    return piece.color === 'white' ? char.toUpperCase() : char;
  }
  
  private static fenCharToPiece(char: string, position: Position): Piece | null {
    const color = char === char.toUpperCase() ? 'white' : 'black';
    const lowerChar = char.toLowerCase();
    
    const types: { [key: string]: Piece['type'] } = {
      'p': 'pawn',
      'r': 'rook',
      'n': 'knight',
      'b': 'bishop',
      'q': 'queen',
      'k': 'king'
    };
    
    const type = types[lowerChar];
    if (!type) return null;
    
    return { type, color, position };
  }
  
  private static findPiece(board: (Piece | null)[][], type: Piece['type'], color: 'white' | 'black'): Piece | null {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x];
        if (piece && piece.type === type && piece.color === color) {
          return piece;
        }
      }
    }
    return null;
  }
  
  private static createMoveFromNotation(notation: string, color: 'white' | 'black'): Move {
    // Simplified move creation from notation
    return {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
      piece: { type: 'pawn', color, position: { x: 0, y: 0 } },
      notation,
      timestamp: new Date()
    };
  }
}
