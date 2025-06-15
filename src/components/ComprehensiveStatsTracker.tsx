
import React, { useState, useEffect } from 'react';
import { GameState } from '../types/chess';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Trophy, 
  Clock, 
  Target, 
  Zap,
  Star,
  Calendar,
  Award,
  Brain
} from 'lucide-react';

interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageGameLength: number;
  favoriteOpening: string;
  longestWinStreak: number;
  currentStreak: number;
  ratingProgress: number[];
  tacticalAccuracy: number;
  endgamePerformance: number;
  timeManagement: number;
}

interface PerformanceMetrics {
  accuracy: number;
  blunders: number;
  mistakes: number;
  inaccuracies: number;
  excellent: number;
  centipawnLoss: number;
  timePerMove: number;
  openingKnowledge: number;
  tacticsSolved: number;
  studyTime: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface ComprehensiveStatsTrackerProps {
  gameState: GameState;
  isActive: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    unlocked: true
  },
  {
    id: 'win-streak-5',
    name: 'Hot Streak',
    description: 'Win 5 games in a row',
    icon: '🔥',
    unlocked: false,
    progress: 3,
    maxProgress: 5
  },
  {
    id: 'tactics-master',
    name: 'Tactics Master',
    description: 'Solve 100 tactical puzzles',
    icon: '🧩',
    unlocked: false,
    progress: 67,
    maxProgress: 100
  },
  {
    id: 'endgame-expert',
    name: 'Endgame Expert',
    description: 'Win 10 endgames with less than 5 pieces',
    icon: '👑',
    unlocked: true
  },
  {
    id: 'time-master',
    name: 'Time Master',
    description: 'Win a game with 90% of time remaining',
    icon: '⏰',
    unlocked: false,
    progress: 1,
    maxProgress: 1
  }
];

export const ComprehensiveStatsTracker: React.FC<ComprehensiveStatsTrackerProps> = ({
  gameState,
  isActive
}) => {
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGames: 247,
    wins: 142,
    losses: 78,
    draws: 27,
    winRate: 57.5,
    averageGameLength: 34.2,
    favoriteOpening: "Sicilian Defense",
    longestWinStreak: 8,
    currentStreak: 3,
    ratingProgress: [1200, 1234, 1198, 1267, 1289, 1301, 1287, 1324, 1356, 1342],
    tacticalAccuracy: 76.3,
    endgamePerformance: 68.9,
    timeManagement: 82.1
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    accuracy: 84.7,
    blunders: 12,
    mistakes: 34,
    inaccuracies: 67,
    excellent: 89,
    centipawnLoss: 23.4,
    timePerMove: 12.8,
    openingKnowledge: 91.2,
    tacticsSolved: 67,
    studyTime: 124.5
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    if (isActive) {
      // Update stats based on current game
      updateStatsFromGame();
    }
  }, [gameState, isActive]);

  const updateStatsFromGame = () => {
    // This would integrate with your game tracking logic
    // For now, we'll simulate realistic updates
  };

  const getRatingTrend = () => {
    const recent = gameStats.ratingProgress.slice(-3);
    if (recent.length < 2) return 'stable';
    const trend = recent[recent.length - 1] - recent[0];
    return trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStreakIcon = () => {
    if (gameStats.currentStreak >= 5) return '🔥';
    if (gameStats.currentStreak >= 3) return '💪';
    if (gameStats.currentStreak >= 1) return '✅';
    return '📈';
  };

  if (!isActive) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-violet-600" />
          <h3 className="text-lg font-bold text-gray-800">Performance Analytics</h3>
        </div>
        
        <div className="flex space-x-2">
          <Badge className="bg-violet-100 text-violet-700 border-violet-200">
            Current Rating: {gameStats.ratingProgress[gameStats.ratingProgress.length - 1]}
          </Badge>
          <Badge className={`${
            getRatingTrend() === 'up' ? 'bg-green-100 text-green-700' :
            getRatingTrend() === 'down' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {getRatingTrend() === 'up' ? '↗' : getRatingTrend() === 'down' ? '↘' : '→'} Trend
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Game Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{gameStats.wins}</div>
              <div className="text-xs text-gray-600">Wins</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{gameStats.losses}</div>
              <div className="text-xs text-gray-600">Losses</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">{gameStats.draws}</div>
              <div className="text-xs text-gray-600">Draws</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{gameStats.winRate}%</div>
              <div className="text-xs text-gray-600">Win Rate</div>
            </Card>
          </div>

          {/* Current Streak */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getStreakIcon()}</span>
                <div>
                  <div className="font-semibold">Current Streak</div>
                  <div className="text-sm text-gray-600">
                    {gameStats.currentStreak} games | Best: {gameStats.longestWinStreak}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{gameStats.currentStreak}</div>
                <div className="text-xs text-gray-600">Games</div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold">{gameStats.averageGameLength}</div>
              <div className="text-gray-600">Avg. Moves</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{gameStats.favoriteOpening}</div>
              <div className="text-gray-600">Favorite Opening</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{gameStats.totalGames}</div>
              <div className="text-gray-600">Total Games</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Accuracy</span>
                <span className={`font-bold ${getPerformanceColor(performanceMetrics.accuracy)}`}>
                  {performanceMetrics.accuracy}%
                </span>
              </div>
              <Progress value={performanceMetrics.accuracy} className="h-2" />
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tactical Accuracy</span>
                <span className={`font-bold ${getPerformanceColor(gameStats.tacticalAccuracy)}`}>
                  {gameStats.tacticalAccuracy}%
                </span>
              </div>
              <Progress value={gameStats.tacticalAccuracy} className="h-2" />
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Endgame Performance</span>
                <span className={`font-bold ${getPerformanceColor(gameStats.endgamePerformance)}`}>
                  {gameStats.endgamePerformance}%
                </span>
              </div>
              <Progress value={gameStats.endgamePerformance} className="h-2" />
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Time Management</span>
                <span className={`font-bold ${getPerformanceColor(gameStats.timeManagement)}`}>
                  {gameStats.timeManagement}%
                </span>
              </div>
              <Progress value={gameStats.timeManagement} className="h-2" />
            </div>
          </div>

          {/* Move Quality Distribution */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Move Quality Distribution</h4>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{performanceMetrics.excellent}</div>
                <div className="text-green-600">Excellent</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">156</div>
                <div className="text-blue-600">Good</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">{performanceMetrics.inaccuracies}</div>
                <div className="text-yellow-600">Inaccuracies</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">{performanceMetrics.mistakes}</div>
                <div className="text-orange-600">Mistakes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{performanceMetrics.blunders}</div>
                <div className="text-red-600">Blunders</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-3">
            {ACHIEVEMENTS.map((achievement) => (
              <Card key={achievement.id} className={`p-4 ${
                achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <div className={`font-semibold ${
                        achievement.unlocked ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {achievement.name}
                      </div>
                      <div className="text-sm text-gray-600">{achievement.description}</div>
                    </div>
                  </div>
                  
                  {achievement.unlocked ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <Trophy className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  ) : achievement.progress !== undefined ? (
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                      <Progress 
                        value={(achievement.progress / (achievement.maxProgress || 1)) * 100} 
                        className="h-2 w-16"
                      />
                    </div>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Rating Chart */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3">Rating Progress</h4>
            <div className="h-32 bg-white rounded border p-2">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                  points={gameStats.ratingProgress.map((rating, i) => {
                    const x = (i / (gameStats.ratingProgress.length - 1)) * 100;
                    const minRating = Math.min(...gameStats.ratingProgress);
                    const maxRating = Math.max(...gameStats.ratingProgress);
                    const y = 90 - ((rating - minRating) / (maxRating - minRating)) * 80;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                {gameStats.ratingProgress.map((rating, i) => {
                  const x = (i / (gameStats.ratingProgress.length - 1)) * 100;
                  const minRating = Math.min(...gameStats.ratingProgress);
                  const maxRating = Math.max(...gameStats.ratingProgress);
                  const y = 90 - ((rating - minRating) / (maxRating - minRating)) * 80;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#8B5CF6"
                    />
                  );
                })}
              </svg>
            </div>
          </Card>

          {/* Study Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-bold">{performanceMetrics.studyTime}h</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </Card>
            <Card className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold">{performanceMetrics.tacticsSolved}</div>
              <div className="text-sm text-gray-600">Puzzles Solved</div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ComprehensiveStatsTracker;
