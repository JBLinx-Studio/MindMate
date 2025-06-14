
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Users, Crown, Trophy, Star, Target, Clock } from 'lucide-react';
import { GameState } from '../types/chess';

interface PlayersPanelProps {
  gameState: GameState;
}

const PlayersPanel: React.FC<PlayersPanelProps> = ({ gameState }) => {
  const whitePlayer = {
    name: "Magnus Carlsen",
    rating: 2830,
    title: "GM",
    country: "Norway",
    avatar: "/placeholder.svg",
    wins: 1247,
    losses: 234,
    draws: 456,
    timeLeft: "15:30",
    accuracy: 94,
    blunders: 0,
    isOnline: true
  };

  const blackPlayer = {
    name: "Fabiano Caruana",
    rating: 2820,
    title: "GM", 
    country: "USA",
    avatar: "/placeholder.svg",
    wins: 1189,
    losses: 267,
    draws: 423,
    timeLeft: "14:45",
    accuracy: 91,
    blunders: 1,
    isOnline: true
  };

  const PlayerCard = ({ player, color, isCurrentTurn }: { player: any, color: string, isCurrentTurn: boolean }) => (
    <Card className={`p-6 transition-all duration-300 ${isCurrentTurn ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className="relative">
          <Avatar className="w-16 h-16">
            <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          </Avatar>
          {player.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold text-gray-800">{player.name}</h3>
            <Badge variant="secondary" className="text-xs font-semibold">
              {player.title}
            </Badge>
            {isCurrentTurn && (
              <Badge className="bg-blue-500 text-white text-xs animate-pulse">
                Turn
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold text-gray-700">{player.rating}</span>
            </div>
            <div className="text-sm text-gray-600">{player.country}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${color === 'white' ? 'text-blue-600' : 'text-red-600'}`}>
                {player.timeLeft}
              </div>
              <div className="text-xs text-gray-500">Time Left</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{player.accuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold text-green-700">{player.wins}</div>
              <div className="text-xs text-gray-600">Wins</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-700">{player.draws}</div>
              <div className="text-xs text-gray-600">Draws</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-semibold text-red-700">{player.losses}</div>
              <div className="text-xs text-gray-600">Losses</div>
            </div>
          </div>

          {player.blunders > 0 && (
            <div className="mt-3 p-2 bg-red-50 rounded-lg">
              <div className="text-sm text-red-700 font-medium">
                {player.blunders} Blunder{player.blunders > 1 ? 's' : ''} this game
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Match Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">World Championship Match</h2>
          </div>
          <div className="text-sm text-gray-600">Classical Time Control • 90+30</div>
          <div className="flex items-center justify-center space-x-4 mt-3">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Live</span>
            </Badge>
            <Badge variant="outline">Game 5</Badge>
          </div>
        </div>
      </Card>

      {/* Player Cards */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Players</h3>
        </div>
        
        <PlayerCard 
          player={whitePlayer} 
          color="white"
          isCurrentTurn={gameState.currentPlayer === 'white'}
        />
        
        <div className="text-center py-2">
          <div className="text-2xl font-bold text-gray-400">VS</div>
        </div>
        
        <PlayerCard 
          player={blackPlayer} 
          color="black"
          isCurrentTurn={gameState.currentPlayer === 'black'}
        />
      </div>

      {/* Match Statistics */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Match Statistics
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="text-center mb-3">
              <div className="text-lg font-bold text-gray-800">Head to Head</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Magnus Wins:</span>
                <span className="font-semibold">43</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Draws:</span>
                <span className="font-semibold">78</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fabiano Wins:</span>
                <span className="font-semibold">21</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-center mb-3">
              <div className="text-lg font-bold text-gray-800">This Match</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Game 1:</span>
                <span className="font-semibold">Draw</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Game 2:</span>
                <span className="font-semibold">Magnus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Game 3:</span>
                <span className="font-semibold">Draw</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Game 4:</span>
                <span className="font-semibold">Fabiano</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlayersPanel;
