
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/lib/utils';
import type { FeatureKey } from '@/types';
import * as LucideIcons from 'lucide-react';

import { useSessions, ACTUAL_LEVEL_THRESHOLDS, TITLES, XP_PER_MINUTE_FOCUS, STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS, ALL_SKILLS } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatTime } from '@/lib/utils';

// Define NavItem type and constant data structure OUTSIDE the component
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  hotkey: string;
  featureKey: FeatureKey;
  alwaysVisible?: boolean;
}

const allPossibleNavItems: NavItem[] = [
    { href: '/', label: 'Timers', icon: LucideIcons.BookOpen, hotkey: 't', featureKey: 'timers', alwaysVisible: true },
    { href: '/skill-tree', label: 'Skill Tree', icon: LucideIcons.Network, hotkey: 'k', featureKey: 'skill-tree', alwaysVisible: true },
    { href: '/stats', label: 'Stats', icon: LucideIcons.BarChart3, hotkey: 's', featureKey: 'stats' },
    { href: '/ambiance', label: 'Ambiance', icon: LucideIcons.Wind, hotkey: 'm', featureKey: 'ambiance' },
    { href: '/notepad', label: 'Notepad', icon: LucideIcons.NotebookText, hotkey: 'n', featureKey: 'notepad' },
    { href: '/challenges', label: 'Challenges', icon: LucideIcons.CalendarCheck, hotkey: 'h', featureKey: 'challenges' },
    { href: '/capitalist', label: 'Capitalist', icon: LucideIcons.Briefcase, hotkey: 'c', featureKey: 'capitalist' },
    { href: '/shop', label: 'Shop', icon: LucideIcons.ShoppingCart, hotkey: 'x', featureKey: 'shop' },
    { href: '/countdown', label: 'Countdown', icon: LucideIcons.Timer, hotkey: 'd', featureKey: 'countdown' },
    { href: '/achievements', label: 'Achievements', icon: LucideIcons.Award, hotkey: 'v', featureKey: 'achievements' },
    { href: '/about', label: 'Guide', icon: LucideIcons.HelpCircle, hotkey: 'g', featureKey: 'about' },
];

const hotkeyNavMap = allPossibleNavItems.reduce((acc, item) => {
    acc[item.hotkey] = item;
    return acc;
}, {} as Record<string, NavItem>);

const HOTKEY_STRING = Object.keys(hotkeyNavMap).join(',');


export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { userProfile, getAppliedBoost } = useSessions();
    const { unlockedSkillIds, level, xp, skillPoints, cash, currentStreak, longestStreak, title } = userProfile;

    const { mainBarItems, dropdownItems } = useMemo(() => {
        const isFeatureUnlocked = (featureKey: FeatureKey) => {
            if (featureKey === 'timers' || featureKey === 'skill-tree') return true;
            const skill = ALL_SKILLS.find(s => s.unlocksFeature === featureKey);
            return skill ? unlockedSkillIds.includes(skill.id) : false;
        };
        
        const visibleNavItems = allPossibleNavItems.filter(item => isFeatureUnlocked(item.featureKey));

        const main = visibleNavItems.filter(item => item.href === '/' || item.href === '/skill-tree');
        const dropdown = visibleNavItems.filter(item => item.href !== '/' && item.href !== '/skill-tree');
        
        return { mainBarItems: main, dropdownItems: dropdown };
    }, [unlockedSkillIds]);


    useHotkeys(
        HOTKEY_STRING,
        (event, handler) => {
            const navItem = hotkeyNavMap[handler.key];
            if (navItem) {
                // Check visibility inside the callback
                const skill = ALL_SKILLS.find(s => s.unlocksFeature === navItem.featureKey);
                const isVisible = navItem.alwaysVisible || (skill ? unlockedSkillIds.includes(skill.id) : false);
                
                if (isVisible) {
                    router.push(navItem.href);
                }
            }
        },
        { preventDefault: true },
        [router, unlockedSkillIds]
    );

    const currentLevelXpStart = ACTUAL_LEVEL_THRESHOLDS[level - 1] ?? 0;
    const nextLevelXpTarget = level < ACTUAL_LEVEL_THRESHOLDS.length ? ACTUAL_LEVEL_THRESHOLDS[level] : xp;
    const xpIntoCurrentLevel = xp - currentLevelXpStart;
    const xpForNextLevelSegment = nextLevelXpTarget - currentLevelXpStart;
    const xpProgressPercent = xpForNextLevelSegment > 0 ? Math.min(100, Math.floor((xpIntoCurrentLevel / xpForNextLevelSegment) * 100)) : (level >= ACTUAL_LEVEL_THRESHOLDS.length ? 100 : 0);
    const userTitle = title || TITLES[TITLES.length - 1];
    const xpToNextLevelRaw = nextLevelXpTarget - xp;
    const baseStreakBonus = Math.min(currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
    const skillXpBoost = getAppliedBoost('xp');
    const effectiveXpPerMinute = XP_PER_MINUTE_FOCUS * (1 + baseStreakBonus + skillXpBoost);
    const timeToLevelUpSeconds = xpToNextLevelRaw > 0 && effectiveXpPerMinute > 0 ? (xpToNextLevelRaw / effectiveXpPerMinute) * 60 : 0;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
                <Link href="/" className="mr-4 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary transition-transform duration-300 hover:rotate-12">
                      <path d="M12.97 2.05c-1.3-.23-2.6.2-3.48.98L5.29 6.29c-.31.25-.53.58-.63.95L3.11 12.5c-.23 1.3.2 2.6.98 3.48l3.26 4.2c.25.31.58.53.95.63l5.26 1.55c1.3.23 2.6-.2 3.48-.98l4.2-3.26c.31-.25.53-.58.63-.95l1.55-5.26c.23-1.3-.2-2.6-.98-3.48l-3.26-4.2c-.25-.31-.58-.53-.95-.63L12.97 2.05zm-1.88 6.4c.55-.55 1.44-.55 1.98 0l2.36 2.36c.55.55.55 1.44 0 1.98L13.07 15.1c-.55.55-1.44.55-1.98 0l-2.36-2.36c-.55-.55-.55-1.44 0-1.98l2.36-2.36z" />
                    </svg>
                    <span className="font-bold text-xl font-headline hidden sm:inline-block">StudyFlow</span>
                </Link>

                <div className="flex-1 min-w-0">
                    <nav className="flex items-center space-x-1">
                        {mainBarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <TooltipProvider key={item.href} delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" asChild className={cn("text-sm font-medium transition-colors hover:text-primary shrink-0 px-2 sm:px-3 py-1.5 btn-animated", pathname === item.href ? "text-primary bg-primary/10" : "text-foreground/70 hover:text-foreground")}>
                                                <Link href={item.href} className="flex items-center">
                                                    <Icon className="h-5 w-5" />
                                                    <span className="hidden md:inline-block ml-2">{item.label}</span>
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>{item.label}<span className="text-xs p-1 bg-muted rounded-sm ml-1">{item.hotkey.toUpperCase()}</span></p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        })}

                        {dropdownItems.length > 0 && (
                            <DropdownMenu>
                                <TooltipProvider delayDuration={300}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary shrink-0 px-2 sm:px-3 py-1.5 btn-animated text-foreground/70 hover:text-foreground">
                                                    <LucideIcons.MoreVertical className="h-5 w-5 md:mr-2" />
                                                    <span className="hidden md:inline-block">More</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent><p>More Options</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <DropdownMenuContent align="start" className="mt-1">
                                    {dropdownItems.map((item) => {
                                        const Icon = item.icon;
                                        return (
                                            <DropdownMenuItem key={item.href} asChild className="btn-animated cursor-pointer group">
                                                <Link href={item.href} className="flex items-center w-full">
                                                    <Icon className="h-5 w-5" />
                                                    <span className="ml-2">{item.label}</span>
                                                    <span className="text-xs p-1 bg-muted rounded-sm ml-auto text-muted-foreground group-hover:text-foreground group-focus:text-foreground">
                                                        {item.hotkey.toUpperCase()}
                                                    </span>
                                                </Link>
                                            </DropdownMenuItem>
                                        );
                                    })}
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
                                    <LucideIcons.Gem className="h-4 w-4 text-yellow-400" />
                                    <span>{skillPoints || 0}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom"><p>Skill Points</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-1.5 text-accent font-medium text-xs px-2 py-1 rounded-md cursor-pointer h-auto btn-animated hover:bg-accent/20">
                                <span className="font-bold text-primary">Lvl {level}</span>
                                <span>{userTitle}</span>
                                <LucideIcons.ChevronDown className="h-3 w-3" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-3 bg-popover text-popover-foreground">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">Level {level}: {userTitle}</p>
                                <Progress value={xpProgressPercent} className="h-1.5" />
                                <p className="text-xs text-muted-foreground">
                                    {xpIntoCurrentLevel.toLocaleString()} / {(xpForNextLevelSegment > 0 ? xpForNextLevelSegment.toLocaleString() : 'Max')} XP
                                </p>
                                {level < ACTUAL_LEVEL_THRESHOLDS.length && xpToNextLevelRaw > 0 && timeToLevelUpSeconds > 0 && (
                                    <p className="text-xs text-primary">
                                        Approx. {formatTime(timeToLevelUpSeconds, true)} focus to next level
                                    </p>
                                )}
                                {level >= ACTUAL_LEVEL_THRESHOLDS.length && (
                                    <p className="text-xs text-primary">Max Level Reached!</p>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center space-x-1 text-xs cursor-default bg-muted/50 px-2 py-1 rounded-md">
                                    <LucideIcons.Flame className="h-4 w-4 text-orange-500" />
                                    <span>{currentStreak}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>Study Streak: {currentStreak} days</p>
                                <p>Longest: {longestStreak} days</p>
                                {currentStreak > 0 && <p>Bonus: +{(Math.min(currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS) * 100).toFixed(0)}% XP/Cash</p>}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="flex items-center space-x-1 text-xs bg-muted/50 px-2 py-1 rounded-md cursor-default">
                                    <LucideIcons.DollarSign className="h-4 w-4 text-green-500" />
                                    <span>{cash.toLocaleString()}</span>
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
