
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import GameTypeSelector from '../components/GameTypeSelector';
import QuickPairingPanel from '../components/QuickPairingPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Crown, 
  Users, 
  Trophy, 
  TrendingUp, 
  Gamepad2, 
  Star,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [showChessQuickPlay, setShowChessQuickPlay] = useState(false);

  const handleQuickChess = () => {
    setShowChessQuickPlay(true);
  };

  const handleBackToGameSelect = () => {
    setShowChessQuickPlay(false);
  };

  const featuredTournaments = [
    {
      id: 1,
      title: 'Weekly Chess Championship',
      game: 'Chess',
      participants: 1247,
      prize: '$500',
      timeLeft: '2 days',
      status: 'Open'
    },
    {
      id: 2,
      title: 'Daily Sudoku Challenge',
      game: 'Sudoku',
      participants: 856,
      prize: 'Premium Badge',
      timeLeft: '18 hours',
      status: 'Open'
    },
    {
      id: 3,
      title: 'Trivia Masters Cup',
      game: 'Quiz',
      participants: 2134,
      prize: '$200',
      timeLeft: '5 days',
      status: 'Open'
    }
  ];

  if (showChessQuickPlay) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#161512]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <Button 
                    variant="outline"
                    onClick={handleBackToGameSelect}
                    className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                  >
                    ← Back to Games
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold text-white mb-2">Chess - Quick Play</h1>
                      <p className="text-[#b8b8b8]">Find an opponent and start playing chess instantly</p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <QuickPairingPanel />
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
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                
                {/* Main Game Selection Area */}
                <div className="xl:col-span-3">
                  <GameTypeSelector />
                </div>

                {/* Sidebar Content */}
                <div className="xl:col-span-1 space-y-6">
                  
                  {/* Quick Actions */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-[#759900]" />
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={handleQuickChess}
                        className="w-full bg-[#759900] hover:bg-[#6a8700] text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Quick Chess
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                        onClick={() => navigate('/puzzles')}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Daily Puzzles
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                        onClick={() => navigate('/tournaments')}
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Tournaments
                      </Button>
                    </div>
                  </Card>

                  {/* Featured Tournaments */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                      Featured Tournaments
                    </h3>
                    <div className="space-y-3">
                      {featuredTournaments.map((tournament) => (
                        <div key={tournament.id} className="bg-[#3d3d37] rounded-lg p-3 hover:bg-[#4a4a46] transition-colors cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="text-white text-sm font-medium">{tournament.title}</h4>
                              <p className="text-[#b8b8b8] text-xs">{tournament.game}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-[#759900] border-[#759900] text-xs"
                            >
                              {tournament.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-3 text-[#b8b8b8]">
                              <span className="flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                {tournament.participants}
                              </span>
                              <span>{tournament.prize}</span>
                            </div>
                            <span className="text-orange-400">{tournament.timeLeft}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Live Stats */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                      Live Stats
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Players Online:</span>
                        <span className="text-[#759900] font-medium">12,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Games in Progress:</span>
                        <span className="text-[#759900] font-medium">3,421</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Daily Puzzles Solved:</span>
                        <span className="text-[#759900] font-medium">45,632</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Active Tournaments:</span>
                        <span className="text-[#759900] font-medium">27</span>
                      </div>
                    </div>
                  </Card>

                  {/* Today's Challenge */}
                  <Card className="bg-gradient-to-br from-[#759900] to-[#6a8700] border-[#759900] p-4">
                    <h3 className="text-white font-semibold mb-2 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Today's Challenge
                    </h3>
                    <p className="text-white/90 text-sm mb-3">
                      Complete 5 different game types to earn the "Multi-Game Master" badge!
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-white/80 text-xs">Progress: 2/5</div>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        Start Challenge
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

export default Index;
