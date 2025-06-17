
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatTime } from '@/lib/utils';
import { BarChartBig, Clock, Coffee, TrendingUp, ListChecks, Sigma, Timer, CalendarDays, BedDouble, SunMedium, TargetIcon, Percent } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip, Legend, Cell } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { StudySession, UserProfile } from '@/types';
import React, { useEffect, useState, useMemo } from 'react';
import { format, startOfWeek, addDays, eachDayOfInterval, subDays, getDay, isSameDay } from 'date-fns';

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
        <SelectTrigger id={`${label}-hour`} className="w-[80px]">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {hours.map(h => <SelectItem key={h} value={h.toString()}>{h}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={period} onValueChange={(val: 'AM' | 'PM') => onPeriodChange(val)}>
        <SelectTrigger id={`${label}-period`} className="w-[90px]">
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
  const { sessions, userProfile, updateSleepWakeTimes } = useSessions();
  const [dailyData, setDailyData] = useState<DailyStat[]>([]);

  const [localWakeUpHour, setLocalWakeUpHour] = useState(userProfile.wakeUpTime?.hour || 8);
  const [localWakeUpPeriod, setLocalWakeUpPeriod] = useState<'AM' | 'PM'>(userProfile.wakeUpTime?.period || 'AM');
  const [localSleepHour, setLocalSleepHour] = useState(userProfile.sleepTime?.hour || 10);
  const [localSleepPeriod, setLocalSleepPeriod] = useState<'AM' | 'PM'>(userProfile.sleepTime?.period || 'PM');

  useEffect(() => {
    setLocalWakeUpHour(userProfile.wakeUpTime?.hour || 8);
    setLocalWakeUpPeriod(userProfile.wakeUpTime?.period || 'AM');
    setLocalSleepHour(userProfile.sleepTime?.hour || 10);
    setLocalSleepPeriod(userProfile.sleepTime?.period || 'PM');
  }, [userProfile.wakeUpTime, userProfile.sleepTime]);

  const handleSaveSleepWakeTimes = () => {
    updateSleepWakeTimes(
      { hour: localWakeUpHour, period: localWakeUpPeriod },
      { hour: localSleepHour, period: localSleepPeriod }
    );
  };

  const { wakingHours, studyTargetHours, todayStudyTimeSeconds, studyTargetCompletionPercent } = useMemo(() => {
    const convertTo24Hour = (hour: number, period: 'AM' | 'PM') => {
      if (period === 'PM' && hour !== 12) return hour + 12;
      if (period === 'AM' && hour === 12) return 0; // Midnight
      return hour;
    };

    const wakeHour24 = convertTo24Hour(userProfile.wakeUpTime?.hour || 8, userProfile.wakeUpTime?.period || 'AM');
    const sleepHour24 = convertTo24Hour(userProfile.sleepTime?.hour || 10, userProfile.sleepTime?.period || 'PM');
    
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
        const dateKey = d.toISOString().split('T')[0];
        statsByDay[dateKey] = { totalTime: 0, pomodoros: 0 };
      }
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0,0,0,0);
        const dateKey = sessionDate.toISOString().split('T')[0];
        
        if (statsByDay[dateKey]) {
          statsByDay[dateKey].totalTime += session.duration;
          if (session.type === 'Pomodoro Focus') {
            statsByDay[dateKey].pomodoros += 1;
          }
        }
      });
      
      const formattedData = Object.entries(statsByDay).map(([dateKey, data]) => {
        const dateObj = new Date(dateKey + 'T00:00:00Z'); // Use T00:00:00Z for UTC date
         return {
          originalDate: dateObj,
          date: format(dateObj, 'MMM d'),
          ...data,
        };
      }).sort((a,b) => a.originalDate.getTime() - b.originalDate.getTime());

      setDailyData(formattedData);
    };
    calculateDailyData();
  }, [sessions]);

  const heatmapData = useMemo(() => {
    const data: HeatmapDataPoint[] = [];
    const endDate = new Date();
    const startDate = subDays(endDate, 89); // Approx 3 months
    const dateArray = eachDayOfInterval({ start: startDate, end: endDate });

    dateArray.forEach(day => {
      const formattedDay = format(day, 'yyyy-MM-dd');
      const studyTimeForDay = sessions
        .filter(session => format(new Date(session.startTime), 'yyyy-MM-dd') === formattedDay)
        .reduce((sum, session) => sum + session.duration, 0) / 60; // in minutes

      let level = 0;
      if (studyTimeForDay > 0) level = 1;
      if (studyTimeForDay >= 30) level = 2;
      if (studyTimeForDay >= 60) level = 3;
      if (studyTimeForDay >= 120) level = 4;
      if (studyTimeForDay >= 180) level = 5;

      data.push({ date: formattedDay, count: Math.round(studyTimeForDay), level });
    });
    return data;
  }, [sessions]);
  
  const HeatmapCell = ({ x, y, width, height, fill, payload, value }: any) => {
     if (value === undefined || value < 0) return null; // Don't render for padding or no data
      const color = payload.level === 0 ? 'hsl(var(--muted))' 
                  : payload.level === 1 ? 'hsl(var(--primary) / 0.2)'
                  : payload.level === 2 ? 'hsl(var(--primary) / 0.4)'
                  : payload.level === 3 ? 'hsl(var(--primary) / 0.6)'
                  : payload.level === 4 ? 'hsl(var(--primary) / 0.8)'
                  : 'hsl(var(--primary))';
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                     <rect x={x} y={y} width={width} height={height} fill={color} rx="3" ry="3" />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{format(new Date(payload.date), 'MMM d, yyyy')}</p>
                    <p>Study Time: {formatTime(payload.count * 60)}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
  };

  // Prepare data for Recharts heatmap (calendar-like)
  const calendarHeatmapData = useMemo(() => {
    const today = new Date();
    const weeksToShow = 13; // Approx 3 months
    const startDate = startOfWeek(subDays(today, (weeksToShow -1) * 7 ), { weekStartsOn: 0 }); // Start on Sunday
    
    let currentData: any[] = [];
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < weeksToShow; i++) {
        const weekStart = addDays(startDate, i * 7);
        const weekData: any = { name: format(weekStart, 'MMM d') }; // Label for the week
        for (let j = 0; j < 7; j++) {
            const day = addDays(weekStart, j);
            const dayKey = format(day, 'yyyy-MM-dd');
            const dataPoint = heatmapData.find(p => p.date === dayKey);
            weekData[dayLabels[j]] = dataPoint ? dataPoint.level : 0; // Store level for color
            weekData[`${dayLabels[j]}_date`] = dayKey; // Store date for tooltip
            weekData[`${dayLabels[j]}_count`] = dataPoint ? dataPoint.count : 0; // Store count for tooltip
        }
        currentData.push(weekData);
    }
    return currentData;
  }, [heatmapData]);


  const totalStudyTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const totalSessions = sessions.length;
  const averageSessionLength = totalSessions > 0 ? totalStudyTime / totalSessions : 0;
  const pomodoroFocusSessions = sessions.filter(s => s.type === 'Pomodoro Focus').length;
  const pomodoroBreakSessions = sessions.filter(s => s.type === 'Pomodoro Break').length;
  const stopwatchSessions = sessions.filter(s => s.type === 'Stopwatch').length;


  const chartConfig = {
    totalTime: { label: "Study Time (min)", color: "hsl(var(--primary))" },
    pomodoros: { label: "Pomodoros", color: "hsl(var(--accent))" },
  } satisfies Record<string, { label: string; color: string }>;

  const StatCard = ({ title, value, icon, description, children }: { title: string, value?: string, icon?: React.ReactNode, description?: string, children?: React.ReactNode }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Study Statistics</h1>
      
      {totalSessions === 0 ? (
         <Card className="shadow-md">
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
            <StatCard title="Total Sessions" value={totalSessions.toString()} icon={<ListChecks className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Avg. Session Length" value={formatTime(averageSessionLength)} icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Pomodoro Focus" value={pomodoroFocusSessions.toString()} icon={<Clock className="h-5 w-5 text-muted-foreground" />} description="Completed focus sessions" />
            <StatCard title="Pomodoro Breaks" value={pomodoroBreakSessions.toString()} icon={<Coffee className="h-5 w-5 text-muted-foreground" />} description="Completed break sessions" />
            <StatCard title="Stopwatch Sessions" value={stopwatchSessions.toString()} icon={<Timer className="h-5 w-5 text-muted-foreground" />} />
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Daily Study Goal & Preferences</CardTitle>
              <CardDescription>Set your typical wake/sleep times to calculate a study target.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <WakeSleepTimeSelector label="Wake Up" time={localWakeUpHour} period={localWakeUpPeriod} onTimeChange={setLocalWakeUpHour} onPeriodChange={setLocalWakeUpPeriod} />
                <WakeSleepTimeSelector label="Sleep" time={localSleepHour} period={localSleepPeriod} onTimeChange={setLocalSleepHour} onPeriodChange={setLocalSleepPeriod} />
              </div>
              <Button onClick={handleSaveSleepWakeTimes}>Save Preferences</Button>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard title="Your Waking Hours" value={`${wakingHours.toFixed(1)}h`} icon={<SunMedium className="h-5 w-5 text-muted-foreground" />} />
                <StatCard title="Daily Study Target (60%)" value={`${studyTargetHours.toFixed(1)}h`} icon={<TargetIcon className="h-5 w-5 text-muted-foreground" />} description={`(${formatTime(studyTargetHours * 3600)})`} />
                <StatCard title="Today's Progress" value={`${studyTargetCompletionPercent.toFixed(0)}%`} icon={<Percent className="h-5 w-5 text-muted-foreground" />} description={`${formatTime(todayStudyTimeSeconds)} / ${formatTime(studyTargetHours * 3600)} studied`} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Study Activity Heatmap (Last ~3 Months)</CardTitle>
              <CardDescription>Darker cells indicate more study time on that day.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <div style={{ width: '100%', height: 200 }}> {/* Container for responsiveness */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={calendarHeatmapData} layout="vertical" barCategoryGap={1} barGap={1} margin={{ top: 20, right: 0, left: 40, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={40} fontSize={10}/>
                            <ChartTooltip 
                                contentStyle={{ display: 'none' }} // Use custom cell tooltip
                                cursor={false}
                            />
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayLabel, index) => (
                                <Bar key={dayLabel} dataKey={dayLabel} fill="#8884d8" radius={2} stackId="a">
                                     {calendarHeatmapData.map((entry, entryIndex) => (
                                        <Cell 
                                            key={`cell-${entryIndex}-${index}`} 
                                            fill={
                                                entry[dayLabel] === 0 ? 'hsl(var(--muted) / 0.5)' : // No study
                                                entry[dayLabel] === 1 ? 'hsl(var(--primary) / 0.2)' :
                                                entry[dayLabel] === 2 ? 'hsl(var(--primary) / 0.4)' :
                                                entry[dayLabel] === 3 ? 'hsl(var(--primary) / 0.6)' :
                                                entry[dayLabel] === 4 ? 'hsl(var(--primary) / 0.8)' :
                                                'hsl(var(--primary))' // Max study
                                            }
                                            radius={3}
                                            data-date={entry[`${dayLabel}_date`]}
                                            data-count={entry[`${dayLabel}_count`]}
                                        />
                                    ))}
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-end items-center space-x-2 text-xs mt-2">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-muted/50 border"></div>
                    <div className="w-3 h-3 rounded-sm" style={{backgroundColor: 'hsl(var(--primary) / 0.2)'}}></div>
                    <div className="w-3 h-3 rounded-sm" style={{backgroundColor: 'hsl(var(--primary) / 0.6)'}}></div>
                    <div className="w-3 h-3 rounded-sm" style={{backgroundColor: 'hsl(var(--primary))'}}></div>
                    <span>More</span>
                </div>
            </CardContent>
          </Card>


          <Card className="shadow-md">
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
                       <YAxis yAxisId="left" orientation="left" stroke={`hsl(${getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim()})`} unit="m" tickFormatter={(value) => Math.round(value / 60).toString()} fontSize={12} domain={[0, 'dataMax + 10']} />
                       <YAxis yAxisId="right" orientation="right" stroke={`hsl(${getComputedStyle(document.documentElement).getPropertyValue('--chart-2').trim()})`} tickFormatter={(value) => Math.round(value).toString()} fontSize={12} domain={[0, 'dataMax + 1']} />
                       <ChartTooltip 
                        cursor={false}
                        content={<ChartTooltipContent 
                                  formatter={(value, name, props) => {
                                    if (name === 'Study Time (min)') return `${formatTime(props.payload.totalTime)} study`;
                                    if (name === 'Pomodoros') return `${props.payload.pomodoros} sessions`;
                                    return `${value}`;
                                  }}
                                  labelFormatter={(label, payload) => {
                                    if (payload && payload.length > 0) {
                                       return `Date: ${format(payload[0].payload.originalDate, 'MMM d, yyyy')}`;
                                    }
                                    return label;
                                  }}
                                  indicator="dot" 
                                />} 
                        />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalTime" fill="var(--color-totalTime)" radius={4} name="Study Time (min)" />
                      <Bar yAxisId="right" dataKey="pomodoros" fill="var(--color-pomodoros)" radius={4} name="Pomodoros"/>
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
