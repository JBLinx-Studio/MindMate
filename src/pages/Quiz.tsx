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
  Target,
  CheckCircle2,
  Trophy,
  RotateCcw,
  Users,
  Zap,
  Award
} from 'lucide-react';
import { toast } from 'sonner';

const Quiz = () => {
  const [gameMode, setGameMode] = useState<'menu' | 'playing'>('menu');
  const [category, setCategory] = useState<'general' | 'science' | 'history' | 'sports'>('general');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Enhanced questions with more variety and difficulty
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      category: "general",
      difficulty: "easy",
      points: 100
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      category: "science",
      difficulty: "easy",
      points: 100
    },
    {
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: 1,
      category: "history",
      difficulty: "medium",
      points: 200
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correct: 2,
      category: "science",
      difficulty: "hard",
      points: 300
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
      correct: 2,
      category: "general",
      difficulty: "medium",
      points: 200
    }
  ];

  const startGame = () => {
    setGameMode('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setIsComplete(false);
    setStreak(0);
    setTotalPoints(0);
    toast.success(`Starting ${difficulty} ${category} quiz!`);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer !== null) {
      const correct = questions[currentQuestion].correct === selectedAnswer;
      const timeBonus = Math.max(0, timeLeft * 5);
      
      if (correct) {
        const points = questions[currentQuestion].points + timeBonus;
        setScore(prev => prev + 1);
        setStreak(prev => prev + 1);
        setTotalPoints(prev => prev + points);
        toast.success(`Correct! +${points} points`, {
          description: `${timeBonus > 0 ? `Time bonus: +${timeBonus}` : ''}`
        });
      } else {
        setStreak(0);
        toast.error('Incorrect!', {
          description: `Correct answer: ${questions[currentQuestion].options[questions[currentQuestion].correct]}`
        });
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(30);
      } else {
        setIsComplete(true);
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === 'playing' && timeLeft > 0 && !isComplete) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isComplete) {
      submitAnswer();
    }
    return () => clearInterval(interval);
  }, [gameMode, timeLeft, isComplete]);

  const getScoreRating = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { text: "Excellent!", color: "text-green-400", icon: <Award className="w-5 h-5" /> };
    if (percentage >= 70) return { text: "Good Job!", color: "text-blue-400", icon: <Star className="w-5 h-5" /> };
    if (percentage >= 50) return { text: "Not Bad!", color: "text-yellow-400", icon: <Target className="w-5 h-5" /> };
    return { text: "Keep Trying!", color: "text-red-400", icon: <RotateCcw className="w-5 h-5" /> };
  };

  if (gameMode === 'playing') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-[#161512] to-[#1a1916]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setGameMode('menu')}
                    className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] transition-all duration-200"
                  >
                    ← Back to Menu
                  </Button>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-gradient-to-r from-[#759900] to-[#6a8700] text-white px-3 py-1">
                      Question {currentQuestion + 1}/{questions.length}
                    </Badge>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${timeLeft <= 10 ? 'bg-red-600 animate-pulse' : 'bg-[#4a4a46]'} text-white`}>
                      <Clock className="w-4 h-4" />
                      <span className="font-bold">{timeLeft}s</span>
                    </div>
                    <div className="bg-[#4a4a46] text-white px-3 py-1 rounded-full">
                      Score: <span className="font-bold text-[#759900]">{score}</span>
                    </div>
                    <div className="bg-[#4a4a46] text-white px-3 py-1 rounded-full">
                      Points: <span className="font-bold text-yellow-400">{totalPoints}</span>
                    </div>
                    {streak > 1 && (
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full animate-pulse">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Streak: {streak}
                      </div>
                    )}
                  </div>
                </div>
                
                {!isComplete ? (
                  <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-2xl">
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-[#759900] border-[#759900]">
                            {questions[currentQuestion].category.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            {questions[currentQuestion].difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                          {questions[currentQuestion].question}
                        </h2>
                        <div className="w-full bg-[#1a1a16] rounded-full h-2 mb-4">
                          <div 
                            className="bg-gradient-to-r from-[#759900] to-[#6a8700] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`
                              w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02]
                              ${selectedAnswer === index 
                                ? 'border-[#759900] bg-gradient-to-r from-[#759900]/20 to-[#6a8700]/20 text-white shadow-lg shadow-[#759900]/30' 
                                : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900] hover:bg-[#3d3d37]'
                              }
                            `}
                          >
                            <div className="flex items-center">
                              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#4a4a46] text-white font-bold mr-4">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="font-medium">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={submitAnswer}
                        disabled={selectedAnswer === null}
                        className="w-full mt-8 bg-gradient-to-r from-[#759900] to-[#6a8700] hover:from-[#6a8700] hover:to-[#5a7600] text-white py-4 text-lg font-bold transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        Submit Answer
                      </Button>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 text-center shadow-2xl">
                    <div className="mb-6">
                      <CheckCircle2 className="w-20 h-20 text-[#759900] mx-auto mb-4 animate-bounce" />
                      <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        {getScoreRating().icon}
                        <span className={`text-xl font-semibold ${getScoreRating().color}`}>
                          {getScoreRating().text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="text-2xl font-bold text-[#759900]">{score}</div>
                        <div className="text-[#b8b8b8] text-sm">Correct Answers</div>
                      </div>
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-400">{totalPoints}</div>
                        <div className="text-[#b8b8b8] text-sm">Total Points</div>
                      </div>
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-400">{Math.round((score / questions.length) * 100)}%</div>
                        <div className="text-[#b8b8b8] text-sm">Accuracy</div>
                      </div>
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="text-2xl font-bold text-orange-400">{streak}</div>
                        <div className="text-[#b8b8b8] text-sm">Best Streak</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        onClick={() => setGameMode('menu')}
                        className="bg-gradient-to-r from-[#759900] to-[#6a8700] hover:from-[#6a8700] hover:to-[#5a7600] text-white px-6 py-3 transform transition-all duration-200 hover:scale-105"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#161512] to-[#1a1916]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="w-16 h-16 text-[#759900] mr-4 animate-pulse" />
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-[#b8b8b8] bg-clip-text text-transparent">
                    Quiz Challenge
                  </h1>
                </div>
                <p className="text-[#b8b8b8] text-xl">Test your knowledge across various topics</p>
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <Badge className="bg-green-600 text-white">
                    <Users className="w-4 h-4 mr-1" />
                    1,247 players online
                  </Badge>
                  <Badge className="bg-blue-600 text-white">
                    <Trophy className="w-4 h-4 mr-1" />
                    Daily leaderboard
                  </Badge>
                </div>
              </div>

              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-[#759900]" />
                    Choose Category
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(['general', 'science', 'history', 'sports'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`
                          p-6 rounded-xl border-2 transition-all duration-300 capitalize transform hover:scale-105
                          ${category === cat 
                            ? 'border-[#759900] bg-gradient-to-br from-[#759900]/20 to-[#6a8700]/20 text-[#759900] shadow-lg shadow-[#759900]/30' 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900] hover:bg-[#3d3d37]'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold">{cat}</div>
                          <div className="text-sm opacity-75 mt-1">
                            {cat === 'general' && '🧠 Mixed topics'}
                            {cat === 'science' && '🔬 Physics, Chemistry'}
                            {cat === 'history' && '📚 World events'}
                            {cat === 'sports' && '⚽ Athletics & Games'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-gradient-to-br from-[#2c2c28] to-[#252521] border-[#4a4a46] p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <Star className="w-6 h-6 mr-3 text-blue-400" />
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
                          <div className="text-lg font-bold">{diff}</div>
                          <div className="text-sm opacity-75 mt-1">
                            {diff === 'easy' && '100 pts per question'}
                            {diff === 'medium' && '200 pts per question'}
                            {diff === 'hard' && '300 pts per question'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-gradient-to-r from-[#759900] to-[#6a8700] border-[#759900] p-8 text-center shadow-2xl">
                  <Button
                    onClick={startGame}
                    className="bg-white hover:bg-gray-100 text-[#759900] px-12 py-4 text-xl font-bold transform transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} {category.charAt(0).toUpperCase() + category.slice(1)} Quiz
                  </Button>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Quiz;
