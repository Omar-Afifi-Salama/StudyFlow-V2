
"use client";

import type { StudySession, UserProfile, Skin, CapitalistOffer, NotepadTask, NotepadNote, NotepadGoal, NotepadLink, NotepadData, DailyChallenge, Achievement, RevisionConcept, Habit, HabitFrequency, HabitLogEntry, AchievementCriteriaInvestmentPayload, NotepadCountdownEvent, Skill, FeatureKey, FloatingGain, PomodoroState, StopwatchState, PomodoroMode, PomodoroSettings } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Zap, ShoppingCart, ShieldCheck, CalendarCheck, Award, Clock, BarChart, Coffee, Timer, TrendingUp, Brain, Gift, Star, DollarSign, Activity, AlignLeft, Link2, CheckSquare, Trophy, TrendingDown, Sigma, Moon, Sun, Palette, Package, Briefcase, Target as TargetIcon, Edit, Repeat, ListChecks as HabitIcon, CalendarClock, BarChart3, Wind, NotebookText, Settings, Lightbulb, HelpCircle, Network, Settings2, Grid, CheckSquare2, StickyNote, Target, Link as LinkLucide, Sparkles, XCircle, Save, Trash2, CheckCircle, Percent, RepeatIcon, PaletteIcon, MoreVertical, ChevronDown, Gem, Flame } from 'lucide-react';
import { format, addDays, differenceInDays, isYesterday, isToday, parseISO, startOfWeek, getWeek, formatISO, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

export const XP_PER_MINUTE_FOCUS = 10;
export const CASH_PER_5_MINUTES_FOCUS = 100;
export const STREAK_BONUS_PER_DAY = 0.01; // 1% bonus per day
export const MAX_STREAK_BONUS = 0.20; // Max 20% bonus from streak
export const DAILY_LOGIN_BASE_CASH = 200;
export const DAILY_LOGIN_STREAK_CASH_BONUS = 50; // Extra cash per consecutive login day
export const DAILY_LOGIN_MAX_STREAK_BONUS_CASH = 500; // Max bonus cash from login streak

export const TITLES = [
  "Newbie", "Learner", "Student", "Scholar", "Adept", "Prodigy", "Savant", "Sage", "Guru", "Master", // 1-10
  "Grandmaster Learner", "Erudite Student", "Luminous Scholar", "Distinguished Adept", "Virtuoso Prodigy", // 11-15
  "Enlightened Savant", "Venerable Sage", "Zenith Guru", "Ascendant Master", "Study God", // 16-20
  "Celestial Thinker", "Cosmic Intellect", "Dimensional Analyst", "Ethereal Mind", "Transcendent Scholar", // 21-25
  "Nova Learner", "Pulsar Student", "Quasar Scholar", "Nebula Adept", "Galactic Prodigy", // 26-30
  "Universe Wanderer", "Star Forger", "Knowledge Weaver", "Time Bender", "Reality Shaper", // 31-35
  "Thought Emperor", "Mind Overlord", "Wisdom Incarnate", // 36-38
  "Apex Scholar" // Level 39 (Max Level)
];

const generateLevelThresholds = (numLevels: number, maxXp: number): number[] => {
  const thresholds: number[] = [0]; // Level 1 is 0 XP
  for (let i = 1; i < numLevels; i++) {
    const progress = i / (numLevels - 1);
    const xp = Math.floor(maxXp * Math.pow(progress, 2.5)); // Exponential scaling
    thresholds.push(xp);
  }
  if (thresholds.length >= numLevels) {
    thresholds[numLevels - 1] = maxXp; // Ensure max level hits exact maxXp
  }
  return thresholds.slice(0, numLevels);
};

export const ACTUAL_LEVEL_THRESHOLDS = generateLevelThresholds(TITLES.length, 600000); 

export const PREDEFINED_SKINS: Skin[] = [
  { id: 'classic', name: 'Classic Blue', description: 'The default, calming blue theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/6FB5F0/FFFFFF.png?text=Classic+Blue', dataAiHint: 'study app classic blue theme', isTheme: true, themeClass: 'classic' },
  { id: 'dark_mode', name: 'Dark Mode', description: 'Embrace the darkness. A sleek dark theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/1A202C/A0AEC0.png?text=Dark+Mode', dataAiHint: 'dark theme study dashboard', isTheme: true, themeClass: 'dark' },
  { id: 'sepia_tone', name: 'Sepia Tone', description: 'A warm, vintage sepia theme for focused nostalgia.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/D2B48C/4A3B31.png?text=Sepia+Tone', dataAiHint: 'sepia theme timer interface', isTheme: true, themeClass: 'sepia' },
  { id: 'forest', name: 'Forest Whisper', description: 'Earthy tones for deep concentration.', price: 10000, levelRequirement: 3, imageUrl: 'https://placehold.co/400x225/2F4F4F/90EE90.png?text=Forest+Theme', dataAiHint: 'forest theme study app interface', isTheme: true, themeClass: 'theme-forest' },
  { id: 'sunset', name: 'Sunset Vibes', description: 'Warm colors to keep you motivated.', price: 15000, levelRequirement: 5, imageUrl: 'https://placehold.co/400x225/FF8C00/FFD700.png?text=Sunset+Theme', dataAiHint: 'sunset theme study app focus mode', isTheme: true, themeClass: 'theme-sunset' },
  { id: 'galaxy', name: 'Galaxy Quest', description: 'Explore the universe of knowledge.', price: 30000, levelRequirement: 7, imageUrl: 'https://placehold.co/400x225/483D8B/E6E6FA.png?text=Galaxy+Theme', dataAiHint: 'galaxy theme app dashboard study', isTheme: true, themeClass: 'theme-galaxy' },
  { id: 'mono', name: 'Monochrome Focus', description: 'Minimalist black and white.', price: 20000, levelRequirement: 8, imageUrl: 'https://placehold.co/400x225/333333/F5F5F5.png?text=Monochrome', dataAiHint: 'monochrome study app interface', isTheme: true, themeClass: 'theme-mono' },
  { id: 'ocean', name: 'Ocean Depths', description: 'Dive deep into your studies.', price: 25000, levelRequirement: 10, imageUrl: 'https://placehold.co/400x225/20B2AA/AFEEEE.png?text=Ocean+Theme', dataAiHint: 'ocean theme app timers and log', isTheme: true, themeClass: 'theme-ocean' },
  { id: 'neon', name: 'Neon Grid', description: 'Retro-futuristic study zone.', price: 40000, levelRequirement: 12, imageUrl: 'https://placehold.co/400x225/FF00FF/00FFFF.png?text=Neon+Theme', dataAiHint: 'neon theme study productivity app', isTheme: true, themeClass: 'theme-neon' },
  { id: 'pastel', name: 'Pastel Dreams', description: 'Soft and gentle study environment.', price: 35000, levelRequirement: 15, imageUrl: 'https://placehold.co/400x225/FFB6C1/ADD8E6.png?text=Pastel+Theme', dataAiHint: 'pastel theme study app interface', isTheme: true, themeClass: 'theme-pastel' },
  { id: 'gold', name: 'Golden Achiever', description: 'For those who shine.', price: 100000, levelRequirement: 18, imageUrl: 'https://placehold.co/400x225/FFD700/B8860B.png?text=Gold+Theme', dataAiHint: 'gold theme productivity app dashboard', isTheme: true, themeClass: 'theme-gold' },
  { id: 'elite', name: 'Elite Scholar', description: 'The ultimate focus skin.', price: 200000, levelRequirement: 20, imageUrl: 'https://placehold.co/400x225/1A237E/C5CAE9.png?text=Elite+Theme', dataAiHint: 'elite theme study app stats page', isTheme: true, themeClass: 'theme-elite' },
];

export const DEFAULT_NOTEPAD_DATA: NotepadData = {
  tasks: [], notes: [], goals: [], links: [], revisionConcepts: [], habits: [], countdownEvents: [],
  eisenhowerMatrix: { urgentImportant: [], notUrgentImportant: [], urgentNotImportant: [], notUrgentNotImportant: [] }
};

const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, cyclesPerLongBreak: 4,
};

const DEFAULT_POMODORO_STATE: PomodoroState = {
    timeLeft: DEFAULT_POMODORO_SETTINGS.workDuration * 60,
    mode: 'work',
    isRunning: false,
    cyclesCompleted: 0,
    settings: DEFAULT_POMODORO_SETTINGS,
    sessionStartTime: 0,
};

const DEFAULT_STOPWATCH_STATE: StopwatchState = {
    timeElapsed: 0,
    isRunning: false,
    sessionStartTime: 0,
};

const DEFAULT_USER_PROFILE: UserProfile = {
  xp: 0, cash: 1000, level: 1, title: TITLES[0],
  ownedSkinIds: ['classic', 'dark_mode', 'sepia_tone'], equippedSkinId: 'classic',
  completedChallengeIds: [], currentStreak: 0, longestStreak: 0, lastStudyDate: null,
  wakeUpTime: { hour: 8, period: 'AM' }, sleepTime: { hour: 10, period: 'PM' },
  unlockedAchievementIds: [], lastLoginDate: null, dailyLoginStreak: 0,
  notepadData: DEFAULT_NOTEPAD_DATA, skillPoints: 0, unlockedSkillIds: ['unlockTimers', 'unlockSkillTree'], 
};

const INITIAL_DAILY_CHALLENGES_POOL: DailyChallenge[] = [
    { id: 'study30', title: 'Quick Learner', description: 'Study for a total of 30 minutes today.', xpReward: 50, cashReward: 500, targetValue: 30, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyDurationMinutes', resetsDaily: true },
    { id: 'study90', title: 'Deep Dive', description: 'Study for a total of 90 minutes today.', xpReward: 150, cashReward: 1500, targetValue: 90, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyDurationMinutes', resetsDaily: true },
    { id: 'study180', title: 'Marathon Session', description: 'Study for a total of 3 hours today.', xpReward: 300, cashReward: 3000, targetValue: 180, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyDurationMinutes', resetsDaily: true },
    { id: 'pomodoro1', title: 'Pomodoro Warm-up', description: 'Complete 1 Pomodoro focus cycle.', xpReward: 40, cashReward: 300, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'pomodoroCycles', resetsDaily: true },
    { id: 'pomodoro3', title: 'Pomodoro Pro', description: 'Complete 3 Pomodoro focus cycles.', xpReward: 100, cashReward: 800, targetValue: 3, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'pomodoroCycles', resetsDaily: true },
    { id: 'pomodoro5', title: 'Pomodoro Powerhouse', description: 'Complete 5 Pomodoro focus cycles.', xpReward: 180, cashReward: 1500, targetValue: 5, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'pomodoroCycles', resetsDaily: true },
    { id: 'tasks2', title: 'Task Ticker', description: 'Complete 2 tasks from your checklist.', xpReward: 30, cashReward: 300, targetValue: 2, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'tasksCompleted', resetsDaily: true },
    { id: 'tasks5', title: 'Task Master', description: 'Complete 5 tasks from your checklist.', xpReward: 75, cashReward: 700, targetValue: 5, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'tasksCompleted', resetsDaily: true },
    { id: 'ambiance15', title: 'Sound Scaper', description: 'Use the Ambiance Mixer for 15 minutes.', xpReward: 25, cashReward: 200, targetValue: 15, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'ambianceUsage', resetsDaily: true },
    { id: 'ambiance60', title: 'Audio Aficionado', description: 'Use the Ambiance Mixer for 60 minutes.', xpReward: 100, cashReward: 600, targetValue: 60, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'ambianceUsage', resetsDaily: true },
    { id: 'notepadNote1', title: 'Note Taker', description: 'Create one new note in your notepad.', xpReward: 20, cashReward: 150, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'notepadEntry', resetsDaily: true },
    { id: 'notepadRevision1', title: 'Revision Starter', description: 'Add one new concept to the Revision Hub.', xpReward: 30, cashReward: 250, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'notepadEntry', resetsDaily: true },
    { id: 'streakKeep', title: 'Streak Keeper', description: 'Maintain your study streak by studying today.', xpReward: 25, cashReward: 250, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyStreak', resetsDaily: true },
    { id: 'habitTracker1', title: 'Habit Hero', description: 'Complete one daily habit.', xpReward: 30, cashReward: 200, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'habitCompletions', resetsDaily: true},
    { id: 'habitTracker3', title: 'Habit Honcho', description: 'Complete three daily habits.', xpReward: 70, cashReward: 500, targetValue: 3, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'habitCompletions', resetsDaily: true},
];

export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'firstSteps', name: 'First Steps', description: 'Log your first study session.', iconName: 'BookOpen', cashReward: 250, criteria: (p, s) => s.length >= 1, category: 'Study Time' },
  { id: 'hourOfPower', name: 'Hour of Power', description: 'Study for a total of 1 hour.', iconName: 'Clock', cashReward: 500, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 3600, category: 'Study Time' },
  { id: 'fiveHourFocus', name: 'Five Hour Focus', description: 'Study for a total of 5 hours.', iconName: 'Clock', cashReward: 1000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 18000, category: 'Study Time' },
  { id: 'dedicatedLearner', name: 'Dedicated Learner', description: 'Study for a total of 10 hours.', iconName: 'BarChart', cashReward: 2500, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 36000, category: 'Study Time' },
  { id: 'twentyFiveHourTriumph', name: '25 Hour Triumph', description: 'Study for a total of 25 hours.', iconName: 'BarChart', cashReward: 5000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 90000, category: 'Study Time' },
  { id: 'studyVeteran', name: 'Study Veteran', description: 'Study for a total of 50 hours.', iconName: 'Sigma', cashReward: 10000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 180000, category: 'Study Time' },
  { id: 'hundredHourHero', name: 'Hundred Hour Hero', description: 'Study for a total of 100 hours.', iconName: 'Trophy', cashReward: 25000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 360000, category: 'Study Time' },
  { id: 'twoFiftyHourForce', name: '250 Hour Force', description: 'Study for a total of 250 hours.', iconName: 'Trophy', cashReward: 50000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 900000, category: 'Study Time' },
  { id: 'timeLord', name: 'Time Lord', description: 'Study for a total of 500 hours.', iconName: 'Sun', cashReward: 100000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 1800000, category: 'Study Time' },
  { id: 'pomodoroInitiate', name: 'Pomodoro Initiate', description: 'Complete 1 full Pomodoro focus cycle.', iconName: 'Timer', cashReward: 100, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 1, category: 'Pomodoro' },
  { id: 'pomodoroStarter', name: 'Pomodoro Starter', description: 'Complete 5 full Pomodoro focus cycles.', iconName: 'Timer', cashReward: 750, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 5, category: 'Pomodoro' },
  { id: 'pomodoroAdept', name: 'Pomodoro Adept', description: 'Complete 10 full Pomodoro focus cycles.', iconName: 'Timer', cashReward: 1500, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 10, category: 'Pomodoro' },
  { id: 'pomodoroPro', name: 'Pomodoro Pro', description: 'Complete 25 full Pomodoro focus cycles.', iconName: 'Coffee', cashReward: 3000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 25, category: 'Pomodoro' },
  { id: 'pomodoroExpert', name: 'Pomodoro Expert', description: 'Complete 50 full Pomodoro focus cycles.', iconName: 'Coffee', cashReward: 5000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 50, category: 'Pomodoro' },
  { id: 'pomodoroSensei', name: 'Pomodoro Sensei', description: 'Complete 100 full Pomodoro focus cycles.', iconName: 'Activity', cashReward: 7500, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 100, category: 'Pomodoro' },
  { id: 'pomodoroGrandmaster', name: 'Pomodoro Grandmaster', description: 'Complete 250 full Pomodoro focus cycles.', iconName: 'Zap', cashReward: 15000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 250, category: 'Pomodoro' },
  { id: 'pomodoroZenith', name: 'Pomodoro Zenith', description: 'Complete 500 full Pomodoro focus cycles.', iconName: 'Moon', cashReward: 30000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 500, category: 'Pomodoro' },
  { id: 'levelUpNovice', name: 'Adept Learner', description: 'Reach Level 5: Adept.', iconName: 'Award', cashReward: 1000, criteria: (p) => p.level >= 5, category: 'Progression' },
  { id: 'masterOfTheMind', name: 'Master of the Mind', description: 'Reach Level 10: Master.', iconName: 'ShieldCheck', cashReward: 5000, criteria: (p) => p.level >= 10, category: 'Progression' },
  { id: 'virtuosoLearner', name: 'Virtuoso Learner', description: 'Reach Level 15: Virtuoso Prodigy.', iconName: 'ShieldCheck', cashReward: 10000, criteria: (p) => p.level >= 15, category: 'Progression' },
  { id: 'levelTwentyTitan', name: 'Study God', description: 'Reach Level 20: Study God.', iconName: 'Star', cashReward: 15000, criteria: (p) => p.level >= 20, category: 'Progression' },
  { id: 'transcendentScholar', name: 'Transcendent Scholar', description: 'Reach Level 25: Transcendent Scholar.', iconName: 'Star', cashReward: 20000, criteria: (p) => p.level >= 25, category: 'Progression' },
  { id: 'levelThirtyLegend', name: 'Galactic Prodigy', description: 'Reach Level 30: Galactic Prodigy.', iconName: 'Package', cashReward: 30000, criteria: (p) => p.level >= 30, category: 'Progression' },
  { id: 'thoughtEmperor', name: 'Thought Emperor', description: 'Reach Level 35: Thought Emperor.', iconName: 'Package', cashReward: 40000, criteria: (p) => p.level >= 35, category: 'Progression' },
  { id: 'levelFiftyOracle', name: 'Apex Scholar', description: 'Reach Level 39 (Apex Scholar).', iconName: 'Gem', cashReward: 75000, criteria: (p) => p.level >= 39, category: 'Progression' },
  { id: 'shopSpree', name: 'Shop Spree', description: 'Buy your first (non-free) skin.', iconName: 'ShoppingCart', cashReward: 500, criteria: (p) => p.ownedSkinIds.filter(id => !PREDEFINED_SKINS.find(s => s.id === id)?.price === false).length >= 1 && p.ownedSkinIds.some(id => (PREDEFINED_SKINS.find(s => s.id === id)?.price || 0) > 0) , category: 'Collection' },
  { id: 'wardrobeBeginner', name: 'Wardrobe Beginner', description: 'Own 3 different paid skins.', iconName: 'Palette', cashReward: 1500, criteria: (p) => p.ownedSkinIds.filter(id => (PREDEFINED_SKINS.find(s => s.id === id)?.price || 0) > 0).length >= 3, category: 'Collection' },
  { id: 'fashionista', name: 'Fashionista', description: 'Own 5 different paid skins.', iconName: 'Sparkles', cashReward: 4000, criteria: (p) => p.ownedSkinIds.filter(id => (PREDEFINED_SKINS.find(s => s.id === id)?.price || 0) > 0).length >= 5, category: 'Collection' },
  { id: 'skinCollector', name: 'Ultimate Skin Collector', description: 'Own all available skins.', iconName: 'Briefcase', cashReward: 25000, criteria: (p) => p.ownedSkinIds.length === PREDEFINED_SKINS.length, category: 'Collection' },
  { id: 'streakStarter', name: 'Streak Starter', description: 'Achieve a 3-day study streak.', iconName: 'Zap', cashReward: 1000, criteria: (p) => p.longestStreak >= 3, category: 'Streaks & Challenges' },
  { id: 'weekLongWarrior', name: 'Week-Long Warrior', description: 'Achieve a 7-day study streak.', iconName: 'CalendarCheck', cashReward: 2500, criteria: (p) => p.longestStreak >= 7, category: 'Streaks & Challenges' },
  { id: 'fortnightFocus', name: 'Fortnight Focus', description: 'Achieve a 14-day study streak.', iconName: 'CalendarCheck', cashReward: 5000, criteria: (p) => p.longestStreak >= 14, category: 'Streaks & Challenges' },
  { id: 'unstoppableStreaker', name: 'Unstoppable Streaker', description: 'Achieve a 30-day study streak.', iconName: 'Flame', cashReward: 20000, criteria: (p) => p.longestStreak >= 30, category: 'Streaks & Challenges' },
  { id: 'challengeNewbie', name: 'Challenge Newbie', description: 'Complete 1 daily challenge.', iconName: 'TargetIcon', cashReward: 300, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 1, category: 'Streaks & Challenges' },
  { id: 'challengeChampion', name: 'Challenge Champion', description: 'Complete 10 daily challenges in total.', iconName: 'Gift', cashReward: 2000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 10, category: 'Streaks & Challenges' },
  { id: 'challengeConqueror', name: 'Challenge Conqueror', description: 'Complete 25 daily challenges in total.', iconName: 'Edit', cashReward: 5000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 25, category: 'Streaks & Challenges' },
  { id: 'challengeLegend', name: 'Challenge Legend', description: 'Complete 50 daily challenges in total.', iconName: 'Edit', cashReward: 10000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 50, category: 'Streaks & Challenges' },
  { id: 'capitalistInitiate', name: 'Capitalist Initiate', description: 'Make your first investment.', iconName: 'TrendingUp', cashReward: 1000, criteria: (p,s,c,inv) => inv.firstInvestmentMade, category: 'Capitalist' },
  { id: 'profitPioneer', name: 'Profit Pioneer', description: 'Earn a total of $10,000 profit from Capitalist Corner.', iconName: 'DollarSign', cashReward: 1500, criteria: (p,s,c,inv) => inv.totalProfit >= 10000, category: 'Capitalist' },
  { id: 'investmentGuru', name: 'Investment Guru', description: 'Earn a total of $50,000 profit from Capitalist Corner.', iconName: 'DollarSign', cashReward: 7000, criteria: (p,s,c,inv) => inv.totalProfit >= 50000, category: 'Capitalist' },
  { id: 'marketMagnate', name: 'Market Magnate', description: 'Earn a total of $250,000 profit from Capitalist Corner.', iconName: 'DollarSign', cashReward: 20000, criteria: (p,s,c,inv) => inv.totalProfit >= 250000, category: 'Capitalist' },
  { id: 'cashCollector', name: 'Cash Collector', description: 'Accumulate $50,000 cash in total.', iconName: 'TrendingDown', cashReward: 2500, criteria: (p) => p.cash >= 50000, category: 'Capitalist' },
  { id: 'wealthyScholar', name: 'Wealthy Scholar', description: 'Accumulate $250,000 cash in total.', iconName: 'TrendingDown', cashReward: 10000, criteria: (p) => p.cash >= 250000, category: 'Capitalist' },
  { id: 'studyTycoon', name: 'Study Tycoon', description: 'Accumulate $1,000,000 cash in total.', iconName: 'TrendingDown', cashReward: 50000, criteria: (p) => p.cash >= 1000000, category: 'Capitalist' },
  { id: 'diligentRevisionist', name: 'Diligent Revisionist', description: 'Add 5 concepts to the Revision Hub.', iconName: 'Brain', cashReward: 1000, criteria: (p) => (p.notepadData.revisionConcepts?.length || 0) >= 5, category: 'Notepad & Revision' },
  { id: 'revisionRegular', name: 'Revision Regular', description: 'Add 15 concepts to the Revision Hub.', iconName: 'Brain', cashReward: 2500, criteria: (p) => (p.notepadData.revisionConcepts?.length || 0) >= 15, category: 'Notepad & Revision' },
  { id: 'memoryMaster', name: 'Memory Master', description: 'Successfully revise 10 concepts through their cycle (stage 3+).', iconName: 'AlignLeft', cashReward: 3000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 3).length || 0) >= 10, category: 'Notepad & Revision' },
  { id: 'recallChampion', name: 'Recall Champion', description: 'Successfully revise 25 concepts (stage 3+).', iconName: 'AlignLeft', cashReward: 6000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 3).length || 0) >= 25, category: 'Notepad & Revision' },
  { id: 'perfectRecall', name: 'Perfect Recall', description: 'Master 20 concepts in Revision Hub (stage 5+).', iconName: 'Link2', cashReward: 10000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 5).length || 0) >= 20, category: 'Notepad & Revision' },
  { id: 'taskScheduler', name: 'Task Scheduler', description: 'Complete 20 tasks from your checklist.', iconName: 'CheckSquare', cashReward: 1500, criteria: (p) => (p.notepadData.tasks.filter(t => t.completed).length || 0) >= 20, category: 'Notepad & Revision' },
  { id: 'goalGetter', name: 'Goal Getter', description: 'Complete 10 goals from your goals list.', iconName: 'TargetIcon', cashReward: 2000, criteria: (p) => (p.notepadData.goals.filter(g => g.completed).length || 0) >= 10, category: 'Notepad & Revision' },
  { id: 'habitFormer', name: 'Habit Former', description: 'Create your first habit.', iconName: 'HabitIcon', cashReward: 500, criteria: (p) => (p.notepadData.habits?.length || 0) >= 1, category: 'Habits' },
  { id: 'dailyDiscipliner', name: 'Daily Discipliner', description: 'Maintain a 7-day streak on any daily habit.', iconName: 'Repeat', cashReward: 1500, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'daily' && h.currentStreak >= 7), category: 'Habits' },
  { id: 'weeklyWarrior', name: 'Weekly Warrior', description: 'Maintain a 4-week streak on any weekly habit.', iconName: 'Repeat', cashReward: 2000, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'weekly' && h.currentStreak >= 4), category: 'Habits' },
  { id: 'habitualAchiever', name: 'Habitual Achiever', description: 'Complete 50 habit instances in total.', iconName: 'ListChecks', cashReward: 3000, criteria: (p) => (p.notepadData.habits?.reduce((sum, hab) => sum + Object.values(hab.log).filter(l => l.completed).length, 0) || 0) >= 50, category: 'Habits'},
  { id: 'completionist', name: 'Completionist', description: 'Unlock all other achievements.', iconName: 'Award', cashReward: 100000, criteria: (p,s,c,inv) => (p.unlockedAchievementIds?.length || 0) >= ALL_ACHIEVEMENTS.length -1, category: 'General' },
];

export const ALL_SKILLS: Skill[] = [
  // Always Unlocked
  { id: 'unlockTimers', name: 'Core Timers', description: 'Access Pomodoro and Stopwatch timers.', cost: 0, iconName: 'Clock', unlocksFeature: 'timers', category: 'Core Feature' },
  { id: 'unlockSkillTree', name: 'Path of Growth', description: 'Access the Skill Tree to unlock abilities.', cost: 0, iconName: 'Network', unlocksFeature: 'skill-tree', category: 'Core Feature' },
  
  // Core Feature Unlocks - Tier 1 (Logical progression from base)
  { id: 'unlockAbout', name: 'Inquisitive Mind', description: 'Unlocks the "About" page to learn more about StudyFlow.', cost: 1, iconName: 'HelpCircle', unlocksFeature: 'about', prerequisiteLevel: 1, category: 'Core Feature' },
  { id: 'unlockStats', name: 'Data Analyst', description: 'Unlocks the "Statistics" page to monitor your study habits.', cost: 1, iconName: 'BarChart3', unlocksFeature: 'stats', prerequisiteLevel: 2, category: 'Core Feature' },
  { id: 'unlockNotepadMain', name: 'Notekeeper', description: 'Unlocks the main "Digital Notepad" page. Essential for organizing studies.', cost: 1, iconName: 'NotebookText', unlocksFeature: 'notepad', prerequisiteLevel: 2, category: 'Core Feature' },
  
  // Notepad Tab Unlocks - Tier 2 (Branching off Notekeeper Access)
  { id: 'unlockNotepadChecklist', name: 'Task Organizer', description: 'Unlocks the Checklist tab in the Notepad.', cost: 1, iconName: 'CheckSquare2', unlocksFeature: 'notepadChecklist', prerequisiteSkillIds: ['unlockNotepadMain'], prerequisiteLevel: 3, category: 'Notepad Feature' },
  { id: 'unlockNotepadNotes', name: 'Quick Notes', description: 'Unlocks the Notes tab for freeform thoughts.', cost: 1, iconName: 'StickyNote', unlocksFeature: 'notepadNotes', prerequisiteSkillIds: ['unlockNotepadMain'], prerequisiteLevel: 3, category: 'Notepad Feature' },
  
  // More App Features - Tier 2 & 3 (Branching off Core or Stats)
  { id: 'unlockAchievements', name: 'Milestone Monitor', description: 'Unlocks the "Achievements" page.', cost: 1, iconName: 'Award', unlocksFeature: 'achievements', prerequisiteLevel: 3, prerequisiteSkillIds: ['unlockStats'], category: 'Core Feature' },
  { id: 'unlockShop', name: 'Aspiring Collector', description: 'Unlocks the "Skin Shop".', cost: 1, iconName: 'ShoppingCart', unlocksFeature: 'shop', prerequisiteLevel: 4, prerequisiteSkillIds: ['unlockStats'], category: 'Core Feature' },
  { id: 'unlockAmbiance', name: 'Ambiance Weaver', description: 'Unlocks the "Ambiance Mixer".', cost: 1, iconName: 'Wind', unlocksFeature: 'ambiance', prerequisiteLevel: 4, prerequisiteSkillIds: ['unlockAbout'], category: 'Core Feature' },

  // Advanced Notepad Features - Tier 3 (Requires earlier notepad skills or higher level)
  { id: 'unlockNotepadGoals', name: 'Goal Setter', description: 'Unlocks the Goals tab in Notepad.', cost: 1, iconName: 'Target', unlocksFeature: 'notepadGoals', prerequisiteSkillIds: ['unlockNotepadChecklist'], prerequisiteLevel: 4, category: 'Notepad Feature' },
  { id: 'unlockNotepadLinks', name: 'Resource Manager', description: 'Unlocks the Links tab in Notepad.', cost: 1, iconName: 'LinkLucide', unlocksFeature: 'notepadLinks', prerequisiteSkillIds: ['unlockNotepadNotes'], prerequisiteLevel: 4, category: 'Notepad Feature' },
  
  // Core Gameplay Loop Features - Tier 3 & 4
  { id: 'unlockChallenges', name: 'Challenge Seeker', description: 'Unlocks "Daily Challenges".', cost: 2, iconName: 'CalendarCheck', unlocksFeature: 'challenges', prerequisiteLevel: 5, prerequisiteSkillIds: ['unlockAchievements'], category: 'Core Feature' },
  { id: 'unlockCountdown', name: 'Event Tracker', description: 'Unlocks the main "Countdown Timer" page.', cost: 1, iconName: 'Timer', unlocksFeature: 'countdown', prerequisiteLevel: 5, prerequisiteSkillIds: ['unlockAbout'], category: 'Core Feature' },
  
  // Top Tier Features & Notepad - Tier 4 & 5
  { id: 'unlockCapitalist', name: 'Budding Investor', description: 'Unlocks the "Capitalist Corner".', cost: 2, iconName: 'Briefcase', unlocksFeature: 'capitalist', prerequisiteLevel: 6, prerequisiteSkillIds: ['unlockShop'], category: 'Core Feature' },
  { id: 'unlockNotepadRevision', name: 'Revision Strategist', description: 'Unlocks the "Revision Hub" in Notepad.', cost: 2, iconName: 'Brain', unlocksFeature: 'notepadRevision', prerequisiteSkillIds: ['unlockNotepadNotes', 'unlockNotepadGoals'], prerequisiteLevel: 6, category: 'Notepad Feature' },
  { id: 'unlockNotepadHabits', name: 'Habit Builder', description: 'Unlocks the "Habit Tracker" tab in Notepad.', cost: 2, iconName: 'HabitIcon', unlocksFeature: 'notepadHabits', prerequisiteSkillIds: ['unlockNotepadGoals'], prerequisiteLevel: 7, category: 'Notepad Feature' },
  { id: 'unlockNotepadEvents', name: 'Deadline Master', description: 'Unlocks the "Events Countdown" tab in Notepad.', cost: 1, iconName: 'CalendarClock', unlocksFeature: 'notepadEvents', prerequisiteSkillIds: ['unlockCountdown', 'unlockNotepadGoals'], prerequisiteLevel: 7, category: 'Notepad Feature' },
  { id: 'unlockNotepadEisenhower', name: 'Priority Expert', description: 'Unlocks the "Eisenhower Matrix" in Notepad.', cost: 2, iconName: 'Grid', unlocksFeature: 'notepadEisenhower', prerequisiteSkillIds: ['unlockNotepadHabits'], prerequisiteLevel: 8, category: 'Notepad Feature' },

  // Passive Boosts Branch - XP
  { id: 'xpBoost1', name: 'Learner\'s Edge I', description: 'Gain +5% XP from all study sessions.', cost: 1, iconName: 'Zap', xpBoostPercent: 0.05, prerequisiteLevel: 3, prerequisiteSkillIds: ['unlockAmbiance'], category: 'Passive Boost' },
  { id: 'xpBoost2', name: 'Learner\'s Edge II', description: 'Gain an additional +5% XP (total +10%).', cost: 2, iconName: 'Zap', xpBoostPercent: 0.05, prerequisiteLevel: 8, prerequisiteSkillIds: ['xpBoost1'], category: 'Passive Boost' },
  { id: 'xpBoost3', name: 'Learner\'s Edge III', description: 'Gain an additional +10% XP (total +20%).', cost: 3, iconName: 'Zap', xpBoostPercent: 0.10, prerequisiteLevel: 15, prerequisiteSkillIds: ['xpBoost2'], category: 'Passive Boost' },

  // Passive Boosts Branch - Cash
  { id: 'cashBoost1', name: 'Money Mindset I', description: 'Gain +5% Cash from all study sessions.', cost: 1, iconName: 'DollarSign', cashBoostPercent: 0.05, prerequisiteLevel: 4, prerequisiteSkillIds: ['unlockCountdown'], category: 'Passive Boost' },
  { id: 'cashBoost2', name: 'Money Mindset II', description: 'Gain an additional +5% Cash (total +10%).', cost: 2, iconName: 'DollarSign', cashBoostPercent: 0.05, prerequisiteLevel: 9, prerequisiteSkillIds: ['cashBoost1'], category: 'Passive Boost' },
  { id: 'cashBoost3', name: 'Money Mindset III', description: 'Gain an additional +10% Cash (total +20%).', cost: 3, iconName: 'DollarSign', cashBoostPercent: 0.10, prerequisiteLevel: 16, prerequisiteSkillIds: ['cashBoost2'], category: 'Passive Boost' },

  // Utility Skills - Higher Cost / Unique Effects
  { id: 'streakShield', name: 'Streak Guardian', description: 'Once every 7 real-world days, your study streak is protected if you miss a day of studying. (Effect logic is conceptual for now)', cost: 3, iconName: 'ShieldCheck', otherEffect: 'streak_shield', prerequisiteLevel: 7, prerequisiteSkillIds: ['unlockChallenges'], category: 'Utility' },
  { id: 'shopDiscount1', name: 'Savvy Shopper', description: 'Get a 5% discount on all skin purchases.', cost: 2, iconName: 'Percent', shopDiscountPercent: 0.05, prerequisiteLevel: 6, prerequisiteSkillIds: ['unlockShop'], category: 'Utility' },
  { id: 'investmentInsight', name: 'Investor\'s Edge', description: 'Slightly increases minimum ROI and bonus chance in Capitalist Corner. (Effect logic is conceptual)', cost: 2, iconName: 'Lightbulb', otherEffect: 'capitalist_boost', prerequisiteLevel: 10, prerequisiteSkillIds: ['unlockCapitalist'], category: 'Utility' },
  { id: 'revisionAccelerator', name: 'Memory Enhancer', description: 'Reduces revision intervals in the Revision Hub by 10%.', cost: 2, iconName: 'RepeatIcon', otherEffect: 'revision_boost', prerequisiteLevel: 8, prerequisiteSkillIds: ['unlockNotepadRevision'], category: 'Utility' },
  { id: 'skillPointRefund', name: 'Strategic Respec', description: 'Allows refunding ALL spent skill points ONCE. Use wisely!', cost: 5, iconName: 'Settings2', otherEffect: 'skill_refund', prerequisiteLevel: 12, prerequisiteSkillIds: ['streakShield','shopDiscount1', 'investmentInsight'], category: 'Utility' },
];

const REVISION_INTERVALS = [1, 3, 7, 14, 30, 60, 90]; 
const defaultAchievementPayload: AchievementCriteriaInvestmentPayload = { firstInvestmentMade: false, totalProfit: 0 };

interface SessionContextType {
  sessions: StudySession[];
  addSession: (sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number; tags?: string[], isFullPomodoroCycle?: boolean }) => void;
  addManualSession: (details: { durationInSeconds: number; endTime: number; type: 'Pomodoro Focus' | 'Stopwatch'; description: string; }) => void;
  deleteSession: (sessionId: string) => void;
  addTestSession: () => void;
  clearSessions: () => void;
  updateSessionDescription: (sessionId: string, description: string) => void;
  
  userProfile: UserProfile;
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  updateSleepWakeTimes: (wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => void;

  pomodoroState: PomodoroState;
  startPomodoro: () => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  switchPomodoroMode: (mode?: PomodoroMode) => void;
  updatePomodoroSettings: (newSettings: Partial<PomodoroSettings>) => void;
  logPomodoroSession: () => void;
  
  stopwatchState: StopwatchState;
  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
  logStopwatchSession: () => void;

  addNotepadNote: (note: Omit<NotepadNote, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateNotepadNote: (note: NotepadNote) => void;
  deleteNotepadNote: (noteId: string) => void;
  addRevisionConcept: (name: string, learnedDate: Date) => void;
  markConceptRevised: (conceptId: string) => void;
  deleteRevisionConcept: (conceptId: string) => void;

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'log' | 'currentStreak' | 'longestStreak'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  logHabitCompletion: (habitId: string, date: Date, completed?: boolean, countIncrement?: number) => void;
  getHabitCompletionForDate: (habit: Habit, date: Date) => HabitLogEntry | undefined;
  getHabitCompletionsForWeek: (habit: Habit, date: Date) => number;

  addNotepadCountdownEvent: (event: Omit<NotepadCountdownEvent, 'id' | 'createdAt'>) => void;
  updateNotepadCountdownEvent: (event: NotepadCountdownEvent) => void;
  deleteNotepadCountdownEvent: (eventId: string) => void;
  updateNotepadEisenhowerMatrix: (matrix: UserProfile['notepadData']['eisenhowerMatrix']) => void;

  getSkinById: (id: string) => Skin | undefined;
  buySkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => void;
  isSkinOwned: (skinId: string) => boolean;
  capitalistOffers: CapitalistOffer[];
  ensureCapitalistOffers: () => void;
  investInOffer: (offerId: string, investmentAmount: number) => Promise<{ success: boolean; message: string; profit?: number }>;
  lastOfferGenerationTime: number | null;
  dailyChallenges: DailyChallenge[];
  claimChallengeReward: (challengeId: string) => void;
  updateChallengeProgress: (type: DailyChallenge['type'], value: number, absoluteValue?: boolean) => void;
  getUnlockedAchievements: () => Achievement[];
  checkAndUnlockAchievements: (investmentPayload?: Partial<AchievementCriteriaInvestmentPayload>) => void;
  isLoaded: boolean;
  updateNotepadData: (updatedNotepadData: Partial<NotepadData>) => void;

  getAllSkills: () => Skill[];
  isSkillUnlocked: (skillId: string) => boolean;
  canUnlockSkill: (skillId: string) => { can: boolean, reason?: string };
  unlockSkill: (skillId: string) => boolean;
  isFeatureUnlocked: (featureKey: FeatureKey) => boolean;
  getAppliedBoost: (type: 'xp' | 'cash' | 'shopDiscount') => number;
  refundAllSkillPoints: () => void;

  floatingGains: FloatingGain[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [capitalistOffers, setCapitalistOffers] = useState<CapitalistOffer[]>([]);
  const [lastOfferGenerationTime, setLastOfferGenerationTime] = useState<number | null>(null);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [lastChallengeResetDate, setLastChallengeResetDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [capitalistStatsForAchievements, setCapitalistStatsForAchievements] = useState<AchievementCriteriaInvestmentPayload>(defaultAchievementPayload);
  const [floatingGains, setFloatingGains] = useState<FloatingGain[]>([]);

  // Timer States
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>(DEFAULT_POMODORO_STATE);
  const [stopwatchState, setStopwatchState] = useState<StopwatchState>(DEFAULT_STOPWATCH_STATE);

  const applyThemePreference = useCallback((themeClassToApply?: string | null) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    PREDEFINED_SKINS.forEach(skin => {
        if (skin.isTheme && skin.themeClass && skin.themeClass !== 'classic') {
            root.classList.remove(skin.themeClass);
        }
    });
    if (themeClassToApply && themeClassToApply !== 'classic') { 
      root.classList.add(themeClassToApply);
    }
  }, []);
  
  const addFloatingGain = useCallback((type: 'xp' | 'cash', amount: number) => {
    if (amount === 0) return;
    const newGain: FloatingGain = { id: crypto.randomUUID(), type, amount, timestamp: Date.now() };
    setFloatingGains(prev => [...prev, newGain]);
    setTimeout(() => setFloatingGains(prev => prev.filter(g => g.id !== newGain.id)), 2500);
  }, []);

  const updateUserProfile = useCallback((updatedProfileData: Partial<UserProfile>) => {
    setUserProfile(prev => ({...prev, ...updatedProfileData}));
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
    toast({ title: "Session Log Cleared", description: "All study sessions have been removed.", icon: <Trash2/> });
  }, [toast]);

  const isSkillUnlocked = useCallback((skillId: string) => {
    return userProfile.unlockedSkillIds.includes(skillId);
  }, [userProfile.unlockedSkillIds]);

  const isFeatureUnlocked = useCallback((featureKey: FeatureKey) => {
    if (featureKey === 'timers' || featureKey === 'skill-tree') return true;
    const skill = ALL_SKILLS.find(s => s.unlocksFeature === featureKey);
    if (!skill) {
      console.warn(`isFeatureUnlocked: No skill defined for featureKey '${featureKey}'. Feature is considered locked.`);
      return false; 
    }
    return isSkillUnlocked(skill.id);
  }, [isSkillUnlocked]);
  
  const updateChallengeProgress = useCallback((type: DailyChallenge['type'], value: number, absoluteValue: boolean = false) => {
    if(!isFeatureUnlocked('challenges')) return;
    setDailyChallenges(prevChallenges =>
        prevChallenges.map(challenge => {
            if (challenge.type === type && !challenge.isCompleted && !challenge.rewardClaimed) {
                const newCurrentValue = absoluteValue ? value : Math.min((challenge.currentValue || 0) + value, challenge.targetValue);
                const isNowCompleted = newCurrentValue >= challenge.targetValue;
                if (isNowCompleted && !challenge.isCompleted) {
                     toast({ title: "Challenge Goal Met!", description: `Claim '${challenge.title}' reward.`, icon: <Gift/> });
                }
                return { ...challenge, currentValue: newCurrentValue, isCompleted: isNowCompleted, lastProgressUpdate: Date.now() };
            }
            return challenge;
        })
    );
  }, [toast, isFeatureUnlocked]);
  
  const getAppliedBoost = useCallback((type: 'xp' | 'cash' | 'shopDiscount'): number => {
    return userProfile.unlockedSkillIds.reduce((totalBoost, skillId) => {
      const skill = ALL_SKILLS.find(s => s.id === skillId);
      if (skill && isSkillUnlocked(skillId)) { 
        if (type === 'xp' && skill.xpBoostPercent) return totalBoost + skill.xpBoostPercent;
        if (type === 'cash' && skill.cashBoostPercent) return totalBoost + skill.cashBoostPercent;
        if (type === 'shopDiscount' && skill.shopDiscountPercent) return totalBoost + skill.shopDiscountPercent;
      }
      return totalBoost;
    }, 0);
  }, [userProfile.unlockedSkillIds, isSkillUnlocked]);
  
  const checkForLevelUp = useCallback((currentXp: number, currentLevel: number) => {
    let newLevel = currentLevel;
    let newTitle = TITLES[currentLevel -1] || TITLES[TITLES.length -1];
    let leveledUp = false;
    let skillPointsGained = 0;
    while (newLevel < ACTUAL_LEVEL_THRESHOLDS.length && currentXp >= ACTUAL_LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
      leveledUp = true;
      skillPointsGained++;
    }
    if (leveledUp) {
      newTitle = TITLES[newLevel - 1] || TITLES[TITLES.length -1];
      let description = `You've reached Level ${newLevel}: ${newTitle}!`;
      if (skillPointsGained > 0) description += ` You earned ${skillPointsGained} Skill Point(s)!`;
      toast({ title: "Level Up!", description, icon: <Sparkles/> });
    }
    return { newLevel, newTitle, leveledUp, skillPointsGained };
  }, [toast]);

  const updateStreakAndGetBonus = useCallback((currentProfile: UserProfile) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    let currentStudyStreak = currentProfile.currentStreak;
    let longestStudyStreak = currentProfile.longestStreak;
    let lastStudyDay = currentProfile.lastStudyDate;

    if (lastStudyDay) {
      const lastDate = parseISO(lastStudyDay);
      const diff = differenceInDays(today, lastDate);
      if (diff === 1) {
        currentStudyStreak++;
      } else if (diff > 1) {
        currentStudyStreak = 1; 
      }
    } else { 
      currentStudyStreak = 1;
    }

    let newLastStudyDate = lastStudyDay;
    if (lastStudyDay !== todayStr) { 
        if (currentStudyStreak > longestStudyStreak) {
            longestStudyStreak = currentStudyStreak;
        }
        newLastStudyDate = todayStr;
    }
    
    const baseStreakBonus = Math.min(currentStudyStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
    const skillXpBoost = getAppliedBoost('xp');
    const skillCashBoost = getAppliedBoost('cash');

    return {
        streakBonusMultiplier: baseStreakBonus,
        totalXpMultiplier: 1 + baseStreakBonus + skillXpBoost,
        totalCashMultiplier: 1 + baseStreakBonus + skillCashBoost,
        updatedCurrentStreak: currentStudyStreak,
        updatedLongestStreak: longestStudyStreak,
        updatedLastStudyDate: newLastStudyDate
    };
  }, [getAppliedBoost]);

  const addSession = useCallback((sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number; tags?: string[], isFullPomodoroCycle?: boolean, description?: string }) => {
    if (sessionDetails.durationInSeconds <= 0) { console.warn("Attempted to log session with zero duration."); return; }
    const newSession: StudySession = {
      id: crypto.randomUUID(), type: sessionDetails.type, startTime: sessionDetails.startTime,
      endTime: sessionDetails.startTime + sessionDetails.durationInSeconds * 1000, duration: sessionDetails.durationInSeconds,
      tags: sessionDetails.tags || [], isFullPomodoroCycle: sessionDetails.isFullPomodoroCycle || false, description: sessionDetails.description,
    };
    setSessions(prevSessions => [newSession, ...prevSessions].sort((a, b) => b.startTime - a.startTime));
    
    setUserProfile(prevProfile => {
        const { totalXpMultiplier, totalCashMultiplier, updatedCurrentStreak, updatedLongestStreak, updatedLastStudyDate } = updateStreakAndGetBonus(prevProfile);
        let awardedXp = 0, awardedCash = 0;
        const minutesStudied = sessionDetails.durationInSeconds / 60;

        if (sessionDetails.type === 'Pomodoro Focus' || sessionDetails.type === 'Stopwatch') {
          awardedXp = Math.floor(minutesStudied * XP_PER_MINUTE_FOCUS * totalXpMultiplier);
          awardedCash = Math.floor((minutesStudied / 5) * CASH_PER_5_MINUTES_FOCUS * totalCashMultiplier);
          if(isFeatureUnlocked('challenges')) updateChallengeProgress('studyDurationMinutes', Math.floor(minutesStudied));
        }
        if (sessionDetails.type === 'Pomodoro Focus' && sessionDetails.isFullPomodoroCycle && isFeatureUnlocked('challenges')) {
            updateChallengeProgress('pomodoroCycles', 1);
        }

        if (prevProfile.lastStudyDate !== updatedLastStudyDate && isFeatureUnlocked('challenges')) { 
            updateChallengeProgress('studyStreak', 1);
        }
        
        const newXp = prevProfile.xp + awardedXp;
        const { newLevel, newTitle, skillPointsGained } = checkForLevelUp(newXp, prevProfile.level);
        const newSkillPoints = (prevProfile.skillPoints || 0) + skillPointsGained;

        if (awardedXp > 0) addFloatingGain('xp', awardedXp);
        if (awardedCash > 0) addFloatingGain('cash', awardedCash);

        const rewardParts: string[] = [];
        if (awardedXp > 0) rewardParts.push(`${awardedXp} XP`);
        if (awardedCash > 0) rewardParts.push(`$${awardedCash.toLocaleString()}`);
        
        const baseStreakBonusPercent = (totalXpMultiplier - 1 - getAppliedBoost('xp')) * 100; 
        if (baseStreakBonusPercent > 0.1 && (awardedXp > 0 || awardedCash > 0)) { 
            rewardParts.push(`(+${baseStreakBonusPercent.toFixed(0)}% streak)`);
        }
        const skillBonusXpPercent = getAppliedBoost('xp') * 100;
        if (skillBonusXpPercent > 0 && awardedXp > 0) { rewardParts.push(`(+${skillBonusXpPercent.toFixed(0)}% skill XP)`); }
        const skillBonusCashPercent = getAppliedBoost('cash') * 100;
        if (skillBonusCashPercent > 0 && awardedCash > 0) { rewardParts.push(`(+${skillBonusCashPercent.toFixed(0)}% skill cash)`); }

        if (rewardParts.length > 0) {
            toast({ title: "Session Rewards!", description: `Gained: ${rewardParts.join(', ')}`, icon: <Gift /> });
        }

        return {
          ...prevProfile, xp: newXp, cash: prevProfile.cash + awardedCash, level: newLevel, title: newTitle,
          currentStreak: updatedCurrentStreak, longestStreak: updatedLongestStreak, lastStudyDate: updatedLastStudyDate,
          skillPoints: newSkillPoints,
        };
      });
  }, [updateStreakAndGetBonus, getAppliedBoost, checkForLevelUp, updateChallengeProgress, addFloatingGain, toast, isFeatureUnlocked]);
  
  const addManualSession = useCallback((details: { durationInSeconds: number; endTime: number; type: 'Pomodoro Focus' | 'Stopwatch'; description: string; }) => {
    const startTime = details.endTime - details.durationInSeconds * 1000;
    addSession({
      type: details.type,
      startTime: startTime,
      durationInSeconds: details.durationInSeconds,
      description: details.description,
      isFullPomodoroCycle: details.type === 'Pomodoro Focus' ? (details.durationInSeconds / 60) >= pomodoroState.settings.workDuration : false,
    });
  }, [addSession, pomodoroState.settings.workDuration]);

  const addTestSession = useCallback(() => {
    addSession({
      type: 'Pomodoro Focus',
      startTime: Date.now() - (30 * 60 * 1000),
      durationInSeconds: 30 * 60,
      isFullPomodoroCycle: true,
    });
    toast({title: "Test Session Added", description: "A 30-minute focus session has been logged.", icon: <Zap />});
  }, [addSession, toast]);

  const deleteSession = useCallback((sessionId: string) => {
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    if (sessionToDelete) {
      toast({ title: "Session Deleted", description: `Session type "${sessionToDelete.type}" removed.`, icon: <Trash2 /> });
    }
  }, [sessions, toast]);

  const updateSessionDescription = useCallback((sessionId: string, description: string) => {
    setSessions(prevSessions => prevSessions.map(session => session.id === sessionId ? { ...session, description } : session));
  }, []);

  const updateNotepadData = useCallback((updatedNotepadData: Partial<NotepadData>) => {
    setUserProfile(prev => ({
      ...prev,
      notepadData: {
        ...(prev.notepadData || DEFAULT_NOTEPAD_DATA),
        ...updatedNotepadData,
      }
    }));
  }, []);

  const updateNotepadField = useCallback(<K extends keyof NotepadData>(field: K, data: NotepadData[K]) => {
      updateNotepadData({ [field]: data });
  }, [updateNotepadData]);

  const addNotepadNote = useCallback((note: Omit<NotepadNote, 'id' | 'createdAt' | 'lastModified'>) => {
    if(!isFeatureUnlocked('notepadNotes')) { toast({ title: "Feature Locked", description: "Unlock Notes in the Skill Tree.", icon: <XCircle/> }); return; }
    const newNote: NotepadNote = { ...note, id: crypto.randomUUID(), createdAt: Date.now(), lastModified: Date.now() };
    updateNotepadField('notes', [newNote, ...(userProfile.notepadData.notes || [])]);
    if(isFeatureUnlocked('challenges')) updateChallengeProgress('notepadEntry', 1);
    toast({ title: "Note Added", description: `"${note.title}" saved.`, icon: <StickyNote/> });
  }, [isFeatureUnlocked, userProfile.notepadData.notes, updateNotepadField, updateChallengeProgress, toast]);

  const updateNotepadNote = useCallback((updatedNote: NotepadNote) => {
    if(!isFeatureUnlocked('notepadNotes')) return;
    updateNotepadField('notes', (userProfile.notepadData.notes || []).map(note => note.id === updatedNote.id ? { ...updatedNote, lastModified: Date.now() } : note));
    toast({ title: "Note Updated", description: `"${updatedNote.title}" saved.`, icon: <Save/> });
  }, [isFeatureUnlocked, userProfile.notepadData.notes, updateNotepadField, toast]);

  const deleteNotepadNote = useCallback((noteId: string) => {
    if(!isFeatureUnlocked('notepadNotes')) return;
    const noteToDelete = (userProfile.notepadData.notes || []).find(n => n.id === noteId);
    updateNotepadField('notes', (userProfile.notepadData.notes || []).filter(note => note.id !== noteId));
    if (noteToDelete) toast({ title: "Note Deleted", description: `"${noteToDelete.title}" removed.`, icon: <Trash2/> });
  }, [isFeatureUnlocked, userProfile.notepadData.notes, updateNotepadField, toast]);

  const addRevisionConcept = useCallback((name: string, learnedDate: Date) => {
    if(!isFeatureUnlocked('notepadRevision')) { toast({ title: "Feature Locked", description: "Unlock Revision Hub in the Skill Tree.", icon: <XCircle/> }); return; }
    const learnedDateStr = format(learnedDate, 'yyyy-MM-dd');
    let revisionAcceleratorBoost = 1;
    if(isSkillUnlocked('revisionAccelerator')) revisionAcceleratorBoost = 0.9; 
    const calculateNextRevDate = (lsd: string, stage: number) => {
      let interval = REVISION_INTERVALS[stage] || REVISION_INTERVALS[REVISION_INTERVALS.length - 1];
      interval = Math.max(1, Math.round(interval * revisionAcceleratorBoost));
      return format(addDays(parseISO(lsd), interval), 'yyyy-MM-dd');
    };
    const newConcept: RevisionConcept = { id: crypto.randomUUID(), name, learnedDate: learnedDateStr, lastRevisedDate: learnedDateStr, nextRevisionDate: calculateNextRevDate(learnedDateStr, 0), revisionStage: 0 };
    updateNotepadField('revisionConcepts', [...(userProfile.notepadData.revisionConcepts || []), newConcept]);
    if(isFeatureUnlocked('challenges')) updateChallengeProgress('notepadEntry', 1);
    toast({ title: "Concept Added", description: `"${name}" for revision.`, icon: <Brain/>});
  }, [isFeatureUnlocked, userProfile.notepadData.revisionConcepts, isSkillUnlocked, updateNotepadField, updateChallengeProgress, toast]);

  const markConceptRevised = useCallback((conceptId: string) => {
    if(!isFeatureUnlocked('notepadRevision')) return;
    let revisionAcceleratorBoost = 1;
    if(isSkillUnlocked('revisionAccelerator')) revisionAcceleratorBoost = 0.9;
    const calculateNextRevDate = (lsd: string, stage: number) => {
      let interval = REVISION_INTERVALS[stage] || REVISION_INTERVALS[REVISION_INTERVALS.length - 1];
      interval = Math.max(1, Math.round(interval * revisionAcceleratorBoost));
      return format(addDays(parseISO(lsd), interval), 'yyyy-MM-dd');
    };
    const concepts = (userProfile.notepadData.revisionConcepts || []).map(c => {
        if (c.id === conceptId) {
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const newStage = c.revisionStage + 1;
          return { ...c, lastRevisedDate: todayStr, nextRevisionDate: calculateNextRevDate(todayStr, newStage), revisionStage: newStage };
        }
        return c;
      });
    updateNotepadField('revisionConcepts', concepts);
    toast({ title: "Concept Revised!", description: "Schedule updated.", icon: <CheckCircle/>});
  }, [isFeatureUnlocked, userProfile.notepadData.revisionConcepts, isSkillUnlocked, updateNotepadField, toast]);

  const deleteRevisionConcept = useCallback((conceptId: string) => {
    if(!isFeatureUnlocked('notepadRevision')) return;
    const conceptToDelete = (userProfile.notepadData.revisionConcepts || []).find(c => c.id === conceptId);
    updateNotepadField('revisionConcepts', (userProfile.notepadData.revisionConcepts || []).filter(c => c.id !== conceptId));
    if (conceptToDelete) toast({ title: "Concept Removed", description: `"${conceptToDelete.name}" removed.`, icon: <Trash2/> });
  }, [isFeatureUnlocked, userProfile.notepadData.revisionConcepts, updateNotepadField, toast]);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'log' | 'currentStreak' | 'longestStreak'>) => {
    if(!isFeatureUnlocked('notepadHabits')) { toast({ title: "Feature Locked", description: "Unlock Habit Tracker in the Skill Tree.", icon: <XCircle/> }); return; }
    const newHabit: Habit = { ...habitData, id: crypto.randomUUID(), createdAt: Date.now(), log: {}, currentStreak: 0, longestStreak: 0 };
    updateNotepadField('habits', [...(userProfile.notepadData.habits || []), newHabit]);
    toast({ title: "Habit Added", description: `"${newHabit.name}" created.`, icon: <HabitIcon/> });
  }, [isFeatureUnlocked, userProfile.notepadData.habits, updateNotepadField, toast]);

  const updateHabit = useCallback((updatedHabit: Habit) => {
    if(!isFeatureUnlocked('notepadHabits')) return;
    updateNotepadField('habits', (userProfile.notepadData.habits || []).map(h => h.id === updatedHabit.id ? updatedHabit : h));
    toast({ title: "Habit Updated", description: `"${updatedHabit.name}" saved.`, icon: <Save/>});
  }, [isFeatureUnlocked, userProfile.notepadData.habits, updateNotepadField, toast]);

  const deleteHabit = useCallback((habitId: string) => {
    if(!isFeatureUnlocked('notepadHabits')) return;
    const habitToDelete = (userProfile.notepadData.habits || []).find(h => h.id === habitId);
    updateNotepadField('habits', (userProfile.notepadData.habits || []).filter(h => h.id !== habitId));
    if (habitToDelete) toast({ title: "Habit Deleted", description: `"${habitToDelete.name}" removed.`, icon: <Trash2/>});
  }, [isFeatureUnlocked, userProfile.notepadData.habits, updateNotepadField, toast]);
  
  const getHabitLogKey = useCallback((habit: Habit, date: Date): string => {
    return habit.frequency === 'daily' ? format(date, 'yyyy-MM-dd') : `${format(date, 'yyyy')}-W${String(getWeek(date, { weekStartsOn: 1 })).padStart(2, '0')}`;
  }, []);

  const getHabitCompletionsForWeek = useCallback((habit: Habit, date: Date): number => {
    if (habit.frequency !== 'weekly' || !habit.targetCompletions) return 0;
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    let completions = 0;
    for (let i = 0; i < 7; i++) {
      const dayInWeek = addDays(weekStart, i);
      const dayKey = format(dayInWeek, 'yyyy-MM-dd'); 
      const logEntry = habit.log[dayKey];
      if (logEntry && logEntry.completed) completions += (logEntry.count || 1);
    }
    return completions;
  }, []);
  
  const getHabitCompletionForDate = useCallback((habit: Habit, date: Date): HabitLogEntry | undefined => {
    const logKey = habit.frequency === 'daily' ? format(date, 'yyyy-MM-dd') : format(date, 'yyyy-MM-dd'); 
    return habit.log[logKey];
  }, []);

  const logHabitCompletion = useCallback((habitId: string, date: Date, completed: boolean = true, countIncrement?: number) => {
    if(!isFeatureUnlocked('notepadHabits')) return;
    setUserProfile(prevProfile => {
        if (!prevProfile.notepadData?.habits) return prevProfile;
        let habitCompletedForChallenge = false;
        const updatedHabits = prevProfile.notepadData.habits.map(habit => {
            if (habit.id === habitId) {
                const logKey = habit.frequency === 'daily' ? format(date, 'yyyy-MM-dd') : format(date, 'yyyy-MM-dd');
                const oldLogEntry = habit.log[logKey] || { date: logKey, completed: false, count: 0 };
                let newCount = oldLogEntry.count || 0;
                if (completed) newCount = (oldLogEntry.count || 0) + (countIncrement || 1);
                else newCount = Math.max(0, (oldLogEntry.count || 0) - (countIncrement || 1));
                const newLogEntry: HabitLogEntry = { ...oldLogEntry, completed: newCount > 0, count: newCount };
                const newLog = { ...habit.log, [logKey]: newLogEntry };
                let currentStreak = habit.currentStreak, longestStreak = habit.longestStreak;
                if (habit.frequency === 'daily') {
                    if (newLogEntry.completed) {
                        const yesterdayKey = format(subDays(date, 1), 'yyyy-MM-dd');
                        if (newLog[yesterdayKey]?.completed) currentStreak++; else currentStreak = 1;
                        if (currentStreak > longestStreak) longestStreak = currentStreak;
                        habitCompletedForChallenge = true;
                    } else { if (logKey === format(date, 'yyyy-MM-dd') && !newLogEntry.completed && isToday(date)) currentStreak = 0; }
                } else if (habit.frequency === 'weekly') {
                   const completionsThisWeek = getHabitCompletionsForWeek({...habit, log: newLog}, date);
                   const isWeekGoalMet = completionsThisWeek >= (habit.targetCompletions || 1);
                   const currentWeekKey = getHabitLogKey(habit, date); 
                   const prevWeekKey = getHabitLogKey(habit, subDays(date, 7));
                   const weeklyLogEntry = habit.log[currentWeekKey] || {date: currentWeekKey, completed: false};
                   if (isWeekGoalMet && !weeklyLogEntry.completed) {
                       if (habit.log[prevWeekKey]?.completed) currentStreak++; else currentStreak = 1;
                       if (currentStreak > longestStreak) longestStreak = currentStreak;
                       newLog[currentWeekKey] = {...weeklyLogEntry, completed: true};
                   } else if (!isWeekGoalMet && weeklyLogEntry.completed) {
                       currentStreak = 0;
                       newLog[currentWeekKey] = {...weeklyLogEntry, completed: false};
                   }
                }
                return { ...habit, log: newLog, currentStreak, longestStreak };
            }
            return habit;
        });
        if(habitCompletedForChallenge && isFeatureUnlocked('challenges')){ updateChallengeProgress('habitCompletions', 1); }
        return { ...prevProfile, notepadData: { ...(prevProfile.notepadData), habits: updatedHabits } };
    });
    toast({ title: "Habit Updated", description: "Progress logged.", icon: <CheckCircle/> });
  }, [isFeatureUnlocked, toast, updateChallengeProgress, getHabitCompletionsForWeek, getHabitLogKey]);

  const addNotepadCountdownEvent = useCallback((eventData: Omit<NotepadCountdownEvent, 'id' | 'createdAt'>) => {
    if(!isFeatureUnlocked('notepadEvents')) { toast({ title: "Feature Locked", description: "Unlock Events Countdown in the Skill Tree.", icon: <XCircle/> }); return; }
    const newEvent: NotepadCountdownEvent = { ...eventData, id: crypto.randomUUID(), createdAt: Date.now() };
    updateNotepadField('countdownEvents', [...(userProfile.notepadData.countdownEvents || []), newEvent].sort((a,b) => parseISO(a.targetDate).getTime() - parseISO(b.targetDate).getTime()));
    toast({ title: "Event Countdown Added", description: `"${newEvent.name}" tracked.`, icon: <CalendarClock/> });
  }, [isFeatureUnlocked, userProfile.notepadData.countdownEvents, updateNotepadField, toast]);

  const updateNotepadCountdownEvent = useCallback((updatedEvent: NotepadCountdownEvent) => {
    if(!isFeatureUnlocked('notepadEvents')) return;
    updateNotepadField('countdownEvents', (userProfile.notepadData.countdownEvents || []).map(event => event.id === updatedEvent.id ? updatedEvent : event).sort((a,b) => parseISO(a.targetDate).getTime() - parseISO(b.targetDate).getTime()));
    toast({ title: "Event Countdown Updated", description: `"${updatedEvent.name}" saved.`, icon: <Save/> });
  }, [isFeatureUnlocked, userProfile.notepadData.countdownEvents, updateNotepadField, toast]);

  const deleteNotepadCountdownEvent = useCallback((eventId: string) => {
    if(!isFeatureUnlocked('notepadEvents')) return;
    const eventToDelete = (userProfile.notepadData.countdownEvents || []).find(e => e.id === eventId);
    updateNotepadField('countdownEvents', (userProfile.notepadData.countdownEvents || []).filter(event => event.id !== eventId));
    if (eventToDelete) toast({ title: "Event Deleted", description: `"${eventToDelete.name}" removed.`, icon: <Trash2/> });
  }, [isFeatureUnlocked, userProfile.notepadData.countdownEvents, updateNotepadField, toast]);

  const updateNotepadEisenhowerMatrix = useCallback((matrix: UserProfile['notepadData']['eisenhowerMatrix']) => {
    if(!isFeatureUnlocked('notepadEisenhower')) { toast({ title: "Feature Locked", description: "Unlock Eisenhower Matrix in Skill Tree.", icon: <XCircle/> }); return; }
    updateNotepadData({ eisenhowerMatrix: matrix });
  }, [isFeatureUnlocked, updateNotepadData, toast]);

  const getSkinById = useCallback((id: string) => PREDEFINED_SKINS.find(skin => skin.id === id), []);
  
  const isSkinOwned = useCallback((skinId: string) => userProfile.ownedSkinIds.includes(skinId), [userProfile.ownedSkinIds]);

  const buySkin = useCallback((skinId: string) => {
    if(!isFeatureUnlocked('shop')) { toast({ title: "Shop Locked", description: "Unlock the Shop in the Skill Tree.", icon: <XCircle/> }); return false; }
    const skin = getSkinById(skinId);
    if (!skin) { toast({ title: "Error", description: "Skin not found.", variant: "destructive", icon: <XCircle/> }); return false; }
    if (isSkinOwned(skinId)) { toast({ title: "Already Owned", description: "You already own this skin." }); return false; }
    const shopDiscount = getAppliedBoost('shopDiscount');
    const effectivePrice = Math.max(0, Math.round(skin.price * (1 - shopDiscount)));
    if (userProfile.cash < effectivePrice) { toast({ title: "Not Enough Cash", description: `Need $${effectivePrice.toLocaleString()}. You have $${userProfile.cash.toLocaleString()}.`, variant: "destructive", icon: <DollarSign/> }); return false; }
    if (userProfile.level < skin.levelRequirement) { toast({ title: "Level Too Low", description: `Need Level ${skin.levelRequirement}. You are Level ${userProfile.level}.`, variant: "destructive", icon: <TrendingDown/> }); return false; }
    
    setUserProfile(prev => ({ ...prev, cash: prev.cash - effectivePrice, ownedSkinIds: [...prev.ownedSkinIds, skinId] }));
    toast({ title: "Purchase Successful!", description: `Bought ${skin.name} for $${effectivePrice.toLocaleString()}${shopDiscount > 0 ? ` (with ${(shopDiscount * 100).toFixed(0)}% discount!)` : ''}.`, icon: <ShoppingCart/> });
    addFloatingGain('cash', -effectivePrice);
    return true;
  }, [isFeatureUnlocked, userProfile.cash, userProfile.level, getSkinById, isSkinOwned, getAppliedBoost, toast, addFloatingGain]);

  const equipSkin = useCallback((skinId: string) => {
    if(!isFeatureUnlocked('shop')) { toast({ title: "Shop Locked", description: "Unlock Shop in Skill Tree.", icon: <XCircle/> }); return; }
    if (!isSkinOwned(skinId)) { toast({ title: "Error", description: "You don't own this skin.", variant: "destructive", icon: <XCircle/> }); return; }
    const skinToEquip = getSkinById(skinId);
    if (!skinToEquip) return;
    
    setUserProfile(prev => ({ ...prev, equippedSkinId: skinId }));
    toast({ title: "Skin Equipped!", description: `${skinToEquip.name} is now active.`, icon: <PaletteIcon/> });
  }, [isFeatureUnlocked, isSkinOwned, getSkinById, toast]);

  const ensureCapitalistOffers = useCallback(() => {
    if(!isFeatureUnlocked('capitalist')) return;
    const now = Date.now();
    const investmentBoostSkill = ALL_SKILLS.find(s => s.id === 'investmentInsight');
    let offerDurationMultiplier = 1; 
    
    if (!lastOfferGenerationTime || now - lastOfferGenerationTime > 24 * 60 * 60 * 1000 * offerDurationMultiplier || capitalistOffers.some(o => o.expiresAt && o.expiresAt < now)) {
      const generateOffers = (): CapitalistOffer[] => {
        const baseOffersData: Omit<CapitalistOffer, 'id' | 'expiresAt'>[] = [
            { name: "Safe Bet Startup", description: "Low risk, low reward tech investment.", minInvestmentAmount: 5000, maxInvestmentAmount: 20000, minRoiPercent: 5, maxRoiPercent: 20, volatilityFactor: 0.2, durationHours: 24, completionBonusCash: 1000 },
            { name: "Crypto Gamble", description: "High risk, high reward digital currency.", minInvestmentAmount: 10000, maxInvestmentAmount: 50000, minRoiPercent: -80, maxRoiPercent: 200, volatilityFactor: 0.8, durationHours: 24 },
            { name: "Real Estate Flip", description: "Moderate risk, steady gains.", minInvestmentAmount: 20000, maxInvestmentAmount: 100000, minRoiPercent: -10, maxRoiPercent: 50, volatilityFactor: 0.4, durationHours: 24, completionBonusCash: 5000 },
            { name: "Meme Stock Madness", description: "To the moon or bust!", minInvestmentAmount: 7500, maxInvestmentAmount: 30000,  minRoiPercent: -95, maxRoiPercent: 500, volatilityFactor: 0.95, durationHours: 24 },
            { name: "Blue Chip Bonds", description: "Slow and steady wins the race.", minInvestmentAmount: 30000,maxInvestmentAmount: 150000, minRoiPercent: 1, maxRoiPercent: 10, volatilityFactor: 0.1, durationHours: 24, completionBonusCash: 2500 },
            { name: "Emerging Market Fund", description: "Potential for growth, with some uncertainty.", minInvestmentAmount: 15000, maxInvestmentAmount: 75000,  minRoiPercent: -30, maxRoiPercent: 70, volatilityFactor: 0.6, durationHours: 24, completionBonusCash: 3000 },
        ];
        const shuffled = [...baseOffersData].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3).map(offer => ({
          ...offer,
          id: crypto.randomUUID(),
          expiresAt: Date.now() + offer.durationHours * 60 * 60 * 1000,
        }));
      };
      const newOffers = generateOffers();
      setCapitalistOffers(newOffers);
      setLastOfferGenerationTime(now);
    }
  }, [isFeatureUnlocked, lastOfferGenerationTime, capitalistOffers, isSkillUnlocked]);

  const investInOffer = useCallback(async (offerId: string, investmentAmount: number): Promise<{ success: boolean; message: string; profit?: number }> => {
    if(!isFeatureUnlocked('capitalist')) return { success: false, message: "Capitalist Corner locked."};
    const offer = capitalistOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, message: "Offer not found." };
    if (userProfile.cash < investmentAmount) return { success: false, message: "Not enough cash." };
    if (investmentAmount < offer.minInvestmentAmount) return { success: false, message: `Minimum investment is $${offer.minInvestmentAmount.toLocaleString()}.` };
    if (offer.maxInvestmentAmount && investmentAmount > offer.maxInvestmentAmount) return { success: false, message: `Maximum investment is $${offer.maxInvestmentAmount.toLocaleString()}.`};
    
    let actualMinRoi = offer.minRoiPercent;
    let bonusChanceMultiplier = 1; 
    const investmentBoostSkill = ALL_SKILLS.find(s => s.id === 'investmentInsight');
    if(investmentBoostSkill && isSkillUnlocked(investmentBoostSkill.id)) { 
        actualMinRoi = Math.min(offer.maxRoiPercent, offer.minRoiPercent + 5); 
        bonusChanceMultiplier = 1.1; 
    }

    const randomFactor = Math.random();
    
    let actualRoiPercent = actualMinRoi + (offer.maxRoiPercent - actualMinRoi) * randomFactor;
    if (Math.random() > offer.volatilityFactor * (1/bonusChanceMultiplier)) { 
      actualRoiPercent = Math.max(actualRoiPercent, (actualMinRoi + offer.maxRoiPercent) / 2 * randomFactor * bonusChanceMultiplier); 
    } else { 
      actualRoiPercent = Math.min(actualRoiPercent, actualMinRoi + ( (actualMinRoi + offer.maxRoiPercent) / 2 - actualMinRoi ) * randomFactor ); 
    }


    let profit = Math.round(investmentAmount * (actualRoiPercent / 100));
    let finalCashChange = profit;
    let message = profit >= 0 ? `Investment success! You gained $${profit.toLocaleString()}.` : `Investment risky... You lost $${Math.abs(profit).toLocaleString()}.`;
    
    if (profit >= 0 && offer.completionBonusCash && Math.random() < (0.2 * bonusChanceMultiplier) ) { 
        finalCashChange += offer.completionBonusCash; 
        message += ` Bonus: $${offer.completionBonusCash.toLocaleString()}!`; 
    }

    setUserProfile(prev => {
        const newCash = prev.cash + finalCashChange;
        addFloatingGain('cash', finalCashChange);
        setCapitalistStatsForAchievements(cs => ({ firstInvestmentMade: true, totalProfit: cs.totalProfit + (finalCashChange > 0 ? finalCashChange : 0) })); 
        return { ...prev, cash: newCash };
    });
    setCapitalistOffers(prevOffers => prevOffers.filter(o => o.id !== offerId)); 
    return { success: true, message, profit: finalCashChange };
  }, [isFeatureUnlocked, capitalistOffers, userProfile.cash, isSkillUnlocked, addFloatingGain]);

  const claimChallengeReward = useCallback((challengeId: string) => {
    if(!isFeatureUnlocked('challenges')) return;
    setDailyChallenges(prevChallenges => {
        const updatedChallenges = prevChallenges.map(challenge => {
            if (challenge.id === challengeId && challenge.isCompleted && !challenge.rewardClaimed) {
                setUserProfile(prevProfile => {
                    const newXp = prevProfile.xp + challenge.xpReward;
                    const { newLevel, newTitle, skillPointsGained } = checkForLevelUp(newXp, prevProfile.level);
                    toast({title: "Challenge Reward!", description: `+${challenge.xpReward} XP, +$${challenge.cashReward.toLocaleString()} for '${challenge.title}'`, icon: <Gift/>});
                    addFloatingGain('xp', challenge.xpReward);
                    addFloatingGain('cash', challenge.cashReward);
                    const updatedCompletedIds = [...(prevProfile.completedChallengeIds || []), challengeId];
                    return {
                        ...prevProfile, xp: newXp, cash: prevProfile.cash + challenge.cashReward,
                        level: newLevel, title: newTitle, skillPoints: (prevProfile.skillPoints || 0) + skillPointsGained,
                        completedChallengeIds: updatedCompletedIds,
                    };
                });
                return { ...challenge, rewardClaimed: true };
            }
            return challenge;
        });
        return updatedChallenges;
    });
  }, [isFeatureUnlocked, toast, checkForLevelUp, addFloatingGain]);
  
  const checkAndUnlockAchievements = useCallback(() => {
    if(!isFeatureUnlocked('achievements')) return;
    setUserProfile(prevUserProfile => {
        const currentInvestmentStats = capitalistStatsForAchievements;
        const currentSessions = sessions; 
        const currentDailyChallenges = dailyChallenges; 
        const newlyUnlocked: string[] = [];
        let totalCashRewardFromAchievements = 0;
        ALL_ACHIEVEMENTS.forEach(ach => {
          if (!(prevUserProfile.unlockedAchievementIds || []).includes(ach.id) && ach.criteria(prevUserProfile, currentSessions, currentDailyChallenges, currentInvestmentStats)) {
            newlyUnlocked.push(ach.id);
            totalCashRewardFromAchievements += ach.cashReward;
            toast({ title: "Achievement Unlocked!", description: `${ach.name} (+$${ach.cashReward.toLocaleString()})`, icon: <Trophy/> });
            addFloatingGain('cash', ach.cashReward);
          }
        });
        if (newlyUnlocked.length > 0) {
          return { ...prevUserProfile, unlockedAchievementIds: [...(prevUserProfile.unlockedAchievementIds || []), ...newlyUnlocked], cash: prevUserProfile.cash + totalCashRewardFromAchievements };
        }
        return prevUserProfile;
    });
  }, [isFeatureUnlocked, capitalistStatsForAchievements, sessions, dailyChallenges, toast, addFloatingGain]);
  
  const getUnlockedAchievements = useCallback((): Achievement[] => ALL_ACHIEVEMENTS.filter(ach => userProfile.unlockedAchievementIds?.includes(ach.id)), [userProfile.unlockedAchievementIds]);

  const getAllSkills = useCallback(() => ALL_SKILLS, []);
  
  const canUnlockSkill = useCallback((skillId: string): { can: boolean, reason?: string } => {
    if (isSkillUnlocked(skillId)) return { can: false, reason: "Already unlocked." };
    const skill = ALL_SKILLS.find(s => s.id === skillId);
    if (!skill) return { can: false, reason: "Skill not found."};
    if (userProfile.skillPoints < skill.cost) return { can: false, reason: `Not enough skill points. Needs ${skill.cost}, has ${userProfile.skillPoints}.`};
    if (skill.prerequisiteLevel && userProfile.level < skill.prerequisiteLevel) return { can: false, reason: `Requires Level ${skill.prerequisiteLevel}.`};
    if (skill.prerequisiteSkillIds) {
      for (const prereqId of skill.prerequisiteSkillIds) {
        if (!isSkillUnlocked(prereqId)) {
          const prereqSkill = ALL_SKILLS.find(s => s.id === prereqId);
          return { can: false, reason: `Requires skill: ${prereqSkill?.name || prereqId}.`};
        }
      }
    }
    return { can: true };
  }, [userProfile.skillPoints, userProfile.level, isSkillUnlocked]);

  const refundAllSkillPoints = useCallback(() => {
    const skillToRefund = ALL_SKILLS.find(s => s.id === 'skillPointRefund');
    if (!skillToRefund || !isSkillUnlocked(skillToRefund.id)) {
      toast({ title: "Respec Not Unlocked", description: "You must unlock 'Strategic Respec' first.", variant: "destructive", icon: <XCircle/> });
      return;
    }
    let pointsToRefund = 0;
    const skillsToKeep = [skillToRefund.id, 'unlockTimers', 'unlockSkillTree']; 
    userProfile.unlockedSkillIds.forEach(id => {
      if (!skillsToKeep.includes(id)) {
        const skill = ALL_SKILLS.find(s => s.id === id);
        if (skill) pointsToRefund += skill.cost;
      }
    });
    setUserProfile(prev => ({
      ...prev,
      skillPoints: prev.skillPoints + pointsToRefund,
      unlockedSkillIds: skillsToKeep,
    }));
    toast({ title: "Skill Points Refunded!", description: `All skill points (except for Respec & core skills) have been refunded. You gained ${pointsToRefund} points. Features will need to be re-unlocked.`, icon: <RepeatIcon /> });
  }, [userProfile.unlockedSkillIds, isSkillUnlocked, toast]);

  const unlockSkill = useCallback((skillId: string) => {
    const unlockCheck = canUnlockSkill(skillId);
    if (!unlockCheck.can) { toast({ title: "Cannot Unlock Skill", description: unlockCheck.reason, variant: "destructive", icon: <XCircle/> }); return false; }
    const skill = ALL_SKILLS.find(s => s.id === skillId);
    if (!skill) return false;

    if (skill.id === 'skillPointRefund') { refundAllSkillPoints(); return true; } 

    setUserProfile(prev => ({ ...prev, skillPoints: prev.skillPoints - skill.cost, unlockedSkillIds: [...prev.unlockedSkillIds, skillId] }));
    toast({ title: "Skill Unlocked!", description: `You unlocked: ${skill.name}`, icon: <CheckCircle/>});
    return true;
  }, [canUnlockSkill, toast, refundAllSkillPoints]);
  
  const updateSleepWakeTimes = useCallback((wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => {
    updateUserProfile({ wakeUpTime, sleepTime });
    toast({ title: "Preferences Updated", description: "Your wake-up and sleep times have been saved.", icon: <Settings/> });
  }, [updateUserProfile, toast]);
  
  // Timer Logic
  const getDurationForMode = useCallback((mode: PomodoroMode, settings: PomodoroSettings) => {
    switch (mode) {
      case 'work': return settings.workDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
      default: return 0;
    }
  }, []);

  const pausePomodoro = useCallback(() => {
    setPomodoroState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const switchPomodoroMode = useCallback((newMode?: PomodoroMode) => {
    pausePomodoro();
    setPomodoroState(prev => {
        let nextMode: PomodoroMode = 'work';
        let newCyclesCompleted = prev.cyclesCompleted;

        if (newMode) {
            nextMode = newMode;
            if (prev.mode === 'work' && (nextMode === 'shortBreak' || nextMode === 'longBreak')) {
                newCyclesCompleted++;
            }
        } else {
            if (prev.mode === 'work') {
                newCyclesCompleted = prev.cyclesCompleted + 1;
                nextMode = newCyclesCompleted % prev.settings.cyclesPerLongBreak === 0 ? 'longBreak' : 'shortBreak';
            } else {
                nextMode = 'work';
            }
        }
        
        return {
            ...prev,
            mode: nextMode,
            cyclesCompleted: newCyclesCompleted,
            timeLeft: getDurationForMode(nextMode, prev.settings),
        };
    });
  }, [pausePomodoro, getDurationForMode]);

  useEffect(() => {
    if (!isLoaded) return;
    const timerWorker = () => {
      // Pomodoro
      if (pomodoroState.isRunning) {
        if (pomodoroState.timeLeft <= 1) {
          const sessionType: StudySession['type'] = pomodoroState.mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break';
          const duration = getDurationForMode(pomodoroState.mode, pomodoroState.settings);
          addSession({ type: sessionType, startTime: pomodoroState.sessionStartTime, durationInSeconds: duration, isFullPomodoroCycle: pomodoroState.mode === 'work' });
          checkAndUnlockAchievements();
          toast({ title: `Time's up!`, description: `Your ${pomodoroState.mode} session has ended.` });
          switchPomodoroMode(); // This also pauses the timer
        } else {
          setPomodoroState(p => ({ ...p, timeLeft: p.timeLeft - 1 }));
        }
      }
      // Stopwatch
      if (stopwatchState.isRunning) {
        setStopwatchState(s => ({ ...s, timeElapsed: Math.floor((Date.now() - s.sessionStartTime) / 1000) }));
      }
    };
    
    const intervalId = setInterval(timerWorker, 1000);
    return () => clearInterval(intervalId);
  }, [isLoaded, pomodoroState.isRunning, pomodoroState.timeLeft, stopwatchState.isRunning, addSession, checkAndUnlockAchievements, getDurationForMode, pomodoroState.mode, pomodoroState.sessionStartTime, pomodoroState.settings, switchPomodoroMode, toast, stopwatchState.sessionStartTime]);
  
  const startPomodoro = useCallback(() => {
      setPomodoroState(prev => {
        if (prev.isRunning) return prev;
        const sessionDuration = getDurationForMode(prev.mode, prev.settings);
        const elapsedSinceStart = sessionDuration - prev.timeLeft;
        return { ...prev, isRunning: true, sessionStartTime: Date.now() - (elapsedSinceStart * 1000) };
      });
  }, [getDurationForMode]);

  const resetPomodoro = useCallback(() => {
    pausePomodoro();
    setPomodoroState(p => ({ ...p, timeLeft: getDurationForMode(p.mode, p.settings)}));
  }, [pausePomodoro, getDurationForMode]);

  const updatePomodoroSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setPomodoroState(p => {
        const updatedSettings = { ...p.settings, ...newSettings };
        return { ...p, settings: updatedSettings, timeLeft: getDurationForMode(p.mode, updatedSettings) };
    });
  }, [getDurationForMode]);
  
  const logPomodoroSession = useCallback(() => {
    const sessionDuration = getDurationForMode(pomodoroState.mode, pomodoroState.settings);
    const elapsedTime = sessionDuration - pomodoroState.timeLeft;
    if (elapsedTime > 0) {
      addSession({ type: pomodoroState.mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break', startTime: pomodoroState.sessionStartTime, durationInSeconds: elapsedTime, isFullPomodoroCycle: false });
      resetPomodoro();
      toast({ title: "Progress Logged", description: `Your current session progress has been logged.`});
    }
  }, [pomodoroState, addSession, resetPomodoro, getDurationForMode, toast]);

  const startStopwatch = useCallback(() => {
    setStopwatchState(prev => {
        if (prev.isRunning) return prev;
        return { ...prev, isRunning: true, sessionStartTime: Date.now() - (prev.timeElapsed * 1000) };
    });
  }, []);

  const pauseStopwatch = useCallback(() => {
    setStopwatchState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetStopwatch = useCallback(() => {
    setStopwatchState({ ...DEFAULT_STOPWATCH_STATE });
  }, []);

  const logStopwatchSession = useCallback(() => {
    if (stopwatchState.timeElapsed > 0) {
        addSession({ type: 'Stopwatch', startTime: stopwatchState.sessionStartTime, durationInSeconds: stopwatchState.timeElapsed });
        resetStopwatch();
        toast({ title: "Session Logged", description: "Your stopwatch session has been saved."});
    }
  }, [stopwatchState, addSession, resetStopwatch, toast]);

  const loadData = useCallback(() => {
    try {
      const storedSessions = localStorage.getItem('studySessions');
      if (storedSessions) setSessions(JSON.parse(storedSessions));

      const storedProfile = localStorage.getItem('userProfile');
      let parsedProfile = DEFAULT_USER_PROFILE;
      if (storedProfile) {
        const tempProfile = JSON.parse(storedProfile) as UserProfile;
        const ensuredNotepadData: NotepadData = {
            ...DEFAULT_NOTEPAD_DATA,
            ...(tempProfile.notepadData || {}),
            tasks: Array.isArray(tempProfile.notepadData?.tasks) ? tempProfile.notepadData.tasks : DEFAULT_NOTEPAD_DATA.tasks,
            notes: Array.isArray(tempProfile.notepadData?.notes) ? tempProfile.notepadData.notes : DEFAULT_NOTEPAD_DATA.notes,
            goals: Array.isArray(tempProfile.notepadData?.goals) ? tempProfile.notepadData.goals : DEFAULT_NOTEPAD_DATA.goals,
            links: Array.isArray(tempProfile.notepadData?.links) ? tempProfile.notepadData.links : DEFAULT_NOTEPAD_DATA.links,
            revisionConcepts: Array.isArray(tempProfile.notepadData?.revisionConcepts) ? tempProfile.notepadData.revisionConcepts : DEFAULT_NOTEPAD_DATA.revisionConcepts,
            habits: Array.isArray(tempProfile.notepadData?.habits) ? tempProfile.notepadData.habits : DEFAULT_NOTEPAD_DATA.habits,
            countdownEvents: Array.isArray(tempProfile.notepadData?.countdownEvents) ? tempProfile.notepadData.countdownEvents : DEFAULT_NOTEPAD_DATA.countdownEvents,
            eisenhowerMatrix: tempProfile.notepadData?.eisenhowerMatrix || DEFAULT_NOTEPAD_DATA.eisenhowerMatrix,
        };
        parsedProfile = {
            ...DEFAULT_USER_PROFILE,
            ...tempProfile,
            cash: tempProfile.cash === undefined || typeof tempProfile.cash !== 'number' ? DEFAULT_USER_PROFILE.cash : tempProfile.cash,
            ownedSkinIds: Array.isArray(tempProfile.ownedSkinIds) ? tempProfile.ownedSkinIds : [...DEFAULT_USER_PROFILE.ownedSkinIds],
            completedChallengeIds: Array.isArray(tempProfile.completedChallengeIds) ? tempProfile.completedChallengeIds : [],
            unlockedAchievementIds: Array.isArray(tempProfile.unlockedAchievementIds) ? tempProfile.unlockedAchievementIds : [],
            notepadData: ensuredNotepadData,
            skillPoints: typeof tempProfile.skillPoints === 'number' ? tempProfile.skillPoints : DEFAULT_USER_PROFILE.skillPoints,
            unlockedSkillIds: Array.isArray(tempProfile.unlockedSkillIds) ? tempProfile.unlockedSkillIds : DEFAULT_USER_PROFILE.unlockedSkillIds,
        };
        
        const coreSkillsToEnsure = ['unlockTimers', 'unlockSkillTree'];
        coreSkillsToEnsure.forEach(coreSkillId => {
            if (!parsedProfile.unlockedSkillIds.includes(coreSkillId)) {
                parsedProfile.unlockedSkillIds.push(coreSkillId);
            }
        });
      }
      setUserProfile(parsedProfile);
      
      const storedPomoSettings = localStorage.getItem('pomodoroSettings');
      if (storedPomoSettings) {
        const settings = JSON.parse(storedPomoSettings);
        setPomodoroState(p => ({...p, settings, timeLeft: getDurationForMode(p.mode, settings) }));
      }

      const storedOffers = localStorage.getItem('capitalistOffers');
      if (storedOffers) setCapitalistOffers(JSON.parse(storedOffers));
      const storedOfferTime = localStorage.getItem('lastOfferGenerationTime');
      if (storedOfferTime) setLastOfferGenerationTime(parseInt(storedOfferTime, 10));

      const storedChallenges = localStorage.getItem('dailyChallenges');
      const storedResetDate = localStorage.getItem('lastChallengeResetDate');
      const todayDateString = format(new Date(), 'yyyy-MM-dd');

      if (storedChallenges && storedResetDate === todayDateString) {
        setDailyChallenges(JSON.parse(storedChallenges));
        setLastChallengeResetDate(todayDateString);
      } else {
        const shuffledChallenges = [...INITIAL_DAILY_CHALLENGES_POOL].sort(() => 0.5 - Math.random());
        const freshChallenges = shuffledChallenges.slice(0, Math.min(6, shuffledChallenges.length)).map(ch => ({...ch, currentValue: 0, isCompleted: false, rewardClaimed: false}));
        setDailyChallenges(freshChallenges);
        setLastChallengeResetDate(todayDateString);
        localStorage.setItem('dailyChallenges', JSON.stringify(freshChallenges));
        localStorage.setItem('lastChallengeResetDate', todayDateString);
      }
      const storedCapitalistStats = localStorage.getItem('capitalistStatsForAchievements');
      if (storedCapitalistStats) setCapitalistStatsForAchievements(JSON.parse(storedCapitalistStats));
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setUserProfile(DEFAULT_USER_PROFILE); 
      const freshChallenges = INITIAL_DAILY_CHALLENGES_POOL.slice(0,6).map(ch => ({...ch, currentValue: 0, isCompleted: false, rewardClaimed: false}));
      setDailyChallenges(freshChallenges);
      setLastChallengeResetDate(format(new Date(), 'yyyy-MM-dd'));
    } finally {
        setIsLoaded(true);
    }
  }, [getDurationForMode]);


  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if(isLoaded && userProfile.lastLoginDate !== format(new Date(), 'yyyy-MM-dd')) {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        let currentLoginStreak = userProfile.dailyLoginStreak || 0;
        if (userProfile.lastLoginDate && isYesterday(parseISO(userProfile.lastLoginDate))) currentLoginStreak++;
        else if (userProfile.lastLoginDate && !isToday(parseISO(userProfile.lastLoginDate))) currentLoginStreak = 1;
        else if (!userProfile.lastLoginDate) currentLoginStreak = 1; 
        const streakBonus = Math.min((currentLoginStreak -1) * DAILY_LOGIN_STREAK_CASH_BONUS, DAILY_LOGIN_MAX_STREAK_BONUS_CASH);
        const loginBonusAwarded = DAILY_LOGIN_BASE_CASH + streakBonus;
        setUserProfile(prev => ({ ...prev, cash: prev.cash + loginBonusAwarded, lastLoginDate: todayStr, dailyLoginStreak: currentLoginStreak }));
        toast({ title: "Daily Login Bonus!", description: `Welcome back! +$${loginBonusAwarded.toLocaleString()}. Streak: ${currentLoginStreak} day(s).`, icon: <Gift/> });
        addFloatingGain('cash', loginBonusAwarded);
    }
  }, [isLoaded, userProfile.lastLoginDate, userProfile.dailyLoginStreak, userProfile.cash, toast, addFloatingGain]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroState.settings));
        localStorage.setItem('capitalistOffers', JSON.stringify(capitalistOffers));
        if (lastOfferGenerationTime) localStorage.setItem('lastOfferGenerationTime', lastOfferGenerationTime.toString());
        else localStorage.removeItem('lastOfferGenerationTime');
        localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
        if (lastChallengeResetDate) localStorage.setItem('lastChallengeResetDate', lastChallengeResetDate);
        localStorage.setItem('capitalistStatsForAchievements', JSON.stringify(capitalistStatsForAchievements));
      } catch (error) { console.error("Failed to save data to localStorage:", error); }
    }
  }, [sessions, userProfile, pomodoroState.settings, capitalistOffers, lastOfferGenerationTime, dailyChallenges, lastChallengeResetDate, isLoaded, capitalistStatsForAchievements]);

  useEffect(() => {
    if (isLoaded) { checkAndUnlockAchievements(); }
  }, [isLoaded, sessions.length, userProfile.level, userProfile.cash, userProfile.currentStreak, userProfile.ownedSkinIds.length, userProfile.completedChallengeIds.length, dailyChallenges.length, capitalistStatsForAchievements, userProfile.notepadData, checkAndUnlockAchievements, userProfile.unlockedSkillIds.length]);

  useEffect(() => {
    if (isLoaded) {
        const equippedSkin = getSkinById(userProfile.equippedSkinId);
        applyThemePreference(equippedSkin?.isTheme ? equippedSkin.themeClass : null);
    }
  }, [userProfile.equippedSkinId, isLoaded, applyThemePreference, getSkinById]);


  if (!isLoaded) { return null; }

  return (
    <SessionContext.Provider value={{
      sessions, addSession, deleteSession, addTestSession, clearSessions, updateSessionDescription, addManualSession,
      userProfile, updateUserProfile, updateSleepWakeTimes, updateNotepadData,
      pomodoroState, startPomodoro, pausePomodoro, resetPomodoro, switchPomodoroMode, updatePomodoroSettings, logPomodoroSession,
      stopwatchState, startStopwatch, pauseStopwatch, resetStopwatch, logStopwatchSession,
      addNotepadNote, updateNotepadNote, deleteNotepadNote,
      addRevisionConcept, markConceptRevised, deleteRevisionConcept,
      addHabit, updateHabit, deleteHabit, logHabitCompletion, getHabitCompletionForDate, getHabitCompletionsForWeek,
      addNotepadCountdownEvent, updateNotepadCountdownEvent, deleteNotepadCountdownEvent, updateNotepadEisenhowerMatrix,
      getSkinById, buySkin, equipSkin, isSkinOwned,
      capitalistOffers, ensureCapitalistOffers, investInOffer, lastOfferGenerationTime,
      dailyChallenges, claimChallengeReward, updateChallengeProgress,
      getUnlockedAchievements, checkAndUnlockAchievements,
      isLoaded,
      getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill, isFeatureUnlocked, getAppliedBoost, refundAllSkillPoints,
      floatingGains,
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
