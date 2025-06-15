
import React from 'react';

interface LiveChessBoardProps {
  fen: string;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

export const ChessBoard: React.FC<LiveChessBoardProps> = ({ 
  fen, 
  size = 'medium', 
  interactive = false 
}) => {
  // Parse FEN to get board position
  const parseFEN = (fen: string) => {
    const parts = fen.split(' ');
    const boardPart = parts[0];
    const rows = boardPart.split('/');
    
    const board = [];
    for (let row of rows) {
      const boardRow = [];
      for (let char of row) {
        if (isNaN(parseInt(char))) {
          // It's a piece
          boardRow.push(char);
        } else {
          // It's a number indicating empty squares
          for (let i = 0; i < parseInt(char); i++) {
            boardRow.push(null);
          }
        }
      }
      board.push(boardRow);
    }
    return board;
  };

  const getPieceSymbol = (piece: string | null) => {
    if (!piece) return null;
    
    const symbols = {
      'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
      'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
    };
    
    return symbols[piece] || piece;
  };

  const board = parseFEN(fen);
  const sizeClasses = {
    small: 'w-6 h-6 text-sm',
    medium: 'w-8 h-8 text-base',
    large: 'w-12 h-12 text-lg'
  };

  return (
    <div className="grid grid-cols-8 gap-0 border border-[#8b8680] rounded overflow-hidden">
      {board.map((row, y) =>
        row.map((piece, x) => (
          <div
            key={`${x}-${y}`}
            className={`
              ${sizeClasses[size]}
              flex items-center justify-center
              ${(x + y) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}
              ${interactive ? 'hover:opacity-80 cursor-pointer' : ''}
            `}
          >
            <span className="select-none">
              {getPieceSymbol(piece)}
            </span>
          </div>
        ))
      )}
    </div>
  );
};
