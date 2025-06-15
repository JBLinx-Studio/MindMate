
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bot, 
  Users, 
  Crown, 
  Settings, 
  Timer, 
  Target,
  Shield,
  Zap,
  Trophy,
  Star,
  Clock
} from 'lucide-react';

interface GameModeConfig {
  opponent: 'computer' | 'human';
  difficulty?: number;
  timeControl: string;
  increment: number;
  rated: boolean;
  variant: string;
  rules: {
    allowTakebacks: boolean;
    showHints: boolean;
    allowAnalysis: boolean;
    enforceTimeLimit: boolean;
  };
}

interface GameModeSelectorProps {
  onConfigChange: (config: GameModeConfig) => void;
  onStartGame: (config: GameModeConfig) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onConfigChange, onStartGame }) => {
  const [config, setConfig] = useState<GameModeConfig>({
    opponent: 'computer',
    difficulty: 5,
    timeControl: '10+0',
    increment: 0,
    rated: false,
    variant: 'standard',
    rules: {
      allowTakebacks: true,
      showHints: false,
      allowAnalysis: true,
      enforceTimeLimit: true
    }
  });

  const updateConfig = (updates: Partial<GameModeConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const updateRules = (ruleUpdates: Partial<GameModeConfig['rules']>) => {
    const newConfig = {
      ...config,
      rules: { ...config.rules, ...ruleUpdates }
    };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const timeControls = [
    { id: '1+0', name: 'Bullet', desc: '1 minute' },
    { id: '3+0', name: 'Blitz', desc: '3 minutes' },
    { id: '5+0', name: 'Blitz', desc: '5 minutes' },
    { id: '10+0', name: 'Rapid', desc: '10 minutes' },
    { id: '15+10', name: 'Rapid', desc: '15 min + 10 sec' },
    { id: '30+0', name: 'Classical', desc: '30 minutes' },
    { id: 'unlimited', name: 'Unlimited', desc: 'No time limit' }
  ];

  const variants = [
    { id: 'standard', name: 'Standard', desc: 'Classic chess rules' },
    { id: 'chess960', name: 'Chess960', desc: 'Randomized starting positions' },
    { id: 'koth', name: 'King of the Hill', desc: 'Control the center to win' },
    { id: 'atomic', name: 'Atomic', desc: 'Captures cause explosions' },
    { id: 'antichess', name: 'Antichess', desc: 'Lose all pieces to win' }
  ];

  return (
    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Game Configuration</h2>
          <p className="text-[#b8b8b8] text-sm">Customize your game settings</p>
        </div>

        <Tabs defaultValue="opponent" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#3d3d37]">
            <TabsTrigger value="opponent" className="text-[#b8b8b8] data-[state=active]:bg-[#4a4a46] data-[state=active]:text-white">
              Opponent
            </TabsTrigger>
            <TabsTrigger value="rules" className="text-[#b8b8b8] data-[state=active]:bg-[#4a4a46] data-[state=active]:text-white">
              Rules
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-[#b8b8b8] data-[state=active]:bg-[#4a4a46] data-[state=active]:text-white">
              Advanced
            </TabsTrigger>
          </TabsList>

          <TabsContent value="opponent" className="space-y-4">
            {/* Opponent Type */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Choose Opponent</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={config.opponent === 'computer' ? "default" : "outline"}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                    config.opponent === 'computer'
                      ? 'bg-[#759900] hover:bg-[#6a8700] text-white border-[#759900]'
                      : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
                  }`}
                  onClick={() => updateConfig({ opponent: 'computer' })}
                >
                  <Bot className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Computer</div>
                    <div className="text-xs opacity-80">AI opponent</div>
                  </div>
                </Button>
                <Button
                  variant={config.opponent === 'human' ? "default" : "outline"}
                  className={`p-4 h-auto flex flex-col items-center space-y-2 ${
                    config.opponent === 'human'
                      ? 'bg-[#759900] hover:bg-[#6a8700] text-white border-[#759900]'
                      : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
                  }`}
                  onClick={() => updateConfig({ opponent: 'human' })}
                >
                  <Users className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-medium">Human</div>
                    <div className="text-xs opacity-80">Online player</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* AI Difficulty (only for computer) */}
            {config.opponent === 'computer' && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">AI Difficulty</label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <Button
                      key={level}
                      variant={config.difficulty === level ? "default" : "outline"}
                      size="sm"
                      className={`${
                        config.difficulty === level
                          ? 'bg-[#759900] hover:bg-[#6a8700] text-white border-[#759900]'
                          : 'border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]'
                      }`}
                      onClick={() => updateConfig({ difficulty: level })}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-[#b8b8b8] text-center">
                  1 = Beginner, 5 = Expert
                </div>
              </div>
            )}

            {/* Time Control */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Time Control</label>
              <Select value={config.timeControl} onValueChange={(value) => updateConfig({ timeControl: value })}>
                <SelectTrigger className="bg-[#3d3d37] border-[#4a4a46] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2c2c28] border-[#4a4a46]">
                  {timeControls.map((tc) => (
                    <SelectItem key={tc.id} value={tc.id} className="text-white hover:bg-[#4a4a46]">
                      <div className="flex items-center justify-between w-full">
                        <span>{tc.name}</span>
                        <span className="text-[#b8b8b8] text-xs ml-4">{tc.desc}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            {/* Game Variant */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white">Game Variant</label>
              <Select value={config.variant} onValueChange={(value) => updateConfig({ variant: value })}>
                <SelectTrigger className="bg-[#3d3d37] border-[#4a4a46] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2c2c28] border-[#4a4a46]">
                  {variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id} className="text-white hover:bg-[#4a4a46]">
                      <div>
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-xs text-[#b8b8b8]">{variant.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rule Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Allow Takebacks</span>
                </div>
                <Switch
                  checked={config.rules.allowTakebacks}
                  onCheckedChange={(checked) => updateRules({ allowTakebacks: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">Show Hints</span>
                </div>
                <Switch
                  checked={config.rules.showHints}
                  onCheckedChange={(checked) => updateRules({ showHints: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">Live Analysis</span>
                </div>
                <Switch
                  checked={config.rules.allowAnalysis}
                  onCheckedChange={(checked) => updateRules({ allowAnalysis: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">Enforce Time Limit</span>
                </div>
                <Switch
                  checked={config.rules.enforceTimeLimit}
                  onCheckedChange={(checked) => updateRules({ enforceTimeLimit: checked })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {/* Rated Game */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-white">Rated Game</span>
                <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">
                  Affects Rating
                </Badge>
              </div>
              <Switch
                checked={config.rated}
                onCheckedChange={(checked) => updateConfig({ rated: checked })}
              />
            </div>

            {/* Game Summary */}
            <div className="bg-[#3d3d37] rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-3">Game Summary</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#b8b8b8]">Opponent:</span>
                  <span className="text-white capitalize">{config.opponent}</span>
                </div>
                {config.opponent === 'computer' && (
                  <div className="flex justify-between">
                    <span className="text-[#b8b8b8]">AI Level:</span>
                    <span className="text-white">{config.difficulty}/5</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#b8b8b8]">Time Control:</span>
                  <span className="text-white">{config.timeControl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b8b8b8]">Variant:</span>
                  <span className="text-white">{variants.find(v => v.id === config.variant)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#b8b8b8]">Rated:</span>
                  <span className="text-white">{config.rated ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Start Game Button */}
        <Button 
          onClick={() => onStartGame(config)}
          className="w-full bg-[#759900] hover:bg-[#6a8700] text-white py-3"
        >
          <Crown className="w-5 h-5 mr-2" />
          Start Game
        </Button>
      </div>
    </Card>
  );
};

export default GameModeSelector;
