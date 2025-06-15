
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Settings, BarChart3, History, Users, Clock, Target, BookOpen, Brain, Crown, Play, Pause, RotateCcw, Flag, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import GameStatsPanel from '../components/GameStatsPanel';
import MoveHistoryPanel from '../components/MoveHistoryPanel';
import PlayersPanel from '../components/PlayersPanel';
import AnalysisPanel from '../components/AnalysisPanel';
import GameToolsPanel from '../components/GameToolsPanel';
import GameRulesPanel from '../components/GameRulesPanel';
import EnhancedGameStatus from '../components/EnhancedGameStatus';
import PremiumChessEngine from '../components/PremiumChessEngine';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePanel, setActivePanel] = useState<'stats' | 'history' | 'players' | 'analysis' | 'tools' | 'rules' | 'engine' | null>('stats');
  const [gameTime, setGameTime] = useState({ white: 900, black: 900 }); // 15 minutes

  const handleNewGame = () => {
    setGameState(createInitialGameState());
    setGameTime({ white: 900, black: 900 });
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col relative">
          {/* Modern Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl text-white">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Chess.AI</h1>
                  <div className="text-xs text-gray-500">Play • Learn • Compete</div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleSound}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={handleNewGame}
                className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
                size="sm"
              >
                <Play className="w-4 h-4 mr-1" />
                New Game
              </Button>
              
              <Button
                onClick={handleResign}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                size="sm"
                disabled={gameState.moves.length === 0}
              >
                <Flag className="w-4 h-4 mr-1" />
                Resign
              </Button>
            </div>
          </header>

          {/* Main Game Area */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Left Sidebar - Player Info & Controls */}
                <div className="xl:col-span-3 space-y-4">
                  {/* Black Player */}
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-lg flex items-center justify-center text-white font-bold">
                        GM
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Magnus Carlsen</div>
                        <div className="text-sm text-gray-500">2831 • Norway</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-mono font-bold ${gameState.currentPlayer === 'black' ? 'text-green-600' : 'text-gray-500'}`}>
                          {formatTime(gameTime.black)}
                        </div>
                        {gameState.currentPlayer === 'black' && (
                          <div className="text-xs text-green-600 font-medium">TO MOVE</div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Game Controls */}
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="space-y-3">
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-800 mb-1">Game Controls</h3>
                        <div className="text-sm text-gray-500">
                          Move #{Math.ceil(gameState.moves.length / 2)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Pause className="w-3 h-3 mr-1" />
                          Pause
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Takeback
                        </Button>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex justify-between">
                            <span>Time Control:</span>
                            <span className="font-medium">15+10</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Opening:</span>
                            <span className="font-medium">Italian Game</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* White Player */}
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                        GM
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Fabiano Caruana</div>
                        <div className="text-sm text-gray-500">2820 • USA</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-mono font-bold ${gameState.currentPlayer === 'white' ? 'text-green-600' : 'text-gray-500'}`}>
                          {formatTime(gameTime.white)}
                        </div>
                        {gameState.currentPlayer === 'white' && (
                          <div className="text-xs text-green-600 font-medium">TO MOVE</div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Center - Chess Board */}
                <div className="xl:col-span-6 flex justify-center">
                  <div className="space-y-4 w-full max-w-xl">
                    <EnhancedChessBoard 
                      gameState={gameState}
                      onGameStateChange={handleGameStateChange}
                    />
                    
                    {/* Engine Evaluation Bar */}
                    <Card className="p-3 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">Engine Evaluation</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Depth 20
                        </Badge>
                      </div>
                      
                      <div className="relative">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-gray-800 to-white w-1/2"></div>
                        </div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-500"></div>
                      </div>
                      
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-gray-600">Black</span>
                        <span className="font-mono font-medium">+0.3</span>
                        <span className="text-gray-600">White</span>
                      </div>
                    </Card>

                    {/* Best Move */}
                    <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Zap className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">Best Move</span>
                        </div>
                        <div className="text-2xl font-bold text-green-700 mb-1">Nf3</div>
                        <div className="text-sm text-gray-600">
                          Knight to f3, controlling center squares
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Right Sidebar - Analysis & History */}
                <div className="xl:col-span-3 space-y-4">
                  {/* Quick Analysis */}
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-orange-500" />
                      Quick Analysis
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span className="font-medium">Equal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">King Safety:</span>
                        <span className="font-medium text-green-600">Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Development:</span>
                        <span className="font-medium text-blue-600">Active</span>
                      </div>
                    </div>
                  </Card>

                  {/* Move History */}
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <History className="w-4 h-4 mr-2 text-blue-500" />
                      Moves
                    </h3>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {gameState.moves.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No moves yet
                        </div>
                      ) : (
                        gameState.moves.map((move, index) => (
                          <div key={index} className="flex items-center justify-between text-sm hover:bg-gray-50 rounded px-2 py-1">
                            <span className="text-gray-500 w-8">
                              {Math.ceil((index + 1) / 2)}.
                            </span>
                            <span className="font-mono font-medium">
                              {move.from.x + move.from.y}{move.to.x + move.to.y}
                            </span>
                            <span className="text-xs text-gray-400">
                              {move.captured ? '×' : ''}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  {/* Performance Stats */}
                  <Card className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      Performance
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-700">94%</div>
                        <div className="text-xs text-gray-600">Accuracy</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-700">0</div>
                        <div className="text-xs text-gray-600">Blunders</div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Advanced Panel Modal */}
            {activePanel && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {activePanel === 'engine' && 'Premium AI Engine'}
                        {activePanel === 'analysis' && 'Deep Analysis'}
                        {activePanel === 'players' && 'Player Profiles'}
                        {activePanel === 'history' && 'Game History'}
                        {activePanel === 'tools' && 'Game Tools'}
                        {activePanel === 'rules' && 'Rules & Guide'}
                      </h2>
                      <Button
                        onClick={() => setActivePanel(null)}
                        variant="ghost"
                        size="sm"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {activePanel === 'engine' && <PremiumChessEngine gameState={gameState} />}
                    {activePanel === 'analysis' && <AnalysisPanel gameState={gameState} />}
                    {activePanel === 'players' && <PlayersPanel gameState={gameState} />}
                    {activePanel === 'history' && <MoveHistoryPanel gameState={gameState} />}
                    {activePanel === 'tools' && <GameToolsPanel gameState={gameState} onGameStateChange={handleGameStateChange} />}
                    {activePanel === 'rules' && <GameRulesPanel />}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Action Panel */}
            <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
              <Button
                onClick={() => setActivePanel(activePanel === 'engine' ? null : 'engine')}
                className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
                size="sm"
              >
                <Brain className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setActivePanel(activePanel === 'analysis' ? null : 'analysis')}
                className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg"
                size="sm"
              >
                <Target className="w-5 h-5" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
