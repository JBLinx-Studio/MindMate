
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
  showCoordinates = true
}) => {
  const { x, y } = position;
  
  const getSquareColor = () => {
    if (isSelected) return 'bg-yellow-400 shadow-lg';
    if (isLastMove) return 'bg-yellow-300 shadow-md';
    if (isValidMove) return isLight ? 'bg-green-300 shadow-md' : 'bg-green-400 shadow-md';
    return isLight ? 'bg-amber-100' : 'bg-amber-800';
  };

  return (
    <div
      className={`
        relative w-16 h-16 flex items-center justify-center
        border border-amber-900/20 cursor-pointer
        transition-all duration-300 hover:brightness-110 hover:scale-105
        ${getSquareColor()}
        ${isSelected ? 'ring-4 ring-yellow-500 ring-opacity-50' : ''}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Coordinate labels */}
      {showCoordinates && x === 0 && (
        <div className="absolute -left-5 text-xs font-bold text-amber-900 select-none">
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className="absolute -bottom-5 text-xs font-bold text-amber-900 select-none">
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Valid move indicator with enhanced styling */}
      {isValidMove && !piece && (
        <div className="w-5 h-5 bg-green-600 rounded-full opacity-70 animate-pulse shadow-lg" />
      )}
      
      {/* Attack indicator for valid moves on enemy pieces */}
      {isValidMove && piece && (
        <div className="absolute inset-0 border-4 border-red-500 rounded-lg opacity-60 animate-pulse" />
      )}
      
      {/* Piece */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
        >
          <ChessPiece piece={piece} />
        </div>
      )}
      
      {/* Selected piece glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-lg animate-pulse" />
      )}
    </div>
  );
};

export default ChessSquare;
