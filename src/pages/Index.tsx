
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import RealAnalysisPanel from '../components/RealAnalysisPanel';
import RealTimeEvaluation from '../components/RealTimeEvaluation';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Settings, Clock, MoreHorizontal, Flag, RotateCcw, Users, MessageSquare, Eye, Share2, Brain, Trophy, Star } from 'lucide-react';
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
  const [playerRatings, setPlayerRatings] = useState({ white: 2831, black: 2820 });
  const [gameMode, setGameMode] = useState<'casual' | 'rated' | 'tournament'>('rated');

  // Enhanced timer logic
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
    
    // Simulate rating change after game
    if (gameMode === 'rated') {
      const ratingChange = Math.floor(Math.random() * 20) - 10;
      setPlayerRatings(prev => ({
        white: Math.max(1200, prev.white + ratingChange),
        black: Math.max(1200, prev.black - ratingChange)
      }));
    }
    
    toast.success('New game started!', {
      description: gameMode === 'rated' ? 'This is a rated game' : 'Casual game'
    });
    
    if (soundEnabled) soundManager.playMoveSound();
  };

  const handleResign = () => {
    if (gameState.moves.length > 0) {
      const winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
      const loser = gameState.currentPlayer;
      
      toast.info(`${winner.charAt(0).toUpperCase() + winner.slice(1)} wins by resignation!`, {
        description: `${loser.charAt(0).toUpperCase() + loser.slice(1)} resigned`
      });
      
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

  const handleOfferDraw = () => {
    toast.info('Draw offer sent to opponent', {
      description: 'Waiting for opponent response...'
    });
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
      
      if (newState.isGameOver) {
        soundManager.playGameOverSound();
        // Update spectator count on game end
        setSpectators(prev => prev + Math.floor(Math.random() * 10) + 5);
      } else if (lastMove.notation.includes('+')) {
        soundManager.playCheckSound();
      } else if (lastMove.captured) {
        soundManager.playCaptureSound();
      } else if (lastMove.specialMove === 'castle') {
        soundManager.playMoveSound(); // Special castle sound would be nice
      } else {
        soundManager.playMoveSound();
      }
    }
    
    // Add time increment after each move (increment of 10 seconds)
    if (newMoveCount > prevMoveCount) {
      setGameTime(prev => {
        const newTime = { ...prev };
        if (gameState.currentPlayer === 'white') {
          newTime.white += 10;
        } else {
          newTime.black += 10;
        }
        return newTime;
      });
    }
    
    setGameState(newState);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlayerTitle = (rating: number) => {
    if (rating >= 2700) return 'GM';
    if (rating >= 2500) return 'IM';
    if (rating >= 2400) return 'FM';
    if (rating >= 2200) return 'CM';
    return '';
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
                            <span className="text-white text-xs font-bold">
                              {getPlayerTitle(playerRatings.black) || 'GM'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm flex items-center space-x-1">
                              <span>Magnus</span>
                              {gameMode === 'tournament' && (
                                <Trophy className="w-3 h-3 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-[#b8b8b8] text-xs flex items-center space-x-1">
                              <span>{playerRatings.black}</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {gameMode === 'rated' && (
                                <Star className="w-3 h-3 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-mono font-bold ${
                            getTimerColor(gameTime.black, gameState.currentPlayer === 'black')
                          }`}>
                            {formatTime(gameTime.black)}
                          </div>
                          {gameState.currentPlayer === 'black' && !gameState.isGameOver && (
                            <div className="text-xs text-[#759900]">• thinking</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Real-time Evaluation */}
                    <RealTimeEvaluation 
                      gameState={gameState} 
                      autoEvaluate={true}
                    />

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
                      
                      <div className="flex space-x-2 mb-3">
                        <Button
                          onClick={handleOfferDraw}
                          variant="outline"
                          className="flex-1 border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] h-8 text-xs"
                          disabled={gameState.moves.length < 2 || gameState.isGameOver}
                        >
                          ½ Offer Draw
                        </Button>
                        <Button
                          onClick={toggleSound}
                          variant="outline"
                          className="px-3 border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46] h-8"
                        >
                          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-[#b8b8b8]">
                        <span>Game mode:</span>
                        <Badge 
                          variant="outline" 
                          className={`${
                            gameMode === 'rated' ? 'border-yellow-500 text-yellow-500' :
                            gameMode === 'tournament' ? 'border-purple-500 text-purple-500' :
                            'border-[#4a4a46] text-[#b8b8b8]'
                          } text-xs`}
                        >
                          {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* White Player */}
                    <div className="bg-[#2c2c28] rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {getPlayerTitle(playerRatings.white) || 'GM'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm flex items-center space-x-1">
                              <span>Carlsen</span>
                              {gameMode === 'tournament' && (
                                <Trophy className="w-3 h-3 text-yellow-500" />
                              )}
                            </div>
                            <div className="text-[#b8b8b8] text-xs flex items-center space-x-1">
                              <span>{playerRatings.white}</span>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              {gameMode === 'rated' && (
                                <Star className="w-3 h-3 text-yellow-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-mono font-bold ${
                            getTimerColor(gameTime.white, gameState.currentPlayer === 'white')
                          }`}>
                            {formatTime(gameTime.white)}
                          </div>
                          {gameState.currentPlayer === 'white' && !gameState.isGameOver && (
                            <div className="text-xs text-[#759900]">• thinking</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Spectators & Game Stats */}
                    <div className="bg-[#2c2c28] rounded-lg p-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-[#b8b8b8]">
                            <Eye className="w-4 h-4" />
                            <span>Spectators</span>
                          </div>
                          <span className="text-white font-medium">{spectators}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[#b8b8b8]">Moves played:</span>
                          <span className="text-white font-medium">
                            {Math.ceil(gameState.moves.length / 2)}
                          </span>
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
                        {/* Enhanced Move History */}
                        <div className="bg-[#2c2c28] rounded-lg">
                          <div className="p-3 border-b border-[#4a4a46] flex items-center justify-between">
                            <h3 className="text-white font-medium text-sm">Move History</h3>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#b8b8b8] hover:text-white h-6 w-6 p-0"
                                onClick={() => toast.info('PGN copied to clipboard')}
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                            </div>
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
                                      <span className="text-white font-mono text-sm flex-1">
                                        {move.notation}
                                      </span>
                                      {move.specialMove && (
                                        <Badge variant="outline" className="text-xs ml-2">
                                          {move.specialMove}
                                        </Badge>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Enhanced Game Info */}
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
                              <span className="text-white">15+10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#b8b8b8]">Status:</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  gameState.isGameOver 
                                    ? 'text-red-400 border-red-400' 
                                    : 'text-[#759900] border-[#759900]'
                                }`}
                              >
                                {gameState.isGameOver ? 'Finished' : 'In progress'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[#b8b8b8]">Type:</span>
                              <span className="text-white capitalize">{gameMode}</span>
                            </div>
                            
                            {gameState.moves.length > 0 && (
                              <div className="pt-2 border-t border-[#4a4a46]">
                                <div className="flex justify-between">
                                  <span className="text-[#b8b8b8]">Last move:</span>
                                  <span className="text-white font-mono">
                                    {gameState.moves[gameState.moves.length - 1]?.notation}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Enhanced Chat */}
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
                              {3 + Math.floor(spectators / 20)}
                            </Badge>
                          </div>
                          <div className="p-3 max-h-32 overflow-y-auto">
                            <div className="space-y-2 text-xs">
                              <div className="text-[#b8b8b8]">
                                <span className="text-white font-medium">Magnus:</span> Good luck! glhf
                              </div>
                              <div className="text-[#b8b8b8]">
                                <span className="text-white font-medium">Carlsen:</span> Thanks, you too! 
                              </div>
                              <div className="text-[#b8b8b8]">
                                <span className="text-blue-400 font-medium">System:</span> {gameMode} game started
                              </div>
                              {gameState.moves.length > 10 && (
                                <div className="text-[#b8b8b8]">
                                  <span className="text-green-400 font-medium">Spectator:</span> Great game!
                                </div>
                              )}
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
