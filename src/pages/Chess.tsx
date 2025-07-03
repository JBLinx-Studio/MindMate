
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { TopNavigationMenu } from '../components/TopNavigationMenu';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Crown, 
  Users, 
  Trophy, 
  Target,
  Clock,
  Star,
  Zap,
  Brain,
  BookOpen,
  BarChart3,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnhancedChessBoard from '../components/EnhancedChessBoard';
import { GameState } from '../types/chess';
import { toast } from 'sonner';
import { realPlayerDatabase } from '../utils/realPlayerDatabase';

const Chess = () => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState<'menu' | 'playing'>('menu');
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize a chess game
  const initializeGame = (): GameState => {
    const initialBoard = [
      [
        { type: 'rook', color: 'black', position: { x: 0, y: 0 } },
        { type: 'knight', color: 'black', position: { x: 1, y: 0 } },
        { type: 'bishop', color: 'black', position: { x: 2, y: 0 } },
        { type: 'queen', color: 'black', position: { x: 3, y: 0 } },
        { type: 'king', color: 'black', position: { x: 4, y: 0 } },
        { type: 'bishop', color: 'black', position: { x: 5, y: 0 } },
        { type: 'knight', color: 'black', position: { x: 6, y: 0 } },
        { type: 'rook', color: 'black', position: { x: 7, y: 0 } }
      ],
      Array(8).fill(null).map((_, x) => ({ type: 'pawn' as const, color: 'black' as const, position: { x, y: 1 } })),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null),
      Array(8).fill(null).map((_, x) => ({ type: 'pawn' as const, color: 'white' as const, position: { x, y: 6 } })),
      [
        { type: 'rook', color: 'white', position: { x: 0, y: 7 } },
        { type: 'knight', color: 'white', position: { x: 1, y: 7 } },
        { type: 'bishop', color: 'white', position: { x: 2, y: 7 } },
        { type: 'queen', color: 'white', position: { x: 3, y: 7 } },
        { type: 'king', color: 'white', position: { x: 4, y: 7 } },
        { type: 'bishop', color: 'white', position: { x: 5, y: 7 } },
        { type: 'knight', color: 'white', position: { x: 6, y: 7 } },
        { type: 'rook', color: 'white', position: { x: 7, y: 7 } }
      ]
    ];

    return {
      board: initialBoard,
      currentPlayer: 'white',
      moves: [],
      isGameOver: false,
      validMoves: [],
      fullMoveNumber: 1
    };
  };

  const handleStartGame = (mode: string) => {
    const newGame = initializeGame();
    setGameState(newGame);
    setGameMode('playing');
    toast.success(`Starting ${mode} game!`, {
      description: 'Good luck and have fun!'
    });
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setGameState(null);
  };

  const chessGameModes = [
    {
      id: 'bullet',
      title: 'Bullet Chess',
      subtitle: '1+0 • Lightning fast',
      icon: <Zap className="w-8 h-8 text-red-400" />,
      time: '1 min',
      description: 'Ultra-fast games for quick thinking',
      color: 'from-red-500/20 to-red-600/20 border-red-400/30'
    },
    {
      id: 'blitz',
      title: 'Blitz Chess',
      subtitle: '5+0 • Quick games',
      icon: <Clock className="w-8 h-8 text-yellow-400" />,
      time: '5 min',
      description: 'Fast-paced tactical battles',
      color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/30'
    },
    {
      id: 'rapid',
      title: 'Rapid Chess',
      subtitle: '15+10 • Balanced play',
      icon: <Crown className="w-8 h-8 text-blue-400" />,
      time: '15+10',
      description: 'Perfect balance of speed and strategy',
      color: 'from-blue-500/20 to-blue-600/20 border-blue-400/30'
    },
    {
      id: 'classical',
      title: 'Classical Chess',
      subtitle: '30+0 • Deep thinking',
      icon: <Brain className="w-8 h-8 text-purple-400" />,
      time: '30 min',
      description: 'Long games for deep calculation',
      color: 'from-purple-500/20 to-purple-600/20 border-purple-400/30'
    }
  ];

  const chessFeatures = [
    {
      title: 'Daily Puzzles',
      icon: <Target className="w-6 h-6 text-green-400" />,
      description: 'Solve tactical puzzles',
      route: '/chess-puzzles'
    },
    {
      title: 'Learn Openings',
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      description: 'Master chess openings',
      route: '/opening-explorer'
    },
    {
      title: 'Game Analysis',
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      description: 'Analyze your games',
      route: '/analysis'
    },
    {
      title: 'Tournaments',
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      description: 'Join competitions',
      route: '/tournaments'
    }
  ];

  if (gameMode === 'playing' && gameState) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#161512]">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col">
            <TopNavigationMenu />
            
            <main className="flex-1 p-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                  <Button 
                    variant="outline"
                    onClick={handleBackToMenu}
                    className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                  >
                    ← Back to Chess Menu
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <EnhancedChessBoard 
                      gameState={gameState}
                      onGameStateChange={setGameState}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-4">
                      <h3 className="text-white font-semibold mb-3">Game Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#b8b8b8]">Current Turn:</span>
                          <span className="text-white capitalize">{gameState.currentPlayer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#b8b8b8]">Moves:</span>
                          <span className="text-white">{gameState.moves.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#b8b8b8]">Game Status:</span>
                          <span className="text-white">
                            {gameState.isGameOver ? 'Finished' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigationMenu />
          
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-12 h-12 text-[#759900] mr-3" />
                  <h1 className="text-4xl font-bold text-white">Chess Hub</h1>
                </div>
                <p className="text-[#b8b8b8] text-lg">Master the game of kings with various time controls and features</p>
              </div>

              {/* Game Modes */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Choose Your Game Mode</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {chessGameModes.map((mode) => (
                    <Card key={mode.id} className={`bg-gradient-to-br ${mode.color} border p-6 hover:scale-105 transition-all duration-300`}>
                      <div className="text-center space-y-4">
                        <div className="flex justify-center">{mode.icon}</div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{mode.title}</h3>
                          <p className="text-[#b8b8b8] text-sm">{mode.subtitle}</p>
                        </div>
                        <p className="text-[#b8b8b8] text-xs">{mode.description}</p>
                        <Button
                          onClick={() => handleStartGame(mode.title)}
                          className="w-full bg-[#759900] hover:bg-[#6a8700] text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Play {mode.time}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Chess Features */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Chess Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {chessFeatures.map((feature) => (
                    <Card key={feature.title} className="bg-[#2c2c28] border-[#4a4a46] p-4 hover:border-[#759900] transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3 mb-3">
                        {feature.icon}
                        <h3 className="text-white font-medium">{feature.title}</h3>
                      </div>
                      <p className="text-[#b8b8b8] text-sm mb-3">{feature.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                        onClick={() => navigate(feature.route)}
                      >
                        Explore
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Your Chess Stats</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#759900]">1,247</div>
                    <div className="text-[#b8b8b8] text-sm">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#759900]">1,456</div>
                    <div className="text-[#b8b8b8] text-sm">Current Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#759900]">342</div>
                    <div className="text-[#b8b8b8] text-sm">Puzzles Solved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#759900]">7</div>
                    <div className="text-[#b8b8b8] text-sm">Tournaments Won</div>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chess;
