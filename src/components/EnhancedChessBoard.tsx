
import React, { useState, useCallback, useEffect } from 'react';
import { Position, GameState } from '../types/chess';
import { getValidMoves, makeMove, isInCheck } from '../utils/chessLogic';
import ChessSquare from './ChessSquare';
import GameResultModal from './GameResultModal';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RotateCcw, Eye, Settings, Volume2, VolumeX, Maximize, Minimize, Zap } from 'lucide-react';
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

  // Apply haptic feedback
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
        
        // Enhanced audio feedback
        if (piece && piece.color !== gameState.currentPlayer) {
          enhancedSoundManager.playMove(true);
          toast.success(`${piece.type} captured!`, {
            duration: 2000,
          });
        } else {
          enhancedSoundManager.playMove(false);
        }
        
        hapticFeedback();
        
        if (newGameState.isGameOver) {
          enhancedSoundManager.playCheckmate();
          setTimeout(() => setShowResultModal(true), 1000);
        } else if (isInCheck(newGameState.board, newGameState.currentPlayer)) {
          enhancedSoundManager.playCheck();
          toast.warning('Check!', { 
            duration: 3000,
            description: `${newGameState.currentPlayer} king is in check!`
          });
        }
      } else {
        toast.error('Invalid move!', { 
          duration: 1000,
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
        toast.success('Nice move!', { duration: 1500 });
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
      {/* Board Controls */}
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="flex space-x-2">
          <Button
            onClick={() => updateSetting('autoRotateBoard', !settings.autoRotateBoard)}
            variant="outline"
            size="sm"
            disabled={true} // Disabled to prevent board flipping
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => updateSetting('showCoordinates', !settings.showCoordinates)}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsFullscreen(!isFullscreen)}
            variant="outline"
            size="sm"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowQuickSettings(!showQuickSettings)}
            variant="ghost"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
            variant="ghost"
            size="sm"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Settings Panel */}
      {showQuickSettings && (
        <Card className="mb-4 p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Quick Settings
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Sound Volume</span>
              <div className="w-24">
                <Slider
                  value={[settings.soundVolume * 100]}
                  onValueChange={([value]) => updateSetting('soundVolume', value / 100)}
                  max={100}
                  step={10}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Board Size</span>
              <select
                value={settings.boardSize}
                onChange={(e) => updateSetting('boardSize', e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </Card>
      )}

      {/* Chess Board Container */}
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black/90 flex items-center justify-center' : ''}`}>
        <div className="w-full aspect-square border-4 border-amber-800 rounded-lg shadow-lg bg-amber-200 p-4">
          {/* Chess Board Grid */}
          <div className="w-full h-full grid grid-cols-8 gap-0 rounded overflow-hidden">
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
