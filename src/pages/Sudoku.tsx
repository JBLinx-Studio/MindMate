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
  Eraser,
  Award,
  Users
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
  const [hintsUsed, setHintsUsed] = useState(0);
  const [notes, setNotes] = useState<{[key: string]: number[]}>({});

  const generateSudoku = (difficulty: string) => {
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
    setHintsUsed(0);
    setNotes({});
    toast.success(`Starting ${difficulty} Sudoku puzzle!`);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell && board[selectedCell.row][selectedCell.col] === null) {
      const newBoard = board.map(row => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = num;
      
      // Check if correct
      if (solution[selectedCell.row][selectedCell.col] !== num) {
        setMistakes(prev => prev + 1);
        toast.error('Incorrect number!', {
          description: `${3 - mistakes - 1} mistakes remaining`
        });
        
        if (mistakes >= 2) {
          toast.error('Game Over! Too many mistakes.');
          setGameMode('menu');
          return;
        }
        return;
      }
      
      setBoard(newBoard);
      toast.success('Correct!');
      
      // Check if puzzle is complete
      const isComplete = newBoard.every(row => 
        row.every(cell => cell !== null)
      );
      
      if (isComplete) {
        setIsComplete(true);
        toast.success('🎉 Congratulations! Puzzle completed!');
      }
    }
  };

  const useHint = () => {
    if (selectedCell && hintsUsed < 3) {
      const correctNumber = solution[selectedCell.row][selectedCell.col];
      const newBoard = board.map(row => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = correctNumber;
      setBoard(newBoard);
      setHintsUsed(prev => prev + 1);
      toast.success(`Hint used! Number: ${correctNumber}`);
    } else if (hintsUsed >= 3) {
      toast.error('No more hints available!');
    } else {
      toast.error('Select an empty cell first!');
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

  const getCompletionRating = () => {
    if (timeElapsed < 300 && mistakes === 0) return { text: "Perfect!", color: "text-yellow-400", icon: <Award className="w-5 h-5" /> };
    if (timeElapsed < 600) return { text: "Excellent!", color: "text-green-400", icon: <Trophy className="w-5 h-5" /> };
    if (mistakes <= 1) return { text: "Great Job!", color: "text-blue-400", icon: <Star className="w-5 h-5" /> };
    return { text: "Well Done!", color: "text-purple-400", icon: <CheckCircle2 className="w-5 h-5" /> };
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
        <div className="min-h-screen flex w-full bg-gradient-to-br from-[#161512] to-[#1a1916]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setGameMode('menu')}
                    className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] transition-all duration-200"
                  >
                    ← Back to Menu
                  </Button>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={`${getDifficultyColor(difficulty)} bg-transparent flex items-center space-x-1 px-3 py-1`}>
                      {getDifficultyIcon(difficulty)}
                      <span>{difficulty.toUpperCase()}</span>
                    </Badge>
                    <div className="flex items-center space-x-2 text-white bg-[#4a4a46] px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{formatTime(timeElapsed)}</span>
                    </div>
                    <div className={`text-white px-3 py-1 rounded-full ${mistakes > 1 ? 'bg-red-600 animate-pulse' : 'bg-[#4a4a46]'}`}>
                      Mistakes: <span className="font-bold">{mistakes}/3</span>
                    </div>
                    <div className="bg-[#4a4a46] text-white px-3 py-1 rounded-full">
                      Hints: <span className="font-bold text-yellow-400">{3 - hintsUsed}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    {/* Sudoku Board */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-2xl">
                      <h3 className="text-white font-semibold mb-6 text-xl">Sudoku Grid</h3>
                      <div className="grid grid-cols-9 gap-1 max-w-lg mx-auto bg-white p-2 rounded-lg shadow-inner">
                        {board.map((row, rowIndex) =>
                          row.map((cell, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              className={`
                                w-12 h-12 border text-center font-bold text-lg transition-all duration-200
                                ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                                  ? 'bg-gradient-to-br from-[#759900] to-[#6a8700] text-white border-[#759900] shadow-lg transform scale-105'
                                  : cell === null 
                                    ? 'bg-gray-50 text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                                    : 'bg-gray-200 text-gray-600 border-gray-300 cursor-default'
                                }
                                ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? 'border-b-4 border-b-gray-800' : ''}
                                ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? 'border-r-4 border-r-gray-800' : ''}
                              `}
                            >
                              {cell || ''}
                            </button>
                          ))
                        )}
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Number Input */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-6 shadow-xl">
                      <h3 className="text-white font-semibold mb-4 flex items-center">
                        <Hash className="w-5 h-5 mr-2" />
                        Numbers
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[1,2,3,4,5,6,7,8,9].map(num => (
                          <Button
                            key={num}
                            onClick={() => handleNumberInput(num)}
                            className="bg-[#3d3d37] hover:bg-[#759900] text-white border-[#4a4a46] text-lg font-bold h-12 transition-all duration-200 hover:scale-105"
                            disabled={!selectedCell || board[selectedCell?.row]?.[selectedCell?.col] !== null}
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={clearCell}
                        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-105"
                        disabled={!selectedCell || board[selectedCell?.row]?.[selectedCell?.col] !== null}
                      >
                        <Eraser className="w-4 h-4 mr-2" />
                        Clear Cell
                      </Button>
                    </Card>
                    
                    {/* Game Controls */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-6 shadow-xl">
                      <h3 className="text-white font-semibold mb-4">Game Controls</h3>
                      <div className="space-y-3">
                        <Button
                          onClick={useHint}
                          disabled={hintsUsed >= 3 || !selectedCell || board[selectedCell?.row]?.[selectedCell?.col] !== null}
                          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Use Hint ({3 - hintsUsed} left)
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] flex items-center justify-center transition-all duration-200 hover:scale-105"
                          onClick={() => setGameMode('menu')}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Game
                        </Button>
                      </div>
                    </Card>
                    
                    {isComplete && (
                      <Card className="bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900] p-6 shadow-2xl">
                        <div className="text-center text-white">
                          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                          <h3 className="font-bold text-2xl mb-2">Puzzle Complete!</h3>
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            {getCompletionRating().icon}
                            <span className={`text-lg font-semibold ${getCompletionRating().color}`}>
                              {getCompletionRating().text}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm opacity-90">
                            <p>Time: {formatTime(timeElapsed)}</p>
                            <p>Mistakes: {mistakes}/3</p>
                            <p>Hints used: {hintsUsed}/3</p>
                          </div>
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#161512] to-[#1a1916]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Grid3X3 className="w-16 h-16 text-[#759900] mr-4 animate-pulse" />
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-[#b8b8b8] bg-clip-text text-transparent">
                    Sudoku
                  </h1>
                </div>
                <p className="text-[#b8b8b8] text-xl">Challenge your logic with number puzzles</p>
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <Badge className="bg-blue-600 text-white">
                    <Users className="w-4 h-4 mr-1" />
                    892 players online
                  </Badge>
                  <Badge className="bg-purple-600 text-white">
                    <Trophy className="w-4 h-4 mr-1" />
                    Daily challenge
                  </Badge>
                </div>
              </div>

              <div className="space-y-8">
                {/* Difficulty Selection */}
                <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-[#759900]" />
                    Choose Difficulty
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(['easy', 'medium', 'hard', 'expert'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`
                          p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105
                          ${difficulty === diff 
                            ? `${getDifficultyColor(diff)} bg-current/10 shadow-lg` 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900] hover:bg-[#3d3d37]'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-3">
                            {getDifficultyIcon(diff)}
                          </div>
                          <div className="text-xl font-bold capitalize mb-2">{diff}</div>
                          <div className="text-sm opacity-75">
                            {diff === 'easy' && '45 clues • Beginner'}
                            {diff === 'medium' && '35 clues • Intermediate'}
                            {diff === 'hard' && '25 clues • Advanced'}
                            {diff === 'expert' && '20 clues • Master'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Start Game */}
                <Card className="bg-gradient-to-r from-[#759900] to-[#6a8700] border-[#759900] p-8 text-center shadow-2xl">
                  <h2 className="text-2xl font-semibold text-white mb-6">Ready to Play?</h2>
                  <Button
                    onClick={startGame}
                    className="bg-white hover:bg-gray-100 text-[#759900] px-12 py-4 text-xl font-bold transform transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Game
                  </Button>
                </Card>

                {/* Game Stats */}
                <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#759900]">47</div>
                      <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-400">12:34</div>
                      <div className="text-[#b8b8b8] text-sm">Best Time</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-yellow-400">3</div>
                      <div className="text-[#b8b8b8] text-sm">Win Streak</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-purple-400">85%</div>
                      <div className="text-[#b8b8b8] text-sm">Success Rate</div>
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
