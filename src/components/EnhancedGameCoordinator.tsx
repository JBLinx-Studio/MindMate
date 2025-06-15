import React, { useState, useEffect } from 'react';
import { GameState, Position } from '../types/chess';
import { useEnhancedGameSettings } from '../hooks/useEnhancedGameSettings';
import { RealTimeAnalysisPanel } from './RealTimeAnalysisPanel';
import { ChessAIOpponent } from './ChessAIOpponent';
import { TacticalAnalyzer } from './TacticalAnalyzer';
import { PerformanceTracker } from './PerformanceTracker';
import { ChessPuzzleSystem } from './ChessPuzzleSystem';
import { MoveSuggestionSystem } from './MoveSuggestionSystem';
import { EnhancedSettingsPanel } from './EnhancedSettingsPanel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Brain, 
  Target,
  Trophy,
  Lightbulb,
  BarChart3,
  Book
} from 'lucide-react';

interface EnhancedGameCoordinatorProps {
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
}

type GameMode = 'practice' | 'ai' | 'analysis' | 'puzzles' | 'training';
type AnalysisMode = 'realtime' | 'tactical' | 'performance' | 'suggestions';

export const EnhancedGameCoordinator: React.FC<EnhancedGameCoordinatorProps> = ({
  gameState,
  onGameStateChange
}) => {
  const { settings } = useEnhancedGameSettings();
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('realtime');
  const [isGameActive, setIsGameActive] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [playerSkillLevel, setPlayerSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');

  useEffect(() => {
    // Auto-save game state
    localStorage.setItem('chess-game-state', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    // Load saved game state on mount
    const savedState = localStorage.getItem('chess-game-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.board && parsedState.currentPlayer) {
          onGameStateChange(parsedState);
        }
      } catch (error) {
        console.error('Failed to load saved game state:', error);
      }
    }
  }, []);

  const handleModeChange = (mode: GameMode) => {
    setGameMode(mode);
    
    if (mode === 'puzzles') {
      setIsGameActive(false);
    } else {
      setIsGameActive(true);
    }
    
    toast.success(`Switched to ${mode} mode`, {
      description: getModeDescription(mode)
    });
  };

  const handleAnalysisModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    toast.success(`Analysis mode: ${mode}`, {
      description: getAnalysisModeDescription(mode)
    });
  };

  const handleGamePause = () => {
    setIsGameActive(!isGameActive);
    toast.success(isGameActive ? 'Game paused' : 'Game resumed');
  };

  const handleGameReset = () => {
    const initialBoard: (any | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const pieces = [
      'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'
    ];
    // Black pieces
    for (let x = 0; x < 8; x++) {
      initialBoard[0][x] = {
        type: pieces[x],
        color: 'black',
        position: { x, y: 0 },
        hasMoved: false
      };
      initialBoard[1][x] = {
        type: 'pawn',
        color: 'black',
        position: { x, y: 1 },
        hasMoved: false
      };
    }
    // White pieces
    for (let x = 0; x < 8; x++) {
      initialBoard[7][x] = {
        type: pieces[x],
        color: 'white',
        position: { x, y: 7 },
        hasMoved: false
      };
      initialBoard[6][x] = {
        type: 'pawn',
        color: 'white',
        position: { x, y: 6 },
        hasMoved: false
      };
    }

    const newGameState: GameState = {
      board: initialBoard,
      currentPlayer: 'white', // <-- this must be 'white' or 'black'
      moves: [],
      isGameOver: false,
      validMoves: [],
      selectedSquare: undefined
    };
    onGameStateChange(newGameState);
    setIsGameActive(true);
    toast.success('Game reset to starting position');
  };

  // --- SUGGESTION SYSTEM: handler with right signature! ---
  const handleSuggestionMove = (from: Position, to: Position) => {
    // Deep copy the board for immutability
    const newBoard = gameState.board.map(row => row.map(piece => piece ? { ...piece } : null));
    const movingPiece = newBoard[from.y][from.x];

    if (!movingPiece) {
      toast.error("No piece to move!");
      return;
    }

    // Simple move (no capture/promotion/castle) for now
    newBoard[to.y][to.x] = { ...movingPiece, position: { x: to.x, y: to.y }, hasMoved: true };
    newBoard[from.y][from.x] = null;

    const newMove = {
      from,
      to,
      piece: movingPiece,
      notation: '', // Could be extended to generate notation
      timestamp: new Date()
    };

    const nextPlayer: 'white' | 'black' = gameState.currentPlayer === 'white' ? 'black' : 'white';

    const newGameState: GameState = {
      ...gameState,
      board: newBoard,
      currentPlayer: nextPlayer,
      moves: [...gameState.moves, newMove],
      lastMoveHighlight: { from, to },
      selectedSquare: undefined
    };

    onGameStateChange(newGameState);
    toast.success("Move played from suggestion!");
  };

  const getModeDescription = (mode: GameMode): string => {
    switch (mode) {
      case 'practice': return 'Free play with analysis tools';
      case 'ai': return 'Play against computer opponent';
      case 'analysis': return 'Deep position analysis and evaluation';
      case 'puzzles': return 'Solve tactical puzzles and improve';
      case 'training': return 'Structured learning with feedback';
      default: return '';
    }
  };

  const getAnalysisModeDescription = (mode: AnalysisMode): string => {
    switch (mode) {
      case 'realtime': return 'Live position evaluation and best moves';
      case 'tactical': return 'Find tactical patterns and combinations';
      case 'performance': return 'Track move quality and accuracy';
      case 'suggestions': return 'Get move recommendations with explanations';
      default: return '';
    }
  };

  const getModeIcon = (mode: GameMode) => {
    switch (mode) {
      case 'practice': return <Play className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'analysis': return <BarChart3 className="w-4 h-4" />;
      case 'puzzles': return <Trophy className="w-4 h-4" />;
      case 'training': return <Book className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getAnalysisIcon = (mode: AnalysisMode) => {
    switch (mode) {
      case 'realtime': return <Brain className="w-4 h-4" />;
      case 'tactical': return <Target className="w-4 h-4" />;
      case 'performance': return <BarChart3 className="w-4 h-4" />;
      case 'suggestions': return <Lightbulb className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const renderAnalysisPanel = () => {
    if (!settings.autoAnalysis) return null;
    switch (analysisMode) {
      case 'realtime':
        return (
          <RealTimeAnalysisPanel
            gameState={gameState}
            isActive={isGameActive && gameMode !== 'puzzles'}
          />
        );
      case 'tactical':
        return (
          <TacticalAnalyzer
            gameState={gameState}
            onMoveSelected={onGameStateChange}
            isActive={isGameActive && gameMode !== 'puzzles'}
          />
        );
      case 'performance':
        return (
          <PerformanceTracker
            gameState={gameState}
            isActive={isGameActive}
          />
        );
      case 'suggestions':
        return (
          <MoveSuggestionSystem
            gameState={gameState}
            onMoveSelected={handleSuggestionMove} // <-- FIX: Pass correct function signature here
            isActive={isGameActive && gameMode !== 'puzzles'}
            skillLevel={playerSkillLevel}
          />
        );
      default:
        return null;
    }
  };

  // --- ENHANCEMENT: Better game mode selector, working button feedback, descriptions, etc ---
  return (
    <div className="w-full max-w-sm space-y-4">
      {/* Game Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Game Controls</h3>
          <Button
            onClick={() => setShowSettings(true)}
            variant="outline"
            size="sm"
            aria-label="Show settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            onClick={handleGamePause}
            variant={isGameActive ? "default" : "secondary"}
            size="sm"
            aria-label={isGameActive ? "Pause game" : "Resume game"}
          >
            {isGameActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button
            onClick={handleGameReset}
            variant="outline"
            size="sm"
            aria-label="Reset game"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Badge variant="outline" className="flex items-center justify-center">
            {gameState.moves.length}
          </Badge>
        </div>
        {/* Game Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Game Mode</label>
          <div className="grid grid-cols-2 gap-1">
            {(['practice', 'ai', 'analysis', 'puzzles', 'training'] as const).map((mode) => (
              <Button
                key={mode}
                onClick={() => handleModeChange(mode)}
                variant={gameMode === mode ? "default" : "outline"}
                size="sm"
                className="text-xs flex items-center"
                aria-pressed={gameMode === mode}
                aria-label={`Switch to ${mode} mode`}
              >
                {getModeIcon(mode)}
                <span className="ml-1 capitalize">{mode}</span>
              </Button>
            ))}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {getModeDescription(gameMode)}
          </div>
        </div>
        {/* Analysis Mode Selection */}
        {gameMode === 'analysis' && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Analysis Type</label>
            <div className="grid grid-cols-2 gap-1">
              {(['realtime', 'tactical', 'performance', 'suggestions'] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => handleAnalysisModeChange(mode)}
                  variant={analysisMode === mode ? "default" : "outline"}
                  size="sm"
                  className="text-xs flex items-center"
                  aria-pressed={analysisMode === mode}
                  aria-label={`Switch to ${mode} analysis`}
                >
                  {getAnalysisIcon(mode)}
                  <span className="ml-1 capitalize">{mode}</span>
                </Button>
              ))}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {getAnalysisModeDescription(analysisMode)}
            </div>
          </div>
        )}
        {/* AI Difficulty Selector (when in AI mode) */}
        {gameMode === "ai" && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">AI Difficulty</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard', 'expert'] as const).map(difficulty => (
                <Button
                  key={difficulty}
                  size="sm"
                  variant={aiDifficulty === difficulty ? "default" : "outline"}
                  className="text-xs capitalize"
                  onClick={() => {
                    setAiDifficulty(difficulty);
                    toast.success(`AI difficulty set to ${difficulty}`);
                  }}
                  aria-label={`Set AI difficulty to ${difficulty}`}
                >
                  {difficulty}
                </Button>
              ))}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {`You’re playing against the ${aiDifficulty} AI.`}
            </div>
          </div>
        )}
        {/* Player skill selection (when in Suggestions) */}
        {gameMode === "analysis" && analysisMode === "suggestions" && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Your Skill</label>
            <div className="flex gap-2">
              {(['beginner', 'intermediate', 'advanced', 'expert'] as const).map(lvl => (
                <Button
                  key={lvl}
                  size="sm"
                  variant={playerSkillLevel === lvl ? "default" : "outline"}
                  className="text-xs capitalize"
                  onClick={() => {
                    setPlayerSkillLevel(lvl);
                    toast.success(`Skill level set to ${lvl}`);
                  }}
                  aria-label={`Set skill level to ${lvl}`}
                >
                  {lvl}
                </Button>
              ))}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {`Suggestions match ${playerSkillLevel} level.`}
            </div>
          </div>
        )}
      </Card>
      {/* AI Opponent */}
      {gameMode === 'ai' && (
        <ChessAIOpponent
          gameState={gameState}
          onGameStateChange={onGameStateChange}
          aiColor="black"
          difficulty={aiDifficulty}
          isEnabled={isGameActive}
        />
      )}
      {/* Puzzle System */}
      {gameMode === 'puzzles' && (
        <ChessPuzzleSystem
          onGameStateChange={onGameStateChange}
          isActive={true}
        />
      )}
      {/* Analysis Panels */}
      {(gameMode === 'analysis' || gameMode === 'practice') && renderAnalysisPanel()}
      {/* Settings Panel */}
      <EnhancedSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default EnhancedGameCoordinator;
