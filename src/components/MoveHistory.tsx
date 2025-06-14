
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Move } from '../types/chess';

interface MoveHistoryProps {
  moves: Move[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const formatMoveTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1]
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Move History</h3>
      
      <ScrollArea className="h-64">
        {groupedMoves.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No moves yet. Start playing!
          </div>
        ) : (
          <div className="space-y-2">
            {groupedMoves.map(({ moveNumber, white, black }) => (
              <div key={moveNumber} className="grid grid-cols-12 gap-2 text-sm py-1 hover:bg-gray-50 rounded px-2">
                <div className="col-span-2 font-medium text-gray-600">
                  {moveNumber}.
                </div>
                <div className="col-span-5 font-mono">
                  {white.notation}
                  <span className="text-xs text-gray-400 ml-1">
                    {formatMoveTime(white.timestamp)}
                  </span>
                </div>
                <div className="col-span-5 font-mono">
                  {black ? (
                    <>
                      {black.notation}
                      <span className="text-xs text-gray-400 ml-1">
                        {formatMoveTime(black.timestamp)}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-400">...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default MoveHistory;
