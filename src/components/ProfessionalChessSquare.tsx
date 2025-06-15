
import React, { useState } from 'react';
import { Position, Piece } from '../types/chess';
import ProfessionalChessPiece from './ProfessionalChessPiece';

interface ProfessionalChessSquareProps {
  position: Position;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isLastMove: boolean;
  isAnimating?: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  showCoordinates?: boolean;
}

const ProfessionalChessSquare: React.FC<ProfessionalChessSquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isValidMove,
  isLastMove,
  isAnimating = false,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
  showCoordinates = true
}) => {
  const { x, y } = position;
  const [isHovered, setIsHovered] = useState(false);
  
  const getSquareColors = () => {
    return {
      light: 'bg-[#f0d9b5]',
      dark: 'bg-[#b58863]',
      lightSelected: 'bg-gradient-to-br from-[#f7ec9a] via-[#f7ec74] to-[#f0e55c]',
      darkSelected: 'bg-gradient-to-br from-[#e6d374] via-[#f7ec74] to-[#e6d050]',
      lightLastMove: 'bg-gradient-to-br from-[#ced26a] via-[#d4d675] to-[#baca44]',
      darkLastMove: 'bg-gradient-to-br from-[#baca44] via-[#c5d154] to-[#a8b83a]',
      lightHover: 'hover:bg-[#eed5b0]',
      darkHover: 'hover:bg-[#b08258]'
    };
  };
  
  const getSquareStyle = () => {
    const colors = getSquareColors();
    
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
    
    if (y === 7) {
      coordinate += files[x];
    }
    
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
        transition-all duration-200 ease-out
        ${getSquareStyle()}
        relative overflow-hidden
        ${isAnimating ? 'scale-105 shadow-lg' : ''}
        ${isHovered ? 'shadow-inner transform scale-[1.02]' : ''}
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Coordinate labels with enhanced styling */}
      {showCoordinates && getCoordinateText() && (
        <div className={`
          absolute text-xs font-bold select-none pointer-events-none
          ${y === 7 ? 'bottom-1 right-1.5' : 'top-1 left-1.5'}
          ${isLight ? 'text-[#b58863] drop-shadow-sm' : 'text-[#f0d9b5] drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]'}
          transition-all duration-200
        `}>
          {getCoordinateText()}
        </div>
      )}
      
      {/* Enhanced valid move indicators */}
      {isValidMove && !piece && (
        <div className="relative">
          <div className="w-6 h-6 bg-[#646f40] rounded-full opacity-80 transition-all duration-300 hover:scale-125 shadow-lg" />
          <div className="absolute inset-0 w-6 h-6 bg-[#759b4a] rounded-full opacity-40 animate-pulse" />
        </div>
      )}
      
      {/* Enhanced attack indicator */}
      {isValidMove && piece && (
        <div className="absolute inset-0 rounded-sm transition-all duration-300">
          <div className="w-full h-full border-4 border-[#646f40] rounded-sm animate-pulse shadow-lg" />
          <div className="absolute inset-1 border-2 border-[#759b4a] rounded-sm opacity-60" />
        </div>
      )}
      
      {/* Chess Piece with enhanced styling */}
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className={`
            w-full h-full flex items-center justify-center relative z-10 
            transition-all duration-200 ease-out
            ${isHovered ? 'scale-110' : ''}
            ${isAnimating ? 'scale-125 rotate-3' : ''}
          `}
        >
          <ProfessionalChessPiece 
            piece={piece} 
            isSelected={isSelected}
            isAnimating={isAnimating || isHovered}
            isDragging={false}
          />
        </div>
      )}
      
      {/* Premium hover effect overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 transition-opacity duration-200 rounded-sm" />
      )}
      
      {/* Selection glow effect */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/20 rounded-sm animate-pulse" />
      )}
    </div>
  );
};

export default ProfessionalChessSquare;
