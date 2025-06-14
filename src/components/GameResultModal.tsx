
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Handshake, Clock, Flag, Star, Award, Target, Zap } from 'lucide-react';
import { GameState } from '../types/chess';

interface GameResultModalProps {
  gameState: GameState;
  onNewGame: () => void;
  onClose: () => void;
}

const GameResultModal: React.FC<GameResultModalProps> = ({ gameState, onNewGame, onClose }) => {
  if (!gameState.isGameOver) return null;

  const getResultIcon = () => {
    if (gameState.gameResult?.type) {
      switch (gameState.gameResult.type) {
        case 'checkmate':
          return <Crown className="w-12 h-12 text-yellow-500" />;
        case 'resignation':
          return <Flag className="w-12 h-12 text-red-500" />;
        case 'timeout':
          return <Clock className="w-12 h-12 text-orange-500" />;
        case 'stalemate':
        case 'draw':
          return <Handshake className="w-12 h-12 text-gray-500" />;
        default:
          return <Trophy className="w-12 h-12 text-blue-500" />;
      }
    }
    
    if (gameState.winner === 'draw') {
      return <Handshake className="w-12 h-12 text-gray-500" />;
    }
    return <Crown className="w-12 h-12 text-yellow-500" />;
  };

  const getResultTitle = () => {
    if (gameState.winner === 'draw') {
      return 'Game Drawn';
    }
    return `${gameState.winner === 'white' ? 'White' : 'Black'} Wins!`;
  };

  const getResultSubtitle = () => {
    if (gameState.gameResult?.type) {
      switch (gameState.gameResult.type) {
        case 'checkmate':
          return 'by Checkmate';
        case 'resignation':
          return 'by Resignation';
        case 'timeout':
          return 'on Time';
        case 'stalemate':
          return 'by Stalemate';
        default:
          return gameState.gameResult.reason || '';
      }
    }
    
    if (gameState.winner === 'draw') {
      return 'by Stalemate';
    }
    return 'Game Over';
  };

  const getPerformanceRating = () => {
    const moveCount = gameState.moves.length;
    if (moveCount < 20) return { text: 'Quick Game', color: 'text-blue-600' };
    if (moveCount < 40) return { text: 'Standard Game', color: 'text-green-600' };
    return { text: 'Epic Battle', color: 'text-purple-600' };
  };

  const performance = getPerformanceRating();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-white shadow-2xl border-0 rounded-2xl overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 text-center border-b">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/80 rounded-full shadow-lg">
              {getResultIcon()}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {getResultTitle()}
          </h2>
          <p className="text-lg text-gray-600">
            {getResultSubtitle()}
          </p>
        </div>

        {/* Game Statistics */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">{gameState.moves.length}</div>
              <div className="text-sm text-gray-600">Moves</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">{Math.floor(gameState.moves.length / 2)}</div>
              <div className="text-sm text-gray-600">Turns</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className={`text-lg font-bold ${performance.color}`}>{performance.text}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>

          {/* Game Quality Assessment */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Award className="w-5 h-5 text-green-600" />
              <span className="text-lg font-semibold text-gray-800">Game Analysis</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-green-600">94%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Performance</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4 p-3 bg-white/60 rounded-lg">
              <div className="text-sm text-gray-700">
                <strong>Well played!</strong> Both players showed excellent strategic thinking.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onNewGame}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              Play Again
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="font-medium py-3 rounded-xl border-2 hover:bg-gray-50"
                size="lg"
              >
                <Target className="w-4 h-4 mr-2" />
                Analyze
              </Button>
              
              <Button
                variant="outline"
                className="font-medium py-3 rounded-xl border-2 hover:bg-gray-50"
                size="lg"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameResultModal;
