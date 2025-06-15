
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GameState } from '../types/chess';
import { realChessEngine } from '../utils/realChessEngine';

interface RealTimeEvaluationProps {
  gameState: GameState;
  autoEvaluate?: boolean;
}

const RealTimeEvaluation: React.FC<RealTimeEvaluationProps> = ({ 
  gameState, 
  autoEvaluate = false 
}) => {
  const [currentEval, setCurrentEval] = useState(0);
  const [previousEval, setPreviousEval] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (autoEvaluate && gameState.moves.length > 0) {
      const analysis = realChessEngine.analyzePosition(gameState);
      setPreviousEval(currentEval);
      setCurrentEval(analysis.evaluation);
      
      // Determine trend
      const diff = analysis.evaluation - currentEval;
      if (Math.abs(diff) < 0.2) {
        setTrend('stable');
      } else if (diff > 0) {
        setTrend('up');
      } else {
        setTrend('down');
      }
    }
  }, [gameState.moves.length, autoEvaluate, currentEval]);

  const getEvaluationDisplay = () => {
    const abs = Math.abs(currentEval);
    if (abs < 0.1) return '0.00';
    return `${currentEval > 0 ? '+' : ''}${currentEval.toFixed(2)}`;
  };

  const getEvaluationColor = () => {
    if (Math.abs(currentEval) < 0.5) return 'text-gray-700';
    if (currentEval > 0) return 'text-green-600';
    return 'text-gray-800';
  };

  const getTrendIcon = () => {
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
    
    if (abs < 0.3) return 'Equal';
    if (abs < 1.0) return `${player} slightly better`;
    if (abs < 2.0) return `${player} better`;
    if (abs < 4.0) return `${player} much better`;
    return `${player} winning`;
  };

  if (!autoEvaluate) {
    return null;
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className="text-sm text-gray-600">Live Eval</span>
          </div>
          <div className={`font-mono text-xl font-bold ${getEvaluationColor()}`}>
            {getEvaluationDisplay()}
          </div>
        </div>
        
        <Badge variant="outline" className="text-xs">
          {getAdvantageText()}
        </Badge>
      </div>
      
      {gameState.moves.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Move {Math.ceil(gameState.moves.length / 2)} • {gameState.currentPlayer} to move
        </div>
      )}
    </Card>
  );
};

export default RealTimeEvaluation;
