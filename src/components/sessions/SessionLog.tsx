
"use client";

import { useSessions } from '@/contexts/SessionContext';
import SessionItem from './SessionItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ListX } from 'lucide-react';

export default function SessionLog() {
  const { sessions, clearSessions } = useSessions();

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Session Log</CardTitle>
        <CardDescription>Your recorded study sessions.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0"> {/* Padding removed from CardContent */}
        {sessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
            <ListX className="h-16 w-16 mb-4" />
            <p className="text-center">No sessions logged yet.</p>
            <p className="text-center text-sm">Start a timer and log your studies!</p>
          </div>
        ) : (
          // ScrollArea now has padding and a fixed height
          <ScrollArea className="h-[280px] px-6 pb-2"> {/* Adjusted height for approx 3-4 items, added padding */}
            {sessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </ScrollArea>
        )}
      </CardContent>
      {sessions.length > 0 && (
        <CardFooter className="border-t pt-4">
          <Button variant="destructive" onClick={clearSessions} className="w-full btn-animated" aria-label="Clear all sessions">
            <Trash2 className="mr-2 h-4 w-4" /> Clear Log
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

