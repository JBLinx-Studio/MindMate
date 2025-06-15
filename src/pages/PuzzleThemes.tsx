
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PuzzleThemes = () => {
  const themes = [
    { name: "Pin", count: 2847, difficulty: "Beginner", color: "bg-green-600" },
    { name: "Fork", count: 1923, difficulty: "Beginner", color: "bg-green-600" },
    { name: "Skewer", count: 1456, difficulty: "Intermediate", color: "bg-yellow-600" },
    { name: "Discovered Attack", count: 892, difficulty: "Intermediate", color: "bg-yellow-600" },
    { name: "Double Check", count: 654, difficulty: "Advanced", color: "bg-red-600" },
    { name: "Smothered Mate", count: 321, difficulty: "Advanced", color: "bg-red-600" },
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
                <h1 className="text-3xl font-bold text-white mb-2">Puzzle Themes</h1>
                <p className="text-[#b8b8b8]">Practice specific tactical patterns</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map((theme) => (
                  <Card key={theme.name} className="bg-[#2c2c28] border-[#4a4a46] p-6 hover:bg-[#3d3d37] transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{theme.name}</h3>
                      <Badge className={`${theme.color} text-white`}>
                        {theme.difficulty}
                      </Badge>
                    </div>
                    <p className="text-[#b8b8b8] text-sm mb-4">{theme.count} puzzles available</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#759900] font-medium">Start Training</span>
                      <span className="text-[#b8b8b8] text-sm">→</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PuzzleThemes;
