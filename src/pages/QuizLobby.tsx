
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Brain, 
  Globe, 
  Target,
  FlaskConical,
  BookOpen,
  Trophy,
  Calculator,
  Users,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const QuizLobby = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'science' | 'history' | 'sports'>('general');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handlePlayNow = () => {
    toast.success(`Starting ${selectedDifficulty} ${selectedCategory} quiz!`);
    navigate('/quiz');
  };

  const categories = [
    { id: 'general', name: 'General', icon: <Brain className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'science', name: 'Science', icon: <FlaskConical className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'history', name: 'History', icon: <BookOpen className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'sports', name: 'Sports', icon: <Trophy className="w-4 h-4" />, color: 'text-orange-400' }
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', questions: 10, color: 'text-green-400' },
    { id: 'medium', name: 'Medium', questions: 15, color: 'text-yellow-400' },
    { id: 'hard', name: 'Hard', questions: 20, color: 'text-red-400' }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                >
                  ← Back to Games
                </Button>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Brain className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Quiz Lobby</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Test your knowledge across various topics</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                  
                  {/* Category Selection */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-[#759900]" />
                      Choose Category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id as any)}
                          className={`
                            p-4 rounded-lg border-2 transition-all duration-200
                            ${selectedCategory === cat.id 
                              ? `border-[#759900] bg-[#759900]/20 ${cat.color}` 
                              : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                            }
                          `}
                        >
                          <div className="text-center">
                            <div className="flex justify-center mb-2">
                              {cat.icon}
                            </div>
                            <div className="text-sm font-semibold">{cat.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Card>

                  {/* Difficulty Selection */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-400" />
                      Choose Difficulty
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {difficulties.map((diff) => (
                        <button
                          key={diff.id}
                          onClick={() => setSelectedDifficulty(diff.id as any)}
                          className={`
                            p-4 rounded-lg border-2 transition-all duration-200
                            ${selectedDifficulty === diff.id 
                              ? `border-[#759900] bg-[#759900]/20 ${diff.color}` 
                              : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                            }
                          `}
                        >
                          <div className="text-center">
                            <div className="text-sm font-semibold">{diff.name}</div>
                            <div className="text-xs opacity-75">{diff.questions} questions</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={handlePlayNow}
                      className="w-full bg-[#759900] hover:bg-[#6a8700] text-white py-3 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Quiz - {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} ({selectedDifficulty})
                    </Button>
                  </Card>

                  {/* Game Modes */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Game Modes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Multiplayer Quiz</h3>
                          <Badge className="bg-green-600 text-white text-xs">4 Players</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Compete with other players in real-time</p>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Users className="w-4 h-4 mr-1" />
                          Join Match
                        </Button>
                      </div>
                      
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Speed Quiz</h3>
                          <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">Timed</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Answer as many questions as possible in 2 minutes</p>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                          <Clock className="w-4 h-4 mr-1" />
                          Speed Mode
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  
                  {/* Your Stats */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Your Stats
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Quizzes Completed:</span>
                        <span className="text-[#759900] font-medium">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Average Score:</span>
                        <span className="text-[#759900] font-medium">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Win Streak:</span>
                        <span className="text-[#759900] font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Current Rank:</span>
                        <span className="text-[#759900] font-medium">Gold</span>
                      </div>
                    </div>
                  </Card>

                  {/* Leaderboard */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Top Players
                    </h3>
                    <div className="space-y-2">
                      {[
                        { name: 'QuizMaster_X', score: 2890, rank: 1 },
                        { name: 'BrainiacPro', score: 2750, rank: 2 },
                        { name: 'KnowledgeKing', score: 2680, rank: 3 }
                      ].map((player) => (
                        <div key={player.rank} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              player.rank === 1 ? 'bg-yellow-500 text-black' :
                              player.rank === 2 ? 'bg-gray-400 text-black' :
                              'bg-orange-500 text-black'
                            }`}>
                              {player.rank}
                            </span>
                            <span className="text-white">{player.name}</span>
                          </div>
                          <span className="text-[#759900]">{player.score}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Daily Challenge */}
                  <Card className="bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900] p-4">
                    <h3 className="text-white font-semibold mb-2">Daily Challenge</h3>
                    <p className="text-white/90 text-sm mb-3">
                      Complete today's special quiz for bonus points!
                    </p>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white">
                      Start Challenge
                    </Button>
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

export default QuizLobby;
