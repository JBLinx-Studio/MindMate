
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
  ArrowDown
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

  // Sample crossword data (simplified for demo)
  const sampleCrossword = {
    grid: [
      ['C', 'A', 'T', '', ''],
      ['', '', 'R', '', ''],
      ['D', 'O', 'G', '', ''],
      ['', '', '', '', ''],
      ['', '', '', '', '']
    ],
    clues: {
      across: {
        1: "Feline pet (3)",
        3: "Canine companion (3)"
      },
      down: {
        1: "Vehicle (3)",
        2: "To perform on stage (3)"
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
    toast.success(`Starting ${difficulty} crossword!`);
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
      
      // Check completion
      const isComplete = grid.every((row, rowIndex) =>
        row.every((cell, colIndex) => 
          sampleCrossword.grid[rowIndex][colIndex] === '' || cell !== ' '
        )
      );
      
      if (isComplete) {
        setIsComplete(true);
        toast.success('Congratulations! Crossword completed!');
      }
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
                    <Badge className="bg-[#759900] text-white capitalize">
                      {difficulty} Crossword
                    </Badge>
                    <div className="flex items-center space-x-2 text-white">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeElapsed)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    {/* Crossword Grid */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <h3 className="text-white font-semibold mb-4">Crossword Grid</h3>
                      <div className="grid grid-cols-5 gap-1 max-w-sm mx-auto">
                        {grid.map((row, rowIndex) =>
                          row.map((cell, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              className={`
                                w-12 h-12 border text-center font-bold text-lg
                                ${sampleCrossword.grid[rowIndex][colIndex] === '' 
                                  ? 'bg-black border-black cursor-not-allowed' 
                                  : selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                                    ? 'bg-[#759900] text-white border-[#759900]'
                                    : 'bg-white text-black border-gray-400 hover:bg-gray-100'
                                }
                              `}
                              disabled={sampleCrossword.grid[rowIndex][colIndex] === ''}
                            >
                              {sampleCrossword.grid[rowIndex][colIndex] !== '' ? cell : ''}
                            </button>
                          ))
                        )}
                      </div>
                    </Card>

                    {/* Letter Input */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4 mt-4">
                      <h3 className="text-white font-semibold mb-3">Letter Input</h3>
                      <div className="grid grid-cols-6 gap-2">
                        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                          <Button
                            key={letter}
                            onClick={() => handleKeyInput(letter)}
                            className="bg-[#3d3d37] hover:bg-[#4a4a46] text-white"
                            disabled={!selectedCell}
                            size="sm"
                          >
                            {letter}
                          </Button>
                        ))}
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Clues */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3 flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Clues
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Across
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(clues.across).map(([num, clue]) => (
                              <div key={num} className="text-[#b8b8b8] text-sm">
                                <span className="font-medium">{num}.</span> {clue}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center">
                            <ArrowDown className="w-4 h-4 mr-1" />
                            Down
                          </h4>
                          <div className="space-y-1">
                            {Object.entries(clues.down).map(([num, clue]) => (
                              <div key={num} className="text-[#b8b8b8] text-sm">
                                <span className="font-medium">{num}.</span> {clue}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
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
                          New Puzzle
                        </Button>
                      </div>
                    </Card>
                    
                    {isComplete && (
                      <Card className="bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900] p-4">
                        <div className="text-center text-white">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                          <h3 className="font-bold text-lg mb-1">Puzzle Complete!</h3>
                          <p className="text-sm opacity-90">Time: {formatTime(timeElapsed)}</p>
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
                  <Type className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Crossword Puzzle</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Challenge your vocabulary and word knowledge</p>
              </div>

              <div className="space-y-6">
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Choose Difficulty
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 capitalize
                          ${difficulty === diff 
                            ? 'border-[#759900] bg-[#759900]/20 text-[#759900]' 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-lg font-semibold">{diff}</div>
                          <div className="text-sm opacity-75">
                            {diff === 'easy' && '5x5 Grid'}
                            {diff === 'medium' && '9x9 Grid'}
                            {diff === 'hard' && '13x13 Grid'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <h2 className="text-xl font-semibold text-white mb-4">Ready to Solve?</h2>
                  <Button
                    onClick={startGame}
                    className="bg-[#759900] hover:bg-[#6a8700] text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Crossword
                  </Button>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">34</div>
                      <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">4:23</div>
                      <div className="text-[#b8b8b8] text-sm">Best Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">7</div>
                      <div className="text-[#b8b8b8] text-sm">Current Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">91%</div>
                      <div className="text-[#b8b8b8] text-sm">Completion</div>
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

export default Crossword;
