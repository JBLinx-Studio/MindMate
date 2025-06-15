
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Clock, Crown, Search, Filter, Users, Zap, Target } from 'lucide-react';
import { getRandomLiveGame } from '../utils/sampleGames';

const Games = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [liveGames, setLiveGames] = useState(() => {
    return Array.from({ length: 12 }, () => ({ 
      id: Math.random(), 
      ...getRandomLiveGame() 
    }));
  });

  // Update games periodically to simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGames(prevGames => {
        return prevGames.map(game => ({
          ...game,
          viewers: Math.max(50, game.viewers + Math.floor(Math.random() * 41) - 20),
          moves: game.moves + (Math.random() > 0.6 ? 1 : 0)
        }));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bullet': return Zap;
      case 'blitz': return Zap;
      case 'rapid': return Clock;
      case 'classical': return Target;
      default: return Clock;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bullet': return 'text-red-400 border-red-400';
      case 'blitz': return 'text-yellow-400 border-yellow-400';
      case 'rapid': return 'text-green-400 border-green-400';
      case 'classical': return 'text-blue-400 border-blue-400';
      default: return 'text-[#b8b8b8] border-[#4a4a46]';
    }
  };

  const filteredGames = liveGames.filter(game => {
    if (searchFilter && !game.white.name.toLowerCase().includes(searchFilter.toLowerCase()) && 
        !game.black.name.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    if (timeFilter !== 'all' && game.category !== timeFilter) {
      return false;
    }
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter.replace('+', ''));
      if (Math.max(game.white.rating, game.black.rating) < minRating) {
        return false;
      }
    }
    return true;
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Live Games</h1>
                <p className="text-[#b8b8b8]">Watch live games happening right now</p>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b8b8b8] w-4 h-4" />
                  <Input
                    placeholder="Search players..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="pl-10 bg-[#2c2c28] border-[#4a4a46] text-white placeholder:text-[#b8b8b8]"
                  />
                </div>
                
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="bg-[#2c2c28] border-[#4a4a46] text-white">
                    <SelectValue placeholder="Time control" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2c2c28] border-[#4a4a46]">
                    <SelectItem value="all">All time controls</SelectItem>
                    <SelectItem value="bullet">Bullet</SelectItem>
                    <SelectItem value="blitz">Blitz</SelectItem>
                    <SelectItem value="rapid">Rapid</SelectItem>
                    <SelectItem value="classical">Classical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="bg-[#2c2c28] border-[#4a4a46] text-white">
                    <SelectValue placeholder="Rating range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2c2c28] border-[#4a4a46]">
                    <SelectItem value="all">All ratings</SelectItem>
                    <SelectItem value="2500">2500+</SelectItem>
                    <SelectItem value="2400">2400+</SelectItem>
                    <SelectItem value="2300">2300+</SelectItem>
                    <SelectItem value="2200">2200+</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]">
                  <Filter className="w-4 h-4 mr-2" />
                  More filters
                </Button>
              </div>

              {/* Games List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#b8b8b8] text-sm">
                    {filteredGames.length} games found
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-[#759900]">Live updates</span>
                  </div>
                </div>

                {filteredGames.map((game) => {
                  const CategoryIcon = getCategoryIcon(game.category);
                  
                  return (
                    <Card key={game.id} className={`bg-[#2c2c28] border-[#4a4a46] p-4 hover:bg-[#3d3d37] transition-colors cursor-pointer ${game.isTopGame ? 'ring-1 ring-[#759900]' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          {/* White Player */}
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-medium">{game.white.title}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-white font-medium truncate">{game.white.name}</div>
                              <div className="text-[#b8b8b8] text-sm">({game.white.rating})</div>
                            </div>
                          </div>

                          {/* VS */}
                          <div className="text-[#b8b8b8] text-sm px-2">vs</div>

                          {/* Black Player */}
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <div className="min-w-0">
                              <div className="text-white font-medium truncate">{game.black.name}</div>
                              <div className="text-[#b8b8b8] text-sm">({game.black.rating})</div>
                            </div>
                            <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-medium">{game.black.title}</span>
                            </div>
                          </div>
                        </div>

                        {/* Game Info */}
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="flex items-center space-x-1 text-sm">
                              <CategoryIcon className="w-4 h-4 text-[#b8b8b8]" />
                              <span className="text-[#b8b8b8]">{game.timeControl}</span>
                            </div>
                            <Badge variant="outline" className={`text-xs mt-1 ${getCategoryColor(game.category)}`}>
                              {game.category}
                            </Badge>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-white text-sm font-medium">{game.moves} moves</div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Eye className="w-4 h-4 text-[#b8b8b8]" />
                              <span className="text-[#b8b8b8]">{game.viewers.toLocaleString()}</span>
                            </div>
                          </div>

                          {game.isTopGame && (
                            <div className="flex items-center">
                              <Crown className="w-5 h-5 text-[#759900]" />
                            </div>
                          )}
                          
                          <Button size="sm" className="bg-[#759900] hover:bg-[#6a8700]">
                            Watch
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Load More */}
              <div className="mt-6 text-center">
                <Button 
                  variant="outline" 
                  className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                  onClick={() => {
                    const newGames = Array.from({ length: 6 }, () => ({ 
                      id: Math.random(), 
                      ...getRandomLiveGame() 
                    }));
                    setLiveGames(prev => [...prev, ...newGames]);
                  }}
                >
                  Load more games
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Games;
