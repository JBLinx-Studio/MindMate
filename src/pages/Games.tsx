
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw } from 'lucide-react';
import LiveGameCard from '../components/LiveGameCard';
import { createLiveGamePool, updateLiveGame, generateLiveGame, LiveGame } from '../utils/liveGameGenerator';
import { toast } from 'sonner';

const Games = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [liveGames, setLiveGames] = useState<LiveGame[]>(() => createLiveGamePool(15));
  const [isLoading, setIsLoading] = useState(false);

  // Update games periodically to simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGames(prevGames => {
        const updatedGames = prevGames.map(updateLiveGame);
        
        // Add new games occasionally
        if (Math.random() > 0.8 && updatedGames.length < 20) {
          const newGame = generateLiveGame();
          updatedGames.push(newGame);
        }
        
        // Remove finished games after some time
        return updatedGames.filter(game => 
          game.gameStatus === 'active' || Math.random() > 0.1
        );
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleWatchGame = (gameId: number) => {
    const game = liveGames.find(g => g.id === gameId);
    if (game) {
      toast.success(`Joining ${game.white.name} vs ${game.black.name}`, {
        description: `Move ${game.moves} • ${game.viewers} viewers watching`,
        duration: 3000,
      });
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLiveGames(createLiveGamePool(15));
      setIsLoading(false);
      toast.success('Games refreshed!', {
        description: 'Loaded latest live games'
      });
    }, 1000);
  };

  const filteredGames = liveGames.filter(game => {
    if (searchFilter && 
        !game.white.name.toLowerCase().includes(searchFilter.toLowerCase()) && 
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

              {/* Enhanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
                    <SelectItem value="2700">2700+</SelectItem>
                    <SelectItem value="2600">2600+</SelectItem>
                    <SelectItem value="2500">2500+</SelectItem>
                    <SelectItem value="2400">2400+</SelectItem>
                    <SelectItem value="2300">2300+</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <Button variant="outline" className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]">
                  <Filter className="w-4 h-4 mr-2" />
                  More filters
                </Button>
              </div>

              {/* Games List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[#b8b8b8] text-sm">
                    {filteredGames.length} games found
                  </span>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-[#b8b8b8]">
                      Updates every 5 seconds
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-[#759900]">Live</span>
                    </div>
                  </div>
                </div>

                {filteredGames.length === 0 ? (
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-12 text-center">
                    <div className="text-[#b8b8b8] mb-4">
                      <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No games found</h3>
                      <p>Try adjusting your search filters or refresh the page</p>
                    </div>
                    <Button 
                      onClick={handleRefresh}
                      className="bg-[#759900] hover:bg-[#6a8700]"
                    >
                      Refresh Games
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {filteredGames.map((game) => (
                      <LiveGameCard
                        key={game.id}
                        game={game}
                        onWatch={handleWatchGame}
                      />
                    ))}
                  </div>
                )}

                {/* Load More */}
                {filteredGames.length > 0 && (
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                      onClick={() => {
                        const newGames = createLiveGamePool(8);
                        setLiveGames(prev => [...prev, ...newGames]);
                        toast.success('Loaded more games!');
                      }}
                    >
                      Load more games
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Games;
