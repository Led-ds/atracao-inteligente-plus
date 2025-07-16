
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
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Anchor className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Atraca+</h1>
              <p className="text-sm text-muted-foreground">Gestão Portuária</p>
            </div>
          </div>
        </div>

        {/* Navigation with Accordion */}
        <nav className="flex-1 p-4">
          <Accordion 
            type="multiple" 
            className="space-y-2"
          >
            {navigation.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <AccordionItem 
                    key={item.name} 
                    value={item.name.toLowerCase()}
                    className="border-none"
                  >
                    <AccordionTrigger className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => {
                          const isActive = location.pathname === child.href;
                          return (
                            <NavLink
                              key={child.name}
                              to={child.href}
                              className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
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
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  </div>
                );
              }
            })}
          </Accordion>
        </nav>

        {/* User Area */}
        <div className="p-4 border-t border-border space-y-2">
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
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent w-full transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            v1.0.0 • MVP
          </div>
        </div>
      </div>
    </div>
  );
}
