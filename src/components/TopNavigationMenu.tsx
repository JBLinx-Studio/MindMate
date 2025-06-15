
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Globe,
  Crown,
  Trophy,
  Target,
  Zap,
  ChevronDown,
  Plus,
  Play,
  BookOpen,
  Home,
  ChevronRight,
  Clock,
  Users,
  Gamepad2,
  Brain,
  Timer,
  Swords,
  Filter,
  Flame,
  Star,
  Shield,
  Rocket,
  Medal,
  Calendar,
  TrendingUp,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function TopNavigationMenu() {
  const location = useLocation();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  
  // Get breadcrumb based on current path
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Home', icon: Home }];
    if (path.startsWith('/learn')) return [
      { label: 'Home', icon: Home },
      { label: 'Learn', icon: BookOpen }
    ];
    if (path.startsWith('/puzzles')) return [
      { label: 'Home', icon: Home },
      { label: 'Puzzles', icon: Target }
    ];
    if (path.startsWith('/tournaments')) return [
      { label: 'Home', icon: Home },
      { label: 'Tournaments', icon: Trophy }
    ];
    return [{ label: 'Home', icon: Home }];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="h-14 bg-gradient-to-r from-[#1a1a1a] via-[#161512] to-[#1a1a1a] border-b border-[#3d3d37] flex items-center justify-between px-6 shadow-lg">
      {/* Left side - Brand and Breadcrumb */}
      <div className="flex items-center space-x-6 min-w-0 flex-1">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#759900] to-[#5a7300] rounded-lg flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg leading-none">ChessForge</span>
            <span className="text-[#759900] text-xs font-medium">by JBLinx Studio</span>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-[#b8b8b8] hover:text-white transition-colors cursor-pointer">
                <item.icon className="w-4 h-4" />
                <span className="truncate">{item.label}</span>
              </div>
              {index < breadcrumb.length - 1 && (
                <ChevronRight className="w-3 h-3 text-[#4a4a46] flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center - Enhanced Game Hub with Quick Actions */}
      <div className="flex items-center space-x-4 px-8">
        {/* Quick Play Buttons */}
        <div className="flex items-center space-x-2 bg-[#2c2c28] rounded-xl px-4 py-2 shadow-inner">
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#759900] to-[#6a8700] hover:from-[#6a8700] hover:to-[#5a7300] text-white h-8 px-4 text-xs font-semibold shadow-md transform hover:scale-105 transition-all"
          >
            <Zap className="w-3 h-3 mr-1" />
            Bullet 1+0
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#dc7633] to-[#c0632b] hover:from-[#c0632b] hover:to-[#a0521f] text-white h-8 px-4 text-xs font-semibold shadow-md transform hover:scale-105 transition-all"
          >
            <Timer className="w-3 h-3 mr-1" />
            Blitz 3+2
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#3498db] to-[#2e86c1] hover:from-[#2e86c1] hover:to-[#2874a6] text-white h-8 px-4 text-xs font-semibold shadow-md transform hover:scale-105 transition-all"
          >
            <Clock className="w-3 h-3 mr-1" />
            Rapid 10+0
          </Button>
        </div>

        {/* Enhanced Game Mode Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] h-9 px-4 font-medium shadow-md"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              More Games
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-56 z-50 shadow-xl" align="center">
            <DropdownMenuLabel className="text-[#759900] font-semibold flex items-center">
              <Flame className="w-4 h-4 mr-2" />
              Game Modes
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Users className="mr-3 h-4 w-4 text-[#759900]" />
              <div>
                <div className="font-medium">Play vs Friend</div>
                <div className="text-xs text-[#888]">Challenge a specific player</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Brain className="mr-3 h-4 w-4 text-[#3498db]" />
              <div>
                <div className="font-medium">vs Computer</div>
                <div className="text-xs text-[#888]">Practice against AI</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Target className="mr-3 h-4 w-4 text-[#dc7633]" />
              <div>
                <div className="font-medium">Puzzle Battle</div>
                <div className="text-xs text-[#888]">Competitive puzzle solving</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Swords className="mr-3 h-4 w-4 text-[#e74c3c]" />
              <div>
                <div className="font-medium">Arena Tournament</div>
                <div className="text-xs text-[#888]">Join live tournaments</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Trophy className="mr-3 h-4 w-4 text-[#f39c12]" />
              <div>
                <div className="font-medium">Swiss Tournament</div>
                <div className="text-xs text-[#888]">Fair pairing system</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Enhanced Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4a4a46]" />
            <Input
              placeholder="Search players, games, openings..."
              className="w-72 h-9 pl-10 pr-4 bg-[#2c2c28] border-[#4a4a46] text-[#b8b8b8] placeholder:text-[#4a4a46] focus:border-[#759900] text-sm shadow-inner"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-9 w-9 p-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Active Games and Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[#2c2c28] rounded-lg px-3 py-2 shadow-inner">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#759900] rounded-full animate-pulse"></div>
              <span className="text-[#b8b8b8] text-xs font-medium">3 active</span>
            </div>
            <Button
              size="sm"
              className="bg-transparent hover:bg-[#4a4a46] text-[#759900] h-6 px-3 text-xs border border-[#759900]/30 hover:border-[#759900] font-medium"
            >
              <Play className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - User Info and Controls */}
      <div className="flex items-center space-x-3 flex-1 justify-end">
        {/* Quick Settings */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>

        {/* User Performance */}
        <div className="flex items-center space-x-3 text-sm bg-[#2c2c28] rounded-lg px-3 py-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#759900]" />
            <div className="text-[#b8b8b8]">Rating:</div>
            <div className="text-[#759900] font-bold">1847</div>
          </div>
          <div className="w-px h-4 bg-[#4a4a46]"></div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-[#f39c12]" />
            <span className="text-[#f39c12] font-semibold text-xs">+24</span>
          </div>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-9 w-9 p-0 relative"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#dc7633] rounded-full text-white text-xs flex items-center justify-center font-bold">3</div>
        </Button>

        {/* Connection Status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-[#759900]" />
          ) : (
            <WifiOff className="w-4 h-4 text-[#e74c3c]" />
          )}
        </div>

        {/* Language */}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-9 w-9 p-0"
        >
          <Globe className="w-4 h-4" />
        </Button>

        {/* Enhanced User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-9 px-3 border border-[#4a4a46]"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-[#759900] to-[#5a7300] rounded-full flex items-center justify-center text-white font-bold text-xs mr-2">
                CP
              </div>
              <span className="font-medium">ChessPlayer</span>
              <ChevronDown className="w-3 h-3 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-64 z-50 shadow-xl" align="end">
            <DropdownMenuLabel className="text-[#b8b8b8]">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#759900] to-[#5a7300] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  CP
                </div>
                <div>
                  <div className="font-semibold text-white text-base">ChessPlayer</div>
                  <div className="text-sm text-[#759900] flex items-center">
                    <div className="w-2 h-2 bg-[#759900] rounded-full mr-2"></div>
                    Online
                  </div>
                  <div className="text-xs text-[#888] mt-1">Member since 2024</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <User className="mr-3 h-4 w-4 text-[#759900]" />
              <div>
                <div className="font-medium">Profile</div>
                <div className="text-xs text-[#888]">View and edit profile</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Trophy className="mr-3 h-4 w-4 text-[#f39c12]" />
              <div>
                <div className="font-medium">My Games</div>
                <div className="text-xs text-[#888]">Game history & analysis</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Target className="mr-3 h-4 w-4 text-[#dc7633]" />
              <div>
                <div className="font-medium">My Puzzles</div>
                <div className="text-xs text-[#888]">Puzzle performance</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Calendar className="mr-3 h-4 w-4 text-[#3498db]" />
              <div>
                <div className="font-medium">Tournaments</div>
                <div className="text-xs text-[#888]">Upcoming & past events</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Crown className="mr-3 h-4 w-4 text-[#f39c12]" />
              <div>
                <div className="font-medium">Premium</div>
                <div className="text-xs text-[#888]">Unlock advanced features</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Settings className="mr-3 h-4 w-4 text-[#b8b8b8]" />
              <div>
                <div className="font-medium">Settings</div>
                <div className="text-xs text-[#888]">Preferences & privacy</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <LogOut className="mr-3 h-4 w-4 text-[#e74c3c]" />
              <div>
                <div className="font-medium">Sign out</div>
                <div className="text-xs text-[#888]">Logout from account</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
