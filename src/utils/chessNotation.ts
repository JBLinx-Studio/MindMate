
import { GameState, Piece, Position } from '../types/chess';

export class ChessNotation {
  static fenToBoard(fen: string): { board: (Piece | null)[][], currentPlayer: 'white' | 'black' } {
    const [boardStr, activeColor] = fen.split(' ');
    const ranks = boardStr.split('/');
    const board: (Piece | null)[][] = [];
    
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      const rank = ranks[rankIndex];
      const row: (Piece | null)[] = [];
      
      for (let i = 0; i < rank.length; i++) {
        const char = rank[i];
        
        if (char >= '1' && char <= '8') {
          // Empty squares
          const emptySquares = parseInt(char);
          for (let j = 0; j < emptySquares; j++) {
            row.push(null);
          }
        } else {
          // Piece
          const color = char === char.toUpperCase() ? 'white' : 'black';
          const pieceType = this.charToPieceType(char.toLowerCase());
          
          if (pieceType) {
            row.push({
              type: pieceType,
              color,
              position: { x: row.length, y: rankIndex },
              hasMoved: false
            });
          }
        }
      }
      
      board.push(row);
    }
    
    return {
      board,
      currentPlayer: activeColor === 'w' ? 'white' : 'black'
    };
  }
  
  static boardToFen(gameState: GameState): string {
    let fen = '';
    
    // Board position
    for (let y = 0; y < 8; y++) {
      let emptyCount = 0;
      let rankStr = '';
      
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        
        if (piece) {
          if (emptyCount > 0) {
            rankStr += emptyCount.toString();
            emptyCount = 0;
          }
          
          const pieceChar = this.pieceTypeToChar(piece.type);
          rankStr += piece.color === 'white' ? pieceChar.toUpperCase() : pieceChar;
        } else {
          emptyCount++;
        }
      }
      
      if (emptyCount > 0) {
        rankStr += emptyCount.toString();
      }
      
      fen += rankStr;
      if (y < 7) fen += '/';
    }
    
    // Active color
    fen += ' ' + (gameState.currentPlayer === 'white' ? 'w' : 'b');
    
    // Castling availability (simplified)
    fen += ' KQkq';
    
    // En passant target square (simplified)
    fen += ' -';
    
    // Halfmove and fullmove counters
    fen += ' 0 1';
    
    return fen;
  }
  
  static moveToNotation(
    piece: Piece, 
    from: Position, 
    to: Position, 
    board: (Piece | null)[][],
    isCapture: boolean = false,
    isCheck: boolean = false,
    isCheckmate: boolean = false
  ): string {
    // Handle castling
    if (piece.type === 'king' && Math.abs(to.x - from.x) === 2) {
      return to.x > from.x ? 'O-O' : 'O-O-O';
    }
    
    let notation = '';
    
    // Piece symbol (except for pawns)
    if (piece.type !== 'pawn') {
      notation += piece.type.charAt(0).toUpperCase();
    }
    
    // Disambiguation (simplified for now)
    
    // Capture notation
    if (isCapture) {
      if (piece.type === 'pawn') {
        notation += String.fromCharCode(97 + from.x);
      }
      notation += 'x';
    }
    
    // Destination square
    notation += String.fromCharCode(97 + to.x) + (8 - to.y);
    
    // Pawn promotion (simplified to queen)
    if (piece.type === 'pawn' && (to.y === 0 || to.y === 7)) {
      notation += '=Q';
    }
    
    // Check and checkmate
    if (isCheckmate) {
      notation += '#';
    } else if (isCheck) {
      notation += '+';
    }
    
    return notation;
  }
  
  static parseMove(notation: string): {
    piece?: string;
    from?: Position;
    to?: Position;
    isCapture: boolean;
    isCheck: boolean;
    isCheckmate: boolean;
    isCastle: boolean;
    promotion?: string;
  } {
    // Handle castling
    if (notation === 'O-O' || notation === 'O-O-O') {
      return {
        isCastle: true,
        isCapture: false,
        isCheck: false,
        isCheckmate: false
      };
    }
    
    const isCheckmate = notation.includes('#');
    const isCheck = notation.includes('+') && !isCheckmate;
    const isCapture = notation.includes('x');
    
    // Remove check/checkmate indicators
    let cleanNotation = notation.replace(/[+#]/g, '');
    
    // Handle promotion
    let promotion: string | undefined;
    if (cleanNotation.includes('=')) {
      const parts = cleanNotation.split('=');
      cleanNotation = parts[0];
      promotion = parts[1];
    }
    
    // Extract destination square
    const squareMatch = cleanNotation.match(/[a-h][1-8]$/);
    let to: Position | undefined;
    
    if (squareMatch) {
      const square = squareMatch[0];
      to = {
        x: square.charCodeAt(0) - 97,
        y: 8 - parseInt(square[1])
      };
    }
    
    // Extract piece type
    let piece: string | undefined;
    if (cleanNotation.match(/^[NBRQK]/)) {
      piece = cleanNotation[0].toLowerCase();
    } else {
      piece = 'pawn';
    }
    
    return {
      piece,
      to,
      isCapture,
      isCheck,
      isCheckmate,
      isCastle: false,
      promotion
    };
  }
  
  private static charToPieceType(char: string): Piece['type'] | null {
    switch (char) {
      case 'p': return 'pawn';
      case 'r': return 'rook';
      case 'n': return 'knight';
      case 'b': return 'bishop';
      case 'q': return 'queen';
      case 'k': return 'king';
      default: return null;
    }
  }
  
  private static pieceTypeToChar(type: Piece['type']): string {
    switch (type) {
      case 'pawn': return 'p';
      case 'rook': return 'r';
      case 'knight': return 'n';
      case 'bishop': return 'b';
      case 'queen': return 'q';
      case 'king': return 'k';
    }
  }
}
