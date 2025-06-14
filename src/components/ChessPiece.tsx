
import React from 'react';
import { Piece } from '../types/chess';

interface ChessPieceProps {
  piece: Piece;
  isDragging?: boolean;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, isDragging }) => {
  const getPieceSymbol = (piece: Piece): string => {
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return symbols[piece.color][piece.type];
  };

  return (
    <div 
      className={`
        text-5xl cursor-pointer select-none flex items-center justify-center
        transition-all duration-200 hover:scale-110 hover:brightness-110
        ${isDragging ? 'opacity-60 scale-125 rotate-3' : ''}
        ${piece.color === 'white' ? 'drop-shadow-lg' : 'drop-shadow-md'}
      `}
      style={{ 
        textShadow: piece.color === 'white' 
          ? '2px 2px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.8)' 
          : '2px 2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.3)',
        filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.3)) ${
          piece.color === 'white' ? 'brightness(1.1)' : 'brightness(0.95)'
        }`
      }}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default ChessPiece;
