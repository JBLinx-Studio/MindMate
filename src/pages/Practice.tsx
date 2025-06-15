
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Clock, Repeat } from 'lucide-react';

const Practice = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-8">Practice Arena</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <Target className="w-12 h-12 mx-auto text-[#759900] mb-4" />
                  <h3 className="text-white font-semibold mb-2">Tactical Training</h3>
                  <p className="text-[#b8b8b8] text-sm mb-4">Practice common patterns</p>
                  <Button className="bg-[#759900] hover:bg-[#6a8700]">Start</Button>
                </Card>
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <Clock className="w-12 h-12 mx-auto text-[#759900] mb-4" />
                  <h3 className="text-white font-semibold mb-2">Speed Training</h3>
                  <p className="text-[#b8b8b8] text-sm mb-4">Improve calculation speed</p>
                  <Button className="bg-[#759900] hover:bg-[#6a8700]">Start</Button>
                </Card>
                <Card className="bg-[#2c2c28] border-[#4a4a46] p-6 text-center">
                  <Repeat className="w-12 h-12 mx-auto text-[#759900] mb-4" />
                  <h3 className="text-white font-semibold mb-2">Endgame Practice</h3>
                  <p className="text-[#b8b8b8] text-sm mb-4">Master basic endgames</p>
                  <Button className="bg-[#759900] hover:bg-[#6a8700]">Start</Button>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Practice;
