
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Clock, 
  Star,
  CheckCircle2,
  XCircle,
  Trophy,
  Play,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const Quiz = () => {
  const [gameMode, setGameMode] = useState<'menu' | 'playing' | 'results'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('mixed');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const categories = [
    { id: 'mixed', name: 'Mixed Topics', icon: '🎯', color: 'text-blue-400' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'text-green-400' },
    { id: 'history', name: 'History', icon: '📚', color: 'text-yellow-400' },
    { id: 'geography', name: 'Geography', icon: '🌍', color: 'text-blue-400' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'text-red-400' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'text-purple-400' }
  ];

  // Sample questions (in a real app, these would come from an API)
  const sampleQuestions: Question[] = [
    {
      id: 1,
      category: 'science',
      question: 'What is the chemical symbol for gold?',
      options: ['Go', 'Gd', 'Au', 'Ag'],
      correct: 2,
      difficulty: 'easy'
    },
    {
      id: 2,
      category: 'history',
      question: 'Who was the first President of the United States?',
      options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'Benjamin Franklin'],
      correct: 1,
      difficulty: 'easy'
    },
    {
      id: 3,
      category: 'geography',
      question: 'What is the capital of Australia?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'],
      correct: 2,
      difficulty: 'medium'
    },
    {
      id: 4,
      category: 'science',
      question: 'What planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correct: 1,
      difficulty: 'easy'
    },
    {
      id: 5,
      category: 'entertainment',
      question: 'Who directed the movie "Titanic"?',
      options: ['Steven Spielberg', 'James Cameron', 'Christopher Nolan', 'Ridley Scott'],
      correct: 1,
      difficulty: 'medium'
    }
  ];

  const startQuiz = () => {
    const filteredQuestions = selectedCategory === 'mixed' 
      ? sampleQuestions 
      : sampleQuestions.filter(q => q.category === selectedCategory);
    
    setQuestions(filteredQuestions.slice(0, 5)); // Limit to 5 questions for demo
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setGameMode('playing');
    toast.success('Quiz started! Good luck!');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(answerIndex);
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = answerIndex;
      setUserAnswers(newAnswers);
      
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
        toast.success('Correct!');
      } else {
        toast.error('Incorrect!');
      }
      
      // Move to next question after 2 seconds
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setTimeLeft(30);
        } else {
          setGameMode('results');
        }
      }, 2000);
    }
  };

  const resetQuiz = () => {
    setGameMode('menu');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameMode === 'playing' && timeLeft > 0 && selectedAnswer === null) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      // Time's up, move to next question
      handleAnswerSelect(-1); // -1 indicates no answer
    }
    return () => clearInterval(interval);
  }, [gameMode, timeLeft, selectedAnswer]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (gameMode === 'results') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#161512]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-8 text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-[#759900]" />
                  <h1 className="text-3xl font-bold text-white mb-4">Quiz Complete!</h1>
                  
                  <div className="mb-6">
                    <div className={`text-6xl font-bold mb-2 ${getScoreColor(score, questions.length)}`}>
                      {score}/{questions.length}
                    </div>
                    <div className="text-[#b8b8b8]">
                      {Math.round((score / questions.length) * 100)}% Correct
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#759900]">{score}</div>
                      <div className="text-[#b8b8b8] text-sm">Correct</div>
                    </div>
                    <div className="bg-[#3d3d37] rounded-lg p-4">
                      <div className="text-2xl font-bold text-red-400">{questions.length - score}</div>
                      <div className="text-[#b8b8b8] text-sm">Incorrect</div>
                    </div>
                  </div>
                  
                  <div className="space-x-4">
                    <Button
                      onClick={startQuiz}
                      className="bg-[#759900] hover:bg-[#6a8700] text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play Again
                    </Button>
                    <Button
                      onClick={resetQuiz}
                      variant="outline"
                      className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Back to Menu
                    </Button>
                  </div>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (gameMode === 'playing' && questions.length > 0) {
    const question = questions[currentQuestion];
    
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#161512]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="text-blue-400 border-blue-400 bg-transparent">
                      Question {currentQuestion + 1} of {questions.length}
                    </Badge>
                    <div className="flex items-center space-x-4">
                      <Badge className={`${getDifficultyColor(question.difficulty)} bg-transparent border-current`}>
                        {question.difficulty.toUpperCase()}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-white" />
                        <span className={`text-lg font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                          {timeLeft}s
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={((currentQuestion + 1) / questions.length) * 100} 
                    className="mb-4"
                  />
                </div>
                
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-8">
                  <div className="mb-6">
                    <Badge className="mb-4 bg-[#3d3d37] text-[#b8b8b8]">
                      {question.category.toUpperCase()}
                    </Badge>
                    <h2 className="text-2xl font-semibold text-white mb-6">
                      {question.question}
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`
                          p-4 rounded-lg border-2 text-left transition-all duration-200
                          ${selectedAnswer === null 
                            ? 'border-[#4a4a46] text-white hover:border-[#759900] hover:bg-[#3d3d37]'
                            : selectedAnswer === index
                              ? index === question.correct
                                ? 'border-green-400 bg-green-400/20 text-green-400'
                                : 'border-red-400 bg-red-400/20 text-red-400'
                              : index === question.correct
                                ? 'border-green-400 bg-green-400/20 text-green-400'
                                : 'border-[#4a4a46] text-[#b8b8b8] opacity-50'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {selectedAnswer !== null && (
                            index === question.correct ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            ) : selectedAnswer === index ? (
                              <XCircle className="w-5 h-5 text-red-400" />
                            ) : null
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="text-[#b8b8b8]">Score: {score}/{questions.length}</div>
                  </div>
                </Card>
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
                  <h2 className="text-xl font-semibold text-white mb-4">Choose Category</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200
                          ${selectedCategory === category.id 
                            ? 'border-[#759900] bg-[#759900]/20 text-white' 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{category.icon}</div>
                          <div className="font-semibold">{category.name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Start Quiz */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <h2 className="text-xl font-semibold text-white mb-4">Ready to Start?</h2>
                  <p className="text-[#b8b8b8] mb-6">
                    You'll have 30 seconds per question. Answer as many as you can correctly!
                  </p>
                  <Button
                    onClick={startQuiz}
                    className="bg-[#759900] hover:bg-[#6a8700] text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                  </Button>
                </Card>

                {/* Quiz Stats */}
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Your Quiz Stats</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">89</div>
                      <div className="text-[#b8b8b8] text-sm">Quizzes Taken</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">76%</div>
                      <div className="text-[#b8b8b8] text-sm">Average Score</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">5</div>
                      <div className="text-[#b8b8b8] text-sm">Perfect Scores</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#759900]">Science</div>
                      <div className="text-[#b8b8b8] text-sm">Best Category</div>
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

export default Quiz;
