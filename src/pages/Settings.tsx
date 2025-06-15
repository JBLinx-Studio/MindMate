
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Bell, Palette, Volume2, Save, RotateCcw } from 'lucide-react';
import { useGameSettings } from '../hooks/useGameSettings';
import ThemeSelector from '../components/ThemeSelector';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, updateSetting, resetSettings } = useGameSettings();

  const handleSave = () => {
    toast.success('Settings saved successfully!', {
      description: 'Your preferences have been updated.',
      duration: 3000,
    });
  };

  const handleReset = () => {
    resetSettings();
    toast.info('Settings reset to default values', {
      duration: 3000,
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
              <h1 className="text-2xl font-bold text-amber-800">Settings</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <SettingsIcon className="w-6 h-6 mr-2 text-amber-800" />
                  <h2 className="text-xl font-semibold">Game Preferences</h2>
                </div>
                
                <div className="space-y-8">
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

                  <div className="border-t pt-6">
                    <ThemeSelector
                      currentTheme={settings.boardTheme}
                      onThemeChange={(theme) => updateSetting('boardTheme', theme as any)}
                    />
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t flex space-x-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
