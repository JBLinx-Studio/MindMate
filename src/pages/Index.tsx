
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Settings, BarChart3, History, Users, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import GameStatsPanel from '../components/GameStatsPanel';
import MoveHistoryPanel from '../components/MoveHistoryPanel';
import PlayersPanel from '../components/PlayersPanel';
import AnalysisPanel from '../components/AnalysisPanel';
import GameToolsPanel from '../components/GameToolsPanel';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activePanel, setActivePanel] = useState<'stats' | 'history' | 'players' | 'analysis' | 'tools' | null>('stats');

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

  const panelButtons = [
    { id: 'stats', icon: BarChart3, label: 'Statistics', color: 'bg-blue-500' },
    { id: 'history', icon: History, label: 'Move History', color: 'bg-green-500' },
    { id: 'players', icon: Users, label: 'Players', color: 'bg-purple-500' },
    { id: 'analysis', icon: Target, label: 'Analysis', color: 'bg-orange-500' },
    { id: 'tools', icon: Settings, label: 'Tools', color: 'bg-red-500' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col relative">
          {/* Enhanced Header */}
          <header className="h-16 flex items-center justify-between px-6 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden text-white" />
              <h1 className="text-2xl font-bold text-white">
                ChessMaster Pro
              </h1>
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Live Game</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={toggleSound}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
              
              <Button
                onClick={handleNewGame}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                New Game
              </Button>
              
              <Button
                onClick={handleResign}
                variant="destructive"
                className="bg-red-600/80 hover:bg-red-700"
                disabled={gameState.moves.length === 0}
              >
                Resign
              </Button>
            </div>
          </header>

          {/* Main Game Area */}
          <main className="flex-1 p-6 relative">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                
                {/* Left Sidebar - Quick Stats */}
                <div className="xl:col-span-1 space-y-4">
                  <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="w-5 h-5 text-amber-400" />
                      <h3 className="font-semibold">Game Timer</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">15:30</div>
                        <div className="text-sm text-gray-300">White</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">14:45</div>
                        <div className="text-sm text-gray-300">Black</div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <h3 className="font-semibold mb-3">Quick Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Moves:</span>
                        <span>{gameState.moves.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Captures:</span>
                        <span>{gameState.moves.filter(m => m.captured).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Turn:</span>
                        <span className="capitalize">{gameState.currentPlayer}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Center - Chess Board */}
                <div className="xl:col-span-1 flex justify-center items-start">
                  <div className="space-y-4">
                    <EnhancedChessBoard 
                      gameState={gameState}
                      onGameStateChange={handleGameStateChange}
                    />
                    
                    {/* Game Status */}
                    <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20 text-center">
                      <div className="text-xl font-bold text-white mb-2">
                        {gameState.isGameOver ? (
                          <span className="text-red-400">
                            Game Over - {gameState.winner ? `${gameState.winner.charAt(0).toUpperCase() + gameState.winner.slice(1)} Wins!` : 'Draw'}
                          </span>
                        ) : (
                          <span className={gameState.currentPlayer === 'white' ? 'text-amber-300' : 'text-blue-300'}>
                            {gameState.currentPlayer === 'white' ? "White's Turn" : "Black's Turn"}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300">
                        {gameState.moves.length === 0 
                          ? "Make your first move to begin" 
                          : `Move ${Math.floor(gameState.moves.length / 2) + 1}`
                        }
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Right Sidebar - Panel Controls */}
                <div className="xl:col-span-1 space-y-4">
                  <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
                    <h3 className="font-semibold text-white mb-3">Game Panels</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {panelButtons.map((panel) => (
                        <Button
                          key={panel.id}
                          onClick={() => setActivePanel(activePanel === panel.id ? null : panel.id as any)}
                          variant={activePanel === panel.id ? "default" : "ghost"}
                          className={`justify-start space-x-2 text-white ${
                            activePanel === panel.id 
                              ? `${panel.color} hover:opacity-90` 
                              : 'hover:bg-white/10'
                          }`}
                        >
                          <panel.icon className="w-4 h-4" />
                          <span>{panel.label}</span>
                        </Button>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Floating Panel Overlay */}
            {activePanel && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-6">
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[80vh] overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800">
                        {panelButtons.find(p => p.id === activePanel)?.label}
                      </h2>
                      <Button
                        onClick={() => setActivePanel(null)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {activePanel === 'stats' && <GameStatsPanel gameState={gameState} />}
                    {activePanel === 'history' && <MoveHistoryPanel gameState={gameState} />}
                    {activePanel === 'players' && <PlayersPanel gameState={gameState} />}
                    {activePanel === 'analysis' && <AnalysisPanel gameState={gameState} />}
                    {activePanel === 'tools' && <GameToolsPanel gameState={gameState} onGameStateChange={handleGameStateChange} />}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
