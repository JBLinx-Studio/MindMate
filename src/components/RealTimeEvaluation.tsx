
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Target, Clock, Zap } from 'lucide-react';
import { GameState } from '../types/chess';
import { realChessEngine } from '../utils/realChessEngine';

interface RealTimeEvaluationProps {
  gameState: GameState;
  autoEvaluate?: boolean;
}

const RealTimeEvaluation: React.FC<RealTimeEvaluationProps> = ({ 
  gameState, 
  autoEvaluate = true 
}) => {
  const [currentEval, setCurrentEval] = useState(0);
  const [previousEval, setPreviousEval] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');
  const [isCalculating, setIsCalculating] = useState(false);
  const [engineDepth, setEngineDepth] = useState(12);
  const [evaluationHistory, setEvaluationHistory] = useState<number[]>([]);

  useEffect(() => {
    if (autoEvaluate && gameState.moves.length >= 0) {
      calculateRealEvaluation();
    }
  }, [gameState.moves.length, autoEvaluate]);

  const calculateRealEvaluation = async () => {
    setIsCalculating(true);
    
    // Simulate realistic engine calculation time based on position complexity
    const complexity = gameState.moves.length > 15 ? 300 : 150;
    await new Promise(resolve => setTimeout(resolve, complexity));
    
    const analysis = realChessEngine.analyzePosition(gameState);
    setPreviousEval(currentEval);
    setCurrentEval(analysis.evaluation);
    
    // Update evaluation history for trend analysis
    setEvaluationHistory(prev => [...prev.slice(-9), analysis.evaluation]);
    
    // Calculate trend based on recent evaluation changes
    const diff = analysis.evaluation - currentEval;
    if (Math.abs(diff) < 0.15) {
      setTrend('stable');
    } else if (diff > 0) {
      setTrend(gameState.currentPlayer === 'white' ? 'up' : 'down');
    } else {
      setTrend(gameState.currentPlayer === 'white' ? 'down' : 'up');
    }
    
    setEngineDepth(analysis.depth);
    setIsCalculating(false);
  };

  const getEvaluationDisplay = () => {
    const abs = Math.abs(currentEval);
    if (abs < 0.05) return '0.00';
    return `${currentEval > 0 ? '+' : ''}${currentEval.toFixed(2)}`;
  };

  const getEvaluationColor = () => {
    if (Math.abs(currentEval) < 0.3) return 'text-gray-600';
    if (currentEval > 0) return 'text-green-600';
    return 'text-gray-800';
  };

  const getTrendIcon = () => {
    if (isCalculating) {
      return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />;
    }
    
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAdvantageText = () => {
    const abs = Math.abs(currentEval);
    const player = currentEval > 0 ? 'White' : 'Black';
    
    if (abs < 0.2) return 'Equal position';
    if (abs < 0.5) return `${player} slightly ahead`;
    if (abs < 1.0) return `${player} better position`;
    if (abs < 2.0) return `${player} significant advantage`;
    if (abs < 4.0) return `${player} winning position`;
    return `${player} completely winning`;
  };

  const getEvaluationBar = () => {
    const normalized = Math.max(-6, Math.min(6, currentEval));
    return ((normalized + 6) / 12) * 100;
  };

  const getPositionCharacteristics = () => {
    const characteristics = [];
    
    if (gameState.moves.length < 8) characteristics.push('Opening');
    else if (gameState.moves.length < 25) characteristics.push('Middlegame');
    else characteristics.push('Endgame');
    
    if (Math.abs(currentEval) > 2) characteristics.push('Decisive');
    else if (Math.abs(currentEval) > 1) characteristics.push('Complex');
    else characteristics.push('Balanced');
    
    return characteristics;
  };

  if (!autoEvaluate) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200 shadow-md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getTrendIcon()}
            <span className="text-sm font-medium text-gray-700">Engine Analysis</span>
            <Badge variant="outline" className="text-xs">
              Depth {engineDepth}
            </Badge>
          </div>
          
          {isCalculating && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Clock className="w-3 h-3 animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}
        </div>

        {/* Evaluation Display */}
        <div className="text-center space-y-2">
          <div className={`text-2xl font-mono font-bold ${getEvaluationColor()}`}>
            {getEvaluationDisplay()}
          </div>
          
          {/* Evaluation Bar */}
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-white via-gray-100 to-green-200 transition-all duration-1000 ease-out"
              style={{ width: `${getEvaluationBar()}%` }}
            />
            <div 
              className="absolute right-0 top-0 h-full bg-gradient-to-l from-gray-900 via-gray-700 to-gray-400 transition-all duration-1000 ease-out"
              style={{ width: `${100 - getEvaluationBar()}%` }}
            />
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-yellow-400 transform -translate-x-0.5" />
          </div>
          
          <div className="text-sm text-gray-600 font-medium">
            {getAdvantageText()}
          </div>
        </div>

        {/* Position Info */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex space-x-1">
            {getPositionCharacteristics().map((char, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {char}
              </Badge>
            ))}
          </div>
          
          <div className="text-gray-500">
            Move {Math.ceil(gameState.moves.length / 2)} • {gameState.currentPlayer} to move
          </div>
        </div>

        {/* Evaluation History Sparkline */}
        {evaluationHistory.length > 3 && (
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-1">Evaluation trend</div>
            <div className="flex items-end space-x-0.5 h-6">
              {evaluationHistory.slice(-10).map((evaluation, index) => {
                const height = Math.max(2, Math.min(24, Math.abs(evaluation) * 8));
                const color = evaluation > 0 ? 'bg-green-400' : evaluation < 0 ? 'bg-gray-600' : 'bg-gray-300';
                return (
                  <div
                    key={index}
                    className={`w-1.5 ${color} rounded-sm transition-all duration-300`}
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RealTimeEvaluation;
