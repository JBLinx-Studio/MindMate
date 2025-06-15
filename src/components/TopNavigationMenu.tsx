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
  WifiOff,
  Menu,
  X
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export function TopNavigationMenu() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // Mobile Navigation Component
  const MobileMenu = () => (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>
      
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[#1a1a1a] border-b border-[#3d3d37] p-4 z-50 shadow-xl max-w-full overflow-hidden">
          <div className="space-y-3 max-w-full">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#759900] to-[#6a8700] hover:from-[#6a8700] hover:to-[#5a7300] text-white h-8 text-xs font-semibold justify-start w-full"
              >
                <Zap className="w-3 h-3 mr-2 flex-shrink-0" />
                Bullet 1+0
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#dc7633] to-[#c0632b] hover:from-[#c0632b] hover:to-[#a0521f] text-white h-8 text-xs font-semibold justify-start w-full"
              >
                <Timer className="w-3 h-3 mr-2 flex-shrink-0" />
                Blitz 3+2
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-[#3498db] to-[#2e86c1] hover:from-[#2e86c1] hover:to-[#2874a6] text-white h-8 text-xs font-semibold justify-start w-full"
              >
                <Clock className="w-3 h-3 mr-2 flex-shrink-0" />
                Rapid 10+0
              </Button>
            </div>
            
            <div className="relative max-w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4a4a46] flex-shrink-0" />
              <Input
                placeholder="Search..."
                className="w-full h-9 pl-10 pr-4 bg-[#2c2c28] border-[#4a4a46] text-[#b8b8b8] placeholder:text-[#4a4a46] focus:border-[#759900] text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-14 bg-gradient-to-r from-[#1a1a1a] via-[#161512] to-[#1a1a1a] border-b border-[#3d3d37] flex items-center justify-between px-2 sm:px-4 lg:px-6 shadow-lg w-full max-w-full overflow-hidden">
      {/* Left side - Brand and Breadcrumb */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-shrink-0">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#759900] to-[#5a7300] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-sm sm:text-base leading-none truncate">MindMate</span>
            <span className="text-[#759900] text-xs font-medium hidden sm:block truncate">by JBLinx Studio</span>
          </div>
        </div>

        {/* Breadcrumb Navigation - Hidden on mobile and tablet */}
        <div className="hidden lg:flex items-center space-x-2 text-sm min-w-0 flex-shrink-0">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 flex-shrink-0">
              <div className="flex items-center space-x-1 text-[#b8b8b8] hover:text-white transition-colors cursor-pointer flex-shrink-0">
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {index < breadcrumb.length - 1 && (
                <ChevronRight className="w-3 h-3 text-[#4a4a46] flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center - Desktop Game Hub - Only on very large screens */}
      <div className="hidden 2xl:flex items-center space-x-3 px-3 flex-shrink-0">
        {/* Quick Play Buttons */}
        <div className="flex items-center space-x-2 bg-[#2c2c28] rounded-xl px-3 py-2 shadow-inner flex-shrink-0">
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#759900] to-[#6a8700] hover:from-[#6a8700] hover:to-[#5a7300] text-white h-7 px-2 text-xs font-semibold shadow-md flex-shrink-0"
          >
            <Zap className="w-3 h-3 mr-1 flex-shrink-0" />
            Bullet
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#dc7633] to-[#c0632b] hover:from-[#c0632b] hover:to-[#a0521f] text-white h-7 px-2 text-xs font-semibold shadow-md flex-shrink-0"
          >
            <Timer className="w-3 h-3 mr-1 flex-shrink-0" />
            Blitz
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#3498db] to-[#2e86c1] hover:from-[#2e86c1] hover:to-[#2874a6] text-white h-7 px-2 text-xs font-semibold shadow-md flex-shrink-0"
          >
            <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
            Rapid
          </Button>
        </div>

        {/* Game Mode Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-[#4a4a46] bg-[#2c2c28] text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] h-8 px-3 font-medium shadow-md flex-shrink-0"
            >
              <Gamepad2 className="w-4 h-4 mr-2 flex-shrink-0" />
              More
              <ChevronDown className="w-3 h-3 ml-2 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-48 z-50 shadow-xl" align="center">
            <DropdownMenuLabel className="text-[#759900] font-semibold flex items-center">
              <Flame className="w-4 h-4 mr-2 flex-shrink-0" />
              Game Modes
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Users className="mr-3 h-4 w-4 text-[#759900] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Play vs Friend</div>
                <div className="text-xs text-[#888]">Challenge a specific player</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Brain className="mr-3 h-4 w-4 text-[#3498db] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">vs Computer</div>
                <div className="text-xs text-[#888]">Practice against AI</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Target className="mr-3 h-4 w-4 text-[#dc7633] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Puzzle Battle</div>
                <div className="text-xs text-[#888]">Competitive puzzle solving</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Swords className="mr-3 h-4 w-4 text-[#e74c3c] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Arena Tournament</div>
                <div className="text-xs text-[#888]">Join live tournaments</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Trophy className="mr-3 h-4 w-4 text-[#f39c12] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Swiss Tournament</div>
                <div className="text-xs text-[#888]">Fair pairing system</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Desktop Search */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4a4a46] flex-shrink-0" />
            <Input
              placeholder="Search players, games..."
              className="w-36 h-8 pl-10 pr-4 bg-[#2c2c28] border-[#4a4a46] text-[#b8b8b8] placeholder:text-[#4a4a46] focus:border-[#759900] text-sm shadow-inner"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0 flex-shrink-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Right side - User Info and Controls */}
      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
        {/* Mobile Menu */}
        <MobileMenu />

        {/* Quick Settings - Hidden on small screens */}
        <div className="hidden sm:flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0 flex-shrink-0"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0 flex-shrink-0"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>

        {/* User Performance - Responsive */}
        <div className="hidden lg:flex items-center space-x-2 text-sm bg-[#2c2c28] rounded-lg px-2 py-2 flex-shrink-0">
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-[#759900] flex-shrink-0" />
            <div className="text-[#b8b8b8] hidden xl:block">Rating:</div>
            <div className="text-[#759900] font-bold">1847</div>
          </div>
          <div className="w-px h-4 bg-[#4a4a46] hidden xl:block"></div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Star className="w-3 h-3 text-[#f39c12] flex-shrink-0" />
            <span className="text-[#f39c12] font-semibold text-xs">+24</span>
          </div>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0 relative flex-shrink-0"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#dc7633] rounded-full text-white text-xs flex items-center justify-center font-bold">3</div>
        </Button>

        {/* Connection Status - Hidden on mobile */}
        <div className="hidden sm:flex items-center space-x-1 flex-shrink-0">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-[#759900]" />
          ) : (
            <WifiOff className="w-4 h-4 text-[#e74c3c]" />
          )}
        </div>

        {/* Language - Hidden on small screens */}
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:flex text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0 flex-shrink-0"
        >
          <Globe className="w-4 h-4" />
        </Button>

        {/* User Menu - Responsive */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-2 sm:px-3 border border-[#4a4a46] flex-shrink-0 min-w-0"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#759900] to-[#5a7300] rounded-full flex items-center justify-center text-white font-bold text-xs mr-1 sm:mr-2 flex-shrink-0">
                CP
              </div>
              <span className="font-medium hidden sm:block truncate">ChessPlayer</span>
              <ChevronDown className="w-3 h-3 ml-1 sm:ml-2 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-56 sm:min-w-64 z-50 shadow-xl" align="end">
            <DropdownMenuLabel className="text-[#b8b8b8]">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#759900] to-[#5a7300] rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                  CP
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm sm:text-base truncate">ChessPlayer</div>
                  <div className="text-sm text-[#759900] flex items-center">
                    <div className="w-2 h-2 bg-[#759900] rounded-full mr-2 flex-shrink-0"></div>
                    Online
                  </div>
                  <div className="text-xs text-[#888] mt-1">Member since 2024</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <User className="mr-3 h-4 w-4 text-[#759900] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Profile</div>
                <div className="text-xs text-[#888]">View and edit profile</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Trophy className="mr-3 h-4 w-4 text-[#f39c12] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">My Games</div>
                <div className="text-xs text-[#888]">Game history & analysis</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Target className="mr-3 h-4 w-4 text-[#dc7633] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">My Puzzles</div>
                <div className="text-xs text-[#888]">Puzzle performance</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Calendar className="mr-3 h-4 w-4 text-[#3498db] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Tournaments</div>
                <div className="text-xs text-[#888]">Upcoming & past events</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Crown className="mr-3 h-4 w-4 text-[#f39c12] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Premium</div>
                <div className="text-xs text-[#888]">Unlock advanced features</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <Settings className="mr-3 h-4 w-4 text-[#b8b8b8] flex-shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">Settings</div>
                <div className="text-xs text-[#888]">Preferences & privacy</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37] cursor-pointer">
              <LogOut className="mr-3 h-4 w-4 text-[#e74c3c] flex-shrink-0" />
              <div className="min-w-0">
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
