
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
  ChevronRight,
  Grid3X3,
  Type,
  Brain,
  Dice1
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
  { title: 'Game Hub', url: '/', icon: Home, description: 'Choose your game' },
  { title: 'Quick Chess', url: '/chess', icon: Crown, description: 'Instant chess match' },
  { title: 'Game Lobby', url: '/lobby', icon: Users, description: 'Browse all games' },
  { title: 'Tournaments', url: '/tournaments', icon: Trophy, description: 'Multi-game tournaments' },
  { title: 'Leaderboards', url: '/leaderboards', icon: Award, description: 'Top players' },
];

const gamesItems = [
  { title: 'Chess', url: '/chess', icon: Crown, description: 'Strategic board game' },
  { title: 'Checkers', url: '/checkers', icon: Grid3X3, description: 'Classic board game' },
  { title: 'Sudoku', url: '/sudoku', icon: Target, description: 'Number puzzles' },
  { title: 'Word Games', url: '/word-games', icon: Type, description: 'Crosswords & more' },
  { title: 'Card Games', url: '/card-games', icon: Dice1, description: 'Solitaire & more' },
  { title: 'Trivia', url: '/trivia', icon: Brain, description: 'Knowledge challenges' },
];

const puzzleItems = [
  { title: 'Daily Puzzles', url: '/puzzles', icon: Target, description: 'Mixed challenges' },
  { title: 'Chess Puzzles', url: '/chess-puzzles', icon: Crown, description: 'Tactical training' },
  { title: 'Logic Puzzles', url: '/logic-puzzles', icon: Brain, description: 'Mind benders' },
  { title: 'Speed Challenges', url: '/speed-challenges', icon: Zap, description: 'Fast puzzles' },
  { title: 'Puzzle Dashboard', url: '/puzzle-dashboard', icon: BarChart3, description: 'Your progress' },
];

const learnItems = [
  { title: 'Game Rules', url: '/learn/rules', icon: BookOpen, description: 'How to play' },
  { title: 'Strategy Guides', url: '/learn/strategy', icon: Target, description: 'Improve skills' },
  { title: 'Tutorials', url: '/tutorials', icon: Play, description: 'Interactive lessons' },
  { title: 'Practice Mode', url: '/practice', icon: Sword, description: 'Skill training' },
  { title: 'Coaches', url: '/coaches', icon: Star, description: 'Find teachers' },
];

const watchItems = [
  { title: 'Live Games', url: '/live', icon: Tv, description: 'Watch ongoing games' },
  { title: 'Game Replays', url: '/replays', icon: Play, description: 'Past games' },
  { title: 'Streamers', url: '/streamers', icon: Users, description: 'Live broadcasts' },
  { title: 'Tournaments', url: '/watch-tournaments', icon: Trophy, description: 'Live events' },
  { title: 'Video Library', url: '/video', icon: Library, description: 'Learn videos' },
];

const communityItems = [
  { title: 'Players', url: '/players', icon: Users, description: 'Find players' },
  { title: 'Teams & Clubs', url: '/teams', icon: Crown, description: 'Join groups' },
  { title: 'Forum', url: '/forum', icon: MessageCircle, description: 'Discussions' },
  { title: 'Events', url: '/events', icon: Calendar, description: 'Upcoming events' },
  { title: 'Blog', url: '/blog', icon: BookOpen, description: 'News & updates' },
];

const toolsItems = [
  { title: 'Game Analysis', url: '/analysis', icon: BarChart3, description: 'Analyze games' },
  { title: 'Opening Explorer', url: '/opening-explorer', icon: TrendingUp, description: 'Chess openings' },
  { title: 'Position Editor', url: '/editor', icon: Settings, description: 'Set positions' },
  { title: 'Import Games', url: '/import', icon: BookOpen, description: 'Load games' },
  { title: 'Statistics', url: '/stats', icon: BarChart3, description: 'Your performance' },
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
            <div className="text-[#759900] text-2xl">🎮</div>
          </div>
          <div className="text-xs text-[#b8b8b8] mt-1">master multiple games & puzzles</div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 px-0">
          <div className="space-y-1">
            {/* Play Section */}
            <SidebarGroup>
              <CollapsibleSection title="Play" items={playItems} defaultOpen={true} />
            </SidebarGroup>

            {/* Games Section */}
            <SidebarGroup>
              <CollapsibleSection title="Games" items={gamesItems} defaultOpen={false} />
            </SidebarGroup>

            {/* Puzzles Section */}
            <SidebarGroup>
              <CollapsibleSection title="Puzzles" items={puzzleItems} defaultOpen={false} />
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
              <div className="text-white text-sm font-medium">Guest Player</div>
              <div className="text-[#b8b8b8] text-xs">Sign in to save progress</div>
            </div>
            <Settings className="w-4 h-4 text-[#b8b8b8] hover:text-white transition-colors" />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
