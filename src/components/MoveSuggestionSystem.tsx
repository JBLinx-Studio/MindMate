import React, { useState, useEffect } from 'react';
import { GameState, Position } from '../types/chess';
import { enhancedChessEngine } from '../utils/enhancedChessEngine';
import { enhancedMoveValidator } from '../utils/enhancedMoveValidation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, Target, TrendingUp, Star, Clock, Brain, Zap } from 'lucide-react';

interface MoveSuggestionSystemProps {
  gameState: GameState;
  onMoveSelected: (from: Position, to: Position) => void;
  isActive: boolean;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface MoveSuggestion {
  from: Position;
  to: Position;
  notation: string;
  quality: 'excellent' | 'good' | 'ok' | 'questionable';
  evaluation: number;
  explanation: string;
  difficulty: number;
  themes: string[];
  confidence: number;
}

export const MoveSuggestionSystem: React.FC<MoveSuggestionSystemProps> = ({
  gameState,
  onMoveSelected,
  isActive,
  skillLevel
}) => {
  const [suggestions, setSuggestions] = useState<MoveSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<MoveSuggestion | null>(null);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (isActive && !gameState.isGameOver) {
      generateSuggestions();
    }
  }, [gameState, isActive, skillLevel]);

  const generateSuggestions = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time based on skill level
    const analysisTime = {
      beginner: 300,
      intermediate: 600,
      advanced: 1000,
      expert: 1500
    }[skillLevel];
    
    await new Promise(resolve => setTimeout(resolve, analysisTime));
    
    try {
      const engineEval = enhancedChessEngine.evaluatePosition(gameState);
      const allMoves = getAllPossibleMoves(gameState);
      
      const evaluatedMoves = allMoves.map(move => {
        const testGameState = simulateMove(gameState, move.from, move.to);
        if (!testGameState) return null;
        
        const moveEval = enhancedChessEngine.evaluatePosition(testGameState);
        const validation = enhancedMoveValidator.validateMove(gameState, move.from, move.to);
        
        return {
          from: move.from,
          to: move.to,
          notation: move.notation,
          quality: determineMoveQuality(moveEval.centipawns - engineEval.centipawns),
          evaluation: moveEval.centipawns,
          explanation: generateExplanation(move, validation, moveEval),
          difficulty: calculateDifficulty(move, validation),
          themes: validation.tacticalImplications || [],
          confidence: Math.min(95, Math.max(60, 80 + Math.random() * 15))
        };
      }).filter(Boolean) as MoveSuggestion[];
      
      // Sort by quality and filter based on skill level
      const filteredSuggestions = filterSuggestionsBySkillLevel(evaluatedMoves, skillLevel);
      setSuggestions(filteredSuggestions.slice(0, 5));
      
    } catch (error) {
      console.error('Move suggestion error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAllPossibleMoves = (gameState: GameState) => {
    const moves: Array<{from: Position, to: Position, notation: string}> = [];
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === gameState.currentPlayer) {
          // Simplified move generation for demo
          const possibleMoves = [
            { x: x + 1, y: y + 1 },
            { x: x - 1, y: y + 1 },
            { x: x + 2, y: y + 1 },
            { x: x, y: y + 2 }
          ].filter(pos => pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8);
          
          possibleMoves.forEach(to => {
            moves.push({
              from: { x, y },
              to,
              notation: generateNotation(piece, { x, y }, to)
            });
          });
        }
      }
    }
    
    return moves.slice(0, 10); // Limit for demo
  };

  const simulateMove = (gameState: GameState, from: Position, to: Position): GameState | null => {
    // Fix the type issue by ensuring currentPlayer is properly typed
    const newBoard = gameState.board.map(row => [...row]);
    const piece = newBoard[from.y][from.x];
    if (piece) {
      newBoard[to.y][to.x] = piece;
      newBoard[from.y][from.x] = null;
    }
    
    return {
      ...gameState,
      board: newBoard,
      currentPlayer: gameState.currentPlayer === 'white' ? 'black' : 'white'
    };
  };

  const generateNotation = (piece: any, from: Position, to: Position): string => {
    const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
    const square = String.fromCharCode(97 + to.x) + (8 - to.y);
    return `${pieceSymbol}${square}`;
  };

  const determineMoveQuality = (centipawnChange: number): MoveSuggestion['quality'] => {
    if (centipawnChange > 100) return 'excellent';
    if (centipawnChange > 30) return 'good';
    if (centipawnChange > -30) return 'ok';
    return 'questionable';
  };

  const generateExplanation = (move: any, validation: any, evaluation: any): string => {
    const explanations = [
      "Improves piece activity and central control",
      "Develops a piece toward the center",
      "Increases pressure on opponent's position",
      "Maintains material balance while improving position",
      "Prepares for future tactical opportunities",
      "Strengthens king safety",
      "Controls important squares"
    ];
    
    if (validation.tacticalImplications && validation.tacticalImplications.length > 0) {
      return validation.tacticalImplications[0];
    }
    
    return explanations[Math.floor(Math.random() * explanations.length)];
  };

  const calculateDifficulty = (move: any, validation: any): number => {
    let difficulty = 3; // Base difficulty
    
    if (validation.tacticalImplications && validation.tacticalImplications.length > 0) {
      difficulty += 2;
    }
    
    if (validation.moveType === 'capture') {
      difficulty += 1;
    } else if (validation.moveType === 'castle') {
      difficulty += 2;
    }
    
    return Math.min(5, difficulty);
  };

  const filterSuggestionsBySkillLevel = (suggestions: MoveSuggestion[], level: string): MoveSuggestion[] => {
    const maxDifficulty = {
      beginner: 2,
      intermediate: 3,
      advanced: 4,
      expert: 5
    }[level];
    
    return suggestions
      .filter(s => s.difficulty <= maxDifficulty)
      .sort((a, b) => {
        // Sort by quality first, then by evaluation
        const qualityOrder = { excellent: 4, good: 3, ok: 2, questionable: 1 };
        const qualityDiff = qualityOrder[b.quality] - qualityOrder[a.quality];
        if (qualityDiff !== 0) return qualityDiff;
        return b.evaluation - a.evaluation;
      });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ok': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'questionable': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <Star className="w-3 h-3" />;
      case 'good': return <TrendingUp className="w-3 h-3" />;
      case 'ok': return <Target className="w-3 h-3" />;
      case 'questionable': return <Zap className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  if (!isActive) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-800">Move Suggestions</h3>
          <Badge variant="outline">{skillLevel}</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowHints(!showHints)}
            variant="outline"
            size="sm"
          >
            {showHints ? 'Hide' : 'Show'} Hints
          </Button>
          
          {isAnalyzing && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
              <span className="text-xs text-yellow-600">Analyzing...</span>
            </div>
          )}
        </div>
      </div>

      {suggestions.length === 0 && !isAnalyzing && (
        <div className="text-center py-4 text-gray-500">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No suggestions available. Try making a move!</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className={`p-3 cursor-pointer transition-all ${
                selectedSuggestion === suggestion ? 'ring-2 ring-yellow-400' : 'hover:bg-yellow-50'
              }`}
              onClick={() => setSelectedSuggestion(
                selectedSuggestion === suggestion ? null : suggestion
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge className={getQualityColor(suggestion.quality)}>
                    {getQualityIcon(suggestion.quality)}
                    <span className="ml-1 capitalize">{suggestion.quality}</span>
                  </Badge>
                  
                  <span className="font-mono font-bold text-lg">{suggestion.notation}</span>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: suggestion.difficulty }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-orange-400 rounded-full" />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">
                    {suggestion.confidence}% confident
                  </div>
                  <Progress value={suggestion.confidence} className="w-16 h-2" />
                </div>
              </div>
              
              {showHints && (
                <div className="mt-2 text-sm text-gray-600">
                  {suggestion.explanation}
                </div>
              )}
              
              {suggestion.themes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {suggestion.themes.map((theme, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              )}
              
              {selectedSuggestion === suggestion && (
                <div className="mt-3 pt-3 border-t border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Evaluation:</span> 
                      <span className={suggestion.evaluation > 0 ? 'text-green-600' : 'text-red-600'}>
                        {suggestion.evaluation > 0 ? '+' : ''}{(suggestion.evaluation / 100).toFixed(2)}
                      </span>
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSelected(suggestion.from, suggestion.to);
                      }}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Play Move
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MoveSuggestionSystem;
