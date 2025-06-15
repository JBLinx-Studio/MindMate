import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Settings, Clock, MoreHorizontal, Flag, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TopNavigationMenu } from '../components/TopNavigationMenu';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameTime, setGameTime] = useState({ white: 900, black: 900 });

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    setGameTime({ white: 900, black: 900 });
    toast.success('New game started!');
    if (soundEnabled) soundManager.playMoveSound();
  };

  const handleResign = () => {
    if (gameState.moves.length > 0) {
      const winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
      toast.info(`${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by resignation!`);
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
    toast.success(`Sound ${newSoundState ? 'enabled' : 'disabled'}`);
  };

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Menu */}
          <TopNavigationMenu />

          {/* Main Game Area */}
          <main className="flex-1 flex">
            <div className="flex-1 p-4">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-12 gap-4">
                  
                  {/* Left Panel - Player & Controls */}
                  <div className="col-span-3 space-y-3">
                    {/* Black Player */}
                    <div className="bg-[#2c2c28] rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">GM</span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">Magnus</div>
                            <div className="text-[#b8b8b8] text-xs">2831</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-mono ${
                            gameState.currentPlayer === 'black' ? 'text-[#759900]' : 'text-[#b8b8b8]'
                          }`}>
                            {formatTime(gameTime.black)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Game Controls */}
                    <div className="bg-[#2c2c28] rounded-lg p-3">
                      <div className="flex space-x-2">
                        <Button 
                          onClick={handleNewGame}
                          className="flex-1 bg-[#759900] hover:bg-[#6a8700] text-white text-sm h-8"
                        >
                          New Game
                        </Button>
                        <Button
                          onClick={handleResign}
                          variant="outline"
                          className="px-3 border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] h-8"
                          disabled={gameState.moves.length === 0}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          className="px-3 border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] h-8"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* White Player */}
                    <div className="bg-[#2c2c28] rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">GM</span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">Carlsen</div>
                            <div className="text-[#b8b8b8] text-xs">2820</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-mono ${
                            gameState.currentPlayer === 'white' ? 'text-[#759900]' : 'text-[#b8b8b8]'
                          }`}>
                            {formatTime(gameTime.white)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center - Chess Board */}
                  <div className="col-span-6 flex justify-center">
                    <div className="w-full max-w-xl">
                      <EnhancedChessBoard 
                        gameState={gameState}
                        onGameStateChange={handleGameStateChange}
                      />
                    </div>
                  </div>

                  {/* Right Panel - Moves & Analysis */}
                  <div className="col-span-3 space-y-3">
                    {/* Move History */}
                    <div className="bg-[#2c2c28] rounded-lg">
                      <div className="p-3 border-b border-[#4a4a46]">
                        <h3 className="text-white font-medium text-sm">Moves</h3>
                      </div>
                      <div className="p-3 max-h-64 overflow-y-auto">
                        {gameState.moves.length === 0 ? (
                          <div className="text-[#b8b8b8] text-sm text-center py-4">
                            Game hasn't started
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {gameState.moves.map((move, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <span className="text-[#b8b8b8] w-8">
                                  {Math.ceil((index + 1) / 2)}.
                                </span>
                                <span className="text-white font-mono">
                                  {String.fromCharCode(97 + move.from.x)}{8 - move.from.y}
                                  {String.fromCharCode(97 + move.to.x)}{8 - move.to.y}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Game Info */}
                    <div className="bg-[#2c2c28] rounded-lg p-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#b8b8b8]">Opening:</span>
                          <span className="text-white">Italian Game</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#b8b8b8]">Time control:</span>
                          <span className="text-white">15+10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#b8b8b8]">Status:</span>
                          <span className="text-[#759900]">In progress</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
