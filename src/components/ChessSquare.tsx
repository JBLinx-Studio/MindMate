
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
    if (isSelected) return 'bg-yellow-400/80 shadow-xl ring-2 ring-yellow-500/50';
    if (isLastMove) return 'bg-yellow-300/60 shadow-lg';
    if (isValidMove) return isLight 
      ? 'bg-green-300/70 shadow-lg ring-2 ring-green-400/30' 
      : 'bg-green-400/70 shadow-lg ring-2 ring-green-500/30';
    
    // Modern chess.com-like colors
    return isLight 
      ? 'bg-gradient-to-br from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-150' 
      : 'bg-gradient-to-br from-amber-700 to-orange-800 hover:from-amber-600 hover:to-orange-700';
  };

  const getSquareTextColor = () => {
    return isLight ? 'text-amber-800/70' : 'text-amber-100/70';
  };

  return (
    <div
      className={`
        relative w-20 h-20 flex items-center justify-center
        cursor-pointer transition-all duration-200 ease-out
        ${getSquareColor()}
        ${isSelected ? 'scale-105 z-10' : 'hover:scale-102'}
        ${piece ? 'hover:shadow-lg' : ''}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        boxShadow: isSelected 
          ? '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' 
          : isLastMove
          ? '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
          : 'inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      {/* Enhanced coordinate labels */}
      {showCoordinates && x === 0 && (
        <div className={`absolute -left-6 text-sm font-bold ${getSquareTextColor()} select-none`}>
          {8 - y}
        </div>
      )}
      {showCoordinates && y === 7 && (
        <div className={`absolute -bottom-6 text-sm font-bold ${getSquareTextColor()} select-none`}>
          {String.fromCharCode(97 + x)}
        </div>
      )}
      
      {/* Enhanced valid move indicators */}
      {isValidMove && !piece && (
        <div className="w-6 h-6 bg-green-600/80 rounded-full shadow-lg animate-pulse ring-2 ring-green-300/50" />
      )}
      
      {/* Enhanced attack indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-0 border-4 border-red-500/70 rounded-xl animate-pulse shadow-lg bg-red-100/20" />
      )}
      
      {/* Piece with enhanced positioning */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center transition-all duration-200 hover:scale-110 relative z-20"
        >
          <ChessPiece piece={piece} />
        </div>
      )}
      
      {/* Enhanced selection glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl animate-pulse" />
      )}
      
      {/* Square texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default ChessSquare;
