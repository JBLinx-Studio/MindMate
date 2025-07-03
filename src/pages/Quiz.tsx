
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Brain, 
  Clock, 
  Star,
  Zap,
  Target,
  Trophy,
  Users,
  BookOpen,
  Globe,
  Calculator,
  FlaskConical,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

const Quiz = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [category, setCategory] = useState<'general' | 'science' | 'history' | 'sports'>('general');
  const [gameMode, setGameMode] = useState<'menu' | 'playing'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  // Sample questions (in a real app, these would come from an API)
  const sampleQuestions = {
    general: [
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: "Paris"
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: "Mars"
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: "Pacific"
      }
    ],
    science: [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: "Au"
      },
      {
        question: "How many bones are in an adult human body?",
        options: ["206", "208", "210", "212"],
        correct: "206"
      }
    ],
    history: [
      {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: "1945"
      }
    ],
    sports: [
      {
        question: "How many players are on a basketball team on the court?",
        options: ["4", "5", "6", "7"],
        correct: "5"
      }
    ]
  };

  const startGame = () => {
    const categoryQuestions = sampleQuestions[category] || sampleQuestions.general;
    setQuestions(categoryQuestions);
    setGameMode('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setIsComplete(false);
    toast.success(`Starting ${difficulty} ${category} quiz!`);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (!selectedAnswer) return;
    
    const correct = questions[currentQuestion]?.correct === selectedAnswer;
    if (correct) {
      setScore(prev => prev + 1);
      toast.success('Correct!');
    } else {
      toast.error(`Wrong! The answer was ${questions[currentQuestion]?.correct}`);
    }

    if (currentQuestion + 1 >= questions.length) {
      setIsComplete(true);
      toast.success('Quiz completed!');
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      default: return 'text-blue-400 border-blue-400';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'science': return <FlaskConical className="w-4 h-4" />;
      case 'history': return <BookOpen className="w-4 h-4" />;
      case 'sports': return <Trophy className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === 'playing' && !isComplete && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            if (currentQuestion + 1 >= questions.length) {
              setIsComplete(true);
            } else {
              setCurrentQuestion(prev => prev + 1);
              setSelectedAnswer(null);
              return 30;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameMode, isComplete, timeLeft, currentQuestion, questions.length]);

  if (gameMode === 'playing') {
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
                    onClick={() => setGameMode('menu')}
                    className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                  >
                    ← Back to Menu
                  </Button>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={`${getDifficultyColor(difficulty)} bg-transparent flex items-center space-x-1`}>
                      <Target className="w-4 h-4" />
                      <span>{difficulty.toUpperCase()}</span>
                    </Badge>
                    <Badge className="bg-blue-600 text-white flex items-center space-x-1">
                      {getCategoryIcon(category)}
                      <span>{category.toUpperCase()}</span>
                    </Badge>
                    <div className="flex items-center space-x-2 text-white">
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft}s</span>
                    </div>
                    <div className="text-white">Score: {score}/{questions.length}</div>
                  </div>
                </div>
                
                {!isComplete ? (
                  <div className="space-y-6">
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h2 className="text-white text-lg font-semibold">
                            Question {currentQuestion + 1} of {questions.length}
                          </h2>
                          <div className="text-[#b8b8b8] text-sm">
                            Time: {timeLeft}s
                          </div>
                        </div>
                        <div className="w-full bg-[#4a4a46] rounded-full h-2">
                          <div 
                            className="bg-[#759900] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <h3 className="text-white text-xl mb-6">
                        {questions[currentQuestion]?.question}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {questions[currentQuestion]?.options.map((option: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                              selectedAnswer === option
                                ? 'border-[#759900] bg-[#759900]/20 text-white'
                                : 'border-[#4a4a46] bg-[#3d3d37] text-[#b8b8b8] hover:border-[#759900] hover:bg-[#4a4a46]'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedAnswer === option
                                  ? 'border-[#759900] bg-[#759900] text-white'
                                  : 'border-[#4a4a46]'
                              }`}>
                                {selectedAnswer === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={submitAnswer}
                        disabled={!selectedAnswer}
                        className="w-full bg-[#759900] hover:bg-[#6a8700] text-white"
                      >
                        Submit Answer
                      </Button>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-8 text-center">
                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[#759900]" />
                    <h2 className="text-white text-2xl font-bold mb-4">Quiz Complete!</h2>
                    <div className="text-[#b8b8b8] text-lg mb-6">
                      Your Score: {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button
                        onClick={() => setGameMode('menu')}
                        variant="outline"
                        className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Quiz
                      </Button>
                      <Button
                        onClick={startGame}
                        className="bg-[#759900] hover:bg-[#6a8700] text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                    </div>
                  </Card>
                )}
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
                  <Brain className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Quiz Challenge</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Test your knowledge across various topics</p>
              </div>

              <div className="space-y-6">
                {/* Category Selection */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Choose Category
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['general', 'science', 'history', 'sports'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200
                          ${category === cat 
                            ? 'border-[#759900] bg-[#759900]/20 text-white' 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            {getCategoryIcon(cat)}
                          </div>
                          <div className="text-sm font-semibold capitalize">{cat}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

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
                          <div className="text-lg font-semibold capitalize">{diff}</div>
                          <div className="text-sm opacity-75">
                            {diff === 'easy' && '10 questions'}
                            {diff === 'medium' && '15 questions'}
                            {diff === 'hard' && '20 questions'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Start Game */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <h2 className="text-xl font-semibold text-white mb-4">Ready to Start?</h2>
                  <Button
                    onClick={startGame}
                    className="bg-[#759900] hover:bg-[#6a8700] text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz
                  </Button>
                </Card>

                {/* Stats */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Your Stats
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">23</div>
                      <div className="text-[#b8b8b8] text-sm">Quizzes Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">87%</div>
                      <div className="text-[#b8b8b8] text-sm">Average Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">5</div>
                      <div className="text-[#b8b8b8] text-sm">Win Streak</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">Gold</div>
                      <div className="text-[#b8b8b8] text-sm">Current Rank</div>
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

export default Quiz;
