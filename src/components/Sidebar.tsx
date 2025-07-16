
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Anchor,
  Calendar,
  Ship,
  BarChart3,
  Settings,
  Waves,
  MapPin,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: BarChart3,
    children: []
  },
  { 
    name: 'Operações', 
    icon: Ship,
    children: [
      { name: 'Agendamentos', href: '/schedule', icon: Calendar },
      { name: 'Embarcações', href: '/vessels', icon: Ship },
      { name: 'Cais', href: '/dock', icon: MapPin }
    ]
  },
  { 
    name: 'Ambiente', 
    icon: Waves,
    children: [
      { name: 'Maré & Clima', href: '/weather', icon: Waves }
    ]
  },
  { 
    name: 'Sistema', 
    icon: Settings,
    children: [
      { name: 'Configurações', href: '/settings', icon: Settings }
    ]
  }
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <div className="w-64 bg-card border-r border-border shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Anchor className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Atraca+</h1>
            <p className="text-xs text-muted-foreground">Gestão Portuária</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          if (item.children && item.children.length > 0) {
            const isExpanded = expandedGroups.includes(item.name);
            const hasActiveChild = item.children.some(child => location.pathname === child.href);
            
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    hasActiveChild 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded ? "rotate-180" : ""
                  )} />
                </button>
                
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => {
                      const isActive = location.pathname === child.href;
                      return (
                        <NavLink
                          key={child.name}
                          to={child.href}
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <child.icon className="h-4 w-4" />
                          <span>{child.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          }
        })}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-accent">
          <div className="p-1 bg-primary rounded-full">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name || 'Operador Portuário'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'admin@atraca.com'}
            </p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
