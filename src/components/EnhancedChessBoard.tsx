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

  const getBoardSize = () => {
    switch (settings.boardSize) {
      case 'small': return 'w-full max-w-md';
      case 'large': return 'w-full max-w-2xl';
      default: return 'w-full max-w-lg';
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
            onClick={analyzeCurrentPosition}
            variant="outline"
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
          >
            <Brain className="w-4 h-4" />
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
          {engineAnalysis && (
            <Badge 
              className={`${
                engineAnalysis.centipawns > 50 ? 'bg-green-100 text-green-700 border-green-200' :
                engineAnalysis.centipawns < -50 ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}
            >
              <Target className="w-3 h-3 mr-1" />
              {engineAnalysis.centipawns > 0 ? '+' : ''}{(engineAnalysis.centipawns / 100).toFixed(1)}
            </Badge>
          )}
          
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
              <span className="text-sm">Show Move Analysis</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateSetting('showMoveAnalysis', !settings.showMoveAnalysis)}
                className={settings.showMoveAnalysis ? 'bg-green-100' : ''}
              >
                {settings.showMoveAnalysis ? 'On' : 'Off'}
              </Button>
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

      {/* Engine Analysis Panel */}
      {showEngineAnalysis && engineAnalysis && (
        <Card className="mt-6 p-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold flex items-center">
              <Brain className="w-4 h-4 mr-2 text-purple-600" />
              Engine Analysis
            </h4>
            <Button variant="ghost" size="sm" onClick={() => setShowEngineAnalysis(false)}>×</Button>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{engineAnalysis.bestMove}</div>
              <div className="text-gray-600">Best Move</div>
            </div>
            <div className="text-center">
              <div className={`font-bold text-lg ${
                engineAnalysis.centipawns > 0 ? 'text-green-600' : 
                engineAnalysis.centipawns < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {engineAnalysis.centipawns > 0 ? '+' : ''}{(engineAnalysis.centipawns / 100).toFixed(1)}
              </div>
              <div className="text-gray-600">Evaluation</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{engineAnalysis.depth}</div>
              <div className="text-gray-600">Depth</div>
            </div>
          </div>
          {engineAnalysis.tacticalThemes.length > 0 && (
            <div className="mt-3">
              <div className="text-xs text-gray-600 mb-1">Tactical Themes:</div>
              <div className="flex flex-wrap gap-1">
                {engineAnalysis.tacticalThemes.map((theme: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

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
