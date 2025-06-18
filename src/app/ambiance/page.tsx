
"use client";
import { useSessions } from '@/contexts/SessionContext';
import AmbiancePage from '@/components/ambiance/AmbiancePage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wind } from 'lucide-react';

export default function AmbianceRoute() {
  const { isFeatureUnlocked } = useSessions();

  if (!isFeatureUnlocked('ambiance')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Wind className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-4">Ambiance Mixer Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to create your perfect study soundscape.
        </p>
         <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full">
      <AmbiancePage />
    </div>
  );
}
