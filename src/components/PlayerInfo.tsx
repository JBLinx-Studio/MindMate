
import React from 'react';
import { User, Clock, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PlayerInfoProps {
  color: 'white' | 'black';
  isCurrentPlayer: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ color, isCurrentPlayer }) => {
  const playerName = color === 'white' ? 'Player 1' : 'Player 2';
  const rating = color === 'white' ? '1200' : '1150';
  
  return (
    <div className={`
      bg-white rounded-lg shadow-lg p-4 border-l-4 transition-all duration-200
      ${isCurrentPlayer ? 'border-green-500 bg-green-50' : 'border-gray-300'}
    `}>
      <div className="flex items-center space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback className={`${color === 'white' ? 'bg-gray-100' : 'bg-gray-800 text-white'}`}>
            <User className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-800">{playerName}</h4>
            {isCurrentPlayer && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>{rating}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>10:00</span>
            </div>
          </div>
        </div>
        
        <div className={`
          w-6 h-6 rounded-full border-2 border-gray-300
          ${color === 'white' ? 'bg-white' : 'bg-gray-800'}
        `} />
      </div>
    </div>
  );
};

export default PlayerInfo;
