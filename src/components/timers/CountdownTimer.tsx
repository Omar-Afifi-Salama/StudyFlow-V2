
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Play, Pause, RotateCcw, BellRing, Settings, ListPlus, HelpCircle, Zap, DollarSign, ChevronsRight, Hourglass } from 'lucide-react';
import TimerDisplay from '@/components/timers/TimerDisplay';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useSessions, XP_PER_MINUTE_FOCUS, CASH_PER_5_MINUTES_FOCUS, STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS, ACTUAL_LEVEL_THRESHOLDS } from '@/contexts/SessionContext';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatTime } from '@/lib/utils';
import { useHotkeys } from 'react-hotkeys-hook';

export default function CountdownTimer() {
    const { 
        userProfile, 
        countdownState, 
        startTimer, 
        pauseTimer, 
        resetTimer, 
        setCountdownDuration, 
        logSession,
        getSkillBoost,
        activeTimer
    } = useSessions();
    
    const { isRunning, timeLeftOnPause, initialDuration } = countdownState;

    const [durationInput, setDurationInput] = useState({ hours: 0, minutes: 5, seconds: 0 });
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [playNotificationSound, setPlayNotificationSound] = useState(true);

    const { toast } = useToast();
    
    useHotkeys('p', () => { if (activeTimer === 'countdown') { if (isRunning) pauseTimer('countdown'); else startTimer('countdown'); } }, { preventDefault: true }, [isRunning, startTimer, pauseTimer, activeTimer]);
    useHotkeys('r', () => { if (activeTimer === 'countdown') resetTimer('countdown'); }, { preventDefault: true, enabled: initialDuration > 0 }, [resetTimer, initialDuration, activeTimer]);
    useHotkeys('l', () => { if (activeTimer === 'countdown') logSession('countdown'); }, { preventDefault: true, enabled: !isRunning && initialDuration > 0 }, [logSession, isRunning, initialDuration, activeTimer]);


    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isRunning && countdownState.sessionStartTime) {
            interval = setInterval(() => {
                const elapsed = Date.now() - countdownState.sessionStartTime;
                const newTimeLeft = Math.max(0, Math.floor((timeLeftOnPause - elapsed) / 1000));
                setTimeLeft(newTimeLeft);

                if (newTimeLeft <= 0 && !isFinished) {
                    setIsFinished(true);
                    pauseTimer('countdown');
                    toast({ title: "Countdown Finished!", description: "Your timer has ended." });
                    if (playNotificationSound) {
                        new Audio('/sounds/notification.mp3').play().catch(e => console.error("Error playing sound:", e));
                    }
                }
            }, 1000);
        } else {
            setTimeLeft(Math.floor(timeLeftOnPause / 1000));
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, countdownState.sessionStartTime, timeLeftOnPause, pauseTimer, playNotificationSound, toast, isFinished]);


    const handleInputChange = (unit: 'hours' | 'minutes' | 'seconds', value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
            setDurationInput(prev => ({ ...prev, [unit]: Math.min(unit === 'hours' ? 99 : 59, numValue) }));
        } else if (value === '') {
            setDurationInput(prev => ({ ...prev, [unit]: 0 }));
        }
    };

    const handleSetTimer = () => {
        const totalSeconds = (durationInput.hours * 3600) + (durationInput.minutes * 60) + (durationInput.seconds);
        if (totalSeconds <= 0) {
            toast({ title: "Invalid Duration", description: "Please set a duration greater than 0.", variant: "destructive"});
            return;
        }
        setCountdownDuration(totalSeconds * 1000);
        setIsFinished(false);
    };

    const handleResetAndSetNew = () => {
        resetTimer('countdown');
        setCountdownDuration(0);
        setIsFinished(false);
        setDurationInput({ hours: 0, minutes: 5, seconds: 0 });
    }
    
    const timeStudiedSeconds = useMemo(() => {
        if (isRunning && countdownState.sessionStartTime) {
            const elapsed = Date.now() - countdownState.sessionStartTime;
            return (initialDuration - (timeLeftOnPause - elapsed)) / 1000;
        }
        return (initialDuration - timeLeftOnPause) / 1000;
    }, [isRunning, countdownState.sessionStartTime, initialDuration, timeLeftOnPause]);

    const currentLevelXpStart = ACTUAL_LEVEL_THRESHOLDS[userProfile.level - 1] ?? 0;
    const nextLevelXpTarget = userProfile.level < ACTUAL_LEVEL_THRESHOLDS.length ? ACTUAL_LEVEL_THRESHOLDS[userProfile.level] : userProfile.xp;
    const xpIntoCurrentLevel = userProfile.xp - currentLevelXpStart;
    const xpToNextLevelRaw = nextLevelXpTarget - userProfile.xp;
    const xpProgressPercent = nextLevelXpTarget > currentLevelXpStart ? Math.min(100, Math.floor((xpIntoCurrentLevel / (nextLevelXpTarget - currentLevelXpStart)) * 100)) : 100;
    const streakBonusPercentVal = Math.min(userProfile.currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
    const skillXpBoost = getSkillBoost('xp');
    const skillCashBoost = getSkillBoost('cash');
    const effectiveXpPerMinute = XP_PER_MINUTE_FOCUS * (1 + streakBonusPercentVal + skillXpBoost);
    const timeToLevelUpSeconds = xpToNextLevelRaw > 0 && effectiveXpPerMinute > 0 ? (xpToNextLevelRaw / effectiveXpPerMinute) * 60 : 0;


    const hasTimerBeenSet = initialDuration > 0;
    const canStart = activeTimer === null || activeTimer === 'countdown';

    return (
        <Card className="shadow-lg card-animated">
             <CardHeader className="text-center">
                <div className="flex justify-between items-center mb-2">
                    <div className="w-1/4"></div>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2"><Hourglass/>Countdown</CardTitle>
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
                                    {skillXpBoost > 0 && <p className="text-primary mt-1"><ChevronsRight className="inline h-4 w-4 mr-1"/>Skill Bonus: +{(skillXpBoost * 100).toFixed(0)}% XP</p>}
                                    {skillCashBoost > 0 && <p className="text-primary mt-1"><ChevronsRight className="inline h-4 w-4 mr-1"/>Skill Bonus: +{(skillCashBoost * 100).toFixed(0)}% Cash</p>}
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
            <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
                {!hasTimerBeenSet ? (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/30 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-center">Set Duration</h3>
                        <div className="flex items-end justify-center space-x-2">
                            <div><Label htmlFor="hours" className="text-xs text-muted-foreground">Hours</Label><Input id="hours" type="number" value={durationInput.hours} onChange={(e) => handleInputChange('hours', e.target.value)} min="0" max="99" className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/></div>
                            <span className="text-2xl font-bold pb-1">:</span>
                            <div><Label htmlFor="minutes" className="text-xs text-muted-foreground">Minutes</Label><Input id="minutes" type="number" value={durationInput.minutes} onChange={(e) => handleInputChange('minutes', e.target.value)} min="0" max="59" className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/></div>
                            <span className="text-2xl font-bold pb-1">:</span>
                            <div><Label htmlFor="seconds" className="text-xs text-muted-foreground">Seconds</Label><Input id="seconds" type="number" value={durationInput.seconds} onChange={(e) => handleInputChange('seconds', e.target.value)} min="0" max="59" className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/></div>
                        </div>
                        <Button onClick={handleSetTimer} className="w-full btn-animated">Set Timer</Button>
                    </div>
                ) : (
                    <>
                        <TimerDisplay seconds={timeLeft} forceHours={initialDuration >= 3600000} className="text-primary"/>
                        {isFinished && <p className="text-2xl font-semibold text-primary animate-pulse"><BellRing className="inline h-7 w-7 mr-2"/>Time's Up!</p>}
                        <div className="flex space-x-3">
                            {!isRunning ? (
                                <Button onClick={() => startTimer('countdown')} size="lg" disabled={timeLeft <= 0 || !canStart} className="btn-animated">
                                <Play className="mr-2 h-5 w-5" /> {isFinished ? 'Start New' : 'Start'}
                                </Button>
                            ) : (
                                <Button onClick={() => pauseTimer('countdown')} size="lg" variant="outline" className="btn-animated">
                                <Pause className="mr-2 h-5 w-5" /> Pause
                                </Button>
                            )}
                            <Button onClick={() => resetTimer('countdown')} size="lg" variant="outline" disabled={!hasTimerBeenSet} className="btn-animated">
                                <RotateCcw className="mr-2 h-5 w-5" /> Reset
                            </Button>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <Popover>
                    <PopoverTrigger asChild><Button variant="ghost" size="icon" className="btn-animated"><Settings className="h-5 w-5"/></Button></PopoverTrigger>
                    <PopoverContent className="w-60">
                        <div className="space-y-2">
                        <h4 className="font-medium leading-none">Settings</h4>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="notification-sound">Notification Sound</Label>
                            <Switch id="notification-sound" checked={playNotificationSound} onCheckedChange={setPlayNotificationSound} />
                        </div>
                        <p className="text-xs text-muted-foreground">Play a sound when the timer ends.</p>
                        </div>
                    </PopoverContent>
                </Popover>
                <div className="flex gap-2">
                    {timeStudiedSeconds > 0 && (
                        <Button onClick={() => logSession('countdown')} disabled={isRunning} variant="secondary" className="btn-animated">
                            <ListPlus className="mr-2 h-4 w-4" /> Log Progress
                        </Button>
                    )}
                    <Button onClick={handleResetAndSetNew} variant="ghost" className="text-muted-foreground hover:text-destructive btn-animated">Clear & Set New</Button>
                </div>
            </CardFooter>
        </Card>
    );
}
