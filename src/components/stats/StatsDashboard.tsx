
"use client";

import { useSessions, ALL_ACHIEVEMENTS } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatTime, cn } from '@/lib/utils';
import { BarChartBig, Clock, Coffee, TrendingUp, ListChecks, Sigma, Timer as TimerIcon, Zap, DollarSign, Activity, Award, Trophy, CalendarCheck, Calendar as CalendarIcon } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip, Legend, CartesianGrid } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import React, { useMemo } from 'react';
import { format, subDays, eachDayOfInterval, parseISO, isToday, getMonth, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent as ShadTooltipContent } from '@/components/ui/tooltip';
import SessionLog from '@/components/sessions/SessionLog';

interface HeatmapDataPoint {
  date: string; // YYYY-MM-DD
  count: number; // total study time in minutes for that day
  level: number; // for color intensity: 0=no data, 1-4 for activity levels
}

export default function StatsDashboard() {
  const { sessions, userProfile, isLoaded } = useSessions();
  
  const dailyData = useMemo(() => {
    if (!isLoaded) return [];
    const today = new Date();
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const statsByDay: { [key: string]: { totalTime: number; pomodoros: number } } = {};

    last7Days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      statsByDay[dateKey] = { totalTime: 0, pomodoros: 0 };
    });

    sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      const dateKey = format(sessionDate, 'yyyy-MM-dd');
      if (statsByDay[dateKey]) {
        if(session.type === 'Pomodoro Focus' || session.type === 'Stopwatch') {
          statsByDay[dateKey].totalTime += session.duration;
        }
        if (session.type === 'Pomodoro Focus' && session.isFullPomodoroCycle) { 
          statsByDay[dateKey].pomodoros += 1;
        }
      }
    });
    
    return Object.entries(statsByDay).map(([dateKey, data]) => ({
      originalDate: parseISO(dateKey),
      date: format(parseISO(dateKey), 'MMM d'),
      totalTime: data.totalTime,
      pomodoros: data.pomodoros,
    })).sort((a,b) => a.originalDate.getTime() - b.originalDate.getTime());
  }, [sessions, isLoaded]);

  const heatmapData = useMemo(() => {
    if (!isLoaded) return [];
    const dataByDate: Record<string, number> = {};
    const today = new Date();
    const startDate = subDays(today, 365);

    const dateArray = eachDayOfInterval({ start: startDate, end: today });
    dateArray.forEach(day => {
        dataByDate[format(day, 'yyyy-MM-dd')] = 0;
    });

    sessions.forEach(session => {
      if (session.type === 'Pomodoro Focus' || session.type === 'Stopwatch') {
        const dateKey = format(new Date(session.startTime), 'yyyy-MM-dd');
        if(dataByDate.hasOwnProperty(dateKey)) {
            dataByDate[dateKey] += session.duration / 60;
        }
      }
    });

    return Object.entries(dataByDate).map(([date, studyTime]) => {
      let level = 0;
      if (studyTime > 0 && studyTime <= 30) level = 1;
      else if (studyTime > 30 && studyTime <= 60) level = 2;
      else if (studyTime > 60 && studyTime <= 120) level = 3;
      else if (studyTime > 120) level = 4;
      return { date, count: Math.round(studyTime), level };
    });
  }, [sessions, isLoaded]);
  
  const monthlyHeatmapData = useMemo(() => {
    if (!isLoaded) return [];
    
    const dataByDate: Record<string, HeatmapDataPoint> = heatmapData.reduce((acc, curr) => {
        acc[curr.date] = curr;
        return acc;
    }, {} as Record<string, HeatmapDataPoint>);

    const months = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
        const monthDate = subMonths(today, i);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        const monthDays: HeatmapDataPoint[] = daysInMonth.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            return dataByDate[dateKey] || { date: dateKey, count: 0, level: 0 };
        });

        const firstDayOfWeek = (monthStart.getDay() + 6) % 7;
        const paddedDays: (HeatmapDataPoint | null)[] = Array(firstDayOfWeek).fill(null);
        paddedDays.push(...monthDays);
        
        months.push({
            monthName: format(monthStart, 'MMMM yyyy'),
            days: paddedDays
        });
    }
    return months;
  }, [heatmapData, isLoaded]);


  const totalStudyTime = sessions.filter(s => s.type === 'Pomodoro Focus' || s.type === 'Stopwatch').reduce((acc, s) => acc + s.duration, 0);
  const totalFocusSessions = sessions.filter(s => s.type === 'Pomodoro Focus' || s.type === 'Stopwatch').length;
  const averageSessionLength = totalFocusSessions > 0 ? totalStudyTime / totalFocusSessions : 0;
  const completedPomodoroFocusSessions = sessions.filter(s => s.type === 'Pomodoro Focus' && s.isFullPomodoroCycle).length;
  const pomodoroBreakSessions = sessions.filter(s => s.type === 'Pomodoro Break').length;
  const stopwatchSessions = sessions.filter(s => s.type === 'Stopwatch').length;
  const longestSession = Math.max(0, ...sessions.filter(s => s.type === 'Pomodoro Focus' || s.type === 'Stopwatch').map(s => s.duration));
  const studyDaysThisYear = new Set(sessions.map(s => format(new Date(s.startTime), 'yyyy-MM-dd'))).size;
  const todayStudyTime = sessions.filter(s => isToday(new Date(s.startTime)) && (s.type === 'Pomodoro Focus' || s.type === 'Stopwatch')).reduce((acc, s) => acc + s.duration, 0);
  const achievementsTotal = ALL_ACHIEVEMENTS.length;


  const chartConfig = {
    totalTime: { label: "Study Time", color: "hsl(var(--chart-1))" },
    pomodoros: { label: "Completed Pomodoros", color: "hsl(var(--chart-2))" },
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
      {sessions.length === 0 ? (
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Study Time" value={formatTime(totalStudyTime, true)} icon={<Sigma className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Today's Study Time" value={formatTime(todayStudyTime)} icon={<CalendarIcon className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Avg. Session Length" value={formatTime(averageSessionLength)} icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Longest Session" value={formatTime(longestSession)} icon={<Award className="h-5 w-5 text-muted-foreground" />} />
            
            <StatCard title="Total Focus Sessions" value={totalFocusSessions.toString()} icon={<ListChecks className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Full Pomodoro Cycles" value={completedPomodoroFocusSessions.toString()} icon={<Clock className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Stopwatch Sessions" value={stopwatchSessions.toString()} icon={<TimerIcon className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Pomodoro Breaks Taken" value={pomodoroBreakSessions.toString()} icon={<Coffee className="h-5 w-5 text-muted-foreground" />} />
            
            <StatCard title="Total XP Earned" value={userProfile.xp.toLocaleString()} icon={<Zap className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Total Cash Earned" value={`$${userProfile.cash.toLocaleString()}`} icon={<DollarSign className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Study Days (Year)" value={studyDaysThisYear.toString()} icon={<CalendarCheck className="h-5 w-g text-muted-foreground" />} />
            <StatCard title="Achievements Unlocked" value={`${userProfile.unlockedAchievementIds.length} / ${achievementsTotal}`} icon={<Trophy className="h-5 w-5 text-muted-foreground" />} />
          </div>
          
          <div className="space-y-6">
            <SessionLog />

            <Card className="shadow-md card-animated">
              <CardHeader>
                  <CardTitle>Study Activity Heatmap</CardTitle>
                  <CardDescription>Your study consistency over the last 12 months.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 overflow-x-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-8">
                      {monthlyHeatmapData.map(({ monthName, days }) => (
                          <div key={monthName}>
                              <h4 className="text-sm font-semibold mb-2 text-center">{monthName}</h4>
                              <div className="grid grid-cols-7 gap-1">
                                  {days.map((day, index) => {
                                      if (!day) {
                                          return <div key={`blank-${index}`} className="h-4 w-4 rounded-sm" />;
                                      }
                                      let colorClass = 'bg-muted/30';
                                      if (day.level > 0) colorClass = `bg-primary/20`;
                                      if (day.level > 1) colorClass = `bg-primary/40`;
                                      if (day.level > 2) colorClass = `bg-primary/70`;
                                      if (day.level > 3) colorClass = `bg-primary`;
                                      
                                      return (
                                          <TooltipProvider key={day.date} delayDuration={100}>
                                              <Tooltip>
                                                  <TooltipTrigger asChild>
                                                      <div className={cn("h-4 w-4 rounded-sm", colorClass)} />
                                                  </TooltipTrigger>
                                                  <ShadTooltipContent>
                                                      <p className="font-semibold">{day.count} minutes</p>
                                                      <p className="text-muted-foreground">{format(parseISO(day.date), 'PPP')}</p>
                                                  </ShadTooltipContent>
                                              </Tooltip>
                                          </TooltipProvider>
                                      );
                                  })}
                              </div>
                          </div>
                      ))}
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
                    <ResponsiveContainer>
                      <BarChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" unit="m" tickFormatter={(value) => Math.round(value / 60).toString()} fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickFormatter={(value) => Math.round(value).toString()} fontSize={12} allowDecimals={false} />
                        <ChartTooltip 
                          cursor={false}
                          content={<ChartTooltipContent 
                            formatter={(value, name, props) => {
                              if (name === 'Study Time') return `${formatTime(props.payload.totalTime)} study`;
                              if (name === 'Completed Pomodoros') return `${props.payload.pomodoros} sessions`;
                              return `${value}`;
                            }}
                            labelFormatter={(label, payload) => payload?.[0] ? format(payload[0].payload.originalDate, 'EEEE, MMM d') : label}
                            indicator="dot" 
                          />} 
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="totalTime" fill="var(--color-totalTime)" radius={4} name="Study Time" />
                        <Bar yAxisId="right" dataKey="pomodoros" fill="var(--color-pomodoros)" radius={4} name="Completed Pomodoros"/>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">Not enough data for the chart yet. Log some sessions!</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
