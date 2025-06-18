
"use client";
import { useSessions } from '@/contexts/SessionContext';
import AchievementsPageClient from '@/components/achievements/AchievementsPageClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AchievementsRoute() {
  const { isFeatureUnlocked } = useSessions();

  if (!isFeatureUnlocked('achievements')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Achievements Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to view your accomplishments.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AchievementsPageClient />
    </div>
  );
}
