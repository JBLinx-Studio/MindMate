
import React from 'react';
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  User, 
  Settings, 
  BookOpen, 
  TrendingUp, 
  Users,
  Puzzle,
  Play,
  Sword,
  Tv,
  Library,
  Clock,
  Zap,
  Target,
  Award,
  Globe,
  MessageCircle,
  Calendar,
  BarChart3,
  Crown,
  Star
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const playItems = [
  { title: 'Quick pairing', url: '/', icon: Zap, description: 'Find an opponent' },
  { title: 'Lobby', url: '/lobby', icon: Users, description: 'Browse games' },
  { title: 'Tournaments', url: '/tournaments', icon: Trophy, description: 'Compete' },
  { title: 'Simuls', url: '/simuls', icon: Crown, description: 'Many vs one' },
  { title: 'Swiss', url: '/swiss', icon: Award, description: 'Round robin' },
];

const puzzleItems = [
  { title: 'Puzzles', url: '/puzzles', icon: Target, description: 'Tactical training' },
  { title: 'Puzzle Themes', url: '/puzzle-themes', icon: BookOpen, description: 'By category' },
  { title: 'Puzzle Dashboard', url: '/puzzle-dashboard', icon: BarChart3, description: 'Your progress' },
  { title: 'Puzzle Storm', url: '/puzzle-storm', icon: Sword, description: 'Solve fast' },
  { title: 'Puzzle Racer', url: '/puzzle-racer', icon: Play, description: 'Race others' },
];

const learnItems = [
  { title: 'Chess basics', url: '/learn/basics', icon: BookOpen, description: 'Learn the game' },
  { title: 'Practice', url: '/practice', icon: Target, description: 'Improve skills' },
  { title: 'Coordinates', url: '/coordinates', icon: Globe, description: 'Board training' },
  { title: 'Study', url: '/study', icon: Library, description: 'Shared analysis' },
  { title: 'Coaches', url: '/coaches', icon: Star, description: 'Find a teacher' },
];

const watchItems = [
  { title: 'Lichess TV', url: '/tv', icon: Tv, description: 'Current games' },
  { title: 'Current games', url: '/games', icon: Play, description: 'Live play' },
  { title: 'Streamers', url: '/streamers', icon: Users, description: 'Live broadcasts' },
  { title: 'Broadcasts', url: '/broadcasts', icon: MessageCircle, description: 'Events' },
  { title: 'Video library', url: '/video', icon: Library, description: 'Learn videos' },
];

const communityItems = [
  { title: 'Players', url: '/players', icon: Users, description: 'Community' },
  { title: 'Teams', url: '/teams', icon: Crown, description: 'Join groups' },
  { title: 'Forum', url: '/forum', icon: MessageCircle, description: 'Discussions' },
  { title: 'Blog', url: '/blog', icon: BookOpen, description: 'News & updates' },
];

const toolsItems = [
  { title: 'Analysis board', url: '/analysis', icon: BarChart3, description: 'Analyze positions' },
  { title: 'Opening explorer', url: '/opening-explorer', icon: TrendingUp, description: 'Opening database' },
  { title: 'Board editor', url: '/editor', icon: Settings, description: 'Set positions' },
  { title: 'Import game', url: '/import', icon: BookOpen, description: 'Load PGN' },
  { title: 'Advanced search', url: '/search', icon: Target, description: 'Find games' },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64 border-r border-[#3d3d37] bg-[#161512]">
      <SidebarContent className="bg-[#161512]">
        {/* Logo */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">lichess</div>
            <div className="text-[#b8b8b8]">♞</div>
          </div>
          <div className="text-xs text-[#b8b8b8] mt-1">free online chess</div>
        </div>

        {/* Play Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b8b8b8] text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Play
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-2 text-sm transition-colors group ${
                          isActive 
                            ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900]' 
                            : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28]'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-60 group-hover:opacity-80">{item.description}</div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Puzzles Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b8b8b8] text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Puzzles
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {puzzleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-2 text-sm transition-colors group ${
                          isActive 
                            ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900]' 
                            : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28]'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-60 group-hover:opacity-80">{item.description}</div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Learn Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b8b8b8] text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Learn
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {learnItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-2 text-sm transition-colors group ${
                          isActive 
                            ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900]' 
                            : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28]'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-60 group-hover:opacity-80">{item.description}</div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Watch Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b8b8b8] text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Watch
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {watchItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-2 text-sm transition-colors group ${
                          isActive 
                            ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900]' 
                            : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28]'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-60 group-hover:opacity-80">{item.description}</div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Community Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b8b8b8] text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Community
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-2 text-sm transition-colors group ${
                          isActive 
                            ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900]' 
                            : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28]'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-60 group-hover:opacity-80">{item.description}</div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b8b8b8] text-xs font-semibold uppercase tracking-wider px-4 py-2">
            Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-2 text-sm transition-colors group ${
                          isActive 
                            ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900]' 
                            : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28]'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs opacity-60 group-hover:opacity-80">{item.description}</div>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto p-4 border-t border-[#3d3d37]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#4a4a46] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">Guest</div>
              <div className="text-[#b8b8b8] text-xs">Sign in to play</div>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
