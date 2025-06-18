
"use client";
import { useSessions } from '@/contexts/SessionContext';
import CountdownPageClient from '@/components/countdown/CountdownPageClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Timer } from 'lucide-react';

export default function CountdownRoute() {
  const { isFeatureUnlocked } = useSessions();
  if (!isFeatureUnlocked('countdown')) {
     return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Timer className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-4">Countdown Timer Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full">
      <CountdownPageClient />
    </div>
  );
}
