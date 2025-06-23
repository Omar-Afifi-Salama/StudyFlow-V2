
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Timer } from "lucide-react";

export default function CountdownPageClient() {
  return (
    <div className="w-full flex items-center justify-center">
       <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full">
                    <Timer className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="mt-4 text-2xl">Countdown Timer Has Moved!</CardTitle>
                <CardDescription>
                    The Countdown Timer is no longer a separate page. It has been integrated as a core study tool on the main page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6 text-muted-foreground">
                    You can now find it as a third tab alongside the Pomodoro and Stopwatch timers. It now also grants XP and Cash for your study sessions!
                </p>
                <Button asChild>
                    <Link href="/">Go to Timers</Link>
                </Button>
            </CardContent>
       </Card>
    </div>
  );
}
