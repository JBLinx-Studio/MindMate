
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { User, Edit, TrendingUp, Clock, Trophy, Target, Calendar, Download, Upload, LogOut } from 'lucide-react';
import { useLocalAuth } from '../hooks/useLocalAuth';
import { localStorageManager } from '../utils/localStorageManager';
import { searchHistoryManager } from '../utils/searchHistory';
import { toast } from 'sonner';

const Profile = () => {
  const { authState, logout } = useLocalAuth();
  const [stats, setStats] = useState(localStorageManager.getPlayingStats());
  const [recentSessions, setRecentSessions] = useState(localStorageManager.getRecentSessions(10));
  const [searchHistory, setSearchHistory] = useState(searchHistoryManager.getRecentSearches(undefined, 20));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Refresh data when component mounts
    setStats(localStorageManager.getPlayingStats());
    setRecentSessions(localStorageManager.getRecentSessions(10));
    setSearchHistory(searchHistoryManager.getRecentSearches(undefined, 20));
  }, []);

  const handleExportData = () => {
    try {
      const data = localStorageManager.exportUserData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chess-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const success = localStorageManager.importUserData(content);
          if (success) {
            toast.success('Data imported successfully!');
            // Refresh the data
            setStats(localStorageManager.getPlayingStats());
            setRecentSessions(localStorageManager.getRecentSessions(10));
            setSearchHistory(searchHistoryManager.getRecentSearches(undefined, 20));
          } else {
            toast.error('Failed to import data - invalid format');
          }
        } catch (error) {
          toast.error('Failed to import data');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearSearchHistory = () => {
    searchHistoryManager.clearSearchHistory();
    setSearchHistory([]);
    toast.success('Search history cleared');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (!authState.user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-[#161512]">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-16 flex items-center justify-between px-6 bg-[#2c2c28] border-b border-[#4a4a46]">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="lg:hidden text-white" />
                <h1 className="text-2xl font-bold text-white">Profile</h1>
              </div>
            </header>
            <main className="flex-1 p-6 flex items-center justify-center">
              <Card className="bg-[#2c2c28] border-[#4a4a46] p-8 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-[#b8b8b8]" />
                <h2 className="text-xl font-semibold text-white mb-2">No User Logged In</h2>
                <p className="text-[#b8b8b8]">Please log in to view your profile</p>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const winRate = authState.user.stats.gamesPlayed > 0 
    ? (authState.user.stats.wins / authState.user.stats.gamesPlayed) * 100 
    : 0;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#161512]">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-[#2c2c28] border-b border-[#4a4a46]">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden text-white" />
              <h1 className="text-2xl font-bold text-white">Profile</h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* User Info Card */}
              <Card className="bg-[#2c2c28] border-[#4a4a46] p-8">
                <div className="flex items-center space-x-6 mb-6">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="text-2xl bg-[#759900] text-white">
                      {authState.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-3xl font-bold text-white">{authState.user.username}</h2>
                      {authState.user.isGuest && (
                        <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                          Guest
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#b8b8b8] mb-2">
                      Member since {new Date(authState.user.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-[#b8b8b8] text-sm">
                      Last active: {new Date(authState.user.lastLoginAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#759900] mb-1">
                      {authState.user.stats.rating}
                    </div>
                    <div className="text-sm text-[#b8b8b8]">Current Rating</div>
                    <div className="text-xs text-[#b8b8b8] mt-1">
                      Peak: {authState.user.stats.highestRating}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 border border-[#4a4a46] rounded-lg">
                    <Trophy className="w-8 h-8 mx-auto mb-2 text-[#759900]" />
                    <div className="text-2xl font-bold text-white">{authState.user.stats.wins}</div>
                    <div className="text-sm text-[#b8b8b8]">Wins</div>
                  </div>
                  
                  <div className="text-center p-4 border border-[#4a4a46] rounded-lg">
                    <Target className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <div className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</div>
                    <div className="text-sm text-[#b8b8b8]">Win Rate</div>
                  </div>
                  
                  <div className="text-center p-4 border border-[#4a4a46] rounded-lg">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold text-white">{authState.user.stats.gamesPlayed}</div>
                    <div className="text-sm text-[#b8b8b8]">Games Played</div>
                  </div>
                  
                  <div className="text-center p-4 border border-[#4a4a46] rounded-lg">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <div className="text-2xl font-bold text-white">{authState.user.stats.currentStreak}</div>
                    <div className="text-sm text-[#b8b8b8]">Current Streak</div>
                  </div>
                </div>
              </Card>

              {/* Tabs for detailed information */}
              <Tabs defaultValue="stats" className="space-y-4">
                <TabsList className="bg-[#2c2c28] border-[#4a4a46]">
                  <TabsTrigger value="stats" className="text-[#b8b8b8] data-[state=active]:text-white">Statistics</TabsTrigger>
                  <TabsTrigger value="recent" className="text-[#b8b8b8] data-[state=active]:text-white">Recent Games</TabsTrigger>
                  <TabsTrigger value="search" className="text-[#b8b8b8] data-[state=active]:text-white">Search History</TabsTrigger>
                  <TabsTrigger value="data" className="text-[#b8b8b8] data-[state=active]:text-white">Data Management</TabsTrigger>
                </TabsList>

                <TabsContent value="stats">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Playing Statistics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#b8b8b8]">Total Games</span>
                            <span className="text-white">{stats.totalGames}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#b8b8b8]">Win Rate</span>
                            <span className="text-white">{stats.winRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={stats.winRate} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#b8b8b8]">Average Game Length</span>
                            <span className="text-white">{stats.averageGameLength.toFixed(1)} min</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-[#b8b8b8]">Favorite Time Control</span>
                            <span className="text-white">{stats.favoriteTimeControl}</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Trophy className="w-5 h-5 text-[#759900]" />
                          <span className="text-[#b8b8b8]">Longest Win Streak: {authState.user.stats.longestStreak}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          <span className="text-[#b8b8b8]">Highest Rating: {authState.user.stats.highestRating}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-purple-400" />
                          <span className="text-[#b8b8b8]">Playing Days: {stats.playingTrends.length}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recent">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Games</h3>
                    {recentSessions.length > 0 ? (
                      <div className="space-y-3">
                        {recentSessions.map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-3 border border-[#4a4a46] rounded">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                session.result === 'win' ? 'bg-green-500' : 
                                session.result === 'loss' ? 'bg-red-500' : 'bg-yellow-500'
                              }`} />
                              <div>
                                <div className="text-white font-medium">vs {session.opponent}</div>
                                <div className="text-[#b8b8b8] text-sm">
                                  {new Date(session.startTime).toLocaleDateString()} • {session.timeControl}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-medium capitalize">{session.result || 'Ongoing'}</div>
                              {session.ratingChange && (
                                <div className={`text-sm ${session.ratingChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {session.ratingChange > 0 ? '+' : ''}{session.ratingChange}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#b8b8b8] text-center py-8">No recent games found</p>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="search">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Search History</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearSearchHistory}
                        className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                      >
                        Clear History
                      </Button>
                    </div>
                    {searchHistory.length > 0 ? (
                      <div className="space-y-2">
                        {searchHistory.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border border-[#4a4a46] rounded">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="text-xs">
                                {item.type}
                              </Badge>
                              <span className="text-white">{item.query}</span>
                            </div>
                            <div className="text-[#b8b8b8] text-sm">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[#b8b8b8] text-center py-8">No search history found</p>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="data">
                  <Card className="bg-[#2c2c28] border-[#4a4a46] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-[#4a4a46] rounded">
                        <div>
                          <h4 className="text-white font-medium">Export Data</h4>
                          <p className="text-[#b8b8b8] text-sm">Download all your chess data as JSON</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={handleExportData}
                          className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border border-[#4a4a46] rounded">
                        <div>
                          <h4 className="text-white font-medium">Import Data</h4>
                          <p className="text-[#b8b8b8] text-sm">Restore data from a backup file</p>
                        </div>
                        <div>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            className="hidden"
                            id="import-file"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById('import-file')?.click()}
                            className="border-[#4a4a46] text-[#b8b8b8] hover:bg-[#4a4a46]"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
