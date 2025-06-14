
import React, { useState, useEffect } from 'react';
import { Piece } from '../types/chess';

interface EnhancedChessPieceProps {
  piece: Piece;
  isDragging?: boolean;
  isSelected?: boolean;
  isAnimating?: boolean;
  isValidTarget?: boolean;
  isLastMoved?: boolean;
  onClick?: () => void;
}

const EnhancedChessPiece: React.FC<EnhancedChessPieceProps> = ({ 
  piece, 
  isDragging = false, 
  isSelected = false,
  isAnimating = false,
  isValidTarget = false,
  isLastMoved = false,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [justMoved, setJustMoved] = useState(false);

  useEffect(() => {
    if (isLastMoved) {
      setJustMoved(true);
      const timer = setTimeout(() => setJustMoved(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isLastMoved]);

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
    if (isSelected) {
      return 'drop-shadow-[0_4px_12px_rgba(255,215,0,0.8)]';
    }
    if (piece.color === 'white') {
      return 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]';
    } else {
      return 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]';
    }
  };

  const getAnimationClasses = () => {
    const classes = [];
    
    if (isDragging) {
      classes.push('scale-125', 'rotate-12', 'z-50', 'opacity-90');
    }
    
    if (isSelected) {
      classes.push('scale-115', 'animate-pulse');
    } else if (isAnimating || isHovered) {
      classes.push('scale-110');
    }
    
    if (justMoved) {
      classes.push('animate-bounce');
    }
    
    if (isValidTarget) {
      classes.push('animate-ping');
    }
    
    return classes.join(' ');
  };

  return (
    <div 
      className={`
        text-5xl cursor-pointer select-none 
        flex items-center justify-center relative
        transition-all duration-300 ease-out
        ${getAnimationClasses()}
        ${piece.color === 'white' 
          ? 'text-slate-50' 
          : 'text-slate-900'
        }
        hover:brightness-125 active:scale-95
        ${getPieceGlow()}
      `}
      style={{
        filter: `${getPieceGlow()} brightness(${isSelected || isAnimating ? '1.3' : '1'})`,
        textShadow: piece.color === 'white'
          ? '3px 3px 6px rgba(0,0,0,0.9), 0 0 15px rgba(255,255,255,0.4)'
          : '3px 3px 6px rgba(255,255,255,0.9), 0 0 15px rgba(0,0,0,0.4)',
        transform: isDragging ? 'rotate(12deg) scale(1.25)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {getPieceSymbol(piece)}
      
      {/* Enhanced visual effects */}
      {isSelected && (
        <>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60" 
               style={{ animationDelay: '0.3s' }} />
          <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-200 rounded-full animate-ping opacity-40" 
               style={{ animationDelay: '0.6s' }} />
        </>
      )}
      
      {/* Move indicator for last moved piece */}
      {isLastMoved && (
        <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse opacity-70" />
      )}
      
      {/* Capture target indicator */}
      {isValidTarget && (
        <div className="absolute inset-0 rounded-full bg-red-500/20 border-2 border-red-500 animate-pulse" />
      )}
      
      {/* Hover glow effect */}
      {isHovered && !isDragging && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent animate-pulse" />
      )}
    </div>
  );
};

export default EnhancedChessPiece;
