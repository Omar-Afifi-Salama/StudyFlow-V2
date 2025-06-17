
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, ListPlus, Settings, HelpCircle, DollarSign } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import { useSessions, XP_PER_MINUTE_FOCUS, CASH_PER_5_MINUTES_FOCUS, LEVEL_THRESHOLDS } from '@/contexts/SessionContext';
import { usePomodoro, type PomodoroMode } from '@/hooks/use-pomodoro';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHotkeys } from 'react-hotkeys-hook';

export default function PomodoroTimer() {
  const {
    timeLeft,
    mode,
    isRunning,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setSettings,
    sessionStartTimeRef,
    currentSessionElapsedTime,
  } = usePomodoro();
  
  const { addSession, userProfile } = useSessions();
  const { toast } = useToast();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
        pauseTimer(); 
        
        const sessionType = mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break';
        const duration = (mode === 'work' ? settings.workDuration : mode === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration) * 60;
        
        addSession({
            type: sessionType,
            startTime: sessionStartTimeRef.current,
            durationInSeconds: duration,
        });

        toast({
            title: `${mode.charAt(0).toUpperCase() + mode.slice(1)} ended!`,
            description: mode === 'work' ? "Time for a break!" : "Time to get back to work!",
        });
        
        switchMode(); 
    }
  }, [timeLeft, isRunning, mode, settings, pauseTimer, addSession, switchMode, toast, sessionStartTimeRef]);


  const handleLogSession = () => {
    if (currentSessionElapsedTime > 0) {
      const sessionType = mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break';
      addSession({
        type: sessionType,
        startTime: sessionStartTimeRef.current,
        durationInSeconds: currentSessionElapsedTime,
      });
      resetTimer(); 
    }
  };

  const handleSettingsSave = () => {
    if (localSettings.workDuration < 1 || localSettings.shortBreakDuration < 1 || localSettings.longBreakDuration < 1 || localSettings.cyclesPerLongBreak < 1) {
        toast({ title: "Invalid Settings", description: "Durations and cycles must be at least 1.", variant: "destructive" });
        return;
    }
    setSettings(localSettings);
    toast({ title: "Settings Saved", description: "Pomodoro timer updated."});
  };

  const modeTextMap: Record<PomodoroMode, string> = {
    work: "Focus Time",
    shortBreak: "Short Break",
    longBreak: "Long Break"
  };

  const currentLevelXpStart = LEVEL_THRESHOLDS[userProfile.level - 1] ?? 0;
  const nextLevelXpTarget = userProfile.level < LEVEL_THRESHOLDS.length ? LEVEL_THRESHOLDS[userProfile.level] : userProfile.xp;
  const xpIntoCurrentLevel = userProfile.xp - currentLevelXpStart;
  const xpForNextLevel = nextLevelXpTarget - currentLevelXpStart;
  const xpProgressPercent = xpForNextLevel > 0 ? Math.min(100, Math.floor((xpIntoCurrentLevel / xpForNextLevel) * 100)) : (userProfile.level >= LEVEL_THRESHOLDS.length ? 100 : 0);
  const streakBonusPercent = (Math.min(userProfile.currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS) * 100).toFixed(0);

  // Hotkeys
  useHotkeys('p', () => { if (isRunning) pauseTimer(); else startTimer(); }, { preventDefault: true }, [isRunning, startTimer, pauseTimer]);
  useHotkeys('r', () => { resetTimer(); if(isRunning) pauseTimer(); }, { preventDefault: true }, [resetTimer, isRunning, pauseTimer]);
  useHotkeys('s', () => switchMode(), { preventDefault: true }, [switchMode]); // 's' for skip
  useHotkeys('l', handleLogSession, { preventDefault: true, enabled: currentSessionElapsedTime > 0 && !isRunning }, [handleLogSession, currentSessionElapsedTime, isRunning]);


  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-2">
            <div className="w-1/4"> {/* Placeholder for balance */} </div>
            <CardTitle className="text-2xl font-headline">{modeTextMap[mode]}</CardTitle>
            <div className="w-1/4 flex justify-end">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Focus: +{XP_PER_MINUTE_FOCUS} XP/min, +${CASH_PER_5_MINUTES_FOCUS}/5min</p>
                            <p>Breaks do not grant rewards.</p>
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
        <TimerDisplay seconds={timeLeft} />
        <div className="flex space-x-3">
          {!isRunning ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={startTimer} size="lg" aria-label={`Start ${mode} session`}>
                    <Play className="mr-2 h-5 w-5" /> Start
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Start/Pause Timer <span className="text-xs p-1 bg-muted rounded-sm ml-1">P</span></p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={pauseTimer} size="lg" variant="outline" aria-label={`Pause ${mode} session`}>
                    <Pause className="mr-2 h-5 w-5" /> Pause
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Start/Pause Timer <span className="text-xs p-1 bg-muted rounded-sm ml-1">P</span></p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => { resetTimer(); if(isRunning) pauseTimer(); }} size="lg" variant="outline" aria-label={`Reset ${mode} session`}>
                  <RotateCcw className="mr-2 h-5 w-5" /> Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Reset Timer <span className="text-xs p-1 bg-muted rounded-sm ml-1">R</span></p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => switchMode()} size="lg" variant="outline" aria-label="Skip to next session">
                  <SkipForward className="mr-2 h-5 w-5" /> Skip
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Skip Session <span className="text-xs p-1 bg-muted rounded-sm ml-1">S</span></p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Pomodoro settings">
              <Settings className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none font-headline">Pomodoro Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Customize your timer intervals.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workDuration">Work (min)</Label>
                <Input id="workDuration" type="number" min="1" value={localSettings.workDuration} onChange={(e) => setLocalSettings(s => ({...s, workDuration: parseInt(e.target.value,10) || 1}))} />
                <Label htmlFor="shortBreakDuration">Short Break (min)</Label>
                <Input id="shortBreakDuration" type="number" min="1" value={localSettings.shortBreakDuration} onChange={(e) => setLocalSettings(s => ({...s, shortBreakDuration: parseInt(e.target.value,10) || 1}))} />
                <Label htmlFor="longBreakDuration">Long Break (min)</Label>
                <Input id="longBreakDuration" type="number" min="1" value={localSettings.longBreakDuration} onChange={(e) => setLocalSettings(s => ({...s, longBreakDuration: parseInt(e.target.value,10) || 1}))} />
                <Label htmlFor="cyclesPerLongBreak">Cycles for Long Break</Label>
                <Input id="cyclesPerLongBreak" type="number" min="1" value={localSettings.cyclesPerLongBreak} onChange={(e) => setLocalSettings(s => ({...s, cyclesPerLongBreak: parseInt(e.target.value,10) || 1}))} />
              </div>
              <Button onClick={handleSettingsSave}>Save Settings</Button>
            </div>
          </PopoverContent>
        </Popover>
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button onClick={handleLogSession} disabled={currentSessionElapsedTime === 0 || isRunning} size="lg" variant="secondary" aria-label="Log current pomodoro progress">
                        <ListPlus className="mr-2 h-5 w-5" /> Log Progress
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>Log Progress <span className="text-xs p-1 bg-muted rounded-sm ml-1">L</span></p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
