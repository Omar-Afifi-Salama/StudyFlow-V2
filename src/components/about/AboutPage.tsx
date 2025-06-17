
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Zap, Building, Star } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <Card className="shadow-lg w-full">
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
            <li><strong>Pomodoro Timer:</strong> Customizable work and break intervals to maintain focus.</li>
            <li><strong>Stopwatch:</strong> A straightforward timer for flexible study sessions.</li>
            <li><strong>Session Logging:</strong> Automatically log your completed sessions to review your efforts.</li>
            <li><strong>Statistics Dashboard:</strong> Visualize your study habits and track your productivity over time.</li>
            <li><strong>XP & Leveling System:</strong> Earn experience points and cash for studying, level up, and unlock titles.</li>
            <li><strong>Skin Shop:</strong> Personalize your app with cosmetic skins purchased with in-app cash, including a Dark Mode.</li>
            <li><strong>Capitalist Corner:</strong> A fun minigame to invest your earnings and potentially grow your cash reserves.</li>
            <li><strong>Notepad:</strong> Keep your tasks, notes, goals, and important links all in one place.</li>
            <li><strong>Daily Challenges:</strong> Complete daily tasks for bonus XP and cash rewards.</li>
          </ul>
        </section>
        
        <section className="text-center">
            <Image 
                src="https://placehold.co/600x300.png" 
                alt="Study illustration" 
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
          <div className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-lg shadow-xl text-white my-4 border-2 border-red-500">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-center">Special Thanks To Our Sponsor</h3>
              <Star className="h-8 w-8 text-yellow-400 ml-3" />
            </div>
            <div className="text-center">
              <Building className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-3xl font-semibold" style={{ color: '#FFFFFF' }}>شركة التقوى لتوصيل المأكولات</p>
              <p className="text-sm mt-2" style={{ color: '#E0E0E0' }}>Your trusted partner for delicious food delivery.</p>
            </div>
            <div className="mt-6 flex justify-center space-x-3">
                <div className="w-10 h-2 bg-red-600 rounded-full"></div>
                <div className="w-10 h-2 bg-white rounded-full"></div>
                <div className="w-10 h-2 bg-black border border-gray-600 rounded-full"></div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2 text-primary">Powered By</h2>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Next.js, React, Tailwind CSS, ShadCN UI, Genkit (for potential AI features)</span>
          </div>
        </section>
        
        <section className="text-sm text-muted-foreground text-center pt-4">
          <p>&copy; {new Date().getFullYear()} StudyFlow App. Happy Studying!</p>
        </section>
      </CardContent>
    </Card>
  );
}
