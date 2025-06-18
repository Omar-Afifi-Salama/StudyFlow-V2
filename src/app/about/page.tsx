
"use client";

import { useSessions } from '@/contexts/SessionContext'; // Import for feature check
import AboutPageContent from '@/components/about/AboutPage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutRoute() {
  const { isFeatureUnlocked } = useSessions();

  if (!isFeatureUnlocked('about')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">About Page Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to learn more about StudyFlow.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <AboutPageContent />
    </div>
  );
}
