
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
    if (isSelected) return 'bg-yellow-400 ring-2 ring-yellow-500';
    if (isLastMove) return 'bg-yellow-200 ring-1 ring-yellow-400';
    if (isValidMove) {
      return isLight ? 'bg-green-300 ring-1 ring-green-400' : 'bg-green-500 ring-1 ring-green-600';
    }
    
    return isLight ? 'bg-amber-100' : 'bg-amber-700';
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
        <div className="absolute -left-4 text-xs font-semibold text-gray-700 select-none">
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className="absolute -bottom-4 text-xs font-semibold text-gray-700 select-none">
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Valid Move Indicators */}
      {isValidMove && !piece && (
        <div className="w-4 h-4 bg-green-600 rounded-full opacity-80" />
      )}
      
      {/* Attack Indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-1 border-2 border-red-500 rounded opacity-80" />
      )}
      
      {/* Chess Piece */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center"
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
