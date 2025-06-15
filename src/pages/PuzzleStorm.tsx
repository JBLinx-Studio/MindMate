
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Clock, Trophy } from 'lucide-react';

const PuzzleStorm = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Zap className="w-20 h-20 mx-auto text-[#759900] mb-4" />
                <h1 className="text-4xl font-bold text-white mb-4">Puzzle Storm</h1>
                <p className="text-[#b8b8b8] text-lg">Solve as many puzzles as you can in 3 minutes!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <Clock className="w-8 h-8 mx-auto text-[#759900] mb-2" />
                  <h3 className="text-lg font-semibold text-white mb-2">Time Limit</h3>
                  <p className="text-[#b8b8b8]">3 minutes</p>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto text-[#759900] mb-2" />
                  <h3 className="text-lg font-semibold text-white mb-2">Best Score</h3>
                  <p className="text-[#b8b8b8]">47 puzzles</p>
                </Card>

                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <Zap className="w-8 h-8 mx-auto text-[#759900] mb-2" />
                  <h3 className="text-lg font-semibold text-white mb-2">Last Run</h3>
                  <p className="text-[#b8b8b8]">34 puzzles</p>
                </Card>
              </div>

              <div className="text-center">
                <Button size="lg" className="bg-[#759900] hover:bg-[#6a8700] text-lg px-12 py-6">
                  <Zap className="w-6 h-6 mr-2" />
                  Start Storm
                </Button>
              </div>

              <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
                <ul className="text-[#b8b8b8] space-y-2">
                  <li>• Solve tactical puzzles as quickly as possible</li>
                  <li>• Each correct solution adds time to your clock</li>
                  <li>• Wrong answers reduce your remaining time</li>
                  <li>• Try to solve as many as possible before time runs out</li>
                </ul>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PuzzleStorm;
