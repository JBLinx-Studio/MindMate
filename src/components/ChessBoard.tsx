
import React, { useState, useCallback } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';

interface ChessBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ gameState, onGameStateChange }) => {
  const [draggedPiece, setDraggedPiece] = useState<{ from: Position } | null>(null);

  const handleSquareClick = useCallback((position: Position) => {
    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedSquare) {
      // Try to make a move
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      if (newGameState) {
        onGameStateChange(newGameState);
      } else {
        // Select new piece or deselect
        if (piece && piece.color === gameState.currentPlayer) {
          const validMoves = getValidMoves(piece, gameState.board, gameState);
          onGameStateChange({
            ...gameState,
            selectedSquare: position,
            validMoves
          });
        } else {
          onGameStateChange({
            ...gameState,
            selectedSquare: undefined,
            validMoves: []
          });
        }
      }
    } else if (piece && piece.color === gameState.currentPlayer) {
      // Select piece
      const validMoves = getValidMoves(piece, gameState.board, gameState);
      onGameStateChange({
        ...gameState,
        selectedSquare: position,
        validMoves
      });
    }
  }, [gameState, onGameStateChange]);

  const handleDragStart = useCallback((e: React.DragEvent, position: Position) => {
    const piece = gameState.board[position.y][position.x];
    if (piece && piece.color === gameState.currentPlayer) {
      setDraggedPiece({ from: position });
      e.dataTransfer.effectAllowed = 'move';
    }
  }, [gameState]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, position: Position) => {
    e.preventDefault();
    
    if (draggedPiece) {
      const newGameState = makeMove(gameState, draggedPiece.from, position);
      if (newGameState) {
        onGameStateChange(newGameState);
      }
      setDraggedPiece(null);
    }
  }, [draggedPiece, gameState, onGameStateChange]);

  const isValidMove = useCallback((position: Position): boolean => {
    return gameState.validMoves.some(move => move.x === position.x && move.y === position.y);
  }, [gameState.validMoves]);

  const isLastMove = useCallback((position: Position): boolean => {
    const lastMove = gameState.moves[gameState.moves.length - 1];
    return lastMove && (
      (lastMove.from.x === position.x && lastMove.from.y === position.y) ||
      (lastMove.to.x === position.x && lastMove.to.y === position.y)
    );
  }, [gameState.moves]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl aspect-square">
        {/* Enhanced Chess board container */}
        <div className="w-full h-full border-8 border-gradient-to-br from-amber-900 to-amber-800 rounded-2xl shadow-2xl bg-gradient-to-br from-amber-200 to-amber-300 p-6 relative">
          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 w-4 h-4 bg-amber-900 rounded-full opacity-60" />
          <div className="absolute top-2 right-2 w-4 h-4 bg-amber-900 rounded-full opacity-60" />
          <div className="absolute bottom-2 left-2 w-4 h-4 bg-amber-900 rounded-full opacity-60" />
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-amber-900 rounded-full opacity-60" />
          
          {/* Chess board grid */}
          <div className="w-full h-full grid grid-cols-8 gap-1 rounded-xl overflow-hidden shadow-inner">
            {gameState.board.map((row, y) =>
              row.map((piece, x) => (
                <ChessSquare
                  key={`${x}-${y}`}
                  position={{ x, y }}
                  piece={piece}
                  isLight={(x + y) % 2 === 0}
                  isSelected={gameState.selectedSquare?.x === x && gameState.selectedSquare?.y === y}
                  isValidMove={isValidMove({ x, y })}
                  isLastMove={isLastMove({ x, y })}
                  onClick={() => handleSquareClick({ x, y })}
                  onDragStart={(e) => handleDragStart(e, { x, y })}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, { x, y })}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
