
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Type, 
  Clock, 
  Star,
  CheckCircle2,
  XCircle,
  Trophy,
  Play,
  RotateCcw,
  Lightbulb,
  Target,
  Zap,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

interface WordPuzzle {
  word: string;
  clue: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  hints: string[];
}

const DailyWord = () => {
  const [gameMode, setGameMode] = useState<'menu' | 'playing' | 'results'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzle | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(6);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Sample word puzzles (in a real app, these would come from an AI API)
  const samplePuzzles: { [key: string]: WordPuzzle[] } = {
    easy: [
      {
        word: 'RAINBOW',
        clue: 'Colorful arc in the sky after rain',
        difficulty: 'easy',
        category: 'Nature',
        hints: ['Has 7 colors', 'Appears with sunlight and rain', 'Symbol of hope']
      },
      {
        word: 'BUTTERFLY',
        clue: 'Insect that transforms from a caterpillar',
        difficulty: 'easy',
        category: 'Animals',
        hints: ['Has colorful wings', 'Goes through metamorphosis', 'Drinks nectar']
      }
    ],
    medium: [
      {
        word: 'SYMPHONY',
        clue: 'Large musical composition for orchestra',
        difficulty: 'medium',
        category: 'Music',
        hints: ['Usually has multiple movements', 'Performed by full orchestra', 'Beethoven wrote nine famous ones']
      },
      {
        word: 'TELESCOPE',
        clue: 'Instrument for viewing distant objects',
        difficulty: 'medium',
        category: 'Science',
        hints: ['Used in astronomy', 'Magnifies distant objects', 'Galileo used one']
      }
    ],
    hard: [
      {
        word: 'SERENDIPITY',
        clue: 'Pleasant surprise or fortunate accident',
        difficulty: 'hard',
        category: 'Abstract',
        hints: ['Happy coincidence', 'Unexpected good fortune', 'Finding something valuable by chance']
      },
      {
        word: 'EPHEMERAL',
        clue: 'Lasting for a very short time',
        difficulty: 'hard',
        category: 'Abstract',
        hints: ['Temporary', 'Fleeting', 'Like morning dew']
      }
    ]
  };

  const startGame = () => {
    const puzzles = samplePuzzles[difficulty];
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    setCurrentPuzzle(randomPuzzle);
    setGameMode('playing');
    setUserGuess('');
    setAttempts(0);
    setHintsUsed(0);
    setGameComplete(false);
    setIsCorrect(false);
    setTimeElapsed(0);
    toast.success(`Starting ${difficulty} word puzzle!`);
  };

  const handleGuess = () => {
    if (!currentPuzzle || !userGuess.trim()) return;
    
    const guess = userGuess.toUpperCase().trim();
    const correct = guess === currentPuzzle.word;
    
    setAttempts(prev => prev + 1);
    
    if (correct) {
      setIsCorrect(true);
      setGameComplete(true);
      toast.success('Congratulations! You got it right!');
    } else {
      toast.error('Not quite right, try again!');
      if (attempts + 1 >= maxAttempts) {
        setGameComplete(true);
        toast.error(`Game over! The word was: ${currentPuzzle.word}`);
      }
    }
    
    setUserGuess('');
  };

  const useHint = () => {
    if (!currentPuzzle || hintsUsed >= currentPuzzle.hints.length) return;
    
    const hint = currentPuzzle.hints[hintsUsed];
    setHintsUsed(prev => prev + 1);
    toast.info(`Hint: ${hint}`);
  };

  const resetGame = () => {
    setGameMode('menu');
    setCurrentPuzzle(null);
    setUserGuess('');
    setAttempts(0);
    setHintsUsed(0);
    setGameComplete(false);
    setIsCorrect(false);
    setTimeElapsed(0);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === 'playing' && !gameComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode, gameComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'easy': return <Star className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'hard': return <Brain className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (gameMode === 'playing' && currentPuzzle) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#161512]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <Button 
                    variant="outline"
                    onClick={resetGame}
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
                    <div className="text-white">Attempts: {attempts}/{maxAttempts}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-8">
                      <div className="text-center mb-8">
                        <Badge className="mb-4 bg-[#3d3d37] text-[#b8b8b8]">
                          {currentPuzzle.category}
                        </Badge>
                        <h2 className="text-2xl font-semibold text-white mb-6">
                          {currentPuzzle.clue}
                        </h2>
                        <div className="text-[#b8b8b8] mb-4">
                          Word Length: {currentPuzzle.word.length} letters
                        </div>
                      </div>
                      
                      {!gameComplete && (
                        <div className="space-y-4">
                          <Input
                            value={userGuess}
                            onChange={(e) => setUserGuess(e.target.value)}
                            placeholder="Enter your guess..."
                            className="bg-[#3d3d37] border-[#4a4a46] text-white text-center text-xl font-mono uppercase"
                            maxLength={currentPuzzle.word.length}
                            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                          />
                          <Button
                            onClick={handleGuess}
                            className="w-full bg-[#759900] hover:bg-[#6a8700] text-white"
                            disabled={!userGuess.trim()}
                          >
                            Submit Guess
                          </Button>
                        </div>
                      )}
                      
                      {gameComplete && (
                        <div className="text-center">
                          {isCorrect ? (
                            <div className="text-green-400">
                              <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
                              <h3 className="text-2xl font-bold mb-2">Correct!</h3>
                              <p>You solved it in {attempts} attempts!</p>
                            </div>
                          ) : (
                            <div className="text-red-400">
                              <XCircle className="w-16 h-16 mx-auto mb-4" />
                              <h3 className="text-2xl font-bold mb-2">Game Over</h3>
                              <p>The word was: <span className="font-mono text-white">{currentPuzzle.word}</span></p>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3">Game Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-[#b8b8b8]">
                          <span>Category:</span>
                          <span className="text-white">{currentPuzzle.category}</span>
                        </div>
                        <div className="flex justify-between text-[#b8b8b8]">
                          <span>Difficulty:</span>
                          <span className="text-white capitalize">{currentPuzzle.difficulty}</span>
                        </div>
                        <div className="flex justify-between text-[#b8b8b8]">
                          <span>Letters:</span>
                          <span className="text-white">{currentPuzzle.word.length}</span>
                        </div>
                        <div className="flex justify-between text-[#b8b8b8]">
                          <span>Hints Used:</span>
                          <span className="text-white">{hintsUsed}/{currentPuzzle.hints.length}</span>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3">Actions</h3>
                      <div className="space-y-2">
                        <Button
                          onClick={useHint}
                          variant="outline"
                          className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] flex items-center justify-center"
                          disabled={gameComplete || hintsUsed >= currentPuzzle.hints.length}
                        >
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Get Hint ({currentPuzzle.hints.length - hintsUsed} left)
                        </Button>
                        <Button
                          onClick={startGame}
                          variant="outline"
                          className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] flex items-center justify-center"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          New Puzzle
                        </Button>
                      </div>
                    </Card>
                    
                    {gameComplete && (
                      <Card className={`${isCorrect ? 'bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900]' : 'bg-gradient-to-br from-red-600 to-red-700 border-red-600'} p-4`}>
                        <div className="text-center text-white">
                          {isCorrect ? (
                            <Trophy className="w-12 h-12 mx-auto mb-2" />
                          ) : (
                            <XCircle className="w-12 h-12 mx-auto mb-2" />
                          )}
                          <h3 className="font-bold text-lg mb-1">
                            {isCorrect ? 'Well Done!' : 'Better Luck Next Time!'}
                          </h3>
                          <p className="text-sm opacity-90">Time: {formatTime(timeElapsed)}</p>
                          <p className="text-sm opacity-90">Attempts: {attempts}</p>
                          <p className="text-sm opacity-90">Hints: {hintsUsed}</p>
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
                  <h1 className="text-4xl font-bold text-white">Daily Word Puzzle</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Challenge your vocabulary with AI-generated word puzzles</p>
              </div>

              <div className="space-y-6">
                {/* Difficulty Selection */}
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
                            {diff === 'easy' && '6-8 letters'}
                            {diff === 'medium' && '8-10 letters'}
                            {diff === 'hard' && '10+ letters'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Start Game */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <h2 className="text-xl font-semibold text-white mb-4">Ready to Play?</h2>
                  <p className="text-[#b8b8b8] mb-6">
                    Solve word puzzles with clues and hints. Use your vocabulary skills to guess the word!
                  </p>
                  <Button
                    onClick={startGame}
                    className="bg-[#759900] hover:bg-[#6a8700] text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Puzzle
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
                      <div className="text-2xl font-bold text-[#759900]">23</div>
                      <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">78%</div>
                      <div className="text-[#b8b8b8] text-sm">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">2:45</div>
                      <div className="text-[#b8b8b8] text-sm">Average Time</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">5</div>
                      <div className="text-[#b8b8b8] text-sm">Daily Streak</div>
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

export default DailyWord;
