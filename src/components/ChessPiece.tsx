
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

  const getPieceGradient = (color: 'white' | 'black') => {
    return color === 'white' 
      ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%)'
      : 'linear-gradient(145deg, #495057 0%, #343a40 50%, #212529 100%)';
  };

  const getPieceShadow = (color: 'white' | 'black') => {
    return color === 'white'
      ? `
        drop-shadow(0 8px 16px rgba(0,0,0,0.3))
        drop-shadow(0 4px 8px rgba(0,0,0,0.2))
        drop-shadow(0 2px 4px rgba(0,0,0,0.1))
      `
      : `
        drop-shadow(0 8px 16px rgba(0,0,0,0.5))
        drop-shadow(0 4px 8px rgba(0,0,0,0.3))
        drop-shadow(0 2px 4px rgba(255,255,255,0.1))
      `;
  };

  return (
    <div 
      className={`
        text-4xl md:text-5xl lg:text-6xl cursor-pointer select-none 
        flex items-center justify-center relative
        transition-all duration-300 ease-out transform-gpu
        ${isDragging ? 'opacity-80 scale-125 rotate-12 z-50' : ''}
        ${isSelected ? 'scale-110 animate-pulse' : 'hover:scale-110'}
        ${isAnimating ? 'animate-bounce' : ''}
        ${!isDragging && !isSelected ? 'hover:brightness-110 active:scale-95' : ''}
      `}
      style={{ 
        background: getPieceGradient(piece.color),
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: getPieceShadow(piece.color),
        textShadow: piece.color === 'white' 
          ? `
            0 0 20px rgba(255,255,255,0.8),
            0 0 40px rgba(255,255,255,0.6),
            3px 3px 6px rgba(0,0,0,0.4),
            1px 1px 2px rgba(0,0,0,0.8)
          ` 
          : `
            0 0 20px rgba(100,100,100,0.6),
            0 0 40px rgba(50,50,50,0.4),
            3px 3px 8px rgba(0,0,0,0.8),
            1px 1px 3px rgba(255,255,255,0.2)
          `,
        transform: isDragging ? 'rotate(12deg) scale(1.25)' : 
                   isSelected ? 'scale(1.1)' : 'none'
      }}
    >
      {/* Glow effect for selected pieces */}
      {isSelected && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-75"
          style={{
            background: `radial-gradient(circle, ${
              piece.color === 'white' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(239, 68, 68, 0.5)'
            } 0%, transparent 70%)`,
            filter: 'blur(8px)'
          }}
        />
      )}
      
      {/* Piece symbol */}
      <span className="relative z-10">
        {getPieceSymbol(piece)}
      </span>
      
      {/* Sparkle effect for special pieces */}
      {(piece.type === 'king' || piece.type === 'queen') && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60" />
          <div className="absolute bottom-0 left-0 w-1 h-1 bg-yellow-300 rounded-full animate-ping delay-1000 opacity-40" />
        </div>
      )}
    </div>
  );
};

export default ChessPiece;
