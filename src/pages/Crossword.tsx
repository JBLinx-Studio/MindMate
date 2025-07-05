
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Type, 
  Clock, 
  Star,
  Target,
  Brain,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Hash,
  ArrowRight,
  ArrowDown,
  Zap,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

const Crossword = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameMode, setGameMode] = useState<'menu' | 'playing'>('menu');
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [grid, setGrid] = useState<string[][]>([]);
  const [clues, setClues] = useState<{across: {[key: number]: string}, down: {[key: number]: string}}>({across: {}, down: {}});
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);

  // Enhanced crossword data
  const sampleCrossword = {
    grid: [
      ['C', 'A', 'T', '', ''],
      ['', '', 'R', '', ''],
      ['D', 'O', 'G', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ],
    solution: [
      ['C', 'A', 'T', '', ''],
      ['', '', 'R', '', ''],
      ['D', 'O', 'G', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ],
    clues: {
      across: {
        1: "Feline pet that purrs (3)",
        3: "Man's best friend, loyal companion (3)"
      },
      down: {
        1: "Automobile, vehicle for transport (3)",
        2: "To perform on stage, theatrical performance (3)"
      }
    }
  };

  const startGame = () => {
    // Initialize empty grid for user input
    const emptyGrid = sampleCrossword.grid.map(row => 
      row.map(cell => cell === '' ? '' : ' ')
    );
    setGrid(emptyGrid);
    setClues(sampleCrossword.clues);
    setGameMode('playing');
    setTimeElapsed(0);
    setIsComplete(false);
    setSelectedCell(null);
    setHintsUsed(0);
    setCompletedWords([]);
    toast.success(`Starting ${difficulty} crossword puzzle!`);
  };

  const handleCellClick = (row: number, col: number) => {
    if (sampleCrossword.grid[row][col] !== '') {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyInput = (key: string) => {
    if (selectedCell && key.match(/[A-Za-z]/)) {
      const newGrid = grid.map(row => [...row]);
      newGrid[selectedCell.row][selectedCell.col] = key.toUpperCase();
      setGrid(newGrid);
      
      // Move to next cell automatically
      moveToNextCell();
      
      // Check completion
      const isComplete = checkPuzzleComplete(newGrid);
      if (isComplete) {
        setIsComplete(true);
        toast.success('🎉 Congratulations! Crossword completed!');
      }
    }
  };

  const moveToNextCell = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    if (selectedDirection === 'across') {
      // Move right
      for (let c = col + 1; c < 5; c++) {
        if (sampleCrossword.grid[row][c] !== '') {
          setSelectedCell({ row, col: c });
          return;
        }
      }
    } else {
      // Move down
      for (let r = row + 1; r < 5; r++) {
        if (sampleCrossword.grid[r][col] !== '') {
          setSelectedCell({ row: r, col });
          return;
        }
      }
    }
  };

  const checkPuzzleComplete = (currentGrid: string[][]) => {
    return currentGrid.every((row, rowIndex) =>
      row.every((cell, colIndex) => 
        sampleCrossword.grid[rowIndex][colIndex] === '' || 
        (cell !== ' ' && cell !== '')
      )
    );
  };

  const useHint = () => {
    if (selectedCell && hintsUsed < 3) {
      const correctLetter = sampleCrossword.solution[selectedCell.row][selectedCell.col];
      const newGrid = grid.map(row => [...row]);
      newGrid[selectedCell.row][selectedCell.col] = correctLetter;
      setGrid(newGrid);
      setHintsUsed(prev => prev + 1);
      toast.success(`Hint used! Letter: ${correctLetter}`);
    } else if (hintsUsed >= 3) {
      toast.error('No more hints available!');
    } else {
      toast.error('Select a cell first!');
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

  const getCompletionRating = () => {
    if (timeElapsed < 300) return { text: "Lightning Fast!", color: "text-yellow-400", icon: <Zap className="w-5 h-5" /> };
    if (timeElapsed < 600) return { text: "Excellent!", color: "text-green-400", icon: <Award className="w-5 h-5" /> };
    if (timeElapsed < 900) return { text: "Good Job!", color: "text-blue-400", icon: <Star className="w-5 h-5" /> };
    return { text: "Well Done!", color: "text-purple-400", icon: <Trophy className="w-5 h-5" /> };
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
                    <Badge className="bg-gradient-to-r from-[#759900] to-[#6a8700] text-white capitalize px-3 py-1">
                      {difficulty} Crossword
                    </Badge>
                    <div className="flex items-center space-x-2 text-white bg-[#4a4a46] px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="bg-[#4a4a46] text-white px-3 py-1 rounded-full">
                      Hints: <span className="font-bold text-yellow-400">{3 - hintsUsed}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                      <h3 className="text-white font-semibold mb-6 text-xl">Crossword Grid</h3>
                      <div className="grid grid-cols-5 gap-1 max-w-sm mx-auto">
                        {grid.map((row, rowIndex) =>
                          row.map((cell, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              className={`
                                w-12 h-12 border-2 text-center font-bold text-lg transition-all duration-200
                                ${sampleCrossword.grid[rowIndex][colIndex] === '' 
                                  ? 'bg-black border-gray-600 cursor-not-allowed' 
                                  : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                                    ? 'bg-gradient-to-br from-[#759900] to-[#6a8700] text-white border-[#759900] shadow-lg transform scale-105'
                                    : 'bg-white text-black border-gray-300 hover:bg-gray-100 hover:border-[#759900] hover:shadow-md'
                                }
                              `}
                              disabled={sampleCrossword.grid[rowIndex][colIndex] === ''}
                            >
                              {sampleCrossword.grid[rowIndex][colIndex] !== '' ? cell : ''}
                            </button>
                          ))
                        )}
                      </div>
                      
                      <div className="mt-6 flex items-center justify-center space-x-3">
                        <Button
                          onClick={() => setSelectedDirection('across')}
                          variant={selectedDirection === 'across' ? 'default' : 'outline'}
                          className={selectedDirection === 'across' ? 'bg-[#759900] hover:bg-[#6a8700]' : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Across
                        </Button>
                        <Button
                          onClick={() => setSelectedDirection('down')}
                          variant={selectedDirection === 'down' ? 'default' : 'outline'}
                          className={selectedDirection === 'down' ? 'bg-[#759900] hover:bg-[#6a8700]' : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'}
                        >
                          <ArrowDown className="w-4 h-4 mr-2" />
                          Down
                        </Button>
                      </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-6 shadow-xl">
                      <h3 className="text-white font-semibold mb-4">Letter Input</h3>
                      <div className="grid grid-cols-6 gap-2">
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                          <Button
                            key={letter}
                            onClick={() => handleKeyInput(letter)}
                            className="bg-[#3d3d37] hover:bg-[#4a4a46] text-white transition-all duration-200 hover:scale-105"
                            disabled={!selectedCell}
                            size="sm"
                          >
                            {letter}
                          </Button>
                        ))}
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-6 shadow-xl">
                      <h3 className="text-white font-semibold mb-4 flex items-center text-xl">
                        <Hash className="w-5 h-5 mr-2" />
                        Clues
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="bg-[#3d3d37] rounded-lg p-4">
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <ArrowRight className="w-4 h-4 mr-2 text-[#759900]" />
                            Across
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(clues.across).map(([num, clue]) => (
                              <div key={num} className="text-[#b8b8b8] text-sm p-2 bg-[#2c2c28] rounded">
                                <span className="font-bold text-[#759900]">{num}.</span> {clue}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-[#3d3d37] rounded-lg p-4">
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <ArrowDown className="w-4 h-4 mr-2 text-blue-400" />
                            Down
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(clues.down).map(([num, clue]) => (
                              <div key={num} className="text-[#b8b8b8] text-sm p-2 bg-[#2c2c28] rounded">
                                <span className="font-bold text-blue-400">{num}.</span> {clue}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-6 shadow-xl">
                      <h3 className="text-white font-semibold mb-4">Game Controls</h3>
                      <div className="space-y-3">
                        <Button
                          onClick={useHint}
                          disabled={hintsUsed >= 3 || !selectedCell}
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
                          New Puzzle
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
                  <Type className="w-16 h-16 text-[#759900] mr-4 animate-pulse" />
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-[#b8b8b8] bg-clip-text text-transparent">
                    Crossword Puzzle
                  </h1>
                </div>
                <p className="text-[#b8b8b8] text-xl">Challenge your vocabulary and word knowledge</p>
              </div>

              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-[#759900]" />
                    Choose Difficulty
                  </h2>
                  <div className="grid grid-cols-3 gap-6">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`
                          p-6 rounded-xl border-2 transition-all duration-300 capitalize transform hover:scale-105
                          ${difficulty === diff 
                            ? 'border-[#759900] bg-gradient-to-br from-[#759900]/20 to-[#6a8700]/20 text-[#759900] shadow-lg shadow-[#759900]/30' 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900] hover:bg-[#3d3d37]'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-xl font-bold mb-2">{diff}</div>
                          <div className="text-sm opacity-75">
                            {diff === 'easy' && '5x5 Grid • Simple words'}
                            {diff === 'medium' && '9x9 Grid • Mixed difficulty'}
                            {diff === 'hard' && '13x13 Grid • Challenging words'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-[#759900] to-[#6a8700] border-[#759900] p-8 text-center shadow-2xl">
                  <h2 className="text-2xl font-semibold text-white mb-6">Ready to Solve?</h2>
                  <Button
                    onClick={startGame}
                    className="bg-white hover:bg-gray-100 text-[#759900] px-12 py-4 text-xl font-bold transform transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Crossword
                  </Button>
                </Card>

                <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#759900]">34</div>
                      <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-400">4:23</div>
                      <div className="text-[#b8b8b8] text-sm">Best Time</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-yellow-400">7</div>
                      <div className="text-[#b8b8b8] text-sm">Current Streak</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-purple-400">91%</div>
                      <div className="text-[#b8b8b8] text-sm">Completion Rate</div>
                    </div>
                  </div>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Crossword;
