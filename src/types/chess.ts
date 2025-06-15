
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
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: 'white' | 'black';
  moves: Move[];
  isGameOver: boolean;
  winner?: 'white' | 'black' | 'draw';
  selectedSquare?: Position;
  validMoves: Position[];
}
