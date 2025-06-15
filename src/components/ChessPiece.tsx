
import React from 'react';
import { Piece } from '../types/chess';

interface ChessPieceProps {
  piece: Piece;
  isDragging?: boolean;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, isDragging }) => {
  const getPieceSymbol = (piece: Piece): string => {
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return symbols[piece.color][piece.type];
  };

  return (
    <div 
      className={`
        text-4xl cursor-pointer select-none flex items-center justify-center
        transition-all duration-200 hover:scale-110
        ${isDragging ? 'opacity-50 scale-110' : ''}
      `}
      style={{ 
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
      }}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default ChessPiece;
