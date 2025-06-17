
"use client";

import React from 'react';
import Header from './Header';
import SessionLog from '@/components/sessions/SessionLog';
import { usePathname } from 'next/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  // Only show sidebar session log on stats page now. Timer page has it inline.
  const showSidebarSessionLogOnPages = ['/stats']; 
  const showSidebarLog = showSidebarSessionLogOnPages.includes(pathname);

  return (
    <>
      <Header />
      <div className="flex flex-1 container max-w-screen-2xl mx-auto py-6">
        <main className="flex-1">
          {children}
        </main>
        {showSidebarLog && (
          <aside className="w-80 ml-6 hidden lg:block sticky top-20 h-[calc(100vh-10rem)]"> {/* Adjusted height for footer */}
            <SessionLog />
          </aside>
        )}
      </div>
    </>
  );
}
