
import React, { useState, useEffect } from 'react';
import { GameState, Move } from '../types/chess';
import { enhancedChessEngine } from '../utils/enhancedChessEngine';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Clock, Star, Award } from 'lucide-react';

interface PerformanceTrackerProps {
  gameState: GameState;
  isActive: boolean;
}

interface MoveQuality {
  move: string;
  quality: 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  evaluation: number;
  time: number;
}

interface PerformanceMetrics {
  accuracy: number;
  averageTime: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
  goodMoves: number;
  excellentMoves: number;
  currentStreak: number;
  bestStreak: number;
  centipawnLoss: number;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  gameState,
  isActive
}) => {
  const [moveQualities, setMoveQualities] = useState<MoveQuality[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    accuracy: 85.2,
    averageTime: 15.4,
    blunders: 0,
    mistakes: 1,
    inaccuracies: 3,
    goodMoves: 8,
    excellentMoves: 4,
    currentStreak: 3,
    bestStreak: 7,
    centipawnLoss: 12.8
  });
  const [isAnalyzingMove, setIsAnalyzingMove] = useState(false);

  useEffect(() => {
    if (isActive && gameState.moves.length > 0) {
      const lastMove = gameState.moves[gameState.moves.length - 1];
      analyzeLastMove(lastMove);
    }
  }, [gameState.moves.length, isActive]);

  const analyzeLastMove = async (move: Move) => {
    setIsAnalyzingMove(true);
    
    // Simulate move analysis
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const quality = enhancedChessEngine.analyzeMoveQuality(move.notation, gameState);
      
      const newMoveQuality: MoveQuality = {
        move: move.notation,
        quality: quality.quality,
        evaluation: quality.evaluation,
        time: Math.random() * 30 + 5 // Simulate thinking time
      };
      
      setMoveQualities(prev => [...prev, newMoveQuality]);
      updateMetrics(newMoveQuality);
    } catch (error) {
      console.error('Move analysis error:', error);
    } finally {
      setIsAnalyzingMove(false);
    }
  };

  const updateMetrics = (moveQuality: MoveQuality) => {
    setMetrics(prev => {
      const newMetrics = { ...prev };
      
      // Update move quality counts
      switch (moveQuality.quality) {
        case 'excellent':
          newMetrics.excellentMoves++;
          newMetrics.currentStreak++;
          break;
        case 'good':
          newMetrics.goodMoves++;
          newMetrics.currentStreak++;
          break;
        case 'inaccuracy':
          newMetrics.inaccuracies++;
          newMetrics.currentStreak = 0;
          break;
        case 'mistake':
          newMetrics.mistakes++;
          newMetrics.currentStreak = 0;
          break;
        case 'blunder':
          newMetrics.blunders++;
          newMetrics.currentStreak = 0;
          break;
      }
      
      // Update best streak
      if (newMetrics.currentStreak > newMetrics.bestStreak) {
        newMetrics.bestStreak = newMetrics.currentStreak;
      }
      
      // Recalculate accuracy
      const totalMoves = newMetrics.excellentMoves + newMetrics.goodMoves + 
                        newMetrics.inaccuracies + newMetrics.mistakes + newMetrics.blunders;
      const accurateMoves = newMetrics.excellentMoves + newMetrics.goodMoves;
      newMetrics.accuracy = totalMoves > 0 ? (accurateMoves / totalMoves) * 100 : 100;
      
      // Update average time
      const totalTime = moveQualities.reduce((sum, mq) => sum + mq.time, 0) + moveQuality.time;
      newMetrics.averageTime = totalTime / (moveQualities.length + 1);
      
      // Update centipawn loss (simplified)
      if (moveQuality.quality === 'blunder') {
        newMetrics.centipawnLoss += 150;
      } else if (moveQuality.quality === 'mistake') {
        newMetrics.centipawnLoss += 50;
      } else if (moveQuality.quality === 'inaccuracy') {
        newMetrics.centipawnLoss += 20;
      }
      
      return newMetrics;
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 text-green-700 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'inaccuracy': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'mistake': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'blunder': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPerformanceIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return <Star className="w-3 h-3" />;
      case 'good': return <TrendingUp className="w-3 h-3" />;
      case 'inaccuracy': return <Target className="w-3 h-3" />;
      case 'mistake': return <TrendingDown className="w-3 h-3" />;
      case 'blunder': return <Award className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  if (!isActive) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Performance Tracker</h3>
        </div>
        
        {isAnalyzingMove && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
            <span className="text-xs text-green-600">Analyzing...</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Overall Performance */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{metrics.accuracy.toFixed(1)}%</div>
            <div className="text-xs text-gray-600">Accuracy</div>
            <Progress value={metrics.accuracy} className="h-2 mt-1" />
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{metrics.averageTime.toFixed(1)}s</div>
            <div className="text-xs text-gray-600">Avg Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{metrics.centipawnLoss.toFixed(1)}</div>
            <div className="text-xs text-gray-600">CP Loss</div>
          </div>
        </div>

        {/* Move Quality Distribution */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Move Quality</div>
          <div className="grid grid-cols-5 gap-1 text-xs">
            <div className="text-center">
              <div className="text-green-600 font-bold">{metrics.excellentMoves}</div>
              <div className="text-green-600">Excellent</div>
            </div>
            <div className="text-center">
              <div className="text-blue-600 font-bold">{metrics.goodMoves}</div>
              <div className="text-blue-600">Good</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 font-bold">{metrics.inaccuracies}</div>
              <div className="text-yellow-600">Inaccurate</div>
            </div>
            <div className="text-center">
              <div className="text-orange-600 font-bold">{metrics.mistakes}</div>
              <div className="text-orange-600">Mistakes</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-bold">{metrics.blunders}</div>
              <div className="text-red-600">Blunders</div>
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{metrics.currentStreak}</div>
            <div className="text-xs text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{metrics.bestStreak}</div>
            <div className="text-xs text-gray-600">Best Streak</div>
          </div>
        </div>

        {/* Recent Moves */}
        {moveQualities.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Recent Moves</div>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {moveQualities.slice(-4).reverse().map((moveQuality, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="font-mono">{moveQuality.move}</span>
                  <div className="flex items-center space-x-2">
                    <Badge className={getQualityColor(moveQuality.quality)}>
                      {getPerformanceIcon(moveQuality.quality)}
                      <span className="ml-1 capitalize">{moveQuality.quality}</span>
                    </Badge>
                    <span className="text-gray-500">{moveQuality.time.toFixed(1)}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Tips */}
        <div className="p-2 bg-green-100 rounded text-xs text-green-800">
          <Clock className="w-3 h-3 inline mr-1" />
          <strong>Tip:</strong> {
            metrics.accuracy > 90 ? 'Excellent performance! Keep it up!' :
            metrics.accuracy > 80 ? 'Good accuracy. Focus on reducing inaccuracies.' :
            metrics.accuracy > 70 ? 'Work on move calculation and pattern recognition.' :
            'Consider slowing down and double-checking your moves.'
          }
        </div>
      </div>
    </Card>
  );
};

export default PerformanceTracker;
