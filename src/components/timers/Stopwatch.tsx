
"use client";

import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, ListPlus, HelpCircle, DollarSign, Zap, ChevronsRight } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import { useSessions, XP_PER_MINUTE_FOCUS, CASH_PER_5_MINUTES_FOCUS, LEVEL_THRESHOLDS, STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS } from '@/contexts/SessionContext';
import { useStopwatch } from '@/hooks/use-stopwatch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import { formatTime } from '@/lib/utils';

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
  const xpToNextLevelRaw = nextLevelXpTarget - userProfile.xp;
  
  const xpProgressPercent = nextLevelXpTarget > currentLevelXpStart ? Math.min(100, Math.floor((xpIntoCurrentLevel / (nextLevelXpTarget - currentLevelXpStart)) * 100)) : (userProfile.level >= LEVEL_THRESHOLDS.length ? 100 : 0);
  
  const streakBonusPercentVal = Math.min(userProfile.currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
  const effectiveXpPerMinute = XP_PER_MINUTE_FOCUS * (1 + streakBonusPercentVal);
  const timeToLevelUpSeconds = xpToNextLevelRaw > 0 && effectiveXpPerMinute > 0 ? (xpToNextLevelRaw / effectiveXpPerMinute) * 60 : 0;

  useHotkeys('p', () => { if (isRunning) stop(); else start(); }, { preventDefault: true }, [isRunning, start, stop]);
  useHotkeys('r', reset, { preventDefault: true, enabled: timeElapsed > 0 || isRunning }, [reset, timeElapsed, isRunning]);
  useHotkeys('l', handleLogSession, { preventDefault: true, enabled: timeElapsed > 0 && !isRunning }, [handleLogSession, timeElapsed, isRunning]);


  return (
    <Card className="shadow-lg card-animated">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
            <div className="w-1/4">  </div> {/* Spacer */}
            <CardTitle className="text-2xl font-headline">Stopwatch</CardTitle>
            <div className="w-1/4 flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 btn-animated">
                                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-sm">
                            <p className="font-semibold mb-1">Earning Rates:</p>
                            <p><Zap className="inline h-4 w-4 mr-1 text-yellow-400"/>{XP_PER_MINUTE_FOCUS} XP per minute.</p>
                            <p><DollarSign className="inline h-4 w-4 mr-1 text-green-500"/>${CASH_PER_5_MINUTES_FOCUS.toLocaleString()} per 5 minutes.</p>
                            {userProfile.currentStreak > 0 && <p className="text-green-600 mt-1"><ChevronsRight className="inline h-4 w-4 mr-1"/>Current Streak Bonus: +{(streakBonusPercentVal * 100).toFixed(0)}% XP/Cash!</p>}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
        <div className="text-sm text-muted-foreground">
            Level {userProfile.level}: {xpIntoCurrentLevel.toLocaleString()} / {(nextLevelXpTarget - currentLevelXpStart > 0 ? (nextLevelXpTarget - currentLevelXpStart) : userProfile.xp - currentLevelXpStart).toLocaleString()} XP
        </div>
        <Progress value={xpProgressPercent} className="w-3/4 mx-auto h-2 mt-1" />
         {xpToNextLevelRaw > 0 && timeToLevelUpSeconds > 0 && (
            <p className="text-xs text-primary mt-1">
                Approx. {formatTime(timeToLevelUpSeconds, true)} to next level
            </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8 py-8">
        <TimerDisplay seconds={timeElapsed} forceHours={timeElapsed >= 3600} />
        <div className="flex space-x-3">
          {!isRunning ? (
             <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={start} size="lg" aria-label="Start stopwatch" className="btn-animated">
                            <Play className="mr-2 h-5 w-5" /> Start
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Start/Pause Stopwatch <span className="text-xs p-1 bg-muted rounded-sm ml-1">P</span></p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button onClick={stop} size="lg" variant="outline" aria-label="Pause stopwatch" className="btn-animated">
                            <Pause className="mr-2 h-5 w-5" /> Pause
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Start/Pause Stopwatch <span className="text-xs p-1 bg-muted rounded-sm ml-1">P</span></p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={reset} size="lg" variant="outline" disabled={timeElapsed === 0 && !isRunning} aria-label="Reset stopwatch" className="btn-animated">
                        <RotateCcw className="mr-2 h-5 w-5" /> Reset
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Reset Stopwatch <span className="text-xs p-1 bg-muted rounded-sm ml-1">R</span></p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleLogSession} disabled={timeElapsed === 0} size="lg" variant="secondary" aria-label="Log session" className="btn-animated">
                        <ListPlus className="mr-2 h-5 w-5" /> Log Session
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Log Session <span className="text-xs p-1 bg-muted rounded-sm ml-1">L</span></p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}

    
```