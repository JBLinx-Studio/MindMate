
import React, { useState, useCallback, useEffect } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from '../utils/chessLogic';
import ProfessionalChessSquare from './ProfessionalChessSquare';
import GameResultModal from './GameResultModal';
import { toast } from 'sonner';
import { useEnhancedGameSettings } from '../hooks/useEnhancedGameSettings';
import { enhancedSoundManager } from '../utils/enhancedSoundManager';
import { gameDatabase } from '../utils/gameDatabase';
import { realChessEngine } from '../utils/realChessEngine';

interface ProfessionalChessBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const ProfessionalChessBoard: React.FC<ProfessionalChessBoardProps> = ({ 
  gameState, 
  onGameStateChange 
}) => {
  const { settings } = useEnhancedGameSettings();
  const [draggedPiece, setDraggedPiece] = useState<{ from: Position } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [animatingMove, setAnimatingMove] = useState<{ from: Position; to: Position } | null>(null);

  const hapticFeedback = useCallback(() => {
    if (settings.enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [settings.enableHapticFeedback]);

  const animateMove = useCallback(async (from: Position, to: Position) => {
    setAnimatingMove({ from, to });
    await new Promise(resolve => setTimeout(resolve, 250));
    setAnimatingMove(null);
  }, []);

  const handleSquareClick = useCallback(async (position: Position) => {
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
        // Animate the move
        await animateMove(gameState.selectedSquare, position);
        
        onGameStateChange(newGameState);
        
        if (piece && piece.color !== gameState.currentPlayer) {
          enhancedSoundManager.playMove(true);
        } else {
          enhancedSoundManager.playMove(false);
        }
        
        hapticFeedback();
        
        if (newGameState.isGameOver) {
          enhancedSoundManager.playCheckmate();
          saveGameToDatabase(newGameState);
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
  }, [gameState, onGameStateChange, showResultModal, hapticFeedback, animateMove]);

  const saveGameToDatabase = useCallback((finalGameState: GameState) => {
    try {
      const moveNotations = finalGameState.moves.map(move => move.notation);
      const openingInfo = realChessEngine.getOpeningInfo(moveNotations);
      const analysis = realChessEngine.analyzePosition(finalGameState);
      
      const gameId = gameDatabase.saveGame(finalGameState, {
        playerWhite: 'Player',
        playerBlack: 'Computer',
        timeControl: '15+10',
        rating: { white: 1500, black: 1500 },
        opening: openingInfo?.name || 'Unknown Opening',
        eco: openingInfo?.eco || '',
        tags: ['Local Game', 'Practice'],
        analysis: {
          evaluation: analysis.evaluation,
          accuracy: { white: 85, black: 88 },
          blunders: 0,
          mistakes: 1,
          inaccuracies: 2
        }
      });
      
      toast.success('Game saved to database!', {
        description: `Game ID: ${gameId.slice(0, 8)}... - ${finalGameState.moves.length} moves`
      });
    } catch (error) {
      toast.error('Failed to save game');
      console.error('Failed to save game:', error);
    }
  }, []);

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

  const handleDrop = useCallback(async (e: React.DragEvent, position: Position) => {
    e.preventDefault();
    
    if (draggedPiece && !gameState.isGameOver) {
      const newGameState = makeMove(gameState, draggedPiece.from, position);
      if (newGameState) {
        await animateMove(draggedPiece.from, position);
        onGameStateChange(newGameState);
        enhancedSoundManager.playMove();
        hapticFeedback();
        
        if (newGameState.isGameOver) {
          saveGameToDatabase(newGameState);
        }
      }
      setDraggedPiece(null);
    }
  }, [draggedPiece, gameState, onGameStateChange, hapticFeedback, animateMove, saveGameToDatabase]);

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

  const isAnimating = useCallback((position: Position): boolean => {
    return animatingMove && (
      (animatingMove.from.x === position.x && animatingMove.from.y === position.y) ||
      (animatingMove.to.x === position.x && animatingMove.to.y === position.y)
    );
  }, [animatingMove]);

  const handleNewGame = () => {
    setShowResultModal(false);
    enhancedSoundManager.playGameStart();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Professional Board Container */}
      <div className="relative p-8 bg-gradient-to-br from-[#8b8680] via-[#a69c94] to-[#8b8680] rounded-2xl shadow-2xl">
        {/* Elegant corner decorations */}
        <div className="absolute top-3 left-3 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-lg opacity-80" />
        <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-lg opacity-80" />
        <div className="absolute bottom-3 left-3 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-lg opacity-80" />
        <div className="absolute bottom-3 right-3 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-lg opacity-80" />
        
        {/* Coordinate labels with professional styling */}
        <div className="absolute -left-6 top-8 h-full flex flex-col justify-around text-[#5d5a52] font-bold text-lg">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(num => (
            <div key={num} className="h-12 flex items-center drop-shadow-sm">{num}</div>
          ))}
        </div>
        
        <div className="absolute -bottom-6 left-8 w-full flex justify-around text-[#5d5a52] font-bold text-lg">
          {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(letter => (
            <div key={letter} className="w-12 flex justify-center drop-shadow-sm">{letter}</div>
          ))}
        </div>

        {/* Enhanced Chess Board */}
        <div className="w-full aspect-square grid grid-cols-8 rounded-xl overflow-hidden shadow-inner border-4 border-[#6b6860] bg-gradient-to-br from-[#f0d9b5] to-[#b58863]">
          {gameState.board.map((row, y) =>
            row.map((piece, x) => (
              <ProfessionalChessSquare
                key={`${x}-${y}`}
                position={{ x, y }}
                piece={piece}
                isLight={(x + y) % 2 === 0}
                isSelected={gameState.selectedSquare?.x === x && gameState.selectedSquare?.y === y}
                isValidMove={isValidMove({ x, y })}
                isLastMove={isLastMove({ x, y })}
                isAnimating={isAnimating({ x, y })}
                onClick={() => handleSquareClick({ x, y })}
                onDragStart={(e) => handleDragStart(e, { x, y })}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, { x, y })}
                showCoordinates={settings.showCoordinates}
              />
            ))
          )}
        </div>

        {/* Subtle outer glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-900/20 via-amber-800/30 to-amber-900/20 rounded-3xl -z-10 blur-xl" />
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

export default ProfessionalChessBoard;
