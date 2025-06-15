
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Crown, Zap, Target, Clock, Users } from 'lucide-react';

const TV = () => {
  const tvChannels = [
    { name: 'Top Rated', icon: Crown, viewers: 1847, rating: '2700+', description: 'Best players' },
    { name: 'Blitz', icon: Zap, viewers: 923, rating: '2400+', description: '3+0, 3+2, 5+0' },
    { name: 'Rapid', icon: Clock, viewers: 756, rating: '2300+', description: '10+0, 15+15' },
    { name: 'Classical', icon: Target, viewers: 432, rating: '2200+', description: '30+0, 60+30' },
    { name: 'UltraBullet', icon: Zap, viewers: 298, rating: '2100+', description: '15s, 30s' },
    { name: 'Bullet', icon: Zap, viewers: 687, rating: '2300+', description: '1+0, 1+1, 2+1' }
  ];

  const currentGames = [
    { white: 'Hikaru', whiteRating: 2847, black: 'Magnus', blackRating: 2831, timeControl: '3+0', viewers: 2341 },
    { white: 'Fabiano', whiteRating: 2804, black: 'Ding', blackRating: 2799, timeControl: '5+0', viewers: 1823 },
    { white: 'Alireza', whiteRating: 2793, black: 'Nepo', blackRating: 2792, timeControl: '3+2', viewers: 1456 },
    { white: 'Anish', whiteRating: 2781, black: 'Rapport', blackRating: 2763, timeControl: '10+0', viewers: 987 }
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
                <h1 className="text-3xl font-bold text-white mb-2">Lichess TV</h1>
                <p className="text-[#b8b8b8]">Watch live games from top players around the world</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TV Channels */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">TV Channels</h2>
                  <div className="space-y-3">
                    {tvChannels.map((channel, index) => (
                      <Card key={index} className="bg-[#2c2c28] border-[#4a4a46] p-4 hover:bg-[#3d3d37] transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#4a4a46] rounded-lg flex items-center justify-center">
                              <channel.icon className="w-5 h-5 text-[#759900]" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{channel.name}</h3>
                              <p className="text-[#b8b8b8] text-sm">{channel.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-1">
                              <Eye className="w-4 h-4 text-[#b8b8b8]" />
                              <span className="text-white text-sm font-medium">{channel.viewers}</span>
                            </div>
                            <Badge variant="outline" className="text-[#759900] border-[#759900] text-xs">
                              {channel.rating}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Current Featured Games */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Featured Games</h2>
                  <div className="space-y-3">
                    {currentGames.map((game, index) => (
                      <Card key={index} className="bg-[#2c2c28] border-[#4a4a46] p-4 hover:bg-[#3d3d37] transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">GM</span>
                            </div>
                            <div>
                              <span className="text-white font-medium">{game.white}</span>
                              <span className="text-[#b8b8b8] text-sm ml-2">({game.whiteRating})</span>
                            </div>
                          </div>
                          <div className="text-[#b8b8b8] text-sm">vs</div>
                          <div className="flex items-center space-x-2">
                            <div>
                              <span className="text-white font-medium">{game.black}</span>
                              <span className="text-[#b8b8b8] text-sm ml-2">({game.blackRating})</span>
                            </div>
                            <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">GM</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="w-4 h-4 text-[#b8b8b8]" />
                            <span className="text-[#b8b8b8]">{game.timeControl}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Eye className="w-4 h-4 text-[#b8b8b8]" />
                            <span className="text-white font-medium">{game.viewers}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button className="w-full mt-4 bg-[#759900] hover:bg-[#6a8700] text-white">
                    View All Live Games
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TV;
