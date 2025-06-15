
import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  
  const getThemeColors = () => {
    switch (boardTheme) {
      case 'modern':
        return {
          light: 'bg-blue-100 hover:bg-blue-200',
          dark: 'bg-blue-600 hover:bg-blue-700'
        };
      case 'wood':
        return {
          light: 'bg-yellow-200 hover:bg-yellow-300',
          dark: 'bg-yellow-800 hover:bg-yellow-900'
        };
      case 'marble':
        return {
          light: 'bg-gray-100 hover:bg-gray-200',
          dark: 'bg-gray-600 hover:bg-gray-700'
        };
      case 'neon':
        return {
          light: 'bg-purple-200 hover:bg-purple-300',
          dark: 'bg-purple-700 hover:bg-purple-800'
        };
      case 'forest':
        return {
          light: 'bg-green-100 hover:bg-green-200',
          dark: 'bg-green-700 hover:bg-green-800'
        };
      default: // classic
        return {
          light: 'bg-amber-50 hover:bg-amber-100',
          dark: 'bg-amber-700 hover:bg-amber-800'
        };
    }
  };
  
  const getSquareColor = () => {
    const themeColors = getThemeColors();
    const baseColor = isLight ? themeColors.light : themeColors.dark;
    
    if (isSelected) {
      return 'bg-yellow-400 ring-4 ring-yellow-500/60 shadow-lg transform scale-105';
    }
    if (isLastMove) {
      return `${baseColor} ring-4 ring-blue-400/80 shadow-md`;
    }
    if (isValidMove) {
      return `${baseColor} ring-3 ring-green-400/70 shadow-md`;
    }
    
    return baseColor;
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={`
        aspect-square w-full h-full
        flex items-center justify-center cursor-pointer
        transition-all duration-300 ease-out
        ${getSquareColor()}
        ${isHovered ? 'brightness-110 shadow-lg' : ''}
        relative overflow-hidden
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Coordinate Labels */}
      {showCoordinates && x === 0 && (
        <div className="absolute -left-5 text-sm font-bold text-amber-900 select-none z-10">
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className="absolute -bottom-5 text-sm font-bold text-amber-900 select-none z-10">
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Animated Background Effects */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/30 to-yellow-500/30 animate-pulse" />
      )}
      
      {isLastMove && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-blue-500/20" />
      )}
      
      {/* Valid Move Indicators */}
      {isValidMove && !piece && (
        <div className="w-6 h-6 bg-green-500 rounded-full opacity-80 shadow-lg animate-pulse border-2 border-green-300" />
      )}
      
      {/* Attack Indicator */}
      {isValidMove && piece && (
        <>
          <div className="absolute inset-1 border-3 border-red-500 rounded-lg opacity-90 animate-pulse">
            <div className="absolute inset-0 bg-red-500/20 rounded-lg" />
          </div>
          <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce" />
        </>
      )}
      
      {/* Chess Piece with Animation */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className={`
            w-full h-full flex items-center justify-center relative z-20
            transition-transform duration-200 ease-out
            ${isSelected ? 'scale-110' : isHovered ? 'scale-105' : ''}
          `}
        >
          <ChessPiece 
            piece={piece} 
            isSelected={isSelected}
            isAnimating={isHovered}
          />
        </div>
      )}
      
      {/* Subtle shine effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

export default ChessSquare;
