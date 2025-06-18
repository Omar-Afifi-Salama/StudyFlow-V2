
"use client";

import type { StudySession, UserProfile, Skin, CapitalistOffer, NotepadTask, NotepadNote, NotepadGoal, NotepadLink, NotepadData, DailyChallenge, Achievement, RevisionConcept, Habit, HabitFrequency, HabitLogEntry, AchievementCriteriaInvestmentPayload, NotepadCountdownEvent } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Zap, ShoppingCart, ShieldCheck, CalendarCheck, Award, Clock, BarChart, Coffee, Timer, TrendingUp, Brain, Gift, Star, DollarSign, Activity, AlignLeft, Link2, CheckSquare, Trophy, TrendingDown, Sigma, Moon, Sun, Palette, Package, Briefcase, Target as TargetIcon, Edit, Repeat, ListChecks as HabitIcon, CalendarClock } from 'lucide-react';
import { format, addDays, differenceInDays, isYesterday, isToday, parseISO, startOfWeek, getWeek, formatISO, subDays, eachDayOfInterval, isSameDay } from 'date-fns';


export const XP_PER_MINUTE_FOCUS = 10;
export const CASH_PER_5_MINUTES_FOCUS = 100;
export const STREAK_BONUS_PER_DAY = 0.01;
export const MAX_STREAK_BONUS = 0.20;
export const DAILY_LOGIN_BASE_CASH = 200;
export const DAILY_LOGIN_STREAK_CASH_BONUS = 50;
export const DAILY_LOGIN_MAX_STREAK_BONUS_CASH = 500; // Max cash from streak portion

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300,
  19200, 21200, 23300, 25500, 27800, 30200, 32700, 35300, 38000, 40800, // Levels 20-30
  43900, 47100, 50400, 53800, 57300, 60900, 64600, 68400, 72300, 76300, // Levels 31-40
  80400, 84600, 88900, 93300, 97800, 102400, 107100, 111900, 116800, 121800, // Levels 41-50
];

export const TITLES = [
  "Newbie", "Learner", "Student", "Scholar", "Adept", "Prodigy", "Savant", "Sage", "Guru", "Master", // 1-10
  "Grandmaster Learner", "Erudite Student", "Luminous Scholar", "Distinguished Adept", "Virtuoso Prodigy", // 11-15
  "Enlightened Savant", "Venerable Sage", "Zenith Guru", "Ascendant Master", "Study God", // 16-20
  "Celestial Thinker", "Cosmic Intellect", "Dimensional Analyst", "Ethereal Mind", "Transcendent Scholar", // 21-25
  "Nova Learner", "Pulsar Student", "Quasar Scholar", "Nebula Adept", "Galactic Prodigy", // 26-30
  "Universe Wanderer", "Star Forger", "Knowledge Weaver", "Time Bender", "Reality Shaper", // 31-35
  "Thought Emperor", "Mind Overlord", "Wisdom Incarnate", "Eternal Savant", "The Oracle", // 36-40
  "Architect of Knowledge", "Sage of Ages", "Keeper of Lore", "Master of Disciplines", "The Illuminated", // 41-45
  "Quantum Thinker", "Philosopher King/Queen", "Cosmic Voyager", "Nexus of Intellect", "Apex Scholar" // 46-50
];


export const PREDEFINED_SKINS: Skin[] = [
  { id: 'classic', name: 'Classic Blue', description: 'The default, calming blue theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/300x200/6FB5F0/FFFFFF.png', dataAiHint: 'blue gradient' },
  { id: 'dark_mode', name: 'Dark Mode', description: 'Embrace the darkness. A sleek dark theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/300x200/1A202C/A0AEC0.png', dataAiHint: 'dark theme', isTheme: true, themeClass: 'dark' },
  { id: 'sepia_tone', name: 'Sepia Tone', description: 'A warm, vintage sepia theme for focused nostalgia.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/300x200/D2B48C/4A3B31.png', dataAiHint: 'sepia vintage', isTheme: true, themeClass: 'sepia' },
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

export const DEFAULT_NOTEPAD_DATA: NotepadData = {
  tasks: [],
  notes: [],
  goals: [],
  links: [],
  revisionConcepts: [],
  habits: [],
  countdownEvents: [],
};

const DEFAULT_USER_PROFILE: UserProfile = {
  xp: 0,
  cash: 1000,
  level: 1,
  title: TITLES[0],
  ownedSkinIds: ['classic', 'dark_mode', 'sepia_tone'],
  equippedSkinId: 'classic',
  completedChallengeIds: [],
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  wakeUpTime: { hour: 8, period: 'AM' },
  sleepTime: { hour: 10, period: 'PM' },
  unlockedAchievementIds: [],
  lastLoginDate: null,
  dailyLoginStreak: 0,
  notepadData: DEFAULT_NOTEPAD_DATA,
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
  // Study Time
  { id: 'firstSteps', name: 'First Steps', description: 'Log your first study session.', iconName: 'BookOpen', cashReward: 250, criteria: (p, s) => s.length >= 1, category: 'Study Time' },
  { id: 'hourOfPower', name: 'Hour of Power', description: 'Study for a total of 1 hour.', iconName: 'Clock', cashReward: 500, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 3600, category: 'Study Time' },
  { id: 'fiveHourFocus', name: 'Five Hour Focus', description: 'Study for a total of 5 hours.', iconName: 'Clock', cashReward: 1000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 18000, category: 'Study Time' },
  { id: 'dedicatedLearner', name: 'Dedicated Learner', description: 'Study for a total of 10 hours.', iconName: 'BarChart', cashReward: 2500, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 36000, category: 'Study Time' },
  { id: 'twentyFiveHourTriumph', name: '25 Hour Triumph', description: 'Study for a total of 25 hours.', iconName: 'BarChart', cashReward: 5000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 90000, category: 'Study Time' },
  { id: 'studyVeteran', name: 'Study Veteran', description: 'Study for a total of 50 hours.', iconName: 'Sigma', cashReward: 10000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 180000, category: 'Study Time' },
  { id: 'hundredHourHero', name: 'Hundred Hour Hero', description: 'Study for a total of 100 hours.', iconName: 'Trophy', cashReward: 25000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 360000, category: 'Study Time' },
  { id: 'twoFiftyHourForce', name: '250 Hour Force', description: 'Study for a total of 250 hours.', iconName: 'Trophy', cashReward: 50000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 900000, category: 'Study Time' },
  { id: 'timeLord', name: 'Time Lord', description: 'Study for a total of 500 hours.', iconName: 'Sun', cashReward: 100000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 1800000, category: 'Study Time' },

  // Pomodoro
  { id: 'pomodoroInitiate', name: 'Pomodoro Initiate', description: 'Complete 1 full Pomodoro focus cycle.', iconName: 'Timer', cashReward: 100, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 1, category: 'Pomodoro' },
  { id: 'pomodoroStarter', name: 'Pomodoro Starter', description: 'Complete 5 full Pomodoro focus cycles.', iconName: 'Timer', cashReward: 750, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 5, category: 'Pomodoro' },
  { id: 'pomodoroAdept', name: 'Pomodoro Adept', description: 'Complete 10 full Pomodoro focus cycles.', iconName: 'Timer', cashReward: 1500, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 10, category: 'Pomodoro' },
  { id: 'pomodoroPro', name: 'Pomodoro Pro', description: 'Complete 25 full Pomodoro focus cycles.', iconName: 'Coffee', cashReward: 3000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 25, category: 'Pomodoro' },
  { id: 'pomodoroExpert', name: 'Pomodoro Expert', description: 'Complete 50 full Pomodoro focus cycles.', iconName: 'Coffee', cashReward: 5000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 50, category: 'Pomodoro' },
  { id: 'pomodoroSensei', name: 'Pomodoro Sensei', description: 'Complete 100 full Pomodoro focus cycles.', iconName: 'Activity', cashReward: 7500, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 100, category: 'Pomodoro' },
  { id: 'pomodoroGrandmaster', name: 'Pomodoro Grandmaster', description: 'Complete 250 full Pomodoro focus cycles.', iconName: 'Zap', cashReward: 15000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 250, category: 'Pomodoro' },
  { id: 'pomodoroZenith', name: 'Pomodoro Zenith', description: 'Complete 500 full Pomodoro focus cycles.', iconName: 'Moon', cashReward: 30000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 500, category: 'Pomodoro' },

  // Progression
  { id: 'levelUpNovice', name: 'Adept Learner', description: 'Reach Level 5: Adept.', iconName: 'Award', cashReward: 1000, criteria: (p) => p.level >= 5, category: 'Progression' },
  { id: 'masterOfTheMind', name: 'Master of the Mind', description: 'Reach Level 10: Master.', iconName: 'ShieldCheck', cashReward: 5000, criteria: (p) => p.level >= 10, category: 'Progression' },
  { id: 'virtuosoLearner', name: 'Virtuoso Learner', description: 'Reach Level 15: Virtuoso Prodigy.', iconName: 'ShieldCheck', cashReward: 10000, criteria: (p) => p.level >= 15, category: 'Progression' },
  { id: 'levelTwentyTitan', name: 'Study God', description: 'Reach Level 20: Study God.', iconName: 'Star', cashReward: 15000, criteria: (p) => p.level >= 20, category: 'Progression' },
  { id: 'transcendentScholar', name: 'Transcendent Scholar', description: 'Reach Level 25: Transcendent Scholar.', iconName: 'Star', cashReward: 20000, criteria: (p) => p.level >= 25, category: 'Progression' },
  { id: 'levelThirtyLegend', name: 'Galactic Prodigy', description: 'Reach Level 30: Galactic Prodigy.', iconName: 'Package', cashReward: 30000, criteria: (p) => p.level >= 30, category: 'Progression' },
  { id: 'thoughtEmperor', name: 'Thought Emperor', description: 'Reach Level 35: Thought Emperor.', iconName: 'Package', cashReward: 40000, criteria: (p) => p.level >= 35, category: 'Progression' },
  { id: 'levelFiftyOracle', name: 'The Oracle', description: 'Reach Level 40: The Oracle.', iconName: 'Gem', cashReward: 75000, criteria: (p) => p.level >= 40, category: 'Progression' },

  // Collection
  { id: 'shopSpree', name: 'Shop Spree', description: 'Buy your first (non-free) skin.', iconName: 'ShoppingCart', cashReward: 500, criteria: (p) => p.ownedSkinIds.filter(id => !['classic', 'dark_mode', 'sepia_tone'].includes(id)).length >= 1, category: 'Collection' },
  { id: 'wardrobeBeginner', name: 'Wardrobe Beginner', description: 'Own 3 different paid skins.', iconName: 'Palette', cashReward: 1500, criteria: (p) => p.ownedSkinIds.filter(id => !['classic', 'dark_mode', 'sepia_tone'].includes(id)).length >= 3, category: 'Collection' },
  { id: 'fashionista', name: 'Fashionista', description: 'Own 5 different paid skins.', iconName: 'Sparkles', cashReward: 4000, criteria: (p) => p.ownedSkinIds.filter(id => !['classic', 'dark_mode', 'sepia_tone'].includes(id)).length >= 5, category: 'Collection' },
  { id: 'skinCollector', name: 'Ultimate Skin Collector', description: 'Own all available skins.', iconName: 'Briefcase', cashReward: 25000, criteria: (p) => p.ownedSkinIds.length === PREDEFINED_SKINS.length, category: 'Collection' },

  // Streaks & Challenges
  { id: 'streakStarter', name: 'Streak Starter', description: 'Achieve a 3-day study streak.', iconName: 'Zap', cashReward: 1000, criteria: (p) => p.longestStreak >= 3, category: 'Streaks & Challenges' },
  { id: 'weekLongWarrior', name: 'Week-Long Warrior', description: 'Achieve a 7-day study streak.', iconName: 'CalendarCheck', cashReward: 2500, criteria: (p) => p.longestStreak >= 7, category: 'Streaks & Challenges' },
  { id: 'fortnightFocus', name: 'Fortnight Focus', description: 'Achieve a 14-day study streak.', iconName: 'CalendarCheck', cashReward: 5000, criteria: (p) => p.longestStreak >= 14, category: 'Streaks & Challenges' },
  { id: 'unstoppableStreaker', name: 'Unstoppable Streaker', description: 'Achieve a 30-day study streak.', iconName: 'Flame', cashReward: 20000, criteria: (p) => p.longestStreak >= 30, category: 'Streaks & Challenges' },
  { id: 'challengeNewbie', name: 'Challenge Newbie', description: 'Complete 1 daily challenge.', iconName: 'TargetIcon', cashReward: 300, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 1, category: 'Streaks & Challenges' },
  { id: 'challengeChampion', name: 'Challenge Champion', description: 'Complete 10 daily challenges in total.', iconName: 'Gift', cashReward: 2000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 10, category: 'Streaks & Challenges' },
  { id: 'challengeConqueror', name: 'Challenge Conqueror', description: 'Complete 25 daily challenges in total.', iconName: 'Edit', cashReward: 5000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 25, category: 'Streaks & Challenges' },
  { id: 'challengeLegend', name: 'Challenge Legend', description: 'Complete 50 daily challenges in total.', iconName: 'Edit', cashReward: 10000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 50, category: 'Streaks & Challenges' },

  // Capitalist
  { id: 'capitalistInitiate', name: 'Capitalist Initiate', description: 'Make your first investment.', iconName: 'TrendingUp', cashReward: 1000, criteria: (p,s,c,inv) => inv.firstInvestmentMade, category: 'Capitalist' },
  { id: 'profitPioneer', name: 'Profit Pioneer', description: 'Earn a total of $10,000 profit from Capitalist Corner.', iconName: 'DollarSign', cashReward: 1500, criteria: (p,s,c,inv) => inv.totalProfit >= 10000, category: 'Capitalist' },
  { id: 'investmentGuru', name: 'Investment Guru', description: 'Earn a total of $50,000 profit from Capitalist Corner.', iconName: 'DollarSign', cashReward: 7000, criteria: (p,s,c,inv) => inv.totalProfit >= 50000, category: 'Capitalist' },
  { id: 'marketMagnate', name: 'Market Magnate', description: 'Earn a total of $250,000 profit from Capitalist Corner.', iconName: 'DollarSign', cashReward: 20000, criteria: (p,s,c,inv) => inv.totalProfit >= 250000, category: 'Capitalist' },
  { id: 'cashCollector', name: 'Cash Collector', description: 'Accumulate $50,000 cash in total.', iconName: 'TrendingDown', cashReward: 2500, criteria: (p) => p.cash >= 50000, category: 'Capitalist' },
  { id: 'wealthyScholar', name: 'Wealthy Scholar', description: 'Accumulate $250,000 cash in total.', iconName: 'TrendingDown', cashReward: 10000, criteria: (p) => p.cash >= 250000, category: 'Capitalist' },
  { id: 'studyTycoon', name: 'Study Tycoon', description: 'Accumulate $1,000,000 cash in total.', iconName: 'TrendingDown', cashReward: 50000, criteria: (p) => p.cash >= 1000000, category: 'Capitalist' },

  // Notepad & Revision
  { id: 'diligentRevisionist', name: 'Diligent Revisionist', description: 'Add 5 concepts to the Revision Hub.', iconName: 'Brain', cashReward: 1000, criteria: (p) => (p.notepadData.revisionConcepts?.length || 0) >= 5, category: 'Notepad & Revision' },
  { id: 'revisionRegular', name: 'Revision Regular', description: 'Add 15 concepts to the Revision Hub.', iconName: 'Brain', cashReward: 2500, criteria: (p) => (p.notepadData.revisionConcepts?.length || 0) >= 15, category: 'Notepad & Revision' },
  { id: 'memoryMaster', name: 'Memory Master', description: 'Successfully revise 10 concepts through their cycle (stage 3+).', iconName: 'AlignLeft', cashReward: 3000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 3).length || 0) >= 10, category: 'Notepad & Revision' },
  { id: 'recallChampion', name: 'Recall Champion', description: 'Successfully revise 25 concepts (stage 3+).', iconName: 'AlignLeft', cashReward: 6000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 3).length || 0) >= 25, category: 'Notepad & Revision' },
  { id: 'perfectRecall', name: 'Perfect Recall', description: 'Master 20 concepts in Revision Hub (stage 5+).', iconName: 'Link2', cashReward: 10000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 5).length || 0) >= 20, category: 'Notepad & Revision' },
  { id: 'taskScheduler', name: 'Task Scheduler', description: 'Complete 20 tasks from your checklist.', iconName: 'CheckSquare', cashReward: 1500, criteria: (p) => (p.notepadData.tasks.filter(t => t.completed).length || 0) >= 20, category: 'Notepad & Revision' },
  { id: 'goalGetter', name: 'Goal Getter', description: 'Complete 10 goals from your goals list.', iconName: 'TargetIcon', cashReward: 2000, criteria: (p) => (p.notepadData.goals.filter(g => g.completed).length || 0) >= 10, category: 'Notepad & Revision' },

  // Habits
  { id: 'habitFormer', name: 'Habit Former', description: 'Create your first habit.', iconName: 'HabitIcon', cashReward: 500, criteria: (p) => (p.notepadData.habits?.length || 0) >= 1, category: 'Habits' },
  { id: 'dailyDiscipliner', name: 'Daily Discipliner', description: 'Maintain a 7-day streak on any daily habit.', iconName: 'Repeat', cashReward: 1500, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'daily' && h.currentStreak >= 7), category: 'Habits' },
  { id: 'weeklyWarrior', name: 'Weekly Warrior', description: 'Maintain a 4-week streak on any weekly habit.', iconName: 'Repeat', cashReward: 2000, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'weekly' && h.currentStreak >= 4), category: 'Habits' },
  { id: 'habitualAchiever', name: 'Habitual Achiever', description: 'Complete 50 habit instances in total.', iconName: 'ListChecks', cashReward: 3000, criteria: (p) => (p.notepadData.habits?.reduce((sum, hab) => sum + Object.values(hab.log).filter(l => l.completed).length, 0) || 0) >= 50, category: 'Habits'},


  // General (Meta)
  { id: 'completionist', name: 'Completionist', description: 'Unlock all other achievements.', iconName: 'Award', cashReward: 100000, criteria: (p,s,c,inv) => (p.unlockedAchievementIds?.length || 0) >= ALL_ACHIEVEMENTS.length -1, category: 'General' },
];


const REVISION_INTERVALS = [1, 3, 7, 14, 30, 60, 90]; // Days after last revision

const defaultAchievementPayload: AchievementCriteriaInvestmentPayload = { firstInvestmentMade: false, totalProfit: 0};


interface SessionContextType {
  sessions: StudySession[];
  addSession: (sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number; tags?: string[], isFullPomodoroCycle?: boolean }) => void;
  clearSessions: () => void;
  updateSessionDescription: (sessionId: string, description: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  updateSleepWakeTimes: (wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => void;

  addNotepadNote: (note: Omit<NotepadNote, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateNotepadNote: (note: NotepadNote) => void;
  deleteNotepadNote: (noteId: string) => void;
  addRevisionConcept: (name: string, learnedDate: Date) => void;
  markConceptRevised: (conceptId: string) => void;
  deleteRevisionConcept: (conceptId: string) => void;

  // Habit functions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'log' | 'currentStreak' | 'longestStreak'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  logHabitCompletion: (habitId: string, date: Date, completed?: boolean, countIncrement?: number) => void;
  getHabitCompletionForDate: (habit: Habit, date: Date) => HabitLogEntry | undefined;
  getHabitCompletionsForWeek: (habit: Habit, date: Date) => number;

  // Notepad Countdown Event functions
  addNotepadCountdownEvent: (event: Omit<NotepadCountdownEvent, 'id' | 'createdAt'>) => void;
  updateNotepadCountdownEvent: (event: NotepadCountdownEvent) => void;
  deleteNotepadCountdownEvent: (eventId: string) => void;


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
  updateTaskChallengeProgress: (completedTasksCount: number) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [capitalistOffers, setCapitalistOffers] = useState<CapitalistOffer[]>([]);
  const [lastOfferGenerationTime, setLastOfferGenerationTime] = useState<number | null>(null);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [lastChallengeResetDate, setLastChallengeResetDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const [capitalistStatsForAchievements, setCapitalistStatsForAchievements] = useState<AchievementCriteriaInvestmentPayload>(defaultAchievementPayload);


  const applyThemePreference = useCallback((themeClass?: 'dark' | 'sepia' | null) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('dark', 'sepia');
    if (themeClass) {
      root.classList.add(themeClass);
    }
  }, []);

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
        };

        parsedProfile = {
            ...DEFAULT_USER_PROFILE,
            ...tempProfile,
            cash: tempProfile.cash === undefined || typeof tempProfile.cash !== 'number' ? DEFAULT_USER_PROFILE.cash : tempProfile.cash,
            ownedSkinIds: Array.isArray(tempProfile.ownedSkinIds) ? tempProfile.ownedSkinIds : [...DEFAULT_USER_PROFILE.ownedSkinIds],
            completedChallengeIds: Array.isArray(tempProfile.completedChallengeIds) ? tempProfile.completedChallengeIds : [],
            unlockedAchievementIds: Array.isArray(tempProfile.unlockedAchievementIds) ? tempProfile.unlockedAchievementIds : [],
            notepadData: ensuredNotepadData,
        };
      }
      setUserProfile(parsedProfile);

      const storedOffers = localStorage.getItem('capitalistOffers');
      if (storedOffers) setCapitalistOffers(JSON.parse(storedOffers));

      const storedOfferTime = localStorage.getItem('lastOfferGenerationTime');
      if (storedOfferTime) setLastOfferGenerationTime(parseInt(storedOfferTime, 10));

      const equippedSkinFromProfile = PREDEFINED_SKINS.find(s => s.id === parsedProfile.equippedSkinId);
      if (equippedSkinFromProfile?.isTheme && equippedSkinFromProfile.themeClass) {
        applyThemePreference(equippedSkinFromProfile.themeClass);
        localStorage.setItem('themePreference', equippedSkinFromProfile.themeClass);
      } else {
         applyThemePreference(null);
         localStorage.setItem('themePreference', 'classic');
      }

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
      applyThemePreference(null);
      const freshChallenges = INITIAL_DAILY_CHALLENGES_POOL.slice(0,6).map(ch => ({...ch, currentValue: 0, isCompleted: false, rewardClaimed: false}));
      setDailyChallenges(freshChallenges);
      setLastChallengeResetDate(format(new Date(), 'yyyy-MM-dd'));
      localStorage.setItem('dailyChallenges', JSON.stringify(freshChallenges));
      localStorage.setItem('lastChallengeResetDate', format(new Date(), 'yyyy-MM-dd'));
    } finally {
        setIsLoaded(true);
    }
  }, [applyThemePreference]);



  useEffect(() => {
    if(isLoaded && userProfile.lastLoginDate !== format(new Date(), 'yyyy-MM-dd')) {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        let currentLoginStreak = userProfile.dailyLoginStreak || 0;
        let newCash = userProfile.cash;
        let loginBonusAwarded = 0;

        if (userProfile.lastLoginDate && isYesterday(parseISO(userProfile.lastLoginDate))) {
            currentLoginStreak++;
        } else if (userProfile.lastLoginDate && !isToday(parseISO(userProfile.lastLoginDate))) {
            currentLoginStreak = 1;
        } else if (!userProfile.lastLoginDate) {
            currentLoginStreak = 1;
        }

        const streakBonus = Math.min( (currentLoginStreak -1) * DAILY_LOGIN_STREAK_CASH_BONUS, DAILY_LOGIN_MAX_STREAK_BONUS_CASH);
        loginBonusAwarded = DAILY_LOGIN_BASE_CASH + streakBonus;
        newCash += loginBonusAwarded;

        setUserProfile(prev => ({
            ...prev,
            cash: newCash,
            lastLoginDate: todayStr,
            dailyLoginStreak: currentLoginStreak
        }));

        toast({
            title: "Daily Login Bonus!",
            description: `Welcome back! You received $${loginBonusAwarded.toLocaleString()}. Login Streak: ${currentLoginStreak} day(s).`
        });
    }
  }, [isLoaded, userProfile.lastLoginDate, userProfile.dailyLoginStreak, userProfile.cash, toast]);


  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('capitalistOffers', JSON.stringify(capitalistOffers));
        if (lastOfferGenerationTime) {
          localStorage.setItem('lastOfferGenerationTime', lastOfferGenerationTime.toString());
        } else {
          localStorage.removeItem('lastOfferGenerationTime');
        }
        const equippedSkin = PREDEFINED_SKINS.find(s => s.id === userProfile.equippedSkinId);
        if (equippedSkin?.isTheme && equippedSkin.themeClass) {
            localStorage.setItem('themePreference', equippedSkin.themeClass);
        } else {
            localStorage.setItem('themePreference', 'classic');
        }
        localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
        if (lastChallengeResetDate) {
            localStorage.setItem('lastChallengeResetDate', lastChallengeResetDate);
        }
        localStorage.setItem('capitalistStatsForAchievements', JSON.stringify(capitalistStatsForAchievements));
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [sessions, userProfile, capitalistOffers, lastOfferGenerationTime, dailyChallenges, lastChallengeResetDate, isLoaded, capitalistStatsForAchievements]);

  const updateUserProfile = useCallback((updatedProfileData: Partial<UserProfile>) => {
    setUserProfile(prev => ({...prev, ...updatedProfileData}));
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

  const updateSleepWakeTimes = useCallback((wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => {
    setUserProfile(prev => ({...prev, wakeUpTime, sleepTime }));
    toast({ title: "Preferences Updated", description: "Your wake-up and sleep times have been saved." });
  }, [toast]);

  const checkAndUnlockAchievements = useCallback(() => {
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
            toast({
            title: "Achievement Unlocked!",
            description: `${ach.name} - ${ach.description} (+$${ach.cashReward.toLocaleString()})`,
            });
        }
        });

        if (newlyUnlocked.length > 0) {
        return {
            ...prevUserProfile,
            unlockedAchievementIds: [...(prevUserProfile.unlockedAchievementIds || []), ...newlyUnlocked],
            cash: prevUserProfile.cash + totalCashRewardFromAchievements,
        };
        }
        return prevUserProfile;
    });
  }, [toast, capitalistStatsForAchievements, sessions, dailyChallenges]);


  useEffect(() => {
    if (isLoaded) {
        checkAndUnlockAchievements();
    }
  }, [isLoaded, sessions.length, userProfile.level, userProfile.cash, userProfile.currentStreak, userProfile.ownedSkinIds.length, userProfile.completedChallengeIds.length, dailyChallenges.length, capitalistStatsForAchievements, userProfile.notepadData, checkAndUnlockAchievements]);


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

    const streakBonusMultiplier = Math.min(currentStudyStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);

    return { streakBonusMultiplier, updatedCurrentStreak: currentStudyStreak, updatedLongestStreak: longestStudyStreak, updatedLastStudyDate: newLastStudyDate };
  }, []);

  // Moved updateChallengeProgress earlier
  const updateChallengeProgress = useCallback((type: DailyChallenge['type'], value: number, absoluteValue: boolean = false) => {
    setDailyChallenges(prevChallenges =>
        prevChallenges.map(challenge => {
            if (challenge.type === type && !challenge.isCompleted && !challenge.rewardClaimed) {
                const newCurrentValue = absoluteValue ? value : Math.min((challenge.currentValue || 0) + value, challenge.targetValue);
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
    updateChallengeProgress('tasksCompleted', completedTasksCount, true);
  }, [updateChallengeProgress]);


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

    setUserProfile(prevProfile => {
        const { streakBonusMultiplier, updatedCurrentStreak, updatedLongestStreak, updatedLastStudyDate } = updateStreakAndGetBonus(prevProfile);

        let awardedXp = 0;
        let awardedCash = 0;
        const minutesStudied = sessionDetails.durationInSeconds / 60;

        if (sessionDetails.type === 'Pomodoro Focus' || sessionDetails.type === 'Stopwatch') {
        awardedXp = Math.floor(minutesStudied * XP_PER_MINUTE_FOCUS * (1 + streakBonusMultiplier));
        awardedCash = Math.floor((minutesStudied / 5) * CASH_PER_5_MINUTES_FOCUS * (1 + streakBonusMultiplier));
        updateChallengeProgress('studyDurationMinutes', Math.floor(minutesStudied));
        }
        if (sessionDetails.type === 'Pomodoro Focus' && sessionDetails.isFullPomodoroCycle) {
            updateChallengeProgress('pomodoroCycles', 1);
        }

        if (prevProfile.lastStudyDate !== updatedLastStudyDate) {
            updateChallengeProgress('studyStreak', 1);
        }

        const newXp = prevProfile.xp + awardedXp;
        const { newLevel, newTitle } = checkForLevelUp(newXp, prevProfile.level);

        let rewardMessages = [];
        if (awardedXp > 0) rewardMessages.push(`${awardedXp} XP`);
        if (awardedCash > 0) rewardMessages.push(`$${awardedCash.toLocaleString()}`);
        if (streakBonusMultiplier > 0 && (awardedCash > 0 || awardedXp > 0)) rewardMessages.push(`(${(streakBonusMultiplier * 100).toFixed(0)}% streak bonus!)`);

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
  }, [checkForLevelUp, toast, updateChallengeProgress, updateStreakAndGetBonus]);

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
    return true;
  }, [userProfile, getSkinById, isSkinOwned, toast]);

  const equipSkin = useCallback((skinId: string) => {
    if (!isSkinOwned(skinId)) {
      toast({ title: "Error", description: "You don't own this skin.", variant: "destructive" });
      return;
    }
    const skinToEquip = getSkinById(skinId);
    if (!skinToEquip) return;

    setUserProfile(prev => ({ ...prev, equippedSkinId: skinId }));

    if (skinToEquip.isTheme && skinToEquip.themeClass) {
      applyThemePreference(skinToEquip.themeClass);
      localStorage.setItem('themePreference', skinToEquip.themeClass);
    } else {
      applyThemePreference(null);
      localStorage.setItem('themePreference', 'classic');
    }

    toast({ title: "Skin Equipped!", description: `${skinToEquip.name} is now active.` });
  }, [isSkinOwned, getSkinById, toast, applyThemePreference]);


  const updateNotepadField = useCallback(<K extends keyof NotepadData>(field: K, data: NotepadData[K]) => {
      setUserProfile(prev => ({
          ...prev,
          notepadData: {
              ...(prev.notepadData || DEFAULT_NOTEPAD_DATA),
              [field]: data,
          }
      }));
  }, []);

  const addNotepadNote = useCallback((note: Omit<NotepadNote, 'id' | 'createdAt' | 'lastModified'>) => {
    const newNote: NotepadNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    const currentNotes = userProfile.notepadData.notes || [];
    updateNotepadField('notes', [newNote, ...currentNotes]);
    updateChallengeProgress('notepadEntry', 1);
    toast({ title: "Note Added", description: `"${note.title}" has been saved.` });
  }, [toast, updateChallengeProgress, userProfile.notepadData.notes, updateNotepadField]);

  const updateNotepadNote = useCallback((updatedNote: NotepadNote) => {
    const currentNotes = userProfile.notepadData.notes || [];
    const newNotes = currentNotes.map(note =>
        note.id === updatedNote.id ? { ...updatedNote, lastModified: Date.now() } : note
      );
    updateNotepadField('notes', newNotes);
    toast({ title: "Note Updated", description: `"${updatedNote.title}" has been saved.` });
  }, [toast, userProfile.notepadData.notes, updateNotepadField]);

  const deleteNotepadNote = useCallback((noteId: string) => {
    const currentNotes = userProfile.notepadData.notes || [];
    const noteToDelete = currentNotes.find(n => n.id === noteId);
    const newNotes = currentNotes.filter(note => note.id !== noteId);
    updateNotepadField('notes', newNotes);
    if (noteToDelete) {
        toast({ title: "Note Deleted", description: `"${noteToDelete.title}" has been removed.` });
    }
  }, [toast, userProfile.notepadData.notes, updateNotepadField]);

  const calculateNextRevisionDate = (learnedDateStr: string, stage: number): string => {
    const interval = REVISION_INTERVALS[stage] || REVISION_INTERVALS[REVISION_INTERVALS.length - 1];
    return format(addDays(parseISO(learnedDateStr), interval), 'yyyy-MM-dd');
  };

  const addRevisionConcept = useCallback((name: string, learnedDate: Date) => {
    const learnedDateStr = format(learnedDate, 'yyyy-MM-dd');
    const newConcept: RevisionConcept = {
      id: crypto.randomUUID(),
      name,
      learnedDate: learnedDateStr,
      lastRevisedDate: learnedDateStr,
      nextRevisionDate: calculateNextRevisionDate(learnedDateStr, 0),
      revisionStage: 0,
    };
    const currentRevisionConcepts = userProfile.notepadData.revisionConcepts || [];
    updateNotepadField('revisionConcepts', [...currentRevisionConcepts, newConcept]);
    updateChallengeProgress('notepadEntry', 1);
    toast({ title: "Concept Added", description: `"${name}" added for revision.`});
  }, [toast, userProfile.notepadData.revisionConcepts, updateNotepadField, updateChallengeProgress]);

  const markConceptRevised = useCallback((conceptId: string) => {
    const currentRevisionConcepts = userProfile.notepadData.revisionConcepts || [];
    const concepts = currentRevisionConcepts.map(c => {
        if (c.id === conceptId) {
          const todayStr = format(new Date(), 'yyyy-MM-dd');
          const newStage = c.revisionStage + 1;
          return {
            ...c,
            lastRevisedDate: todayStr,
            nextRevisionDate: calculateNextRevisionDate(todayStr, newStage),
            revisionStage: newStage,
          };
        }
        return c;
      });
    updateNotepadField('revisionConcepts', concepts);
    toast({ title: "Concept Revised!", description: "Revision schedule updated."});
  }, [toast, userProfile.notepadData.revisionConcepts, updateNotepadField]);

  const deleteRevisionConcept = useCallback((conceptId: string) => {
    const currentRevisionConcepts = userProfile.notepadData.revisionConcepts || [];
    const conceptToDelete = currentRevisionConcepts.find(c => c.id === conceptId);
    const newConcepts = currentRevisionConcepts.filter(c => c.id !== conceptId);
    updateNotepadField('revisionConcepts', newConcepts);
    if (conceptToDelete) {
        toast({ title: "Concept Removed", description: `"${conceptToDelete.name}" removed from revision.` });
    }
  }, [toast, userProfile.notepadData.revisionConcepts, updateNotepadField]);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'log' | 'currentStreak' | 'longestStreak'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      log: {},
      currentStreak: 0,
      longestStreak: 0,
    };
    const currentHabits = userProfile.notepadData.habits || [];
    updateNotepadField('habits', [...currentHabits, newHabit]);
    toast({ title: "Habit Added", description: `"${newHabit.name}" has been created.` });
  }, [toast, userProfile.notepadData.habits, updateNotepadField]);

  const updateHabit = useCallback((updatedHabit: Habit) => {
    const currentHabits = userProfile.notepadData.habits || [];
    const newHabits = currentHabits.map(h => h.id === updatedHabit.id ? updatedHabit : h);
    updateNotepadField('habits', newHabits);
    toast({ title: "Habit Updated", description: `"${updatedHabit.name}" has been saved.`});
  }, [toast, userProfile.notepadData.habits, updateNotepadField]);

  const deleteHabit = useCallback((habitId: string) => {
    const currentHabits = userProfile.notepadData.habits || [];
    const habitToDelete = currentHabits.find(h => h.id === habitId);
    const newHabits = currentHabits.filter(h => h.id !== habitId);
    updateNotepadField('habits', newHabits);
    if (habitToDelete) {
        toast({ title: "Habit Deleted", description: `"${habitToDelete.name}" has been removed.`});
    }
  }, [toast, userProfile.notepadData.habits, updateNotepadField]);

 const getHabitLogKey = (habit: Habit, date: Date): string => {
    return habit.frequency === 'daily' ? format(date, 'yyyy-MM-dd') : `${format(date, 'yyyy')}-W${String(getWeek(date, { weekStartsOn: 1 })).padStart(2, '0')}`;
 };

  const getHabitCompletionForDate = useCallback((habit: Habit, date: Date): HabitLogEntry | undefined => {
    const key = getHabitLogKey(habit, date);
    return habit.log[key];
  }, []);

  const getHabitCompletionsForWeek = useCallback((habit: Habit, date: Date): number => {
    if (habit.frequency !== 'weekly' || !habit.targetCompletions) return 0;

    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    let completions = 0;
    for (let i = 0; i < 7; i++) {
      const dayInWeek = addDays(weekStart, i);
      const dayKey = format(dayInWeek, 'yyyy-MM-dd');
      const logEntry = habit.log[dayKey];
      if (logEntry && logEntry.completed) {
        completions += (logEntry.count || 1);
      }
    }
    return completions;
  }, []);


  const logHabitCompletion = useCallback((habitId: string, date: Date, completed: boolean = true, countIncrement?: number) => {
      setUserProfile(prevProfile => {
          if (!prevProfile.notepadData || !prevProfile.notepadData.habits) return prevProfile;

          let habitCompletedForChallenge = false;

          const updatedHabits = prevProfile.notepadData.habits.map(habit => {
              if (habit.id === habitId) {
                  const logKey = getHabitLogKey(habit, date);
                  const oldLogEntry = habit.log[logKey] || { date: logKey, completed: false, count: 0 };

                  let newCompletedStatus = completed;
                  let newCount = oldLogEntry.count || 0;

                  if (habit.frequency === 'weekly' && habit.targetCompletions) {
                      if (completed) {
                         newCount = (oldLogEntry.count || 0) + (countIncrement || 1);
                      } else {
                         newCount = Math.max(0, (oldLogEntry.count || 0) - (countIncrement || 1));
                      }
                      newCompletedStatus = newCount >= habit.targetCompletions;
                  } else {
                      newCount = completed ? 1 : 0;
                  }

                  const newLogEntry: HabitLogEntry = { ...oldLogEntry, completed: newCompletedStatus, count: newCount };
                  const newLog = { ...habit.log, [logKey]: newLogEntry };

                  let currentStreak = habit.currentStreak;
                  let longestStreak = habit.longestStreak;

                  if (habit.frequency === 'daily') {
                      if (newCompletedStatus) {
                          const yesterdayKey = format(subDays(date, 1), 'yyyy-MM-dd');
                          if (habit.log[yesterdayKey]?.completed) {
                              currentStreak++;
                          } else {
                              currentStreak = 1;
                          }
                          if (currentStreak > longestStreak) {
                              longestStreak = currentStreak;
                          }
                          habitCompletedForChallenge = true;
                      } else {

                           const todayKey = format(date, 'yyyy-MM-dd');

                           if (logKey === todayKey) {
                             currentStreak = 0;
                           }
                      }
                  } else if (habit.frequency === 'weekly') {
                     if(newCompletedStatus) {
                        const prevWeekKey = getHabitLogKey(habit, subDays(date, 7));
                        if(habit.log[prevWeekKey]?.completed){
                            currentStreak++;
                        } else {
                            currentStreak = 1;
                        }
                        if (currentStreak > longestStreak) {
                            longestStreak = currentStreak;
                        }
                     } else {
                        const currentWeekKey = getHabitLogKey(habit, date);
                        if (logKey === currentWeekKey) {
                           currentStreak = 0;
                        }
                     }
                  }
                  return { ...habit, log: newLog, currentStreak, longestStreak };
              }
              return habit;
          });

          if(habitCompletedForChallenge){
             updateChallengeProgress('habitCompletions', 1);
          }

          return {
              ...prevProfile,
              notepadData: {
                  ...(prevProfile.notepadData),
                  habits: updatedHabits,
              }
          };
      });
      toast({ title: "Habit Updated", description: "Your progress has been logged." });
  }, [toast, updateChallengeProgress]);


  const addNotepadCountdownEvent = useCallback((eventData: Omit<NotepadCountdownEvent, 'id' | 'createdAt'>) => {
    const newEvent: NotepadCountdownEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const currentEvents = userProfile.notepadData.countdownEvents || [];
    updateNotepadField('countdownEvents', [...currentEvents, newEvent].sort((a,b) => parseISO(a.targetDate).getTime() - parseISO(b.targetDate).getTime()));
    toast({ title: "Event Countdown Added", description: `"${newEvent.name}" is now being tracked.` });
  }, [toast, userProfile.notepadData.countdownEvents, updateNotepadField]);

  const updateNotepadCountdownEvent = useCallback((updatedEvent: NotepadCountdownEvent) => {
    const currentEvents = userProfile.notepadData.countdownEvents || [];
    const newEvents = currentEvents.map(event =>
      event.id === updatedEvent.id ? updatedEvent : event
    ).sort((a,b) => parseISO(a.targetDate).getTime() - parseISO(b.targetDate).getTime());
    updateNotepadField('countdownEvents', newEvents);
    toast({ title: "Event Countdown Updated", description: `"${updatedEvent.name}" has been saved.` });
  }, [toast, userProfile.notepadData.countdownEvents, updateNotepadField]);

  const deleteNotepadCountdownEvent = useCallback((eventId: string) => {
    const currentEvents = userProfile.notepadData.countdownEvents || [];
    const eventToDelete = currentEvents.find(e => e.id === eventId);
    const newEvents = currentEvents.filter(event => event.id !== eventId);
    updateNotepadField('countdownEvents', newEvents);
    if (eventToDelete) {
      toast({ title: "Event Countdown Deleted", description: `"${eventToDelete.name}" has been removed.` });
    }
  }, [toast, userProfile.notepadData.countdownEvents, updateNotepadField]);



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

  const ensureCapitalistOffers = useCallback(() => {
    const now = Date.now();
    if (!lastOfferGenerationTime || now - lastOfferGenerationTime > 24 * 60 * 60 * 1000 || capitalistOffers.some(o => o.expiresAt && o.expiresAt < now)) {
      const newOffers = generateOffers();
      setCapitalistOffers(newOffers);
      setLastOfferGenerationTime(now);
    }
  }, [lastOfferGenerationTime, capitalistOffers]);

  const investInOffer = useCallback(async (offerId: string, investmentAmount: number): Promise<{ success: boolean; message: string; profit?: number }> => {
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

    let profit = Math.round(investmentAmount * (actualRoiPercent / 100));
    let finalCashChange = profit;
    let message = profit >= 0 ? `Investment successful! You gained $${profit.toLocaleString()}.` : `Investment risky... You lost $${Math.abs(profit).toLocaleString()}.`;

    if (profit >= 0 && offer.completionBonusCash) {
        finalCashChange += offer.completionBonusCash;
        message += ` Plus, a completion bonus of $${offer.completionBonusCash.toLocaleString()}!`;
    }

    setUserProfile(prev => ({ ...prev, cash: prev.cash + finalCashChange }));
    setCapitalistStatsForAchievements(prev => ({
        firstInvestmentMade: true,
        totalProfit: prev.totalProfit + (finalCashChange > 0 ? finalCashChange : 0)
    }));

    setCapitalistOffers(prevOffers => prevOffers.filter(o => o.id !== offerId));

    return { success: true, message, profit: finalCashChange };

  }, [capitalistOffers, userProfile.cash]);

  const claimChallengeReward = useCallback((challengeId: string) => {
    setDailyChallenges(prevChallenges => {
        const updatedChallenges = prevChallenges.map(challenge => {
            if (challenge.id === challengeId && challenge.isCompleted && !challenge.rewardClaimed) {
                setUserProfile(prevProfile => {
                    const newXp = prevProfile.xp + challenge.xpReward;
                    const { newLevel, newTitle } = checkForLevelUp(newXp, prevProfile.level);
                    toast({title: "Challenge Reward Claimed!", description: `+${challenge.xpReward} XP, +$${challenge.cashReward.toLocaleString()} for '${challenge.title}'`});

                    const updatedCompletedIds = [...(prevProfile.completedChallengeIds || []), challengeId];

                    return {
                        ...prevProfile,
                        xp: newXp,
                        cash: prevProfile.cash + challenge.cashReward,
                        level: newLevel,
                        title: newTitle,
                        completedChallengeIds: updatedCompletedIds,
                    };
                });
                return { ...challenge, rewardClaimed: true };
            }
            return challenge;
        });
        return updatedChallenges;
    });
  }, [toast, checkForLevelUp]);

  const getUnlockedAchievements = useCallback((): Achievement[] => {
    return ALL_ACHIEVEMENTS.filter(ach => userProfile.unlockedAchievementIds?.includes(ach.id));
  }, [userProfile.unlockedAchievementIds]);


  useEffect(() => {
    loadData();
  }, [loadData]);


  if (!isLoaded) {
    return null;
  }

  return (
    <SessionContext.Provider value={{
      sessions, addSession, clearSessions, updateSessionDescription,
      userProfile, updateUserProfile, updateSleepWakeTimes, updateNotepadData,
      updateTaskChallengeProgress,
      addNotepadNote, updateNotepadNote, deleteNotepadNote,
      addRevisionConcept, markConceptRevised, deleteRevisionConcept,
      addHabit, updateHabit, deleteHabit, logHabitCompletion, getHabitCompletionForDate, getHabitCompletionsForWeek,
      addNotepadCountdownEvent, updateNotepadCountdownEvent, deleteNotepadCountdownEvent,
      getSkinById, buySkin, equipSkin, isSkinOwned,
      capitalistOffers, ensureCapitalistOffers, investInOffer, lastOfferGenerationTime,
      dailyChallenges, claimChallengeReward, updateChallengeProgress,
      getUnlockedAchievements, checkAndUnlockAchievements,
      isLoaded
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

