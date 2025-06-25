
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Stopwatch from "./Stopwatch";
import PomodoroTimer from "./PomodoroTimer";
import { Timer, Clock4, Hourglass } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useState, useEffect } from "react";
import { useSessions } from "@/contexts/SessionContext";

const TABS_CONFIG = [
  { value: 'pomodoro', icon: Clock4, label: 'Pomodoro' },
  { value: 'stopwatch', icon: Timer, label: 'Stopwatch' },
  { value: 'countdown', icon: Hourglass, label: 'Countdown' },
];

export default function TimerContainer() {
  const { activeTimer } = useSessions();
  const [activeTab, setActiveTab] = useState('pomodoro');

  useEffect(() => {
    const savedTab = localStorage.getItem('lastTimerTab');
    if (savedTab && ['pomodoro', 'stopwatch', 'countdown'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (value: string) => {
    if (['pomodoro', 'stopwatch', 'countdown'].includes(value)) {
        setActiveTab(value);
        localStorage.setItem('lastTimerTab', value);
    }
  };

  const visibleTabs = activeTimer ? TABS_CONFIG.filter(tab => tab.value === activeTimer) : TABS_CONFIG;
  const gridColsClass = `grid-cols-${visibleTabs.length}`;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTimer || activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className={`grid w-full ${gridColsClass} mb-6`}>
            {visibleTabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <TabsTrigger key={tab.value} value={tab.value} className="py-2 text-base md:py-3 btn-animated" disabled={!!activeTimer && activeTimer !== tab.value}>
                        <Icon className="mr-2 h-5 w-5" /> {tab.label}
                    </TabsTrigger>
                );
            })}
        </TabsList>
        <TabsContent value="pomodoro">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="stopwatch">
          <Stopwatch />
        </TabsContent>
        <TabsContent value="countdown">
          <CountdownTimer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
