
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Zap, Users, Star, Award } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function AboutPageContent() { // Renamed to AboutPageContent
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Card className="shadow-lg w-full card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Info className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">About StudyFlow</CardTitle>
            <CardDescription>Your companion for focused and productive study sessions.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 text-base leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-primary">Welcome to StudyFlow!</h2>
          <p>
            StudyFlow is designed to help you manage your study time effectively, stay motivated,
            and track your progress. Whether you prefer the structured Pomodoro Technique or
            a simple stopwatch, StudyFlow provides the tools you need to succeed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2 text-primary">Key Features</h2>
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
        </section>

        <section className="text-center">
            <Image
                src="https://placehold.co/600x300/6FB5F0/FFFFFF.png"
                alt="Focused student at a desk"
                width={600}
                height={300}
                className="rounded-lg shadow-md mx-auto"
                data-ai-hint="study desk illustration"
            />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2 text-primary">Our Mission</h2>
          <p>
            We believe that effective study habits are key to academic and personal growth.
            StudyFlow aims to make the process of studying more engaging, rewarding, and organized,
            helping you achieve your learning objectives.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2 text-primary">Sponsor Acknowledgement</h2>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-yellow-900 dark:to-yellow-800 p-6 rounded-lg shadow-xl my-4 border-2 border-yellow-500 dark:border-yellow-400">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-300 mr-3" />
              <h3 className="text-2xl font-bold text-center" style={{ color: 'hsl(var(--foreground))' }}>Special Thanks To Our Sponsor</h3>
              <Award className="h-8 w-8 text-yellow-600 dark:text-yellow-300 ml-3" />
            </div>
            <div className="text-center">
              <svg width="240" height="80" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" className="rounded-md shadow-sm mx-auto mb-3">
                <rect width="100%" height="100%" fill="black"/>
                <text x="50%" y="40%" dominantBaseline="middle" textAnchor="middle" style={{ fontFamily: 'Arial, "Noto Sans Arabic", sans-serif', fontSize: '32px', direction: 'rtl' }}>
                  <tspan fill="white">شركة </tspan>
                  <tspan fill="#FF0000" fontWeight="bold">التقوى</tspan>
                </text>
                <text x="50%" y="75%" dominantBaseline="middle" textAnchor="middle" style={{ fontFamily: 'Arial, "Noto Sans Arabic", sans-serif', fontSize: '18px', direction: 'rtl' }} fill="white">
                  لتوصيل المأكولات
                </text>
              </svg>
              <p className="text-sm mt-2 opacity-80" style={{ color: 'hsl(var(--foreground))' }}>Your trusted partner for delicious food delivery.</p>
            </div>
            <div className="mt-6 flex justify-center space-x-3">
                <div className="w-10 h-2 bg-yellow-600 rounded-full"></div>
                <div className="w-10 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-10 h-2 bg-yellow-700 rounded-full"></div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2 text-primary">Powered By</h2>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Next.js, React, Tailwind CSS, ShadCN UI</span>
          </div>
        </section>

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
