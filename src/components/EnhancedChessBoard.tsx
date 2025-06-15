import React, { useState, useCallback, useEffect } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';
import GameResultModal from './GameResultModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, Settings, Volume2, VolumeX, Maximize, Minimize, Zap, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
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
  const { settings, updateSetting } = useEnhancedGameSettings();
  const [draggedPiece, setDraggedPiece] = useState<{ from: Position } | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [moveAnimation, setMoveAnimation] = useState<{ from: Position; to: Position } | null>(null);

  // Apply haptic feedback
  const hapticFeedback = useCallback(() => {
    if (settings.enableHapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [settings.enableHapticFeedback]);

  const celebrateMove = useCallback((isCapture: boolean) => {
    if (isCapture) {
      toast.success('Great capture! 🔥', {
        duration: 2500,
        description: 'Nice tactical move!'
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
      const newGameState = makeMove(gameState, gameState.selectedSquare, position);
      if (newGameState) {
        // Set move animation
        setMoveAnimation({ from: gameState.selectedSquare, to: position });
        setTimeout(() => setMoveAnimation(null), 500);
        
        onGameStateChange(newGameState);
        
        // Enhanced audio and visual feedback
        if (piece && piece.color !== gameState.currentPlayer) {
          enhancedSoundManager.playMove(true);
          celebrateMove(true);
        } else {
          enhancedSoundManager.playMove(false);
          celebrateMove(false);
        }
        
        hapticFeedback();
        
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
      } else {
        toast.error('Invalid move! 🚫', { 
          duration: 1500,
          description: 'That move is not allowed'
        });
        
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
      
      toast.info(`${piece.type} selected`, {
        duration: 1000,
        description: `${validMoves.length} moves available`
      });
    }
  }, [gameState, onGameStateChange, showResultModal, hapticFeedback, celebrateMove]);

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
    if (!settings.highlightLastMove) return false;
    const lastMove = gameState.moves[gameState.moves.length - 1];
    return lastMove && (
      (lastMove.from.x === position.x && lastMove.from.y === position.y) ||
      (lastMove.to.x === position.x && lastMove.to.y === position.y)
    );
  }, [gameState.moves, settings.highlightLastMove]);

  // Always display board in normal orientation (no auto-rotation)
  const displayBoard = gameState.board;

  const handleNewGame = () => {
    setShowResultModal(false);
    enhancedSoundManager.playGameStart();
  };

  const getBoardSize = () => {
    switch (settings.boardSize) {
      case 'small': return 'w-full max-w-md';
      case 'large': return 'w-full max-w-2xl';
      default: return 'w-full max-w-lg';
    }
  };

  return (
    <div className={`${getBoardSize()} mx-auto transition-all duration-300`}>
      {/* Enhanced Board Controls */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => updateSetting('showCoordinates', !settings.showCoordinates)}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-700 border-green-200 animate-pulse">
            <Sparkles className="w-3 h-3 mr-1" />
            Enhanced
          </Badge>
          
          <Button
            onClick={() => setShowQuickSettings(!showQuickSettings)}
            variant="ghost"
            size="sm"
            className="hover:bg-white/60"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
            variant="ghost"
            size="sm"
            className="hover:bg-white/60"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Settings Panel */}
      {showQuickSettings && (
        <Card className="mb-6 p-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <h4 className="font-semibold mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-purple-600" />
            Game Settings
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sound Volume</span>
              <div className="w-32">
                <Slider
                  value={[settings.soundVolume * 100]}
                  onValueChange={([value]) => updateSetting('soundVolume', value / 100)}
                  max={100}
                  step={10}
                  className="data-[state=open]:animate-in"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Board Theme</span>
              <select
                value={settings.boardTheme}
                onChange={(e) => updateSetting('boardTheme', e.target.value as any)}
                className="text-sm border rounded px-3 py-1 bg-white"
              >
                <option value="classic">Classic Wood</option>
                <option value="modern">Modern Blue</option>
                <option value="wood">Premium Wood</option>
                <option value="marble">Marble Luxury</option>
                <option value="neon">Neon Gaming</option>
                <option value="forest">Forest Green</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Chess Board Container */}
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center' : ''}`}>
        <div className="w-full aspect-square border-8 border-gradient-to-br from-amber-900 to-amber-800 rounded-3xl shadow-2xl bg-gradient-to-br from-amber-200 to-amber-300 p-6 relative overflow-hidden">
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-6 h-6 bg-amber-900 rounded-full opacity-70 animate-pulse" />
          <div className="absolute top-4 right-4 w-6 h-6 bg-amber-900 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-amber-900 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-4 right-4 w-6 h-6 bg-amber-900 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Chess Board Grid */}
          <div className="w-full h-full grid grid-cols-8 gap-px rounded-2xl overflow-hidden shadow-inner bg-amber-800/20">
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
