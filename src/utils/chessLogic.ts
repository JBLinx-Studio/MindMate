import { Piece, Position, GameState, Move } from '../types/chess';

/**
 * Deep clone for an entire chess board, ensuring every piece object and its `position`
 * is a new object so there's no unwanted object mutation reference.
 * Only the known, "safe" piece fields are cloned to avoid recursive structures!
 */
function deepCopyBoard(board: (Piece | null)[][]): (Piece | null)[][] {
  // Add log for debugging recursion issue
  // console.log('deepCopyBoard called');
  return board.map(row =>
    row.map(piece =>
      piece
        ? {
            type: piece.type,
            color: piece.color,
            position: { ...piece.position },
            hasMoved: piece.hasMoved
          }
        : null
    )
  );
}

// DEBUG WRAPPERS
function debug_wrap<T extends (...args: any) => any>(fn: T, name: string): T {
  // We'll use a log depth to prevent flooding
  let depth = 0;
  function wrapped(...args: any) {
    depth++;
    if (depth < 30) {
      // Commented out for quietness, but can be re-enabled for debugging:
      // console.log(`CALL ${name} depth=${depth}`);
    } else if (depth === 30) {
      console.warn(`INFINITE RECURSION LIKELY in ${name}`);
    }
    const result = fn(...args);
    depth--;
    return result;
  }
  return wrapped as T;
}

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

export const isValidPosition = (pos: Position): boolean => pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;

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
  // To avoid recursion, use getValidMoves with skipCheckTest=true.
  // For pawns, only check attack squares (see pawn logic below)

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === byColor) {
        if (piece.type === 'pawn') {
          // Pawns only attack diagonally forward, never vertically
          const direction = byColor === 'white' ? -1 : 1;
          for (const dx of [-1, 1]) {
            const attackX = x + dx;
            const attackY = y + direction;
            if (
              isValidPosition({ x: attackX, y: attackY }) &&
              attackX === position.x &&
              attackY === position.y
            ) {
              return true;
            }
          }
        } else {
          // For all other pieces, use getValidMoves in attack-map mode (skipCheckTest=true)
          // Pass a minimal dummy gameState to satisfy signature (move validation not needed for attacks)
          const dummyGameState = {
            board,
            currentPlayer: byColor,
            moves: [],
            isGameOver: false,
            validMoves: [],
          };
          const moves = getValidMoves(
            piece,
            board,
            dummyGameState,
            true // skipCheckTest!
          );
          if (moves.some((move) => move.x === position.x && move.y === position.y)) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

export const isInCheck = (board: (Piece | null)[][], color: 'white' | 'black'): boolean => {
  // console.log("isInCheck", color); // DEBUG
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  
  const opponentColor = color === 'white' ? 'black' : 'white';
  return isSquareAttacked(board, kingPos, opponentColor);
};

const getPieceAttacks = (
  piece: Piece,
  board: (Piece | null)[][]
): Position[] => {
  const moves: Position[] = [];
  const { x, y } = piece.position;

  switch (piece.type) {
    case 'pawn': {
      const direction = piece.color === 'white' ? -1 : 1;
      // Pawn captures only, for attack map
      for (const dx of [-1, 1]) {
        const newPos = { x: x + dx, y: y + direction };
        if (isValidPosition(newPos)) {
          moves.push(newPos);
        }
      }
      break;
    }
    default:
      // ... same as your current code for attack patterns ...
      // (no "check" legality handled here)
      switch (piece.type) {
        case 'rook':
          // ... existing rook logic ...
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
          break;
      }
      break;
  }

  return moves;
};

export const getValidMoves = (
  piece: Piece,
  board: (Piece | null)[][],
  gameState: GameState,
  skipCheckTest: boolean = false // <- added param
): Position[] => {
  const moves: Position[] = [];
  const { x, y } = piece.position;

  switch (piece.type) {
    case 'pawn':
      const direction = piece.color === 'white' ? -1 : 1;
      const startRow = piece.color === 'white' ? 6 : 1;
      if (isValidPosition({ x, y: y + direction }) && !board[y + direction][x]) {
        moves.push({ x, y: y + direction });
        if (y === startRow && !board[y + 2 * direction][x]) {
          moves.push({ x, y: y + 2 * direction });
        }
      }
      for (const dx of [-1, 1]) {
        const newPos = { x: x + dx, y: y + direction };
        if (isValidPosition(newPos) && board[newPos.y][newPos.x] &&
            board[newPos.y][newPos.x]!.color !== piece.color) {
          moves.push(newPos);
        }
      }
      // En passant logic
      const lastMove = gameState.moves[gameState.moves.length - 1];
      if (lastMove && lastMove.piece.type === 'pawn' &&
          Math.abs(lastMove.from.y - lastMove.to.y) === 2 &&
          lastMove.to.y === y && Math.abs(lastMove.to.x - x) === 1) {
        moves.push({ x: lastMove.to.x, y: y + direction });
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
      // Castling logic
      if (!piece.hasMoved && !isInCheck(board, piece.color)) {
        const kingsideRook = board[y][7];
        if (kingsideRook && kingsideRook.type === 'rook' && !kingsideRook.hasMoved &&
            !board[y][5] && !board[y][6] &&
            !isSquareAttacked(board, { x: 5, y }, piece.color === 'white' ? 'black' : 'white') &&
            !isSquareAttacked(board, { x: 6, y }, piece.color === 'white' ? 'black' : 'white')) {
          moves.push({ x: 6, y });
        }
        const queensideRook = board[y][0];
        if (queensideRook && queensideRook.type === 'rook' && !queensideRook.hasMoved &&
            !board[y][1] && !board[y][2] && !board[y][3] &&
            !isSquareAttacked(board, { x: 2, y }, piece.color === 'white' ? 'black' : 'white') &&
            !isSquareAttacked(board, { x: 3, y }, piece.color === 'white' ? 'black' : 'white')) {
          moves.push({ x: 2, y });
        }
      }
      break;
  }

  // DANGER ZONE: filter causes recursion
  // To prevent infinite recursion:
  // Only call isInCheck if skipCheckTest is false (i.e., not for attack map generation)
  if (skipCheckTest) return moves;
  return moves.filter(move => {
    const testBoard = deepCopyBoard(board);
    const testPiece = testBoard[y][x];
    if (!testPiece) return false;

    testBoard[move.y][move.x] = { ...testPiece, position: { x: move.x, y: move.y } };
    testBoard[y][x] = null;

    return !isInCheck(testBoard, piece.color);
  });
};

export const isCheckmate = (board: (Piece | null)[][], color: 'white' | 'black', gameState: GameState): boolean => {
  if (!isInCheck(board, color)) return false;
  
  // Check if any piece can make a legal move
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(piece, board, gameState);
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
  
  // Check if any piece can make a legal move
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === color) {
        const validMoves = getValidMoves(piece, board, gameState);
        if (validMoves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

export const makeMove = (gameState: GameState, from: Position, to: Position): GameState | null => {
  // Use deep copy for the board to avoid mutating references
  const newBoard = deepCopyBoard(gameState.board);
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
