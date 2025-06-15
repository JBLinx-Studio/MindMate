
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

  const getPieceGlow = () => {
    if (piece.color === 'white') {
      return 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]';
    } else {
      return 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]';
    }
  };

  return (
    <div 
      className={`
        text-5xl cursor-pointer select-none 
        flex items-center justify-center
        transition-all duration-300 ease-out
        ${isDragging ? 'opacity-80 scale-125 z-50 rotate-12' : ''}
        ${isSelected ? 'scale-115 animate-pulse' : isAnimating ? 'scale-110' : 'hover:scale-110'}
        ${piece.color === 'white' 
          ? 'text-slate-50' 
          : 'text-slate-900'
        }
        hover:brightness-125 active:scale-95
        ${getPieceGlow()}
      `}
      style={{
        filter: `${getPieceGlow()} brightness(${isSelected || isAnimating ? '1.2' : '1'})`,
        textShadow: piece.color === 'white'
          ? '3px 3px 6px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.3)'
          : '3px 3px 6px rgba(255,255,255,0.9), 0 0 10px rgba(0,0,0,0.3)',
        transform: isDragging ? 'rotate(12deg)' : 'none'
      }}
    >
      {getPieceSymbol(piece)}
      
      {/* Magical sparkle effect when selected */}
      {isSelected && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.3s' }} />
        </>
      )}
    </div>
  );
};

export default ChessPiece;
