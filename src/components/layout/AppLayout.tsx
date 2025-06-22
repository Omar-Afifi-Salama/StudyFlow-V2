
"use client";

import React from 'react';
import Header from './Header';
import SessionLog from '@/components/sessions/SessionLog';
import { usePathname } from 'next/navigation';
import { useSessions } from '@/contexts/SessionContext';
import SleepCountdownSidebar from './SleepCountdownSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { isLoaded } = useSessions(); 

  const showSidebarSessionLogOnPages = ['/stats']; 
  const showSidebarLog = showSidebarSessionLogOnPages.includes(pathname);
  const showSleepSidebar = pathname === '/';

  if (!isLoaded) { 
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }


  return (
    <>
      <Header />
      <div className="flex flex-1 container max-w-screen-2xl mx-auto py-6 px-4 md:px-6">
        {showSleepSidebar && (
           <aside className="w-64 mr-6 hidden lg:block sticky top-20 h-[calc(100vh-10rem)]">
              <SleepCountdownSidebar />
           </aside>
        )}
        <main className="flex-1">
          {children}
        </main>
        {showSidebarLog && (
          <aside className="w-80 ml-6 hidden lg:block sticky top-20 h-[calc(100vh-10rem)]">
            <SessionLog />
          </aside>
        )}
      </div>
    </>
  );
}
