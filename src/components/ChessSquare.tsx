
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
  boardTheme = 'lichess'
}) => {
  const { x, y } = position;
  const [isHovered, setIsHovered] = useState(false);
  
  const getLichessColors = () => {
    return {
      light: 'bg-[#f0d9b5]',
      dark: 'bg-[#b58863]',
      lightHover: 'hover:bg-[#eed5b0]',
      darkHover: 'hover:bg-[#b08258]'
    };
  };
  
  const getSquareColor = () => {
    const colors = getLichessColors();
    const baseColor = isLight ? colors.light : colors.dark;
    const hoverColor = isLight ? colors.lightHover : colors.darkHover;
    
    if (isSelected) {
      return 'bg-[#f7ec74] ring-2 ring-[#f7ec74]';
    }
    if (isLastMove) {
      return `${baseColor} bg-[#ced26a]`;
    }
    
    return `${baseColor} ${hoverColor}`;
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={`
        aspect-square w-full h-full
        flex items-center justify-center cursor-pointer
        transition-colors duration-200
        ${getSquareColor()}
        relative
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Valid Move Indicators */}
      {isValidMove && !piece && (
        <div className="w-4 h-4 bg-[#646f40] rounded-full opacity-70" />
      )}
      
      {/* Attack Indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-0 border-4 border-[#646f40] rounded-sm opacity-70" />
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
            isAnimating={isHovered}
          />
        </div>
      )}
    </div>
  );
};

export default ChessSquare;
