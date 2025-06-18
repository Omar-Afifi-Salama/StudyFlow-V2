
"use client";
import { useSessions } from '@/contexts/SessionContext';
import CapitalistPage from '@/components/capitalist/CapitalistPage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function CapitalistRoute() {
  const { isFeatureUnlocked } = useSessions();

  if (!isFeatureUnlocked('capitalist')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-4">Capitalist Corner Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to invest your earnings.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full">
      <CapitalistPage />
    </div>
  );
}
