
import React, { useState, useEffect } from 'react';
import { GameState, Position } from '../types/chess';
import { ChessNotation } from '../utils/chessNotation';
import { makeMove, createInitialGameState } from '../utils/chessLogic';
import { toast } from 'sonner';
import { BookOpen, Target, Trophy, Clock, CheckCircle, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Opening {
  id: string;
  name: string;
  moves: string[];
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  eco: string;
  popularity: number;
  variations?: { name: string; moves: string[] }[];
}

interface OpeningTrainerProps {
  onGameStateChange: (gameState: GameState) => void;
  isActive: boolean;
}

// Real chess openings database
const CHESS_OPENINGS: Opening[] = [
  {
    id: 'italian-game',
    name: 'Italian Game',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    description: 'Classic opening focusing on quick development and center control',
    difficulty: 'beginner',
    eco: 'C50',
    popularity: 85,
    variations: [
      { name: 'Italian Game: Classical', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5'] },
      { name: 'Italian Game: Two Knights', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6'] }
    ]
  },
  {
    id: 'ruy-lopez',
    name: 'Ruy López',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    description: 'One of the oldest and most respected openings in chess',
    difficulty: 'intermediate',
    eco: 'C60',
    popularity: 92,
    variations: [
      { name: 'Ruy López: Morphy Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6'] },
      { name: 'Ruy López: Berlin Defense', moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6'] }
    ]
  },
  {
    id: 'queens-gambit',
    name: "Queen's Gambit",
    moves: ['d4', 'd5', 'c4'],
    description: 'Strategic opening offering a pawn to gain central control',
    difficulty: 'intermediate',
    eco: 'D06',
    popularity: 78,
    variations: [
      { name: "Queen's Gambit Accepted", moves: ['d4', 'd5', 'c4', 'dxc4'] },
      { name: "Queen's Gambit Declined", moves: ['d4', 'd5', 'c4', 'e6'] }
    ]
  },
  {
    id: 'kings-indian',
    name: "King's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
    description: 'Hypermodern defense allowing white center before counterattacking',
    difficulty: 'advanced',
    eco: 'E60',
    popularity: 70,
    variations: [
      { name: 'King\'s Indian: Classical', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4'] },
      { name: 'King\'s Indian: Fianchetto', moves: ['d4', 'Nf6', 'c4', 'g6', 'Nf3', 'Bg7', 'g3'] }
    ]
  },
  {
    id: 'sicilian-dragon',
    name: 'Sicilian Dragon',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6'],
    description: 'Sharp and tactical variation of the Sicilian Defense',
    difficulty: 'advanced',
    eco: 'B70',
    popularity: 65,
    variations: [
      { name: 'Dragon: Yugoslav Attack', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3'] },
      { name: 'Dragon: Positional', moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be2'] }
    ]
  }
];

export const OpeningTrainer: React.FC<OpeningTrainerProps> = ({
  onGameStateChange,
  isActive
}) => {
  const [currentOpening, setCurrentOpening] = useState<Opening | null>(null);
  const [openingIndex, setOpeningIndex] = useState(0);
  const [moveIndex, setMoveIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [masteredOpenings, setMasteredOpenings] = useState<Set<string>>(new Set());
  const [currentVariation, setCurrentVariation] = useState<{name: string; moves: string[]} | null>(null);

  useEffect(() => {
    if (isActive && !currentOpening) {
      loadOpening(0);
    }
  }, [isActive]);

  const loadOpening = (index: number) => {
    if (index >= 0 && index < CHESS_OPENINGS.length) {
      const opening = CHESS_OPENINGS[index];
      setCurrentOpening(opening);
      setOpeningIndex(index);
      setMoveIndex(0);
      setIsCompleted(false);
      setMistakes(0);
      setStartTime(new Date());
      setCompletionTime(null);
      setCurrentVariation(null);

      const initialState = createInitialGameState();
      onGameStateChange(initialState);
      
      toast.success(`Learning: ${opening.name}`, {
        description: opening.description,
        duration: 3000
      });
    }
  };

  const loadVariation = (variation: {name: string; moves: string[]}) => {
    setCurrentVariation(variation);
    setMoveIndex(0);
    setIsCompleted(false);
    setMistakes(0);
    setStartTime(new Date());
    setCompletionTime(null);

    const initialState = createInitialGameState();
    onGameStateChange(initialState);
    
    toast.info(`Variation: ${variation.name}`, {
      description: `${variation.moves.length} moves to learn`,
      duration: 2000
    });
  };

  const checkMove = (moveNotation: string, gameState: GameState): boolean => {
    if (!currentOpening) return false;

    const moves = currentVariation?.moves || currentOpening.moves;
    const expectedMove = moves[moveIndex];
    
    if (!expectedMove) return false;

    const isCorrect = moveNotation === expectedMove;

    if (isCorrect) {
      if (moveIndex + 1 >= moves.length) {
        // Opening completed!
        setIsCompleted(true);
        setMasteredOpenings(prev => new Set([...prev, currentOpening.id]));
        
        if (startTime) {
          const timeElapsed = Date.now() - startTime.getTime();
          setCompletionTime(timeElapsed);
        }

        const title = currentVariation ? currentVariation.name : currentOpening.name;
        toast.success(`🎉 ${title} mastered!`, {
          description: `Completed with ${mistakes} mistakes`,
          duration: 4000
        });

        return true;
      } else {
        setMoveIndex(prev => prev + 1);
        
        const remaining = moves.length - moveIndex - 1;
        toast.success('Correct move!', {
          description: `${remaining} moves remaining`,
          duration: 1500
        });
        
        return true;
      }
    } else {
      setMistakes(prev => prev + 1);
      
      toast.error(`Incorrect! Expected: ${expectedMove}`, {
        description: 'Try to follow the opening theory',
        duration: 3000
      });
      
      return false;
    }
  };

  const nextOpening = () => {
    const nextIndex = (openingIndex + 1) % CHESS_OPENINGS.length;
    loadOpening(nextIndex);
  };

  const previousOpening = () => {
    const prevIndex = openingIndex === 0 ? CHESS_OPENINGS.length - 1 : openingIndex - 1;
    loadOpening(prevIndex);
  };

  const resetOpening = () => {
    if (currentOpening) {
      if (currentVariation) {
        loadVariation(currentVariation);
      } else {
        loadOpening(openingIndex);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgress = () => {
    if (!currentOpening) return 0;
    const moves = currentVariation?.moves || currentOpening.moves;
    return (moveIndex / moves.length) * 100;
  };

  if (!isActive || !currentOpening) return null;

  const moves = currentVariation?.moves || currentOpening.moves;

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Opening Trainer</h3>
          {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={getDifficultyColor(currentOpening.difficulty)}>
            {currentOpening.difficulty}
          </Badge>
          <Badge variant="outline">
            {currentOpening.eco}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-800">
            {currentVariation ? currentVariation.name : currentOpening.name}
          </h4>
          <p className="text-sm text-gray-600">{currentOpening.description}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{moveIndex}/{moves.length} moves</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="text-center">
            <div className="font-bold">{openingIndex + 1}/{CHESS_OPENINGS.length}</div>
            <div className="text-gray-600">Opening</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{mistakes}</div>
            <div className="text-gray-600">Mistakes</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{masteredOpenings.size}</div>
            <div className="text-gray-600">Mastered</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{currentOpening.popularity}%</div>
            <div className="text-gray-600">Popular</div>
          </div>
        </div>

        {moves.length > 0 && (
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm font-medium mb-2">Opening Moves:</div>
            <div className="flex flex-wrap gap-1">
              {moves.map((move, index) => (
                <Badge 
                  key={index}
                  variant={index < moveIndex ? "default" : index === moveIndex ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {Math.floor(index / 2) + 1}{index % 2 === 0 ? '.' : '...'} {move}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {currentOpening.variations && !currentVariation && (
          <div>
            <div className="text-sm font-medium mb-2">Popular Variations:</div>
            <div className="space-y-1">
              {currentOpening.variations.map((variation, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadVariation(variation)}
                  className="w-full justify-start text-left"
                >
                  {variation.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="p-4 bg-green-100 border border-green-200 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Opening Mastered!</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>Mistakes: {mistakes}</p>
              {completionTime && (
                <p>Time: {(completionTime / 1000).toFixed(1)} seconds</p>
              )}
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button onClick={previousOpening} variant="outline" size="sm">
            Previous
          </Button>
          <Button onClick={resetOpening} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button onClick={nextOpening} variant="outline" size="sm">
            Next
          </Button>
        </div>

        {currentVariation && (
          <Button 
            onClick={() => setCurrentVariation(null)} 
            variant="ghost" 
            size="sm"
            className="w-full"
          >
            Back to Main Line
          </Button>
        )}
      </div>
    </Card>
  );
};

export default OpeningTrainer;
