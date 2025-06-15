
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Clock, Crown, Search, Filter, Users, Zap, Target } from 'lucide-react';

const Games = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');

  const liveGames = [
    { 
      white: { name: 'Hikaru', rating: 2847, title: 'GM' }, 
      black: { name: 'Magnus', rating: 2831, title: 'GM' }, 
      timeControl: '3+0', 
      viewers: 2341, 
      moves: 23, 
      category: 'bullet',
      isTopGame: true 
    },
    { 
      white: { name: 'Fabiano', rating: 2804, title: 'GM' }, 
      black: { name: 'Ding', rating: 2799, title: 'GM' }, 
      timeControl: '5+0', 
      viewers: 1823, 
      moves: 15, 
      category: 'blitz' 
    },
    { 
      white: { name: 'Alireza', rating: 2793, title: 'GM' }, 
      black: { name: 'Nepo', rating: 2792, title: 'GM' }, 
      timeControl: '3+2', 
      viewers: 1456, 
      moves: 31, 
      category: 'blitz' 
    },
    { 
      white: { name: 'Anish', rating: 2781, title: 'IM' }, 
      black: { name: 'Rapport', rating: 2763, title: 'GM' }, 
      timeControl: '10+0', 
      viewers: 987, 
      moves: 12, 
      category: 'rapid' 
    },
    { 
      white: { name: 'Wesley', rating: 2773, title: 'GM' }, 
      black: { name: 'Arjun', rating: 2755, title: 'GM' }, 
      timeControl: '15+10', 
      viewers: 756, 
      moves: 8, 
      category: 'rapid' 
    },
    { 
      white: { name: 'Gukesh', rating: 2743, title: 'GM' }, 
      black: { name: 'Pragg', rating: 2739, title: 'GM' }, 
      timeControl: '1+0', 
      viewers: 543, 
      moves: 18, 
      category: 'bullet' 
    }
  ];

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
                    <SelectItem value="2500+">2500+</SelectItem>
                    <SelectItem value="2400+">2400+</SelectItem>
                    <SelectItem value="2300+">2300+</SelectItem>
                    <SelectItem value="2200+">2200+</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]">
                  <Filter className="w-4 h-4 mr-2" />
                  More filters
                </Button>
              </div>

              {/* Games List */}
              <div className="space-y-3">
                {liveGames.map((game, index) => {
                  const CategoryIcon = getCategoryIcon(game.category);
                  
                  return (
                    <Card key={index} className={`bg-[#2c2c28] border-[#4a4a46] p-4 hover:bg-[#3d3d37] transition-colors cursor-pointer ${game.isTopGame ? 'ring-1 ring-[#759900]' : ''}`}>
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
                              <span className="text-[#b8b8b8]">{game.viewers}</span>
                            </div>
                          </div>

                          {game.isTopGame && (
                            <div className="flex items-center">
                              <Crown className="w-5 h-5 text-[#759900]" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Load More */}
              <div className="mt-6 text-center">
                <Button variant="outline" className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]">
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
