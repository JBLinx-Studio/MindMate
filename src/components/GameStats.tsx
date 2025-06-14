
import React from 'react';
import { Clock, Target, Zap, Award } from 'lucide-react';
import { GameState } from '../types/chess';

interface GameStatsProps {
  gameState: GameState;
}

const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const calculateStats = () => {
    const totalMoves = gameState.moves.length;
    const captures = gameState.moves.filter(move => move.captured).length;
    const avgMoveTime = totalMoves > 0 ? 15 : 0; // Mock calculation
    const gameTime = Math.floor(totalMoves * 15 / 60); // Mock calculation in minutes
    
    return {
      totalMoves,
      captures,
      avgMoveTime,
      gameTime
    };
  };

  const stats = calculateStats();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Award className="w-5 h-5 mr-2 text-amber-600" />
        Game Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.totalMoves}</div>
          <div className="text-sm text-gray-600">Total Moves</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.captures}</div>
          <div className="text-sm text-gray-600">Captures</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.avgMoveTime}s</div>
          <div className="text-sm text-gray-600">Avg. Move</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.gameTime}m</div>
          <div className="text-sm text-gray-600">Game Time</div>
        </div>
      </div>
      
      {/* Game progress bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Opening</span>
          <span>Middlegame</span>
          <span>Endgame</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((stats.totalMoves / 40) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameStats;
