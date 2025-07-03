
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Target, 
  Clock, 
  Star,
  Zap,
  Brain,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Hash,
  Grid3X3,
  Eraser
} from 'lucide-react';
import { toast } from 'sonner';

const Sudoku = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [gameMode, setGameMode] = useState<'menu' | 'playing'>('menu');
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Generate a simple Sudoku puzzle (simplified for demo)
  const generateSudoku = (difficulty: string) => {
    // This is a simplified sudoku generator for demo purposes
    const solution = [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9]
    ];

    const cluesCount = {
      easy: 45,
      medium: 35,
      hard: 25,
      expert: 20
    };

    const puzzle = solution.map(row => [...row]);
    const cellsToRemove = 81 - cluesCount[difficulty];
    
    for (let i = 0; i < cellsToRemove; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== null) {
        puzzle[row][col] = null;
      } else {
        i--; // Try again if cell is already empty
      }
    }

    return { puzzle, solution };
  };

  const startGame = () => {
    const { puzzle, solution } = generateSudoku(difficulty);
    setBoard(puzzle);
    setSolution(solution);
    setGameMode('playing');
    setMistakes(0);
    setTimeElapsed(0);
    setIsComplete(false);
    setSelectedCell(null);
    toast.success(`Starting ${difficulty} Sudoku!`);
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] === null) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell && board[selectedCell.row][selectedCell.col] === null) {
      const newBoard = board.map(row => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = num;
      
      // Check if correct
      if (solution[selectedCell.row][selectedCell.col] !== num) {
        setMistakes(prev => prev + 1);
        toast.error('Incorrect number!');
        return;
      }
      
      setBoard(newBoard);
      
      // Check if puzzle is complete
      const isComplete = newBoard.every(row => 
        row.every(cell => cell !== null)
      );
      
      if (isComplete) {
        setIsComplete(true);
        toast.success('Congratulations! Puzzle completed!');
      }
    }
  };

  const clearCell = () => {
    if (selectedCell && board[selectedCell.row][selectedCell.col] !== null) {
      const newBoard = board.map(row => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = null;
      setBoard(newBoard);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-orange-400 border-orange-400';
      case 'expert': return 'text-red-400 border-red-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'easy': return <Star className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'hard': return <Brain className="w-4 h-4" />;
      case 'expert': return <Target className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === 'playing' && !isComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode, isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameMode === 'playing') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#161512]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setGameMode('menu')}
                    className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                  >
                    ← Back to Menu
                  </Button>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={`${getDifficultyColor(difficulty)} bg-transparent flex items-center space-x-1`}>
                      {getDifficultyIcon(difficulty)}
                      <span>{difficulty.toUpperCase()}</span>
                    </Badge>
                    <div className="flex items-center space-x-2 text-white">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="text-white">Mistakes: {mistakes}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {/* Sudoku Board */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <div className="grid grid-cols-9 gap-1 max-w-md mx-auto">
                        {board.map((row, rowIndex) =>
                          row.map((cell, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              className={`
                                w-10 h-10 border text-center font-bold text-lg
                                ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                                  ? 'bg-[#759900] text-white border-[#759900]'
                                  : cell === null 
                                    ? 'bg-[#3d3d37] text-white border-[#4a4a46] hover:bg-[#4a4a46]'
                                    : 'bg-[#1a1a16] text-[#b8b8b8] border-[#4a4a46]'
                                }
                                ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-2 border-b-white' : ''}
                                ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-2 border-r-white' : ''}
                              `}
                            >
                              {cell || ''}
                            </button>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Number Input */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3 flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Numbers
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {[1,2,3,4,5,6,7,8,9].map(num => (
                          <Button
                            key={num}
                            onClick={() => handleNumberInput(num)}
                            className="bg-[#3d3d37] hover:bg-[#4a4a46] text-white border-[#4a4a46]"
                            disabled={!selectedCell}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={clearCell}
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                        disabled={!selectedCell}
                      >
                        <Eraser className="w-4 h-4 mr-2" />
                        Clear
                      </Button>
                    </Card>
                    
                    {/* Game Controls */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3">Controls</h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] flex items-center justify-center"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Hint
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] flex items-center justify-center"
                          onClick={() => setGameMode('menu')}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Game
                        </Button>
                      </div>
                    </Card>
                    
                    {isComplete && (
                      <Card className="bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900] p-4">
                        <div className="text-center text-white">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                          <h3 className="font-bold text-lg mb-1">Puzzle Complete!</h3>
                          <p className="text-sm opacity-90">Time: {formatTime(timeElapsed)}</p>
                          <p className="text-sm opacity-90">Mistakes: {mistakes}</p>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Grid3X3 className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Sudoku</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Challenge your logic with number puzzles</p>
              </div>

              <div className="space-y-6">
                {/* Difficulty Selection */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Choose Difficulty
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200
                          ${difficulty === diff 
                            ? `${getDifficultyColor(diff)} bg-current/10` 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            {getDifficultyIcon(diff)}
                          </div>
                          <div className="text-lg font-semibold capitalize">{diff}</div>
                          <div className="text-sm opacity-75">
                            {diff === 'easy' && '45 clues'}
                            {diff === 'medium' && '35 clues'}
                            {diff === 'hard' && '25 clues'}
                            {diff === 'expert' && '20 clues'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Start Game */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <h2 className="text-xl font-semibold text-white mb-4">Ready to Play?</h2>
                  <Button
                    onClick={startGame}
                    className="bg-[#759900] hover:bg-[#6a8700] text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Game
                  </Button>
                </Card>

                {/* Game Stats */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">47</div>
                      <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">12:34</div>
                      <div className="text-[#b8b8b8] text-sm">Best Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">3</div>
                      <div className="text-[#b8b8b8] text-sm">Win Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">85%</div>
                      <div className="text-[#b8b8b8] text-sm">Accuracy</div>
                    </div>
                  </div>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }
};

export default Sudoku;
