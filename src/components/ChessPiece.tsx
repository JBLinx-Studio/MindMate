
import React from 'react';
import { Piece } from '../types/chess';

interface ChessPieceProps {
  piece: Piece;
  isDragging?: boolean;
  isSelected?: boolean;
  isAnimating?: boolean;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ 
  piece, 
  isDragging = false, 
  isSelected = false,
  isAnimating = false 
}) => {
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
        text-3xl sm:text-4xl cursor-pointer select-none 
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${isDragging ? 'opacity-80 scale-110 z-50' : ''}
        ${isSelected ? 'scale-110' : 'hover:scale-105'}
        ${isAnimating ? 'animate-pulse' : ''}
        ${piece.color === 'white' ? 'text-gray-100' : 'text-gray-900'}
      `}
      style={{
        textShadow: piece.color === 'white' 
          ? '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)'
          : '2px 2px 4px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.5)'
      }}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default ChessPiece;
