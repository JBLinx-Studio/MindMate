
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { GameState, Move } from '../types/chess';

interface ProfessionalMoveHistoryProps {
  gameState: GameState;
  onNavigateToMove?: (moveIndex: number) => void;
  showEvaluations?: boolean;
}

const ProfessionalMoveHistory: React.FC<ProfessionalMoveHistoryProps> = ({ 
  gameState, 
  onNavigateToMove,
  showEvaluations = false 
}) => {
  const getMoveQualityColor = (evaluation?: number) => {
    if (!evaluation) return '';
    const abs = Math.abs(evaluation);
    if (abs < 0.1) return 'text-green-600';
    if (abs < 0.3) return 'text-yellow-600';
    if (abs < 0.6) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMoveQualitySymbol = (evaluation?: number) => {
    if (!evaluation) return '';
    const abs = Math.abs(evaluation);
    if (abs < 0.1) return '!';
    if (abs < 0.3) return '!?';
    if (abs < 0.6) return '?';
    return '??';
  };

  const formatMoveNumber = (index: number) => {
    return Math.floor(index / 2) + 1;
  };

  const isWhiteMove = (index: number) => {
    return index % 2 === 0;
  };

  const groupMovesByPair = () => {
    const pairs = [];
    for (let i = 0; i < gameState.moves.length; i += 2) {
      const whiteMove = gameState.moves[i];
      const blackMove = gameState.moves[i + 1];
      pairs.push({
        moveNumber: formatMoveNumber(i),
        whiteMove,
        blackMove,
        whiteIndex: i,
        blackIndex: i + 1
      });
    }
    return pairs;
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <History className="w-5 h-5 mr-2 text-blue-600" />
            Game Moves
          </h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {gameState.moves.length} moves
            </Badge>
            {gameState.moves.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateToMove?.(0)}
                className="h-7 w-7 p-0"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {gameState.moves.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No moves played yet</p>
            <p className="text-xs text-gray-400 mt-1">Move history will appear here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {groupMovesByPair().map((pair) => (
              <div key={pair.moveNumber} className="flex items-center space-x-2 py-1">
                {/* Move number */}
                <div className="w-8 text-xs font-medium text-gray-500 text-right">
                  {pair.moveNumber}.
                </div>
                
                {/* White move */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateToMove?.(pair.whiteIndex)}
                  className="h-auto py-1 px-2 font-mono text-sm justify-start min-w-0 flex-1"
                >
                  <span className="truncate">
                    {pair.whiteMove.notation}
                    {showEvaluations && (
                      <span className={getMoveQualityColor(pair.whiteMove.evaluation)}>
                        {getMoveQualitySymbol(pair.whiteMove.evaluation)}
                      </span>
                    )}
                  </span>
                </Button>
                
                {/* Black move */}
                {pair.blackMove ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigateToMove?.(pair.blackIndex)}
                    className="h-auto py-1 px-2 font-mono text-sm justify-start min-w-0 flex-1"
                  >
                    <span className="truncate">
                      {pair.blackMove.notation}
                      {showEvaluations && (
                        <span className={getMoveQualityColor(pair.blackMove.evaluation)}>
                          {getMoveQualitySymbol(pair.blackMove.evaluation)}
                        </span>
                      )}
                    </span>
                  </Button>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Navigation controls */}
      {gameState.moves.length > 0 && (
        <div className="p-3 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToMove?.(0)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
                <ChevronLeft className="w-4 h-4 -ml-2" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToMove?.(Math.max(0, gameState.moves.length - 2))}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-xs text-gray-500">
              Move {gameState.moves.length}
            </div>
            
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToMove?.(gameState.moves.length)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToMove?.(gameState.moves.length)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
                <ChevronRight className="w-4 h-4 -ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfessionalMoveHistory;
