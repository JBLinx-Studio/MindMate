
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
  
  const getSquareColor = () => {
    if (isSelected) {
      return 'bg-gradient-to-br from-yellow-300 to-yellow-400 ring-4 ring-yellow-500/60 shadow-lg';
    }
    if (isLastMove) {
      return 'bg-gradient-to-br from-blue-200 to-blue-300 ring-2 ring-blue-400/60';
    }
    if (isValidMove) {
      return isLight 
        ? 'bg-gradient-to-br from-emerald-200 to-emerald-300 ring-2 ring-emerald-400/60' 
        : 'bg-gradient-to-br from-emerald-400 to-emerald-500 ring-2 ring-emerald-600/60';
    }
    
    return isLight 
      ? 'bg-gradient-to-br from-amber-50 to-amber-100' 
      : 'bg-gradient-to-br from-amber-600 to-amber-700';
  };

  return (
    <div
      className={`
        aspect-square w-full h-full
        flex items-center justify-center cursor-pointer
        transition-all duration-300 ease-out
        ${getSquareColor()}
        hover:brightness-110 hover:scale-[1.02]
        relative overflow-hidden
        ${isSelected ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 shadow-inner opacity-20" />
      
      {/* Coordinate Labels */}
      {showCoordinates && x === 0 && (
        <div className="absolute -left-5 text-xs font-bold text-amber-800 select-none drop-shadow-sm">
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className="absolute -bottom-5 text-xs font-bold text-amber-800 select-none drop-shadow-sm">
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Enhanced Valid Move Indicators */}
      {isValidMove && !piece && (
        <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full opacity-90 shadow-lg animate-pulse" />
      )}
      
      {/* Enhanced Attack Indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-1 border-3 border-red-500 rounded-lg opacity-90 shadow-lg animate-pulse">
          <div className="absolute inset-0 bg-red-500/20 rounded-lg" />
        </div>
      )}
      
      {/* Chess Piece */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center relative z-10"
        >
          <ChessPiece 
            piece={piece} 
            isSelected={isSelected}
          />
        </div>
      )}
    </div>
  );
};

export default ChessSquare;
