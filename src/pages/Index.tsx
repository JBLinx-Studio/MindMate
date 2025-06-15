
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { GameState } from '../types/chess';
import { createInitialGameState } from '../utils/chessLogic';
import { soundManager } from '../utils/soundManager';
import { toast } from 'sonner';
import { Volume2, VolumeX, Settings, BarChart3, History, Users, Clock, Target, BookOpen, Brain, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    { id: 'stats', icon: BarChart3, label: 'Game Status', color: 'bg-blue-500' },
    { id: 'engine', icon: Brain, label: 'AI Engine', color: 'bg-purple-500' },
    { id: 'history', icon: History, label: 'Move History', color: 'bg-green-500' },
    { id: 'analysis', icon: Target, label: 'Analysis', color: 'bg-orange-500' },
    { id: 'players', icon: Users, label: 'Players', color: 'bg-indigo-500' },
    { id: 'rules', icon: BookOpen, label: 'Rules & Guide', color: 'bg-red-500' },
    { id: 'tools', icon: Settings, label: 'Game Tools', color: 'bg-gray-500' },
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
              <div className="flex items-center space-x-3">
                <Crown className="w-8 h-8 text-yellow-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">ChessMaster Pro</h1>
                  <div className="text-xs text-gray-300">Advanced Chess Platform</div>
                </div>
              </div>
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
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium"
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
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
                
                {/* Left Sidebar - Enhanced Game Status */}
                <div className="xl:col-span-1 space-y-4">
                  <EnhancedGameStatus gameState={gameState} />
                </div>

                {/* Center - Chess Board */}
                <div className="xl:col-span-2 flex justify-center items-start">
                  <div className="space-y-4 w-full max-w-2xl">
                    <EnhancedChessBoard 
                      gameState={gameState}
                      onGameStateChange={handleGameStateChange}
                    />
                    
                    {/* Enhanced Move Suggestion */}
                    <Card className="p-4 bg-white/95 backdrop-blur-md border border-white/30 shadow-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Brain className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-medium text-gray-700">AI Suggestion</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-700 mb-1">Nf3</div>
                        <div className="text-sm text-gray-600 mb-2">Develops knight, controls center squares</div>
                        <div className="text-xs text-purple-600 font-medium">Evaluation: +0.3 (Slightly better for White)</div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Right Sidebar - Enhanced Panel Controls */}
                <div className="xl:col-span-1 space-y-4">
                  <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Game Panels
                    </h3>
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
                          size="sm"
                        >
                          <panel.icon className="w-4 h-4" />
                          <span className="text-sm">{panel.label}</span>
                        </Button>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Game Info */}
                  <Card className="p-4 bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-amber-400" />
                      Quick Info
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Game Mode:</span>
                        <span className="font-medium">Classical</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Time Control:</span>
                        <span className="font-medium">30+0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Rating:</span>
                        <span className="font-medium">2100 vs 2080</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Opening:</span>
                        <span className="font-medium">Sicilian Defense</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Panel Overlay */}
            {activePanel && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
                <div className="bg-white/96 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 max-w-5xl w-full max-h-[85vh] overflow-hidden">
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {panelButtons.find(p => p.id === activePanel)?.icon && (
                          <div className={`p-2 rounded-lg ${panelButtons.find(p => p.id === activePanel)?.color} text-white`}>
                            {React.createElement(panelButtons.find(p => p.id === activePanel)!.icon, { className: 'w-5 h-5' })}
                          </div>
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">
                          {panelButtons.find(p => p.id === activePanel)?.label}
                        </h2>
                      </div>
                      <Button
                        onClick={() => setActivePanel(null)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <span className="text-xl">×</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[70vh]">
                    {activePanel === 'stats' && <EnhancedGameStatus gameState={gameState} />}
                    {activePanel === 'engine' && <PremiumChessEngine gameState={gameState} />}
                    {activePanel === 'history' && <MoveHistoryPanel gameState={gameState} />}
                    {activePanel === 'players' && <PlayersPanel gameState={gameState} />}
                    {activePanel === 'analysis' && <AnalysisPanel gameState={gameState} />}
                    {activePanel === 'rules' && <GameRulesPanel />}
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
