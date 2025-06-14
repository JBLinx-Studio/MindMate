
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, Zap, Circle } from 'lucide-react';

interface PieceStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (style: string) => void;
}

const pieceStyles = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional chess pieces',
    icon: <Crown className="w-5 h-5" />,
    preview: '♔♕♖♗♘♙',
    gradient: 'from-amber-400 to-amber-600'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek contemporary design',
    icon: <Circle className="w-5 h-5" />,
    preview: '♔♕♖♗♘♙',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Glowing cyberpunk style',
    icon: <Zap className="w-5 h-5" />,
    preview: '♔♕♖♗♘♙',
    gradient: 'from-purple-400 to-pink-600'
  }
];

const EnhancedPieceStyleSelector: React.FC<PieceStyleSelectorProps> = ({ 
  currentStyle, 
  onStyleChange 
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
          Piece Styles
        </h4>
        <p className="text-gray-600">Customize your chess piece appearance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pieceStyles.map((style) => (
          <Card
            key={style.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              currentStyle === style.id
                ? 'ring-2 ring-purple-500 shadow-lg scale-105'
                : 'hover:scale-102'
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <div className="text-center space-y-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-full mx-auto flex items-center justify-center text-white shadow-lg`}>
                {style.icon}
              </div>
              
              <div>
                <h5 className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                  {style.name}
                  {currentStyle === style.id && <Badge variant="secondary" className="text-xs">Active</Badge>}
                </h5>
                <p className="text-sm text-gray-600 mb-2">{style.description}</p>
              </div>
              
              <div className="text-2xl font-bold text-gray-700 bg-gray-50 rounded-lg py-2">
                {style.preview}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedPieceStyleSelector;
