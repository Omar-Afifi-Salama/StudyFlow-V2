"use client";

import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ListPlus, HelpCircle, DollarSign } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import { useSessions, XP_PER_MINUTE_FOCUS, CASH_PER_5_MINUTES_FOCUS, LEVEL_THRESHOLDS } from '@/contexts/SessionContext';
import { useStopwatch } from '@/hooks/use-stopwatch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function Stopwatch() {
  const { timeElapsed, isRunning, start, stop, reset } = useStopwatch();
  const { addSession, userProfile } = useSessions();

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

  const currentLevelXpStart = LEVEL_THRESHOLDS[userProfile.level - 1] ?? 0;
  const nextLevelXpTarget = userProfile.level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[userProfile.level] : userProfile.xp;
  const xpIntoCurrentLevel = userProfile.xp - currentLevelXpStart;
  const xpForNextLevel = nextLevelXpTarget - currentLevelXpStart;
  const xpProgressPercent = xpForNextLevel > 0 ? Math.min(100, Math.floor((xpIntoCurrentLevel / xpForNextLevel) * 100)) : (userProfile.level >= LEVEL_THRESHOLDS.length ? 100 : 0);
  const streakBonusPercent = (Math.min(userProfile.currentStreak * 0.01, 0.20) * 100).toFixed(0);

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
            <div className="w-1/4"> {/* Placeholder for balance */} </div>
            <CardTitle className="text-2xl font-headline">Stopwatch</CardTitle>
            <div className="w-1/4 flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                             <p>Stopwatch: +{XP_PER_MINUTE_FOCUS} XP/min, +${CASH_PER_5_MINUTES_FOCUS}/5min</p>
                            {userProfile.currentStreak > 0 && <p className="text-green-500">Current Streak Bonus: +{streakBonusPercent}% XP/Cash</p>}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
        <CardDescription className="text-lg text-primary">Level {userProfile.level} ({xpProgressPercent}%)</CardDescription>
        <Progress value={xpProgressPercent} className="w-3/4 mx-auto h-2 mt-1" />
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
