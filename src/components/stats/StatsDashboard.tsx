"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatTime } from '@/lib/utils';
import { BarChartBig, Clock, Coffee, TrendingUp, ListChecks, Sigma } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { StudySession } from '@/types';
import { useEffect, useState } from 'react';

interface DailyStat {
  date: string;
  totalTime: number; // in seconds
  pomodoros: number;
}

export default function StatsDashboard() {
  const { sessions } = useSessions();
  const [dailyData, setDailyData] = useState<DailyStat[]>([]);

  useEffect(() => {
    const calculateDailyData = () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today + 6 past days
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const filteredSessions = sessions.filter(s => s.startTime >= sevenDaysAgo.getTime());

      const statsByDay: { [key: string]: { totalTime: number; pomodoros: number } } = {};

      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateString = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        statsByDay[dateString] = { totalTime: 0, pomodoros: 0 };
      }
      
      filteredSessions.forEach(session => {
        const sessionDate = new Date(session.startTime);
        const dateString = sessionDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (statsByDay[dateString]) {
          statsByDay[dateString].totalTime += session.duration;
          if (session.type === 'Pomodoro Focus') {
            statsByDay[dateString].pomodoros += 1;
          }
        }
      });

      setDailyData(Object.entries(statsByDay).map(([date, data]) => ({ date, ...data })));
    };
    calculateDailyData();
  }, [sessions]);


  const totalStudyTime = sessions.reduce((acc, session) => acc + session.duration, 0);
  const totalSessions = sessions.length;
  const averageSessionLength = totalSessions > 0 ? totalStudyTime / totalSessions : 0;
  const pomodoroFocusSessions = sessions.filter(s => s.type === 'Pomodoro Focus').length;
  const pomodoroBreakSessions = sessions.filter(s => s.type === 'Pomodoro Break').length;
  const stopwatchSessions = sessions.filter(s => s.type === 'Stopwatch').length;


  const chartConfig = {
    totalTime: { label: "Study Time", color: "hsl(var(--primary))" },
    pomodoros: { label: "Pomodoros", color: "hsl(var(--accent))" },
  };

  const StatCard = ({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description?: string }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
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
              <CardTitle>Study Activity (Last 7 Days)</CardTitle>
              <CardDescription>Total study time and Pomodoros completed daily.</CardDescription>
            </CardHeader>
            <CardContent>
              {dailyData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                       <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                       <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--primary))" unit="m" tickFormatter={(value) => Math.round(value / 60).toString()} fontSize={12} />
                       <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--accent))" unit="p" tickFormatter={(value) => Math.round(value).toString()} fontSize={12} />
                       <ChartTooltip 
                        cursor={false}
                        content={<ChartTooltipContent 
                                  formatter={(value, name) => (name === 'totalTime' ? `${formatTime(value as number)}` : `${value} sessions`)} 
                                  indicator="dot" 
                                />} 
                        />
                      <Bar yAxisId="left" dataKey="totalTime" fill="var(--color-totalTime)" radius={4} name="Study Time" />
                      <Bar yAxisId="right" dataKey="pomodoros" fill="var(--color-pomodoros)" radius={4} name="Pomodoros"/>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">Not enough data for the chart yet.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
