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

export const findKing = (board: (Piece | null)[][], color: 'white' | 'black'): Position | null => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { x, y };
      }
    }
  }
  return null;
};

export const isSquareAttacked = (
  board: (Piece | null)[][],
  position: Position,
  byColor: 'white' | 'black'
): boolean => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === byColor) {
        // When generating attacks, we don't care about king legality, just pseudo-legal moves.
        // Pass true to skip the king check recursion!
        const moves = getValidMoves(piece, board, undefined, true);
        if (moves.some(move => move.x === position.x && move.y === position.y)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isInCheck = (board: (Piece | null)[][], color: 'white' | 'black'): boolean => {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opponentColor = color === 'white' ? 'black' : 'white';
  return isSquareAttacked(board, kingPos, opponentColor);
};

const getPieceAttacks = (piece: Piece, board: (Piece | null)[][]): Position[] => {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  
  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      for (const dx of [-1, 1]) {
        const newPos = { x: x + dx, y: y + direction };
        if (isValidPosition(newPos)) {
          moves.push(newPos);
        }
      }
      break;
      
    case 'rook':
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { x: x + dx * i, y: y + dy * i };
          if (!isValidPosition(newPos)) break;
          
          moves.push(newPos);
          if (board[newPos.y][newPos.x]) break;
        }
      }
      break;
      
    case 'knight':
      const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [dx, dy] of knightMoves) {
        const newPos = { x: x + dx, y: y + dy };
        if (isValidPosition(newPos)) {
          moves.push(newPos);
        }
      }
      break;
      
    case 'bishop':
      for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { x: x + dx * i, y: y + dy * i };
          if (!isValidPosition(newPos)) break;
          
          moves.push(newPos);
          if (board[newPos.y][newPos.x]) break;
        }
      }
      break;
      
    case 'queen':
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        for (let i = 1; i < 8; i++) {
          const newPos = { x: x + dx * i, y: y + dy * i };
          if (!isValidPosition(newPos)) break;
          
          moves.push(newPos);
          if (board[newPos.y][newPos.x]) break;
        }
      }
      break;
      
    case 'king':
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const newPos = { x: x + dx, y: y + dy };
        if (isValidPosition(newPos)) {
          moves.push(newPos);
        }
      }
      // Note: No castling moves for pure attack map!
      break;
  }
  
  return moves;
};

export const getValidMoves = (
  piece: Piece,
  board: (Piece | null)[][],
  gameState?: GameState,
  skipKingSafetyCheck: boolean = false
): Position[] => {
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
      
      // En passant
      if (gameState) {
        const lastMove = gameState.moves[gameState.moves.length - 1];
        if (
          lastMove &&
          lastMove.piece.type === 'pawn' &&
          Math.abs(lastMove.from.y - lastMove.to.y) === 2 &&
          lastMove.to.y === y && Math.abs(lastMove.to.x - x) === 1
        ) {
          moves.push({ x: lastMove.to.x, y: y + direction });
        }
      }
      break;
      
    case 'rook':
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
      
      // Only offer castling when not skipping king safety checks
      if (!skipKingSafetyCheck && gameState && !piece.hasMoved && !isInCheck(board, piece.color)) {
        // Kingside castling
        const kingsideRook = board[y][7];
        if (
          kingsideRook &&
          kingsideRook.type === 'rook' &&
          !kingsideRook.hasMoved &&
          !board[y][5] &&
          !board[y][6] &&
          !isSquareAttacked(board, { x: 5, y }, piece.color === 'white' ? 'black' : 'white') &&
          !isSquareAttacked(board, { x: 6, y }, piece.color === 'white' ? 'black' : 'white')
        ) {
          moves.push({ x: 6, y });
        }
        // Queenside castling
        const queensideRook = board[y][0];
        if (
          queensideRook &&
          queensideRook.type === 'rook' &&
          !queensideRook.hasMoved &&
          !board[y][1] &&
          !board[y][2] &&
          !board[y][3] &&
          !isSquareAttacked(board, { x: 2, y }, piece.color === 'white' ? 'black' : 'white') &&
          !isSquareAttacked(board, { x: 3, y }, piece.color === 'white' ? 'black' : 'white')
        ) {
          moves.push({ x: 2, y });
        }
      }
      break;
  }
  
  // Filter moves that would leave the king in check -- ONLY for regular move gen, not for attack map
  if (!skipKingSafetyCheck) {
    return moves.filter(move => {
      // Defensive: If no gameState, can't check king safety so return all
      if (!gameState) return true;
      const testBoard = board.map(row => [...row]);
      testBoard[move.y][move.x] = testBoard[y][x];
      testBoard[y][x] = null;
      return !isInCheck(testBoard, piece.color);
    });
  } else {
    // For attack/attack mapping, just return the pseudo-legal moves
    return moves;
  }
};

export const isCheckmate = (board: (Piece | null)[][], color: 'white' | 'black', gameState: GameState): boolean => {
  if (!isInCheck(board, color)) return false;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(piece, board, gameState, false);
        if (validMoves.length > 0) {
          return false;
        }
      }
    }
  }
  return true;
};

export const isStalemate = (board: (Piece | null)[][], color: 'white' | 'black', gameState: GameState): boolean => {
  if (isInCheck(board, color)) return false;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(piece, board, gameState, false);
        if (validMoves.length > 0) {
          return false;
        }
      }
    }
  }
  return true;
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
  let specialMove: 'castle' | 'enPassant' | 'promotion' | undefined = undefined;
  
  // Handle special moves
  if (piece.type === 'king' && Math.abs(to.x - from.x) === 2) {
    // Castling
    specialMove = 'castle';
    const isKingside = to.x > from.x;
    const rookFromX = isKingside ? 7 : 0;
    const rookToX = isKingside ? 5 : 3;
    
    // Move rook
    const rook = newBoard[from.y][rookFromX];
    if (rook) {
      newBoard[from.y][rookToX] = { ...rook, position: { x: rookToX, y: from.y }, hasMoved: true };
      newBoard[from.y][rookFromX] = null;
    }
  }
  
  if (piece.type === 'pawn' && !capturedPiece && from.x !== to.x) {
    // En passant
    specialMove = 'enPassant';
    newBoard[from.y][to.x] = null; // Remove captured pawn
  }
  
  // Move the piece
  const movedPiece = { ...piece, position: to, hasMoved: true };
  newBoard[to.y][to.x] = movedPiece;
  newBoard[from.y][from.x] = null;
  
  // Handle pawn promotion
  if (piece.type === 'pawn' && (to.y === 0 || to.y === 7)) {
    specialMove = 'promotion';
    newBoard[to.y][to.x] = { ...movedPiece, type: 'queen' }; // Auto-promote to queen
  }
  
  // Create move notation
  let notation = '';
  if (specialMove === 'castle') {
    notation = to.x > from.x ? 'O-O' : 'O-O-O';
  } else {
    const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
    const capture = capturedPiece || specialMove === 'enPassant' ? 'x' : '';
    const square = String.fromCharCode(97 + to.x) + (8 - to.y);
    notation = `${pieceSymbol}${capture}${square}`;
  }
  
  const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  
  // Check for check/checkmate
  if (isInCheck(newBoard, nextPlayer)) {
    if (isCheckmate(newBoard, nextPlayer, gameState)) {
      notation += '#';
    } else {
      notation += '+';
    }
  }
  
  const move: Move = {
    from,
    to,
    piece,
    captured: capturedPiece || undefined,
    notation,
    timestamp: new Date(),
    specialMove
  };
  
  const newGameState: GameState = {
    ...gameState,
    board: newBoard,
    currentPlayer: nextPlayer,
    moves: [...gameState.moves, move],
    selectedSquare: undefined,
    validMoves: [],
    isGameOver: isCheckmate(newBoard, nextPlayer, gameState) || isStalemate(newBoard, nextPlayer, gameState),
    winner: isCheckmate(newBoard, nextPlayer, gameState) ? gameState.currentPlayer : 
           isStalemate(newBoard, nextPlayer, gameState) ? 'draw' : undefined
  };
  
  // Set game result for better UX
  if (newGameState.isGameOver) {
    newGameState.gameResult = {
      type: isCheckmate(newBoard, nextPlayer, gameState) ? 'checkmate' : 'stalemate',
      winner: newGameState.winner !== 'draw' ? newGameState.winner : undefined,
      reason: isCheckmate(newBoard, nextPlayer, gameState) ? 'Checkmate' : 'Stalemate'
    };
  }
  
  return newGameState;
};

export const createInitialGameState = (): GameState => ({
  board: initializeBoard(),
  currentPlayer: 'white',
  moves: [],
  isGameOver: false,
  validMoves: []
});
