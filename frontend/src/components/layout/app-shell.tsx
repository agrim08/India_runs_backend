'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Responsive Navbar */}
      <Navbar />

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Desktop Sidebar - only show if NOT the landing page */}
        {!isLandingPage && <Sidebar />}

        {/* Scrollable Main Content Area */}
        <main className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${isLandingPage ? 'p-0' : 'p-6 md:p-8'}`}>
          <div className={`${isLandingPage ? 'w-full' : 'mx-auto max-w-7xl'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
