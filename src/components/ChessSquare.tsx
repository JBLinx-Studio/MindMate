
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
      lightSelected: 'bg-[#f7ec74]',
      darkSelected: 'bg-[#f7ec74]',
      lightLastMove: 'bg-[#ced26a]',
      darkLastMove: 'bg-[#baca44]',
      lightHover: 'hover:bg-[#eed5b0]',
      darkHover: 'hover:bg-[#b08258]'
    };
  };
  
  const getSquareColor = () => {
    const colors = getLichessColors();
    
    if (isSelected) {
      return isLight ? colors.lightSelected : colors.darkSelected;
    }
    if (isLastMove) {
      return isLight ? colors.lightLastMove : colors.darkLastMove;
    }
    
    const baseColor = isLight ? colors.light : colors.dark;
    const hoverColor = isLight ? colors.lightHover : colors.darkHover;
    
    return `${baseColor} ${hoverColor}`;
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const getCoordinateText = () => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    let coordinate = '';
    
    // Show file letter on bottom rank
    if (y === 7) {
      coordinate += files[x];
    }
    
    // Show rank number on left file
    if (x === 0) {
      coordinate += ranks[y];
    }
    
    return coordinate;
  };

  return (
    <div
      className={`
        aspect-square w-full h-full
        flex items-center justify-center cursor-pointer
        transition-all duration-150 ease-out
        ${getSquareColor()}
        relative overflow-hidden
        ${isHovered ? 'shadow-inner' : ''}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Coordinate labels */}
      {showCoordinates && getCoordinateText() && (
        <div className={`
          absolute text-xs font-semibold select-none pointer-events-none
          ${y === 7 ? 'bottom-0.5 right-1' : 'top-0.5 left-1'}
          ${isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]'}
        `}>
          {getCoordinateText()}
        </div>
      )}
      
      {/* Valid move indicators with improved styling */}
      {isValidMove && !piece && (
        <div className="w-5 h-5 bg-[#646f40] rounded-full opacity-80 transition-all duration-200 hover:scale-110" />
      )}
      
      {/* Attack indicator with subtle animation */}
      {isValidMove && piece && (
        <div className="absolute inset-0 rounded-sm opacity-70 transition-all duration-200">
          <div className="w-full h-full border-4 border-[#646f40] rounded-sm animate-pulse" />
        </div>
      )}
      
      {/* Chess Piece with improved drag handling */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="w-full h-full flex items-center justify-center relative z-10 transition-transform duration-150"
        >
          <ChessPiece 
            piece={piece} 
            isSelected={isSelected}
            isAnimating={isHovered}
            isDragging={false}
          />
        </div>
      )}
      
      {/* Subtle hover effect overlay */}
      {isHovered && !piece && (
        <div className="absolute inset-0 bg-black bg-opacity-5 transition-opacity duration-200" />
      )}
    </div>
  );
};

export default ChessSquare;
