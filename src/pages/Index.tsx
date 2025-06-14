
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import PlayerInfo from '../components/PlayerInfo';
import GameControls from '../components/GameControls';
import MoveHistory from '../components/MoveHistory';
import GameStats from '../components/GameStats';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX } from 'lucide-react';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    toast.success('New game started! Good luck!', {
      duration: 3000,
    });
    if (soundEnabled) soundManager.playMoveSound();
  };

  const handleResign = () => {
    if (gameState.moves.length > 0) {
      const winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
      toast.info(`${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by resignation!`, {
        duration: 5000,
      });
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        winner
      }));
      if (soundEnabled) soundManager.playGameOverSound();
    }
  };

  const toggleSound = () => {
    const newSoundState = soundManager.toggleSound();
    setSoundEnabled(newSoundState);
    toast.success(`Sound ${newSoundState ? 'enabled' : 'disabled'}`, {
      duration: 2000,
    });
  };

  // Enhanced game state handler that includes sound effects
  const handleGameStateChange = (newState: GameState) => {
    const prevMoveCount = gameState.moves.length;
    const newMoveCount = newState.moves.length;
    
    if (newMoveCount > prevMoveCount && soundEnabled) {
      const lastMove = newState.moves[newState.moves.length - 1];
      if (lastMove.captured) {
        soundManager.playCaptureSound();
      } else {
        soundManager.playMoveSound();
      }
    }
    
    setGameState(newState);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white/90 backdrop-blur-sm border-b shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-600 bg-clip-text text-transparent">
                Live Chess Game
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSound}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={soundEnabled ? 'Disable sound' : 'Enable sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  Online
                </span>
              </div>
            </div>
          </header>

          {/* Enhanced Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Left Column - Player Info & Controls */}
                <div className="xl:col-span-1 space-y-4">
                  <PlayerInfo color="black" isCurrentPlayer={gameState.currentPlayer === 'black'} />
                  <GameControls 
                    gameState={gameState}
                    onNewGame={handleNewGame}
                    onResign={handleResign}
                  />
                  <GameStats gameState={gameState} />
                </div>

                {/* Center Column - Chess Board */}
                <div className="xl:col-span-3 flex justify-center">
                  <div className="space-y-6">
                    <EnhancedChessBoard 
                      gameState={gameState}
                      onGameStateChange={handleGameStateChange}
                    />
                    
                    {/* Enhanced game status */}
                    <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="text-xl font-bold text-gray-800 mb-2">
                        {gameState.isGameOver ? (
                          <span className="text-red-600">
                            Game Over - {gameState.winner ? `${gameState.winner.charAt(0).toUpperCase() + gameState.winner.slice(1)} Wins!` : 'Draw'}
                          </span>
                        ) : (
                          <span className={gameState.currentPlayer === 'white' ? 'text-gray-800' : 'text-gray-600'}>
                            {gameState.currentPlayer === 'white' ? "White's Turn" : "Black's Turn"}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {gameState.moves.length === 0 
                          ? "Make your first move to begin the game" 
                          : `Move ${Math.floor(gameState.moves.length / 2) + 1} • Click on a piece to see available moves`
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Move History & Player Info */}
                <div className="xl:col-span-1 space-y-4">
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
