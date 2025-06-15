import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Zap, 
  Clock, 
  Users, 
  Bot, 
  Trophy, 
  Star,
  Settings,
  Timer,
  Target,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { realMatchmaking } from '../utils/realMatchmaking';

interface QuickPairingPanelProps {
  onStartGame?: (config: any) => void;
}

const QuickPairingPanel: React.FC<QuickPairingPanelProps> = ({ onStartGame }) => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [gameConfig, setGameConfig] = useState({
    timeControl: '10+0',
    gameMode: 'casual',
    opponent: 'human',
    ratingRange: [1000, 1400] as [number, number],
    color: 'random',
    increment: 0,
    rated: false
  });

  const timeControls = [
    { id: '1+0', name: 'Bullet', time: '1 min', icon: <Zap className="w-4 h-4" />, color: 'text-red-400' },
    { id: '1+1', name: 'Bullet', time: '1+1', icon: <Zap className="w-4 h-4" />, color: 'text-red-400' },
    { id: '3+0', name: 'Blitz', time: '3 min', icon: <Zap className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: '3+2', name: 'Blitz', time: '3+2', icon: <Zap className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: '5+0', name: 'Blitz', time: '5 min', icon: <Clock className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: '5+3', name: 'Blitz', time: '5+3', icon: <Clock className="w-4 h-4" />, color: 'text-yellow-400' },
    { id: '10+0', name: 'Rapid', time: '10 min', icon: <Clock className="w-4 h-4" />, color: 'text-green-400' },
    { id: '15+10', name: 'Rapid', time: '15+10', icon: <Clock className="w-4 h-4" />, color: 'text-green-400' },
    { id: '30+0', name: 'Classical', time: '30 min', icon: <Timer className="w-4 h-4" />, color: 'text-blue-400' }
  ];

  const handleQuickPlay = async () => {
    if (gameConfig.opponent === 'computer') {
      // Immediate computer game
      const opponent = 'Computer';
      
      toast.success(`Starting ${gameConfig.gameMode} game...`, {
        description: `${gameConfig.timeControl} vs ${opponent}`,
        duration: 2000,
      });

      const params = new URLSearchParams({
        mode: gameConfig.gameMode,
        time: gameConfig.timeControl,
        opponent: opponent,
        color: gameConfig.color === 'random' ? (Math.random() > 0.5 ? 'white' : 'black') : gameConfig.color,
        rated: gameConfig.rated.toString()
      });

      navigate(`/game?${params.toString()}`);
      return;
    }

    // Real human matchmaking
    setIsSearching(true);
    
    try {
      const matchResult = await realMatchmaking.findMatch({
        timeControl: gameConfig.timeControl,
        ratingRange: gameConfig.ratingRange,
        color: gameConfig.color as 'white' | 'black' | 'random',
        rated: gameConfig.rated,
        gameMode: gameConfig.gameMode
      });

      if (matchResult.success && matchResult.opponent && matchResult.gameId) {
        toast.success(`Match found!`, {
          description: `Playing ${matchResult.opponent.username} (${matchResult.opponent.rating})`,
          duration: 3000,
        });

        const params = new URLSearchParams({
          mode: gameConfig.gameMode,
          time: gameConfig.timeControl,
          opponent: matchResult.opponent.username,
          opponentRating: matchResult.opponent.rating.toString(),
          gameId: matchResult.gameId,
          color: gameConfig.color === 'random' ? (Math.random() > 0.5 ? 'white' : 'black') : gameConfig.color,
          rated: gameConfig.rated.toString()
        });

        navigate(`/game?${params.toString()}`);
      } else {
        toast.info('Searching for opponent...', {
          description: `Estimated wait: ${matchResult.estimatedWaitTime}s`,
          duration: matchResult.estimatedWaitTime ? matchResult.estimatedWaitTime * 1000 : 5000,
        });

        // Continue searching for a while, then timeout
        setTimeout(() => {
          setIsSearching(false);
          toast.error('No opponent found', {
            description: 'Try adjusting your rating range or time control'
          });
        }, (matchResult.estimatedWaitTime || 30) * 1000);
      }
    } catch (error) {
      console.error('Matchmaking error:', error);
      toast.error('Matchmaking failed', {
        description: 'Please try again'
      });
      setIsSearching(false);
    }
  };

  const handleCustomGame = () => {
    toast.info('Opening custom game creator...', {
      description: 'Set specific rules and conditions'
    });
  };

  const selectedTimeControl = timeControls.find(tc => tc.id === gameConfig.timeControl);

  return (
    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Quick Pairing</h2>
          <p className="text-[#b8b8b8] text-sm">Find an opponent and start playing</p>
        </div>

        {/* Time Control Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Time Control</label>
          <div className="grid grid-cols-3 gap-2">
            {timeControls.slice(0, 9).map((control) => (
              <Button
                key={control.id}
                variant={gameConfig.timeControl === control.id ? "default" : "outline"}
                size="sm"
                className={`p-2 h-auto flex flex-col items-center space-y-1 ${
                  gameConfig.timeControl === control.id 
                    ? 'bg-[#759900] hover:bg-[#6a8700] text-white border-[#759900]' 
                    : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
                }`}
                onClick={() => setGameConfig(prev => ({ ...prev, timeControl: control.id }))}
              >
                <div className={`${control.color}`}>
                  {control.icon}
                </div>
                <div className="text-xs font-medium">{control.time}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Opponent Type */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Opponent</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={gameConfig.opponent === 'human' ? "default" : "outline"}
              className={`p-3 h-auto flex flex-col items-center space-y-2 ${
                gameConfig.opponent === 'human'
                  ? 'bg-[#759900] hover:bg-[#6a8700] text-white border-[#759900]'
                  : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
              }`}
              onClick={() => setGameConfig(prev => ({ ...prev, opponent: 'human' }))}
            >
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Human</span>
            </Button>
            <Button
              variant={gameConfig.opponent === 'computer' ? "default" : "outline"}
              className={`p-3 h-auto flex flex-col items-center space-y-2 ${
                gameConfig.opponent === 'computer'
                  ? 'bg-[#759900] hover:bg-[#6a8700] text-white border-[#759900]'
                  : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
              }`}
              onClick={() => setGameConfig(prev => ({ ...prev, opponent: 'computer' }))}
            >
              <Bot className="w-5 h-5" />
              <span className="text-sm font-medium">Computer</span>
            </Button>
          </div>
        </div>

        {/* Game Mode */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Game Mode</label>
          <Select value={gameConfig.gameMode} onValueChange={(value) => 
            setGameConfig(prev => ({ ...prev, gameMode: value }))
          }>
            <SelectTrigger className="bg-[#3d3d37] border-[#4a4a46] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#2c2c28] border-[#4a4a46]">
              <SelectItem value="casual" className="text-white hover:bg-[#4a4a46]">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Casual</span>
                </div>
              </SelectItem>
              <SelectItem value="rated" className="text-white hover:bg-[#4a4a46]">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Rated</span>
                </div>
              </SelectItem>
              <SelectItem value="tournament" className="text-white hover:bg-[#4a4a46]">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>Tournament</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Choice */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-white">Color</label>
          <div className="grid grid-cols-3 gap-2">
            {['white', 'random', 'black'].map((color) => (
              <Button
                key={color}
                variant={gameConfig.color === color ? "default" : "outline"}
                size="sm"
                className={`${
                  gameConfig.color === color
                    ? 'bg-[#759900] hover:bg-[#6a8700] text-white border-[#759900]'
                    : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
                }`}
                onClick={() => setGameConfig(prev => ({ ...prev, color }))}
              >
                {color === 'white' && '♔'}
                {color === 'random' && '⚡'}
                {color === 'black' && '♚'}
                <span className="ml-1 capitalize">{color}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Rating Range (for human opponents) */}
        {gameConfig.opponent === 'human' && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">Rating Range</label>
            <div className="px-2">
              <Slider
                value={gameConfig.ratingRange}
                onValueChange={(value) => setGameConfig(prev => ({ ...prev, ratingRange: value as [number, number] }))}
                min={400}
                max={2800}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#b8b8b8] mt-1">
                <span>{gameConfig.ratingRange[0]}</span>
                <span>{gameConfig.ratingRange[1]}</span>
              </div>
              <div className="text-center text-xs text-[#b8b8b8] mt-1">
                Range: {gameConfig.ratingRange[1] - gameConfig.ratingRange[0]} points
              </div>
            </div>
          </div>
        )}

        {/* Rated Game Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-white">Rated Game</span>
          </div>
          <Switch
            checked={gameConfig.rated}
            onCheckedChange={(checked) => setGameConfig(prev => ({ ...prev, rated: checked }))}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleQuickPlay}
            disabled={isSearching}
            className="w-full bg-[#759900] hover:bg-[#6a8700] text-white py-3"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </>
            )}
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleCustomGame}
              variant="outline"
              className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Custom
            </Button>
            <Button
              variant="outline"
              className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
              onClick={() => navigate('/tournaments')}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Tournaments
            </Button>
          </div>
        </div>

        {/* Current Selection Summary */}
        <div className="bg-[#3d3d37] rounded-lg p-3">
          <div className="text-xs text-[#b8b8b8] space-y-1">
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="text-white">{gameConfig.timeControl}</span>
            </div>
            <div className="flex justify-between">
              <span>Opponent:</span>
              <span className="text-white capitalize">{gameConfig.opponent}</span>
            </div>
            <div className="flex justify-between">
              <span>Mode:</span>
              <span className="text-white capitalize">{gameConfig.gameMode}</span>
            </div>
            {gameConfig.opponent === 'human' && (
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="text-white">{gameConfig.ratingRange[0]}-{gameConfig.ratingRange[1]}</span>
              </div>
            )}
            {gameConfig.rated && (
              <div className="flex justify-between">
                <span>Rating:</span>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500 text-xs">
                  Affects rating
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuickPairingPanel;
