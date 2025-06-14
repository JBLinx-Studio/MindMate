
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Handshake, Clock, Flag, Star } from 'lucide-react';
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
          return <Crown className="w-8 h-8 text-yellow-500" />;
        case 'resignation':
          return <Flag className="w-8 h-8 text-red-500" />;
        case 'timeout':
          return <Clock className="w-8 h-8 text-orange-500" />;
        case 'stalemate':
        case 'draw':
          return <Handshake className="w-8 h-8 text-gray-500" />;
        default:
          return <Trophy className="w-8 h-8 text-blue-500" />;
      }
    }
    
    // Fallback for cases without gameResult
    if (gameState.winner === 'draw') {
      return <Handshake className="w-8 h-8 text-gray-500" />;
    }
    return <Crown className="w-8 h-8 text-yellow-500" />;
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
    
    // Fallback
    if (gameState.winner === 'draw') {
      return 'by Stalemate';
    }
    return 'Game Over';
  };

  const getPerformanceRating = () => {
    const moveCount = gameState.moves.length;
    if (moveCount < 20) return 'Quick Game';
    if (moveCount < 40) return 'Standard Game';
    return 'Long Game';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-white shadow-2xl">
        <div className="space-y-6">
          <div className="flex justify-center">
            {getResultIcon()}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">
              {getResultTitle()}
            </h2>
            <p className="text-lg text-gray-600">
              {getResultSubtitle()}
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {gameState.moves.length} moves
            </Badge>
            <Badge variant="outline" className="text-sm">
              {Math.floor(gameState.moves.length / 2)} turns
            </Badge>
            <Badge variant="outline" className="text-sm">
              {getPerformanceRating()}
            </Badge>
          </div>

          {/* Game Quality Rating */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Game Quality</span>
            </div>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Great game! Well played by both sides.
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              onClick={onNewGame}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
              size="lg"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Review Game
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameResultModal;
