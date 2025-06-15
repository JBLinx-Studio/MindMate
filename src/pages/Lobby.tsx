
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Star } from 'lucide-react';

const Lobby = () => {
  const games = [
    { id: 1, player1: "Magnus", rating1: 2831, player2: "Hikaru", rating2: 2789, timeControl: "10+0", type: "Blitz" },
    { id: 2, player1: "Firouzja", rating1: 2804, player2: "Nepo", rating2: 2792, timeControl: "15+10", type: "Rapid" },
    { id: 3, player1: "Ding", rating1: 2799, player2: "Giri", rating2: 2764, timeControl: "3+2", type: "Blitz" },
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
                <p className="text-[#b8b8b8]">Browse and join ongoing games</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Live Games</h2>
                    <div className="space-y-4">
                      {games.map((game) => (
                        <div key={game.id} className="bg-[#3d3d37] rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-white">
                                <span className="font-medium">{game.player1}</span>
                                <span className="text-[#b8b8b8] text-sm"> ({game.rating1})</span>
                              </div>
                              <span className="text-[#b8b8b8]">vs</span>
                              <div className="text-white">
                                <span className="font-medium">{game.player2}</span>
                                <span className="text-[#b8b8b8] text-sm"> ({game.rating2})</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-[#759900] border-[#759900]">
                                {game.type}
                              </Badge>
                              <span className="text-[#b8b8b8] text-sm">{game.timeControl}</span>
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
                      <div className="text-3xl font-bold text-[#759900] mb-2">47,892</div>
                      <div className="text-[#b8b8b8] text-sm">players online</div>
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
