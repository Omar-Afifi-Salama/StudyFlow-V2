
"use client";
import { useSessions } from '@/contexts/SessionContext';
import ChallengesPage from '@/components/challenges/ChallengesPage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CalendarCheck } from 'lucide-react';

export default function ChallengesRoute() {
  const { isFeatureUnlocked } = useSessions();
  if (!isFeatureUnlocked('challenges')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <CalendarCheck className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-4">Daily Challenges Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to earn bonus XP and Cash.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full">
      <ChallengesPage />
    </div>
  );
}
