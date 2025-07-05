
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Type, 
  Target, 
  Star,
  Calendar,
  Brain,
  Trophy,
  Clock,
  TrendingUp,
  BookOpen,
  Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const CrosswordLobby = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedTheme, setSelectedTheme] = useState<'general' | 'science' | 'literature' | 'history'>('general');

  const handlePlayNow = () => {
    toast.success(`Starting ${selectedDifficulty} ${selectedTheme} crossword!`);
    navigate('/crossword');
  };

  const difficulties = [
    { id: 'easy', name: 'Easy', size: '9x9', icon: <Star className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'medium', name: 'Medium', size: '13x13', icon: <Target className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: 'hard', name: 'Hard', size: '15x15', icon: <Brain className="w-4 h-4" />, color: 'text-red-400' }
  ];

  const themes = [
    { id: 'general', name: 'General Knowledge', icon: <BookOpen className="w-4 h-4" />, color: 'text-blue-400' },
    { id: 'science', name: 'Science & Nature', icon: <Hash className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'literature', name: 'Literature & Arts', icon: <Type className="w-4 h-4" />, color: 'text-purple-400' },
    { id: 'history', name: 'History & Culture', icon: <Calendar className="w-4 h-4" />, color: 'text-orange-400' }
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
                  <Type className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Crossword Puzzles</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Classic word puzzles for vocabulary mastery</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                  
                  {/* Theme Selection */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-[#759900]" />
                      Choose Theme
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setSelectedTheme(theme.id as any)}
                          className={`
                            p-4 rounded-lg border-2 transition-all duration-200
                            ${selectedTheme === theme.id 
                              ? `border-[#759900] bg-[#759900]/20 ${theme.color}` 
                              : 'border-[#4a4a46] text-[#b8b8b8] hover:border-[#759900]'
                            }
                          `}
                        >
                          <div className="text-center">
                            <div className="flex justify-center mb-2">
                              {theme.icon}
                            </div>
                            <div className="text-sm font-semibold">{theme.name}</div>
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
                            <div className="flex justify-center mb-2">
                              {diff.icon}
                            </div>
                            <div className="text-sm font-semibold">{diff.name}</div>
                            <div className="text-xs opacity-75">{diff.size}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={handlePlayNow}
                      className="w-full bg-[#759900] hover:bg-[#6a8700] text-white py-3 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Crossword - {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} ({selectedDifficulty})
                    </Button>
                  </Card>

                  {/* Daily Challenges */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Special Challenges</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Daily Crossword</h3>
                          <Badge className="bg-blue-600 text-white text-xs">Today</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Fresh puzzle every day with unique themes</p>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Calendar className="w-4 h-4 mr-1" />
                          Play Daily
                        </Button>
                      </div>
                      
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Speed Crossword</h3>
                          <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">Timed</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Race against time for bonus points</p>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                          <Clock className="w-4 h-4 mr-1" />
                          Quick Play
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
                        <span className="text-[#b8b8b8]">Puzzles Solved:</span>
                        <span className="text-[#759900] font-medium">34</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Best Time:</span>
                        <span className="text-[#759900] font-medium">4:23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Current Streak:</span>
                        <span className="text-[#759900] font-medium">7</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Completion Rate:</span>
                        <span className="text-[#759900] font-medium">91%</span>
                      </div>
                    </div>
                  </Card>

                  {/* Progress Tracker */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                      Weekly Progress
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[#b8b8b8] text-sm">Mon - Daily</span>
                        <Badge className="bg-green-600 text-white text-xs">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#b8b8b8] text-sm">Tue - Daily</span>
                        <Badge className="bg-green-600 text-white text-xs">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#b8b8b8] text-sm">Wed - Daily</span>
                        <span className="text-orange-400 text-sm">In Progress</span>
                      </div>
                    </div>
                  </Card>

                  {/* Premium Tip */}
                  <Card className="bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900] p-4">
                    <h3 className="text-white font-semibold mb-2">Pro Tip</h3>
                    <p className="text-white/90 text-sm">
                      Start with the shortest clues first - they often provide key letters for longer words!
                    </p>
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

export default CrosswordLobby;
