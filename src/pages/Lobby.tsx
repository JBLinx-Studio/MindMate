
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Star } from 'lucide-react';
import { getRandomLiveGame } from '../utils/sampleGames';

const Lobby = () => {
  const [games, setGames] = useState(() => {
    // Generate initial games
    return Array.from({ length: 6 }, () => ({ 
      id: Math.random(), 
      ...getRandomLiveGame() 
    }));
  });
  
  const [onlineCount, setOnlineCount] = useState(47892);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update viewer counts and occasionally add/remove games
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => ({
          ...game,
          viewers: Math.max(50, game.viewers + Math.floor(Math.random() * 21) - 10),
          moves: game.moves + (Math.random() > 0.7 ? 1 : 0)
        }));

        // Sometimes add a new game or replace an old one
        if (Math.random() > 0.8) {
          const newGame = { id: Math.random(), ...getRandomLiveGame() };
          if (updatedGames.length < 8) {
            return [...updatedGames, newGame];
          } else {
            // Replace the game with fewest viewers
            const minViewersIndex = updatedGames.reduce((minIdx, game, idx, arr) => 
              game.viewers < arr[minIdx].viewers ? idx : minIdx, 0);
            updatedGames[minViewersIndex] = newGame;
          }
        }

        return updatedGames;
      });

      // Update online player count
      setOnlineCount(prev => Math.max(30000, prev + Math.floor(Math.random() * 201) - 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bullet': return 'text-red-400 border-red-400';
      case 'blitz': return 'text-yellow-400 border-yellow-400';
      case 'rapid': return 'text-green-400 border-green-400';
      default: return 'text-[#b8b8b8] border-[#4a4a46]';
    }
  };

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
                <p className="text-[#b8b8b8]">Browse and join ongoing games</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">Live Games</h2>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-[#759900]">Live</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {games.map((game) => (
                        <div key={game.id} className={`bg-[#3d3d37] rounded-lg p-4 hover:bg-[#4a4a46] transition-colors cursor-pointer ${game.isTopGame ? 'ring-1 ring-[#759900]' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-white">
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">{game.white.name}</span>
                                  <span className="text-xs bg-[#4a4a46] px-1 rounded">{game.white.title}</span>
                                </div>
                                <span className="text-[#b8b8b8] text-sm">({game.white.rating})</span>
                              </div>
                              <span className="text-[#b8b8b8]">vs</span>
                              <div className="text-white">
                                <div className="flex items-center space-x-1">
                                  <span className="font-medium">{game.black.name}</span>
                                  <span className="text-xs bg-[#4a4a46] px-1 rounded">{game.black.title}</span>
                                </div>
                                <span className="text-[#b8b8b8] text-sm">({game.black.rating})</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <Badge variant="outline" className={`text-xs ${getCategoryColor(game.category)}`}>
                                  {game.category}
                                </Badge>
                                <div className="text-[#b8b8b8] text-sm mt-1">{game.timeControl}</div>
                              </div>
                              <div className="text-center">
                                <div className="text-white text-sm font-medium">{game.moves} moves</div>
                                <div className="text-[#b8b8b8] text-sm">{game.viewers.toLocaleString()} watching</div>
                              </div>
                              {game.isTopGame && (
                                <Star className="w-4 h-4 text-[#759900]" />
                              )}
                              <Button size="sm" className="bg-[#759900] hover:bg-[#6a8700]">
                                Watch
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Pairing</h3>
                    <div className="space-y-3">
                      <Button className="w-full bg-[#759900] hover:bg-[#6a8700]">
                        <Clock className="w-4 h-4 mr-2" />
                        Play Now
                      </Button>
                      <Button variant="outline" className="w-full border-[#4a4a46] text-[#b8b8b8]">
                        <Users className="w-4 h-4 mr-2" />
                        Create Game
                      </Button>
                    </div>
                  </Card>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Online Players</h3>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#759900] mb-2">
                        {onlineCount.toLocaleString()}
                      </div>
                      <div className="text-[#b8b8b8] text-sm">players online</div>
                      <div className="mt-2 text-xs text-[#b8b8b8]">
                        Playing: {Math.floor(onlineCount * 0.23).toLocaleString()}
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Game Stats</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Games today:</span>
                        <span className="text-white font-medium">1,247,892</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Running games:</span>
                        <span className="text-white font-medium">{Math.floor(onlineCount * 0.115).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Tournaments:</span>
                        <span className="text-white font-medium">47</span>
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
