import React, { useState, useCallback, useEffect } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';
import EnhancedChessPiece from './EnhancedChessPiece';
import GameResultModal from './GameResultModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, Settings, Volume2, VolumeX, Maximize, Minimize, Zap, Sparkles, Brain, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useEnhancedGameSettings } from '../hooks/useEnhancedGameSettings';
import { enhancedSoundManager } from '../utils/enhancedSoundManager';
import { enhancedMoveValidator } from '../utils/enhancedMoveValidation';
import { enhancedChessEngine } from '../utils/enhancedChessEngine';

interface EnhancedChessBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const EnhancedChessBoard: React.FC<EnhancedChessBoardProps> = ({ 
  gameState, 
  onGameStateChange 
}) => {
  const { settings, updateSetting } = useEnhancedGameSettings();
  const [draggedPiece, setDraggedPiece] = useState<{ from: Position } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [moveAnimation, setMoveAnimation] = useState<{ from: Position; to: Position } | null>(null);
  const [engineAnalysis, setEngineAnalysis] = useState<any>(null);
  const [showEngineAnalysis, setShowEngineAnalysis] = useState(false);
  const [lastMoveSquares, setLastMoveSquares] = useState<{ from: Position; to: Position } | null>(null);

  // Auto-analyze position when it changes
  useEffect(() => {
    if (settings.autoAnalysis && !gameState.isGameOver) {
      const analysis = enhancedChessEngine.evaluatePosition(gameState);
      setEngineAnalysis(analysis);
    }
  }, [gameState, settings.autoAnalysis]);

  // Apply haptic feedback
  const hapticFeedback = useCallback(() => {
    if (settings.enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [settings.enableHapticFeedback]);

  const celebrateMove = useCallback((moveData: any) => {
    if (moveData.capturedPiece) {
      toast.success(`Great capture! Took ${moveData.capturedPiece.type} 🔥`, {
        duration: 2500,
        description: `Material advantage gained!`
      });
    } else if (moveData.isCheck) {
      toast.success('Check! ⚡', {
        duration: 3000,
        description: 'Excellent tactical move!'
      });
    } else {
      const encouragements = [
        'Excellent move! ✨',
        'Well played! 🎯', 
        'Strategic thinking! 🧠',
        'Nice development! ⚡'
      ];
      toast.success(encouragements[Math.floor(Math.random() * encouragements.length)], {
        duration: 2000,
      });
    }
  }, []);

  const handleSquareClick = useCallback((position: Position) => {
    if (gameState.isGameOver) {
      if (!showResultModal) {
        setShowResultModal(true);
      }
      return;
    }

    const piece = gameState.board[position.y][position.x];
    
    if (gameState.selectedSquare) {
      // Validate move before making it
      const validation = enhancedMoveValidator.validateMove(gameState, gameState.selectedSquare, position);
      
      if (!validation.isValid) {
        toast.error(`Invalid move: ${validation.reason}`, { 
          duration: 2000,
        });
        
        // Still allow selecting a new piece if clicking on own piece
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
        return;
      }
      
      // Show tactical warnings
      if (validation.warningMessage) {
        toast.warning(validation.warningMessage, {
          duration: 3000,
          description: 'Consider this carefully'
        });
      }
      
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      if (newGameState) {
        // Generate enhanced move data
        const moveData = enhancedMoveValidator.generateMoveData(gameState, gameState.selectedSquare, position);
        
        // Set move animation and last move highlight
        setMoveAnimation({ from: gameState.selectedSquare, to: position });
        setLastMoveSquares({ from: gameState.selectedSquare, to: position });
        setTimeout(() => setMoveAnimation(null), 500);
        
        onGameStateChange(newGameState);
        
        // Enhanced audio and visual feedback
        if (moveData?.capturedPiece) {
          enhancedSoundManager.playMove(true);
          celebrateMove(moveData);
        } else {
          enhancedSoundManager.playMove(false);
          celebrateMove(moveData);
        }
        
        hapticFeedback();
        
        // Show move quality analysis
        if (moveData && settings.showMoveAnalysis) {
          const quality = enhancedChessEngine.analyzeMoveQuality(moveData.notation, gameState);
          setTimeout(() => {
            toast.info(`Move Quality: ${quality.quality}`, {
              duration: 4000,
              description: quality.explanation
            });
          }, 1000);
        }
        
        if (newGameState.isGameOver) {
          enhancedSoundManager.playCheckmate();
          toast.success('🏆 Game Over! Amazing battle!', { 
            duration: 5000,
            description: `${newGameState.winner} wins!`
          });
          setTimeout(() => setShowResultModal(true), 1000);
        } else if (isInCheck(newGameState.board, newGameState.currentPlayer)) {
          enhancedSoundManager.playCheck();
          toast.warning('⚠️ Check!', { 
            duration: 3000,
            description: `${newGameState.currentPlayer} king is in danger!`
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
      
      toast.info(`${piece.type} selected`, {
        duration: 1000,
        description: `${validMoves.length} moves available`
      });
    }
  }, [gameState, onGameStateChange, showResultModal, hapticFeedback, celebrateMove, settings.showMoveAnalysis]);

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
        toast.success('Smooth move! 🎯', { duration: 1500 });
      }
      setDraggedPiece(null);
    }
  }, [draggedPiece, gameState, onGameStateChange, hapticFeedback]);

  const isValidMove = useCallback((position: Position): boolean => {
    return settings.showLegalMoves && gameState.validMoves.some(move => move.x === position.x && move.y === position.y);
  }, [gameState.validMoves, settings.showLegalMoves]);

  const isLastMove = useCallback((position: Position): boolean => {
    if (!settings.highlightLastMove || !lastMoveSquares) return false;
    return (
      (lastMoveSquares.from.x === position.x && lastMoveSquares.from.y === position.y) ||
      (lastMoveSquares.to.x === position.x && lastMoveSquares.to.y === position.y)
    );
  }, [lastMoveSquares, settings.highlightLastMove]);

  const displayBoard = gameState.board;

  const handleNewGame = () => {
    setShowResultModal(false);
    setLastMoveSquares(null);
    enhancedSoundManager.playGameStart();
  };

  // Modify getBoardSize for a tighter, lichess feel
  const getBoardSize = () => {
    switch (settings.boardSize) {
      case 'small': return 'w-full max-w-[360px]';
      case 'large': return 'w-full max-w-[480px]';
      default: return 'w-full max-w-[410px]';
    }
  };

  const analyzeCurrentPosition = () => {
    const analysis = enhancedChessEngine.evaluatePosition(gameState);
    setEngineAnalysis(analysis);
    setShowEngineAnalysis(true);
    
    toast.success('Position analyzed!', {
      duration: 3000,
      description: `Evaluation: ${analysis.centipawns > 0 ? '+' : ''}${(analysis.centipawns / 100).toFixed(2)}`
    });
  };

  return (
    <div className={`${getBoardSize()} mx-0 transition-all duration-300`}>
      {/* Board Controls row (minimalistic lichess style) */}
      <div className="flex justify-between items-center mb-2 px-0">
        <div className="flex space-x-2">
          <Button
            onClick={() => updateSetting('showCoordinates', !settings.showCoordinates)}
            variant="ghost"
            size="icon"
            className={settings.showCoordinates ? "bg-neutral-300 border border-neutral-400" : ""}
            aria-label="Toggle Coordinates"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
            variant="ghost"
            size="icon"
            className="hover:bg-neutral-300"
            aria-label="Toggle Sound"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {/* Chess Board (flat, minimal deco, lichess style) */}
      <div className={`relative`}>
        <div className="w-full aspect-square border border-neutral-400 rounded-none shadow-none bg-neutral-200 p-0 relative overflow-hidden">
          <div className="w-full h-full grid grid-cols-8 gap-0 rounded-none overflow-hidden shadow-none bg-neutral-200">
            {displayBoard.map((row, y) =>
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
                  boardTheme={settings.boardTheme}
                />
              ))
            )}
          </div>
          {/* Move animation overlay */}
          {moveAnimation && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping absolute" 
                style={{
                  left: `${(moveAnimation.to.x + 0.5) * 12.5}%`,
                  top: `${(moveAnimation.to.y + 0.5) * 12.5}%`,
                }} />
            </div>
          )}
        </div>
      </div>
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
