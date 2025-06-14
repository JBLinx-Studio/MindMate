
import React, { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import ChessBoard from '../components/ChessBoard';
import PlayerInfo from '../components/PlayerInfo';
import GameControls from '../components/GameControls';
import MoveHistory from '../components/MoveHistory';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { toast } from 'sonner';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    toast.success('New game started!');
  };

  const handleResign = () => {
    if (gameState.moves.length > 0) {
      toast.info(`${gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins by resignation!`);
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        winner: gameState.currentPlayer === 'white' ? 'black' : 'white'
      }));
    }
  };

  return (
    <SidebarProvider collapsedWidth={64}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold text-amber-800">Live Chess Game</h1>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                Online
              </span>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Player Info & Controls */}
                <div className="lg:col-span-1 space-y-4">
                  <PlayerInfo color="black" isCurrentPlayer={gameState.currentPlayer === 'black'} />
                  <GameControls 
                    gameState={gameState}
                    onNewGame={handleNewGame}
                    onResign={handleResign}
                  />
                </div>

                {/* Center Column - Chess Board */}
                <div className="lg:col-span-2 flex justify-center">
                  <div className="space-y-4">
                    <ChessBoard 
                      gameState={gameState}
                      onGameStateChange={setGameState}
                    />
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">
                        {gameState.currentPlayer === 'white' ? "White's Turn" : "Black's Turn"}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Click on a piece to see available moves
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Move History & Player Info */}
                <div className="lg:col-span-1 space-y-4">
                  <PlayerInfo color="white" isCurrentPlayer={gameState.currentPlayer === 'white'} />
                  <MoveHistory moves={gameState.moves} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
