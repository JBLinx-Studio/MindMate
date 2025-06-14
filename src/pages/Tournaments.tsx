
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Calendar } from 'lucide-react';

const Tournaments = () => {
  return (
    <SidebarProvider collapsedWidth={64}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold text-amber-800">Tournaments</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Chess Tournaments</h2>
                  <p className="text-gray-600">Compete with players worldwide in exciting tournaments</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 border rounded-lg">
                    <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <h3 className="font-semibold mb-2">Weekly Blitz</h3>
                    <p className="text-sm text-gray-600">Fast-paced 3+2 tournament</p>
                    <Button className="mt-4 w-full" size="sm">Join Tournament</Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                    <h3 className="font-semibold mb-2">Team Battle</h3>
                    <p className="text-sm text-gray-600">Represent your team</p>
                    <Button className="mt-4 w-full" size="sm" variant="outline">Coming Soon</Button>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h3 className="font-semibold mb-2">Monthly Classical</h3>
                    <p className="text-sm text-gray-600">15+10 time control</p>
                    <Button className="mt-4 w-full" size="sm" variant="outline">Register</Button>
                  </div>
                </div>
                
                <p className="text-gray-500">
                  Tournament system coming soon with Swiss and Round Robin formats
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Tournaments;
