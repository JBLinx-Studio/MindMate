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
      <div className="min-h-screen flex w-full bg-[#ececec] font-sans">
        <AppSidebar />

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col relative">
          {/* Lichess-like slim header */}
          <header className="h-12 flex items-center justify-between px-6 bg-neutral-100 border-b border-neutral-300 shadow-none">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-neutral-300 rounded text-black text-xl font-bold">
                  ♔
                </div>
                <div>
                  <h1 className="text-lg font-bold text-neutral-800 tracking-wide">lichess</h1>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleSound}
                variant="ghost"
                size="icon"
                className="text-neutral-500 hover:text-black rounded"
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                onClick={handleNewGame}
                className="bg-neutral-800 hover:bg-black text-white font-semibold rounded px-4"
                size="sm"
              >
                <Play className="w-4 h-4 mr-1" />
                New Game
              </Button>
              <Button
                onClick={handleResign}
                variant="outline"
                className="border-neutral-400 text-neutral-600 hover:bg-neutral-200"
                size="sm"
                disabled={gameState.moves.length === 0}
              >
                <Flag className="w-4 h-4 mr-1" />
                Resign
              </Button>
            </div>
          </header>

          {/* Main Layout: board (flush left), move history (mid), panels (right) */}
          <main className="flex-1 flex flex-row items-stretch gap-0 py-0 px-0 w-full overflow-hidden">
            {/* LEFT: Chessboard (anchored left, flat, slim border) */}
            <div className="flex flex-col justify-start items-end w-full xl:max-w-[600px] border-r border-neutral-300 bg-[#e0e0e0] p-0 pt-4">
              <div className="w-full flex-1 flex justify-end items-center">
                <EnhancedChessBoard 
                  gameState={gameState}
                  onGameStateChange={handleGameStateChange}
                />
              </div>
            </div>

            {/* CENTER: Move list/history, minimal info */}
            <div className="hidden xl:flex flex-col w-[220px] border-r border-neutral-300 bg-[#f7f7f7]">
              <Card className="border-none shadow-none bg-transparent mt-8 px-3 py-2">
                <h3 className="font-medium text-neutral-700 text-base mb-2">Moves</h3>
                <div className="overflow-y-auto max-h-[500px] text-sm font-mono">
                  {gameState.moves.length === 0 ? (
                    <div className="text-neutral-400 text-center py-4">
                      No moves yet
                    </div>
                  ) : (
                    gameState.moves.map((move, i) => (
                      <div key={i} className="flex space-x-2 py-0.5 px-2 rounded hover:bg-neutral-200/50">
                        <span className="text-xs w-6 text-right text-neutral-400">
                          {(i % 2 === 0) ? (Math.floor(i/2) +1) + '.' : ''}
                        </span>
                        <span>{move.notation}</span>
                        <span className="text-xs text-neutral-300">
                          {move.captured ? '×' : ''}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT: Panels (performance, players, controls, etc) */}
            <div className="hidden xl:flex flex-col w-[310px] items-start px-3 py-8 gap-4 bg-[#f5f5f5]">
              {/* Black Player Panel */}
              <Card className="p-3 bg-neutral-100 border border-neutral-300 w-full shadow-none mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-700 text-white font-bold">GM</div>
                  <span className="font-semibold text-neutral-800">Magnus Carlsen</span>
                  <span className="text-neutral-500 text-xs ml-auto">{formatTime(gameTime.black)}</span>
                </div>
              </Card>

              {/* Game Controls, Stats, Short Info */}
              <Card className="p-3 bg-neutral-100 border border-neutral-300 shadow-none w-full mb-3">
                <div className="flex justify-between">
                  <span className="text-xs text-neutral-400">Turn</span>
                  <span className="text-xs font-semibold text-neutral-600">{gameState.currentPlayer}</span>
                </div>
                <div className="mt-2 flex gap-2 items-center">
                  <Button variant="outline" size="icon" className="rounded bg-neutral-200">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded bg-neutral-200">
                    <Pause className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* White Player Panel */}
              <Card className="p-3 bg-neutral-100 border border-neutral-300 w-full shadow-none">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold">GM</div>
                  <span className="font-semibold text-neutral-800">Fabiano Caruana</span>
                  <span className="text-neutral-500 text-xs ml-auto">{formatTime(gameTime.white)}</span>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
