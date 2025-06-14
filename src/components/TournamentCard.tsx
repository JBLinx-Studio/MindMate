
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Calendar } from 'lucide-react';

interface TournamentCardProps {
  title: string;
  type: string;
  timeControl: string;
  players: number;
  maxPlayers: number;
  startTime: string;
  prizePool?: string;
  status: 'upcoming' | 'live' | 'finished';
  onJoin?: () => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  title,
  type,
  timeControl,
  players,
  maxPlayers,
  startTime,
  prizePool,
  status,
  onJoin
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'live': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'finished': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'live': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      case 'finished': return 'Finished';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{type}</p>
        </div>
        <Badge className={`${getStatusColor()} text-white`}>
          {getStatusText()}
        </Badge>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2" />
          {timeControl}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2" />
          {players}/{maxPlayers} players
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {startTime}
        </div>
        
        {prizePool && (
          <div className="flex items-center text-sm text-gray-600">
            <Trophy className="w-4 h-4 mr-2" />
            Prize Pool: {prizePool}
          </div>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${(players / maxPlayers) * 100}%` }}
        />
      </div>
      
      {status === 'upcoming' && onJoin && (
        <Button onClick={onJoin} className="w-full">
          Join Tournament
        </Button>
      )}
      
      {status === 'live' && (
        <Button variant="outline" className="w-full">
          Watch Live
        </Button>
      )}
      
      {status === 'finished' && (
        <Button variant="ghost" className="w-full">
          View Results
        </Button>
      )}
    </Card>
  );
};

export default TournamentCard;
