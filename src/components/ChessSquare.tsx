
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
  onDrop
}) => {
  const { x, y } = position;
  
  const getSquareColor = () => {
    if (isSelected) return 'bg-yellow-400';
    if (isLastMove) return 'bg-yellow-300';
    if (isValidMove) return isLight ? 'bg-green-300' : 'bg-green-400';
    return isLight ? 'bg-amber-100' : 'bg-amber-800';
  };

  return (
    <div
      className={`
        relative w-16 h-16 flex items-center justify-center
        border border-amber-900/20 cursor-pointer
        transition-all duration-200 hover:brightness-110
        ${getSquareColor()}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Coordinate labels */}
      {x === 0 && (
        <div className="absolute -left-4 text-xs font-medium text-amber-900">
          {8 - y}
        </div>
      )}
      {y === 7 && (
        <div className="absolute -bottom-4 text-xs font-medium text-amber-900">
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Valid move indicator */}
      {isValidMove && !piece && (
        <div className="w-4 h-4 bg-green-600 rounded-full opacity-60" />
      )}
      
      {/* Piece */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center"
        >
          <ChessPiece piece={piece} />
        </div>
      )}
    </div>
  );
};

export default ChessSquare;
