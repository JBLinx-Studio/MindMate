
import React from 'react';
import { Position, Piece } from '../types/chess';
import ChessPiece from './ChessPiece';

interface ChessSquareProps {
  position: Position;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  showCoordinates?: boolean;
  boardTheme?: string;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  isLastMove,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  showCoordinates = true,
  boardTheme = 'classic'
}) => {
  const { x, y } = position;
  
  const getThemeColors = (theme: string, isLight: boolean) => {
    const themes = {
      classic: {
        light: 'bg-gradient-to-br from-amber-50 via-amber-100 to-orange-100',
        dark: 'bg-gradient-to-br from-amber-700 via-amber-800 to-orange-800'
      },
      modern: {
        light: 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100',
        dark: 'bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800'
      },
      wood: {
        light: 'bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-300',
        dark: 'bg-gradient-to-br from-yellow-800 via-yellow-900 to-amber-900'
      },
      marble: {
        light: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300',
        dark: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
      },
      neon: {
        light: 'bg-gradient-to-br from-purple-200 via-pink-200 to-purple-300',
        dark: 'bg-gradient-to-br from-purple-700 via-purple-800 to-pink-800'
      },
      forest: {
        light: 'bg-gradient-to-br from-green-100 via-green-200 to-emerald-200',
        dark: 'bg-gradient-to-br from-green-700 via-green-800 to-emerald-800'
      }
    };
    
    return themes[theme as keyof typeof themes] || themes.classic;
  };

  const getSquareColor = () => {
    if (isSelected) return 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 shadow-2xl ring-4 ring-yellow-300/70';
    if (isLastMove) return 'bg-gradient-to-br from-yellow-300/90 via-yellow-400/80 to-orange-400/70 shadow-xl ring-3 ring-yellow-400/50';
    if (isValidMove) {
      return isLight 
        ? 'bg-gradient-to-br from-green-400/90 via-green-500/80 to-emerald-500/70 shadow-xl ring-3 ring-green-300/60' 
        : 'bg-gradient-to-br from-green-600/90 via-green-700/80 to-emerald-700/70 shadow-xl ring-3 ring-green-400/60';
    }
    
    const colors = getThemeColors(boardTheme, isLight);
    return isLight ? colors.light : colors.dark;
  };

  const getHoverEffects = () => {
    if (isSelected || isLastMove) return '';
    return 'hover:shadow-xl hover:scale-[1.03] hover:brightness-110 transition-all duration-300 ease-out';
  };

  const getSquareTextColor = () => {
    return isLight ? 'text-amber-800/90' : 'text-amber-100/95';
  };

  const getSquareBorder = () => {
    if (isSelected) return 'border-2 border-yellow-500/80';
    if (isLastMove) return 'border-2 border-yellow-400/60';
    if (isValidMove) return 'border-2 border-green-500/60';
    return 'border border-black/10';
  };

  return (
    <div
      className={`
        relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 
        flex items-center justify-center cursor-pointer
        transition-all duration-300 ease-out transform-gpu
        ${getSquareColor()}
        ${getHoverEffects()}
        ${getSquareBorder()}
        ${piece ? 'hover:shadow-2xl' : ''}
        ${isSelected ? 'scale-105 z-20' : ''}
        backdrop-blur-sm
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        boxShadow: isSelected 
          ? '0 20px 40px rgba(0,0,0,0.2), inset 0 4px 0 rgba(255,255,255,0.3), 0 0 0 4px rgba(255, 215, 0, 0.3)' 
          : isLastMove
          ? '0 12px 24px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.2), 0 0 0 2px rgba(255, 215, 0, 0.2)'
          : isValidMove
          ? '0 8px 16px rgba(0,0,0,0.1), inset 0 2px 0 rgba(255,255,255,0.15), 0 0 0 2px rgba(34, 197, 94, 0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.05)',
        background: isSelected || isLastMove || isValidMove ? undefined : `
          ${isLight ? 
            'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,245,245,0.8))' : 
            'linear-gradient(145deg, rgba(120,113,108,0.9), rgba(87,83,78,0.8))'
          }
        `
      }}
    >
      {/* Coordinate Labels with enhanced styling */}
      {showCoordinates && x === 0 && (
        <div className={`
          absolute -left-6 md:-left-8 text-xs md:text-sm font-bold 
          ${getSquareTextColor()} select-none z-30
          bg-white/20 backdrop-blur-sm rounded px-1 py-0.5
        `}>
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className={`
          absolute -bottom-6 md:-bottom-8 text-xs md:text-sm font-bold 
          ${getSquareTextColor()} select-none z-30
          bg-white/20 backdrop-blur-sm rounded px-1 py-0.5
        `}>
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Enhanced Valid Move Indicators */}
      {isValidMove && !piece && (
        <div className="relative">
          <div className="w-6 h-6 bg-green-600/90 rounded-full shadow-xl animate-pulse ring-3 ring-green-300/70" />
          <div className="absolute inset-0 w-6 h-6 bg-green-400/50 rounded-full animate-ping" />
        </div>
      )}
      
      {/* Enhanced Attack Indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-2 border-4 border-red-500/90 rounded-xl animate-pulse shadow-xl bg-red-100/40 backdrop-blur-sm">
          <div className="absolute inset-0 border-2 border-red-300/60 rounded-lg animate-ping" />
        </div>
      )}
      
      {/* Chess Piece with enhanced container */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center transition-all duration-300 hover:scale-110 relative z-10"
        >
          <ChessPiece 
            piece={piece} 
            isSelected={isSelected}
            isAnimating={isLastMove}
          />
        </div>
      )}
      
      {/* Enhanced Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-orange-400/30 to-red-400/20 rounded-xl animate-pulse backdrop-blur-sm" />
      )}
      
      {/* Square Texture and Shine */}
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white via-transparent to-transparent pointer-events-none rounded-sm" />
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-sm transition-opacity duration-300" />
    </div>
  );
};

export default ChessSquare;
