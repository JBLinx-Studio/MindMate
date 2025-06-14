
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
    if (isSelected) return 'bg-yellow-400 shadow-xl ring-4 ring-yellow-300/50';
    if (isLastMove) return 'bg-yellow-300/80 shadow-lg ring-2 ring-yellow-400/30';
    if (isValidMove) return isLight 
      ? 'bg-green-400/80 shadow-lg ring-2 ring-green-300/50' 
      : 'bg-green-500/80 shadow-lg ring-2 ring-green-400/50';
    
    return isLight 
      ? 'bg-gradient-to-br from-amber-50 to-orange-100' 
      : 'bg-gradient-to-br from-amber-700 to-orange-800';
  };

  const getHoverEffects = () => {
    if (isSelected || isLastMove) return '';
    return 'hover:shadow-md hover:scale-[1.02] transition-all duration-200';
  };

  const getSquareTextColor = () => {
    return isLight ? 'text-amber-800/80' : 'text-amber-100/90';
  };

  return (
    <div
      className={`
        relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center
        cursor-pointer transition-all duration-200 ease-out border border-black/5
        ${getSquareColor()}
        ${getHoverEffects()}
        ${piece ? 'hover:shadow-lg' : ''}
        ${isSelected ? 'scale-105 z-20' : ''}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        boxShadow: isSelected 
          ? '0 8px 25px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.2)' 
          : isLastMove
          ? '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
          : 'inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      {/* Coordinate Labels */}
      {showCoordinates && x === 0 && (
        <div className={`absolute -left-8 text-xs font-bold ${getSquareTextColor()} select-none`}>
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className={`absolute -bottom-8 text-xs font-bold ${getSquareTextColor()} select-none`}>
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Enhanced Valid Move Indicators */}
      {isValidMove && !piece && (
        <div className="w-5 h-5 bg-green-600/90 rounded-full shadow-lg animate-pulse ring-2 ring-green-300/60" />
      )}
      
      {/* Attack Indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-1 border-3 border-red-500/80 rounded-lg animate-pulse shadow-lg bg-red-100/30" />
      )}
      
      {/* Chess Piece */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center transition-all duration-200 hover:scale-110 relative z-10"
        >
          <ChessPiece piece={piece} />
        </div>
      )}
      
      {/* Selection Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-lg animate-pulse" />
      )}
      
      {/* Square Texture */}
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent pointer-events-none rounded-sm" />
    </div>
  );
};

export default ChessSquare;
