
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Target, Zap, Clock, Crown } from 'lucide-react';
import { GameState } from '../types/chess';

interface GameStatsPanelProps {
  gameState: GameState;
}

const GameStatsPanel: React.FC<GameStatsPanelProps> = ({ gameState }) => {
  const calculateAdvancedStats = () => {
    const totalMoves = gameState.moves.length;
    const whiteMoves = gameState.moves.filter((_, index) => index % 2 === 0).length;
    const blackMoves = gameState.moves.filter((_, index) => index % 2 === 1).length;
    const captures = gameState.moves.filter(move => move.captured).length;
    const whiteCaptures = gameState.moves.filter((move, index) => move.captured && index % 2 === 0).length;
    const blackCaptures = captures - whiteCaptures;
    
    // Mock advanced calculations
    const materialAdvantage = whiteCaptures * 3 - blackCaptures * 3;
    const positionAdvantage = Math.sin(totalMoves * 0.1) * 2; // Mock position evaluation
    const gamePhase = totalMoves < 20 ? 'Opening' : totalMoves < 40 ? 'Middlegame' : 'Endgame';
    const gameProgress = Math.min((totalMoves / 80) * 100, 100);
    
    return {
      totalMoves,
      whiteMoves,
      blackMoves,
      captures,
      whiteCaptures,
      blackCaptures,
      materialAdvantage,
      positionAdvantage,
      gamePhase,
      gameProgress,
      avgMoveTime: 15.3,
      gameTime: Math.floor(totalMoves * 15 / 60),
      accuracy: { white: 92, black: 88 },
      blunders: { white: 0, black: 1 },
      brilliantMoves: { white: 2, black: 1 }
    };
  };

  const stats = calculateAdvancedStats();

  return (
    <div className="space-y-6">
      {/* Game Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-800">{stats.gameTime}m</div>
              <div className="text-sm text-blue-600">Game Duration</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-800">{stats.totalMoves}</div>
              <div className="text-sm text-green-600">Total Moves</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-800">{stats.captures}</div>
              <div className="text-sm text-purple-600">Captures</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Game Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Game Progress
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Current Phase: <strong>{stats.gamePhase}</strong></span>
              <span>{Math.round(stats.gameProgress)}% Complete</span>
            </div>
            <Progress value={stats.gameProgress} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Opening</span>
              <span>Middlegame</span>
              <span>Endgame</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Player Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">White Player</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accuracy</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${stats.accuracy.white}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{stats.accuracy.white}%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Moves Played</span>
              <span className="font-semibold">{stats.whiteMoves}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Captures</span>
              <span className="font-semibold">{stats.whiteCaptures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Brilliant Moves</span>
              <span className="font-semibold text-yellow-600 flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                {stats.brilliantMoves.white}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Blunders</span>
              <span className="font-semibold text-red-600">{stats.blunders.white}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Black Player</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Accuracy</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${stats.accuracy.black}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{stats.accuracy.black}%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Moves Played</span>
              <span className="font-semibold">{stats.blackMoves}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Captures</span>
              <span className="font-semibold">{stats.blackCaptures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Brilliant Moves</span>
              <span className="font-semibold text-yellow-600 flex items-center">
                <Crown className="w-4 h-4 mr-1" />
                {stats.brilliantMoves.black}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Blunders</span>
              <span className="font-semibold text-red-600">{stats.blunders.black}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Position Evaluation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Position Evaluation
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Material Balance</span>
            <span className={`font-bold ${stats.materialAdvantage > 0 ? 'text-green-600' : stats.materialAdvantage < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {stats.materialAdvantage > 0 ? '+' : ''}{stats.materialAdvantage.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Position Score</span>
            <span className={`font-bold ${stats.positionAdvantage > 0 ? 'text-green-600' : stats.positionAdvantage < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              {stats.positionAdvantage > 0 ? '+' : ''}{stats.positionAdvantage.toFixed(2)}
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-gray-300 to-green-500 transition-all duration-500"
              style={{ 
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${45 + stats.positionAdvantage * 5}%, #22c55e ${55 + stats.positionAdvantage * 5}%, #22c55e 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Black Advantage</span>
            <span>Equal</span>
            <span>White Advantage</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameStatsPanel;
