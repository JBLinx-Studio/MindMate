import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings as SettingsIcon, Bell, Palette, Volume2, Save, RotateCcw, Zap, Gamepad2, Monitor, Globe } from 'lucide-react';
import { useEnhancedGameSettings } from '../hooks/useEnhancedGameSettings';
import ThemeSelector from '../components/ThemeSelector';
import EnhancedPieceStyleSelector from '../components/EnhancedPieceStyleSelector';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useEnhancedGameSettings();

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      description: 'Your preferences have been updated and will persist across sessions.',
      duration: 3000,
    });
  };

  const handleReset = () => {
    resetSettings();
    toast.info('Settings reset to default values', {
      description: 'All preferences have been restored to their original state.',
      duration: 3000,
    });
  };

  const handleExport = () => {
    const settingsData = exportSettings();
    navigator.clipboard.writeText(settingsData);
    toast.success('Settings exported to clipboard!', {
      description: 'You can now paste and save your settings configuration.',
      duration: 3000,
    });
  };

  const handleImport = () => {
    navigator.clipboard.readText().then(text => {
      if (importSettings(text)) {
        toast.success('Settings imported successfully!', {
          description: 'Your configuration has been restored.',
          duration: 3000,
        });
      } else {
        toast.error('Failed to import settings', {
          description: 'Please check the clipboard content and try again.',
          duration: 3000,
        });
      }
    }).catch(() => {
      toast.error('Could not access clipboard', {
        description: 'Please paste the settings manually.',
        duration: 3000,
      });
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 to-orange-100">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="text-2xl font-bold text-amber-800">Enhanced Settings</h1>
              <Badge variant="outline" className="text-xs">Pro</Badge>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Game Preferences */}
              <Card className="p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <Gamepad2 className="w-6 h-6 mr-2 text-amber-800" />
                  <h2 className="text-xl font-semibold">Game Preferences</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Sound Effects</div>
                        <div className="text-sm text-gray-600">Play sounds for moves and captures</div>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sound Volume</span>
                      <span className="text-sm text-gray-600">{Math.round(settings.soundVolume * 100)}%</span>
                    </div>
                    <Slider
                      value={[settings.soundVolume * 100]}
                      onValueChange={([value]) => updateSetting('soundVolume', value / 100)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Move Confirmation</div>
                        <div className="text-sm text-gray-600">Confirm moves before playing</div>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.moveConfirmation}
                      onCheckedChange={(checked) => updateSetting('moveConfirmation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Haptic Feedback</div>
                        <div className="text-sm text-gray-600">Vibrate on mobile devices</div>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.enableHapticFeedback}
                      onCheckedChange={(checked) => updateSetting('enableHapticFeedback', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Animation Speed</label>
                    <select
                      value={settings.animationSpeed}
                      onChange={(e) => updateSetting('animationSpeed', e.target.value as any)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="slow">Slow (500ms)</option>
                      <option value="normal">Normal (300ms)</option>
                      <option value="fast">Fast (150ms)</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Display Settings */}
              <Card className="p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <Monitor className="w-6 h-6 mr-2 text-amber-800" />
                  <h2 className="text-xl font-semibold">Display Settings</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Palette className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium">Show Coordinates</div>
                        <div className="text-sm text-gray-600">Display board coordinates (a-h, 1-8)</div>
                      </div>
                    </div>
                    <Switch 
                      checked={settings.showCoordinates}
                      onCheckedChange={(checked) => updateSetting('showCoordinates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-Rotate Board</div>
                      <div className="text-sm text-gray-600">Rotate board for current player</div>
                    </div>
                    <Switch 
                      checked={settings.autoRotateBoard}
                      onCheckedChange={(checked) => updateSetting('autoRotateBoard', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Highlight Last Move</div>
                      <div className="text-sm text-gray-600">Show previous move on board</div>
                    </div>
                    <Switch 
                      checked={settings.highlightLastMove}
                      onCheckedChange={(checked) => updateSetting('highlightLastMove', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show Legal Moves</div>
                      <div className="text-sm text-gray-600">Highlight valid moves</div>
                    </div>
                    <Switch 
                      checked={settings.showLegalMoves}
                      onCheckedChange={(checked) => updateSetting('showLegalMoves', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-medium">Board Size</label>
                    <select
                      value={settings.boardSize}
                      onChange={(e) => updateSetting('boardSize', e.target.value as any)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Enhanced Piece Styles */}
              <Card className="lg:col-span-2 p-6 shadow-lg">
                <EnhancedPieceStyleSelector
                  currentStyle={settings.pieceStyle}
                  onStyleChange={(style) => updateSetting('pieceStyle', style as any)}
                />
              </Card>

              {/* Board Theme */}
              <Card className="lg:col-span-2 p-6 shadow-lg">
                <ThemeSelector
                  currentTheme={settings.boardTheme}
                  onThemeChange={(theme) => updateSetting('boardTheme', theme as any)}
                />
              </Card>

              {/* Advanced Settings */}
              <Card className="lg:col-span-2 p-6 shadow-lg">
                <div className="flex items-center mb-6">
                  <SettingsIcon className="w-6 h-6 mr-2 text-amber-800" />
                  <h2 className="text-xl font-semibold">Advanced Settings</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-Promote to Queen</div>
                      <div className="text-sm text-gray-600">Automatically promote pawns</div>
                    </div>
                    <Switch 
                      checked={settings.autoPromoteToQueen}
                      onCheckedChange={(checked) => updateSetting('autoPromoteToQueen', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Confirm Resignation</div>
                      <div className="text-sm text-gray-600">Ask before resigning</div>
                    </div>
                    <Switch 
                      checked={settings.confirmResignation}
                      onCheckedChange={(checked) => updateSetting('confirmResignation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Keyboard Shortcuts</div>
                      <div className="text-sm text-gray-600">Enable hotkeys</div>
                    </div>
                    <Switch 
                      checked={settings.enableKeyboardShortcuts}
                      onCheckedChange={(checked) => updateSetting('enableKeyboardShortcuts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Show Move History</div>
                      <div className="text-sm text-gray-600">Display game notation</div>
                    </div>
                    <Switch 
                      checked={settings.showMoveHistory}
                      onCheckedChange={(checked) => updateSetting('showMoveHistory', checked)}
                    />
                  </div>
                </div>
              </Card>

              {/* Settings Management */}
              <Card className="lg:col-span-2 p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Settings Management</h3>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleSave} className="flex-1 min-w-[120px]">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="flex-1 min-w-[120px]">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button onClick={handleExport} variant="outline" className="flex-1 min-w-[120px]">
                    Export
                  </Button>
                  <Button onClick={handleImport} variant="outline" className="flex-1 min-w-[120px]">
                    Import
                  </Button>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
