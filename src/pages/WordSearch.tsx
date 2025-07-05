
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Search, 
  Clock, 
  Star,
  Target,
  Brain,
  RotateCcw,
  CheckCircle2,
  Trophy,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const WordSearch = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameMode, setGameMode] = useState<'menu' | 'playing'>('menu');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordsToFind, setWordsToFind] = useState<string[]>([]);

  // Sample word search data
  const sampleWordSearch = {
    grid: [
      ['C', 'A', 'T', 'X', 'Y'],
      ['X', 'D', 'O', 'G', 'Z'],
      ['B', 'I', 'R', 'D', 'A'],
      ['F', 'I', 'S', 'H', 'Q'],
      ['M', 'N', 'O', 'P', 'R']
    ],
    words: ['CAT', 'DOG', 'BIRD', 'FISH']
  };

  const startGame = () => {
    setGrid(sampleWordSearch.grid);
    setWordsToFind(sampleWordSearch.words);
    setGameMode('playing');
    setTimeElapsed(0);
    setIsComplete(false);
    setFoundWords([]);
    setSelectedCells([]);
    toast.success(`Starting ${difficulty} word search!`);
  };

  const handleCellClick = (row: number, col: number) => {
    const newSelectedCells = [...selectedCells, { row, col }];
    setSelectedCells(newSelectedCells);
    
    // Check if selection forms a word
    if (newSelectedCells.length >= 3) {
      const letters = newSelectedCells.map(cell => grid[cell.row][cell.col]).join('');
      const reversedLetters = letters.split('').reverse().join('');
      
      const foundWord = wordsToFind.find(word => 
        word === letters.toUpperCase() || word === reversedLetters.toUpperCase()
      );
      
      if (foundWord && !foundWords.includes(foundWord)) {
        setFoundWords(prev => [...prev, foundWord]);
        toast.success(`Found: ${foundWord}!`);
        setSelectedCells([]);
        
        // Check completion
        if (foundWords.length + 1 === wordsToFind.length) {
          setIsComplete(true);
          toast.success('Congratulations! All words found!');
        }
      }
    }
  };

  const clearSelection = () => {
    setSelectedCells([]);
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

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(cell => cell.row === row && cell.col === col);
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
                      {difficulty} Word Search
                    </Badge>
                    <div className="flex items-center space-x-2 text-white">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="text-white">Found: {foundWords.length}/{wordsToFind.length}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    {/* Word Search Grid */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <h3 className="text-white font-semibold mb-4">Word Search Grid</h3>
                      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
                        {grid.map((row, rowIndex) =>
                          row.map((letter, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onClick={() => handleCellClick(rowIndex, colIndex)}
                              className={`
                                w-12 h-12 border text-center font-bold text-lg
                                ${isCellSelected(rowIndex, colIndex)
                                  ? 'bg-[#759900] text-white border-[#759900]'
                                  : 'bg-[#3d3d37] text-white border-[#4a4a46] hover:bg-[#4a4a46]'
                                }
                              `}
                            >
                              {letter}
                            </button>
                          ))
                        )}
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                        <Button
                          onClick={clearSelection}
                          variant="outline"
                          className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Words to Find */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3 flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Words to Find
                      </h3>
                      <div className="space-y-2">
                        {wordsToFind.map((word, index) => (
                          <div
                            key={index}
                            className={`
                              p-2 rounded text-center font-medium
                              ${foundWords.includes(word)
                                ? 'bg-green-600 text-white line-through'
                                : 'bg-[#3d3d37] text-white'
                              }
                            `}
                          >
                            {word}
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    {/* Game Controls */}
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3">Controls</h3>
                      <div className="space-y-2">
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
                          <h3 className="font-bold text-lg mb-1">All Words Found!</h3>
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
                  <Search className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Word Search</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Find hidden words in letter grids</p>
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
                            {diff === 'medium' && '10x10 Grid'}
                            {diff === 'hard' && '15x15 Grid'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <h2 className="text-xl font-semibold text-white mb-4">Ready to Search?</h2>
                  <Button
                    onClick={startGame}
                    className="bg-[#759900] hover:bg-[#6a8700] text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Search
                  </Button>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">67</div>
                      <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">1:23</div>
                      <div className="text-[#b8b8b8] text-sm">Best Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">845</div>
                      <div className="text-[#b8b8b8] text-sm">Words Found</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">94%</div>
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

export default WordSearch;
