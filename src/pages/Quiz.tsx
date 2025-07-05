
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
  Users
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

  // Sample questions for demo
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correct: 2,
      category: "general"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      category: "science"
    },
    {
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: 1,
      category: "history"
    }
  ];

  const startGame = () => {
    setGameMode('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setIsComplete(false);
    toast.success(`Starting ${difficulty} ${category} quiz!`);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer !== null) {
      const correct = questions[currentQuestion].correct === selectedAnswer;
      if (correct) {
        setScore(prev => prev + 1);
        toast.success('Correct!');
      } else {
        toast.error('Incorrect!');
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
                    <Badge className="bg-[#759900] text-white">
                      Question {currentQuestion + 1}/{questions.length}
                    </Badge>
                    <div className="flex items-center space-x-2 text-white">
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft}s</span>
                    </div>
                    <div className="text-white">Score: {score}</div>
                  </div>
                </div>
                
                {!isComplete ? (
                  <div className="space-y-6">
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <h2 className="text-xl font-semibold text-white mb-6">
                        {questions[currentQuestion].question}
                      </h2>
                      
                      <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`
                              w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                              ${selectedAnswer === index 
                                ? 'border-[#759900] bg-[#759900]/20 text-white' 
                                : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                              }
                            `}
                          >
                            <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                          </button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={submitAnswer}
                        disabled={selectedAnswer === null}
                        className="w-full mt-6 bg-[#759900] hover:bg-[#6a8700] text-white"
                      >
                        Submit Answer
                      </Button>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                    <CheckCircle2 className="w-16 h-16 text-[#759900] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                    <p className="text-[#b8b8b8] mb-4">
                      You scored {score} out of {questions.length} questions
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        onClick={() => setGameMode('menu')}
                        className="bg-[#759900] hover:bg-[#6a8700] text-white"
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
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Choose Category</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['general', 'science', 'history', 'sports'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 capitalize
                          ${category === cat 
                            ? 'border-[#759900] bg-[#759900]/20 text-[#759900]' 
                            : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                          }
                        `}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Choose Difficulty</h2>
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
                        {diff}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <Button
                    onClick={startGame}
                    className="bg-[#759900] hover:bg-[#6a8700] text-white px-8 py-3 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start Quiz
                  </Button>
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
