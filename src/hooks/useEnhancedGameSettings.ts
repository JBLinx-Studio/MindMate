
import { useState, useEffect } from 'react';
import { enhancedSoundManager } from '../utils/enhancedSoundManager';

export interface EnhancedGameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  moveConfirmation: boolean;
  boardTheme: 'classic' | 'modern' | 'wood' | 'marble' | 'neon' | 'forest';
  pieceStyle: 'classic' | 'modern' | 'neon';
  showCoordinates: boolean;
  autoRotateBoard: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  showMoveHints: boolean;
  highlightLastMove: boolean;
  showLegalMoves: boolean;
  enableHapticFeedback: boolean;
  autoPromoteToQueen: boolean;
  confirmResignation: boolean;
  showMoveHistory: boolean;
  enableKeyboardShortcuts: boolean;
  boardSize: 'small' | 'medium' | 'large';
  language: 'en' | 'es' | 'fr' | 'de' | 'ru';
  // Added for feature completeness with UI:
  autoAnalysis: boolean;
  showMoveAnalysis: boolean;
}

const defaultSettings: EnhancedGameSettings = {
  soundEnabled: true,
  soundVolume: 0.7,
  moveConfirmation: false,
  boardTheme: 'classic',
  pieceStyle: 'classic',
  showCoordinates: true,
  autoRotateBoard: false, // Disabled by default to prevent flipping
  animationSpeed: 'normal',
  showMoveHints: true,
  highlightLastMove: true,
  showLegalMoves: true,
  enableHapticFeedback: false, // Disabled to prevent browser vibration issues
  autoPromoteToQueen: false,
  confirmResignation: true,
  showMoveHistory: true,
  enableKeyboardShortcuts: true,
  boardSize: 'medium',
  language: 'en',
  // Added
  autoAnalysis: true,
  showMoveAnalysis: true,
};

export const useEnhancedGameSettings = () => {
  const [settings, setSettings] = useState<EnhancedGameSettings>(() => {
    const saved = localStorage.getItem('enhanced-chess-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('enhanced-chess-settings', JSON.stringify(settings));
    enhancedSoundManager.setEnabled(settings.soundEnabled);
    enhancedSoundManager.setVolume(settings.soundVolume);
  }, [settings]);

  const updateSetting = <K extends keyof EnhancedGameSettings>(
    key: K,
    value: EnhancedGameSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const exportSettings = () => {
    return JSON.stringify(settings, null, 2);
  };

  const importSettings = (settingsJson: string) => {
    try {
      const importedSettings = JSON.parse(settingsJson);
      setSettings({ ...defaultSettings, ...importedSettings });
      return true;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  };

  return {
    settings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  };
};
