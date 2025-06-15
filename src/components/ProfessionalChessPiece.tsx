
import React from 'react';
import { Piece } from '../types/chess';

interface ProfessionalChessPieceProps {
  piece: Piece;
  isDragging?: boolean;
  isSelected?: boolean;
  isAnimating?: boolean;
}

const ProfessionalChessPiece: React.FC<ProfessionalChessPieceProps> = ({ 
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

  const getPremiumTextShadow = () => {
    if (piece.color === 'white') {
      return `
        2px 2px 4px rgba(0,0,0,0.8),
        0 0 6px rgba(0,0,0,0.4),
        0 0 12px rgba(139,134,128,0.3),
        inset 0 1px 2px rgba(255,255,255,0.3)
      `;
    } else {
      return `
        2px 2px 4px rgba(255,255,255,0.9),
        0 0 6px rgba(255,255,255,0.5),
        0 0 12px rgba(240,217,181,0.4),
        1px 1px 2px rgba(0,0,0,0.6)
      `;
    }
  };

  const getGradientFilter = () => {
    if (piece.color === 'white') {
      return `
        brightness(1.1) 
        contrast(1.2) 
        drop-shadow(0 2px 4px rgba(0,0,0,0.3))
        drop-shadow(0 0 8px rgba(255,255,255,0.3))
      `;
    } else {
      return `
        brightness(0.95) 
        contrast(1.3) 
        drop-shadow(0 2px 4px rgba(255,255,255,0.4))
        drop-shadow(0 0 8px rgba(0,0,0,0.2))
      `;
    }
  };

  return (
    <div 
      className={`
        text-6xl cursor-pointer select-none 
        flex items-center justify-center
        transition-all duration-300 ease-out
        relative z-10 font-bold
        ${isDragging ? 'opacity-90 scale-125 z-50 rotate-6' : ''}
        ${isSelected ? 'scale-110' : isAnimating ? 'scale-110' : 'hover:scale-110'}
        ${piece.color === 'white' 
          ? 'text-white' 
          : 'text-slate-900'
        }
        hover:brightness-110 active:scale-95
        transform-gpu
      `}
      style={{
        textShadow: getPremiumTextShadow(),
        filter: getGradientFilter(),
        transform: `
          ${isDragging ? 'rotate(6deg) scale(1.25)' : ''}
          ${isSelected || isAnimating ? 'scale(1.1)' : ''}
        `
      }}
    >
      {getPieceSymbol(piece)}
      
      {/* Premium selection glow effect */}
      {isSelected && (
        <>
          <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-20 animate-pulse blur-sm" />
          <div className="absolute inset-0 rounded-full bg-orange-300 opacity-15 animate-ping" />
        </>
      )}
      
      {/* Premium hover glow effect */}
      {isAnimating && !isSelected && (
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-15 animate-pulse blur-sm" />
      )}
      
      {/* Drag glow effect */}
      {isDragging && (
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-25 animate-spin blur-md" />
      )}
    </div>
  );
};

export default ProfessionalChessPiece;
