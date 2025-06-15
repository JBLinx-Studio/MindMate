
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Edit, TrendingUp, Clock } from 'lucide-react';

const Profile = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold text-amber-800">Profile</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl">
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800">ChessPlayer</h2>
                    <p className="text-gray-600">Member since December 2024</p>
                    <Button size="sm" className="mt-2">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">1200</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">42</div>
                    <div className="text-sm text-gray-600">Games Played</div>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <User className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">65%</div>
                    <div className="text-sm text-gray-600">Win Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Recent Games</h3>
                <p className="text-gray-500">Game history will appear here after playing matches</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
