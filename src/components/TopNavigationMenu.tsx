
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
  ChevronRight
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
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumb.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-[#b8b8b8]">
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
            {index < breadcrumb.length - 1 && (
              <ChevronRight className="w-3 h-3 text-[#4a4a46]" />
            )}
          </div>
        ))}
      </div>

      {/* Center - Quick Actions */}
      <div className="flex items-center space-x-2">
        {/* Quick Play */}
        <Button
          size="sm"
          className="bg-[#759900] hover:bg-[#6a8700] text-white h-8 px-3"
        >
          <Play className="w-3 h-3 mr-1" />
          Quick Play
        </Button>

        {/* New Game Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#4a4a46] text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3"
            >
              <Plus className="w-3 h-3 mr-1" />
              New
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-40 z-50" align="center">
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Play className="mr-2 h-4 w-4" />
              Custom Game
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Trophy className="mr-2 h-4 w-4" />
              Tournament
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <BookOpen className="mr-2 h-4 w-4" />
              Study
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Target className="mr-2 h-4 w-4" />
              Puzzle Battle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#4a4a46]" />
          <Input
            placeholder="Search players, games..."
            className="w-48 h-8 pl-7 bg-[#2c2c28] border-[#4a4a46] text-[#b8b8b8] placeholder:text-[#4a4a46] focus:border-[#759900] text-sm"
          />
        </div>
      </div>

      {/* Right side - User actions and utilities */}
      <div className="flex items-center space-x-2">
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
