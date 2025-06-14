
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  {
    id: 'classic',
    name: 'Classic',
    preview: 'bg-gradient-to-br from-amber-100 to-amber-200',
    description: 'Traditional brown and beige'
  },
  {
    id: 'wood',
    name: 'Wood',
    preview: 'bg-gradient-to-br from-yellow-700 to-yellow-900',
    description: 'Natural wood grain'
  },
  {
    id: 'marble',
    name: 'Marble',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-300',
    description: 'Elegant marble finish'
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-800">Choose Board Theme</h4>
      <div className="grid grid-cols-1 gap-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
              currentTheme === theme.id
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onThemeChange(theme.id)}
          >
            <div className={`w-12 h-12 rounded ${theme.preview} mr-3 border`} />
            <div className="flex-1">
              <div className="font-medium">{theme.name}</div>
              <div className="text-sm text-gray-600">{theme.description}</div>
            </div>
            {currentTheme === theme.id && (
              <Check className="w-5 h-5 text-amber-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
