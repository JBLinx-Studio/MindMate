
import React, { useState, useEffect } from 'react';
import { GameState, Position } from '../types/chess';
import { ChessNotation } from '../utils/chessNotation';
import { makeMove } from '../utils/chessLogic';
import { toast } from 'sonner';
import { Puzzle, Trophy, Star, Target, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChessPuzzle {
  id: string;
  name: string;
  fen: string;
  solution: string[];
  theme: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  rating: number;
  description: string;
  hint?: string;
}

interface ChessPuzzleSystemProps {
  onGameStateChange: (gameState: GameState) => void;
  isActive: boolean;
}

// Real chess puzzles database
const CHESS_PUZZLES: ChessPuzzle[] = [
  {
    id: 'mate-in-1-001',
    name: 'Back Rank Mate',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: ['Re8#'],
    theme: 'Back Rank Mate',
    difficulty: 'beginner',
    rating: 800,
    description: 'White to move and checkmate in 1',
    hint: 'The black king has no escape squares on the back rank'
  },
  {
    id: 'fork-001',
    name: 'Knight Fork',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4',
    solution: ['Ng5', 'Qd4'],
    theme: 'Fork',
    difficulty: 'beginner',
    rating: 900,
    description: 'Find the knight fork that wins material',
    hint: 'Look for a knight move that attacks multiple pieces'
  },
  {
    id: 'pin-001',
    name: 'Pin the Queen',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4',
    solution: ['Bg5'],
    theme: 'Pin',
    difficulty: 'intermediate',
    rating: 1200,
    description: 'Pin the knight to win material',
    hint: 'Pin the knight to the queen behind it'
  },
  {
    id: 'discovery-001',
    name: 'Discovered Attack',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 0 6',
    solution: ['Nd4'],
    theme: 'Discovered Attack',
    difficulty: 'intermediate',
    rating: 1400,
    description: 'Find the discovered attack that wins the queen',
    hint: 'Move the knight to unleash the bishop'
  },
  {
    id: 'smothered-mate-001',
    name: 'Smothered Mate',
    fen: '6rk/6pp/8/8/8/8/R7/6QK w - - 0 1',
    solution: ['Qg7#'],
    theme: 'Smothered Mate',
    difficulty: 'advanced',
    rating: 1800,
    description: 'Find the smothered mate in 1',
    hint: 'The king is trapped by its own pieces'
  }
];

export const ChessPuzzleSystem: React.FC<ChessPuzzleSystemProps> = ({
  onGameStateChange,
  isActive
}) => {
  const [currentPuzzle, setCurrentPuzzle] = useState<ChessPuzzle | null>(null);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [solvedPuzzles, setSolvedPuzzles] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [solveTime, setSolveTime] = useState<number | null>(null);

  useEffect(() => {
    if (isActive && !currentPuzzle) {
      loadPuzzle(0);
    }
  }, [isActive]);

  const loadPuzzle = (index: number) => {
    if (index >= 0 && index < CHESS_PUZZLES.length) {
      const puzzle = CHESS_PUZZLES[index];
      setCurrentPuzzle(puzzle);
      setPuzzleIndex(index);
      setSolutionIndex(0);
      setIsCompleted(false);
      setShowHint(false);
      setAttempts(0);
      setStartTime(new Date());
      setSolveTime(null);

      try {
        const { board, currentPlayer } = ChessNotation.fenToBoard(puzzle.fen);
        const gameState: GameState = {
          board,
          currentPlayer,
          moves: [],
          isGameOver: false,
          validMoves: [],
          selectedSquare: undefined
        };
        
        onGameStateChange(gameState);
        toast.success(`Puzzle loaded: ${puzzle.name}`, {
          description: puzzle.description
        });
      } catch (error) {
        toast.error('Failed to load puzzle');
        console.error('Puzzle loading error:', error);
      }
    }
  };

  const checkMove = (moveNotation: string): boolean => {
    if (!currentPuzzle) return false;

    const expectedMove = currentPuzzle.solution[solutionIndex];
    const isCorrect = moveNotation === expectedMove;

    if (isCorrect) {
      if (solutionIndex + 1 >= currentPuzzle.solution.length) {
        // Puzzle completed!
        setIsCompleted(true);
        setSolvedPuzzles(prev => new Set([...prev, currentPuzzle.id]));
        
        if (startTime) {
          const timeElapsed = Date.now() - startTime.getTime();
          setSolveTime(timeElapsed);
        }

        toast.success('🎉 Puzzle solved!', {
          description: `Completed in ${attempts + 1} attempts`,
          duration: 4000
        });

        return true;
      } else {
        setSolutionIndex(prev => prev + 1);
        toast.success('Correct move! Continue...', {
          description: `${currentPuzzle.solution.length - solutionIndex - 1} moves remaining`
        });
        return true;
      }
    } else {
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2 && currentPuzzle.hint) {
        setShowHint(true);
        toast.error('Incorrect move. Hint revealed!', {
          description: currentPuzzle.hint
        });
      } else {
        toast.error('Incorrect move. Try again!', {
          description: 'Think about the puzzle theme'
        });
      }
      
      return false;
    }
  };

  const nextPuzzle = () => {
    const nextIndex = (puzzleIndex + 1) % CHESS_PUZZLES.length;
    loadPuzzle(nextIndex);
  };

  const previousPuzzle = () => {
    const prevIndex = puzzleIndex === 0 ? CHESS_PUZZLES.length - 1 : puzzleIndex - 1;
    loadPuzzle(prevIndex);
  };

  const resetPuzzle = () => {
    if (currentPuzzle) {
      loadPuzzle(puzzleIndex);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'expert': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!isActive || !currentPuzzle) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Puzzle className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">Chess Puzzles</h3>
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getDifficultyColor(currentPuzzle.difficulty)}>
            {currentPuzzle.difficulty}
          </Badge>
          <Badge variant="outline">
            <Star className="w-3 h-3 mr-1" />
            {currentPuzzle.rating}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800">{currentPuzzle.name}</h4>
          <p className="text-sm text-gray-600">{currentPuzzle.description}</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-purple-600" />
            <span>Theme: {currentPuzzle.theme}</span>
          </div>
          
          {startTime && !isCompleted && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Time: {Math.floor((Date.now() - startTime.getTime()) / 1000)}s</span>
            </div>
          )}
          
          {solveTime && (
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span>Solved in {(solveTime / 1000).toFixed(1)}s</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="text-center">
            <div className="font-bold">{puzzleIndex + 1}/{CHESS_PUZZLES.length}</div>
            <div className="text-gray-600">Puzzle</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{solutionIndex + 1}/{currentPuzzle.solution.length}</div>
            <div className="text-gray-600">Move</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{attempts}</div>
            <div className="text-gray-600">Attempts</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{solvedPuzzles.size}</div>
            <div className="text-gray-600">Solved</div>
          </div>
        </div>

        {showHint && currentPuzzle.hint && (
          <div className="p-3 bg-yellow-100 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> {currentPuzzle.hint}
            </p>
          </div>
        )}

        {isCompleted && (
          <div className="p-4 bg-green-100 border border-green-200 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Puzzle Completed!</span>
            </div>
            <p className="text-sm text-green-700">
              Solution: {currentPuzzle.solution.join(', ')}
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={previousPuzzle} variant="outline" size="sm">
            Previous
          </Button>
          <Button onClick={resetPuzzle} variant="outline" size="sm">
            Reset
          </Button>
          <Button onClick={nextPuzzle} variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChessPuzzleSystem;
