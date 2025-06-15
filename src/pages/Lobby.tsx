
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import EnhancedGameLobby from '../components/EnhancedGameLobby';
import { ChessGameStarter } from '../components/ChessGameStarter';

const Lobby = () => {
  const handleStartGame = (gameConfig: any) => {
    console.log('Game started with config:', gameConfig);
    // Here you could navigate to a game page or open a game modal
    // For now, we'll just show an alert
    alert(`Starting ${gameConfig.mode} game with ${gameConfig.timeControl} time control!`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Game Lobby</h1>
                <p className="text-[#b8b8b8]">Find opponents and start playing chess</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chess Game Starter */}
                <div className="lg:col-span-1">
                  <ChessGameStarter onStartGame={handleStartGame} />
                </div>

                {/* Enhanced Game Lobby */}
                <div className="lg:col-span-2">
                  <EnhancedGameLobby onStartGame={handleStartGame} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Lobby;
