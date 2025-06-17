
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatTime } from '@/lib/utils';
import { BarChartBig, Clock, Coffee, TrendingUp, ListChecks, Sigma, Timer as TimerIcon, CalendarDays, SunMedium, TargetIcon, Percent, CheckCircle, TrendingDown, HelpCircle, Activity } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip, Legend, Cell } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { StudySession, UserProfile } from '@/types';
import React, { useEffect, useState, useMemo } from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval, subDays, getDay, isSameDay, startOfMonth, endOfMonth, eachWeekOfInterval, parseISO } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent as ShadTooltipContent } from '@/components/ui/tooltip';


interface DailyStat {
  date: string; 
  originalDate: Date;
  totalTime: number; // in seconds
  pomodoros: number;
}

interface HeatmapDataPoint {
  date: string; // YYYY-MM-DD
  count: number; // total study time in minutes for that day
  level: number; // for color intensity
}


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


export default function StatsDashboard() {
  const { sessions, userProfile, updateSleepWakeTimes, isLoaded } = useSessions(); // Added isLoaded
  const [dailyData, setDailyData] = useState<DailyStat[]>([]);

  const [localWakeUpHour, setLocalWakeUpHour] = useState(userProfile.wakeUpTime?.hour || 8);
  const [localWakeUpPeriod, setLocalWakeUpPeriod] = useState<'AM' | 'PM'>(userProfile.wakeUpTime?.period || 'AM');
  const [localSleepHour, setLocalSleepHour] = useState(userProfile.sleepTime?.hour || 10);
  const [localSleepPeriod, setLocalSleepPeriod] = useState<'AM' | 'PM'>(userProfile.sleepTime?.period || 'PM');

  useEffect(() => {
    if(isLoaded){ // Ensure profile is loaded before setting local state
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
  };

  const { wakingHours, studyTargetHours, todayStudyTimeSeconds, studyTargetCompletionPercent } = useMemo(() => {
    if (!userProfile.wakeUpTime || !userProfile.sleepTime) return { wakingHours: 0, studyTargetHours: 0, todayStudyTimeSeconds: 0, studyTargetCompletionPercent: 0 };

    const convertTo24Hour = (hour: number, period: 'AM' | 'PM') => {
      if (period === 'PM' && hour !== 12) return hour + 12;
      if (period === 'AM' && hour === 12) return 0; // Midnight
      return hour;
    };

    const wakeHour24 = convertTo24Hour(userProfile.wakeUpTime.hour, userProfile.wakeUpTime.period);
    const sleepHour24 = convertTo24Hour(userProfile.sleepTime.hour, userProfile.sleepTime.period);
    
    let diffHours;
    if (sleepHour24 >= wakeHour24) {
      diffHours = sleepHour24 - wakeHour24;
    } else { // Sleep time is on the next day
      diffHours = (24 - wakeHour24) + sleepHour24;
    }
    const wh = diffHours > 0 ? diffHours : 0;
    const sth = wh * 0.6;

    const today = new Date();
    const tsts = sessions
      .filter(session => isSameDay(new Date(session.startTime), today))
      .reduce((acc, session) => acc + session.duration, 0);
    
    const stcp = sth > 0 ? Math.min(100, (tsts / (sth * 3600)) * 100) : 0;

    return { 
      wakingHours: wh, 
      studyTargetHours: sth,
      todayStudyTimeSeconds: tsts,
      studyTargetCompletionPercent: stcp
    };
  }, [userProfile.wakeUpTime, userProfile.sleepTime, sessions]);


  useEffect(() => {
    const calculateDailyData = () => {
      const today = new Date();
      today.setHours(0,0,0,0);

      const statsByDay: { [key: string]: { totalTime: number; pomodoros: number } } = {};

      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = format(d, 'yyyy-MM-dd'); // Use yyyy-MM-dd for reliable key
        statsByDay[dateKey] = { totalTime: 0, pomodoros: 0 };
      }
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.startTime);
        const dateKey = format(sessionDate, 'yyyy-MM-dd'); // Use yyyy-MM-dd for matching
        
        if (statsByDay[dateKey]) {
          statsByDay[dateKey].totalTime += session.duration;
          if (session.type === 'Pomodoro Focus' && session.isFullPomodoroCycle) { 
            statsByDay[dateKey].pomodoros += 1;
          }
        }
      });
      
      const formattedData = Object.entries(statsByDay).map(([dateKey, data]) => {
         const dateObj = parseISO(dateKey); // Parse YYYY-MM-DD string
         return {
          originalDate: dateObj,
          date: format(dateObj, 'MMM d'), // Format for display
          ...data,
        };
      }).sort((a,b) => a.originalDate.getTime() - b.originalDate.getTime());

      setDailyData(formattedData);
    };
    if (isLoaded) calculateDailyData(); // Run only after initial data load
  }, [sessions, isLoaded]);

  const heatmapData = useMemo(() => {
    if (!isLoaded) return [];
    const data: HeatmapDataPoint[] = [];
    const endDate = new Date();
    const startDate = subDays(endDate, 89); 
    const dateArray = eachDayOfInterval({ start: startDate, end: endDate });

    dateArray.forEach(day => {
      const formattedDay = format(day, 'yyyy-MM-dd');
      const studyTimeForDay = sessions
        .filter(session => format(new Date(session.startTime), 'yyyy-MM-dd') === formattedDay)
        .reduce((sum, session) => sum + session.duration, 0) / 60; 

      let level = 0;
      if (studyTimeForDay > 0 && studyTimeForDay < 30) level = 1;
      else if (studyTimeForDay >= 30 && studyTimeForDay < 60) level = 2;
      else if (studyTimeForDay >= 60 && studyTimeForDay < 120) level = 3;
      else if (studyTimeForDay >= 120 && studyTimeForDay < 180) level = 4;
      else if (studyTimeForDay >= 180) level = 5;

      data.push({ date: formattedDay, count: Math.round(studyTimeForDay), level });
    });
    return data;
  }, [sessions, isLoaded]);
  

  const calendarHeatmapWeeks = useMemo(() => {
    if (!heatmapData.length) return [];
    const weeks: Array<Array<HeatmapDataPoint | null>> = [];
    const today = new Date();
    const endDate = today;
    const startDate = startOfWeek(subDays(endDate, 12 * 7), { weekStartsOn: 0 }); // Roughly 12 weeks

    let currentDate = startDate;
    while(currentDate <= endDate) {
        const week: Array<HeatmapDataPoint | null> = [];
        for(let i = 0; i < 7; i++) {
            const dayKey = format(currentDate, 'yyyy-MM-dd');
            if(currentDate <= endDate) {
                 const dataPoint = heatmapData.find(p => p.date === dayKey);
                 week.push(dataPoint || { date: dayKey, count: 0, level: 0});
            } else {
                 week.push(null); // For days beyond today if week extends
            }
            currentDate = addDays(currentDate, 1);
        }
        weeks.push(week);
    }
    return weeks.slice(-13); // Ensure max 13 weeks displayed
  }, [heatmapData]);


  const totalStudyTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const totalSessions = sessions.length;
  const averageSessionLength = totalSessions > 0 ? totalStudyTime / totalSessions : 0;
  
  const allPomodoroFocusSessions = sessions.filter(s => s.type === 'Pomodoro Focus');
  const completedPomodoroFocusSessions = allPomodoroFocusSessions.filter(s => s.isFullPomodoroCycle).length;
  const pomodoroCompletionRate = allPomodoroFocusSessions.length > 0 ? (completedPomodoroFocusSessions / allPomodoroFocusSessions.length) * 100 : 0;

  const pomodoroBreakSessions = sessions.filter(s => s.type === 'Pomodoro Break').length;
  const stopwatchSessions = sessions.filter(s => s.type === 'Stopwatch').length;

  const totalStudyTimeThisMonth = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    return sessions
      .filter(s => new Date(s.startTime) >= monthStart && new Date(s.startTime) <= monthEnd)
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);


  const chartConfig = {
    totalTime: { label: "Study Time (min)", color: "hsl(var(--primary))" },
    pomodoros: { label: "Completed Pomodoros", color: "hsl(var(--accent))" },
  } satisfies ChartConfig;

  const StatCard = ({ title, value, icon, description, children, className }: { title: string, value?: string, icon?: React.ReactNode, description?: string, children?: React.ReactNode, className?: string }) => (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow card-animated", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value && <div className="text-2xl font-bold">{value}</div>}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {children}
      </CardContent>
    </Card>
  );

  if (!isLoaded) {
    return (
         <div className="flex flex-col items-center justify-center h-64">
            <Activity className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading statistics...</p>
        </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Study Statistics</h1>
      
      {totalSessions === 0 ? (
         <Card className="shadow-md card-animated">
            <CardHeader>
                <CardTitle className="text-xl">No Data Yet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground py-12">
                <BarChartBig className="h-24 w-24 mb-4" />
                <p className="text-lg">Log some study sessions to see your stats here!</p>
            </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Study Time" value={formatTime(totalStudyTime, true)} icon={<Sigma className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Total Study Time (This Month)" value={formatTime(totalStudyTimeThisMonth, true)} icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Total Sessions" value={totalSessions.toString()} icon={<ListChecks className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Avg. Session Length" value={formatTime(averageSessionLength)} icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Completed Pomodoros" value={completedPomodoroFocusSessions.toString()} icon={<Clock className="h-5 w-5 text-muted-foreground" />} description={`${pomodoroCompletionRate.toFixed(1)}% completion rate`} />
            <StatCard title="Pomodoro Breaks Taken" value={pomodoroBreakSessions.toString()} icon={<Coffee className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Stopwatch Sessions" value={stopwatchSessions.toString()} icon={<TimerIcon className="h-5 w-5 text-muted-foreground" />} />
          </div>

          <Card className="shadow-md card-animated">
            <CardHeader>
              <CardTitle>Daily Study Goal & Preferences</CardTitle>
              <CardDescription>Set your typical wake/sleep times to calculate a study target.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <WakeSleepTimeSelector label="Wake Up" time={localWakeUpHour} period={localWakeUpPeriod} onTimeChange={setLocalWakeUpHour} onPeriodChange={setLocalWakeUpPeriod} />
                <WakeSleepTimeSelector label="Sleep" time={localSleepHour} period={localSleepPeriod} onTimeChange={setLocalSleepHour} onPeriodChange={setLocalSleepPeriod} />
              </div>
              <Button onClick={handleSaveSleepWakeTimes} className="btn-animated">Save Preferences</Button>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Your Waking Hours" value={`${wakingHours.toFixed(1)}h`} icon={<SunMedium className="h-5 w-5 text-muted-foreground" />} />
                <StatCard title="Daily Study Target (60%)" value={`${studyTargetHours.toFixed(1)}h`} icon={<TargetIcon className="h-5 w-5 text-muted-foreground" />} description={`(${formatTime(studyTargetHours * 3600)})`} />
                <StatCard title="Today's Progress" value={`${studyTargetCompletionPercent.toFixed(0)}%`} icon={<Percent className="h-5 w-5 text-muted-foreground" />} description={`${formatTime(todayStudyTimeSeconds)} / ${formatTime(studyTargetHours * 3600)} studied`} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md card-animated">
            <CardHeader>
              <CardTitle>Study Activity Heatmap (Last ~3 Months)</CardTitle>
              <CardDescription>Darker cells indicate more study time on that day. Hover for details.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-4">
                <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayLabel => (
                        <div key={dayLabel} className="text-center text-xs font-medium text-muted-foreground pb-1">{dayLabel}</div>
                    ))}
                </div>
                <div className="grid grid-cols-1 gap-1 md:gap-1.5">
                    {calendarHeatmapWeeks.map((week, weekIndex) => (
                        <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1 md:gap-1.5 h-7 md:h-8">
                            {week.map((day, dayIndex) => {
                                if (!day) return <div key={`empty-${weekIndex}-${dayIndex}`} className="bg-muted/20 rounded-sm"></div>;
                                
                                let cellFill = 'bg-muted/30'; // Default for no study
                                if (day.level === 1) cellFill = 'bg-primary/20';
                                else if (day.level === 2) cellFill = 'bg-primary/40';
                                else if (day.level === 3) cellFill = 'bg-primary/60';
                                else if (day.level === 4) cellFill = 'bg-primary/80';
                                else if (day.level === 5) cellFill = 'bg-primary';

                                // If the day is in the future relative to 'today', make it even lighter or distinct
                                const todayFormatted = format(new Date(), 'yyyy-MM-dd');
                                if(day.date > todayFormatted) cellFill = 'bg-muted/10';


                                return (
                                    <TooltipProvider key={day.date} delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className={cn("rounded-sm w-full h-full", cellFill, "transition-colors duration-150")}></div>
                                            </TooltipTrigger>
                                            <ShadTooltipContent>
                                                <p>{format(parseISO(day.date), 'MMM d, yyyy')}</p>
                                                <p>Study Time: {formatTime(day.count * 60)}</p>
                                            </ShadTooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end items-center space-x-2 text-xs mt-2">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-muted/30 border"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary"></div>
                    <span>More</span>
                </div>
            </CardContent>
          </Card>


          <Card className="shadow-md card-animated">
            <CardHeader>
              <CardTitle>Study Activity (Last 7 Days)</CardTitle>
              <CardDescription>Total study time and Pomodoros completed daily.</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData.filter(d => d.totalTime > 0 || d.pomodoros > 0).length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                       <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                       <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" unit="m" tickFormatter={(value) => Math.round(value / 60).toString()} fontSize={12} domain={[0, 'dataMax + 10']} />
                       <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickFormatter={(value) => Math.round(value).toString()} fontSize={12} domain={[0, 'dataMax + 1']} />
                       <ChartTooltip 
                        cursor={false}
                        content={<ChartTooltipContent 
                                  formatter={(value, name, props) => {
                                    if (name === 'Study Time (min)') return `${formatTime(props.payload.totalTime)} study`;
                                    if (name === 'Completed Pomodoros') return `${props.payload.pomodoros} sessions`;
                                    return `${value}`;
                                  }}
                                  labelFormatter={(label, payload) => {
                                    if (payload && payload.length > 0 && payload[0].payload.originalDate) {
                                       return `Date: ${format(payload[0].payload.originalDate, 'MMM d, yyyy')}`;
                                    }
                                    return label;
                                  }}
                                  indicator="dot" 
                                />} 
                        />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalTime" fill="var(--color-totalTime)" radius={4} name="Study Time (min)" />
                      <Bar yAxisId="right" dataKey="pomodoros" fill="var(--color-pomodoros)" radius={4} name="Completed Pomodoros"/>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">Not enough data for the chart yet. Log some sessions!</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

```