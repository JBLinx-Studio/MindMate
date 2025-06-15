
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { GameState, createInitialGameState } from '../types/chess';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ChessGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const gameConfig = location.state?.gameConfig;
  
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  useEffect(() => {
    console.log('Chess game started with config:', gameConfig);
  }, [gameConfig]);

  const handleBackToLobby = () => {
    navigate('/lobby');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {/* Game Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleBackToLobby}
                    className="bg-[#2c2c28] border-[#4a4a46] text-white hover:bg-[#3a3a36]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Lobby
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Chess Game</h1>
                    {gameConfig && (
                      <p className="text-[#b8b8b8]">
                        {gameConfig.mode === 'computer' ? 'vs Computer' : 'vs Human'} - {gameConfig.timeControl}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Game Board */}
              <div className="flex justify-center">
                <EnhancedChessBoard 
                  gameState={gameState}
                  onGameStateChange={setGameState}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChessGame;
