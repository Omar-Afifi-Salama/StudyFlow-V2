
"use client";

import { useSessions } from '@/contexts/SessionContext';
import SessionItem from './SessionItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ListX } from 'lucide-react';
import ManualSessionDialog from './ManualSessionDialog';

export default function SessionLog() {
  const { sessions, clearSessions } = useSessions();

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-headline">Session Log</CardTitle>
            <CardDescription>Your recorded study sessions.</CardDescription>
          </div>
          <ManualSessionDialog />
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        {sessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-6">
            <ListX className="h-16 w-16 mb-4" />
            <p className="text-center">No sessions logged yet.</p>
            <p className="text-center text-sm">Start a timer or add one manually!</p>
          </div>
        ) : (
          <ScrollArea className="h-full px-6 pb-2">
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
