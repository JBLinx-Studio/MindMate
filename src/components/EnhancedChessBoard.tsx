
import React, { useState, useCallback } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';
import { toast } from 'sonner';

interface EnhancedChessBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const EnhancedChessBoard: React.FC<EnhancedChessBoardProps> = ({ 
  gameState, 
  onGameStateChange 
}) => {
  const [draggedPiece, setDraggedPiece] = useState<{ from: Position } | null>(null);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [boardFlipped, setBoardFlipped] = useState(false);

  const handleSquareClick = useCallback((position: Position) => {
    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedSquare) {
      // Try to make a move
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      if (newGameState) {
        onGameStateChange(newGameState);
        
        // Check for captures
        if (piece && piece.color !== gameState.currentPlayer) {
          toast.success(`${piece.type} captured!`, {
            duration: 2000,
          });
        }
        
        // Check for check (simplified)
        const kingInCheck = false; // TODO: Implement check detection
        if (kingInCheck) {
          toast.warning('Check!', {
            duration: 3000,
          });
        }
      } else {
        // Invalid move sound/feedback
        toast.error('Invalid move!', {
          duration: 1000,
        });
        
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
      
      // Add ghost image styling
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.transform = 'rotate(5deg)';
      e.dataTransfer.setDragImage(dragImage, 32, 32);
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
        toast.success('Good move!', {
          duration: 1500,
        });
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

  const displayBoard = boardFlipped ? 
    [...gameState.board].reverse().map(row => [...row].reverse()) : 
    gameState.board;

  return (
    <div className="space-y-4">
      {/* Board Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setBoardFlipped(!boardFlipped)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          Flip Board
        </button>
        <button
          onClick={() => setShowCoordinates(!showCoordinates)}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          {showCoordinates ? 'Hide' : 'Show'} Coordinates
        </button>
      </div>

      {/* Enhanced Chess Board */}
      <div className="inline-block border-4 border-amber-900 rounded-xl shadow-2xl bg-amber-50 p-2">
        <div className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden">
          {displayBoard.map((row, y) =>
            row.map((piece, x) => {
              const actualX = boardFlipped ? 7 - x : x;
              const actualY = boardFlipped ? 7 - y : y;
              
              return (
                <ChessSquare
                  key={`${actualX}-${actualY}`}
                  position={{ x: actualX, y: actualY }}
                  piece={piece}
                  isLight={(actualX + actualY) % 2 === 0}
                  isSelected={gameState.selectedSquare?.x === actualX && gameState.selectedSquare?.y === actualY}
                  isValidMove={isValidMove({ x: actualX, y: actualY })}
                  isLastMove={isLastMove({ x: actualX, y: actualY })}
                  onClick={() => handleSquareClick({ x: actualX, y: actualY })}
                  onDragStart={(e) => handleDragStart(e, { x: actualX, y: actualY })}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, { x: actualX, y: actualY })}
                  showCoordinates={showCoordinates}
                />
              );
            })
          )}
        </div>
        
        {/* Board evaluation bar */}
        <div className="mt-4 h-3 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-gray-800 to-white transition-all duration-1000"
            style={{ width: '50%' }} // This would be dynamic based on position evaluation
          />
        </div>
        <div className="text-center text-xs text-gray-600 mt-1">
          Position Evaluation: Equal
        </div>
      </div>
    </div>
  );
};

export default EnhancedChessBoard;
