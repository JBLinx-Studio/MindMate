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

export const isSquareAttacked = (board: (Piece | null)[][], position: Position, byColor: 'white' | 'black'): boolean => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece && piece.color === byColor) {
        const moves = getPieceAttacks(piece, board);
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
      // Pawn attacks (diagonal captures only)
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
      break;
  }
  
  return moves;
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
      
      // En passant - Enhanced implementation
      const lastMove = gameState.moves[gameState.moves.length - 1];
      if (lastMove && lastMove.piece.type === 'pawn' && 
          Math.abs(lastMove.from.y - lastMove.to.y) === 2 &&
          lastMove.to.y === y && Math.abs(lastMove.to.x - x) === 1) {
        const enPassantPos = { x: lastMove.to.x, y: y + direction };
        if (isValidPosition(enPassantPos)) {
          moves.push(enPassantPos);
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
      
      // Enhanced Castling Implementation
      if (!piece.hasMoved && !isInCheck(board, piece.color)) {
        // Kingside castling
        const kingsideRook = board[y][7];
        if (kingsideRook && kingsideRook.type === 'rook' && kingsideRook.color === piece.color && !kingsideRook.hasMoved &&
            !board[y][5] && !board[y][6] &&
            !isSquareAttacked(board, { x: 4, y }, piece.color === 'white' ? 'black' : 'white') &&
            !isSquareAttacked(board, { x: 5, y }, piece.color === 'white' ? 'black' : 'white') &&
            !isSquareAttacked(board, { x: 6, y }, piece.color === 'white' ? 'black' : 'white')) {
          moves.push({ x: 6, y });
        }
        
        // Queenside castling
        const queensideRook = board[y][0];
        if (queensideRook && queensideRook.type === 'rook' && queensideRook.color === piece.color && !queensideRook.hasMoved &&
            !board[y][1] && !board[y][2] && !board[y][3] &&
            !isSquareAttacked(board, { x: 4, y }, piece.color === 'white' ? 'black' : 'white') &&
            !isSquareAttacked(board, { x: 3, y }, piece.color === 'white' ? 'black' : 'white') &&
            !isSquareAttacked(board, { x: 2, y }, piece.color === 'white' ? 'black' : 'white')) {
          moves.push({ x: 2, y });
        }
      }
      break;
  }
  
  // Enhanced move validation - filter out moves that would leave the king in check
  return moves.filter(move => {
    const testBoard = board.map(row => [...row]);
    const originalPiece = testBoard[y][x];
    const capturedPiece = testBoard[move.y][move.x];
    
    // Make the move
    testBoard[move.y][move.x] = originalPiece;
    testBoard[y][x] = null;
    
    // Handle en passant capture
    if (piece.type === 'pawn' && !capturedPiece && x !== move.x) {
      testBoard[y][move.x] = null; // Remove captured pawn
    }
    
    // Check if this move leaves own king in check
    const isLegal = !isInCheck(testBoard, piece.color);
    
    return isLegal;
  });
};

// Enhanced checkmate detection with more thorough analysis
export const isCheckmate = (board: (Piece | null)[][], color: 'white' | 'black', gameState: GameState): boolean => {
  if (!isInCheck(board, color)) return false;
  
  // Check if any piece can make a legal move to escape check
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

// Enhanced stalemate detection
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

// Enhanced insufficient material detection
export const isInsufficientMaterial = (board: (Piece | null)[][]): boolean => {
  const pieces: { [key: string]: number } = {
    whiteKing: 0, blackKing: 0,
    whiteQueen: 0, blackQueen: 0,
    whiteRook: 0, blackRook: 0,
    whiteBishop: 0, blackBishop: 0,
    whiteKnight: 0, blackKnight: 0,
    whitePawn: 0, blackPawn: 0
  };
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece) {
        pieces[`${piece.color}${piece.type.charAt(0).toUpperCase()}${piece.type.slice(1)}`]++;
      }
    }
  }
  
  // King vs King
  if (pieces.whiteKing === 1 && pieces.blackKing === 1 && 
      Object.values(pieces).reduce((sum, count) => sum + count, 0) === 2) {
    return true;
  }
  
  // King and Bishop vs King
  if ((pieces.whiteKing === 1 && pieces.whiteBishop === 1 && pieces.blackKing === 1 && 
       Object.values(pieces).reduce((sum, count) => sum + count, 0) === 3) ||
      (pieces.blackKing === 1 && pieces.blackBishop === 1 && pieces.whiteKing === 1 && 
       Object.values(pieces).reduce((sum, count) => sum + count, 0) === 3)) {
    return true;
  }
  
  // King and Knight vs King
  if ((pieces.whiteKing === 1 && pieces.whiteKnight === 1 && pieces.blackKing === 1 && 
       Object.values(pieces).reduce((sum, count) => sum + count, 0) === 3) ||
      (pieces.blackKing === 1 && pieces.blackKnight === 1 && pieces.whiteKing === 1 && 
       Object.values(pieces).reduce((sum, count) => sum + count, 0) === 3)) {
    return true;
  }
  
  return false;
};

// Enhanced threefold repetition detection
export const isThreefoldRepetition = (gameState: GameState): boolean => {
  const positionCounts = new Map<string, number>();
  
  // Generate position key for current position
  const currentKey = generatePositionKey(gameState.board, gameState.currentPlayer);
  
  // Count positions from move history (simplified - in real implementation would track all positions)
  let repetitions = 1; // Current position counts as 1
  
  // This is a simplified check - a real implementation would need to track all positions
  // throughout the game, including castling rights and en passant possibilities
  if (gameState.moves.length >= 8) {
    // Check if we've seen similar positions before
    const recentMoves = gameState.moves.slice(-8);
    let potentialRepetitions = 0;
    
    for (let i = 0; i < recentMoves.length - 3; i += 4) {
      if (recentMoves[i].notation === recentMoves[i + 4]?.notation &&
          recentMoves[i + 1]?.notation === recentMoves[i + 5]?.notation) {
        potentialRepetitions++;
      }
    }
    
    if (potentialRepetitions >= 2) {
      return true;
    }
  }
  
  return false;
};

// Enhanced fifty-move rule detection
export const isFiftyMoveRule = (gameState: GameState): boolean => {
  if (gameState.moves.length < 100) return false; // Need at least 50 moves by each side
  
  let halfMoveClock = 0;
  
  // Count moves since last pawn move or capture
  for (let i = gameState.moves.length - 1; i >= 0; i--) {
    const move = gameState.moves[i];
    
    if (move.piece.type === 'pawn' || move.captured) {
      break; // Reset counter
    }
    
    halfMoveClock++;
    
    if (halfMoveClock >= 100) { // 50 moves by each side = 100 half-moves
      return true;
    }
  }
  
  return false;
};

const generatePositionKey = (board: (Piece | null)[][], currentPlayer: 'white' | 'black'): string => {
  let key = '';
  
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (piece) {
        key += `${piece.color[0]}${piece.type[0]}`;
      } else {
        key += '--';
      }
    }
  }
  
  key += currentPlayer[0];
  return key;
};

// Enhanced move execution with proper notation generation
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
    // For now, auto-promote to queen (in real game, player would choose)
    newBoard[to.y][to.x] = { ...movedPiece, type: 'queen' };
  }
  
  // Generate enhanced algebraic notation
  const notation = generateAlgebraicNotation(piece, from, to, capturedPiece, specialMove, newBoard, gameState);
  
  const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
  
  // Check for check/checkmate after the move
  let finalNotation = notation;
  if (isInCheck(newBoard, nextPlayer)) {
    if (isCheckmate(newBoard, nextPlayer, gameState)) {
      finalNotation += '#';
    } else {
      finalNotation += '+';
    }
  }
  
  const move: Move = {
    from,
    to,
    piece,
    captured: capturedPiece || undefined,
    notation: finalNotation,
    timestamp: new Date(),
    specialMove
  };
  
  // Determine game ending conditions
  const isGameOver = 
    isCheckmate(newBoard, nextPlayer, gameState) || 
    isStalemate(newBoard, nextPlayer, gameState) ||
    isInsufficientMaterial(newBoard) ||
    isThreefoldRepetition({ ...gameState, moves: [...gameState.moves, move] }) ||
    isFiftyMoveRule({ ...gameState, moves: [...gameState.moves, move] });
  
  let winner: 'white' | 'black' | 'draw' | undefined = undefined;
  let gameResult: { type: 'checkmate' | 'stalemate' | 'draw' | 'resignation' | 'timeout'; winner?: 'white' | 'black'; reason?: string } | undefined = undefined;
  
  if (isGameOver) {
    if (isCheckmate(newBoard, nextPlayer, gameState)) {
      winner = gameState.currentPlayer;
      gameResult = { type: 'checkmate', winner: gameState.currentPlayer, reason: 'Checkmate' };
    } else if (isStalemate(newBoard, nextPlayer, gameState)) {
      winner = 'draw';
      gameResult = { type: 'stalemate', reason: 'Stalemate' };
    } else if (isInsufficientMaterial(newBoard)) {
      winner = 'draw';
      gameResult = { type: 'draw', reason: 'Insufficient material' };
    } else if (isThreefoldRepetition({ ...gameState, moves: [...gameState.moves, move] })) {
      winner = 'draw';
      gameResult = { type: 'draw', reason: 'Threefold repetition' };
    } else if (isFiftyMoveRule({ ...gameState, moves: [...gameState.moves, move] })) {
      winner = 'draw';
      gameResult = { type: 'draw', reason: '50-move rule' };
    }
  }
  
  const newGameState: GameState = {
    ...gameState,
    board: newBoard,
    currentPlayer: nextPlayer,
    moves: [...gameState.moves, move],
    selectedSquare: undefined,
    validMoves: [],
    isGameOver,
    winner,
    gameResult,
    fullMoveNumber: gameState.currentPlayer === 'black' ? gameState.fullMoveNumber + 1 : gameState.fullMoveNumber
  };
  
  return newGameState;
};

// Enhanced algebraic notation generation
const generateAlgebraicNotation = (
  piece: Piece, 
  from: Position, 
  to: Position, 
  captured: Piece | null, 
  specialMove: string | undefined,
  board: (Piece | null)[][],
  gameState: GameState
): string => {
  if (specialMove === 'castle') {
    return to.x > from.x ? 'O-O' : 'O-O-O';
  }
  
  let notation = '';
  
  // Piece symbol (empty for pawn)
  if (piece.type !== 'pawn') {
    notation += piece.type.charAt(0).toUpperCase();
  }
  
  // Disambiguation for pieces that could move to the same square
  if (piece.type !== 'pawn' && piece.type !== 'king') {
    const sameTypePieces = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const otherPiece = gameState.board[y][x];
        if (otherPiece && otherPiece.type === piece.type && 
            otherPiece.color === piece.color && 
            (x !== from.x || y !== from.y)) {
          const otherValidMoves = getValidMoves(otherPiece, gameState.board, gameState);
          if (otherValidMoves.some(move => move.x === to.x && move.y === to.y)) {
            sameTypePieces.push({ x, y });
          }
        }
      }
    }
    
    if (sameTypePieces.length > 0) {
      // Check if file disambiguation is sufficient
      const sameFile = sameTypePieces.some(pos => pos.x === from.x);
      const sameRank = sameTypePieces.some(pos => pos.y === from.y);
      
      if (!sameFile) {
        notation += String.fromCharCode(97 + from.x); // File letter
      } else if (!sameRank) {
        notation += (8 - from.y).toString(); // Rank number
      } else {
        // Need both file and rank
        notation += String.fromCharCode(97 + from.x) + (8 - from.y).toString();
      }
    }
  }
  
  // Pawn captures require the file of departure
  if (piece.type === 'pawn' && captured) {
    notation += String.fromCharCode(97 + from.x);
  }
  
  // Capture indicator
  if (captured || specialMove === 'enPassant') {
    notation += 'x';
  }
  
  // Destination square
  notation += String.fromCharCode(97 + to.x) + (8 - to.y).toString();
  
  // Promotion
  if (specialMove === 'promotion') {
    notation += '=Q'; // Assuming queen promotion
  }
  
  // En passant indicator
  if (specialMove === 'enPassant') {
    notation += ' e.p.';
  }
  
  return notation;
};

export const createInitialGameState = (): GameState => ({
  board: initializeBoard(),
  currentPlayer: 'white',
  moves: [],
  isGameOver: false,
  validMoves: [],
  fullMoveNumber: 1
});
