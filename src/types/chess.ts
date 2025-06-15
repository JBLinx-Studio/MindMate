
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

export const createInitialGameState = (): GameState => {
  // Create an empty 8x8 board
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Initialize with starting chess position
  // White pieces (bottom rows)
  const whitePieces: Piece[] = [
    // Pawns
    ...Array(8).fill(null).map((_, i) => ({ type: 'pawn' as const, color: 'white' as const, position: { x: i, y: 6 } })),
    // Back row
    { type: 'rook', color: 'white', position: { x: 0, y: 7 } },
    { type: 'knight', color: 'white', position: { x: 1, y: 7 } },
    { type: 'bishop', color: 'white', position: { x: 2, y: 7 } },
    { type: 'queen', color: 'white', position: { x: 3, y: 7 } },
    { type: 'king', color: 'white', position: { x: 4, y: 7 } },
    { type: 'bishop', color: 'white', position: { x: 5, y: 7 } },
    { type: 'knight', color: 'white', position: { x: 6, y: 7 } },
    { type: 'rook', color: 'white', position: { x: 7, y: 7 } },
  ];

  // Black pieces (top rows)
  const blackPieces: Piece[] = [
    // Pawns
    ...Array(8).fill(null).map((_, i) => ({ type: 'pawn' as const, color: 'black' as const, position: { x: i, y: 1 } })),
    // Back row
    { type: 'rook', color: 'black', position: { x: 0, y: 0 } },
    { type: 'knight', color: 'black', position: { x: 1, y: 0 } },
    { type: 'bishop', color: 'black', position: { x: 2, y: 0 } },
    { type: 'queen', color: 'black', position: { x: 3, y: 0 } },
    { type: 'king', color: 'black', position: { x: 4, y: 0 } },
    { type: 'bishop', color: 'black', position: { x: 5, y: 0 } },
    { type: 'knight', color: 'black', position: { x: 6, y: 0 } },
    { type: 'rook', color: 'black', position: { x: 7, y: 0 } },
  ];

  // Place pieces on the board
  [...whitePieces, ...blackPieces].forEach(piece => {
    board[piece.position.y][piece.position.x] = piece;
  });

  return {
    board,
    currentPlayer: 'white',
    moves: [],
    isGameOver: false,
    validMoves: [],
    fullMoveNumber: 1,
  };
};
