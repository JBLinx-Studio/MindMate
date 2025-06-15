
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  Users,
  Calendar,
  Gamepad2,
  TrendingUp,
  Video,
  MessageSquare,
  Clock,
  Puzzle
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

export function TopNavigationMenu() {
  const location = useLocation();
  
  // Enhanced breadcrumb mapping with proper categorization
  const getBreadcrumbPath = () => {
    const path = location.pathname;
    
    // Root
    if (path === '/') {
      return [{ label: 'Dashboard', href: '/', icon: Home }];
    }
    
    // Play section
    if (path === '/lobby') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Play', href: '/lobby', icon: Play }
      ];
    }
    
    // Learn section
    if (path.startsWith('/learn')) {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Learn', href: '/learn/basics', icon: BookOpen }
      ];
    }
    
    if (path === '/practice') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Learn', href: '/learn/basics', icon: BookOpen },
        { label: 'Practice', href: '/practice', icon: Target }
      ];
    }
    
    if (path === '/coordinates') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Learn', href: '/learn/basics', icon: BookOpen },
        { label: 'Coordinates', href: '/coordinates', icon: Target }
      ];
    }
    
    // Puzzles section
    if (path === '/puzzles') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Puzzles', href: '/puzzles', icon: Puzzle }
      ];
    }
    
    if (path === '/puzzle-themes') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Puzzles', href: '/puzzles', icon: Puzzle },
        { label: 'Themes', href: '/puzzle-themes', icon: Target }
      ];
    }
    
    if (path === '/puzzle-dashboard') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Puzzles', href: '/puzzles', icon: Puzzle },
        { label: 'Dashboard', href: '/puzzle-dashboard', icon: TrendingUp }
      ];
    }
    
    if (path === '/puzzle-storm') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Puzzles', href: '/puzzles', icon: Puzzle },
        { label: 'Storm', href: '/puzzle-storm', icon: Zap }
      ];
    }
    
    if (path === '/puzzle-racer') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Puzzles', href: '/puzzles', icon: Puzzle },
        { label: 'Racer', href: '/puzzle-racer', icon: Zap }
      ];
    }
    
    // Compete section
    if (path === '/tournaments') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Compete', href: '/tournaments', icon: Trophy },
        { label: 'Tournaments', href: '/tournaments', icon: Trophy }
      ];
    }
    
    if (path === '/simuls') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Compete', href: '/tournaments', icon: Trophy },
        { label: 'Simuls', href: '/simuls', icon: Users }
      ];
    }
    
    if (path === '/swiss') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Compete', href: '/tournaments', icon: Trophy },
        { label: 'Swiss', href: '/swiss', icon: Calendar }
      ];
    }
    
    // Watch section
    if (path === '/tv') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Watch', href: '/tv', icon: Video },
        { label: 'Chess TV', href: '/tv', icon: Video }
      ];
    }
    
    if (path === '/games') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Watch', href: '/tv', icon: Video },
        { label: 'Games', href: '/games', icon: Gamepad2 }
      ];
    }
    
    if (path === '/streamers') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Watch', href: '/tv', icon: Video },
        { label: 'Streamers', href: '/streamers', icon: Video }
      ];
    }
    
    if (path === '/broadcasts') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Watch', href: '/tv', icon: Video },
        { label: 'Broadcasts', href: '/broadcasts', icon: Video }
      ];
    }
    
    if (path === '/video') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Watch', href: '/tv', icon: Video },
        { label: 'Library', href: '/video', icon: BookOpen }
      ];
    }
    
    // Community section
    if (path === '/players') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Community', href: '/players', icon: Users },
        { label: 'Players', href: '/players', icon: Users }
      ];
    }
    
    if (path === '/teams') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Community', href: '/players', icon: Users },
        { label: 'Teams', href: '/teams', icon: Users }
      ];
    }
    
    if (path === '/forum') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Community', href: '/players', icon: Users },
        { label: 'Forum', href: '/forum', icon: MessageSquare }
      ];
    }
    
    if (path === '/blog') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Community', href: '/players', icon: Users },
        { label: 'Blog', href: '/blog', icon: BookOpen }
      ];
    }
    
    // Tools section
    if (path === '/analysis') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Tools', href: '/analysis', icon: Target },
        { label: 'Analysis', href: '/analysis', icon: Target }
      ];
    }
    
    if (path === '/study') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Tools', href: '/analysis', icon: Target },
        { label: 'Study', href: '/study', icon: BookOpen }
      ];
    }
    
    if (path === '/opening-explorer') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Tools', href: '/analysis', icon: Target },
        { label: 'Opening Explorer', href: '/opening-explorer', icon: Search }
      ];
    }
    
    if (path === '/editor') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Tools', href: '/analysis', icon: Target },
        { label: 'Board Editor', href: '/editor', icon: Target }
      ];
    }
    
    if (path === '/import') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Tools', href: '/analysis', icon: Target },
        { label: 'Import Game', href: '/import', icon: Plus }
      ];
    }
    
    if (path === '/search') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Tools', href: '/analysis', icon: Target },
        { label: 'Advanced Search', href: '/search', icon: Search }
      ];
    }
    
    // Account section
    if (path === '/profile') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Account', href: '/profile', icon: User },
        { label: 'Profile', href: '/profile', icon: User }
      ];
    }
    
    if (path === '/settings') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Account', href: '/profile', icon: User },
        { label: 'Settings', href: '/settings', icon: Settings }
      ];
    }
    
    if (path === '/coaches') {
      return [
        { label: 'Dashboard', href: '/', icon: Home },
        { label: 'Account', href: '/profile', icon: User },
        { label: 'Coaches', href: '/coaches', icon: Users }
      ];
    }
    
    // Default fallback
    return [{ label: 'Dashboard', href: '/', icon: Home }];
  };

  const breadcrumbPath = getBreadcrumbPath();
  const currentPage = breadcrumbPath[breadcrumbPath.length - 1];

  return (
    <div className="h-12 bg-[#161512] border-b border-[#3d3d37] flex items-center justify-between px-4">
      {/* Left side - Enhanced Breadcrumb Navigation */}
      <div className="flex items-center space-x-4">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbPath.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === breadcrumbPath.length - 1 ? (
                    <BreadcrumbPage className="flex items-center space-x-2 text-white font-medium">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href} 
                        className="flex items-center space-x-2 text-[#b8b8b8] hover:text-white transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbPath.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        
        {/* Current Time */}
        <div className="flex items-center space-x-2 text-[#b8b8b8] text-sm">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Center - Context-Aware Quick Actions */}
      <div className="flex items-center space-x-2">
        {/* Quick Play - Always Available */}
        <Button
          size="sm"
          className="bg-[#759900] hover:bg-[#6a8700] text-white h-8 px-3"
        >
          <Play className="w-3 h-3 mr-1" />
          Quick Play
        </Button>

        {/* Context-specific actions based on current page */}
        {location.pathname === '/puzzles' && (
          <Button
            size="sm"
            className="bg-[#dc7633] hover:bg-[#c0694b] text-white h-8 px-3"
          >
            <Zap className="w-3 h-3 mr-1" />
            Puzzle Rush
          </Button>
        )}

        {location.pathname === '/tournaments' && (
          <Button
            size="sm"
            className="bg-[#3498db] hover:bg-[#2980b9] text-white h-8 px-3"
          >
            <Trophy className="w-3 h-3 mr-1" />
            Join Tournament
          </Button>
        )}

        {location.pathname === '/simuls' && (
          <Button
            size="sm"
            className="bg-[#9b59b6] hover:bg-[#8e44ad] text-white h-8 px-3"
          >
            <Users className="w-3 h-3 mr-1" />
            Join Simul
          </Button>
        )}

        {location.pathname === '/analysis' && (
          <Button
            size="sm"
            className="bg-[#e67e22] hover:bg-[#d35400] text-white h-8 px-3"
          >
            <Target className="w-3 h-3 mr-1" />
            New Analysis
          </Button>
        )}

        {/* New Game Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#4a4a46] text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create
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
              <Users className="mr-2 h-4 w-4" />
              Simul
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <BookOpen className="mr-2 h-4 w-4" />
              Study
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Global Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-[#4a4a46]" />
          <Input
            placeholder="Search players, games..."
            className="w-48 h-8 pl-7 bg-[#2c2c28] border-[#4a4a46] text-[#b8b8b8] placeholder:text-[#4a4a46] focus:border-[#759900] text-sm"
          />
        </div>
      </div>

      {/* Right side - User status and utilities */}
      <div className="flex items-center space-x-3">
        {/* User Rating */}
        <div className="flex items-center space-x-2 text-sm">
          <div className="text-[#b8b8b8]">Rating:</div>
          <div className="text-[#759900] font-semibold">1847</div>
        </div>

        {/* Online Status Indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-[#b8b8b8] text-sm">Online</span>
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
                  <div className="text-xs text-[#b8b8b8]">Rating: 1847</div>
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
