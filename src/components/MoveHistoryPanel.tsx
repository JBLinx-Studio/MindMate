
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, RotateCcw, SkipForward, Play, Pause } from 'lucide-react';
import { GameState } from '../types/chess';

interface MoveHistoryPanelProps {
  gameState: GameState;
}

const MoveHistoryPanel: React.FC<MoveHistoryPanelProps> = ({ gameState }) => {
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);

  const formatMove = (move: any, index: number) => {
    const moveNumber = Math.floor(index / 2) + 1;
    const isWhiteMove = index % 2 === 0;
    const notation = `${move.piece.type}${move.to.x}${move.to.y}${move.captured ? 'x' : ''}`;
    
    return {
      moveNumber,
      isWhiteMove,
      notation,
      time: '0:15', // Mock time
      evaluation: (Math.random() - 0.5) * 2, // Mock evaluation
    };
  };

  const startReplay = () => {
    setIsReplaying(!isReplaying);
    // Implementation for move replay would go here
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-600" />
            Move History
          </h3>
          <div className="flex space-x-2">
            <Button
              onClick={startReplay}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              {isReplaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isReplaying ? 'Pause' : 'Replay'}</span>
            </Button>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <SkipForward className="w-4 h-4 mr-1" />
              To End
            </Button>
          </div>
        </div>
      </Card>

      {/* Move List */}
      <Card className="p-6">
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {gameState.moves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No moves played yet</p>
              <p className="text-sm">Start playing to see move history</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-6 gap-2 pb-2 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <div className="text-center">#</div>
                <div className="text-center">White</div>
                <div className="text-center">Time</div>
                <div className="text-center">Black</div>
                <div className="text-center">Time</div>
                <div className="text-center">Eval</div>
              </div>

              {/* Moves */}
              {Array.from({ length: Math.ceil(gameState.moves.length / 2) }).map((_, pairIndex) => {
                const whiteMove = gameState.moves[pairIndex * 2];
                const blackMove = gameState.moves[pairIndex * 2 + 1];
                const whiteFormatted = whiteMove ? formatMove(whiteMove, pairIndex * 2) : null;
                const blackFormatted = blackMove ? formatMove(blackMove, pairIndex * 2 + 1) : null;

                return (
                  <div key={pairIndex} className="grid grid-cols-6 gap-2 py-2 hover:bg-gray-50 rounded text-sm">
                    <div className="text-center font-medium text-gray-700">
                      {pairIndex + 1}
                    </div>
                    
                    {/* White Move */}
                    <div 
                      className={`text-center cursor-pointer hover:bg-blue-100 rounded px-1 py-1 ${
                        selectedMoveIndex === pairIndex * 2 ? 'bg-blue-200 font-semibold' : ''
                      }`}
                      onClick={() => setSelectedMoveIndex(pairIndex * 2)}
                    >
                      {whiteFormatted?.notation || '-'}
                    </div>
                    <div className="text-center text-xs text-gray-500">
                      {whiteFormatted?.time || '-'}
                    </div>
                    
                    {/* Black Move */}
                    <div 
                      className={`text-center cursor-pointer hover:bg-blue-100 rounded px-1 py-1 ${
                        selectedMoveIndex === pairIndex * 2 + 1 ? 'bg-blue-200 font-semibold' : ''
                      }`}
                      onClick={() => setSelectedMoveIndex(blackMove ? pairIndex * 2 + 1 : null)}
                    >
                      {blackFormatted?.notation || '-'}
                    </div>
                    <div className="text-center text-xs text-gray-500">
                      {blackFormatted?.time || '-'}
                    </div>
                    
                    {/* Evaluation */}
                    <div className="text-center text-xs">
                      <span className={`font-medium ${
                        blackFormatted?.evaluation > 0 ? 'text-green-600' : 
                        blackFormatted?.evaluation < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {blackFormatted?.evaluation ? 
                          (blackFormatted.evaluation > 0 ? '+' : '') + blackFormatted.evaluation.toFixed(1) : 
                          '0.0'
                        }
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Move Analysis */}
      {selectedMoveIndex !== null && (
        <Card className="p-6">
          <h4 className="font-semibold mb-3">Move Analysis</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Move Quality:</span>
              <span className="font-semibold text-green-600">Good</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Spent:</span>
              <span className="font-semibold">15.3 seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Position Change:</span>
              <span className="font-semibold text-blue-600">+0.3</span>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Engine Analysis:</div>
              <div className="bg-gray-50 p-3 rounded text-sm">
                This move develops the knight to a strong central square, controlling important squares and preparing for kingside castling.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MoveHistoryPanel;
