
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background wave-pattern flex">
      <Sidebar />
      
      <main className="flex-1 p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
