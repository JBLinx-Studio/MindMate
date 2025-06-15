
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  HelpCircle,
  Globe,
  Bell,
  Search,
  Crown,
  Trophy,
  Target,
  Users,
  BookOpen,
  Tv,
  BarChart3
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function TopNavigationMenu() {
  return (
    <div className="h-12 bg-[#161512] border-b border-[#3d3d37] flex items-center justify-between px-4">
      {/* Left side - Navigation Menu */}
      <NavigationMenu>
        <NavigationMenuList className="space-x-1">
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3 text-sm">
              Play
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-[#2c2c28] border-[#4a4a46] p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Quick Play</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Create a game</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/lobby" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Lobby</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/tournaments" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Tournaments</NavigationMenuLink></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Competitive</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/arena" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Arena tournaments</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/swiss" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Swiss tournaments</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/simuls" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Simultaneous</NavigationMenuLink></li>
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3 text-sm">
              Puzzles
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-[#2c2c28] border-[#4a4a46] p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Training</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/puzzles" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Tactical puzzles</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/puzzle-themes" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Puzzle themes</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/puzzle-dashboard" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Dashboard</NavigationMenuLink></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Challenges</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/puzzle-storm" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Puzzle Storm</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/puzzle-racer" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Puzzle Racer</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/puzzle-streak" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Puzzle Streak</NavigationMenuLink></li>
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3 text-sm">
              Learn
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-[#2c2c28] border-[#4a4a46] p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Basics</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/learn/basics" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Chess basics</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/practice" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Practice</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/coordinates" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Coordinates</NavigationMenuLink></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Advanced</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/study" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Studies</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/coaches" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Coaches</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/insights" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Insights</NavigationMenuLink></li>
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3 text-sm">
              Watch
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-[#2c2c28] border-[#4a4a46] p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Live</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/tv" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Lichess TV</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/games" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Current games</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/streamers" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Streamers</NavigationMenuLink></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Content</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/broadcasts" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Broadcasts</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/video" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Video library</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/blog" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Blog</NavigationMenuLink></li>
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3 text-sm">
              Community
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-[#2c2c28] border-[#4a4a46] p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Social</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/players" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Players</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/teams" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Teams</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/forum" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Forum</NavigationMenuLink></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Features</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/qa" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Q&A</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/mobile" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Mobile app</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/contact" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Contact</NavigationMenuLink></li>
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 px-3 text-sm">
              Tools
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-[#2c2c28] border-[#4a4a46] p-4 w-80">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">Analysis</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/analysis" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Analysis board</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/opening-explorer" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Opening explorer</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/board-editor" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Board editor</NavigationMenuLink></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Import</h4>
                  <ul className="space-y-1">
                    <li><NavigationMenuLink href="/import" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Import game</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/search" className="text-[#b8b8b8] hover:text-white text-sm block py-1">Advanced search</NavigationMenuLink></li>
                    <li><NavigationMenuLink href="/api" className="text-[#b8b8b8] hover:text-white text-sm block py-1">API docs</NavigationMenuLink></li>
                  </ul>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right side - User actions and utilities */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0"
        >
          <Search className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="sm"
          className="text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] h-8 w-8 p-0"
        >
          <Bell className="w-4 h-4" />
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
              Guest
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#2c2c28] border-[#4a4a46] text-white min-w-48" align="end">
            <DropdownMenuLabel className="text-[#b8b8b8]">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]">
              <Trophy className="mr-2 h-4 w-4" />
              My Games
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]">
              <Target className="mr-2 h-4 w-4" />
              My Puzzles
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]">
              <BookOpen className="mr-2 h-4 w-4" />
              My Studies
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#4a4a46]" />
            <DropdownMenuItem className="text-[#b8b8b8] hover:text-white hover:bg-[#3d3d37]">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
