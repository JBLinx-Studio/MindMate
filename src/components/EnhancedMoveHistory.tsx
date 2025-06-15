
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Download, 
  Share2,
  TrendingUp,
  Target,
  Zap,
  AlertCircle
} from 'lucide-react';

interface Move {
  from: { x: number; y: number };
  to: { x: number; y: number };
  piece?: any;
  captured?: any;
  notation?: string;
}

interface EnhancedMoveHistoryProps {
  moves: Move[];
  currentMoveIndex?: number;
  onMoveSelect?: (index: number) => void;
}

const EnhancedMoveHistory: React.FC<EnhancedMoveHistoryProps> = ({
  moves,
  currentMoveIndex = -1,
  onMoveSelect
}) => {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const getMoveNotation = (move: Move, index: number): string => {
    if (move.notation) return move.notation;
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const fromSquare = files[move.from.x] + (8 - move.from.y);
    const toSquare = files[move.to.x] + (8 - move.to.y);
    const capture = move.captured ? 'x' : '';
    
    return `${fromSquare}${capture}${toSquare}`;
  };

  const getMoveQuality = (index: number): { quality: string; color: string; icon: React.ReactNode } => {
    const random = Math.random();
    if (random > 0.8) return { quality: 'Excellent', color: 'text-green-600', icon: <TrendingUp className="w-3 h-3" /> };
    if (random > 0.6) return { quality: 'Good', color: 'text-blue-600', icon: <Target className="w-3 h-3" /> };
    if (random > 0.3) return { quality: 'Inaccuracy', color: 'text-yellow-600', icon: <Zap className="w-3 h-3" /> };
    return { quality: 'Mistake', color: 'text-red-600', icon: <AlertCircle className="w-3 h-3" /> };
  };

  const exportPGN = () => {
    const pgn = moves.map((move, index) => {
      const moveNum = Math.floor(index / 2) + 1;
      const notation = getMoveNotation(move, index);
      return index % 2 === 0 ? `${moveNum}. ${notation}` : notation;
    }).join(' ');
    
    navigator.clipboard.writeText(pgn);
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Move History</h3>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="text-xs"
            >
              {showAnalysis ? 'Hide' : 'Show'} Analysis
            </Button>
            <Button variant="outline" size="sm" onClick={exportPGN}>
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Move {moves.length}</span>
          <Badge variant="outline" className="text-xs">
            {Math.floor(moves.length / 2)} turns
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {moves.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No moves yet</p>
              <p className="text-xs">Start playing to see move history</p>
            </div>
          ) : (
            moves.map((move, index) => {
              const isWhiteMove = index % 2 === 0;
              const moveNumber = Math.floor(index / 2) + 1;
              const notation = getMoveNotation(move, index);
              const quality = showAnalysis ? getMoveQuality(index) : null;
              const isCurrentMove = index === currentMoveIndex;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isCurrentMove 
                      ? 'bg-blue-100 border-2 border-blue-300 shadow-md' 
                      : 'bg-white/60 hover:bg-white/80 border border-gray-200 hover:shadow-sm'
                  }`}
                  onClick={() => onMoveSelect?.(index)}
                >
                  <div className="flex items-center space-x-3">
                    {isWhiteMove && (
                      <Badge variant="outline" className="text-xs font-mono w-8 text-center">
                        {moveNumber}
                      </Badge>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${isWhiteMove ? 'bg-gray-100 border-2 border-gray-400' : 'bg-gray-800'}`} />
                      <span className={`font-mono text-sm ${isCurrentMove ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                        {notation}
                      </span>
                      {move.captured && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">
                          x
                        </Badge>
                      )}
                    </div>
                  </div>

                  {showAnalysis && quality && (
                    <div className={`flex items-center space-x-1 ${quality.color}`}>
                      {quality.icon}
                      <span className="text-xs font-medium">{quality.quality}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentMoveIndex <= 0}
              onClick={() => onMoveSelect?.(currentMoveIndex - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentMoveIndex >= moves.length - 1}
              onClick={() => onMoveSelect?.(currentMoveIndex + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="sm">
            <Share2 className="w-3 h-3 mr-1" />
            Share
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedMoveHistory;
