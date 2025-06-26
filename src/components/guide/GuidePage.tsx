
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TITLES, ACTUAL_LEVEL_THRESHOLDS, XP_PER_MINUTE_FOCUS, CASH_PER_5_MINUTES_FOCUS } from "@/contexts/SessionContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSessions } from "@/contexts/SessionContext";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatTime } from "@/lib/utils";
import { Textarea } from "../ui/textarea";

const CASH_REWARD_PER_LEVEL = 500;
const RESET_PASSWORD = "studyflowreset"; // Hardcoded password

function OwnerControlsSection() {
    const { userProfile, requestHardReset, cancelHardReset, dangerouslySetUserProfile } = useSessions();
    const [resetTimeLeft, setResetTimeLeft] = useState(0);
    const [passwordInput, setPasswordInput] = useState("");
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [jsonData, setJsonData] = useState("");
    const [isJsonEditorOpen, setIsJsonEditorOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (userProfile.hardResetRequestTime) {
            const interval = setInterval(() => {
                const timeLeft = Math.max(0, userProfile.hardResetRequestTime! + 10 * 60 * 1000 - Date.now());
                setResetTimeLeft(timeLeft / 1000);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [userProfile.hardResetRequestTime]);

    const handleResetRequest = () => {
        requestHardReset();
    };

    const handleVerifyPassword = (onSuccess: () => void) => {
        if (passwordInput === RESET_PASSWORD) {
            setPasswordInput("");
            onSuccess();
        } else {
            toast({
                title: "Incorrect Password",
                description: "The password for this owner action is incorrect.",
                variant: "destructive",
            });
        }
    };
    
    const openJsonEditor = () => {
        setJsonData(JSON.stringify(userProfile, null, 2));
        setIsJsonEditorOpen(true);
    }
    
    const handleSaveJson = () => {
        try {
            const newProfile = JSON.parse(jsonData);
            dangerouslySetUserProfile(newProfile);
            toast({ title: "Success", description: "User data has been updated." });
            setIsJsonEditorOpen(false);
        } catch (error) {
            toast({ title: "Invalid JSON", description: "Could not parse the data. Please check the format.", variant: "destructive" });
        }
    };

    if (userProfile.hardResetRequestTime) {
      return (
        <div className="flex flex-col items-center gap-2 mt-4 p-4 border border-destructive rounded-lg">
          <p className="text-destructive text-sm font-semibold text-center">Hard reset pending! Time left: {formatTime(resetTimeLeft, true)}</p>
          <Button onClick={cancelHardReset} variant="secondary" size="sm" className="btn-animated">Cancel Reset</Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        {/* Hard Reset Dialog */}
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Hard Reset All Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete ALL data. This is irreversible and will take 10 minutes to complete. Please enter the master password to proceed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input 
                    type="password"
                    placeholder="Enter reset password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleVerifyPassword(handleResetRequest)}>Confirm & Start Reset</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        {/* JSON Editor Dialog */}
         <AlertDialog open={isJsonEditorOpen} onOpenChange={setIsJsonEditorOpen}>
            <AlertDialogTrigger asChild>
                 <Button variant="outline" className="w-full md:w-auto">
                    Edit User Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-2xl">
                 <AlertDialogHeader>
                    <AlertDialogTitle>Edit Raw User Data</AlertDialogTitle>
                    <AlertDialogDescription>
                        Warning: Modifying this data directly can cause unexpected issues. Proceed with caution.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="min-h-[400px] font-mono text-xs"
                    aria-label="User profile JSON data"
                />
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSaveJson}>Save Changes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      </div>
    );
}

export default function GuidePage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const levelData = TITLES.map((title, index) => {
    const level = index + 1;
    if (level > 100) return null;
    const xpRequired = ACTUAL_LEVEL_THRESHOLDS[index];
    const prevXp = index > 0 ? ACTUAL_LEVEL_THRESHOLDS[index - 1] : 0;
    const xpForThisLevel = xpRequired - prevXp;
    const minutesToLevelUp = xpForThisLevel / XP_PER_MINUTE_FOCUS;
    
    return {
      level,
      title,
      xpRequired: xpRequired.toLocaleString(),
      minutesToLevelUp: minutesToLevelUp.toLocaleString(),
    };
  }).filter(Boolean);

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
                    StudyFlow is a gamified productivity application designed to make studying more engaging and rewarding. By tracking your focus time with our built-in timers (Pomodoro, Stopwatch, and Countdown), you earn Experience Points (XP) and Cash.
                </p>
                <br/>
                <p className="text-muted-foreground">
                    As you gain XP, you'll level up, unlocking new titles, features, and passive bonuses through the Skill Tree. Use your earned Cash to buy cosmetic skins, invest in the Capitalist Corner, and more. The goal is to provide a structured, motivating environment that helps you build consistent study habits and achieve your academic goals. Happy studying!
                </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-semibold">Levels, Titles & XP</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4 text-muted-foreground">
                Level up by earning XP from study sessions. The time required to level up increases by 5 minutes with each level you gain, starting from 25 minutes for Level 1. Each new level also grants you a new title, Skill Points, and a cash reward. The cash reward for reaching level 'N' is <span className="font-semibold text-primary">N * ${CASH_REWARD_PER_LEVEL}</span>.
              </p>
              <div className="max-h-[500px] overflow-y-auto pr-2">
                 <Table>
                    <TableHeader className="sticky top-0 bg-muted">
                        <TableRow>
                        <TableHead className="w-[100px]">Level</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">Total XP Needed</TableHead>
                        <TableHead className="text-right">Base Minutes to Level Up</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {levelData.map((data) => (
                        <TableRow key={data.level}>
                            <TableCell className="font-medium">{data.level}</TableCell>
                            <TableCell>{data.title}</TableCell>
                            <TableCell className="text-right">{data.xpRequired}</TableCell>
                            <TableCell className="text-right">{data.minutesToLevelUp}</TableCell>
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
                    <li><strong>XP from Study:</strong> You earn <span className="font-semibold text-primary">{XP_PER_MINUTE_FOCUS} XP per minute</span> of focused study (Pomodoro Focus, Stopwatch, and Countdown).</li>
                    <li><strong>Cash from Study:</strong> You earn <span className="font-semibold text-primary">${CASH_PER_5_MINUTES_FOCUS.toLocaleString()} Cash per 5 minutes</span> of focused study.</li>
                    <li><strong>Daily Login Bonus:</strong> Get <span className="font-semibold text-primary">$200</span> just for logging in, plus a bonus for your login streak!</li>
                    <li><strong>Level Up Bonus:</strong> Receive a cash reward equal to your <span className="font-semibold text-primary">New Level x ${CASH_REWARD_PER_LEVEL}</span>.</li>
                    <li><strong>Streak Bonus:</strong> For each consecutive day you study, you gain a +1% bonus to XP and Cash, up to a maximum of +20%.</li>
                    <li><strong>Daily Challenges:</strong> Complete daily challenges for significant XP and Cash rewards. Rewards scale with your level!</li>
                    <li><strong>Achievements:</strong> Unlock achievements for one-time cash rewards.</li>
                    <li><strong>Capitalist Corner:</strong> Invest your cash for potential high returns (or losses!).</li>
                 </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-semibold">Key Features</AccordionTrigger>
            <AccordionContent>
               <ul className="list-disc list-inside space-y-2 pl-4">
                <li><strong>Flexible Timers:</strong> Pomodoro, Stopwatch, and a simple Countdown timer. Only one can run at a time to ensure focus.</li>
                <li><strong>Session Logging & Stats:</strong> Track your efforts and visualize your habits with a detailed dashboard and heatmap.</li>
                <li><strong>XP & Leveling System:</strong> Earn experience points and cash for studying, level up, and unlock titles.</li>
                <li><strong>Skill Tree:</strong> Unlock app features and passive bonuses using Skill Points earned from leveling up.</li>
                <li><strong>Ambiance Mixer:</strong> Create your perfect study soundscape with various ambient sounds.</li>
                <li><strong>Skin Shop:</strong> Personalize your app with a variety of Light and Dark themes.</li>
                <li><strong>Capitalist Corner:</strong> A fun minigame to invest your earnings in businesses and hourly bonds.</li>
                <li><strong>Productivity Hub:</strong> Includes Checklist, Notes, Goals, Links, Revision Hub, Habits, Events Countdown, and Eisenhower Matrix.</li>
                <li><strong>Daily Challenges & Offers:</strong> Complete varied tasks for bonus rewards and choose strategic daily trade-offs.</li>
                <li><strong>Achievements & Badges:</strong> Unlock milestones and showcase your dedication.</li>
                <li><strong>Infamy System:</strong> After reaching Level 100, reset for powerful, permanent upgrades.</li>
                <li><strong>Hotkeys:</strong> Navigate and control timers efficiently with keyboard shortcuts.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
            
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-semibold">A Big Thank You!</AccordionTrigger>
            <AccordionContent>
                <p className="text-muted-foreground">
                    This app wouldn't be what it is without the invaluable feedback and brilliant ideas from its dedicated playtesters. Your insights have helped shape features, squash bugs, and make StudyFlow a better tool for everyone.
                </p>
                <br/>
                <p className="font-semibold text-center text-primary">
                    A special shoutout to all of you!
                </p>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-xl font-semibold">Owner Controls</AccordionTrigger>
            <AccordionContent className="flex flex-col items-center">
              <p className="text-muted-foreground mb-4 text-center">
                  These are developer-only tools for managing app data. Use with extreme caution.
              </p>
              <OwnerControlsSection />
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

    