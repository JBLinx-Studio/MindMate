
import React from 'react';
import { GameState } from '../types/chess';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Crown, AlertTriangle, Clock, Zap, Target, Trophy } from 'lucide-react';

interface EnhancedGameStatusProps {
  gameState: GameState;
  gameTime?: { white: number; black: number };
}

const EnhancedGameStatus: React.FC<EnhancedGameStatusProps> = ({ 
  gameState, 
  gameTime 
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentPlayerStatus = () => {
    if (gameState.isGameOver) {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
          <Trophy className="w-3 h-3 mr-1" />
          Game Over
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <Zap className="w-3 h-3 mr-1" />
        {gameState.currentPlayer === 'white' ? 'White' : 'Black'} to Move
      </Badge>
    );
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-xl">
      <div className="space-y-4">
        {/* Game Status Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-bold text-slate-800">Game Status</h3>
          </div>
          {getCurrentPlayerStatus()}
        </div>

        {/* Player Clocks */}
        {gameTime && (
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              gameState.currentPlayer === 'white' 
                ? 'border-green-400 bg-green-50 shadow-lg scale-105' 
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-slate-600 mb-1">White</div>
                <div className={`text-2xl font-mono font-bold ${
                  gameState.currentPlayer === 'white' ? 'text-green-600' : 'text-slate-700'
                }`}>
                  {formatTime(gameTime.white)}
                </div>
                {gameState.currentPlayer === 'white' && (
                  <div className="text-xs text-green-600 font-medium mt-1 animate-pulse">
                    <Clock className="w-3 h-3 inline mr-1" />
                    THINKING
                  </div>
                )}
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              gameState.currentPlayer === 'black' 
                ? 'border-green-400 bg-green-50 shadow-lg scale-105' 
                : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="text-center">
                <div className="text-sm font-medium text-slate-600 mb-1">Black</div>
                <div className={`text-2xl font-mono font-bold ${
                  gameState.currentPlayer === 'black' ? 'text-green-600' : 'text-slate-700'
                }`}>
                  {formatTime(gameTime.black)}
                </div>
                {gameState.currentPlayer === 'black' && (
                  <div className="text-xs text-green-600 font-medium mt-1 animate-pulse">
                    <Clock className="w-3 h-3 inline mr-1" />
                    THINKING
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Game Stats */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {Math.ceil(gameState.moves.length / 2)}
              </div>
              <div className="text-xs text-slate-600">Moves</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">
                {gameState.moves.filter(m => m.captured).length}
              </div>
              <div className="text-xs text-slate-600">Captures</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">
                {gameState.moves.length > 0 ? '15m' : '0m'}
              </div>
              <div className="text-xs text-slate-600">Duration</div>
            </div>
          </div>
        </div>

        {/* Game Result */}
        {gameState.isGameOver && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center border border-purple-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">
                {gameState.winner ? `${gameState.winner.charAt(0).toUpperCase() + gameState.winner.slice(1)} Wins!` : 'Draw'}
              </span>
            </div>
            <div className="text-sm text-purple-600">
              {gameState.gameResult?.reason || 'Game completed'}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedGameStatus;
