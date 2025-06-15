
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

  const getPieceTextShadow = () => {
    if (piece.color === 'white') {
      return '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.4)';
    } else {
      return '1px 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.4)';
    }
  };

  return (
    <div 
      className={`
        text-6xl cursor-pointer select-none 
        flex items-center justify-center
        transition-all duration-200 ease-out
        relative z-10
        ${isDragging ? 'opacity-90 scale-110 z-50' : ''}
        ${isSelected ? 'scale-105' : isAnimating ? 'scale-105' : 'hover:scale-105'}
        ${piece.color === 'white' 
          ? 'text-white' 
          : 'text-slate-900'
        }
        hover:brightness-110 active:scale-95
      `}
      style={{
        textShadow: getPieceTextShadow(),
        filter: `brightness(${isSelected || isAnimating ? '1.1' : '1'}) contrast(1.1)`,
        transform: isDragging ? 'rotate(3deg)' : 'none'
      }}
    >
      {getPieceSymbol(piece)}
      
      {/* Selection glow effect */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse" />
      )}
    </div>
  );
};

export default ChessPiece;
