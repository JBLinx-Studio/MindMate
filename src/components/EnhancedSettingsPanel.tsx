
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useEnhancedGameSettings } from '../hooks/useEnhancedGameSettings';
import { toast } from 'sonner';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Eye, 
  Clock, 
  Palette, 
  Gamepad2, 
  Brain,
  Target,
  Download,
  Upload,
  RotateCcw,
  Zap
} from 'lucide-react';

interface EnhancedSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnhancedSettingsPanel: React.FC<EnhancedSettingsPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useEnhancedGameSettings();
  const [importData, setImportData] = useState('');

  const handleImport = () => {
    if (importData.trim()) {
      const success = importSettings(importData);
      if (success) {
        toast.success('Settings imported successfully!');
        setImportData('');
      } else {
        toast.error('Failed to import settings. Invalid format.');
      }
    }
  };

  const handleExport = () => {
    const data = exportSettings();
    navigator.clipboard.writeText(data);
    toast.success('Settings copied to clipboard!');
  };

  const handleReset = () => {
    resetSettings();
    toast.success('Settings reset to defaults');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Enhanced Chess Settings</h2>
          </div>
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Audio Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Audio Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sound Effects</label>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Volume</label>
                <Slider
                  value={[settings.soundVolume * 100]}
                  onValueChange={(value) => updateSetting('soundVolume', value[0] / 100)}
                  max={100}
                  step={5}
                  disabled={!settings.soundEnabled}
                />
                <div className="text-xs text-gray-500 mt-1">{Math.round(settings.soundVolume * 100)}%</div>
              </div>
            </div>
          </Card>

          {/* Visual Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Visual Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Board Theme</label>
                <Select
                  value={settings.boardTheme}
                  onValueChange={(value: any) => updateSetting('boardTheme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="wood">Wood</SelectItem>
                    <SelectItem value="marble">Marble</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Piece Style</label>
                <Select
                  value={settings.pieceStyle}
                  onValueChange={(value: any) => updateSetting('pieceStyle', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="neon">Neon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Board Size</label>
                <Select
                  value={settings.boardSize}
                  onValueChange={(value: any) => updateSetting('boardSize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Gameplay Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Gameplay Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Coordinates</label>
                <Switch
                  checked={settings.showCoordinates}
                  onCheckedChange={(checked) => updateSetting('showCoordinates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Legal Moves</label>
                <Switch
                  checked={settings.showLegalMoves}
                  onCheckedChange={(checked) => updateSetting('showLegalMoves', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Highlight Last Move</label>
                <Switch
                  checked={settings.highlightLastMove}
                  onCheckedChange={(checked) => updateSetting('highlightLastMove', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Move Confirmation</label>
                <Switch
                  checked={settings.moveConfirmation}
                  onCheckedChange={(checked) => updateSetting('moveConfirmation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-Rotate Board</label>
                <Switch
                  checked={settings.autoRotateBoard}
                  onCheckedChange={(checked) => updateSetting('autoRotateBoard', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Analysis Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Analysis Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Analysis</label>
                <Switch
                  checked={settings.autoAnalysis}
                  onCheckedChange={(checked) => updateSetting('autoAnalysis', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Move Analysis</label>
                <Switch
                  checked={settings.showMoveAnalysis}
                  onCheckedChange={(checked) => updateSetting('showMoveAnalysis', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Show Move Hints</label>
                <Switch
                  checked={settings.showMoveHints}
                  onCheckedChange={(checked) => updateSetting('showMoveHints', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Animation Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Animation Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Animation Speed</label>
                <Select
                  value={settings.animationSpeed}
                  onValueChange={(value: any) => updateSetting('animationSpeed', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slow">Slow</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Haptic Feedback</label>
                <Switch
                  checked={settings.enableHapticFeedback}
                  onCheckedChange={(checked) => updateSetting('enableHapticFeedback', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Advanced Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Advanced Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-Promote to Queen</label>
                <Switch
                  checked={settings.autoPromoteToQueen}
                  onCheckedChange={(checked) => updateSetting('autoPromoteToQueen', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Confirm Resignation</label>
                <Switch
                  checked={settings.confirmResignation}
                  onCheckedChange={(checked) => updateSetting('confirmResignation', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Keyboard Shortcuts</label>
                <Switch
                  checked={settings.enableKeyboardShortcuts}
                  onCheckedChange={(checked) => updateSetting('enableKeyboardShortcuts', checked)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Language</label>
                <Select
                  value={settings.language}
                  onValueChange={(value: any) => updateSetting('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ru">Русский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* Import/Export Settings */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Settings Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Button onClick={handleExport} className="w-full mb-2">
                <Download className="w-4 h-4 mr-2" />
                Export Settings
              </Button>
              <p className="text-xs text-gray-500">Copy settings to clipboard</p>
            </div>
            
            <div>
              <div className="flex space-x-2">
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste settings JSON here..."
                  className="flex-1 text-xs p-2 border rounded"
                  rows={3}
                />
                <Button onClick={handleImport} size="sm">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Import settings from JSON</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-center">
            <Button onClick={handleReset} variant="destructive">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </Card>

        {/* Current Settings Summary */}
        <Card className="p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Badge variant="outline">Theme: {settings.boardTheme}</Badge>
            <Badge variant="outline">Pieces: {settings.pieceStyle}</Badge>
            <Badge variant="outline">Size: {settings.boardSize}</Badge>
            <Badge variant="outline">Language: {settings.language}</Badge>
            <Badge variant={settings.soundEnabled ? "default" : "secondary"}>
              {settings.soundEnabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
              Sound {settings.soundEnabled ? 'On' : 'Off'}
            </Badge>
            <Badge variant={settings.autoAnalysis ? "default" : "secondary"}>
              Analysis {settings.autoAnalysis ? 'On' : 'Off'}
            </Badge>
            <Badge variant={settings.showLegalMoves ? "default" : "secondary"}>
              Hints {settings.showLegalMoves ? 'On' : 'Off'}
            </Badge>
            <Badge variant="outline">Speed: {settings.animationSpeed}</Badge>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default EnhancedSettingsPanel;
