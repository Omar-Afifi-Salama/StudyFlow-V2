
"use client";
import { useSessions } from '@/contexts/SessionContext';
import NotepadPage from '@/components/notepad/NotepadPage';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotepadRoute() {
  const { isFeatureUnlocked } = useSessions();
  if (!isFeatureUnlocked('notepad')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Notepad Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to organize your thoughts and tasks.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full">
      <NotepadPage />
    </div>
  );
}
