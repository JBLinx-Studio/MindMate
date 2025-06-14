
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Clock, Target, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { GameState } from '../types/chess';

interface EnhancedGameStatusProps {
  gameState: GameState;
}

const EnhancedGameStatus: React.FC<EnhancedGameStatusProps> = ({ gameState }) => {
  const gameStats = {
    moveNumber: Math.floor(gameState.moves.length / 2) + 1,
    captures: gameState.moves.filter(m => m.captured).length,
    checks: 2, // Mock data
    timeElapsed: '12:34',
    evaluation: 0.3,
    materialBalance: { white: 39, black: 36 },
    phase: gameState.moves.length < 20 ? 'Opening' : gameState.moves.length < 40 ? 'Middlegame' : 'Endgame'
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Opening': return 'bg-green-500';
      case 'Middlegame': return 'bg-yellow-500';
      case 'Endgame': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEvaluationBar = (evaluation: number) => {
    const percentage = Math.min(Math.max((evaluation + 2) * 25, 0), 100);
    return percentage;
  };

  return (
    <div className="space-y-4">
      {/* Game Phase & Status */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-gray-800">Game Status</h3>
          </div>
          <Badge className={`${getPhaseColor(gameStats.phase)} text-white`}>
            {gameStats.phase}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{gameStats.moveNumber}</div>
            <div className="text-xs text-gray-600">Move Number</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{gameStats.timeElapsed}</div>
            <div className="text-xs text-gray-600">Game Time</div>
          </div>
        </div>

        {/* Current Turn Indicator */}
        <div className="text-center p-3 rounded-lg bg-white/50">
          <div className={`text-lg font-bold ${
            gameState.currentPlayer === 'white' ? 'text-blue-600' : 'text-red-600'
          }`}>
            {gameState.currentPlayer === 'white' ? "White to Move" : "Black to Move"}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {gameState.isGameOver ? (
              <span className="flex items-center justify-center space-x-1 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Game Over</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Game in Progress</span>
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Position Evaluation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-600" />
            Position Evaluation
          </h4>
          <span className={`font-bold ${
            gameStats.evaluation > 0 ? 'text-green-600' : 
            gameStats.evaluation < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {gameStats.evaluation > 0 ? '+' : ''}{gameStats.evaluation.toFixed(1)}
          </span>
        </div>
        
        <div className="space-y-2">
          <Progress value={getEvaluationBar(gameStats.evaluation)} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Black Advantage</span>
            <span>Equal</span>
            <span>White Advantage</span>
          </div>
        </div>
      </Card>

      {/* Material Count */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-orange-600" />
          Material Balance
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">White:</span>
            <span className="font-bold">{gameStats.materialBalance.white}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Black:</span>
            <span className="font-bold">{gameStats.materialBalance.black}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Difference:</span>
              <span className={`font-bold ${
                gameStats.materialBalance.white > gameStats.materialBalance.black ? 'text-green-600' : 
                gameStats.materialBalance.white < gameStats.materialBalance.black ? 'text-red-600' : 'text-gray-600'
              }`}>
                {Math.abs(gameStats.materialBalance.white - gameStats.materialBalance.black)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Game Statistics */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Moves:</span>
            <span className="font-medium">{gameState.moves.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Captures:</span>
            <span className="font-medium">{gameStats.captures}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Checks:</span>
            <span className="font-medium">{gameStats.checks}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Move:</span>
            <span className="font-medium">
              {gameState.moves.length > 0 ? gameState.moves[gameState.moves.length - 1].notation : 'None'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedGameStatus;
