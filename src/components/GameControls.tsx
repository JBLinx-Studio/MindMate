
import React from 'react';
import { RotateCcw, Play, Flag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GameState } from '../types/chess';

interface GameControlsProps {
  gameState: GameState;
  onNewGame: () => void;
  onResign: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ gameState, onNewGame, onResign }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Game Controls</h3>
        <div className="text-sm text-gray-600 mb-4">
          Current Turn: <span className="font-medium capitalize">{gameState.currentPlayer}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Button 
          onClick={onNewGame}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <Play className="w-4 h-4 mr-2" />
          New Game
        </Button>
        
        <Button 
          onClick={onResign}
          variant="destructive"
          className="w-full"
          size="lg"
          disabled={gameState.moves.length === 0}
        >
          <Flag className="w-4 h-4 mr-2" />
          Resign
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="text-sm text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Moves:</span>
            <span className="font-medium">{gameState.moves.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-medium text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
