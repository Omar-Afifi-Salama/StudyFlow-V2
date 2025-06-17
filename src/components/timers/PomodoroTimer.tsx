"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, SkipForward, ListPlus, Settings } from 'lucide-react';
import TimerDisplay from './TimerDisplay';
import { useSessions } from '@/contexts/SessionContext';
import { usePomodoro, type PomodoroMode } from '@/hooks/use-pomodoro';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

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
  
  const { addSession } = useSessions();
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

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Pomodoro Timer</CardTitle>
        <CardDescription className="text-lg text-primary">{modeTextMap[mode]}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-8 py-8">
        <TimerDisplay seconds={timeLeft} />
        <div className="flex space-x-3">
          {!isRunning ? (
            <Button onClick={startTimer} size="lg" aria-label={`Start ${mode} session`}>
              <Play className="mr-2 h-5 w-5" /> Start
            </Button>
          ) : (
            <Button onClick={pauseTimer} size="lg" variant="outline" aria-label={`Pause ${mode} session`}>
              <Pause className="mr-2 h-5 w-5" /> Pause
            </Button>
          )}
          <Button onClick={() => { resetTimer(); if(isRunning) pauseTimer(); }} size="lg" variant="outline" aria-label={`Reset ${mode} session`}>
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
          <Button onClick={() => switchMode()} size="lg" variant="outline" aria-label="Skip to next session">
            <SkipForward className="mr-2 h-5 w-5" /> Skip
          </Button>
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
                <Input id="workDuration" type="number" value={localSettings.workDuration} onChange={(e) => setLocalSettings(s => ({...s, workDuration: parseInt(e.target.value,10) || 0}))} />
                <Label htmlFor="shortBreakDuration">Short Break (min)</Label>
                <Input id="shortBreakDuration" type="number" value={localSettings.shortBreakDuration} onChange={(e) => setLocalSettings(s => ({...s, shortBreakDuration: parseInt(e.target.value,10) || 0}))} />
                <Label htmlFor="longBreakDuration">Long Break (min)</Label>
                <Input id="longBreakDuration" type="number" value={localSettings.longBreakDuration} onChange={(e) => setLocalSettings(s => ({...s, longBreakDuration: parseInt(e.target.value,10) || 0}))} />
                <Label htmlFor="cyclesPerLongBreak">Cycles for Long Break</Label>
                <Input id="cyclesPerLongBreak" type="number" value={localSettings.cyclesPerLongBreak} onChange={(e) => setLocalSettings(s => ({...s, cyclesPerLongBreak: parseInt(e.target.value,10) || 0}))} />
              </div>
              <Button onClick={handleSettingsSave}>Save Settings</Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={handleLogSession} disabled={currentSessionElapsedTime === 0 || isRunning} size="lg" variant="secondary" aria-label="Log current pomodoro progress">
          <ListPlus className="mr-2 h-5 w-5" /> Log Progress
        </Button>
      </CardFooter>
    </Card>
  );
}
