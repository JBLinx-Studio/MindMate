
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Timer, 
  Zap,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface GameClockProps {
  initialTime?: number; // in seconds
  increment?: number; // increment per move in seconds
  isActive?: boolean;
  currentPlayer?: 'white' | 'black';
  onTimeUp?: (player: 'white' | 'black') => void;
}

const EnhancedGameClock: React.FC<GameClockProps> = ({
  initialTime = 600, // 10 minutes default
  increment = 0,
  isActive = false,
  currentPlayer = 'white',
  onTimeUp
}) => {
  const [whiteTime, setWhiteTime] = useState(initialTime);
  const [blackTime, setBlackTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!isRunning || !gameStarted) return;

    const interval = setInterval(() => {
      if (currentPlayer === 'white') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            onTimeUp?.('white');
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            onTimeUp?.('black');
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentPlayer, gameStarted, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (time: number): string => {
    if (time <= 30) return 'text-red-600 animate-pulse';
    if (time <= 60) return 'text-orange-600';
    if (time <= 120) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getTimeBackground = (time: number, isCurrentPlayer: boolean): string => {
    const base = isCurrentPlayer && isRunning ? 'ring-2 ring-blue-400 shadow-lg' : '';
    if (time <= 30) return `bg-red-50 border-red-200 ${base}`;
    if (time <= 60) return `bg-orange-50 border-orange-200 ${base}`;
    return `bg-white border-gray-200 ${base}`;
  };

  const startGame = () => {
    setGameStarted(true);
    setIsRunning(true);
  };

  const pauseGame = () => {
    setIsRunning(!isRunning);
  };

  const resetGame = () => {
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    setIsRunning(false);
    setGameStarted(false);
  };

  const getTimeControlDescription = (): string => {
    const minutes = Math.floor(initialTime / 60);
    if (increment > 0) {
      return `${minutes}+${increment}`;
    }
    return `${minutes} min`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Game Clock</h3>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Timer className="w-3 h-3" />
            <span>{getTimeControlDescription()}</span>
          </Badge>
        </div>

        {/* Time Displays */}
        <div className="space-y-4">
          {/* Black Player */}
          <div className={`p-4 rounded-xl transition-all duration-300 ${getTimeBackground(blackTime, currentPlayer === 'black')}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                <span className="font-medium text-gray-700">Black</span>
                {currentPlayer === 'black' && isRunning && (
                  <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                )}
              </div>
              <div className={`text-3xl font-mono font-bold ${getTimeColor(blackTime)}`}>
                {formatTime(blackTime)}
              </div>
            </div>
            {blackTime <= 60 && blackTime > 0 && (
              <div className="flex items-center mt-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Low time!
              </div>
            )}
          </div>

          {/* White Player */}
          <div className={`p-4 rounded-xl transition-all duration-300 ${getTimeBackground(whiteTime, currentPlayer === 'white')}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-400 rounded-full"></div>
                <span className="font-medium text-gray-700">White</span>
                {currentPlayer === 'white' && isRunning && (
                  <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
                )}
              </div>
              <div className={`text-3xl font-mono font-bold ${getTimeColor(whiteTime)}`}>
                {formatTime(whiteTime)}
              </div>
            </div>
            {whiteTime <= 60 && whiteTime > 0 && (
              <div className="flex items-center mt-2 text-sm text-red-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Low time!
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3">
          {!gameStarted ? (
            <Button onClick={startGame} className="flex-1 bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Start Game
            </Button>
          ) : (
            <>
              <Button 
                onClick={pauseGame} 
                variant="outline" 
                className="flex-1"
              >
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button onClick={resetGame} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Game Status */}
        <div className="text-center">
          {!gameStarted ? (
            <p className="text-sm text-gray-600">Click start to begin the game</p>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                {isRunning ? `${currentPlayer === 'white' ? 'White' : 'Black'} to move` : 'Game paused'}
              </p>
              {increment > 0 && (
                <p className="text-xs text-gray-500">
                  +{increment}s increment per move
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EnhancedGameClock;
