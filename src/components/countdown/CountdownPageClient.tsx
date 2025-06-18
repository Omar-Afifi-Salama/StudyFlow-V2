
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Play, Pause, RotateCcw, BellRing, Settings } from 'lucide-react';
import TimerDisplay from '@/components/timers/TimerDisplay';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';

export default function CountdownPageClient() {
  const [durationInput, setDurationInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [playNotificationSound, setPlayNotificationSound] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Preload a simple notification sound if one is available
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/notification.mp3'); // You'll need to add this sound file
      audioRef.current.load();
    }
  }, []);

  const handleInputChange = (unit: 'hours' | 'minutes' | 'seconds', value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setDurationInput(prev => ({ ...prev, [unit]: Math.min(unit === 'hours' ? 99 : 59, numValue) }));
    } else if (value === '') {
      setDurationInput(prev => ({ ...prev, [unit]: 0 }));
    }
  };

  const setTimer = () => {
    const totalSeconds = (durationInput.hours * 3600) + (durationInput.minutes * 60) + durationInput.seconds;
    if (totalSeconds <= 0) {
        toast({ title: "Invalid Duration", description: "Please set a duration greater than 0.", variant: "destructive"});
        return;
    }
    setTimeLeft(totalSeconds);
    setIsRunning(false);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    if (timeLeft <= 0) {
        toast({ title: "Set Duration First", description: "Please set a duration before starting.", variant: "destructive"});
        return;
    }
    setIsRunning(true);
    setIsFinished(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          setIsRunning(false);
          setIsFinished(true);
          toast({ title: "Countdown Finished!", description: "Your timer has ended." });
          if (playNotificationSound && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Error playing sound:", e));
          }
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification("Countdown Finished!", { body: "Your timer has ended." });
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setTimer(); // Resets to the last set duration
  };

  const clearTimer = () => {
    pauseTimer();
    setTimeLeft(0);
    setIsFinished(false);
    setDurationInput({ hours: 0, minutes: 5, seconds: 0 });
  }

  useEffect(() => {
    return () => { // Cleanup on unmount
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <Card className="shadow-lg w-full max-w-lg mx-auto card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Timer className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">Countdown Timer</CardTitle>
            <CardDescription>Set a duration and count it down. Simple & effective.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isRunning && !isFinished && timeLeft === 0 && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">Set Duration</h3>
            <div className="flex items-end space-x-2">
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input id="hours" type="number" value={durationInput.hours} onChange={(e) => handleInputChange('hours', e.target.value)} min="0" max="99" className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
              </div>
              <span className="text-2xl font-bold pb-1">:</span>
              <div>
                <Label htmlFor="minutes">Minutes</Label>
                <Input id="minutes" type="number" value={durationInput.minutes} onChange={(e) => handleInputChange('minutes', e.target.value)} min="0" max="59" className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
              </div>
              <span className="text-2xl font-bold pb-1">:</span>
              <div>
                <Label htmlFor="seconds">Seconds</Label>
                <Input id="seconds" type="number" value={durationInput.seconds} onChange={(e) => handleInputChange('seconds', e.target.value)} min="0" max="59" className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
              </div>
            </div>
            <Button onClick={setTimer} className="w-full btn-animated">Set Timer</Button>
          </div>
        )}

        {(timeLeft > 0 || isRunning || isFinished) && (
          <div className="flex flex-col items-center space-y-4">
            <TimerDisplay seconds={timeLeft} forceHours={durationInput.hours > 0 || timeLeft >= 3600} />
            {isFinished && <p className="text-2xl font-semibold text-primary animate-pulse"><BellRing className="inline h-7 w-7 mr-2"/>Time's Up!</p>}
            <div className="flex space-x-3">
              {!isRunning ? (
                <Button onClick={startTimer} size="lg" disabled={timeLeft === 0 && !isFinished} className="btn-animated">
                  <Play className="mr-2 h-5 w-5" /> {isFinished ? 'Start New' : 'Start'}
                </Button>
              ) : (
                <Button onClick={pauseTimer} size="lg" variant="outline" className="btn-animated">
                  <Pause className="mr-2 h-5 w-5" /> Pause
                </Button>
              )}
              <Button onClick={resetTimer} size="lg" variant="outline" disabled={timeLeft === 0 && !isRunning && !isFinished} className="btn-animated">
                <RotateCcw className="mr-2 h-5 w-5" /> Reset
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="btn-animated"><Settings className="h-5 w-5"/></Button>
            </PopoverTrigger>
            <PopoverContent className="w-60">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Settings</h4>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="notification-sound">Notification Sound</Label>
                        <Switch id="notification-sound" checked={playNotificationSound} onCheckedChange={setPlayNotificationSound} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Play a sound when the timer ends. (Requires <code className="font-mono text-xs bg-muted p-0.5 rounded-sm">public/sounds/notification.mp3</code>)
                    </p>
                </div>
            </PopoverContent>
        </Popover>
        <Button onClick={clearTimer} variant="ghost" className="text-muted-foreground hover:text-destructive btn-animated">Clear & Set New</Button>
      </CardFooter>
    </Card>
  );
}
