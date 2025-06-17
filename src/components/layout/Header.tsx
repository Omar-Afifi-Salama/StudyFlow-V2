
"use client";

import Link from 'next/link';
import { BookOpen, BarChart3, ShoppingBag, Briefcase, NotebookText, Info, Gem, UserCircle, ShieldCheck, CalendarCheck, DollarSign, Flame, Keyboard, Award, Sparkles, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSessions, LEVEL_THRESHOLDS, TITLES } from '@/contexts/SessionContext'; 
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/navigation';


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useSessions();

  const navItems = [
    { href: '/', label: 'Timers', icon: <BookOpen className="h-5 w-5 mr-2" />, hotkey: 't' },
    { href: '/stats', label: 'Stats', icon: <BarChart3 className="h-5 w-5 mr-2" />, hotkey: 's' },
    { href: '/ambiance', label: 'Ambiance', icon: <Wind className="h-5 w-5 mr-2" />, hotkey: 'm' }, // m for music/mood
    { href: '/shop', label: 'Shop', icon: <ShoppingBag className="h-5 w-5 mr-2" />, hotkey: 'x' },
    { href: '/capitalist', label: 'Capitalist', icon: <Briefcase className="h-5 w-5 mr-2" />, hotkey: 'c' },
    { href: '/notepad', label: 'Notepad', icon: <NotebookText className="h-5 w-5 mr-2" />, hotkey: 'n' },
    { href: '/challenges', label: 'Challenges', icon: <CalendarCheck className="h-5 w-5 mr-2" />, hotkey: 'h' },
    { href: '/achievements', label: 'Achievements', icon: <Award className="h-5 w-5 mr-2" />, hotkey: 'v' },
    { href: '/about', label: 'About', icon: <Info className="h-5 w-5 mr-2" />, hotkey: 'a' },
  ];

  navItems.forEach(item => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkeys(item.hotkey, (e) => { e.preventDefault(); router.push(item.href);}, { preventDefault: true });
  });


  const currentLevelXpStart = LEVEL_THRESHOLDS[userProfile.level - 1] ?? 0;
  const nextLevelXpTarget = userProfile.level < LEVEL_THRESHOLDS.length 
                             ? LEVEL_THRESHOLDS[userProfile.level] 
                             : userProfile.xp; 
  const xpIntoCurrentLevel = userProfile.xp - currentLevelXpStart;
  const xpForNextLevelRaw = nextLevelXpTarget - currentLevelXpStart;
  const xpForNextLevelDisplay = xpForNextLevelRaw > 0 ? xpForNextLevelRaw : 'MAX';

  const xpProgressPercent = xpForNextLevelRaw > 0 ? Math.min(100, Math.floor((xpIntoCurrentLevel / xpForNextLevelRaw) * 100)) : (userProfile.level >= LEVEL_THRESHOLDS.length ? 100 : 0);
  const userTitle = TITLES[userProfile.level - 1] || TITLES[TITLES.length - 1];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary">
            <path d="M12 2C6.48 2 2 6.48 2 2s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span className="font-bold text-xl font-headline">StudyFlow</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 overflow-x-auto">
          {navItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.label} <span className="text-xs p-1 bg-muted rounded-sm ml-1">{item.hotkey.toUpperCase()}</span></p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
        <div className="flex items-center space-x-2 md:space-x-3 ml-auto pl-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-xs cursor-default bg-muted/50 px-2 py-1 rounded-md">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span>Lvl {userProfile.level}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{userTitle}</p>
                <div className="w-40 mt-1">
                  <Progress value={xpProgressPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center mt-0.5">
                    {xpIntoCurrentLevel.toLocaleString()} / {typeof xpForNextLevelDisplay === 'number' ? xpForNextLevelDisplay.toLocaleString() : xpForNextLevelDisplay} XP
                  </p>
                   <p className="text-xs text-muted-foreground text-center mt-0.5">
                    Total: {userProfile.xp.toLocaleString()} XP
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-xs cursor-default bg-muted/50 px-2 py-1 rounded-md">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{userProfile.currentStreak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Current Streak: {userProfile.currentStreak} days</p>
                <p>Longest Streak: {userProfile.longestStreak} days</p>
                {userProfile.currentStreak > 0 && <p>Bonus: +{(Math.min(userProfile.currentStreak * 0.01, 0.20) * 100).toFixed(0)}% XP/Cash</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-1 text-xs bg-muted/50 px-2 py-1 rounded-md">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>{userProfile.cash.toLocaleString()}</span>
          </div>

           {userTitle && (
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="hidden md:flex items-center space-x-1 text-xs bg-accent/20 px-2 py-1 rounded-md cursor-default">
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
