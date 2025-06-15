
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import RealAnalysisPanel from '../components/RealAnalysisPanel';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Settings, Clock, MoreHorizontal, Flag, RotateCcw, Users, MessageSquare, Eye, Share2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopNavigationMenu } from '../components/TopNavigationMenu';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameTime, setGameTime] = useState({ white: 900, black: 900 });
  const [spectators, setSpectators] = useState(47);

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
              <div className="max-w-7xl mx-auto">
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
                            <div className="text-[#b8b8b8] text-xs flex items-center space-x-1">
                              <span>2831</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
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
                      <div className="flex space-x-2 mb-3">
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
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={toggleSound}
                          variant="outline"
                          className="flex-1 border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] h-8 text-xs"
                        >
                          {soundEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
                          Sound
                        </Button>
                        <Button
                          variant="outline"
                          className="px-3 border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] h-8"
                        >
                          <Settings className="w-4 h-4" />
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
                            <div className="text-[#b8b8b8] text-xs flex items-center space-x-1">
                              <span>2820</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
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

                    {/* Spectators */}
                    <div className="bg-[#2c2c28] rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-[#b8b8b8]">
                          <Eye className="w-4 h-4" />
                          <span>Spectators</span>
                        </div>
                        <span className="text-white font-medium">{spectators}</span>
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

                  {/* Right Panel - Analysis & Info */}
                  <div className="col-span-3 space-y-3">
                    <Tabs defaultValue="moves" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-[#2c2c28]">
                        <TabsTrigger value="moves" className="text-[#b8b8b8] data-[state=active]:bg-[#4a4a46] data-[state=active]:text-white">
                          Moves
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="text-[#b8b8b8] data-[state=active]:bg-[#4a4a46] data-[state=active]:text-white">
                          <Brain className="w-3 h-3 mr-1" />
                          Analysis
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="moves" className="space-y-3">
                        {/* Move History */}
                        <div className="bg-[#2c2c28] rounded-lg">
                          <div className="p-3 border-b border-[#4a4a46] flex items-center justify-between">
                            <h3 className="text-white font-medium text-sm">Moves</h3>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#b8b8b8] hover:text-white h-6 w-6 p-0"
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#b8b8b8] hover:text-white h-6 w-6 p-0"
                              >
                                <MoreHorizontal className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-3 max-h-64 overflow-y-auto">
                            {gameState.moves.length === 0 ? (
                              <div className="text-[#b8b8b8] text-sm text-center py-4">
                                Game hasn't started
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {gameState.moves.map((move, index) => {
                                  const moveNumber = Math.ceil((index + 1) / 2);
                                  const isWhiteMove = index % 2 === 0;
                                  
                                  return (
                                    <div key={index} className="flex items-center text-sm hover:bg-[#3d3d37] px-1 py-0.5 rounded cursor-pointer">
                                      {isWhiteMove && (
                                        <span className="text-[#b8b8b8] w-8 text-xs">
                                          {moveNumber}.
                                        </span>
                                      )}
                                      <span className="text-white font-mono text-xs">
                                        {String.fromCharCode(97 + move.from.x)}{8 - move.from.y}
                                        {String.fromCharCode(97 + move.to.x)}{8 - move.to.y}
                                        {move.captured && <span className="text-red-400">x</span>}
                                      </span>
                                    </div>
                                  );
                                })}
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
                              <Badge 
                                variant="outline" 
                                className="text-[#759900] border-[#759900] text-xs"
                              >
                                In progress
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#b8b8b8]">Rated:</span>
                              <span className="text-white">Yes</span>
                            </div>
                          </div>
                        </div>

                        {/* Chat */}
                        <div className="bg-[#2c2c28] rounded-lg">
                          <div className="p-3 border-b border-[#4a4a46] flex items-center justify-between">
                            <h3 className="text-white font-medium text-sm flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Chat
                            </h3>
                            <Badge 
                              variant="outline" 
                              className="text-[#b8b8b8] border-[#4a4a46] text-xs"
                            >
                              3
                            </Badge>
                          </div>
                          <div className="p-3 max-h-32 overflow-y-auto">
                            <div className="space-y-2 text-xs">
                              <div className="text-[#b8b8b8]">
                                <span className="text-white font-medium">Magnus:</span> Good luck!
                              </div>
                              <div className="text-[#b8b8b8]">
                                <span className="text-white font-medium">Carlsen:</span> Thanks, you too
                              </div>
                              <div className="text-[#b8b8b8]">
                                <span className="text-blue-400 font-medium">System:</span> Game started
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="analysis">
                        <RealAnalysisPanel gameState={gameState} />
                      </TabsContent>
                    </Tabs>
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
