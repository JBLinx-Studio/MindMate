
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Grid3X3, 
  Target, 
  Star,
  Zap,
  Brain,
  Trophy,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SudokuLobby = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');

  const handlePlayNow = () => {
    toast.success(`Starting ${selectedDifficulty} Sudoku!`);
    navigate('/sudoku');
  };

  const difficulties = [
    { id: 'easy', name: 'Easy', clues: 45, icon: <Star className="w-4 h-4" />, color: 'text-green-400' },
    { id: 'medium', name: 'Medium', clues: 35, icon: <Zap className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: 'hard', name: 'Hard', clues: 25, icon: <Brain className="w-4 h-4" />, color: 'text-orange-400' },
    { id: 'expert', name: 'Expert', clues: 20, icon: <Target className="w-4 h-4" />, color: 'text-red-400' }
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
                  <Grid3X3 className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Sudoku Lobby</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Challenge your logic with number puzzles</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Main Content */}
                <div className="xl:col-span-2 space-y-6">
                  
                  {/* Difficulty Selection */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-[#759900]" />
                      Choose Difficulty
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
                            <div className="text-xs opacity-75">{diff.clues} clues</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={handlePlayNow}
                      className="w-full bg-[#759900] hover:bg-[#6a8700] text-white py-3 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Play Now - {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                    </Button>
                  </Card>

                  {/* Game Modes */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Game Modes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Daily Challenge</h3>
                          <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Solve today's special puzzle and compete on leaderboards</p>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Start Daily
                        </Button>
                      </div>
                      
                      <div className="bg-[#3d3d37] rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Speed Mode</h3>
                          <Badge variant="outline" className="text-orange-400 border-orange-400 text-xs">Timed</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Race against the clock to solve puzzles faster</p>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                          Speed Play
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
                        <span className="text-[#759900] font-medium">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Best Time:</span>
                        <span className="text-[#759900] font-medium">12:34</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Win Streak:</span>
                        <span className="text-[#759900] font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Accuracy:</span>
                        <span className="text-[#759900] font-medium">85%</span>
                      </div>
                    </div>
                  </Card>

                  {/* Today's Progress */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                      Today's Progress
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[#b8b8b8] text-sm">Daily Challenge</span>
                        <Badge className="bg-green-600 text-white text-xs">Complete</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#b8b8b8] text-sm">Easy Puzzles</span>
                        <span className="text-[#759900] text-sm">3/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#b8b8b8] text-sm">Medium Puzzles</span>
                        <span className="text-[#759900] text-sm">1/3</span>
                      </div>
                    </div>
                  </Card>

                  {/* Weekly Tournament */}
                  <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-600/30 p-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-purple-400" />
                      Weekly Tournament
                    </h3>
                    <p className="text-[#b8b8b8] text-sm mb-3">
                      89 players • 3 days left
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-[#b8b8b8] text-xs">Your Rank: #23</div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Join
                      </Button>
                    </div>
                  </Card>

                  {/* Daily Tips */}
                  <Card className="bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900] p-4">
                    <h3 className="text-white font-semibold mb-2">Daily Tip</h3>
                    <p className="text-white/90 text-sm">
                      Look for naked singles first - cells that can only contain one number!
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

export default SudokuLobby;
