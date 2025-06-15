
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';

const Swiss = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-4">Swiss Tournaments</h1>
              <p className="text-[#b8b8b8]">Round-robin style tournaments with Swiss pairing system</p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Swiss;
