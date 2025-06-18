
"use client"; // Required for using hooks like useSessions
import StatsDashboard from '@/components/stats/StatsDashboard';
import { useSessions } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StatsPage() {
  const { isFeatureUnlocked } = useSessions();

  if (!isFeatureUnlocked('stats')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Statistics Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to view your progress.
        </p>
         <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <StatsDashboard />
    </div>
  );
}
