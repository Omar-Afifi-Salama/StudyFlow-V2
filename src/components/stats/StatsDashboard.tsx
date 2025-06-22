
"use client";

import { useSessions, ALL_ACHIEVEMENTS } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatTime, cn } from '@/lib/utils';
import { BarChartBig, Clock, Coffee, TrendingUp, ListChecks, Sigma, Timer as TimerIcon, Zap, DollarSign, Activity, Award, Trophy, CalendarCheck, Calendar as CalendarIcon } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import React, { useMemo } from 'react';
import { format, subDays, eachDayOfInterval, parseISO, startOfWeek, endOfWeek, addDays, isToday } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent as ShadTooltipContent } from '@/components/ui/tooltip';

interface HeatmapDataPoint {
  date: string; // YYYY-MM-DD
  count: number; // total study time in minutes for that day
  level: number; // for color intensity
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
      ...data,
    })).sort((a,b) => a.originalDate.getTime() - b.originalDate.getTime());
  }, [sessions, isLoaded]);

  const heatmapData = useMemo(() => {
    if (!isLoaded) return [];
    const dataByDate: Record<string, number> = {};
    sessions.forEach(session => {
      if (session.type === 'Pomodoro Focus' || session.type === 'Stopwatch') {
        const dateKey = format(new Date(session.startTime), 'yyyy-MM-dd');
        dataByDate[dateKey] = (dataByDate[dateKey] || 0) + session.duration / 60;
      }
    });

    const endDate = new Date();
    const startDate = subDays(endDate, 364);
    const dateArray = eachDayOfInterval({ start: startDate, end: endDate });

    return dateArray.map(day => {
      const formattedDay = format(day, 'yyyy-MM-dd');
      const studyTimeForDay = dataByDate[formattedDay] || 0;
      let level = 0;
      if (studyTimeForDay > 0 && studyTimeForDay <= 30) level = 1;
      else if (studyTimeForDay > 30 && studyTimeForDay <= 60) level = 2;
      else if (studyTimeForDay > 60 && studyTimeForDay <= 120) level = 3;
      else if (studyTimeForDay > 120 && studyTimeForDay < 180) level = 4;
      else if (studyTimeForDay >= 180) level = 5;
      return { date: formattedDay, count: Math.round(studyTimeForDay), level };
    });
  }, [sessions, isLoaded]);

  const calendarHeatmapWeeks = useMemo(() => {
    if (!heatmapData.length) return [];
    const weeks: Array<Array<HeatmapDataPoint | null>> = [];
    const firstDate = parseISO(heatmapData[0].date);
    const startDate = startOfWeek(firstDate, { weekStartsOn: 1 }); // Start on Monday
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    let currentDay = startDate;
    while (currentDay <= endDate) {
      const week: Array<HeatmapDataPoint | null> = [];
      for (let i = 0; i < 7; i++) {
        const dayKey = format(currentDay, 'yyyy-MM-dd');
        const dataPoint = heatmapData.find(p => p.date === dayKey);
        week.push(dataPoint || { date: dayKey, count: 0, level: 0});
        currentDay = addDays(currentDay, 1);
      }
      weeks.push(week);
    }
    return weeks;
  }, [heatmapData]);

  const totalStudyTime = sessions.filter(s => s.type === 'Pomodoro Focus' || s.type === 'Stopwatch').reduce((acc, s) => acc + s.duration, 0);
  const totalFocusSessions = sessions.filter(s => s.type === 'Pomodoro Focus' || s.type === 'Stopwatch').length;
  const averageSessionLength = totalFocusSessions > 0 ? totalStudyTime / totalFocusSessions : 0;
  const completedPomodoroFocusSessions = sessions.filter(s => s.type === 'Pomodoro Focus' && s.isFullPomodoroCycle).length;
  const pomodoroBreakSessions = sessions.filter(s => s.type === 'Pomodoro Break').length;
  const stopwatchSessions = sessions.filter(s => s.type === 'Stopwatch').length;
  const longestSession = Math.max(0, ...sessions.filter(s => s.type === 'Pomodoro Focus' || s.type === 'Stopwatch').map(s => s.duration));
  const studyDaysThisYear = heatmapData.filter(d => d.count > 0).length;
  const todayStudyTime = sessions.filter(s => isToday(new Date(s.startTime)) && (s.type === 'Pomodoro Focus' || s.type === 'Stopwatch')).reduce((acc, s) => acc + s.duration, 0);
  const achievementsTotal = ALL_ACHIEVEMENTS.length;


  const chartConfig = {
    totalTime: { label: "Study Time (min)", color: "hsl(var(--chart-1))" },
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
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
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
            <StatCard title="Study Days (Year)" value={studyDaysThisYear.toString()} icon={<CalendarCheck className="h-5 w-5 text-muted-foreground" />} />
            <StatCard title="Achievements Unlocked" value={`${userProfile.unlockedAchievementIds.length} / ${achievementsTotal}`} icon={<Trophy className="h-5 w-5 text-muted-foreground" />} />
          </div>
          
          <Card className="shadow-md card-animated">
            <CardHeader>
              <CardTitle>Study Activity Heatmap</CardTitle>
              <CardDescription>Each cell represents a day's total study time in the last year. Weeks start on Monday.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-4">
              <div className="flex gap-3">
                <div className="flex flex-col text-xs text-muted-foreground mt-1.5" style={{ gap: '0.625rem' }}>
                  <span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span></span>
                </div>
                <div className="overflow-x-auto">
                    <div className="grid grid-flow-col grid-rows-7 gap-1">
                      {calendarHeatmapWeeks.flat().map((day) => {
                        if (!day) return <div key={Math.random()} className="w-3.5 h-3.5 bg-muted/20 rounded-sm"></div>;
                        let cellFill = 'bg-muted/30';
                        if (day.level === 1) cellFill = 'bg-primary/20';
                        else if (day.level === 2) cellFill = 'bg-primary/40';
                        else if (day.level === 3) cellFill = 'bg-primary/60';
                        else if (day.level === 4) cellFill = 'bg-primary/80';
                        else if (day.level === 5) cellFill = 'bg-primary';

                        return (
                          <TooltipProvider key={day.date} delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={cn("w-3.5 h-3.5 rounded-sm", cellFill, "transition-colors duration-150")} />
                              </TooltipTrigger>
                              <ShadTooltipContent>
                                <p>{format(parseISO(day.date), 'PPP')}</p>
                                <p>Study Time: {formatTime(day.count * 60)}</p>
                              </ShadTooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                    </div>
                  </div>
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
