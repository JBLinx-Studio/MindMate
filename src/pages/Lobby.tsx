import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Star, Play, Zap, Target } from 'lucide-react';
import LiveGameCard from '../components/LiveGameCard';
import { createLiveGamePool, updateLiveGame, generateLiveGame, LiveGame } from '../utils/liveGameGenerator';
import { toast } from 'sonner';

const Lobby = () => {
  const [liveGames, setLiveGames] = useState<LiveGame[]>(() => createLiveGamePool(6));
  const [onlineCount, setOnlineCount] = useState(47892);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Real-time game updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGames(prevGames => {
        const updatedGames = prevGames.map(updateLiveGame);
        
        // Replace finished games with new ones
        const activeGames = updatedGames.filter(game => game.gameStatus === 'active');
        const finishedGames = updatedGames.filter(game => game.gameStatus === 'finished');
        
        // Keep some finished games for a while, then replace with new ones
        const gamesToReplace = finishedGames.filter(() => Math.random() > 0.7);
        const newGames = gamesToReplace.map(() => generateLiveGame());
        
        return [
          ...activeGames,
          ...finishedGames.filter(game => !gamesToReplace.includes(game)),
          ...newGames
        ].slice(0, 8); // Keep max 8 games
      });

      // Update online player count
      setOnlineCount(prev => Math.max(30000, prev + Math.floor(Math.random() * 201) - 100));
    }, 3000); // Update every 3 seconds for more dynamic feel

    return () => clearInterval(interval);
  }, []);

  const handleWatchGame = (gameId: number) => {
    const game = liveGames.find(g => g.id === gameId);
    if (game) {
      toast.success(`Watching ${game.white.name} vs ${game.black.name}`, {
        description: `${game.category} • ${game.timeControl} • ${game.viewers} viewers`,
        duration: 3000,
      });
      // In a real app, this would navigate to a spectate view
    }
  };

  const handleQuickPairing = (category?: string) => {
    toast.success(`Looking for ${category || 'any'} game...`, {
      description: 'We\'ll match you with an opponent shortly!',
      duration: 2000,
    });
  };

  const filteredGames = selectedCategory === 'all' 
    ? liveGames 
    : liveGames.filter(game => game.category === selectedCategory);

  const gameCategories = [
    { id: 'all', name: 'All Games', icon: Star, color: 'text-[#b8b8b8]' },
    { id: 'bullet', name: 'Bullet', icon: Zap, color: 'text-red-400' },
    { id: 'blitz', name: 'Blitz', icon: Zap, color: 'text-yellow-400' },
    { id: 'rapid', name: 'Rapid', icon: Clock, color: 'text-green-400' },
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
                <h1 className="text-3xl font-bold text-white mb-2">Game Lobby</h1>
                <p className="text-[#b8b8b8]">Watch live games and find opponents</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Game Category Filter */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {gameCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`${
                              selectedCategory === category.id 
                                ? 'bg-[#759900] hover:bg-[#6a8700] text-white' 
                                : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
                            }`}
                          >
                            <IconComponent className={`w-4 h-4 mr-1 ${category.color}`} />
                            {category.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">Live Games</h2>
                      <div className="flex items-center space-x-4">
                        <span className="text-[#b8b8b8] text-sm">
                          {filteredGames.length} active games
                        </span>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-[#759900]">Live</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {filteredGames.map((game) => (
                        <LiveGameCard
                          key={game.id}
                          game={game}
                          onWatch={handleWatchGame}
                        />
                      ))}
                      
                      {filteredGames.length === 0 && (
                        <div className="text-center py-8 text-[#b8b8b8]">
                          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No {selectedCategory} games currently active</p>
                          <p className="text-sm">Try selecting a different category</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Pairing</h3>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-[#759900] hover:bg-[#6a8700]"
                        onClick={() => handleQuickPairing()}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Now
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                          onClick={() => handleQuickPairing('bullet')}
                        >
                          <Zap className="w-4 h-4 mr-1 text-red-400" />
                          Bullet
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                          onClick={() => handleQuickPairing('blitz')}
                        >
                          <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                          Blitz
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                          onClick={() => handleQuickPairing('rapid')}
                        >
                          <Clock className="w-4 h-4 mr-1 text-green-400" />
                          Rapid
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Custom
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Online Players</h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#759900] mb-2">
                        {onlineCount.toLocaleString()}
                      </div>
                      <div className="text-[#b8b8b8] text-sm">players online</div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-white font-medium">
                            {Math.floor(onlineCount * 0.23).toLocaleString()}
                          </div>
                          <div className="text-[#b8b8b8]">Playing</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {Math.floor(onlineCount * 0.12).toLocaleString()}
                          </div>
                          <div className="text-[#b8b8b8]">Watching</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Today's Activity</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Games played:</span>
                        <span className="text-white font-medium">
                          {(1247892 + Math.floor(Math.random() * 1000)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Active games:</span>
                        <span className="text-white font-medium">
                          {Math.floor(onlineCount * 0.115).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Tournaments:</span>
                        <span className="text-white font-medium">
                          {47 + Math.floor(Math.random() * 5)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Peak concurrent:</span>
                        <span className="text-white font-medium">
                          {(52439 + Math.floor(Math.random() * 2000)).toLocaleString()}
                        </span>
                      </div>
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

export default Lobby;
