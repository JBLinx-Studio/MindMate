
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
        text-4xl md:text-5xl cursor-pointer select-none flex items-center justify-center
        transition-all duration-300 hover:scale-125 hover:brightness-110 active:scale-95
        ${isDragging ? 'opacity-70 scale-125 rotate-6 z-50' : ''}
        ${piece.color === 'white' ? 'drop-shadow-xl' : 'drop-shadow-lg'}
      `}
      style={{ 
        textShadow: piece.color === 'white' 
          ? '3px 3px 6px rgba(0,0,0,0.5), 0 0 12px rgba(255,255,255,0.9), 1px 1px 2px rgba(0,0,0,0.8)' 
          : '3px 3px 6px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4), 1px 1px 2px rgba(255,255,255,0.3)',
        filter: `drop-shadow(0 6px 12px rgba(0,0,0,0.4)) ${
          piece.color === 'white' ? 'brightness(1.15) contrast(1.1)' : 'brightness(0.95) contrast(1.05)'
        }`,
        transform: isDragging ? 'rotate(8deg) scale(1.2)' : 'none'
      }}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default ChessPiece;
