
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import ProfessionalChessBoard from './ProfessionalChessBoard';
import RealAnalysisPanel from './RealAnalysisPanel';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Settings, Clock, MoreHorizontal, Flag, Users, MessageSquare, Eye, Share2, Brain, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopNavigationMenu } from './TopNavigationMenu';
import { Card } from '@/components/ui/card';

const PremiumGameInterface = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameTime, setGameTime] = useState({ white: 900, black: 900 });
  const [spectators, setSpectators] = useState(47);

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    setGameTime({ white: 900, black: 900 });
    toast.success('New premium game started!', {
      description: 'Enhanced AI analysis enabled'
    });
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
    toast.success(`Premium sound ${newSoundState ? 'enabled' : 'disabled'}`);
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#161512] via-[#1a1a16] to-[#141410]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          {/* Premium Game Header */}
          <div className="bg-gradient-to-r from-amber-900/20 via-yellow-800/15 to-amber-900/20 border-b border-amber-700/30">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-amber-400" />
                  <h1 className="text-xl font-bold text-amber-200">Professional Chess Arena</h1>
                  <Badge className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-0">
                    <Zap className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-amber-300 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{spectators} watching</span>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 flex">
            <div className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Left Panel - Enhanced Player Info */}
                  <div className="col-span-3 space-y-4">
                    {/* Black Player - Premium Design */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#242420] border-amber-700/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
                            <Crown className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-base">Magnus Carlsen</div>
                            <div className="text-amber-300 text-sm flex items-center space-x-2">
                              <span className="font-mono">2831</span>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <Badge variant="outline" className="text-xs border-amber-600 text-amber-300">
                                GM
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-mono font-bold ${
                            gameState.currentPlayer === 'black' 
                              ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                              : 'text-gray-400'
                          }`}>
                            {formatTime(gameTime.black)}
                          </div>
                          <div className="text-xs text-gray-400">+10 increment</div>
                        </div>
                      </div>
                    </Card>

                    {/* Premium Game Controls */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#242420] border-amber-700/30 p-4">
                      <div className="space-y-4">
                        <h3 className="text-amber-200 font-semibold flex items-center">
                          <Settings className="w-4 h-4 mr-2" />
                          Game Controls
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            onClick={handleNewGame}
                            className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white text-sm h-9 shadow-lg"
                          >
                            New Game
                          </Button>
                          <Button
                            onClick={handleResign}
                            variant="outline"
                            className="border-red-600/50 text-red-400 hover:bg-red-600/20 h-9"
                            disabled={gameState.moves.length === 0}
                          >
                            <Flag className="w-4 h-4 mr-1" />
                            Resign
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={toggleSound}
                            variant="outline"
                            className="border-amber-600/50 text-amber-300 hover:bg-amber-600/20 h-9 text-xs"
                          >
                            {soundEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
                            Audio
                          </Button>
                          <Button
                            variant="outline"
                            className="border-amber-600/50 text-amber-300 hover:bg-amber-600/20 h-9"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* White Player - Premium Design */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#242420] border-amber-700/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-lg">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-bold text-base">You</div>
                            <div className="text-blue-300 text-sm flex items-center space-x-2">
                              <span className="font-mono">1847</span>
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <Badge variant="outline" className="text-xs border-blue-600 text-blue-300">
                                Expert
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-mono font-bold ${
                            gameState.currentPlayer === 'white' 
                              ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                              : 'text-gray-400'
                          }`}>
                            {formatTime(gameTime.white)}
                          </div>
                          <div className="text-xs text-gray-400">+10 increment</div>
                        </div>
                      </div>
                    </Card>

                    {/* Premium Game Stats */}
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#242420] border-amber-700/30 p-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Opening:</span>
                          <span className="text-amber-300 font-medium">Sicilian Defense</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time control:</span>
                          <span className="text-white">15+10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs">
                            Active
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Analysis:</span>
                          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                            <Brain className="w-3 h-3 mr-1" />
                            Real-time
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Center - Premium Chess Board */}
                  <div className="col-span-6 flex justify-center">
                    <ProfessionalChessBoard 
                      gameState={gameState}
                      onGameStateChange={handleGameStateChange}
                    />
                  </div>

                  {/* Right Panel - Enhanced Analysis */}
                  <div className="col-span-3">
                    <Card className="bg-gradient-to-br from-[#2c2c28] to-[#242420] border-amber-700/30 h-full">
                      <Tabs defaultValue="analysis" className="w-full h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-2 bg-[#1a1a16] border-b border-amber-700/30">
                          <TabsTrigger 
                            value="analysis" 
                            className="text-amber-300 data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200"
                          >
                            <Brain className="w-3 h-3 mr-1" />
                            Analysis
                          </TabsTrigger>
                          <TabsTrigger 
                            value="moves" 
                            className="text-amber-300 data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200"
                          >
                            Moves
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="analysis" className="flex-1 p-0">
                          <RealAnalysisPanel gameState={gameState} />
                        </TabsContent>

                        <TabsContent value="moves" className="flex-1 p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-amber-200 font-medium text-sm">Move History</h3>
                              <Badge variant="outline" className="text-xs border-amber-600 text-amber-300">
                                {gameState.moves.length} moves
                              </Badge>
                            </div>
                            
                            <div className="max-h-96 overflow-y-auto space-y-1">
                              {gameState.moves.length === 0 ? (
                                <div className="text-gray-400 text-sm text-center py-8">
                                  No moves played yet
                                </div>
                              ) : (
                                gameState.moves.map((move, index) => {
                                  const moveNumber = Math.ceil((index + 1) / 2);
                                  const isWhiteMove = index % 2 === 0;
                                  
                                  return (
                                    <div key={index} className="flex items-center text-sm hover:bg-amber-600/10 px-2 py-1 rounded cursor-pointer transition-colors">
                                      {isWhiteMove && (
                                        <span className="text-gray-400 w-8 text-xs">
                                          {moveNumber}.
                                        </span>
                                      )}
                                      <span className="text-amber-200 font-mono text-xs">
                                        {move.notation}
                                        {move.captured && <span className="text-red-400 ml-1">×</span>}
                                      </span>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </Card>
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

export default PremiumGameInterface;
