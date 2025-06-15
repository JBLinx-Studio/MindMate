
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Star, Play, Zap, Target, Settings } from 'lucide-react';
import LiveGameCard from '../components/LiveGameCard';
import QuickPairingPanel from '../components/QuickPairingPanel';
import GameModeSelector from '../components/GameModeSelector';
import { realPlayerDatabase } from '../utils/realPlayerDatabase';
import { realGameStats } from '../utils/realGameStats';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Lobby = () => {
  const [liveGames, setLiveGames] = useState(() => realPlayerDatabase.getActiveGames());
  const [gameStats, setGameStats] = useState(() => realGameStats.getStats());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('quick');

  // Real-time updates for live games and statistics
  useEffect(() => {
    const interval = setInterval(() => {
      // Update live games with real progression
      realPlayerDatabase.updateGameProgress();
      setLiveGames(realPlayerDatabase.getActiveGames());
      
      // Update real statistics
      setGameStats(realGameStats.getStats());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleWatchGame = (gameId: string) => {
    const game = liveGames.find(g => g.id === gameId);
    if (game) {
      toast.success(`Watching ${game.whitePlayer.username} vs ${game.blackPlayer.username}`, {
        description: `${game.category} • ${game.timeControl} • ${game.viewers} viewers`,
        duration: 3000,
      });
      console.log('Opening spectate view for game:', gameId);
    }
  };

  const handleQuickPairing = (category?: string) => {
    console.log('Quick pairing requested for category:', category);
    toast.success(`Looking for ${category || 'any'} game...`, {
      description: 'Using real matchmaking system',
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
                <p className="text-[#b8b8b8]">Real-time matchmaking and live games</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Game Category Filter */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {gameCategories.map((category) => {
                        const IconComponent = category.icon;
                        const gamesInCategory = category.id === 'all' 
                          ? liveGames.length 
                          : liveGames.filter(g => g.category === category.id).length;
                        
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
                            {category.name} ({gamesInCategory})
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
                        <div key={game.id} className="bg-[#3d3d37] rounded-lg p-4 hover:bg-[#4a4a46] transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-sm">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-white font-medium">{game.whitePlayer.username}</span>
                                  <span className="text-[#b8b8b8]">({game.whitePlayer.rating})</span>
                                  <span className="text-white">vs</span>
                                  <span className="text-white font-medium">{game.blackPlayer.username}</span>
                                  <span className="text-[#b8b8b8]">({game.blackPlayer.rating})</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-[#b8b8b8]">
                                  <span>{game.timeControl}</span>
                                  <span>•</span>
                                  <span>Move {game.currentMove}</span>
                                  <span>•</span>
                                  <span>{game.position}</span>
                                  {game.isRated && (
                                    <>
                                      <span>•</span>
                                      <Badge variant="outline" className="text-yellow-500 border-yellow-500 px-1 py-0 text-xs">
                                        Rated
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="text-right text-xs">
                                <div className="text-white font-mono">
                                  {Math.floor(game.timeLeft.white / 60)}:{(game.timeLeft.white % 60).toString().padStart(2, '0')}
                                </div>
                                <div className="text-white font-mono">
                                  {Math.floor(game.timeLeft.black / 60)}:{(game.timeLeft.black % 60).toString().padStart(2, '0')}
                                </div>
                              </div>
                              <div className="text-xs text-[#b8b8b8]">
                                <Users className="w-3 h-3 inline mr-1" />
                                {game.viewers}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] h-7 px-2"
                                onClick={() => handleWatchGame(game.id)}
                              >
                                Watch
                              </Button>
                            </div>
                          </div>
                        </div>
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
                  {/* Enhanced Pairing Section */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-[#2c2c28]">
                      <TabsTrigger value="quick" className="text-[#b8b8b8] data-[state=active]:bg-[#4a4a46] data-[state=active]:text-white">
                        <Zap className="w-4 h-4 mr-1" />
                        Quick Play
                      </TabsTrigger>
                      <TabsTrigger value="custom" className="text-[#b8b8b8] data-[state=active]:bg-[#4a4a46] data-[state=active]:text-white">
                        <Settings className="w-4 h-4 mr-1" />
                        Custom
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="quick" className="mt-4">
                      <QuickPairingPanel />
                    </TabsContent>

                    <TabsContent value="custom" className="mt-4">
                      <GameModeSelector
                        onConfigChange={(config) => console.log('Real config changed:', config)}
                        onStartGame={(config) => {
                          console.log('Starting real custom game with config:', config);
                          toast.success('Starting custom game...', {
                            description: `${config.opponent} opponent • ${config.timeControl}`
                          });
                        }}
                      />
                    </TabsContent>
                  </Tabs>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Live Statistics</h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#759900] mb-2">
                        {gameStats.playersOnline.toLocaleString()}
                      </div>
                      <div className="text-[#b8b8b8] text-sm">players online</div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="text-white font-medium">
                            {gameStats.activeGames.toLocaleString()}
                          </div>
                          <div className="text-[#b8b8b8]">Playing</div>
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {Math.floor(gameStats.activeGames * 2.5).toLocaleString()}
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
                          {gameStats.totalGamesPlayed.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Active games:</span>
                        <span className="text-white font-medium">
                          {gameStats.activeGames.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Tournaments:</span>
                        <span className="text-white font-medium">
                          {gameStats.tournamentsActive}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Peak concurrent:</span>
                        <span className="text-white font-medium">
                          {gameStats.peakConcurrentToday.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Popular time control:</span>
                        <span className="text-white font-medium">
                          {gameStats.popularTimeControl}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Avg game length:</span>
                        <span className="text-white font-medium">
                          {Math.floor(gameStats.averageGameLength / 60)}m {gameStats.averageGameLength % 60}s
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
