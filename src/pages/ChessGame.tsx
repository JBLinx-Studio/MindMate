
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { GameState, createInitialGameState } from '../types/chess';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, MessageCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

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

              {/* Main Game Layout */}
              <div className="grid grid-cols-12 gap-6">
                {/* Left Panel - Analysis & Engine */}
                <div className="col-span-3 space-y-4">
                  {/* Engine Analysis */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Engine Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">0.00</div>
                        <div className="text-sm text-[#b8b8b8]">Equal position</div>
                      </div>
                      <div className="bg-[#1a1a16] rounded p-2">
                        <div className="text-xs text-[#b8b8b8] mb-1">Depth 6</div>
                        <div className="h-2 bg-gray-600 rounded overflow-hidden">
                          <div className="h-full w-1/2 bg-white"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-[#b8b8b8]">
                          <span className="text-white">Opening:</span> Balanced
                        </div>
                        <div className="text-sm text-[#b8b8b8]">
                          <span className="text-white">Move:</span> 0 • white to move
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Game Controls */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46]">
                    <CardContent className="pt-6 space-y-3">
                      <Button className="w-full bg-[#759900] hover:bg-[#6a8700] text-white">
                        New Game
                      </Button>
                      <Button variant="outline" className="w-full bg-[#3a3a36] border-[#4a4a46] text-white hover:bg-[#4a4a46]">
                        ½ Offer Draw
                      </Button>
                      <Button variant="outline" className="w-full bg-[#3a3a36] border-[#4a4a46] text-white hover:bg-[#4a4a46]">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Player Info */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46]">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">GM</span>
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">Magnus</div>
                              <div className="text-[#b8b8b8] text-xs">2820 ⭐ ☆</div>
                            </div>
                          </div>
                          <div className="text-white font-mono">15:00</div>
                        </div>
                        
                        <Separator className="bg-[#4a4a46]" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                              <span className="text-white text-sm">GM</span>
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">Carlsen</div>
                              <div className="text-[#b8b8b8] text-xs">2831 🟢 ☆</div>
                            </div>
                          </div>
                          <div className="text-white font-mono">15:00</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Game Mode */}
                  <div className="text-center">
                    <Badge className="bg-[#759900] text-white">Rated</Badge>
                  </div>

                  {/* Spectators */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46]">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#b8b8b8]">👁 Spectators</span>
                        <span className="text-white font-bold">47</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-[#b8b8b8]">Moves played:</span>
                        <span className="text-white font-bold">0</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center - Chess Board */}
                <div className="col-span-6 flex justify-center">
                  <EnhancedChessBoard 
                    gameState={gameState}
                    onGameStateChange={setGameState}
                  />
                </div>

                {/* Right Panel - Moves & Analysis */}
                <div className="col-span-3 space-y-4">
                  {/* Moves and Analysis Tabs */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46]">
                    <CardHeader className="pb-3">
                      <div className="flex space-x-4">
                        <Button variant="ghost" className="text-white bg-[#3a3a36] px-4 py-2">
                          Moves
                        </Button>
                        <Button variant="ghost" className="text-[#b8b8b8] hover:text-white px-4 py-2">
                          📊 Analysis
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ScrollArea className="h-full">
                          <div className="text-center text-[#b8b8b8] py-8">
                            <div className="text-sm">Move History</div>
                            <div className="text-xs mt-2">Game hasn't started yet</div>
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Game Info */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46]">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#b8b8b8]">Opening:</span>
                        <span className="text-white">Opening...</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#b8b8b8]">Time control:</span>
                        <span className="text-white">15+10</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#b8b8b8]">Status:</span>
                        <Badge className="bg-green-600 text-white text-xs">In progress</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#b8b8b8]">Type:</span>
                        <span className="text-white">Rated</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chat */}
                  <Card className="bg-[#2c2c28] border-[#4a4a46]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Chat
                        <Badge className="bg-[#4a4a46] text-white text-xs">5</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32">
                        <ScrollArea className="h-full">
                          <div className="space-y-2 text-xs">
                            <div className="text-[#759900]">Magnus: Good luck! glhf</div>
                            <div className="text-blue-400">Carlsen: Thanks, you too!</div>
                            <div className="text-gray-400">System: rated game started</div>
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChessGame;
