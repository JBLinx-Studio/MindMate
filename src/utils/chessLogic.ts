
import { Piece, Position, GameState, Move } from '../types/chess';

export const initializeBoard = (): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Place pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black', position: { x: i, y: 1 } };
    board[6][i] = { type: 'pawn', color: 'white', position: { x: i, y: 6 } };
  }
  
  // Place other pieces
  const pieceOrder: ('rook' | 'knight' | 'bishop' | 'queen' | 'king' | 'bishop' | 'knight' | 'rook')[] = 
    ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieceOrder[i], color: 'black', position: { x: i, y: 0 } };
    board[7][i] = { type: pieceOrder[i], color: 'white', position: { x: i, y: 7 } };
  }
  
  return board;
};

export const isValidPosition = (pos: Position): boolean => {
  return pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
};

export const getValidMoves = (piece: Piece, board: (Piece | null)[][], gameState: GameState): Position[] => {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      
      // Forward moves
      if (isValidPosition({ x, y: y + direction }) && !board[y + direction][x]) {
        moves.push({ x, y: y + direction });
        
        // Double move from starting position
        if (y === startRow && !board[y + 2 * direction][x]) {
          moves.push({ x, y: y + 2 * direction });
        }
      }
      
      // Captures
      for (const dx of [-1, 1]) {
        const newPos = { x: x + dx, y: y + direction };
        if (isValidPosition(newPos) && board[newPos.y][newPos.x] && 
            board[newPos.y][newPos.x]!.color !== piece.color) {
          moves.push(newPos);
        }
      }
      break;
      
    case 'rook':
      // Horizontal and vertical moves
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { x: x + dx * i, y: y + dy * i };
          if (!isValidPosition(newPos)) break;
          
          const targetPiece = board[newPos.y][newPos.x];
          if (!targetPiece) {
            moves.push(newPos);
          } else {
            if (targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;
      
    case 'knight':
      const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [dx, dy] of knightMoves) {
        const newPos = { x: x + dx, y: y + dy };
        if (isValidPosition(newPos)) {
          const targetPiece = board[newPos.y][newPos.x];
          if (!targetPiece || targetPiece.color !== piece.color) {
            moves.push(newPos);
          }
        }
      }
      break;
      
    case 'bishop':
      // Diagonal moves
      for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { x: x + dx * i, y: y + dy * i };
          if (!isValidPosition(newPos)) break;
          
          const targetPiece = board[newPos.y][newPos.x];
          if (!targetPiece) {
            moves.push(newPos);
          } else {
            if (targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;
      
    case 'queen':
      // Combination of rook and bishop moves
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { x: x + dx * i, y: y + dy * i };
          if (!isValidPosition(newPos)) break;
          
          const targetPiece = board[newPos.y][newPos.x];
          if (!targetPiece) {
            moves.push(newPos);
          } else {
            if (targetPiece.color !== piece.color) {
              moves.push(newPos);
            }
            break;
          }
        }
      }
      break;
      
    case 'king':
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const newPos = { x: x + dx, y: y + dy };
        if (isValidPosition(newPos)) {
          const targetPiece = board[newPos.y][newPos.x];
          if (!targetPiece || targetPiece.color !== piece.color) {
            moves.push(newPos);
          }
        }
      }
      break;
  }
  
  return moves;
};

export const makeMove = (gameState: GameState, from: Position, to: Position): GameState | null => {
  const newBoard = gameState.board.map(row => [...row]);
  const piece = newBoard[from.y][from.x];
  
  if (!piece || piece.color !== gameState.currentPlayer) {
    return null;
  }
  
  const validMoves = getValidMoves(piece, newBoard, gameState);
  const isValidMove = validMoves.some(move => move.x === to.x && move.y === to.y);
  
  if (!isValidMove) {
    return null;
  }
  
  const capturedPiece = newBoard[to.y][to.x];
  
  // Move the piece
  newBoard[to.y][to.x] = { ...piece, position: to, hasMoved: true };
  newBoard[from.y][from.x] = null;
  
  // Create move notation
  const notation = `${piece.type}${String.fromCharCode(97 + to.x)}${8 - to.y}`;
  
  const move: Move = {
    from,
    to,
    piece,
    captured: capturedPiece || undefined,
    notation,
    timestamp: new Date()
  };
  
  return {
    ...gameState,
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white',
    moves: [...gameState.moves, move],
    selectedSquare: undefined,
    validMoves: []
  };
};

export const createInitialGameState = (): GameState => ({
  board: initializeBoard(),
  currentPlayer: 'white',
  moves: [],
  isGameOver: false,
  validMoves: []
});
