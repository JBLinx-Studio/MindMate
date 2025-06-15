
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
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
  Loader2,
  Search
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
  const [searchProgress, setSearchProgress] = useState(0);
  const [searchTime, setSearchTime] = useState(0);
  const [gameConfig, setGameConfig] = useState({
    timeControl: '10+0',
    gameMode: 'casual',
    opponent: 'human',
    ratingRange: [1000, 1400] as [number, number],
    color: 'random',
    increment: 0,
    rated: false
  });

  // Simulate matchmaking progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isSearching) {
      interval = setInterval(() => {
        setSearchTime(prev => {
          const newTime = prev + 1;
          setSearchProgress((newTime / 10) * 100);
          return newTime;
        });
      }, 1000);

      // Auto-navigate after 10 seconds
      timeout = setTimeout(() => {
        handleGameFound();
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [isSearching]);

  const handleGameFound = () => {
    const opponentName = gameConfig.opponent === 'computer' ? 'Computer' : 'ChessMaster2024';
    const opponentRating = gameConfig.opponent === 'computer' ? 1500 : 1200 + Math.floor(Math.random() * 600);
    
    toast.success('Match found!', {
      description: `Playing against ${opponentName} (${opponentRating})`,
      duration: 3000,
    });

    const params = new URLSearchParams({
      mode: gameConfig.gameMode,
      time: gameConfig.timeControl,
      opponent: opponentName,
      opponentRating: opponentRating.toString(),
      gameId: `match_${Date.now()}`,
      color: gameConfig.color === 'random' ? (Math.random() > 0.5 ? 'white' : 'black') : gameConfig.color,
      rated: gameConfig.rated.toString()
    });

    setIsSearching(false);
    setSearchProgress(0);
    setSearchTime(0);
    
    navigate(`/game?${params.toString()}`);
  };

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

    // Start searching for human opponent
    setIsSearching(true);
    setSearchProgress(0);
    setSearchTime(0);
    
    toast.info('Searching for opponent...', {
      description: 'Looking for a player in your rating range',
      duration: 3000,
    });
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchProgress(0);
    setSearchTime(0);
    toast.info('Search cancelled');
  };

  const handleCustomGame = () => {
    toast.info('Opening custom game creator...', {
      description: 'Set specific rules and conditions'
    });
  };

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

  const selectedTimeControl = timeControls.find(tc => tc.id === gameConfig.timeControl);

  // Show searching state
  if (isSearching) {
    return (
      <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Searching for Opponent</h2>
            <p className="text-[#b8b8b8] text-sm">Finding a player in your rating range...</p>
          </div>

          {/* Search Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Search className="w-16 h-16 text-[#759900] animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#b8b8b8]">Search Progress</span>
              <span className="text-white">{searchTime}s / 10s</span>
            </div>
            <Progress 
              value={searchProgress} 
              className="h-2 bg-[#3d3d37]"
            />
          </div>

          {/* Search Details */}
          <div className="bg-[#3d3d37] rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#b8b8b8]">Time Control:</span>
                <span className="text-white">{gameConfig.timeControl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#b8b8b8]">Game Mode:</span>
                <span className="text-white capitalize">{gameConfig.gameMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#b8b8b8]">Rating Range:</span>
                <span className="text-white">{gameConfig.ratingRange[0]}-{gameConfig.ratingRange[1]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#b8b8b8]">Preferred Color:</span>
                <span className="text-white capitalize">{gameConfig.color}</span>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          <Button
            onClick={handleCancelSearch}
            variant="outline"
            className="w-full border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
          >
            Cancel Search
          </Button>
        </div>
      </Card>
    );
  }

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
            className="w-full bg-[#759900] hover:bg-[#6a8700] text-white py-3"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Game
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
