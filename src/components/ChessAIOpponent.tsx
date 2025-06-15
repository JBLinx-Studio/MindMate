
import React, { useEffect, useState } from 'react';
import { GameState, Position, Piece } from '../types/chess';
import { enhancedChessEngine } from '../utils/enhancedChessEngine';
import { getValidMoves, makeMove } from '../utils/chessLogic';
import { toast } from 'sonner';
import { Brain, Zap, Target, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ChessAIOpponentProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
  aiColor: 'white' | 'black';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  isEnabled: boolean;
}

export const ChessAIOpponent: React.FC<ChessAIOpponentProps> = ({
  gameState,
  onGameStateChange,
  aiColor,
  difficulty,
  isEnabled
}) => {
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingTime, setThinkingTime] = useState(0);
  const [lastEvaluation, setLastEvaluation] = useState<any>(null);

  useEffect(() => {
    if (!isEnabled || gameState.isGameOver || gameState.currentPlayer !== aiColor) {
      return;
    }

    const makeAIMove = async () => {
      setIsThinking(true);
      setThinkingTime(0);
      
      const thinkingInterval = setInterval(() => {
        setThinkingTime(prev => prev + 100);
      }, 100);

      // Simulate thinking time based on difficulty
      const thinkingDelay = {
        easy: 500,
        medium: 1200,
        hard: 2500,
        expert: 4000
      }[difficulty];

      await new Promise(resolve => setTimeout(resolve, thinkingDelay));

      try {
        const bestMove = findBestAIMove(gameState, difficulty);
        
        if (bestMove) {
          const newGameState = makeMove(gameState, bestMove.from, bestMove.to);
          
          if (newGameState) {
            const evaluation = enhancedChessEngine.evaluatePosition(newGameState);
            setLastEvaluation(evaluation);
            
            onGameStateChange(newGameState);
            
            toast.success(`AI played ${bestMove.notation}`, {
              description: `Evaluation: ${evaluation.centipawns > 0 ? '+' : ''}${(evaluation.centipawns / 100).toFixed(2)}`,
              duration: 3000
            });
          }
        }
      } catch (error) {
        console.error('AI move error:', error);
        toast.error('AI encountered an error making a move');
      } finally {
        clearInterval(thinkingInterval);
        setIsThinking(false);
        setThinkingTime(0);
      }
    };

    // Small delay to let UI update
    const moveTimeout = setTimeout(makeAIMove, 300);
    return () => clearTimeout(moveTimeout);
  }, [gameState.currentPlayer, gameState.moves.length, aiColor, isEnabled, difficulty]);

  const findBestAIMove = (gameState: GameState, difficulty: string) => {
    const allMoves = getAllPossibleMoves(gameState);
    
    if (allMoves.length === 0) return null;

    let bestMove = null;
    let bestScore = aiColor === 'white' ? -Infinity : Infinity;

    // Evaluate each possible move
    for (const move of allMoves) {
      const testGameState = makeMove(gameState, move.from, move.to);
      if (!testGameState) continue;

      let score = evaluatePosition(testGameState, difficulty);
      
      // Add some randomness based on difficulty
      const randomFactor = {
        easy: 200,
        medium: 100,
        hard: 50,
        expert: 20
      }[difficulty];
      
      score += (Math.random() - 0.5) * randomFactor;

      const isImprovement = aiColor === 'white' ? 
        score > bestScore : score < bestScore;

      if (isImprovement) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const getAllPossibleMoves = (gameState: GameState) => {
    const moves: Array<{from: Position, to: Position, notation: string}> = [];
    
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = gameState.board[y][x];
        if (piece && piece.color === gameState.currentPlayer) {
          const validMoves = getValidMoves(piece, gameState.board, gameState);
          
          for (const move of validMoves) {
            moves.push({
              from: { x, y },
              to: move,
              notation: generateMoveNotation(piece, { x, y }, move, gameState.board)
            });
          }
        }
      }
    }
    
    return moves;
  };

  const evaluatePosition = (gameState: GameState, difficulty: string): number => {
    const evaluation = enhancedChessEngine.evaluatePosition(gameState);
    
    // Adjust evaluation depth based on difficulty
    const depthMultiplier = {
      easy: 0.5,
      medium: 0.8,
      hard: 1.2,
      expert: 1.5
    }[difficulty];
    
    return evaluation.centipawns * depthMultiplier;
  };

  const generateMoveNotation = (piece: Piece, from: Position, to: Position, board: (Piece | null)[][]): string => {
    const pieceSymbol = piece.type === 'pawn' ? '' : piece.type.charAt(0).toUpperCase();
    const capture = board[to.y][to.x] ? 'x' : '';
    const square = String.fromCharCode(97 + to.x) + (8 - to.y);
    
    if (piece.type === 'king' && Math.abs(to.x - from.x) === 2) {
      return to.x > from.x ? 'O-O' : 'O-O-O';
    }
    
    return `${pieceSymbol}${capture}${square}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-orange-100 text-orange-700';
      case 'expert': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isEnabled) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-800">Chess AI</span>
          <Badge className={getDifficultyColor()}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
        
        {isThinking && (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-blue-600">
              <Clock className="w-3 h-3 inline mr-1" />
              {(thinkingTime / 1000).toFixed(1)}s
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="text-center">
          <div className="font-bold text-blue-600">
            {aiColor === 'white' ? '♔' : '♚'}
          </div>
          <div className="text-gray-600 capitalize">{aiColor}</div>
        </div>
        
        <div className="text-center">
          <div className="font-bold">
            {isThinking ? '...' : gameState.moves.length}
          </div>
          <div className="text-gray-600">Moves</div>
        </div>
        
        <div className="text-center">
          <div className={`font-bold ${
            lastEvaluation?.centipawns > 0 ? 'text-green-600' : 
            lastEvaluation?.centipawns < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            {lastEvaluation ? 
              `${lastEvaluation.centipawns > 0 ? '+' : ''}${(lastEvaluation.centipawns / 100).toFixed(1)}` : 
              '0.0'
            }
          </div>
          <div className="text-gray-600">Eval</div>
        </div>
      </div>

      {isThinking && (
        <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800">
          <Zap className="w-4 h-4 inline mr-1" />
          AI is analyzing position and calculating best move...
        </div>
      )}

      {lastEvaluation && !isThinking && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
          <Target className="w-4 h-4 inline mr-1" />
          Best line: {lastEvaluation.principalVariation.slice(0, 3).join(' ')}
        </div>
      )}
    </Card>
  );
};

export default ChessAIOpponent;
