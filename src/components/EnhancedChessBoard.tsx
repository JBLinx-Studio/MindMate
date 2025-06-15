
import React, { useState, useCallback, useEffect } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';
import GameResultModal from './GameResultModal';
import { toast } from 'sonner';
import { useEnhancedGameSettings } from '../hooks/useEnhancedGameSettings';
import { enhancedSoundManager } from '../utils/enhancedSoundManager';

interface EnhancedChessBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const EnhancedChessBoard: React.FC<EnhancedChessBoardProps> = ({ 
  gameState, 
  onGameStateChange 
}) => {
  const { settings } = useEnhancedGameSettings();
  const [draggedPiece, setDraggedPiece] = useState<{ from: Position } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const hapticFeedback = useCallback(() => {
    if (settings.enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [settings.enableHapticFeedback]);

  const handleSquareClick = useCallback((position: Position) => {
    if (gameState.isGameOver) {
      if (!showResultModal) {
        setShowResultModal(true);
      }
      return;
    }

    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedSquare) {
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      if (newGameState) {
        onGameStateChange(newGameState);
        
        if (piece && piece.color !== gameState.currentPlayer) {
          enhancedSoundManager.playMove(true);
        } else {
          enhancedSoundManager.playMove(false);
        }
        
        hapticFeedback();
        
        if (newGameState.isGameOver) {
          enhancedSoundManager.playCheckmate();
          setTimeout(() => setShowResultModal(true), 1000);
        } else if (isInCheck(newGameState.board, newGameState.currentPlayer)) {
          enhancedSoundManager.playCheck();
        }
      } else {
        if (piece && piece.color === gameState.currentPlayer) {
          const validMoves = getValidMoves(piece, gameState.board, gameState);
          onGameStateChange({
            ...gameState,
            selectedSquare: position,
            validMoves
          });
          enhancedSoundManager.playSelect();
        } else {
          onGameStateChange({
            ...gameState,
            selectedSquare: undefined,
            validMoves: []
          });
        }
      }
    } else if (piece && piece.color === gameState.currentPlayer) {
      const validMoves = getValidMoves(piece, gameState.board, gameState);
      onGameStateChange({
        ...gameState,
        selectedSquare: position,
        validMoves
      });
      enhancedSoundManager.playSelect();
      hapticFeedback();
    }
  }, [gameState, onGameStateChange, showResultModal, hapticFeedback]);

  const handleDragStart = useCallback((e: React.DragEvent, position: Position) => {
    if (gameState.isGameOver) {
      e.preventDefault();
      return;
    }

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
    
    if (draggedPiece && !gameState.isGameOver) {
      const newGameState = makeMove(gameState, draggedPiece.from, position);
      if (newGameState) {
        onGameStateChange(newGameState);
        enhancedSoundManager.playMove();
        hapticFeedback();
      }
      setDraggedPiece(null);
    }
  }, [draggedPiece, gameState, onGameStateChange, hapticFeedback]);

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

  const handleNewGame = () => {
    setShowResultModal(false);
    enhancedSoundManager.playGameStart();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Enhanced Board Container with Lichess-style design */}
      <div className="relative">
        {/* Coordinates with improved styling */}
        <div className="absolute -left-5 top-0 h-full flex flex-col justify-around text-sm text-[#8b8680] font-semibold">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            <div key={num} className="h-8 flex items-center">{num}</div>
          ))}
        </div>
        
        <div className="absolute -bottom-5 left-0 w-full flex justify-around text-sm text-[#8b8680] font-semibold">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className="w-8 flex justify-center">{letter}</div>
          ))}
        </div>

        {/* Enhanced Chess Board with improved shadows and styling */}
        <div className="w-full aspect-square grid grid-cols-8 rounded-md overflow-hidden shadow-xl border-2 border-[#8b8680] bg-gradient-to-br from-[#f0d9b5] to-[#b58863]">
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
                showCoordinates={settings.showCoordinates}
                boardTheme="lichess"
              />
            ))
          )}
        </div>

        {/* Board edge decoration */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8b8680] via-[#a69c94] to-[#8b8680] rounded-lg -z-10 opacity-30" />
      </div>

      {/* Game Result Modal */}
      {showResultModal && gameState.isGameOver && (
        <GameResultModal
          gameState={gameState}
          onNewGame={handleNewGame}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
};

export default EnhancedChessBoard;
