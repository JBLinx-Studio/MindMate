
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, Clock, Users } from 'lucide-react';
import { ChessBoard } from './LiveChessBoard';

interface LiveGameCardProps {
  game: {
    id: number;
    white: { name: string; rating: number; title: string };
    black: { name: string; rating: number; title: string };
    timeControl: string;
    category: string;
    viewers: number;
    moves: number;
    isTopGame: boolean;
    position: string; // FEN string
    timeLeft: { white: number; black: number }; // in seconds
    currentPlayer: 'white' | 'black';
  };
  onWatch: (gameId: number) => void;
}

const LiveGameCard: React.FC<LiveGameCardProps> = ({ game, onWatch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bullet': return 'text-red-400 border-red-400';
      case 'blitz': return 'text-yellow-400 border-yellow-400';
      case 'rapid': return 'text-green-400 border-green-400';
      default: return 'text-[#b8b8b8] border-[#4a4a46]';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`bg-[#3d3d37] border-[#4a4a46] hover:bg-[#4a4a46] transition-all duration-200 ${game.isTopGame ? 'ring-1 ring-[#759900]' : ''}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* White Player */}
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="w-8 h-8 bg-[#f0d9b5] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#8b7355] text-xs font-bold">{game.white.title}</span>
              </div>
              <div className="min-w-0">
                <div className="text-white font-medium truncate">{game.white.name}</div>
                <div className="text-[#b8b8b8] text-sm">({game.white.rating})</div>
                <div className="text-[#759900] text-xs font-mono">
                  {formatTime(game.timeLeft.white)}
                </div>
              </div>
            </div>

            {/* VS indicator with current turn */}
            <div className="text-center px-2">
              <div className="text-[#b8b8b8] text-sm">vs</div>
              <div className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                game.currentPlayer === 'white' ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'
              } animate-pulse`} />
            </div>

            {/* Black Player */}
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <div className="min-w-0">
                <div className="text-white font-medium truncate">{game.black.name}</div>
                <div className="text-[#b8b8b8] text-sm">({game.black.rating})</div>
                <div className="text-[#759900] text-xs font-mono">
                  {formatTime(game.timeLeft.black)}
                </div>
              </div>
              <div className="w-8 h-8 bg-[#b58863] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{game.black.title}</span>
              </div>
            </div>
          </div>

          {/* Game Info and Actions */}
          <div className="flex items-center space-x-4 ml-4">
            <div className="text-center">
              <div className="flex items-center space-x-1 text-sm">
                <Clock className="w-4 h-4 text-[#b8b8b8]" />
                <span className="text-[#b8b8b8]">{game.timeControl}</span>
              </div>
              <Badge variant="outline" className={`text-xs mt-1 ${getCategoryColor(game.category)}`}>
                {game.category}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-white text-sm font-medium">{game.moves} moves</div>
              <div className="flex items-center space-x-1 text-sm">
                <Eye className="w-4 h-4 text-[#b8b8b8]" />
                <span className="text-[#b8b8b8]">{game.viewers.toLocaleString()}</span>
              </div>
            </div>

            {game.isTopGame && (
              <Star className="w-4 h-4 text-[#759900]" />
            )}
            
            <div className="flex flex-col space-y-1">
              <Button 
                size="sm" 
                className="bg-[#759900] hover:bg-[#6a8700]"
                onClick={() => onWatch(game.id)}
              >
                Watch
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Hide' : 'Preview'}
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable mini board preview */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#4a4a46]">
            <div className="flex justify-center">
              <div className="w-48 h-48">
                <ChessBoard 
                  fen={game.position} 
                  size="small"
                  interactive={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LiveGameCard;
