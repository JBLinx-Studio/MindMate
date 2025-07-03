
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Crown, 
  Clock, 
  Zap, 
  Trophy, 
  Users,
  Star,
  Target,
  Settings,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ChessLobby = () => {
  const navigate = useNavigate();

  const handlePlayNow = (gameType: string) => {
    toast.success(`Starting ${gameType} game!`);
    navigate('/chess');
  };

  const timeControls = [
    { id: '1+0', name: 'Bullet', time: '1 min', icon: <Zap className="w-4 h-4" />, color: 'bg-red-500' },
    { id: '3+0', name: 'Blitz', time: '3 min', icon: <Clock className="w-4 h-4" />, color: 'bg-orange-500' },
    { id: '5+0', name: 'Blitz', time: '5 min', icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-500' },
    { id: '10+0', name: 'Rapid', time: '10 min', icon: <Crown className="w-4 h-4" />, color: 'bg-green-500' },
    { id: '30+0', name: 'Classical', time: '30 min', icon: <Trophy className="w-4 h-4" />, color: 'bg-blue-500' }
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
                  <Crown className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Chess Lobby</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Choose your game mode and start playing</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Quick Play Section */}
                <div className="xl:col-span-2 space-y-6">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Play className="w-5 h-5 mr-2 text-[#759900]" />
                      Quick Play
                    </h2>
                    <p className="text-[#b8b8b8] mb-6">Find an opponent and start playing instantly</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                      {timeControls.map((control) => (
                        <button
                          key={control.id}
                          className="p-4 rounded-lg border-2 border-[#4a4a46] hover:border-[#759900] transition-all duration-200 group"
                        >
                          <div className="text-center">
                            <div className={`p-2 rounded-full ${control.color} text-white mb-2 mx-auto w-fit`}>
                              {control.icon}
                            </div>
                            <div className="text-white text-sm font-medium">{control.name}</div>
                            <div className="text-[#b8b8b8] text-xs">{control.time}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => handlePlayNow('Quick Match')}
                        className="bg-[#759900] hover:bg-[#6a8700] text-white py-3 flex items-center justify-center"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Play Now
                      </Button>
                      <Button
                        variant="outline"
                        className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] py-3 flex items-center justify-center"
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        Custom Game
                      </Button>
                    </div>
                  </Card>

                  {/* Game Modes */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-400" />
                      Game Modes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#3d3d37] rounded-lg p-4 hover:bg-[#4a4a46] transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">vs Computer</h3>
                          <Badge className="bg-green-600 text-white text-xs">Available</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Practice against AI with adjustable difficulty</p>
                        <Button 
                          size="sm" 
                          onClick={() => handlePlayNow('vs Computer')}
                          className="bg-[#759900] hover:bg-[#6a8700] text-white"
                        >
                          Play vs AI
                        </Button>
                      </div>
                      
                      <div className="bg-[#3d3d37] rounded-lg p-4 hover:bg-[#4a4a46] transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Tournament</h3>
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">Live</Badge>
                        </div>
                        <p className="text-[#b8b8b8] text-sm mb-3">Join ongoing tournaments and compete</p>
                        <Button 
                          size="sm" 
                          onClick={() => navigate('/tournaments')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          Join Tournament
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Live Games */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-400" />
                      Live Games
                    </h3>
                    <div className="space-y-3">
                      {[
                        { player: 'GrandMaster_X', rating: 2100, time: '10+0' },
                        { player: 'ChessKnight', rating: 1850, time: '5+0' },
                        { player: 'TacticalWiz', rating: 1920, time: '15+10' }
                      ].map((game, index) => (
                        <div key={index} className="bg-[#3d3d37] rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white text-sm font-medium">{game.player}</span>
                            <Button size="sm" className="bg-[#759900] hover:bg-[#6a8700] text-white text-xs">
                              Challenge
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-[#b8b8b8]">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{game.rating}</span>
                            <span>•</span>
                            <span>{game.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Your Stats */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Your Stats
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Rating:</span>
                        <span className="text-[#759900] font-medium">1687</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Games Played:</span>
                        <span className="text-[#759900] font-medium">247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Win Rate:</span>
                        <span className="text-[#759900] font-medium">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Current Streak:</span>
                        <span className="text-[#759900] font-medium">5 wins</span>
                      </div>
                    </div>
                  </Card>

                  {/* Daily Tournament */}
                  <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-600/30 p-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Daily Blitz Arena
                    </h3>
                    <p className="text-[#b8b8b8] text-sm mb-3">
                      147 players • Starts in 12 minutes
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-[#b8b8b8] text-xs">Prize: Premium</div>
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        Join
                      </Button>
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

export default ChessLobby;
