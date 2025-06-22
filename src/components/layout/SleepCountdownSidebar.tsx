
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Moon, Bed, Sun } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Button } from '../ui/button';
import Link from 'next/link';

const convertTo24Hour = (hour: number, period: 'AM' | 'PM') => {
  if (period === 'PM' && hour !== 12) return hour + 12;
  if (period === 'AM' && hour === 12) return 0; // Midnight
  return hour;
};

export default function SleepCountdownSidebar() {
  const { userProfile, isLoaded } = useSessions();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    
    // If sleep time is on the next calendar day (e.g., wake at 8am, sleep at 1am)
    if (sleepHour24 < wakeHour24) {
      if (currentTime.getHours() < sleepHour24) {
        // We are on the same calendar day as sleep time, but it's "yesterday's" wake cycle
         wakeTimeToday.setDate(wakeTimeToday.getDate() - 1);
      } else {
        // We are past wake time, so sleep time is tomorrow
        sleepTimeToday.setDate(sleepTimeToday.getDate() + 1);
      }
    } else { // Normal same-day cycle
       if (currentTime > sleepTimeToday) { // If current time is past today's sleep time, advance both to next day
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
    // Optional: add a skeleton loader here
    return null;
  }
  
  if (!isValid) {
    return (
       <Card className="h-full flex flex-col shadow-lg card-animated">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Bed className="h-6 w-6 text-muted-foreground" />
              <CardTitle>Sleep Cycle</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center flex-grow">
            <p className="text-muted-foreground mb-4">Set your wake-up and sleep times in the Stats page to activate this countdown.</p>
            <Button asChild>
                <Link href="/stats">Go to Stats</Link>
            </Button>
          </CardContent>
       </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col shadow-lg card-animated">
      <CardHeader>
        <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2">
                <Moon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Time Until Sleep</CardTitle>
            </div>
            <Bed className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-grow space-y-4">
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
