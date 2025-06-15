
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { 
  Users, 
  Crown, 
  Clock, 
  Zap, 
  Globe, 
  Trophy, 
  Star,
  Play,
  Settings,
  Search
} from 'lucide-react';

interface GameLobbyProps {
  onStartGame?: (gameConfig: any) => void;
}

const EnhancedGameLobby: React.FC<GameLobbyProps> = ({ onStartGame }) => {
  const [selectedTimeControl, setSelectedTimeControl] = useState('10+0');
  const [selectedRating, setSelectedRating] = useState('any');

  const timeControls = [
    { id: '1+0', name: 'Bullet', time: '1 min', icon: <Zap className="w-4 h-4" />, color: 'bg-red-500' },
    { id: '3+0', name: 'Blitz', time: '3 min', icon: <Clock className="w-4 h-4" />, color: 'bg-orange-500' },
    { id: '5+0', name: 'Blitz', time: '5 min', icon: <Clock className="w-4 h-4" />, color: 'bg-yellow-500' },
    { id: '10+0', name: 'Rapid', time: '10 min', icon: <Crown className="w-4 h-4" />, color: 'bg-green-500' },
    { id: '30+0', name: 'Classical', time: '30 min', icon: <Trophy className="w-4 h-4" />, color: 'bg-blue-500' }
  ];

  const onlineGames = [
    { id: 1, player: 'ChessMaster2024', rating: 1850, timeControl: '10+0', increment: 0 },
    { id: 2, player: 'GrandmasterAI', rating: 2100, timeControl: '5+0', increment: 3 },
    { id: 3, player: 'BlitzKing', rating: 1650, timeControl: '3+0', increment: 0 },
    { id: 4, player: 'TacticalGenius', rating: 1920, timeControl: '15+10', increment: 10 }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Play Section */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Play</h2>
          <p className="text-gray-600">Find an opponent and start playing instantly</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Control</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {timeControls.map((control) => (
                <Button
                  key={control.id}
                  variant={selectedTimeControl === control.id ? "default" : "outline"}
                  className={`p-3 h-auto flex flex-col items-center space-y-1 ${
                    selectedTimeControl === control.id ? `${control.color} text-white` : ''
                  }`}
                  onClick={() => setSelectedTimeControl(control.id)}
                >
                  <div className={`p-2 rounded-full ${
                    selectedTimeControl === control.id ? 'bg-white/20' : control.color + ' text-white'
                  }`}>
                    {control.icon}
                  </div>
                  <div className="text-xs font-medium">{control.name}</div>
                  <div className="text-xs opacity-80">{control.time}</div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
              onClick={() => onStartGame?.({ timeControl: selectedTimeControl, type: 'random' })}
            >
              <Play className="w-5 h-5 mr-2" />
              Play vs Random Opponent
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 py-3"
              onClick={() => onStartGame?.({ timeControl: selectedTimeControl, type: 'computer' })}
            >
              <Settings className="w-5 h-5 mr-2" />
              Play vs Computer
            </Button>
          </div>
        </div>
      </Card>

      {/* Live Games */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Live Games
          </h3>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{onlineGames.length} waiting</span>
          </Badge>
        </div>

        <div className="space-y-3">
          {onlineGames.map((game) => (
            <div
              key={game.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500">
                  <div className="text-white font-bold text-sm">
                    {game.player.charAt(0)}
                  </div>
                </Avatar>
                <div>
                  <div className="font-medium text-gray-800">{game.player}</div>
                  <div className="text-sm text-gray-600 flex items-center space-x-2">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{game.rating}</span>
                    <span>•</span>
                    <span>{game.timeControl}</span>
                    {game.increment > 0 && <span>+{game.increment}</span>}
                  </div>
                </div>
              </div>
              
              <Button 
                size="sm"
                onClick={() => onStartGame?.({ opponent: game, type: 'challenge' })}
              >
                Challenge
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <Button variant="outline" className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Browse More Games</span>
          </Button>
        </div>
      </Card>

      {/* Daily Tournaments */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Daily Tournaments
          </h3>
          <Badge className="bg-yellow-500 text-white">Live</Badge>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">Blitz Arena</h4>
              <Badge variant="outline">5+0</Badge>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              147 players • Starts in 12 minutes
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Prize: Premium membership
              </div>
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                Join Tournament
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedGameLobby;
