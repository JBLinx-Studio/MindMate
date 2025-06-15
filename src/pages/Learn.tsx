
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, CheckCircle, Clock, Users, Trophy, Target, Zap, Star, ArrowRight, ChevronRight } from 'lucide-react';

const Learn = () => {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);

  const lessons = [
    { 
      title: "What is chess?", 
      completed: true, 
      duration: "3 min",
      description: "Learn the objective and basic rules of chess",
      difficulty: "Beginner"
    },
    { 
      title: "How pieces move", 
      completed: true, 
      duration: "5 min",
      description: "Master the movement patterns of each piece",
      difficulty: "Beginner"
    },
    { 
      title: "Capturing pieces", 
      completed: true, 
      duration: "7 min",
      description: "Learn how to capture opponent pieces",
      difficulty: "Beginner"
    },
    { 
      title: "Check and checkmate", 
      completed: false, 
      duration: "10 min",
      description: "Understand the win conditions of chess",
      difficulty: "Beginner"
    },
    { 
      title: "Special moves", 
      completed: false, 
      duration: "12 min",
      description: "Castling, en passant, and pawn promotion",
      difficulty: "Intermediate"
    },
    { 
      title: "Basic tactics", 
      completed: false, 
      duration: "15 min",
      description: "Pins, forks, skewers, and discovered attacks",
      difficulty: "Intermediate"
    },
    { 
      title: "Opening principles", 
      completed: false, 
      duration: "20 min",
      description: "How to start your games effectively",
      difficulty: "Intermediate"
    },
    { 
      title: "Endgame basics", 
      completed: false, 
      duration: "25 min",
      description: "Essential endgame knowledge",
      difficulty: "Advanced"
    },
  ];

  const stats = [
    { label: "Lessons completed", value: "3/8", icon: BookOpen },
    { label: "Time spent learning", value: "15m", icon: Clock },
    { label: "Current streak", value: "3 days", icon: Zap },
    { label: "Knowledge rating", value: "850", icon: Trophy },
  ];

  const learningPaths = [
    {
      title: "Chess Fundamentals",
      description: "Master the basics of chess",
      lessons: 8,
      completed: 3,
      color: "bg-[#759900]"
    },
    {
      title: "Tactical Training",
      description: "Improve your pattern recognition",
      lessons: 12,
      completed: 0,
      color: "bg-[#dc7633]"
    },
    {
      title: "Endgame Mastery",
      description: "Essential endgame techniques",
      lessons: 15,
      completed: 0,
      color: "bg-[#3498db]"
    }
  ];

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-[#759900] bg-[#759900]/10';
      case 'Intermediate': return 'text-[#dc7633] bg-[#dc7633]/10';
      case 'Advanced': return 'text-[#e74c3c] bg-[#e74c3c]/10';
      default: return 'text-[#b8b8b8] bg-[#4a4a46]/10';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#759900] to-[#6a8700] rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Learn Chess</h1>
                    <p className="text-[#b8b8b8]">Master the game step by step</p>
                  </div>
                </div>
                
                {/* Progress Banner */}
                <Card className="bg-gradient-to-r from-[#2c2c28] to-[#3d3d37] border-[#4a4a46] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Your Progress</h3>
                      <p className="text-[#b8b8b8]">Keep learning to improve your chess skills</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#759900] mb-1">{Math.round(progressPercentage)}%</div>
                      <div className="text-[#b8b8b8] text-sm">Complete</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-[#4a4a46] rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-[#759900] to-[#8fb300] h-3 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="xl:col-span-3">
                  {/* Learning Paths */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-white mb-4">Learning Paths</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {learningPaths.map((path, index) => (
                        <Card key={index} className="bg-[#2c2c28] border-[#4a4a46] p-4 hover:border-[#759900] transition-all duration-200 cursor-pointer group">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`w-3 h-3 rounded-full ${path.color}`}></div>
                            <ChevronRight className="w-4 h-4 text-[#b8b8b8] group-hover:text-white transition-colors" />
                          </div>
                          <h3 className="text-white font-medium mb-2">{path.title}</h3>
                          <p className="text-[#b8b8b8] text-sm mb-3">{path.description}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#b8b8b8]">{path.completed}/{path.lessons} lessons</span>
                            <div className="w-16 bg-[#4a4a46] rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full ${path.color}`}
                                style={{ width: `${(path.completed / path.lessons) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Lessons */}
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Chess Fundamentals</h2>
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <div className="space-y-3">
                        {lessons.map((lesson, index) => (
                          <div 
                            key={index} 
                            className={`flex items-center justify-between bg-[#3d3d37] rounded-lg p-4 transition-all duration-200 hover:bg-[#4a4a46] cursor-pointer ${
                              activeLesson === index ? 'ring-2 ring-[#759900]' : ''
                            }`}
                            onClick={() => setActiveLesson(activeLesson === index ? null : index)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-3">
                                {lesson.completed ? (
                                  <div className="w-8 h-8 bg-[#759900] rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 border-2 border-[#4a4a46] rounded-full flex items-center justify-center text-[#b8b8b8] font-medium">
                                    {index + 1}
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-white font-medium">{lesson.title}</h3>
                                  <p className="text-[#b8b8b8] text-sm">{lesson.description}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                                  {lesson.difficulty}
                                </div>
                                <div className="text-[#b8b8b8] text-xs mt-1 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {lesson.duration}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className={lesson.completed ? "bg-[#4a4a46] text-[#b8b8b8]" : "bg-[#759900] hover:bg-[#6a8700]"}
                                disabled={lesson.completed}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                {lesson.completed ? "Completed" : "Start"}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Stats */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
                    <div className="space-y-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#4a4a46] rounded-lg flex items-center justify-center">
                              <stat.icon className="w-4 h-4 text-[#759900]" />
                            </div>
                            <span className="text-[#b8b8b8] text-sm">{stat.label}</span>
                          </div>
                          <span className="text-white font-medium">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Tips */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-[#759900]" />
                      Quick Tips
                    </h3>
                    <ul className="text-[#b8b8b8] text-sm space-y-3">
                      <li className="flex items-start space-x-2">
                        <Star className="w-3 h-3 mt-1 text-[#759900] flex-shrink-0" />
                        <span>Control the center squares (e4, e5, d4, d5)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="w-3 h-3 mt-1 text-[#759900] flex-shrink-0" />
                        <span>Castle early to keep your king safe</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="w-3 h-3 mt-1 text-[#759900] flex-shrink-0" />
                        <span>Develop knights before bishops</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="w-3 h-3 mt-1 text-[#759900] flex-shrink-0" />
                        <span>Don't move the same piece twice in opening</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <Star className="w-3 h-3 mt-1 text-[#759900] flex-shrink-0" />
                        <span>Look for tactics before moving</span>
                      </li>
                    </ul>
                  </Card>

                  {/* Related Activities */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Practice More</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start bg-transparent border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] hover:text-white">
                        <Target className="w-4 h-4 mr-2" />
                        Solve Puzzles
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] hover:text-white">
                        <Users className="w-4 h-4 mr-2" />
                        Play vs Computer
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] hover:text-white">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Study Games
                        <ArrowRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                  </Card>

                  {/* Achievement */}
                  <Card className="bg-gradient-to-br from-[#759900]/20 to-[#6a8700]/10 border-[#759900]/30 p-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-[#759900] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-medium mb-2">First Steps</h3>
                      <p className="text-[#b8b8b8] text-sm">Complete your first 3 lessons to unlock tactical training!</p>
                      <div className="mt-3 text-[#759900] font-medium">3/3 ✓</div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Learn;
