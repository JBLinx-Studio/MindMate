
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Trophy, Clock } from 'lucide-react';

const PuzzleRacer = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Users className="w-20 h-20 mx-auto text-[#759900] mb-4" />
                <h1 className="text-4xl font-bold text-white mb-4">Puzzle Racer</h1>
                <p className="text-[#b8b8b8] text-lg">Race against other players to solve puzzles!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Race</h3>
                  <p className="text-[#b8b8b8] mb-4">Join a race with random opponents</p>
                  <Button className="w-full bg-[#759900] hover:bg-[#6a8700]">
                    <Users className="w-4 h-4 mr-2" />
                    Find Race
                  </Button>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Create Race</h3>
                  <p className="text-[#b8b8b8] mb-4">Start a private race with friends</p>
                  <Button variant="outline" className="w-full border-[#4a4a46] text-[#b8b8b8]">
                    <Trophy className="w-4 h-4 mr-2" />
                    Create Room
                  </Button>
                </Card>
              </div>

              <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Active Races</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#3d3d37] rounded-lg p-3">
                    <div>
                      <span className="text-white font-medium">Beginner Race</span>
                      <span className="text-[#b8b8b8] text-sm ml-2">3/4 players</span>
                    </div>
                    <Button size="sm" className="bg-[#759900] hover:bg-[#6a8700]">Join</Button>
                  </div>
                  <div className="flex items-center justify-between bg-[#3d3d37] rounded-lg p-3">
                    <div>
                      <span className="text-white font-medium">Expert Challenge</span>
                      <span className="text-[#b8b8b8] text-sm ml-2">2/8 players</span>
                    </div>
                    <Button size="sm" className="bg-[#759900] hover:bg-[#6a8700]">Join</Button>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Race Stats</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#759900]">23</div>
                    <div className="text-[#b8b8b8] text-sm">Races Won</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">156</div>
                    <div className="text-[#b8b8b8] text-sm">Total Races</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">15%</div>
                    <div className="text-[#b8b8b8] text-sm">Win Rate</div>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PuzzleRacer;
