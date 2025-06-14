
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Palette } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  {
    id: 'classic',
    name: 'Classic Wood',
    preview: 'bg-gradient-to-br from-amber-100 to-amber-200',
    darkSquare: 'bg-amber-800',
    lightSquare: 'bg-amber-100',
    description: 'Traditional tournament style'
  },
  {
    id: 'modern',
    name: 'Modern Blue',
    preview: 'bg-gradient-to-br from-blue-100 to-blue-200',
    darkSquare: 'bg-blue-800',
    lightSquare: 'bg-blue-100',
    description: 'Clean contemporary look'
  },
  {
    id: 'wood',
    name: 'Premium Wood',
    preview: 'bg-gradient-to-br from-yellow-700 to-yellow-900',
    darkSquare: 'bg-yellow-900',
    lightSquare: 'bg-yellow-200',
    description: 'Rich wood grain finish'
  },
  {
    id: 'marble',
    name: 'Marble Luxury',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-300',
    darkSquare: 'bg-gray-700',
    lightSquare: 'bg-gray-100',
    description: 'Elegant marble texture'
  },
  {
    id: 'neon',
    name: 'Neon Gaming',
    preview: 'bg-gradient-to-br from-purple-600 to-pink-600',
    darkSquare: 'bg-purple-800',
    lightSquare: 'bg-purple-200',
    description: 'Vibrant gaming theme'
  },
  {
    id: 'forest',
    name: 'Forest Green',
    preview: 'bg-gradient-to-br from-green-200 to-green-400',
    darkSquare: 'bg-green-800',
    lightSquare: 'bg-green-100',
    description: 'Natural forest colors'
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Palette className="w-6 h-6 mr-2 text-purple-600" />
          Board Themes
        </h4>
        <p className="text-gray-600">Choose your preferred board appearance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              currentTheme === theme.id
                ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                : 'hover:scale-102'
            }`}
            onClick={() => onThemeChange(theme.id)}
          >
            {/* Theme Preview */}
            <div className="relative mb-3">
              <div className={`w-full h-24 rounded-lg ${theme.preview} border-2 border-gray-200 overflow-hidden`}>
                {/* Mini chessboard preview */}
                <div className="grid grid-cols-4 h-full">
                  {Array.from({ length: 16 }).map((_, index) => {
                    const isLight = (Math.floor(index / 4) + (index % 4)) % 2 === 0;
                    return (
                      <div
                        key={index}
                        className={`${isLight ? theme.lightSquare : theme.darkSquare} opacity-80`}
                      />
                    );
                  })}
                </div>
              </div>
              
              {currentTheme === theme.id && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
            
            {/* Theme Info */}
            <div className="text-center">
              <h5 className="font-semibold text-gray-800 mb-1">{theme.name}</h5>
              <p className="text-sm text-gray-600">{theme.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Theme Option */}
      <Card className="p-6 border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h5 className="font-semibold text-gray-800 mb-2">Custom Theme</h5>
          <p className="text-sm text-gray-600 mb-3">Create your own board theme</p>
          <Button variant="outline" size="sm">
            Coming Soon
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ThemeSelector;
