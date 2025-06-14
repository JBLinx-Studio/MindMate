
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
        text-4xl md:text-5xl cursor-pointer select-none 
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${isDragging ? 'opacity-90 scale-125 z-50 rotate-3' : ''}
        ${isSelected ? 'scale-115 animate-pulse' : 'hover:scale-110'}
        ${isAnimating ? 'animate-bounce' : ''}
        ${piece.color === 'white' 
          ? 'text-slate-50 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]' 
          : 'text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'
        }
        hover:brightness-110 active:scale-95
      `}
      style={{
        filter: piece.color === 'white' 
          ? 'drop-shadow(0 0 8px rgba(255,255,255,0.4)) drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
          : 'drop-shadow(0 0 8px rgba(0,0,0,0.4)) drop-shadow(0 4px 8px rgba(255,255,255,0.6))',
        textShadow: piece.color === 'white'
          ? '0 0 12px rgba(255,255,255,0.6), 2px 2px 8px rgba(0,0,0,0.8)'
          : '0 0 12px rgba(0,0,0,0.6), 2px 2px 8px rgba(255,255,255,0.8)'
      }}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default ChessPiece;
