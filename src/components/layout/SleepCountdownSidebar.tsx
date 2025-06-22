
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Moon, Bed, Sun, Settings } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const convertTo24Hour = (hour: number, period: 'AM' | 'PM') => {
  if (period === 'PM' && hour !== 12) return hour + 12;
  if (period === 'AM' && hour === 12) return 0; // Midnight
  return hour;
};

const WakeSleepTimeSelector = ({ time, period, onTimeChange, onPeriodChange, label }: {
  time: number, period: 'AM' | 'PM', onTimeChange: (hour: number) => void, onPeriodChange: (period: 'AM' | 'PM') => void, label: string
}) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor={`${label}-hour`} className="min-w-[70px]">{label} Hour:</Label>
      <Select value={time.toString()} onValueChange={(val) => onTimeChange(parseInt(val))}>
        <SelectTrigger id={`${label}-hour`} className="w-[80px] btn-animated">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hours.map(h => <SelectItem key={h} value={h.toString()}>{h}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={period} onValueChange={(val: 'AM' | 'PM') => onPeriodChange(val)}>
        <SelectTrigger id={`${label}-period`} className="w-[90px] btn-animated">
          <SelectValue placeholder="AM/PM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default function SleepCountdownSidebar() {
  const { userProfile, isLoaded, updateSleepWakeTimes } = useSessions();
  const [currentTime, setCurrentTime] = useState(new Date());

  const [localWakeUpHour, setLocalWakeUpHour] = useState(userProfile.wakeUpTime?.hour || 8);
  const [localWakeUpPeriod, setLocalWakeUpPeriod] = useState<'AM' | 'PM'>(userProfile.wakeUpTime?.period || 'AM');
  const [localSleepHour, setLocalSleepHour] = useState(userProfile.sleepTime?.hour || 10);
  const [localSleepPeriod, setLocalSleepPeriod] = useState<'AM' | 'PM'>(userProfile.sleepTime?.period || 'PM');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if(isLoaded){
        setLocalWakeUpHour(userProfile.wakeUpTime?.hour || 8);
        setLocalWakeUpPeriod(userProfile.wakeUpTime?.period || 'AM');
        setLocalSleepHour(userProfile.sleepTime?.hour || 10);
        setLocalSleepPeriod(userProfile.sleepTime?.period || 'PM');
    }
  }, [userProfile.wakeUpTime, userProfile.sleepTime, isLoaded]);

  const handleSaveSleepWakeTimes = () => {
    updateSleepWakeTimes(
      { hour: localWakeUpHour, period: localWakeUpPeriod },
      { hour: localSleepHour, period: localSleepPeriod }
    );
    setIsPopoverOpen(false);
  };


  const {
    timeUntilSleep,
    wakingDayProgress,
    isValid
  } = useMemo(() => {
    if (!userProfile.wakeUpTime || !userProfile.sleepTime) {
      return { timeUntilSleep: 0, wakingDayProgress: 0, isValid: false };
    }

    const wakeHour24 = convertTo24Hour(userProfile.wakeUpTime.hour, userProfile.wakeUpTime.period);
    const sleepHour24 = convertTo24Hour(userProfile.sleepTime.hour, userProfile.sleepTime.period);

    const wakeTimeToday = new Date(currentTime);
    wakeTimeToday.setHours(wakeHour24, 0, 0, 0);

    let sleepTimeToday = new Date(currentTime);
    sleepTimeToday.setHours(sleepHour24, 0, 0, 0);
    
    if (sleepHour24 < wakeHour24) {
      if (currentTime.getHours() < sleepHour24) {
         wakeTimeToday.setDate(wakeTimeToday.getDate() - 1);
      } else {
        sleepTimeToday.setDate(sleepTimeToday.getDate() + 1);
      }
    } else {
       if (currentTime > sleepTimeToday) {
         sleepTimeToday.setDate(sleepTimeToday.getDate() + 1);
         wakeTimeToday.setDate(wakeTimeToday.getDate() + 1);
       }
    }
    
    const timeUntilSleepInSeconds = Math.max(0, (sleepTimeToday.getTime() - currentTime.getTime()) / 1000);
    
    const totalWakingSeconds = Math.abs(sleepTimeToday.getTime() - wakeTimeToday.getTime()) / 1000;
    const secondsSinceWake = Math.max(0, (currentTime.getTime() - wakeTimeToday.getTime()) / 1000);
    const progressPercent = totalWakingSeconds > 0 ? (secondsSinceWake / totalWakingSeconds) * 100 : 0;
    
    return {
      timeUntilSleep: timeUntilSleepInSeconds,
      wakingDayProgress: Math.min(100, progressPercent),
      isValid: true,
    };
  }, [userProfile.wakeUpTime, userProfile.sleepTime, currentTime]);

  if (!isLoaded) {
    return null;
  }
  
  if (!isValid) {
    return (
       <Card className="flex flex-col shadow-lg card-animated">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bed className="h-6 w-6 text-muted-foreground" />
              <CardTitle>Sleep Cycle</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center py-6">
            <p className="text-muted-foreground mb-4">Set your wake-up and sleep times to activate this countdown.</p>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button><Settings className="mr-2 h-4 w-4"/>Set Times</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Sleep/Wake Preferences</h4>
                    <p className="text-sm text-muted-foreground">
                      Set your typical schedule.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <WakeSleepTimeSelector label="Wake Up" time={localWakeUpHour} period={localWakeUpPeriod} onTimeChange={setLocalWakeUpHour} onPeriodChange={setLocalWakeUpPeriod} />
                    <WakeSleepTimeSelector label="Sleep" time={localSleepHour} period={localSleepPeriod} onTimeChange={setLocalSleepHour} onPeriodChange={setLocalSleepPeriod} />
                  </div>
                  <Button onClick={handleSaveSleepWakeTimes}>Save Preferences</Button>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
       </Card>
    )
  }

  return (
    <Card className="flex flex-col shadow-lg card-animated">
      <CardHeader>
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Time Until Sleep</CardTitle>
            </div>
             <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon"><Settings className="h-5 w-5"/></Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                 <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Sleep/Wake Preferences</h4>
                    <p className="text-sm text-muted-foreground">
                      Set your typical schedule.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <WakeSleepTimeSelector label="Wake Up" time={localWakeUpHour} period={localWakeUpPeriod} onTimeChange={setLocalWakeUpHour} onPeriodChange={setLocalWakeUpPeriod} />
                    <WakeSleepTimeSelector label="Sleep" time={localSleepHour} period={localSleepPeriod} onTimeChange={setLocalSleepHour} onPeriodChange={setLocalSleepPeriod} />
                  </div>
                  <Button onClick={handleSaveSleepWakeTimes}>Save Preferences</Button>
                </div>
              </PopoverContent>
            </Popover>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
        <p className="font-mono text-5xl font-bold text-center text-foreground">
          {formatTime(timeUntilSleep, true)}
        </p>
        <div className="w-full space-y-2">
            <CardDescription className="text-center">Waking Day Progress</CardDescription>
             <div className="flex items-center w-full justify-center space-x-2">
                <Sun className="h-4 w-4 text-yellow-500"/>
                <Progress value={wakingDayProgress} className="w-3/4" />
                <Bed className="h-4 w-4 text-indigo-400"/>
            </div>
            <p className="text-xs text-muted-foreground text-center">{wakingDayProgress.toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
