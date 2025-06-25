
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Stopwatch from "./Stopwatch";
import PomodoroTimer from "./PomodoroTimer";
import { Timer, Clock4, Hourglass } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useState, useEffect } from "react";

export default function TimerContainer() {
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pomodoro" className="py-2 text-base md:py-3 btn-animated">
            <Clock4 className="mr-2 h-5 w-5" /> Pomodoro
          </TabsTrigger>
          <TabsTrigger value="stopwatch" className="py-2 text-base md:py-3 btn-animated">
            <Timer className="mr-2 h-5 w-5" /> Stopwatch
          </TabsTrigger>
          <TabsTrigger value="countdown" className="py-2 text-base md:py-3 btn-animated">
            <Hourglass className="mr-2 h-5 w-5" /> Countdown
          </TabsTrigger>
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
