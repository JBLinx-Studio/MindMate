import { GameState, Piece, Position, Move } from '../types/chess';

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
  
  static boardToFEN(gameState: GameState): string {
    return this.boardToFen(gameState);
  }
  
  static movesToPGN(moves: Move[], result: string = '*'): string {
    let pgn = '';
    
    // Add PGN headers
    pgn += '[Event "Chess Game"]\n';
    pgn += '[Site "Lovable Chess App"]\n';
    pgn += `[Date "${new Date().toISOString().split('T')[0]}"]\n`;
    pgn += '[Round "1"]\n';
    pgn += '[White "Player 1"]\n';
    pgn += '[Black "Player 2"]\n';
    pgn += `[Result "${result}"]\n\n`;
    
    // Add moves
    for (let i = 0; i < moves.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      pgn += `${moveNumber}. ${moves[i].notation}`;
      
      if (i + 1 < moves.length) {
        pgn += ` ${moves[i + 1].notation}`;
      }
      
      pgn += ' ';
    }
    
    pgn += result;
    
    return pgn;
  }
  
  static pgnToMoves(pgn: string): Move[] {
    // Simple PGN parser - extract move notation
    const moves: Move[] = [];
    
    // Remove headers and get moves section
    const movesSection = pgn.split('\n\n').pop() || '';
    
    // Remove result notation
    const cleanMoves = movesSection.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');
    
    // Extract move notation
    const movePattern = /\d+\.\s*([^\s]+)(?:\s+([^\s]+))?/g;
    let match;
    
    while ((match = movePattern.exec(cleanMoves)) !== null) {
      // Add white move
      if (match[1]) {
        moves.push({
          from: { x: 0, y: 0 }, // Placeholder - would need full parsing
          to: { x: 0, y: 0 }, // Placeholder - would need full parsing
          piece: { type: 'pawn', color: 'white', position: { x: 0, y: 0 } }, // Placeholder
          notation: match[1],
          timestamp: new Date()
        });
      }
      
      // Add black move if exists
      if (match[2]) {
        moves.push({
          from: { x: 0, y: 0 }, // Placeholder - would need full parsing
          to: { x: 0, y: 0 }, // Placeholder - would need full parsing
          piece: { type: 'pawn', color: 'black', position: { x: 0, y: 0 } }, // Placeholder
          notation: match[2],
          timestamp: new Date()
        });
      }
    }
    
    return moves;
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
