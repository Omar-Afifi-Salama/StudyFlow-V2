
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TITLES, ACTUAL_LEVEL_THRESHOLDS, XP_PER_MINUTE_FOCUS, CASH_PER_5_MINUTES_FOCUS } from "@/contexts/SessionContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CASH_REWARD_PER_LEVEL = 500;

export default function GuidePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const levelData = TITLES.map((title, index) => {
    const level = index + 1;
    const xpRequired = ACTUAL_LEVEL_THRESHOLDS[index];
    const hoursToReach = xpRequired > 0 ? (xpRequired / XP_PER_MINUTE_FOCUS) / 60 : 0;
    return {
      level,
      title,
      xpRequired: xpRequired.toLocaleString(),
      hoursToReach: hoursToReach.toFixed(1),
    };
  });

  return (
    <Card className="shadow-lg w-full card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <HelpCircle className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">App Guide</CardTitle>
            <CardDescription>Your reference for levels, features, and how StudyFlow works.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-base leading-relaxed">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-intro">
           <AccordionItem value="item-intro">
            <AccordionTrigger className="text-xl font-semibold">What is StudyFlow?</AccordionTrigger>
            <AccordionContent>
                <p className="text-muted-foreground">
                    StudyFlow is a gamified productivity application designed to make studying more engaging and rewarding. By tracking your focus time with our built-in timers (Pomodoro and Stopwatch), you earn Experience Points (XP) and Cash.
                </p>
                <br/>
                <p className="text-muted-foreground">
                    As you gain XP, you'll level up, unlocking new titles, features, and passive bonuses through the Skill Tree. Use your earned Cash to buy cosmetic skins, invest in the Capitalist Corner, and more. The goal is to provide a structured, motivating environment that helps you build consistent study habits and achieve your academic goals. Happy studying!
                </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-semibold">Levels, Titles & Hours</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4 text-muted-foreground">
                Level up by earning XP from study sessions. Each new level grants you a new title, Skill Points, and a cash reward. The cash reward for reaching level 'N' is <span className="font-semibold text-primary">N * ${CASH_REWARD_PER_LEVEL}</span>.
              </p>
              <div className="max-h-[500px] overflow-y-auto pr-2">
                 <Table>
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                        <TableHead className="w-[100px]">Level</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Total XP</TableHead>
                        <TableHead className="text-right">Total Hours (approx.)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {levelData.map((data) => (
                        <TableRow key={data.level}>
                            <TableCell className="font-medium">{data.level}</TableCell>
                            <TableCell>{data.title}</TableCell>
                            <TableCell className="text-right">{data.xpRequired}</TableCell>
                            <TableCell className="text-right">{data.hoursToReach}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-semibold">Earning XP & Cash</AccordionTrigger>
            <AccordionContent>
                 <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>XP from Study:</strong> You earn <span className="font-semibold text-primary">{XP_PER_MINUTE_FOCUS} XP per minute</span> of focused study (Pomodoro Focus & Stopwatch).</li>
                    <li><strong>Cash from Study:</strong> You earn <span className="font-semibold text-primary">${CASH_PER_5_MINUTES_FOCUS.toLocaleString()} Cash per 5 minutes</span> of focused study.</li>
                    <li><strong>Level Up Bonus:</strong> Receive a cash reward equal to your <span className="font-semibold text-primary">New Level x ${CASH_REWARD_PER_LEVEL}</span>.</li>
                    <li><strong>Streak Bonus:</strong> For each consecutive day you study, you gain a +1% bonus to XP and Cash, up to a maximum of +20%.</li>
                    <li><strong>Daily Challenges:</strong> Complete daily challenges for significant XP and Cash rewards.</li>
                    <li><strong>Achievements:</strong> Unlock achievements for one-time cash rewards.</li>
                    <li><strong>Capitalist Corner:</strong> Invest your cash for potential high returns (or losses!).</li>
                 </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-semibold">Key Features</AccordionTrigger>
            <AccordionContent>
               <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Flexible Timers:</strong> Pomodoro, Stopwatch, and a simple Countdown timer.</li>
                <li><strong>Session Logging & Stats:</strong> Track your efforts and visualize your habits with a detailed dashboard and heatmap.</li>
                <li><strong>XP & Leveling System:</strong> Earn experience points and cash for studying, level up, and unlock titles.</li>
                <li><strong>Skill Tree:</strong> Unlock app features and passive bonuses using Skill Points earned from leveling up.</li>
                <li><strong>Ambiance Mixer:</strong> Create your perfect study soundscape with various ambient sounds.</li>
                <li><strong>Skin Shop:</strong> Personalize your app with cosmetic skins, including Dark and Sepia themes.</li>
                <li><strong>Capitalist Corner:</strong> A fun minigame to invest your earnings.</li>
                <li><strong>Digital Notepad:</strong> Includes Checklist, Notes, Goals, Links, Revision Hub, Habits, and Events Countdown.</li>
                <li><strong>Daily Challenges:</strong> Complete varied tasks for bonus XP and cash rewards.</li>
                <li><strong>Achievements & Badges:</strong> Unlock milestones and showcase your dedication.</li>
                <li><strong>PWA Support:</strong> Install StudyFlow on your device for an app-like experience.</li>
                <li><strong>Hotkeys:</strong> Navigate and control timers efficiently with keyboard shortcuts.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="text-sm text-muted-foreground text-center pt-4">
          {currentYear ? (
            <p>&copy; {currentYear} StudyFlow App. Happy Studying!</p>
          ) : (
            <p>&copy; StudyFlow App. Happy Studying!</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
