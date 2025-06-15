
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Clock, Star } from 'lucide-react';

const Puzzles = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Chess Puzzles</h1>
                <p className="text-[#b8b8b8]">Improve your tactical skills</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-8">
                    <div className="text-center">
                      <Target className="w-16 h-16 mx-auto text-[#759900] mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-4">Daily Puzzle</h2>
                      <p className="text-[#b8b8b8] mb-6">Solve today's featured tactical puzzle</p>
                      <Button size="lg" className="bg-[#759900] hover:bg-[#6a8700]">
                        Start Puzzle
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Your Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Rating:</span>
                        <span className="text-white font-medium">1847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Solved:</span>
                        <span className="text-white font-medium">1,245</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b8b8b8]">Accuracy:</span>
                        <span className="text-[#759900] font-medium">87%</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full border-[#4a4a46] text-[#b8b8b8]">
                        <Clock className="w-4 h-4 mr-2" />
                        Puzzle Rush
                      </Button>
                      <Button variant="outline" className="w-full border-[#4a4a46] text-[#b8b8b8]">
                        <Star className="w-4 h-4 mr-2" />
                        Favorites
                      </Button>
                      <Button variant="outline" className="w-full border-[#4a4a46] text-[#b8b8b8]">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Progress
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

export default Puzzles;
