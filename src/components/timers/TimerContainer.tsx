"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Stopwatch from "./Stopwatch";
import PomodoroTimer from "./PomodoroTimer";
import { Timer, Clock4 } from "lucide-react";

export default function TimerContainer() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs defaultValue="pomodoro" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pomodoro" className="py-3 text-base">
            <Clock4 className="mr-2 h-5 w-5" /> Pomodoro
          </TabsTrigger>
          <TabsTrigger value="stopwatch" className="py-3 text-base">
            <Timer className="mr-2 h-5 w-5" /> Stopwatch
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pomodoro">
          <PomodoroTimer />
        </TabsContent>
        <TabsContent value="stopwatch">
          <Stopwatch />
        </TabsContent>
      </Tabs>
    </div>
  );
}
