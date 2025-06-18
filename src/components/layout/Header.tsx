
"use client";

import Link from 'next/link';
import { BookOpen, BarChart3, Wind, NotebookText, CalendarCheck, ShoppingBag, Briefcase, Timer as CountdownIcon, UserCircle, Info, Star, DollarSign, Flame, MoreVertical, Sparkles, ShieldCheck, Settings, HelpCircle, Network, Grid, CheckSquare2, StickyNote, Target as TargetLucide, Link as LinkLucideIcon, Brain as BrainLucide, ListChecks as HabitIconLucide, CalendarClock as CalendarClockLucide, Grid as GridLucide, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSessions, ACTUAL_LEVEL_THRESHOLDS, TITLES, XP_PER_MINUTE_FOCUS, STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS } from '@/contexts/SessionContext';
import type { FeatureKey } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatTime } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  hotkey: string;
  featureKey: FeatureKey;
  alwaysVisible?: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile, isFeatureUnlocked, getAllSkills, isSkillUnlocked } = useSessions();

  const allPossibleNavItems: NavItem[] = [
    { href: '/', label: 'Timers', icon: <BookOpen className="h-5 w-5" />, hotkey: 't', featureKey: 'timers', alwaysVisible: true },
    { href: '/skill-tree', label: 'Skill Tree', icon: <Network className="h-5 w-5" />, hotkey: 'k', featureKey: 'skill-tree', alwaysVisible: true },
    { href: '/stats', label: 'Stats', icon: <BarChart3 className="h-5 w-5" />, hotkey: 's', featureKey: 'stats' },
    { href: '/ambiance', label: 'Ambiance', icon: <Wind className="h-5 w-5" />, hotkey: 'm', featureKey: 'ambiance' },
    { href: '/notepad', label: 'Notepad', icon: <NotebookText className="h-5 w-5" />, hotkey: 'n', featureKey: 'notepad' },
    { href: '/challenges', label: 'Challenges', icon: <CalendarCheck className="h-5 w-5" />, hotkey: 'h', featureKey: 'challenges' },
    { href: '/shop', label: 'Shop', icon: <ShoppingBag className="h-5 w-5" />, hotkey: 'x', featureKey: 'shop' },
    { href: '/capitalist', label: 'Capitalist', icon: <Briefcase className="h-5 w-5" />, hotkey: 'c', featureKey: 'capitalist' },
    { href: '/countdown', label: 'Countdown', icon: <CountdownIcon className="h-5 w-5" />, hotkey: 'd', featureKey: 'countdown' },
    { href: '/achievements', label: 'Achievements', icon: <UserCircle className="h-5 w-5" />, hotkey: 'v', featureKey: 'achievements' },
    { href: '/about', label: 'About', icon: <Info className="h-5 w-5" />, hotkey: 'a', featureKey: 'about' },
  ];

  const visibleNavItems = allPossibleNavItems.filter(item => item.alwaysVisible || isFeatureUnlocked(item.featureKey));

  const mainBarItemHrefs = ['/', '/skill-tree']; 
  const mainNavItems: NavItem[] = visibleNavItems.filter(item => mainBarItemHrefs.includes(item.href));
  
  const dropdownNavItems: NavItem[] = visibleNavItems.filter(item => !mainBarItemHrefs.includes(item.href));


  allPossibleNavItems.forEach(item => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useHotkeys(item.hotkey, (e) => {
      e.preventDefault();
      if (item.alwaysVisible || isFeatureUnlocked(item.featureKey)) {
        router.push(item.href);
      }
    }, { preventDefault: true }, [isFeatureUnlocked, router, item.alwaysVisible, item.featureKey, item.href]);
  });

  const currentLevelXpStart = ACTUAL_LEVEL_THRESHOLDS[userProfile.level - 1] ?? 0;
  const nextLevelXpTarget = userProfile.level < ACTUAL_LEVEL_THRESHOLDS.length ? ACTUAL_LEVEL_THRESHOLDS[userProfile.level] : userProfile.xp;
  const xpIntoCurrentLevel = userProfile.xp - currentLevelXpStart;
  const xpForNextLevelSegment = nextLevelXpTarget - currentLevelXpStart;
  const xpProgressPercent = xpForNextLevelSegment > 0 ? Math.min(100, Math.floor((xpIntoCurrentLevel / xpForNextLevelSegment) * 100)) : (userProfile.level >= ACTUAL_LEVEL_THRESHOLDS.length ? 100 : 0);
  const userTitle = TITLES[userProfile.level - 1] || TITLES[TITLES.length - 1];

  const xpToNextLevelRaw = nextLevelXpTarget - userProfile.xp;
  const effectiveXpPerMinute = XP_PER_MINUTE_FOCUS * (1 + Math.min(userProfile.currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS)); 
  const timeToLevelUpSeconds = xpToNextLevelRaw > 0 && effectiveXpPerMinute > 0 ? (xpToNextLevelRaw / effectiveXpPerMinute) * 60 : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary transition-transform duration-300 hover:rotate-12">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
          <span className="font-bold text-xl font-headline hidden sm:inline-block">StudyFlow</span>
        </Link>

        <div className="flex-1 min-w-0">
          <nav className="flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <TooltipProvider key={item.href} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      asChild
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary shrink-0 px-2 sm:px-3 py-1.5 btn-animated",
                        pathname === item.href ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        <span className="hidden md:inline-block ml-2">{item.label}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {item.label}
                      {(() => {
                        const hotkeyVal = item?.hotkey;
                        if (typeof hotkeyVal === 'string' && hotkeyVal.length > 0) {
                          return <span className="text-xs p-1 bg-muted rounded-sm ml-1">{hotkeyVal.toUpperCase()}</span>;
                        }
                        return null;
                      })()}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {dropdownNavItems.length > 0 && (
              <DropdownMenu>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-sm font-medium transition-colors hover:text-primary shrink-0 px-2 sm:px-3 py-1.5 btn-animated text-foreground/70 hover:text-foreground"
                        >
                          <MoreVertical className="h-5 w-5 md:mr-2" />
                          <span className="hidden md:inline-block">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent><p>More Options</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                  {dropdownNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="btn-animated cursor-pointer">
                      <Link href={item.href} className="flex items-center w-full">
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                        {(() => {
                            const hotkeyVal = item?.hotkey;
                            if (typeof hotkeyVal === 'string' && hotkeyVal.length > 0) {
                              return <span className="text-xs p-1 bg-muted rounded-sm ml-auto">{hotkeyVal.toUpperCase()}</span>;
                            }
                            return null;
                          })()}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-1 md:space-x-2 ml-auto pl-1">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                 <div className="flex items-center space-x-1 text-xs bg-muted/50 px-2 py-1 rounded-md cursor-default">
                    <Star className="h-4 w-4 text-yellow-400" /> 
                    <span>{userProfile.skillPoints || 0}</span>
                  </div>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Skill Points</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1.5 text-xs text-accent font-medium px-2 py-1 rounded-md cursor-pointer h-auto btn-animated hover:bg-accent/20">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>{userTitle}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-3 bg-popover text-popover-foreground">
                <div className="space-y-1">
                    <p className="text-sm font-semibold">Level {userProfile.level}: {userTitle}</p>
                    <Progress value={xpProgressPercent} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">
                        {xpIntoCurrentLevel.toLocaleString()} / {xpForNextLevelSegment > 0 ? xpForNextLevelSegment.toLocaleString() : userProfile.xp.toLocaleString()} XP
                    </p>
                    {userProfile.level < ACTUAL_LEVEL_THRESHOLDS.length && xpForNextLevelSegment > 0 && timeToLevelUpSeconds > 0 && (
                        <p className="text-xs text-primary">
                            Approx. {formatTime(timeToLevelUpSeconds, true)} focus to next level
                        </p>
                    )}
                </div>
            </PopoverContent>
          </Popover>


           <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-xs cursor-default bg-muted/50 px-2 py-1 rounded-md">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>{userProfile.currentStreak}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Study Streak: {userProfile.currentStreak} days</p>
                <p>Longest: {userProfile.longestStreak} days</p>
                {userProfile.currentStreak > 0 && <p>Bonus: +{(Math.min(userProfile.currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS) * 100).toFixed(0)}% XP/Cash</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-xs bg-muted/50 px-2 py-1 rounded-md cursor-default">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span>{userProfile.cash.toLocaleString()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom"><p>Cash Balance</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
}

