
import { useState, useEffect } from 'react';

export interface GameSettings {
  soundEnabled: boolean;
  moveConfirmation: boolean;
  boardTheme: 'classic' | 'wood' | 'marble';
  pieceStyle: 'classic' | 'modern' | 'neon';
  showCoordinates: boolean;
  autoRotateBoard: boolean;
}

const defaultSettings: GameSettings = {
  soundEnabled: true,
  moveConfirmation: false,
  boardTheme: 'classic',
  pieceStyle: 'classic',
  showCoordinates: true,
  autoRotateBoard: false,
};

export const useGameSettings = () => {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('chess-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('chess-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateSetting,
    resetSettings,
  };
};
