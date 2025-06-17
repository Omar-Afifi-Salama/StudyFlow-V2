
"use client";

import type { StudySession, UserProfile, Skin, CapitalistOffer, NotepadTask, NotepadNote, NotepadGoal, NotepadLink, NotepadData, DailyChallenge, Achievement } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Zap, ShoppingCart, ShieldCheck, CalendarCheck, Award, Clock, BarChart, Coffee, Timer as TimerIcon } from 'lucide-react';


export const XP_PER_MINUTE_FOCUS = 10;
export const CASH_PER_5_MINUTES_FOCUS = 100;
export const STREAK_BONUS_PER_DAY = 0.01; 
export const MAX_STREAK_BONUS = 0.20; 

export const LEVEL_THRESHOLDS = [ 
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300, 
  19200, 21200, 23300, 25500, 27800, 30200, 32700, 35300, 38000, 40800, 
  43900, 47100, 50400, 53800, 57300, 60900, 64600, 68400, 72300, 76300, 
  80400, 84600, 88900, 93300, 97800, 102400, 107100, 111900, 116800, 121800, 
];

export const TITLES = [
  "Newbie", "Learner", "Student", "Scholar", "Adept", "Prodigy", "Savant", "Sage", "Guru", "Master", 
  "Grandmaster Learner", "Erudite Student", "Luminous Scholar", "Distinguished Adept", "Virtuoso Prodigy", 
  "Enlightened Savant", "Venerable Sage", "Zenith Guru", "Ascendant Master", "Study God", 
  "Celestial Thinker", "Cosmic Intellect", "Dimensional Analyst", "Ethereal Mind", "Transcendent Scholar", 
  "Nova Learner", "Pulsar Student", "Quasar Scholar", "Nebula Adept", "Galactic Prodigy", 
  "Universe Wanderer", "Star Forger", "Knowledge Weaver", "Time Bender", "Reality Shaper", 
  "Thought Emperor", "Mind Overlord", "Wisdom Incarnate", "Eternal Savant", "The Oracle" 
];

export const PREDEFINED_SKINS: Skin[] = [
  { id: 'classic', name: 'Classic Blue', description: 'The default, calming blue theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/300x200/6FB5F0/FFFFFF.png', dataAiHint: 'blue gradient' },
  { id: 'dark_mode', name: 'Dark Mode', description: 'Embrace the darkness. A sleek dark theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/300x200/1A202C/A0AEC0.png', dataAiHint: 'dark theme', isTheme: true },
  { id: 'forest', name: 'Forest Whisper', description: 'Earthy tones for deep concentration.', price: 10000, levelRequirement: 3, imageUrl: 'https://placehold.co/300x200/2F4F4F/90EE90.png', dataAiHint: 'forest pattern' },
  { id: 'sunset', name: 'Sunset Vibes', description: 'Warm colors to keep you motivated.', price: 15000, levelRequirement: 5, imageUrl: 'https://placehold.co/300x200/FF8C00/FFD700.png', dataAiHint: 'sunset gradient' },
  { id: 'galaxy', name: 'Galaxy Quest', description: 'Explore the universe of knowledge.', price: 30000, levelRequirement: 7, imageUrl: 'https://placehold.co/300x200/483D8B/E6E6FA.png', dataAiHint: 'galaxy stars' },
  { id: 'mono', name: 'Monochrome Focus', description: 'Minimalist black and white.', price: 20000, levelRequirement: 8, imageUrl: 'https://placehold.co/300x200/333333/F5F5F5.png', dataAiHint: 'grayscale pattern' },
  { id: 'ocean', name: 'Ocean Depths', description: 'Dive deep into your studies.', price: 25000, levelRequirement: 10, imageUrl: 'https://placehold.co/300x200/20B2AA/AFEEEE.png', dataAiHint: 'ocean waves' },
  { id: 'neon', name: 'Neon Grid', description: 'Retro-futuristic study zone.', price: 40000, levelRequirement: 12, imageUrl: 'https://placehold.co/300x200/FF00FF/00FFFF.png', dataAiHint: 'neon grid' },
  { id: 'pastel', name: 'Pastel Dreams', description: 'Soft and gentle study environment.', price: 35000, levelRequirement: 15, imageUrl: 'https://placehold.co/300x200/FFB6C1/ADD8E6.png', dataAiHint: 'pastel colors' },
  { id: 'gold', name: 'Golden Achiever', description: 'For those who shine.', price: 100000, levelRequirement: 18, imageUrl: 'https://placehold.co/300x200/FFD700/B8860B.png', dataAiHint: 'gold texture' },
  { id: 'elite', name: 'Elite Scholar', description: 'The ultimate focus skin.', price: 200000, levelRequirement: 20, imageUrl: 'https://placehold.co/300x200/1A237E/C5CAE9.png', dataAiHint: 'dark blue elegant' },
];

const DEFAULT_USER_PROFILE: UserProfile = {
  xp: 0,
  cash: 50000,
  level: 1,
  title: TITLES[0],
  ownedSkinIds: ['classic', 'dark_mode'], 
  equippedSkinId: 'classic',
  completedChallengeIds: [],
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  wakeUpTime: { hour: 8, period: 'AM' },
  sleepTime: { hour: 10, period: 'PM' },
  unlockedAchievementIds: [],
};

const DEFAULT_NOTEPAD_DATA: NotepadData = {
  tasks: [],
  notes: [],
  goals: [],
  links: [],
};

const INITIAL_DAILY_CHALLENGES: DailyChallenge[] = [
    { id: 'study60', title: 'Focused Learner', description: 'Study for a total of 60 minutes today.', xpReward: 100, cashReward: 1000, targetValue: 60, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyDurationMinutes', resetsDaily: true },
    { id: 'pomodoro2', title: 'Pomodoro Power', description: 'Complete 2 Pomodoro focus cycles.', xpReward: 75, cashReward: 500, targetValue: 2, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'pomodoroCycles', resetsDaily: true },
    { id: 'tasks3', title: 'Task Master', description: 'Complete 3 tasks from your checklist.', xpReward: 50, cashReward: 500, targetValue: 3, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'tasksCompleted', resetsDaily: true },
    { id: 'streakKeep', title: 'Streak Keeper', description: 'Maintain your study streak by studying today.', xpReward: 25, cashReward: 250, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyStreak', resetsDaily: true },
];

// Achievements Definition
export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'firstSteps', name: 'First Steps', description: 'Log your first study session.', iconName: 'BookOpen', criteria: (profile, sessions) => sessions.length >= 1 },
  { id: 'hourOfPower', name: 'Hour of Power', description: 'Study for a total of 1 hour.', iconName: 'Clock', criteria: (profile, sessions) => sessions.reduce((sum, s) => sum + s.duration, 0) >= 3600 },
  { id: 'pomodoroStarter', name: 'Pomodoro Starter', description: 'Complete 5 full Pomodoro focus cycles.', iconName: 'TimerIcon', criteria: (profile, sessions) => sessions.filter(s => s.type === 'Pomodoro Focus' && s.isFullPomodoroCycle).length >= 5 },
  { id: 'levelUpNovice', name: 'Level 5 Reached', description: 'Reach Level 5.', iconName: 'Award', criteria: (profile) => profile.level >= 5 },
  { id: 'challengeChampion', name: 'Challenge Champion', description: 'Complete 3 daily challenges.', iconName: 'CalendarCheck', criteria: (profile) => (profile.completedChallengeIds?.length || 0) >= 3 },
  { id: 'shopSpree', name: 'Shop Spree', description: 'Buy your first skin from the shop.', iconName: 'ShoppingCart', criteria: (profile) => profile.ownedSkinIds.length > 2 }, // 2 defaults
  { id: 'streakStarter', name: 'Streak Starter', description: 'Achieve a 3-day study streak.', iconName: 'Zap', criteria: (profile) => profile.currentStreak >= 3 },
  { id: 'dedicatedLearner', name: 'Dedicated Learner', description: 'Study for a total of 10 hours.', iconName: 'BarChart', criteria: (profile, sessions) => sessions.reduce((sum, s) => sum + s.duration, 0) >= 36000 },
  { id: 'pomodoroPro', name: 'Pomodoro Pro', description: 'Complete 25 full Pomodoro focus cycles.', iconName: 'Coffee', criteria: (profile, sessions) => sessions.filter(s => s.type === 'Pomodoro Focus' && s.isFullPomodoroCycle).length >= 25 },
  { id: 'masterOfTheMind', name: 'Master of the Mind', description: 'Reach Level 10.', iconName: 'ShieldCheck', criteria: (profile) => profile.level >= 10 },
];


interface SessionContextType {
  sessions: StudySession[];
  addSession: (sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number; tags?: string[], isFullPomodoroCycle?: boolean }) => void;
  clearSessions: () => void;
  updateSessionDescription: (sessionId: string, description: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  updateSleepWakeTimes: (wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => void;
  notepadData: NotepadData;
  updateNotepadData: (newData: Partial<NotepadData>) => void;
  addNotepadNote: (note: Omit<NotepadNote, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateNotepadNote: (note: NotepadNote) => void;
  deleteNotepadNote: (noteId: string) => void;
  getSkinById: (id: string) => Skin | undefined;
  buySkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => void;
  isSkinOwned: (skinId: string) => boolean;
  capitalistOffers: CapitalistOffer[];
  ensureCapitalistOffers: () => void;
  investInOffer: (offerId: string, investmentAmount: number) => { success: boolean; message: string; profit?: number };
  lastOfferGenerationTime: number | null;
  dailyChallenges: DailyChallenge[];
  claimChallengeReward: (challengeId: string) => void;
  updateTaskChallengeProgress: (completedTasksCount: number) => void;
  getUnlockedAchievements: () => Achievement[]; // New
  checkAndUnlockAchievements: () => void; // New
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [notepadData, setNotepadData] = useState<NotepadData>(DEFAULT_NOTEPAD_DATA);
  const [capitalistOffers, setCapitalistOffers] = useState<CapitalistOffer[]>([]);
  const [lastOfferGenerationTime, setLastOfferGenerationTime] = useState<number | null>(null);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(INITIAL_DAILY_CHALLENGES);
  const [lastChallengeResetDate, setLastChallengeResetDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const applyThemePreference = useCallback((theme?: 'light' | 'dark' | null) => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);
  
  const loadData = useCallback(() => {
    try {
      const storedSessions = localStorage.getItem('studySessions');
      if (storedSessions) setSessions(JSON.parse(storedSessions));

      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProfile = JSON.parse(storedProfile) as UserProfile;
        const mergedProfile = {...DEFAULT_USER_PROFILE, ...parsedProfile};
        if (!mergedProfile.completedChallengeIds) mergedProfile.completedChallengeIds = [];
        if (typeof mergedProfile.currentStreak !== 'number') mergedProfile.currentStreak = 0;
        if (typeof mergedProfile.longestStreak !== 'number') mergedProfile.longestStreak = 0;
        if (!mergedProfile.lastStudyDate) mergedProfile.lastStudyDate = null;
        if (!mergedProfile.wakeUpTime) mergedProfile.wakeUpTime = DEFAULT_USER_PROFILE.wakeUpTime;
        if (!mergedProfile.sleepTime) mergedProfile.sleepTime = DEFAULT_USER_PROFILE.sleepTime;
        if (!mergedProfile.unlockedAchievementIds) mergedProfile.unlockedAchievementIds = []; // Ensure exists
        setUserProfile(mergedProfile);
      } else {
        setUserProfile(DEFAULT_USER_PROFILE);
      }
      
      const storedNotepad = localStorage.getItem('notepadData');
      if (storedNotepad) setNotepadData(JSON.parse(storedNotepad));
      else setNotepadData(DEFAULT_NOTEPAD_DATA);

      const storedOffers = localStorage.getItem('capitalistOffers');
      if (storedOffers) setCapitalistOffers(JSON.parse(storedOffers));

      const storedOfferTime = localStorage.getItem('lastOfferGenerationTime');
      if (storedOfferTime) setLastOfferGenerationTime(parseInt(storedOfferTime, 10));

      const storedTheme = localStorage.getItem('themePreference');
      applyThemePreference(storedTheme as 'light' | 'dark' | null);
      
      const storedChallenges = localStorage.getItem('dailyChallenges');
      const storedResetDate = localStorage.getItem('lastChallengeResetDate');
      const todayDateString = new Date().toISOString().split('T')[0];

      if (storedChallenges && storedResetDate === todayDateString) {
        setDailyChallenges(JSON.parse(storedChallenges));
      } else {
        const freshChallenges = INITIAL_DAILY_CHALLENGES.map(ch => ({...ch, currentValue: 0, isCompleted: false, rewardClaimed: false}));
        setDailyChallenges(freshChallenges);
        setLastChallengeResetDate(todayDateString);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setUserProfile(DEFAULT_USER_PROFILE); 
      setNotepadData(DEFAULT_NOTEPAD_DATA);
      setDailyChallenges(INITIAL_DAILY_CHALLENGES.map(ch => ({...ch, currentValue: 0, isCompleted: false, rewardClaimed: false})));
      setLastChallengeResetDate(new Date().toISOString().split('T')[0]);
    }
    setIsLoaded(true);
  }, [applyThemePreference]);

  useEffect(() => {
    if (!isLoaded) { // Ensures loadData is called only once on initial mount
        loadData();
    }
  }, [isLoaded, loadData]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('notepadData', JSON.stringify(notepadData));
        localStorage.setItem('capitalistOffers', JSON.stringify(capitalistOffers));
        if (lastOfferGenerationTime) {
          localStorage.setItem('lastOfferGenerationTime', lastOfferGenerationTime.toString());
        } else {
          localStorage.removeItem('lastOfferGenerationTime');
        }
        const equippedSkin = PREDEFINED_SKINS.find(s => s.id === userProfile.equippedSkinId);
        if (equippedSkin?.isTheme && equippedSkin.id === 'dark_mode') {
            localStorage.setItem('themePreference', 'dark');
        } else {
            localStorage.setItem('themePreference', 'light');
        }
        localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
        if (lastChallengeResetDate) {
            localStorage.setItem('lastChallengeResetDate', lastChallengeResetDate);
        }
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [sessions, userProfile, notepadData, capitalistOffers, lastOfferGenerationTime, dailyChallenges, lastChallengeResetDate, isLoaded]);
  
  const updateUserProfile = useCallback((updatedProfileData: Partial<UserProfile>) => {
    setUserProfile(prev => ({...prev, ...updatedProfileData}));
  }, []);

  const updateSleepWakeTimes = useCallback((wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => {
    setUserProfile(prev => ({...prev, wakeUpTime, sleepTime }));
    toast({ title: "Preferences Updated", description: "Your wake-up and sleep times have been saved." });
  }, [toast]);

  const checkAndUnlockAchievements = useCallback(() => {
    const newlyUnlocked: string[] = [];
    ALL_ACHIEVEMENTS.forEach(ach => {
      if (!userProfile.unlockedAchievementIds?.includes(ach.id) && ach.criteria(userProfile, sessions, dailyChallenges)) {
        newlyUnlocked.push(ach.id);
        toast({
          title: "Achievement Unlocked!",
          description: `You've earned: ${ach.name} - ${ach.description}`,
        });
      }
    });

    if (newlyUnlocked.length > 0) {
      setUserProfile(prev => ({
        ...prev,
        unlockedAchievementIds: [...(prev.unlockedAchievementIds || []), ...newlyUnlocked],
      }));
    }
  }, [userProfile, sessions, dailyChallenges, toast]);

  useEffect(() => {
    if (isLoaded) {
        checkAndUnlockAchievements();
    }
  }, [sessions, userProfile.level, userProfile.cash, userProfile.currentStreak, userProfile.ownedSkinIds, userProfile.completedChallengeIds, dailyChallenges, checkAndUnlockAchievements, isLoaded]);


  const checkForLevelUp = useCallback((currentXp: number, currentLevel: number) => {
    let newLevel = currentLevel;
    let newTitle = TITLES[currentLevel -1] || TITLES[TITLES.length -1];
    let leveledUp = false;

    while (newLevel < LEVEL_THRESHOLDS.length && currentXp >= LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
      leveledUp = true;
    }
    
    if (leveledUp) {
      newTitle = TITLES[newLevel - 1] || TITLES[TITLES.length -1]; 
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached Level ${newLevel}: ${newTitle}.`,
      });
    }
    return { newLevel, newTitle, leveledUp };
  }, [toast]);

  const updateStreakAndGetBonus = useCallback(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    let currentStreak = userProfile.currentStreak;
    let longestStreak = userProfile.longestStreak;
    let lastStudyDate = userProfile.lastStudyDate;

    if (lastStudyDate) {
      const lastDate = new Date(lastStudyDate);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) { 
        currentStreak = 1; 
      }
    } else { 
      currentStreak = 1;
    }
    
    let newLastStudyDate = lastStudyDate;
    if (lastStudyDate !== todayStr) {
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }
        newLastStudyDate = todayStr;
    }

    const streakBonus = Math.min(currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
    
    return { streakBonus, updatedCurrentStreak: currentStreak, updatedLongestStreak: longestStreak, updatedLastStudyDate: newLastStudyDate };
  }, [userProfile.currentStreak, userProfile.longestStreak, userProfile.lastStudyDate]);


  const updateChallengeProgress = useCallback((type: DailyChallenge['type'], value: number) => {
    setDailyChallenges(prevChallenges => 
        prevChallenges.map(challenge => {
            if (challenge.type === type && !challenge.isCompleted && !challenge.rewardClaimed) {
                const newCurrentValue = Math.min(challenge.currentValue + value, challenge.targetValue);
                const isNowCompleted = newCurrentValue >= challenge.targetValue;
                if (isNowCompleted && !challenge.isCompleted) { 
                     toast({ title: "Challenge Goal Met!", description: `You've met the goal for '${challenge.title}'! Claim your reward.` });
                }
                return { ...challenge, currentValue: newCurrentValue, isCompleted: isNowCompleted, lastProgressUpdate: Date.now() };
            }
            return challenge;
        })
    );
  }, [toast]);

  const updateTaskChallengeProgress = useCallback((completedTasksCount: number) => {
      setDailyChallenges(prevChallenges => 
        prevChallenges.map(challenge => {
            if (challenge.type === 'tasksCompleted' && !challenge.rewardClaimed) {
                const newCurrentValue = Math.min(completedTasksCount, challenge.targetValue);
                const isNowCompleted = newCurrentValue >= challenge.targetValue;
                 if (isNowCompleted && !challenge.isCompleted) { 
                     toast({ title: "Challenge Update!", description: `You've met the goal for '${challenge.title}'!` });
                }
                return { ...challenge, currentValue: newCurrentValue, isCompleted: isNowCompleted, lastProgressUpdate: Date.now() };
            }
            return challenge;
        })
    );
  }, [toast]);

  const addSession = useCallback((sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number; tags?: string[], isFullPomodoroCycle?: boolean }) => {
    if (sessionDetails.durationInSeconds <= 0) {
      console.warn("Attempted to log a session with zero or negative duration.");
      return;
    }
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      type: sessionDetails.type,
      startTime: sessionDetails.startTime,
      endTime: sessionDetails.startTime + sessionDetails.durationInSeconds * 1000,
      duration: sessionDetails.durationInSeconds,
      tags: sessionDetails.tags || [],
      isFullPomodoroCycle: sessionDetails.isFullPomodoroCycle || false,
    };
    setSessions(prevSessions => [newSession, ...prevSessions].sort((a, b) => b.startTime - a.startTime));

    const { streakBonus, updatedCurrentStreak, updatedLongestStreak, updatedLastStudyDate } = updateStreakAndGetBonus();
    
    let awardedXp = 0;
    let awardedCash = 0;
    const minutesStudied = sessionDetails.durationInSeconds / 60;

    if (sessionDetails.type === 'Pomodoro Focus' || sessionDetails.type === 'Stopwatch') {
      awardedXp = Math.floor(minutesStudied * XP_PER_MINUTE_FOCUS * (1 + streakBonus));
      awardedCash = Math.floor((minutesStudied / 5) * CASH_PER_5_MINUTES_FOCUS * (1 + streakBonus));
      updateChallengeProgress('studyDurationMinutes', Math.floor(minutesStudied));
    }
    if (sessionDetails.type === 'Pomodoro Focus' && sessionDetails.isFullPomodoroCycle) { 
        updateChallengeProgress('pomodoroCycles', 1);
    }

    
    if (userProfile.lastStudyDate !== updatedLastStudyDate) {
        updateChallengeProgress('studyStreak', 1);
    }

    setUserProfile(prevProfile => {
        const newXp = prevProfile.xp + awardedXp;
        const { newLevel, newTitle } = checkForLevelUp(newXp, prevProfile.level);
        
        let rewardMessages = [];
        if (awardedXp > 0) rewardMessages.push(`${awardedXp} XP`);
        if (awardedCash > 0) rewardMessages.push(`$${awardedCash}`);
        if (streakBonus > 0 && (awardedCash > 0 || awardedXp > 0)) rewardMessages.push(`(${(streakBonus * 100).toFixed(0)}% streak bonus!)`);
        
        if (rewardMessages.length > 0) {
            toast({ title: "Session Rewards", description: `Gained: ${rewardMessages.join(', ')}` });
        }

        return {
          ...prevProfile,
          xp: newXp,
          cash: prevProfile.cash + awardedCash,
          level: newLevel,
          title: newTitle,
          currentStreak: updatedCurrentStreak,
          longestStreak: updatedLongestStreak,
          lastStudyDate: updatedLastStudyDate,
        };
      });
  }, [checkForLevelUp, toast, updateChallengeProgress, updateStreakAndGetBonus, userProfile.lastStudyDate]);

  const clearSessions = useCallback(() => {
    setSessions([]);
  }, []);

  const updateSessionDescription = useCallback((sessionId: string, description: string) => {
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === sessionId ? { ...session, description } : session
      )
    );
  }, []);

  const getSkinById = useCallback((id: string) => {
    return PREDEFINED_SKINS.find(skin => skin.id === id);
  }, []);

  const isSkinOwned = useCallback((skinId: string) => {
    return userProfile.ownedSkinIds.includes(skinId);
  }, [userProfile.ownedSkinIds]);

  const buySkin = useCallback((skinId: string) => {
    const skin = getSkinById(skinId);
    if (!skin) {
      toast({ title: "Error", description: "Skin not found.", variant: "destructive" });
      return false;
    }
    if (isSkinOwned(skinId)) {
      toast({ title: "Already Owned", description: "You already own this skin." });
      return false;
    }
    if (userProfile.cash < skin.price) {
      toast({ title: "Not Enough Cash", description: `You need $${skin.price.toLocaleString()}. You have $${userProfile.cash.toLocaleString()}.`, variant: "destructive" });
      return false;
    }
    if (userProfile.level < skin.levelRequirement) {
      toast({ title: "Level Too Low", description: `You need to be Level ${skin.levelRequirement}. You are Level ${userProfile.level}.`, variant: "destructive" });
      return false;
    }

    setUserProfile(prev => ({
      ...prev,
      cash: prev.cash - skin.price,
      ownedSkinIds: [...prev.ownedSkinIds, skinId],
    }));
    toast({ title: "Purchase Successful!", description: `You bought ${skin.name} for $${skin.price.toLocaleString()}.` });
    checkAndUnlockAchievements(); 
    return true;
  }, [userProfile, getSkinById, isSkinOwned, toast, checkAndUnlockAchievements]);

  const equipSkin = useCallback((skinId: string) => {
    if (!isSkinOwned(skinId)) {
      toast({ title: "Error", description: "You don't own this skin.", variant: "destructive" });
      return;
    }
    const skinToEquip = getSkinById(skinId);
    if (!skinToEquip) return;

    setUserProfile(prev => ({ ...prev, equippedSkinId: skinId }));
    
    if (skinToEquip.isTheme && skinToEquip.id === 'dark_mode') {
      applyThemePreference('dark');
      localStorage.setItem('themePreference', 'dark');
    } else {
      applyThemePreference('light'); 
      localStorage.setItem('themePreference', 'light');
    }

    toast({ title: "Skin Equipped!", description: `${skinToEquip.name} is now active.` });
  }, [isSkinOwned, getSkinById, toast, applyThemePreference]);

  const updateNotepadData = useCallback((newData: Partial<NotepadData>) => {
    setNotepadData(prev => ({ ...prev, ...newData }));
  }, []);

  const addNotepadNote = useCallback((note: Omit<NotepadNote, 'id' | 'createdAt' | 'lastModified'>) => {
    const newNote: NotepadNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    setNotepadData(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
    toast({ title: "Note Added", description: `"${note.title}" has been saved.` });
  }, [toast]);

  const updateNotepadNote = useCallback((updatedNote: NotepadNote) => {
    setNotepadData(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === updatedNote.id ? { ...updatedNote, lastModified: Date.now() } : note
      ),
    }));
    toast({ title: "Note Updated", description: `"${updatedNote.title}" has been saved.` });
  }, [toast]);

  const deleteNotepadNote = useCallback((noteId: string) => {
    const noteToDelete = notepadData.notes.find(n => n.id === noteId);
    setNotepadData(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId),
    }));
    if (noteToDelete) {
        toast({ title: "Note Deleted", description: `"${noteToDelete.title}" has been removed.` });
    }
  }, [notepadData.notes, toast]);

  const generateOffers = (): CapitalistOffer[] => {
    const baseOffersData: Omit<CapitalistOffer, 'id' | 'expiresAt'>[] = [
        { name: "Safe Bet Startup", description: "Low risk, low reward tech investment.", minInvestmentAmount: 5000, maxInvestmentAmount: 20000, minRoiPercent: 5, maxRoiPercent: 20, volatilityFactor: 0.2, durationHours: 24 },
        { name: "Crypto Gamble", description: "High risk, high reward digital currency.", minInvestmentAmount: 10000, maxInvestmentAmount: 50000, minRoiPercent: -80, maxRoiPercent: 200, volatilityFactor: 0.8, durationHours: 24 },
        { name: "Real Estate Flip", description: "Moderate risk, steady gains.", minInvestmentAmount: 20000, maxInvestmentAmount: 100000, minRoiPercent: -10, maxRoiPercent: 50, volatilityFactor: 0.4, durationHours: 24 },
        { name: "Meme Stock Madness", description: "To the moon or bust!", minInvestmentAmount: 7500, maxInvestmentAmount: 30000,  minRoiPercent: -95, maxRoiPercent: 500, volatilityFactor: 0.95, durationHours: 24 },
        { name: "Blue Chip Bonds", description: "Slow and steady wins the race.", minInvestmentAmount: 30000,maxInvestmentAmount: 150000, minRoiPercent: 1, maxRoiPercent: 10, volatilityFactor: 0.1, durationHours: 24 },
        { name: "Emerging Market Fund", description: "Potential for growth, with some uncertainty.", minInvestmentAmount: 15000, maxInvestmentAmount: 75000,  minRoiPercent: -30, maxRoiPercent: 70, volatilityFactor: 0.6, durationHours: 24 },
    ];
    const shuffled = [...baseOffersData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(offer => ({
      ...offer,
      id: crypto.randomUUID(),
      expiresAt: Date.now() + offer.durationHours * 60 * 60 * 1000,
    }));
  };

  const ensureCapitalistOffers = useCallback(() => {
    const now = Date.now();
    if (!lastOfferGenerationTime || now - lastOfferGenerationTime > 24 * 60 * 60 * 1000 || capitalistOffers.some(o => o.expiresAt && o.expiresAt < now)) {
      const newOffers = generateOffers();
      setCapitalistOffers(newOffers);
      setLastOfferGenerationTime(now);
    }
  }, [lastOfferGenerationTime, capitalistOffers]);

  const investInOffer = useCallback((offerId: string, investmentAmount: number) => {
    const offer = capitalistOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, message: "Offer not found." };
    if (userProfile.cash < investmentAmount) return { success: false, message: "Not enough cash." };
    if (investmentAmount < offer.minInvestmentAmount) return { success: false, message: `Minimum investment is $${offer.minInvestmentAmount.toLocaleString()}.` };
    if (offer.maxInvestmentAmount && investmentAmount > offer.maxInvestmentAmount) return { success: false, message: `Maximum investment is $${offer.maxInvestmentAmount.toLocaleString()}.`};


    const randomFactor = Math.random(); 
    let actualRoiPercent: number;
    if (Math.random() < offer.volatilityFactor) {
      actualRoiPercent = Math.random() < 0.5 ? offer.minRoiPercent : offer.maxRoiPercent;
    } else {
       actualRoiPercent = offer.minRoiPercent + (offer.maxRoiPercent - offer.minRoiPercent) * randomFactor;
    }
    
    const profit = Math.round(investmentAmount * (actualRoiPercent / 100));
    
    setUserProfile(prev => ({ ...prev, cash: prev.cash + profit })); 
    
    setCapitalistOffers(prevOffers => prevOffers.filter(o => o.id !== offerId));

    const message = profit >= 0 ? `Investment successful! You gained $${profit.toLocaleString()}.` : `Investment risky... You lost $${Math.abs(profit).toLocaleString()}.`;
    toast({ title: "Investment Result", description: message });
    return { success: true, message, profit };

  }, [capitalistOffers, userProfile.cash, toast]);

  const claimChallengeReward = useCallback((challengeId: string) => {
    setDailyChallenges(prevChallenges => {
        const updatedChallenges = prevChallenges.map(challenge => {
            if (challenge.id === challengeId && challenge.isCompleted && !challenge.rewardClaimed) {
                setUserProfile(prevProfile => {
                    const newXp = prevProfile.xp + challenge.xpReward;
                    const { newLevel, newTitle } = checkForLevelUp(newXp, prevProfile.level);
                    toast({title: "Challenge Reward Claimed!", description: `+${challenge.xpReward} XP, +$${challenge.cashReward.toLocaleString()} for '${challenge.title}'`});
                    return {
                        ...prevProfile,
                        xp: newXp,
                        cash: prevProfile.cash + challenge.cashReward,
                        level: newLevel,
                        title: newTitle,
                        completedChallengeIds: [...(prevProfile.completedChallengeIds || []), challengeId],
                    };
                });
                checkAndUnlockAchievements(); 
                return { ...challenge, rewardClaimed: true };
            }
            return challenge;
        });
        return updatedChallenges;
    });
  }, [toast, checkForLevelUp, checkAndUnlockAchievements]);

  const getUnlockedAchievements = useCallback((): Achievement[] => {
    return ALL_ACHIEVEMENTS.filter(ach => userProfile.unlockedAchievementIds?.includes(ach.id));
  }, [userProfile.unlockedAchievementIds]);


  useEffect(() => { 
    if (isLoaded) {
      checkAndUnlockAchievements();
    }
  }, [isLoaded, checkAndUnlockAchievements]);


  if (!isLoaded) {
    return null; 
  }

  return (
    <SessionContext.Provider value={{ 
      sessions, addSession, clearSessions, updateSessionDescription,
      userProfile, updateUserProfile, updateSleepWakeTimes,
      notepadData, updateNotepadData, addNotepadNote, updateNotepadNote, deleteNotepadNote,
      getSkinById, buySkin, equipSkin, isSkinOwned,
      capitalistOffers, ensureCapitalistOffers, investInOffer, lastOfferGenerationTime,
      dailyChallenges, claimChallengeReward, updateTaskChallengeProgress,
      getUnlockedAchievements, checkAndUnlockAchievements
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
};


    