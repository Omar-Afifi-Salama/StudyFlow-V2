
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatTime } from '@/lib/utils';
import { BarChartBig, Clock, Coffee, TrendingUp, ListChecks, Sigma, Timer } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { StudySession } from '@/types';
import { useEffect, useState } from 'react';

interface DailyStat {
  date: string; // Formatted for display e.g., "Jul 20"
  originalDate: string; // YYYY-MM-DD for sorting
  totalTime: number; // in seconds
  pomodoros: number;
}

export default function StatsDashboard() {
  const { sessions } = useSessions();
  const [dailyData, setDailyData] = useState<DailyStat[]>([]);

  useEffect(() => {
    const calculateDailyData = () => {
      const today = new Date();
      today.setHours(0,0,0,0);

      const statsByDay: { [key: string]: { totalTime: number; pomodoros: number } } = {};

      // Initialize stats for the last 7 days including today
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
        statsByDay[dateKey] = { totalTime: 0, pomodoros: 0 };
      }
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0,0,0,0);
        const dateKey = sessionDate.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (statsByDay[dateKey]) {
          statsByDay[dateKey].totalTime += session.duration;
          if (session.type === 'Pomodoro Focus') {
            statsByDay[dateKey].pomodoros += 1;
          }
        }
      });
      
      const formattedData = Object.entries(statsByDay).map(([dateKey, data]) => {
        const dateObj = new Date(dateKey + 'T00:00:00'); // Ensure correct date object from YYYY-MM-DD
         return {
          originalDate: dateKey,
          date: dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          ...data,
        };
      }).sort((a,b) => a.originalDate.localeCompare(b.originalDate)); // Sort by YYYY-MM-DD

      setDailyData(formattedData);
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
    totalTime: { label: "Study Time (min)", color: "hsl(var(--primary))" },
    pomodoros: { label: "Pomodoros", color: "hsl(var(--accent))" },
  } satisfies Record<string, { label: string; color: string }>;

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
              {dailyData.filter(d => d.totalTime > 0 || d.pomodoros > 0).length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                       <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                       <YAxis yAxisId="left" orientation="left" stroke={chartConfig.totalTime.color} unit="m" tickFormatter={(value) => Math.round(value / 60).toString()} fontSize={12} domain={[0, 'dataMax + 10']} />
                       <YAxis yAxisId="right" orientation="right" stroke={chartConfig.pomodoros.color} tickFormatter={(value) => Math.round(value).toString()} fontSize={12} domain={[0, 'dataMax + 1']} />
                       <ChartTooltip 
                        cursor={false}
                        content={<ChartTooltipContent 
                                  formatter={(value, name, props) => {
                                    if (name === 'Study Time (min)') return `${formatTime(props.payload.totalTime)} study`;
                                    if (name === 'Pomodoros') return `${props.payload.pomodoros} sessions`;
                                    return `${value}`;
                                  }}
                                  labelFormatter={(label) => `Date: ${label}`}
                                  indicator="dot" 
                                />} 
                        />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalTime" fill={`var(--color-totalTime)`} radius={4} name="Study Time (min)" />
                      <Bar yAxisId="right" dataKey="pomodoros" fill={`var(--color-pomodoros)`} radius={4} name="Pomodoros"/>
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
