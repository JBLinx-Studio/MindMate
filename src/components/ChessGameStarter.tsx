
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Settings, Clock, Zap, Crown } from 'lucide-react';

interface ChessGameStarterProps {
  onStartGame?: (gameConfig: any) => void;
}

export const ChessGameStarter: React.FC<ChessGameStarterProps> = ({ onStartGame }) => {
  const [selectedTimeControl, setSelectedTimeControl] = useState('10+0');
  const [gameMode, setGameMode] = useState<'computer' | 'human'>('computer');

  const timeControls = [
    { id: '1+0', name: 'Bullet', time: '1 min', icon: <Zap className="w-4 h-4" />, color: 'bg-red-500' },
    { id: '3+0', name: 'Blitz', time: '3 min', icon: <Clock className="w-4 h-4" />, color: 'bg-orange-500' },
    { id: '5+0', name: 'Blitz', time: '5 min', icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-500' },
    { id: '10+0', name: 'Rapid', time: '10 min', icon: <Crown className="w-4 h-4" />, color: 'bg-green-500' },
  ];

  const handleStartGame = () => {
    const gameConfig = {
      timeControl: selectedTimeControl,
      mode: gameMode,
      timestamp: new Date().toISOString()
    };
    
    console.log('Starting chess game with config:', gameConfig);
    
    if (onStartGame) {
      onStartGame(gameConfig);
    } else {
      // Default action - could navigate to a game page
      console.log('No onStartGame handler provided');
      alert(`Starting ${gameMode} game with ${selectedTimeControl} time control!`);
    }
  };

  return (
    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Start Chess Game</h2>
        <p className="text-[#b8b8b8]">Choose your game settings and begin playing</p>
      </div>

      <div className="space-y-6">
        {/* Game Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Game Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={gameMode === 'computer' ? "default" : "outline"}
              className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                gameMode === 'computer' ? 'bg-[#759900] text-white' : 'border-[#4a4a46] text-[#b8b8b8]'
              }`}
              onClick={() => setGameMode('computer')}
            >
              <Settings className="w-6 h-6" />
              <div className="text-sm font-medium">vs Computer</div>
              <div className="text-xs opacity-80">Practice against AI</div>
            </Button>
            <Button
              variant={gameMode === 'human' ? "default" : "outline"}
              className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                gameMode === 'human' ? 'bg-[#759900] text-white' : 'border-[#4a4a46] text-[#b8b8b8]'
              }`}
              onClick={() => setGameMode('human')}
            >
              <Play className="w-6 h-6" />
              <div className="text-sm font-medium">vs Human</div>
              <div className="text-xs opacity-80">Play against another player</div>
            </Button>
          </div>
        </div>

        {/* Time Control Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Time Control</label>
          <div className="grid grid-cols-2 gap-2">
            {timeControls.map((control) => (
              <Button
                key={control.id}
                variant={selectedTimeControl === control.id ? "default" : "outline"}
                className={`p-3 h-auto flex items-center space-x-2 ${
                  selectedTimeControl === control.id ? `${control.color} text-white` : 'border-[#4a4a46] text-[#b8b8b8]'
                }`}
                onClick={() => setSelectedTimeControl(control.id)}
              >
                <div className={`p-1 rounded ${
                  selectedTimeControl === control.id ? 'bg-white/20' : control.color + ' text-white'
                }`}>
                  {control.icon}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium">{control.name}</div>
                  <div className="text-xs opacity-80">{control.time}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Start Game Button */}
        <Button 
          onClick={handleStartGame}
          className="w-full bg-[#759900] hover:bg-[#6a8700] text-white py-4 text-lg font-semibold"
          size="lg"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Game
        </Button>

        {/* Game Info */}
        <div className="text-center pt-4 border-t border-[#4a4a46]">
          <div className="text-sm text-[#b8b8b8]">
            Selected: <Badge className="ml-1 bg-[#759900]">{selectedTimeControl} {gameMode}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};
