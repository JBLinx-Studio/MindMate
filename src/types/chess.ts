
export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
  color: 'white' | 'black';
  position: Position;
  hasMoved?: boolean;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  notation: string;
  timestamp: Date;
  specialMove?: 'castle' | 'enPassant' | 'promotion';
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: 'white' | 'black';
  moves: Move[];
  isGameOver: boolean;
  winner?: 'white' | 'black' | 'draw';
  selectedSquare?: Position;
  validMoves: Position[];
  lastMoveHighlight?: { from: Position; to: Position };
  timeRemaining?: { white: number; black: number };
  gameResult?: {
    type: 'checkmate' | 'stalemate' | 'resignation' | 'timeout' | 'draw';
    winner?: 'white' | 'black';
    reason?: string;
  };
  fullMoveNumber: number;
}
