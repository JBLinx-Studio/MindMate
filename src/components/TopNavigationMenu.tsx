
import React from 'react';
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
  Filter
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function TopNavigationMenu() {
  const location = useLocation();
  
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
    // Add more breadcrumb logic as needed
    return [{ label: 'Home', icon: Home }];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="h-12 bg-[#161512] border-b border-[#3d3d37] flex items-center justify-between px-4">
      {/* Left side - Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm min-w-0 flex-1">
        {breadcrumb.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-[#b8b8b8]">
              <item.icon className="w-4 h-4" />
              <span className="truncate">{item.label}</span>
            </div>
            {index < breadcrumb.length - 1 && (
              <ChevronRight className="w-3 h-3 text-[#4a4a46] flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Center - Enhanced Game Hub */}
      <div className="flex items-center space-x-3 px-6">
        {/* Quick Game Modes */}
        <div className="flex items-center space-x-2 bg-[#2c2c28] rounded-lg px-3 py-1">
          <Button
            size="sm"
            className="bg-[#759900] hover:bg-[#6a8700] text-white h-7 px-3 text-xs"
          >
            <Zap className="w-3 h-3 mr-1" />
            1+0
          </Button>
          <Button
            size="sm"
            className="bg-[#dc7633] hover:bg-[#c0632b] text-white h-7 px-3 text-xs"
          >
            <Timer className="w-3 h-3 mr-1" />
            3+2
          </Button>
          <Button
            size="sm"
            className="bg-[#3498db] hover:bg-[#2e86c1] text-white h-7 px-3 text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            10+0
          </Button>
        </div>

        {/* Game Mode Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#4a4a46] text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3"
            >
              <Gamepad2 className="w-3 h-3 mr-1" />
              More Games
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-48 z-50" align="center">
            <DropdownMenuLabel className="text-[#b8b8b8]">Game Modes</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              Play vs Friend
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Brain className="mr-2 h-4 w-4" />
              vs Computer
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Target className="mr-2 h-4 w-4" />
              Puzzle Battle
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Swords className="mr-2 h-4 w-4" />
              Arena Tournament
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Trophy className="mr-2 h-4 w-4" />
              Swiss Tournament
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Enhanced Search with Filters */}
        <div className="flex items-center space-x-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#4a4a46]" />
            <Input
              placeholder="Search games, players, openings..."
              className="w-64 h-8 pl-7 pr-8 bg-[#2c2c28] border-[#4a4a46] text-[#b8b8b8] placeholder:text-[#4a4a46] focus:border-[#759900] text-sm"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Active Game Indicator */}
        <div className="flex items-center space-x-2 bg-[#2c2c28] rounded-lg px-3 py-1">
          <div className="w-2 h-2 bg-[#759900] rounded-full animate-pulse"></div>
          <span className="text-[#b8b8b8] text-xs">2 active games</span>
          <Button
            size="sm"
            className="bg-transparent hover:bg-[#4a4a46] text-[#759900] h-6 px-2 text-xs border border-[#759900]/30 hover:border-[#759900]"
          >
            View
          </Button>
        </div>
      </div>

      {/* Right side - User actions and utilities */}
      <div className="flex items-center space-x-2 flex-1 justify-end">
        {/* User Rating */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="text-[#b8b8b8]">Rating:</div>
          <div className="text-[#759900] font-semibold">1847</div>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0 relative"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#dc7633] rounded-full"></div>
        </Button>

        {/* Language */}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0"
        >
          <Globe className="w-4 h-4" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-2"
            >
              <User className="w-4 h-4 mr-1" />
              ChessPlayer
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-48 z-50" align="end">
            <DropdownMenuLabel className="text-[#b8b8b8]">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#759900] rounded-full flex items-center justify-center text-white font-semibold">
                  CP
                </div>
                <div>
                  <div className="font-medium text-white">ChessPlayer</div>
                  <div className="text-xs text-[#b8b8b8]">Online</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Trophy className="mr-2 h-4 w-4" />
              My Games
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Target className="mr-2 h-4 w-4" />
              My Puzzles
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Crown className="mr-2 h-4 w-4" />
              Premium
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
