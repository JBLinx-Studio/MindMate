
import React, { useState } from 'react';
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
  Star,
  ChevronDown,
  ChevronRight
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

interface CollapsibleSectionProps {
  title: string;
  items: typeof playItems;
  defaultOpen?: boolean;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, items, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <SidebarGroupLabel className="text-[#b8b8b8] text-xs font-semibold uppercase tracking-wider px-4 py-3 flex items-center justify-between hover:text-white transition-colors group cursor-pointer">
          <span>{title}</span>
          {isOpen ? (
            <ChevronDown className="w-3 h-3 transition-transform" />
          ) : (
            <ChevronRight className="w-3 h-3 transition-transform" />
          )}
        </SidebarGroupLabel>
      </CollapsibleTrigger>
      <CollapsibleContent className="transition-all duration-200 ease-in-out overflow-hidden">
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to={item.url} 
                    end
                    className={({ isActive }) => 
                      `flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 group ${
                        isActive 
                          ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900] shadow-sm' 
                          : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28] hover:translate-x-1'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium transition-colors">{item.title}</div>
                      <div className="text-xs opacity-60 group-hover:opacity-80 transition-opacity">{item.description}</div>
                    </div>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function AppSidebar() {
  return (
    <Sidebar className="w-64 border-r border-[#3d3d37] bg-[#161512] shadow-xl">
      <SidebarContent className="bg-[#161512]">
        {/* Logo */}
        <div className="p-4 border-b border-[#3d3d37]">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">MindMate</div>
            <div className="text-[#759900] text-2xl">♞</div>
          </div>
          <div className="text-xs text-[#b8b8b8] mt-1">master your chess skills</div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-0">
          <div className="space-y-1">
            {/* Play Section */}
            <SidebarGroup>
              <CollapsibleSection title="Play" items={playItems} defaultOpen={true} />
            </SidebarGroup>

            {/* Puzzles Section */}
            <SidebarGroup>
              <CollapsibleSection title="Puzzles" items={puzzleItems} defaultOpen={true} />
            </SidebarGroup>

            {/* Learn Section */}
            <SidebarGroup>
              <CollapsibleSection title="Learn" items={learnItems} defaultOpen={false} />
            </SidebarGroup>

            {/* Watch Section */}
            <SidebarGroup>
              <CollapsibleSection title="Watch" items={watchItems} defaultOpen={false} />
            </SidebarGroup>

            {/* Community Section */}
            <SidebarGroup>
              <CollapsibleSection title="Community" items={communityItems} defaultOpen={false} />
            </SidebarGroup>

            {/* Tools Section */}
            <SidebarGroup>
              <CollapsibleSection title="Tools" items={toolsItems} defaultOpen={false} />
            </SidebarGroup>
          </div>
        </ScrollArea>

        {/* User Section */}
        <div className="mt-auto p-4 border-t border-[#3d3d37] bg-[#1a1a16]">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#2c2c28] transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-[#759900] to-[#6a8700] rounded-full flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white text-sm font-medium">Guest</div>
              <div className="text-[#b8b8b8] text-xs">Sign in to play</div>
            </div>
            <Settings className="w-4 h-4 text-[#b8b8b8] hover:text-white transition-colors" />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
