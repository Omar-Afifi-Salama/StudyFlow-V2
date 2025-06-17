
"use client";

import Link from 'next/link';
import { BookOpen, BarChart3, ShoppingBag, Briefcase, NotebookText, Info, Gem, UserCircle, ShieldCheck, CheckSquare, CalendarCheck, DollarSign, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSessions, LEVEL_THRESHOLDS, TITLES } from '@/contexts/SessionContext'; 
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


export default function Header() {
  const pathname = usePathname();
  const { userProfile } = useSessions();

  const navItems = [
    { href: '/', label: 'Timers', icon: <BookOpen className="h-5 w-5 mr-2" /> },
    { href: '/stats', label: 'Stats', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
    { href: '/shop', label: 'Shop', icon: <ShoppingBag className="h-5 w-5 mr-2" /> },
    { href: '/capitalist', label: 'Capitalist', icon: <Briefcase className="h-5 w-5 mr-2" /> },
    { href: '/notepad', label: 'Notepad', icon: <NotebookText className="h-5 w-5 mr-2" /> },
    { href: '/challenges', label: 'Challenges', icon: <CalendarCheck className="h-5 w-5 mr-2" /> },
    { href: '/about', label: 'About', icon: <Info className="h-5 w-5 mr-2" /> },
  ];

  const currentLevelXpStart = LEVEL_THRESHOLDS[userProfile.level - 1] ?? 0;
  const nextLevelXpTarget = userProfile.level < LEVEL_THRESHOLDS.length 
                             ? LEVEL_THRESHOLDS[userProfile.level] 
                             : userProfile.xp; 
  const xpIntoCurrentLevel = userProfile.xp - currentLevelXpStart;
  const xpForNextLevel = nextLevelXpTarget - currentLevelXpStart;
  const xpProgressPercent = xpForNextLevel > 0 ? Math.min(100, Math.floor((xpIntoCurrentLevel / xpForNextLevel) * 100)) : (userProfile.level >= LEVEL_THRESHOLDS.length ? 100 : 0);
  const userTitle = TITLES[userProfile.level - 1] || TITLES[TITLES.length - 1];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span className="font-bold text-xl font-headline">StudyFlow</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 overflow-x-auto">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary shrink-0",
                pathname === item.href ? "text-primary" : "text-foreground/60"
              )}
            >
              <Link href={item.href} className="flex items-center">
                {item.icon}
                <span className="hidden sm:inline-block">{item.label}</span>
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-3 md:space-x-4 ml-auto pl-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-sm cursor-default">
                  <UserCircle className="h-5 w-5 text-primary" />
                  <span>Lvl {userProfile.level}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{userTitle}</p>
                <div className="w-40 mt-1">
                  <Progress value={xpProgressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center mt-0.5">
                    {xpIntoCurrentLevel} / {xpForNextLevel > 0 ? xpForNextLevel : 'MAX'} XP
                  </p>
                   <p className="text-xs text-muted-foreground text-center mt-0.5">
                    Total: {userProfile.xp} XP
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-sm cursor-default">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span>{userProfile.currentStreak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current Streak: {userProfile.currentStreak} days</p>
                <p>Longest Streak: {userProfile.longestStreak} days</p>
                {userProfile.currentStreak > 0 && <p>Bonus: +{(Math.min(userProfile.currentStreak * 1, 20)).toFixed(0)}% XP/Cash</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-1 text-sm">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span>{userProfile.cash.toLocaleString()}</span>
          </div>

           {userTitle && (
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="hidden md:flex items-center space-x-1 text-sm bg-accent/20 px-2 py-1 rounded-md cursor-default">
                            <ShieldCheck className="h-4 w-4 text-accent" />
                            <span className="text-accent font-medium">{userTitle}</span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Your current title: {userTitle}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
           )}
        </div>
      </div>
    </header>
  );
}
