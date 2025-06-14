
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
      return 'bg-yellow-400 ring-4 ring-yellow-500/60 shadow-lg';
    }
    if (isLastMove) {
      return 'bg-blue-300 ring-2 ring-blue-400/60';
    }
    if (isValidMove) {
      return isLight 
        ? 'bg-green-200 ring-2 ring-green-400/60' 
        : 'bg-green-400 ring-2 ring-green-600/60';
    }
    
    // Stable classic theme colors
    return isLight 
      ? 'bg-amber-50' 
      : 'bg-amber-700';
  };

  return (
    <div
      className={`
        aspect-square w-full h-full
        flex items-center justify-center cursor-pointer
        transition-all duration-200 ease-out
        ${getSquareColor()}
        hover:brightness-110
        relative
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Coordinate Labels */}
      {showCoordinates && x === 0 && (
        <div className="absolute -left-4 text-xs font-bold text-amber-800 select-none">
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className="absolute -bottom-4 text-xs font-bold text-amber-800 select-none">
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Valid Move Indicators */}
      {isValidMove && !piece && (
        <div className="w-4 h-4 bg-green-600 rounded-full opacity-80 shadow-md" />
      )}
      
      {/* Attack Indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-1 border-2 border-red-500 rounded opacity-80">
          <div className="absolute inset-0 bg-red-500/10 rounded" />
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
