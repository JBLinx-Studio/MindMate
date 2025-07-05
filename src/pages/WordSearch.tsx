
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
  Eye,
  Zap,
  Award,
  Users
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
  const [isSelecting, setIsSelecting] = useState(false);
  const [foundWordPositions, setFoundWordPositions] = useState<{[key: string]: {row: number, col: number}[]}>({});

  // Enhanced word search data
  const sampleWordSearch = {
    grid: [
      ['C', 'A', 'T', 'X', 'Y', 'Z'],
      ['X', 'D', 'O', 'G', 'Q', 'W'],
      ['B', 'I', 'R', 'D', 'A', 'E'],
      ['F', 'I', 'S', 'H', 'M', 'R'],
      ['M', 'N', 'O', 'P', 'R', 'T'],
      ['H', 'O', 'R', 'S', 'E', 'Y']
    ],
    words: ['CAT', 'DOG', 'BIRD', 'FISH', 'HORSE']
  };

  const startGame = () => {
    setGrid(sampleWordSearch.grid);
    setWordsToFind(sampleWordSearch.words);
    setGameMode('playing');
    setTimeElapsed(0);
    setIsComplete(false);
    setFoundWords([]);
    setSelectedCells([]);
    setFoundWordPositions({});
    toast.success(`Starting ${difficulty} word search!`);
  };

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([{ row, col }]);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      const newSelectedCells = [...selectedCells, { row, col }];
      setSelectedCells(newSelectedCells);
    }
  };

  const handleCellMouseUp = () => {
    if (isSelecting) {
      checkForWord();
      setIsSelecting(false);
    }
  };

  const checkForWord = () => {
    if (selectedCells.length >= 3) {
      const letters = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
      const reversedLetters = letters.split('').reverse().join('');
      
      const foundWord = wordsToFind.find(word => 
        word === letters.toUpperCase() || word === reversedLetters.toUpperCase()
      );
      
      if (foundWord && !foundWords.includes(foundWord)) {
        setFoundWords(prev => [...prev, foundWord]);
        setFoundWordPositions(prev => ({
          ...prev,
          [foundWord]: [...selectedCells]
        }));
        toast.success(`Found: ${foundWord}! 🎉`, {
          description: `${foundWords.length + 1}/${wordsToFind.length} words found`
        });
        
        // Check completion
        if (foundWords.length + 1 === wordsToFind.length) {
          setIsComplete(true);
          toast.success('🎊 Congratulations! All words found!');
        }
      } else if (foundWord && foundWords.includes(foundWord)) {
        toast.info(`Already found: ${foundWord}`);
      } else {
        toast.error('Word not found. Keep looking!');
      }
    }
    setSelectedCells([]);
  };

  const clearSelection = () => {
    setSelectedCells([]);
    setIsSelecting(false);
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

  const isCellInFoundWord = (row: number, col: number) => {
    return Object.values(foundWordPositions).some(positions =>
      positions.some(pos => pos.row === row && pos.col === col)
    );
  };

  const getCompletionRating = () => {
    const percentage = (foundWords.length / wordsToFind.length) * 100;
    if (percentage === 100 && timeElapsed < 120) return { text: "Lightning Fast!", color: "text-yellow-400", icon: <Zap className="w-5 h-5" /> };
    if (percentage === 100) return { text: "Perfect!", color: "text-green-400", icon: <Award className="w-5 h-5" /> };
    if (percentage >= 80) return { text: "Great Job!", color: "text-blue-400", icon: <Star className="w-5 h-5" /> };
    return { text: "Good Try!", color: "text-purple-400", icon: <Trophy className="w-5 h-5" /> };
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
                      {difficulty} Word Search
                    </Badge>
                    <div className="flex items-center space-x-2 text-white bg-[#4a4a46] px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{formatTime(timeElapsed)}</span>
                    </div>
                    <div className="text-white bg-[#4a4a46] px-3 py-1 rounded-full">
                      Found: <span className="font-bold text-[#759900]">{foundWords.length}</span>/<span className="font-bold">{wordsToFind.length}</span>
                    </div>
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#759900] to-[#6a8700] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(foundWords.length / wordsToFind.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    {/* Word Search Grid */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-2xl">
                      <h3 className="text-white font-semibold mb-6 text-xl">Word Search Grid</h3>
                      <div 
                        className="grid grid-cols-6 gap-1 max-w-md mx-auto select-none"
                        onMouseLeave={clearSelection}
                      >
                        {grid.map((row, rowIndex) =>
                          row.map((letter, colIndex) => (
                            <button
                              key={`${rowIndex}-${colIndex}`}
                              onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                              onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                              onMouseUp={handleCellMouseUp}
                              className={`
                                w-12 h-12 border text-center font-bold text-lg transition-all duration-200 cursor-pointer
                                ${isCellInFoundWord(rowIndex, colIndex)
                                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400 shadow-lg'
                                  : isCellSelected(rowIndex, colIndex)
                                    ? 'bg-gradient-to-br from-[#759900] to-[#6a8700] text-white border-[#759900] shadow-lg transform scale-105'
                                    : 'bg-gradient-to-br from-[#3d3d37] to-[#2c2c28] text-white border-[#4a4a46] hover:bg-[#4a4a46] hover:border-[#759900]'
                                }
                              `}
                            >
                              {letter}
                            </button>
                          ))
                        )}
                      </div>
                      
                      <div className="mt-6 flex justify-center space-x-4">
                        <Button
                          onClick={clearSelection}
                          variant="outline"
                          className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] transition-all duration-200"
                        >
                          Clear Selection
                        </Button>
                        <div className="text-[#b8b8b8] text-sm flex items-center">
                          💡 Tip: Click and drag to select words
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Words to Find */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-6 shadow-xl">
                      <h3 className="text-white font-semibold mb-4 flex items-center">
                        <Eye className="w-5 h-5 mr-2" />
                        Words to Find
                      </h3>
                      <div className="space-y-3">
                        {wordsToFind.map((word, index) => (
                          <div
                            key={index}
                            className={`
                              p-3 rounded-lg text-center font-bold transition-all duration-300 transform
                              ${foundWords.includes(word)
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105 animate-pulse'
                                : 'bg-gradient-to-br from-[#3d3d37] to-[#2c2c28] text-white hover:bg-[#4a4a46]'
                              }
                            `}
                          >
                            {foundWords.includes(word) && <CheckCircle2 className="w-4 h-4 inline mr-2" />}
                            {word}
                            {foundWords.includes(word) && ' ✓'}
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    {/* Game Controls */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-6 shadow-xl">
                      <h3 className="text-white font-semibold mb-4">Game Controls</h3>
                      <div className="space-y-3">
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
                          <h3 className="font-bold text-2xl mb-2">All Words Found!</h3>
                          <div className="flex items-center justify-center space-x-2 mb-3">
                            {getCompletionRating().icon}
                            <span className={`text-lg font-semibold ${getCompletionRating().color}`}>
                              {getCompletionRating().text}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm opacity-90">
                            <p>Time: {formatTime(timeElapsed)}</p>
                            <p>Words found: {foundWords.length}/{wordsToFind.length}</p>
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
                  <Search className="w-16 h-16 text-[#759900] mr-4 animate-pulse" />
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-[#b8b8b8] bg-clip-text text-transparent">
                    Word Search
                  </h1>
                </div>
                <p className="text-[#b8b8b8] text-xl">Find hidden words in letter grids</p>
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <Badge className="bg-green-600 text-white">
                    <Users className="w-4 h-4 mr-1" />
                    643 players online
                  </Badge>
                  <Badge className="bg-orange-600 text-white">
                    <Trophy className="w-4 h-4 mr-1" />
                    Weekly tournament
                  </Badge>
                </div>
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
                            {diff === 'easy' && '6x6 Grid • 5 words'}
                            {diff === 'medium' && '8x8 Grid • 8 words'}
                            {diff === 'hard' && '12x12 Grid • 12 words'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-[#759900] to-[#6a8700] border-[#759900] p-8 text-center shadow-2xl">
                  <h2 className="text-2xl font-semibold text-white mb-6">Ready to Search?</h2>
                  <Button
                    onClick={startGame}
                    className="bg-white hover:bg-gray-100 text-[#759900] px-12 py-4 text-xl font-bold transform transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Search
                  </Button>
                </Card>

                <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Trophy className="w-6 h-6 mr-3 text-yellow-400" />
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-[#759900]">67</div>
                      <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-blue-400">1:23</div>
                      <div className="text-[#b8b8b8] text-sm">Best Time</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-yellow-400">845</div>
                      <div className="text-[#b8b8b8] text-sm">Words Found</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-3xl font-bold text-purple-400">94%</div>
                      <div className="text-[#b8b8b8] text-sm">Success Rate</div>
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

export default WordSearch;
