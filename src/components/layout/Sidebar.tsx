
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Users,
  FolderKanban,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  collapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center py-3 px-4 rounded-lg transition-colors',
          collapsed ? 'justify-center px-3' : 'justify-start',
          isActive
            ? 'bg-buzzer-primary text-white'
            : 'text-buzzer-secondary hover:bg-gray-100'
        )
      }
    >
      <Icon className={cn('h-5 w-5', collapsed ? 'mx-0' : 'mr-3')} />
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-white border-r border-gray-200 h-screen transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-bold text-buzzer-primary">Buzzer</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn('rounded-full p-1', collapsed && 'ml-auto mr-auto')}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        <SidebarItem icon={Home} label="Dashboard" to="/" collapsed={collapsed} />
        <SidebarItem icon={Users} label="Bot Management" to="/bots" collapsed={collapsed} />
        <SidebarItem icon={FolderKanban} label="Campaigns" to="/campaigns" collapsed={collapsed} />
        <SidebarItem icon={Settings} label="Settings" to="/settings" collapsed={collapsed} />
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            'w-full flex items-center py-2 px-4 rounded-lg text-buzzer-secondary hover:bg-gray-100',
            collapsed && 'justify-center px-0'
          )}
          onClick={logout}
        >
          <LogOut className={cn('h-5 w-5', collapsed ? 'mx-0' : 'mr-3')} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
