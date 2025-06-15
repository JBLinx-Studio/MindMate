
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Play, RotateCcw, Database, BookOpen } from 'lucide-react';
import PositionAnalyzer from '../components/PositionAnalyzer';

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
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="upload" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upload">Upload Game</TabsTrigger>
                  <TabsTrigger value="position">Position Analysis</TabsTrigger>
                  <TabsTrigger value="database">Game Database</TabsTrigger>
                  <TabsTrigger value="opening">Opening Explorer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">Upload Chess Game</h2>
                      <p className="text-gray-600">Upload PGN files to analyze your games with powerful chess engine</p>
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
                          Quick Analysis
                        </Button>
                      </div>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                        <div className="text-gray-500">
                          Drag and drop PGN files here, or click to select files
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="position" className="space-y-6">
                  <PositionAnalyzer />
                </TabsContent>
                
                <TabsContent value="database" className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Game Database</h3>
                    <p className="text-gray-600 mb-6">Browse and search through millions of chess games</p>
                    <Button>Coming Soon</Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="opening" className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Opening Explorer</h3>
                    <p className="text-gray-600 mb-6">Explore opening theory and statistics</p>
                    <Button>Coming Soon</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analysis;
