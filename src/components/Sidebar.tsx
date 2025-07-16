
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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-lg">
            <Anchor className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Atraca+</h1>
            <p className="text-xs text-muted-foreground">Gestão Portuária</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mx-8">
          <Accordion 
            type="multiple" 
            className="flex items-center space-x-4"
          >
            {navigation.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <AccordionItem 
                    key={item.name} 
                    value={item.name.toLowerCase()}
                    className="border-none relative"
                  >
                    <AccordionTrigger className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-48">
                      <div className="p-2 space-y-1">
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
                    </AccordionContent>
                  </AccordionItem>
                );
              } else {
                const isActive = location.pathname === item.href;
                return (
                  <div key={item.name}>
                    <NavLink
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
                  </div>
                );
              }
            })}
          </Accordion>
        </nav>

        {/* User Area */}
        <div className="flex items-center space-x-4">
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
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
