
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Target, Clock } from 'lucide-react';

const PuzzleDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Puzzle Dashboard</h1>
                <p className="text-[#b8b8b8]">Track your tactical training progress</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#b8b8b8] text-sm">Puzzle Rating</p>
                      <p className="text-2xl font-bold text-white">1847</p>
                    </div>
                    <Target className="w-8 h-8 text-[#759900]" />
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#b8b8b8] text-sm">Puzzles Solved</p>
                      <p className="text-2xl font-bold text-white">1,245</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-[#759900]" />
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#b8b8b8] text-sm">Accuracy</p>
                      <p className="text-2xl font-bold text-white">87%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[#759900]" />
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#b8b8b8] text-sm">Avg Time</p>
                      <p className="text-2xl font-bold text-white">23s</p>
                    </div>
                    <Clock className="w-8 h-8 text-[#759900]" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Rating Progress</h3>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-[#b8b8b8]">Chart visualization would go here</p>
                  </div>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#b8b8b8]">Pin puzzle</span>
                      <span className="text-[#759900]">Solved</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#b8b8b8]">Fork puzzle</span>
                      <span className="text-[#759900]">Solved</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#b8b8b8]">Skewer puzzle</span>
                      <span className="text-red-500">Failed</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PuzzleDashboard;
