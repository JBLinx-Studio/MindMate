
import React from 'react';
import { Home, Gamepad2, Trophy, User, Settings, BookOpen, TrendingUp, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navigationItems = [
  { title: 'Play', url: '/', icon: Gamepad2 },
  { title: 'Puzzles', url: '/analysis', icon: BookOpen },
  { title: 'Learn', url: '/tournaments', icon: TrendingUp },
  { title: 'Watch', url: '/profile', icon: Users },
  { title: 'Community', url: '/settings', icon: Trophy },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-48 border-r border-[#3d3d37] bg-[#161512]">
      <SidebarContent className="bg-[#161512]">
        {/* Logo */}
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">lichess</div>
            <div className="text-[#b8b8b8]">♞</div>
          </div>
          <div className="text-xs text-[#b8b8b8] mt-1">free online chess</div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                          isActive 
                            ? 'bg-[#3d3d37] text-white border-r-2 border-[#759900]' 
                            : 'text-[#b8b8b8] hover:text-white hover:bg-[#2c2c28]'
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
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
