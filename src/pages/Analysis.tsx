
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Upload, Play, RotateCcw } from 'lucide-react';

const Analysis = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold text-amber-800">Game Analysis</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Chess Game Analysis</h2>
                  <p className="text-gray-600">Analyze your games with powerful chess engine</p>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload PGN
                    </Button>
                    <Button size="lg" variant="outline">
                      <Play className="w-5 h-5 mr-2" />
                      Analyze Last Game
                    </Button>
                    <Button size="lg" variant="outline">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Position Analysis
                    </Button>
                  </div>
                  
                  <p className="text-gray-500 mt-8">
                    Coming soon: Advanced position analysis, opening explorer, and game insights
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analysis;
