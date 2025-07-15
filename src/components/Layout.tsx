
import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background wave-pattern">
      <Sidebar />
      
      <div className="ml-64">
        <main className="min-h-screen p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
