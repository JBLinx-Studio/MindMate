
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import RealAnalysisPanel from '../components/RealAnalysisPanel';
import RealTimeEvaluation from '../components/RealTimeEvaluation';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Flag, RotateCcw, Users, MessageSquare, Eye, Share2, Brain, Trophy, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GameWindow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameTime, setGameTime] = useState({ white: 900, black: 900 });
  const [spectators, setSpectators] = useState(1);
  
  // Get game configuration from URL params
  const gameMode = searchParams.get('mode') || 'casual';
  const timeControl = searchParams.get('time') || '15+10';
  const opponent = searchParams.get('opponent') || 'Computer';
  const playerColor = searchParams.get('color') || 'white';

  const playerRatings = {
    white: playerColor === 'white' ? 1500 : 1520,
    black: playerColor === 'black' ? 1500 : 1520
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!gameState.isGameOver && gameState.moves.length > 0) {
      interval = setInterval(() => {
        setGameTime(prev => {
          const newTime = { ...prev };
          if (gameState.currentPlayer === 'white') {
            newTime.white = Math.max(0, newTime.white - 1);
            if (newTime.white === 0) {
              toast.error('White ran out of time!');
              handleTimeOut('white');
            }
          } else {
            newTime.black = Math.max(0, newTime.black - 1);
            if (newTime.black === 0) {
              toast.error('Black ran out of time!');
              handleTimeOut('black');
            }
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isGameOver, gameState.currentPlayer, gameState.moves.length]);

  const handleTimeOut = (player: 'white' | 'black') => {
    const winner = player === 'white' ? 'black' : 'white';
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
      winner,
      gameResult: {
        type: 'timeout',
        winner,
        reason: `${player.charAt(0).toUpperCase() + player.slice(1)} ran out of time`
      }
    }));
    if (soundEnabled) soundManager.playGameOverSound();
  };

  const handleNewGame = () => {
    const newGameState = createInitialGameState();
    setGameState(newGameState);
    setGameTime({ white: 900, black: 900 });
    toast.success('New game started!');
    if (soundEnabled) soundManager.playMoveSound();
  };

  const handleResign = () => {
    if (gameState.moves.length > 0) {
      const winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
      const loser = gameState.currentPlayer;
      
      toast.info(`${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by resignation!`);
      
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        winner,
        gameResult: {
          type: 'resignation',
          winner,
          reason: `${loser.charAt(0).toUpperCase() + loser.slice(1)} resigned`
        }
      }));
      
      if (soundEnabled) soundManager.playGameOverSound();
    }
  };

  const toggleSound = () => {
    const newSoundState = soundManager.toggleSound();
    setSoundEnabled(newSoundState);
    toast.success(`Sound ${newSoundState ? 'enabled' : 'disabled'}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (time: number, isActive: boolean) => {
    if (!isActive) return 'text-[#b8b8b8]';
    if (time < 60) return 'text-red-500 animate-pulse';
    if (time < 300) return 'text-orange-500';
    return 'text-[#759900]';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />

          <div className="p-4 border-b border-[#4a4a46] bg-[#2c2c28]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/lobby')}
                  className="text-[#b8b8b8] hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Lobby
                </Button>
                <div className="text-white">
                  <span className="font-medium">{gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Game</span>
                  <span className="text-[#b8b8b8] ml-2">• {timeControl} • vs {opponent}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-[#759900] border-[#759900]">
                  {gameState.isGameOver ? 'Finished' : 'Active'}
                </Badge>
                <div className="flex items-center space-x-1 text-sm text-[#b8b8b8]">
                  <Eye className="w-4 h-4" />
                  <span>{spectators}</span>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 flex p-4">
            <div className="max-w-7xl mx-auto w-full">
              <div className="grid grid-cols-12 gap-4">
                
                {/* Left Panel - Player Info & Controls */}
                <div className="col-span-3 space-y-3">
                  {/* Opponent Player */}
                  <div className="bg-[#2c2c28] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {opponent === 'Computer' ? 'AI' : 'GM'}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm flex items-center space-x-1">
                            <span>{opponent}</span>
                            {gameMode === 'tournament' && (
                              <Trophy className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-[#b8b8b8] text-xs flex items-center space-x-1">
                            <span>{playerColor === 'white' ? playerRatings.black : playerRatings.white}</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-mono font-bold ${
                          getTimerColor(
                            playerColor === 'white' ? gameTime.black : gameTime.white, 
                            (playerColor === 'white' ? gameState.currentPlayer === 'black' : gameState.currentPlayer === 'white')
                          )
                        }`}>
                          {formatTime(playerColor === 'white' ? gameTime.black : gameTime.white)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <RealTimeEvaluation gameState={gameState} autoEvaluate={true} />

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
                        disabled={gameState.moves.length === 0 || gameState.isGameOver}
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
                        {soundEnabled ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}
                        Sound
                      </Button>
                    </div>
                  </div>

                  {/* Your Player */}
                  <div className="bg-[#2c2c28] rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-[#759900] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">ME</span>
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">You</div>
                          <div className="text-[#b8b8b8] text-xs flex items-center space-x-1">
                            <span>{playerColor === 'white' ? playerRatings.white : playerRatings.black}</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {gameMode === 'rated' && (
                              <Star className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-mono font-bold ${
                          getTimerColor(
                            playerColor === 'white' ? gameTime.white : gameTime.black, 
                            (playerColor === 'white' ? gameState.currentPlayer === 'white' : gameState.currentPlayer === 'black')
                          )
                        }`}>
                          {formatTime(playerColor === 'white' ? gameTime.white : gameTime.black)}
                        </div>
                        {((playerColor === 'white' && gameState.currentPlayer === 'white') || 
                          (playerColor === 'black' && gameState.currentPlayer === 'black')) && !gameState.isGameOver && (
                          <div className="text-xs text-[#759900]">• your turn</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - Chess Board */}
                <div className="col-span-6 flex justify-center">
                  <div className="w-full max-w-xl">
                    <EnhancedChessBoard 
                      gameState={gameState}
                      onGameStateChange={setGameState}
                    />
                  </div>
                </div>

                {/* Right Panel - Analysis & Moves */}
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
                        <div className="p-3 border-b border-[#4a4a46]">
                          <h3 className="text-white font-medium text-sm">Move History</h3>
                        </div>
                        <div className="p-3 max-h-64 overflow-y-auto">
                          {gameState.moves.length === 0 ? (
                            <div className="text-[#b8b8b8] text-sm text-center py-4">
                              Game hasn't started yet
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {gameState.moves.map((move, index) => {
                                const moveNumber = Math.ceil((index + 1) / 2);
                                const isWhiteMove = index % 2 === 0;
                                
                                return (
                                  <div key={index} className="flex items-center text-sm hover:bg-[#3d3d37] px-2 py-1 rounded cursor-pointer transition-colors">
                                    {isWhiteMove && (
                                      <span className="text-[#b8b8b8] w-8 text-xs font-medium">
                                        {moveNumber}.
                                      </span>
                                    )}
                                    <span className="text-white font-mono text-sm">
                                      {move.notation}
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
                            <span className="text-white">
                              {gameState.moves.length < 5 ? 'Opening...' : 'Italian Game'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#b8b8b8]">Time control:</span>
                            <span className="text-white">{timeControl}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#b8b8b8]">Game mode:</span>
                            <span className="text-white capitalize">{gameMode}</span>
                          </div>
                          
                          {gameState.isGameOver && gameState.gameResult && (
                            <div className="pt-2 border-t border-[#4a4a46]">
                              <div className="text-center">
                                <div className="text-white font-semibold">Game Over</div>
                                <div className="text-xs text-[#b8b8b8]">{gameState.gameResult.reason}</div>
                              </div>
                            </div>
                          )}
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default GameWindow;
