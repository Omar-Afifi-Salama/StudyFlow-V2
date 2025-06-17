"use client";

import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ListPlus } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import { useSessions } from '@/contexts/SessionContext';
import { useStopwatch } from '@/hooks/use-stopwatch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Stopwatch() {
  const { timeElapsed, isRunning, start, stop, reset } = useStopwatch();
  const { addSession } = useSessions();

  const handleLogSession = () => {
    if (timeElapsed > 0) {
      addSession({
        type: 'Stopwatch',
        startTime: Date.now() - timeElapsed * 1000,
        durationInSeconds: timeElapsed,
      });
      reset();
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-center">Stopwatch</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8 py-8">
        <TimerDisplay seconds={timeElapsed} forceHours={timeElapsed >= 3600} />
        <div className="flex space-x-3">
          {!isRunning ? (
            <Button onClick={start} size="lg" aria-label="Start stopwatch">
              <Play className="mr-2 h-5 w-5" /> Start
            </Button>
          ) : (
            <Button onClick={stop} size="lg" variant="outline" aria-label="Pause stopwatch">
              <Pause className="mr-2 h-5 w-5" /> Pause
            </Button>
          )}
          <Button onClick={reset} size="lg" variant="outline" disabled={timeElapsed === 0 && !isRunning} aria-label="Reset stopwatch">
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleLogSession} disabled={timeElapsed === 0} size="lg" variant="secondary" aria-label="Log session">
          <ListPlus className="mr-2 h-5 w-5" /> Log Session
        </Button>
      </CardFooter>
    </Card>
  );
}
