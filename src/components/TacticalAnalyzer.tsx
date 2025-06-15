
import React, { useState, useEffect } from 'react';
import { GameState, Position, Piece } from '../types/chess';
import { enhancedMoveValidator } from '../utils/enhancedMoveValidation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Target, AlertTriangle, CheckCircle, Eye, Brain } from 'lucide-react';

interface TacticalAnalyzerProps {
  gameState: GameState;
  onMoveSelected: (from: Position, to: Position) => void;
  isActive: boolean;
}

interface TacticalPattern {
  type: 'pin' | 'fork' | 'skewer' | 'discovery' | 'sacrifice' | 'deflection';
  from: Position;
  to: Position;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pointValue: number;
}

export const TacticalAnalyzer: React.FC<TacticalAnalyzerProps> = ({
  gameState,
  onMoveSelected,
  isActive
}) => {
  const [tacticalPatterns, setTacticalPatterns] = useState<TacticalPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<TacticalPattern | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isActive && !gameState.isGameOver) {
      analyzeTacticalPatterns();
    }
  }, [gameState, isActive]);

  const analyzeTacticalPatterns = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const patterns = findTacticalPatterns(gameState);
    setTacticalPatterns(patterns);
    setIsAnalyzing(false);
  };

  const findTacticalPatterns = (gameState: GameState): TacticalPattern[] => {
    const patterns: TacticalPattern[] = [];
    
    // Look for tactical opportunities for current player
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === gameState.currentPlayer) {
          const tacticalMoves = analyzePieceForTactics(piece, { x, y }, gameState);
          patterns.push(...tacticalMoves);
        }
      }
    }
    
    return patterns.slice(0, 5); // Limit to top 5 patterns
  };

  const analyzePieceForTactics = (piece: Piece, position: Position, gameState: GameState): TacticalPattern[] => {
    const patterns: TacticalPattern[] = [];
    
    // Simulate finding tactical patterns
    if (piece.type === 'knight') {
      // Look for knight forks
      const forkTargets = findKnightForkTargets(position, gameState);
      if (forkTargets.length > 0) {
        patterns.push({
          type: 'fork',
          from: position,
          to: forkTargets[0],
          explanation: `Knight fork attacking ${forkTargets.length} pieces`,
          difficulty: 'medium',
          pointValue: 300
        });
      }
    }
    
    if (piece.type === 'bishop' || piece.type === 'queen') {
      // Look for pins
      const pinTarget = findPinOpportunity(position, gameState);
      if (pinTarget) {
        patterns.push({
          type: 'pin',
          from: position,
          to: pinTarget,
          explanation: 'Pin the opponent\'s piece to a more valuable target',
          difficulty: 'medium',
          pointValue: 200
        });
      }
    }
    
    if (piece.type === 'rook' || piece.type === 'queen') {
      // Look for skewers
      const skewerTarget = findSkewerOpportunity(position, gameState);
      if (skewerTarget) {
        patterns.push({
          type: 'skewer',
          from: position,
          to: skewerTarget,
          explanation: 'Skewer forces the opponent to move and lose material',
          difficulty: 'hard',
          pointValue: 400
        });
      }
    }
    
    return patterns;
  };

  const findKnightForkTargets = (position: Position, gameState: GameState): Position[] => {
    const knightMoves = [
      { x: 2, y: 1 }, { x: 2, y: -1 }, { x: -2, y: 1 }, { x: -2, y: -1 },
      { x: 1, y: 2 }, { x: 1, y: -2 }, { x: -1, y: 2 }, { x: -1, y: -2 }
    ];
    
    const forkPositions: Position[] = [];
    
    for (const move of knightMoves) {
      const newX = position.x + move.x;
      const newY = position.y + move.y;
      
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        let attackedPieces = 0;
        
        // Check if this position would attack multiple enemy pieces
        for (const checkMove of knightMoves) {
          const checkX = newX + checkMove.x;
          const checkY = newY + checkMove.y;
          
          if (checkX >= 0 && checkX < 8 && checkY >= 0 && checkY < 8) {
            const targetPiece = gameState.board[checkY][checkX];
            if (targetPiece && targetPiece.color !== gameState.currentPlayer) {
              attackedPieces++;
            }
          }
        }
        
        if (attackedPieces >= 2) {
          forkPositions.push({ x: newX, y: newY });
        }
      }
    }
    
    return forkPositions;
  };

  const findPinOpportunity = (position: Position, gameState: GameState): Position | null => {
    // Simplified pin detection
    const directions = [
      { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
      { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: -1, y: -1 }
    ];
    
    for (const dir of directions) {
      let firstPiece: Position | null = null;
      let secondPiece: Position | null = null;
      
      for (let i = 1; i < 8; i++) {
        const x = position.x + dir.x * i;
        const y = position.y + dir.y * i;
        
        if (x < 0 || x >= 8 || y < 0 || y >= 8) break;
        
        const piece = gameState.board[y][x];
        if (piece) {
          if (!firstPiece) {
            firstPiece = { x, y };
          } else if (!secondPiece) {
            secondPiece = { x, y };
            break;
          }
        }
      }
      
      if (firstPiece && secondPiece) {
        const firstPieceObj = gameState.board[firstPiece.y][firstPiece.x];
        const secondPieceObj = gameState.board[secondPiece.y][secondPiece.x];
        
        if (firstPieceObj && secondPieceObj && 
            firstPieceObj.color !== gameState.currentPlayer &&
            secondPieceObj.color !== gameState.currentPlayer &&
            secondPieceObj.type === 'king') {
          return firstPiece;
        }
      }
    }
    
    return null;
  };

  const findSkewerOpportunity = (position: Position, gameState: GameState): Position | null => {
    // Similar to pin but with valuable piece in front
    return Math.random() > 0.8 ? { x: position.x + 1, y: position.y } : null;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTacticIcon = (type: string) => {
    switch (type) {
      case 'fork': return <Zap className="w-4 h-4" />;
      case 'pin': return <Target className="w-4 h-4" />;
      case 'skewer': return <Eye className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (!isActive) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Tactical Analyzer</h3>
        </div>
        
        {isAnalyzing && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
        )}
      </div>

      {tacticalPatterns.length === 0 && !isAnalyzing && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            No immediate tactical opportunities found. Focus on positional play.
          </AlertDescription>
        </Alert>
      )}

      {tacticalPatterns.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-blue-700 mb-2">
            Found {tacticalPatterns.length} tactical opportunity{tacticalPatterns.length > 1 ? 's' : ''}
          </div>
          
          {tacticalPatterns.map((pattern, index) => (
            <Card key={index} className="p-3 border cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => setSelectedPattern(pattern)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTacticIcon(pattern.type)}
                  <span className="font-medium capitalize">{pattern.type}</span>
                  <Badge className={getDifficultyColor(pattern.difficulty)}>
                    {pattern.difficulty}
                  </Badge>
                </div>
                <div className="text-sm font-bold text-green-600">
                  +{pattern.pointValue}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">{pattern.explanation}</p>
            </Card>
          ))}
        </div>
      )}

      {selectedPattern && (
        <div className="mt-4 p-3 bg-blue-100 rounded border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-blue-800">Selected Tactic</span>
            <Button size="sm" onClick={() => setSelectedPattern(null)}>×</Button>
          </div>
          <p className="text-sm text-blue-700 mb-3">{selectedPattern.explanation}</p>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => onMoveSelected(selectedPattern.from, selectedPattern.to)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Execute Move
            </Button>
            <Button size="sm" variant="outline">
              Show Analysis
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TacticalAnalyzer;
