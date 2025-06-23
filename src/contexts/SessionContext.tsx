
"use client";

import type { StudySession, UserProfile, Skin, NotepadTask, NotepadNote, NotepadGoal, NotepadLink, NotepadData, DailyChallenge, Achievement, RevisionConcept, Habit, HabitFrequency, HabitLogEntry, NotepadCountdownEvent, Skill, FeatureKey, FloatingGain, PomodoroState, StopwatchState, CountdownState, PomodoroMode, PomodoroSettings, DailyOffer, Business } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Zap, ShoppingCart, ShieldCheck, CalendarCheck, Award, Clock, BarChart, Coffee, Timer, TrendingUp, Brain, Gift, Star, DollarSign, Activity, AlignLeft, Link2, CheckSquare, Trophy, TrendingDown, Sigma, Moon, Sun, Palette, Package, Briefcase, Target as TargetIcon, Edit, Repeat, ListChecks as HabitIcon, CalendarClock, BarChart3, Wind, NotebookText, Settings, Lightbulb, HelpCircle, Network, Settings2, Grid, CheckSquare2, StickyNote, Target, Link as LinkLucide, Sparkles, XCircle, Save, Trash2, CheckCircle, Percent, RepeatIcon, PaletteIcon, MoreVertical, ChevronDown, Gem, Flame, Shuffle, BrainCircuit, Rocket, Eye, Layers, Smartphone, Sunrise, Feather, Library, CalendarHeart, CalendarCheck2, Building2, HandCoins, FileText, Archive, CalendarPlus, Signal, Shirt, Headphones, RotateCcw, Crown, Building } from 'lucide-react';
import { format, addDays, differenceInDays, isYesterday, isToday, parseISO, startOfWeek, getWeek, formatISO, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

export const XP_PER_MINUTE_FOCUS = 10;
export const CASH_PER_5_MINUTES_FOCUS = 100;
export const CASH_REWARD_PER_LEVEL = 500;
export const STREAK_BONUS_PER_DAY = 0.01; // 1% bonus per day
export const MAX_STREAK_BONUS = 0.20; // Max 20% bonus from streak
export const DAILY_LOGIN_BASE_CASH = 200;
export const DAILY_LOGIN_STREAK_CASH_BONUS = 50; // Extra cash per consecutive login day
export const DAILY_LOGIN_MAX_STREAK_BONUS_CASH = 500; // Max bonus cash from login streak

export const TITLES = [
  "Newbie", "Aspirant", "Novice", "Apprentice", "Journeyman", "Adept", "Scholar", "Savant", "Mentor", "Expert",
  "Erudite", "Pundit", "Prodigy", "Luminary", "Virtuoso", "Master", "Grandmaster", "Enlightened", "Innovator", "Ascendant",
  "Transcendent", "Celestial", "Cosmic Voyager", "Stellar Scholar", "Nebula Navigator", "Galaxy Brain", "Quasar Quester", "Pulsar Pilgrim", "Event Horizon", "Singularity",
  "Dimension Drifter", "Time Weaver", "Reality Shaper", "Mind Architect", "Thought Emperor", "Knowledge Incarnate", "Wisdom Sovereign", "Concept King", "Idea Monarch", "Apex Thinker",
  "Philosopher Queen", "Scribe of Ages", "Lorekeeper", "Eternal Student", "Patron of Progress", "Dean of Dedication", "Chancellor of Concentration", "Provost of Productivity", "Rector of Recall", "Headmaster of Habits",
  "Polymath", "Autodidact", "Bibliophile", "Logophile", "Sophist", "Renaissance Soul", "Universal Mind", "Noetic Nomad", "Cognitive Knight", "Cerebral Champion",
  "Synaptic Samurai", "Neural Ninja", "Dendrite Duke", "Myelin Marquess", "Axon Admiral", "Frontal Lobe Baron", "Parietal Lobe Prince", "Temporal Lobe Tetrarch", "Occipital Lobe Overlord", "Cerebellum Caesar",
  "Hippocampus Hero", "Amygdala Ace", "Thalamus Thane", "Hypothalamus Highness", "Pituitary Patrician", "Pineal Pioneer", "Corpus Callosum Captain", "Neocortex Commander", "Gray Matter General", "White Matter Warlord",
  "Quantum Learner", "Metaphysical Maven", "Epistemology Expert", "Ontology Officer", "Axiology Authority", "Logic Lord", "Reasoning Ruler", "Deduction Duke", "Induction Imperator", "Abduction Autocrat",
  "Zenith Scholar", "Apex Sage", "Omega Mind", "Alpha Learner", "The Final Word", "Unending Query", "Silent Savant", "Void Thinker", "The Librarian", "One Who Knows"
];

// New leveling curve: Level 1->2 takes 25 min. Each subsequent level takes 15 more minutes than the last.
const generateArithmeticLevelThresholds = (numLevels: number, xpPerMinute: number): number[] => {
  const thresholds: number[] = [0]; // Level 1 is 0 XP
  let totalMinutes = 0;
  for (let level = 2; level <= numLevels; level++) {
    const minutesForThisLevel = 25 + (level - 2) * 15;
    totalMinutes += minutesForThisLevel;
    thresholds.push(Math.round(totalMinutes * xpPerMinute));
  }
  return thresholds;
};

export const ACTUAL_LEVEL_THRESHOLDS = generateArithmeticLevelThresholds(100, XP_PER_MINUTE_FOCUS);


export const PREDEFINED_SKINS: Skin[] = [
  { id: 'classic', name: 'Classic Blue', description: 'The default, calming blue theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/6FB5F0/FFFFFF.png?text=Classic+Blue', dataAiHint: 'study app classic blue theme', isTheme: true, themeClass: 'classic' },
  { id: 'dark_mode', name: 'Dark Mode', description: 'Embrace the darkness. A sleek dark theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/1A202C/A0AEC0.png?text=Dark+Mode', dataAiHint: 'dark theme study dashboard', isTheme: true, themeClass: 'dark' },
  { id: 'sepia_tone', name: 'Sepia Tone', description: 'A warm, vintage sepia theme for focused nostalgia.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/D2B48C/4A3B31.png?text=Sepia+Tone', dataAiHint: 'sepia theme timer interface', isTheme: true, themeClass: 'sepia' },
  { id: 'forest', name: 'Forest Whisper', description: 'Earthy tones for deep concentration.', price: 10000, levelRequirement: 3, imageUrl: 'https://placehold.co/400x225/2F4F4F/90EE90.png?text=Forest+Theme', dataAiHint: 'forest theme study app interface', isTheme: true, themeClass: 'theme-forest' },
  { id: 'sunset', name: 'Sunset Vibes', description: 'Warm colors to keep you motivated.', price: 15000, levelRequirement: 5, imageUrl: 'https://placehold.co/400x225/FF8C00/FFD700.png?text=Sunset+Theme', dataAiHint: 'sunset theme study app focus mode', isTheme: true, themeClass: 'theme-sunset' },
  { id: 'galaxy', name: 'Galaxy Quest', description: 'Explore the universe of knowledge.', price: 30000, levelRequirement: 7, imageUrl: 'https://placehold.co/400x225/483D8B/E6E6FA.png?text=Galaxy+Theme', dataAiHint: 'galaxy theme app dashboard study', isTheme: true, themeClass: 'theme-galaxy' },
];

export const DEFAULT_NOTEPAD_DATA: NotepadData = {
  tasks: [], notes: [], goals: [], links: [], revisionConcepts: [], habits: [], countdownEvents: [],
  eisenhowerMatrix: { urgentImportant: [], notUrgentImportant: [], urgentNotImportant: [], notUrgentNotImportant: [] }
};

const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15, cyclesPerLongBreak: 4,
};

const DEFAULT_POMODORO_STATE: PomodoroState = {
    mode: 'work',
    isRunning: false,
    cyclesCompleted: 0,
    settings: DEFAULT_POMODORO_SETTINGS,
    sessionStartTime: 0,
    sessionEndTime: 0,
};

const DEFAULT_STOPWATCH_STATE: StopwatchState = {
    timeElapsedOnPause: 0,
    isRunning: false,
    sessionStartTime: null,
};

const DEFAULT_COUNTDOWN_STATE: CountdownState = {
    isRunning: false,
    timeLeftOnPause: 5 * 60 * 1000,
    initialDuration: 5 * 60 * 1000,
    sessionStartTime: null,
};


const DAILY_OFFERS_POOL: DailyOffer[] = [
  { id: 'xp_buff_sm', title: 'Mental Clarity', description: 'A small boost to your learning efficiency.', type: 'buff', durationMinutes: 60, effect: { type: 'xp', modifier: 1.10, description: '+10% XP Gain' } },
  { id: 'xp_buff_lg', title: 'Genius Hour', description: 'A significant boost to your focus and returns.', type: 'buff', durationMinutes: 60, effect: { type: 'xp', modifier: 1.25, description: '+25% XP Gain' } },
  { id: 'cash_buff_sm', title: 'Good Fortune', description: 'A small boost to your earnings.', type: 'buff', durationMinutes: 120, effect: { type: 'cash', modifier: 1.15, description: '+15% Cash Gain' } },
  { id: 'cash_buff_lg', title: 'Midas Touch', description: 'A large boost to your earnings.', type: 'buff', durationMinutes: 60, effect: { type: 'cash', modifier: 1.50, description: '+50% Cash Gain' } },
  { id: 'timer_buff', title: 'Time Dilation', description: 'Pomodoro focus sessions are shorter, but breaks are too!', type: 'buff', durationMinutes: 180, effect: { type: 'timer_speed', modifier: 0.90, description: '10% shorter Pomodoro cycles' } },
  { id: 'challenge_debuff', title: 'Mental Fog', description: 'Your focus is hazy, making learning less efficient.', type: 'debuff', durationMinutes: 60, effect: { type: 'xp', modifier: 0.80, description: '-20% XP Gain' } },
  { id: 'high_stakes', title: 'High Stakes', description: 'Double cash from studying, but gain no XP.', type: 'buff', durationMinutes: 60, effect: { type: 'cash', modifier: 2.0, description: '+100% Cash, but 0 XP' } },
];

const now = Date.now();
const DEFAULT_BUSINESSES = {
  farm: { id: 'farm', name: 'Hydroponic Farm', description: 'A steady and reliable source of income from high-tech crops.', gimmickTitle: 'Steady Growth', gimmickDescription: 'A reliable investment. Upon collection, there is a small (15%) chance of a "low yield," which halves the collected amount.', unlockCost: 0, unlocked: false, level: 1, baseIncome: 200, lastCollected: now, currentCash: 0 },
  startup: { id: 'startup', name: 'AI Startup', description: 'A risky but potentially lucrative AI venture.', gimmickTitle: 'High Volatility', gimmickDescription: 'High risk, high reward. Upon collection, there is a 40% chance of failure (collecting $0), but a 10% chance of a 5x "viral" bonus.', unlockCost: 1000, unlocked: false, level: 1, baseIncome: 120, lastCollected: now, currentCash: 0 },
  mine: { id: 'mine', name: 'Asteroid Mine', description: 'Extracts valuable minerals from space rocks.', gimmickTitle: 'Depleting Resource', gimmickDescription: 'Starts with high income, but the accrued amount depletes by 2% for every hour it sits uncollected. Upgrading resets the depletion.', unlockCost: 25000, unlocked: false, level: 1, baseIncome: 800, lastCollected: now, currentCash: 0, depletionRate: 0.02 },
  industry: { id: 'industry', name: 'Fusion Factory', description: 'A massive industrial complex generating clean energy.', gimmickTitle: 'Maintenance Costs', gimmickDescription: 'Excellent and reliable income, but 10% of the collected amount is automatically deducted for maintenance costs.', unlockCost: 100000, unlocked: false, level: 1, baseIncome: 2500, lastCollected: now, currentCash: 0, maintenanceCost: 0.10 },
};

const DEFAULT_USER_PROFILE: UserProfile = {
  xp: 0, cash: 1000, level: 1, title: TITLES[0],
  ownedSkinIds: ['classic', 'dark_mode', 'sepia_tone'], equippedSkinId: 'classic',
  completedChallengeIds: [], currentStreak: 0, longestStreak: 0, lastStudyDate: null,
  wakeUpTime: { hour: 8, period: 'AM' }, sleepTime: { hour: 10, period: 'PM' },
  unlockedAchievementIds: [], lastLoginDate: null, dailyLoginStreak: 0,
  notepadData: DEFAULT_NOTEPAD_DATA, skillPoints: 0, unlockedSkillIds: ['unlockTimers', 'unlockSkillTree'], skillLevels: {},
  businesses: DEFAULT_BUSINESSES,
  dailyOffers: { date: '', offers: [] }, activeOfferId: null, activeOfferEndTime: null, offerDeactivatedToday: false,
};

const INITIAL_DAILY_CHALLENGES_POOL: DailyChallenge[] = [
    { id: 'study30', title: 'Quick Learner', description: 'Study for a total of 30 minutes today.', xpReward: 50, cashReward: 500, targetValue: 30, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyDurationMinutes', resetsDaily: true },
    { id: 'study90', title: 'Deep Dive', description: 'Study for a total of 90 minutes today.', xpReward: 150, cashReward: 1500, targetValue: 90, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyDurationMinutes', resetsDaily: true },
    { id: 'study180', title: 'Marathon Session', description: 'Study for a total of 3 hours today.', xpReward: 300, cashReward: 3000, targetValue: 180, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyDurationMinutes', resetsDaily: true },
    { id: 'focusCycles1', title: 'Focus Warm-up', description: 'Complete 1 focus cycle (Pomodoro or 25+ min Stopwatch).', xpReward: 40, cashReward: 300, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'focusCycles', resetsDaily: true },
    { id: 'focusCycles5', title: 'Pomodoro Powerhouse', description: 'Complete 5 focus cycles (Pomodoro or 25+ min Stopwatch).', xpReward: 180, cashReward: 1500, targetValue: 5, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'focusCycles', resetsDaily: true },
    { id: 'tasks5', title: 'Task Master', description: 'Complete 5 tasks from your checklist.', xpReward: 75, cashReward: 700, targetValue: 5, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'tasksCompleted', resetsDaily: true },
    { id: 'ambiance15', title: 'Sound Scaper', description: 'Use the Ambiance Mixer for 15 minutes.', xpReward: 25, cashReward: 200, targetValue: 15, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'ambianceUsage', resetsDaily: true },
    { id: 'notepadNote1', title: 'Note Taker', description: 'Create one new note in your notepad.', xpReward: 20, cashReward: 150, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'notepadEntry', resetsDaily: true },
    { id: 'streakKeep', title: 'Streak Keeper', description: 'Maintain your study streak by studying today.', xpReward: 25, cashReward: 250, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'studyStreak', resetsDaily: true },
    { id: 'habitTracker1', title: 'Habit Hero', description: 'Complete one daily habit.', xpReward: 30, cashReward: 200, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'habitCompletions', resetsDaily: true},
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
  { id: 'timeLord', name: 'Time Master', description: 'Study for a total of 500 hours.', iconName: 'Sun', cashReward: 100000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 1800000, category: 'Study Time' },
  { id: 'thousandHourThrone', name: 'Thousand Hour Throne', description: 'Study for a total of 1000 hours. An incredible feat.', iconName: 'Crown', cashReward: 200000, criteria: (p, s) => s.reduce((sum, sess) => sum + sess.duration, 0) >= 3600000, category: 'Study Time' },
  { id: 'nightOwl', name: 'Night Owl', description: 'Log 10 study sessions between midnight and 4 AM.', iconName: 'Moon', cashReward: 500, criteria: (p, s) => s.filter(sess => new Date(sess.startTime).getHours() >= 0 && new Date(sess.startTime).getHours() < 4).length >= 10, category: 'Study Time' },
  { id: 'earlyBird', name: 'Early Bird', description: 'Log 10 study sessions between 4 AM and 7 AM.', iconName: 'Sunrise', cashReward: 500, criteria: (p, s) => s.filter(sess => new Date(sess.startTime).getHours() >= 4 && new Date(sess.startTime).getHours() < 7).length >= 10, category: 'Study Time' },
  
  // Pomodoro
  { id: 'pomodoroInitiate', name: 'Pomodoro Initiate', description: 'Complete 1 full Pomodoro focus cycle.', iconName: 'Timer', cashReward: 100, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 1, category: 'Pomodoro' },
  { id: 'pomodoroAdept', name: 'Pomodoro Adept', description: 'Complete 10 full Pomodoro focus cycles.', iconName: 'Timer', cashReward: 1500, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 10, category: 'Pomodoro' },
  { id: 'pomodoroExpert', name: 'Pomodoro Expert', description: 'Complete 50 full Pomodoro focus cycles.', iconName: 'Coffee', cashReward: 5000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 50, category: 'Pomodoro' },
  { id: 'pomodoroSensei', name: 'Pomodoro Sensei', description: 'Complete 100 full Pomodoro focus cycles.', iconName: 'Activity', cashReward: 7500, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 100, category: 'Pomodoro' },
  { id: 'pomodoroZenith', name: 'Pomodoro Zenith', description: 'Complete 500 full Pomodoro focus cycles.', iconName: 'Moon', cashReward: 30000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 500, category: 'Pomodoro' },
  { id: 'pomodoroGrandmaster', name: 'Pomodoro Grandmaster', description: 'Complete 1,000 full Pomodoro focus cycles.', iconName: 'BrainCircuit', cashReward: 50000, criteria: (p, s) => s.filter(sess => sess.type === 'Pomodoro Focus' && sess.isFullPomodoroCycle).length >= 1000, category: 'Pomodoro' },
  
  // Progression
  { id: 'levelUpNovice', name: 'Adept Learner', description: 'Reach Level 5: Adept.', iconName: 'Award', cashReward: 1000, criteria: (p) => p.level >= 5, category: 'Progression' },
  { id: 'masterOfTheMind', name: 'Master of the Mind', description: 'Reach Level 15: Virtuoso.', iconName: 'ShieldCheck', cashReward: 10000, criteria: (p) => p.level >= 15, category: 'Progression' },
  { id: 'levelTwentyTitan', name: 'Study Titan', description: 'Reach Level 20: Ascendant.', iconName: 'Star', cashReward: 15000, criteria: (p) => p.level >= 20, category: 'Progression' },
  { id: 'levelThirtyLegend', name: 'Galactic Prodigy', description: 'Reach Level 30: Singularity.', iconName: 'Package', cashReward: 30000, criteria: (p) => p.level >= 30, category: 'Progression' },
  { id: 'levelFiftyOracle', name: 'Apex Scholar', description: 'Reach Level 50: Headmaster of Habits.', iconName: 'Gem', cashReward: 75000, criteria: (p) => p.level >= 50, category: 'Progression' },
  { id: 'levelSeventyFiveSage', name: 'Level 75 Sage', description: 'Reach Level 75: Ontology Officer.', iconName: 'Feather', cashReward: 100000, criteria: (p) => p.level >= 75, category: 'Progression' },
  { id: 'centurion', name: 'Centurion', description: 'Reach Level 100: The Librarian.', iconName: 'Library', cashReward: 250000, criteria: (p) => p.level >= 100, category: 'Progression' },
  
  // Collection
  { id: 'shopSpree', name: 'Shop Spree', description: 'Buy your first (non-free) skin.', iconName: 'ShoppingCart', cashReward: 500, criteria: (p) => p.ownedSkinIds.some(id => (PREDEFINED_SKINS.find(s => s.id === id)?.price || 0) > 0), category: 'Collection' },
  { id: 'fashionista', name: 'Fashionista', description: 'Own 5 different paid skins.', iconName: 'Palette', cashReward: 4000, criteria: (p) => p.ownedSkinIds.filter(id => (PREDEFINED_SKINS.find(s => s.id === id)?.price || 0) > 0).length >= 5, category: 'Collection' },
  { id: 'skinCollector', name: 'Ultimate Skin Collector', description: 'Own all available skins.', iconName: 'Briefcase', cashReward: 25000, criteria: (p) => p.ownedSkinIds.length === PREDEFINED_SKINS.length, category: 'Collection' },
  
  // Streaks & Challenges
  { id: 'streakStarter', name: 'Streak Starter', description: 'Achieve a 3-day study streak.', iconName: 'Zap', cashReward: 1000, criteria: (p) => p.longestStreak >= 3, category: 'Streaks & Challenges' },
  { id: 'weekLongWarrior', name: 'Week-Long Warrior', description: 'Achieve a 7-day study streak.', iconName: 'CalendarCheck', cashReward: 2500, criteria: (p) => p.longestStreak >= 7, category: 'Streaks & Challenges' },
  { id: 'unstoppableStreaker', name: 'Unstoppable Streaker', description: 'Achieve a 30-day study streak.', iconName: 'Flame', cashReward: 20000, criteria: (p) => p.longestStreak >= 30, category: 'Streaks & Challenges' },
  { id: 'challengeChampion', name: 'Challenge Champion', description: 'Complete 10 daily challenges in total.', iconName: 'TargetIcon', cashReward: 2000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 10, category: 'Streaks & Challenges' },
  { id: 'challengeConqueror', name: 'Challenge Conqueror', description: 'Complete 50 daily challenges in total.', iconName: 'Gift', cashReward: 10000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 50, category: 'Streaks & Challenges' },
  { id: 'hundredDayHabit', name: 'Hundred Day Habit', description: 'Achieve a 100-day study streak.', iconName: 'CalendarHeart', cashReward: 50000, criteria: (p) => p.longestStreak >= 100, category: 'Streaks & Challenges' },
  { id: 'yearOfFocus', name: 'A Year of Focus', description: 'Achieve a 365-day study streak.', iconName: 'CalendarCheck2', cashReward: 200000, criteria: (p) => p.longestStreak >= 365, category: 'Streaks & Challenges' },
  { id: 'challengeDevotee', name: 'Challenge Devotee', description: 'Complete 100 daily challenges in total.', iconName: 'Star', cashReward: 25000, criteria: (p) => (p.completedChallengeIds?.length || 0) >= 100, category: 'Streaks & Challenges' },

  // Notepad & Revision
  { id: 'diligentRevisionist', name: 'Diligent Revisionist', description: 'Add 5 concepts to the Revision Hub.', iconName: 'Brain', cashReward: 1000, criteria: (p) => (p.notepadData.revisionConcepts?.length || 0) >= 5, category: 'Notepad & Revision' },
  { id: 'memoryMaster', name: 'Memory Master', description: 'Successfully revise 10 concepts through their cycle (stage 3+).', iconName: 'AlignLeft', cashReward: 3000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 3).length || 0) >= 10, category: 'Notepad & Revision' },
  { id: 'perfectRecall', name: 'Perfect Recall', description: 'Master 20 concepts in Revision Hub (stage 5+).', iconName: 'CheckSquare', cashReward: 10000, criteria: (p) => (p.notepadData.revisionConcepts?.filter(rc => rc.revisionStage >= 5).length || 0) >= 20, category: 'Notepad & Revision' },
  { id: 'taskScheduler', name: 'Task Scheduler', description: 'Complete 20 tasks from your checklist.', iconName: 'ListChecks', cashReward: 1500, criteria: (p) => (p.notepadData.tasks.filter(t => t.completed).length || 0) >= 20, category: 'Notepad & Revision' },
  { id: 'goalGetter', name: 'Goal Getter', description: 'Complete 10 goals from your goals list.', iconName: 'Target', cashReward: 2000, criteria: (p) => (p.notepadData.goals.filter(g => g.completed).length || 0) >= 10, category: 'Notepad & Revision' },
  { id: 'greatWallOfText', name: 'Great Wall of Text', description: 'Write a single note with over 1000 characters.', iconName: 'FileText', cashReward: 2000, criteria: (p) => (p.notepadData.notes?.some(n => n.content.length > 1000) || false), category: 'Notepad & Revision' },
  { id: 'taskAnnihilator', name: 'Task Annihilator', description: 'Complete 100 tasks from your checklist.', iconName: 'ListChecks', cashReward: 3000, criteria: (p) => (p.notepadData.tasks.filter(t => t.completed).length || 0) >= 100, category: 'Notepad & Revision' },
  { id: 'archivist', name: 'Archivist', description: 'Save 50 links in your notepad.', iconName: 'Archive', cashReward: 2500, criteria: (p) => (p.notepadData.links?.length || 0) >= 50, category: 'Notepad & Revision' },
  { id: 'longTermPlanner', name: 'Long-Term Planner', description: 'Set a goal with a due date more than a year away.', iconName: 'CalendarPlus', cashReward: 1500, criteria: (p) => p.notepadData.goals.some(g => g.dueDate && differenceInDays(parseISO(g.dueDate), new Date()) > 365), category: 'Notepad & Revision' },

  // Habits
  { id: 'habitFormer', name: 'Habit Former', description: 'Create your first habit.', iconName: 'HabitIcon', cashReward: 500, criteria: (p) => (p.notepadData.habits?.length || 0) >= 1, category: 'Habits' },
  { id: 'dailyDiscipliner', name: 'Daily Discipliner', description: 'Maintain a 7-day streak on any daily habit.', iconName: 'Repeat', cashReward: 1500, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'daily' && h.currentStreak >= 7), category: 'Habits' },
  { id: 'weeklyWarrior', name: 'Weekly Warrior', description: 'Maintain a 4-week streak on any weekly habit.', iconName: 'RepeatIcon', cashReward: 2000, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'weekly' && h.currentStreak >= 4), category: 'Habits' },
  { id: 'habitualAchiever', name: 'Habitual Achiever', description: 'Complete 50 habit instances in total.', iconName: 'ListChecks', cashReward: 3000, criteria: (p) => (p.notepadData.habits?.reduce((sum, hab) => sum + Object.values(hab.log).filter(l => l.completed).length, 0) || 0) >= 50, category: 'Habits'},
  { id: 'ironWill', name: 'Iron Will', description: 'Maintain a 30-day streak on any daily habit.', iconName: 'Gem', cashReward: 5000, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'daily' && h.longestStreak >= 30), category: 'Habits' },
  { id: 'persistentProgress', name: 'Persistent Progress', description: 'Maintain a 12-week streak on any weekly habit.', iconName: 'Signal', cashReward: 7500, criteria: (p) => !!p.notepadData.habits?.some(h => h.frequency === 'weekly' && h.longestStreak >= 12), category: 'Habits' },
  
  // Capitalist
  { id: 'firstInvestment', name: 'First Investment', description: 'Unlock your first business.', iconName: 'HandCoins', cashReward: 500, criteria: (p) => Object.values(p.businesses).some(b => b.unlocked), category: 'Capitalist' },
  { id: 'diversifiedPortfolio', name: 'Diversified Portfolio', description: 'Unlock all four businesses.', iconName: 'Briefcase', cashReward: 5000, criteria: (p) => Object.values(p.businesses).every(b => b.unlocked), category: 'Capitalist' },
  { id: 'businessTycoon', name: 'Business Tycoon', description: 'Get one business to Level 10.', iconName: 'Building', cashReward: 10000, criteria: (p) => Object.values(p.businesses).some(b => b.level >= 10), category: 'Capitalist' },
  { id: 'mogul', name: 'Mogul', description: 'Have a combined level of 40 across all businesses.', iconName: 'Landmark', cashReward: 25000, criteria: (p) => Object.values(p.businesses).reduce((sum, b) => sum + b.level, 0) >= 40, category: 'Capitalist' },
  { id: 'millionaireClub', name: 'Millionaire Club', description: 'Hold over $1,000,000 cash at one time.', iconName: 'Landmark', cashReward: 10000, criteria: (p) => p.cash >= 1000000, category: 'Capitalist' },
  { id: 'passivePowerhouse', name: 'Passive Powerhouse', description: 'Have a combined passive income of over $20,000 per hour.', iconName: 'DollarSign', cashReward: 20000, criteria: (p) => Object.values(p.businesses).reduce((total, business) => { if (business.unlocked) { const income = business.baseIncome * Math.pow(1.15, business.level - 1) * (1 - (business.maintenanceCost || 0)); return total + income; } return total; }, 0) >= 20000, category: 'Capitalist' },
  { id: 'businessMagnate', name: 'Business Magnate', description: 'Get all four businesses to Level 10.', iconName: 'Building2', cashReward: 50000, criteria: (p) => Object.values(p.businesses).every(b => b.level >= 10), category: 'Capitalist' },

  // General / Meta
  { id: 'skillfulLearner', name: 'Skillful Learner', description: 'Unlock 5 skills from the skill tree.', iconName: 'Network', cashReward: 1000, criteria: (p) => p.unlockedSkillIds.length >= 5, category: 'General' },
  { id: 'treeOfKnowledge', name: 'Tree of Knowledge', description: 'Unlock 15 skills from the skill tree.', iconName: 'Network', cashReward: 5000, criteria: (p) => p.unlockedSkillIds.length >= 15, category: 'General' },
  { id: 'skillTreeMaster', name: 'Skill Tree Master', description: 'Unlock all non-infinite skills.', iconName: 'Network', cashReward: 20000, criteria: p => ALL_SKILLS.filter(sk => sk.category !== 'Infinite').every(sk => p.unlockedSkillIds.includes(sk.id)), category: 'General'},
  { id: 'completionist', name: 'Completionist', description: 'Unlock all other achievements.', iconName: 'Crown', cashReward: 100000, criteria: (p) => (p.unlockedAchievementIds?.length || 0) >= ALL_ACHIEVEMENTS.length - 1, category: 'General' },
];

export const ALL_SKILLS: Skill[] = [
  // Always Unlocked
  { id: 'unlockTimers', name: 'Core Timers', description: 'Access Pomodoro and Stopwatch timers.', cost: 0, iconName: 'Clock', unlocksFeature: 'timers', category: 'Core Feature' },
  { id: 'unlockSkillTree', name: 'Path of Growth', description: 'Access the Skill Tree to unlock abilities.', cost: 0, iconName: 'Network', unlocksFeature: 'skill-tree', category: 'Core Feature' },
  
  // Core Feature Unlocks - Tier 1 (Logical progression from base)
  { id: 'unlockAbout', name: 'Guidance', description: 'Unlocks the "Guide" page to learn more about StudyFlow.', cost: 1, iconName: 'HelpCircle', unlocksFeature: 'about', prerequisiteLevel: 1, category: 'Core Feature' },
  { id: 'unlockStats', name: 'Data Analyst', description: 'Unlocks the "Statistics" page to monitor your study habits.', cost: 1, iconName: 'BarChart3', unlocksFeature: 'stats', prerequisiteLevel: 2, category: 'Core Feature' },
  { id: 'unlockNotepadMain', name: 'Notekeeper', description: 'Unlocks the main "Digital Notepad" page. Essential for organizing studies.', cost: 1, iconName: 'NotebookText', unlocksFeature: 'notepad', prerequisiteLevel: 2, category: 'Core Feature' },
  
  // Notepad Tab Unlocks - Tier 2 (Branching off Notekeeper Access)
  { id: 'unlockNotepadChecklist', name: 'Task Organizer', description: 'Unlocks the Checklist tab in the Notepad.', cost: 1, iconName: 'CheckSquare2', unlocksFeature: 'notepadChecklist', prerequisiteSkillIds: ['unlockNotepadMain'], prerequisiteLevel: 3, category: 'Notepad Feature' },
  { id: 'unlockNotepadNotes', name: 'Quick Notes', description: 'Unlocks the Notes tab for freeform thoughts.', cost: 1, iconName: 'StickyNote', unlocksFeature: 'notepadNotes', prerequisiteSkillIds: ['unlockNotepadMain'], prerequisiteLevel: 3, category: 'Notepad Feature' },
  
  // More App Features - Tier 2 & 3 (Branching off Core or Stats)
  { id: 'unlockAchievements', name: 'Milestone Monitor', description: 'Unlocks the "Achievements" page.', cost: 1, iconName: 'Award', unlocksFeature: 'achievements', prerequisiteLevel: 3, prerequisiteSkillIds: ['unlockStats'], category: 'Core Feature' },
  { id: 'unlockShop', name: 'Aspiring Collector', description: 'Unlocks the "Skin Shop".', cost: 1, iconName: 'ShoppingCart', unlocksFeature: 'shop', prerequisiteLevel: 4, prerequisiteSkillIds: ['unlockStats'], category: 'Core Feature' },
  { id: 'unlockAmbiance', name: 'Ambiance Weaver', description: 'Unlocks the "Ambiance Mixer".', cost: 1, iconName: 'Wind', unlocksFeature: 'ambiance', prerequisiteLevel: 4, prerequisiteSkillIds: ['unlockAbout'], category: 'Core Feature' },
  { id: 'pwaPro', name: 'PWA Pro', description: 'Enhances PWA functionality with offline access to core features.', cost: 1, iconName: 'Smartphone', prerequisiteLevel: 5, prerequisiteSkillIds: ['unlockAmbiance'], category: 'Utility' },

  // Advanced Notepad Features - Tier 3 (Requires earlier notepad skills or higher level)
  { id: 'unlockNotepadGoals', name: 'Goal Setter', description: 'Unlocks the Goals tab in Notepad.', cost: 1, iconName: 'Target', unlocksFeature: 'notepadGoals', prerequisiteSkillIds: ['unlockNotepadChecklist'], prerequisiteLevel: 4, category: 'Notepad Feature' },
  { id: 'unlockNotepadLinks', name: 'Resource Manager', description: 'Unlocks the Links tab in Notepad.', cost: 1, iconName: 'LinkLucide', unlocksFeature: 'notepadLinks', prerequisiteSkillIds: ['unlockNotepadNotes'], prerequisiteLevel: 4, category: 'Notepad Feature' },
  
  // Core Gameplay Loop Features - Tier 3 & 4
  { id: 'unlockChallenges', name: 'Challenge Seeker', description: 'Unlocks "Daily Challenges" and "Daily Offers".', cost: 2, iconName: 'CalendarCheck', unlocksFeature: 'challenges', prerequisiteLevel: 5, prerequisiteSkillIds: ['unlockAchievements'], category: 'Core Feature' },
  { id: 'challengeReroll', name: 'Challenge Reroll', description: 'Once per day, you can reroll one of your daily challenges for a new one.', cost: 2, iconName: 'Shuffle', prerequisiteLevel: 7, prerequisiteSkillIds: ['unlockChallenges'], category: 'Utility' },

  
  // Top Tier Features & Notepad - Tier 4 & 5
  { id: 'unlockCapitalist', name: 'Budding Investor', description: 'Unlocks the "Capitalist Corner" to generate passive income.', cost: 2, iconName: 'Briefcase', unlocksFeature: 'capitalist', prerequisiteLevel: 6, prerequisiteSkillIds: ['unlockShop'], category: 'Core Feature' },
  { id: 'unlockNotepadRevision', name: 'Revision Strategist', description: 'Unlocks the "Revision Hub" in Notepad.', cost: 2, iconName: 'Brain', unlocksFeature: 'notepadRevision', prerequisiteSkillIds: ['unlockNotepadNotes', 'unlockNotepadGoals'], prerequisiteLevel: 6, category: 'Notepad Feature' },
  { id: 'unlockNotepadHabits', name: 'Habit Builder', description: 'Unlocks the "Habit Tracker" tab in Notepad.', cost: 2, iconName: 'HabitIcon', unlocksFeature: 'notepadHabits', prerequisiteSkillIds: ['unlockNotepadGoals'], prerequisiteLevel: 7, category: 'Notepad Feature' },
  { id: 'unlockNotepadEvents', name: 'Deadline Master', description: 'Unlocks the "Events Countdown" tab in Notepad.', cost: 1, iconName: 'CalendarClock', unlocksFeature: 'notepadEvents', prerequisiteSkillIds: ['unlockNotepadGoals'], prerequisiteLevel: 7, category: 'Notepad Feature' },
  { id: 'unlockNotepadEisenhower', name: 'Priority Expert', description: 'Unlocks the "Eisenhower Matrix" in Notepad.', cost: 2, iconName: 'Grid', unlocksFeature: 'notepadEisenhower', prerequisiteSkillIds: ['unlockNotepadHabits'], prerequisiteLevel: 8, category: 'Notepad Feature' },
  { id: 'revisionAccelerator', name: 'Revision Accelerator', description: 'Reduces the time between revision intervals in the Revision Hub by 10%.', cost: 2, iconName: 'Rocket', prerequisiteLevel: 8, prerequisiteSkillIds: ['unlockNotepadRevision'], category: 'Notepad Feature' },
  { id: 'goalMomentum', name: 'Goal Momentum', description: 'Completing a goal on its due date grants a small XP bonus.', cost: 2, iconName: 'Trophy', prerequisiteLevel: 8, prerequisiteSkillIds: ['unlockNotepadGoals'], category: 'Notepad Feature' },

  // Passive Boosts Branch - XP
  { id: 'xpBoost1', name: 'Learner\'s Edge I', description: 'Gain +5% XP from all study sessions.', cost: 2, iconName: 'Zap', xpBoostPercent: 0.05, prerequisiteLevel: 5, prerequisiteSkillIds: ['pwaPro'], category: 'Passive Boost' },
  { id: 'xpBoost2', name: 'Learner\'s Edge II', description: 'Gain an additional +5% XP (total +10%).', cost: 3, iconName: 'Zap', xpBoostPercent: 0.05, prerequisiteLevel: 10, prerequisiteSkillIds: ['xpBoost1'], category: 'Passive Boost' },
  { id: 'knowledgeRetention', name: 'Knowledge Retention', description: 'Every 10th focus session grants a 25% XP bonus.', cost: 3, iconName: 'BrainCircuit', prerequisiteLevel: 12, prerequisiteSkillIds: ['xpBoost2'], category: 'Passive Boost' },
  { id: 'deepWork', name: "Deep Work Mode", description: "Unlocks a 'Deep Work' Pomodoro mode (50/10) with a 10% XP bonus.", cost: 5, iconName: 'Zap', prerequisiteLevel: 20, prerequisiteSkillIds: ['knowledgeRetention'], category: 'Core Feature' },

  // Passive Boosts Branch - Cash
  { id: 'cashBoost1', name: 'Money Mindset I', description: 'Gain +5% Cash from all study sessions.', cost: 2, iconName: 'DollarSign', cashBoostPercent: 0.05, prerequisiteLevel: 6, prerequisiteSkillIds: ['unlockShop'], category: 'Passive Boost' },
  { id: 'cashBoost2', name: 'Money Mindset II', description: 'Gain an additional +5% Cash (total +10%).', cost: 3, iconName: 'DollarSign', cashBoostPercent: 0.05, prerequisiteLevel: 11, prerequisiteSkillIds: ['cashBoost1'], category: 'Passive Boost' },
  { id: 'businessAcumen', name: 'Business Acumen', description: 'Reduces upgrade costs for all businesses by 10%.', cost: 3, iconName: 'TrendingUp', prerequisiteLevel: 8, prerequisiteSkillIds: ['unlockCapitalist'], category: 'Utility' },
  { id: 'marketAnalyst', name: 'Market Analyst', description: "Provides a hint about the next hour's AI Startup income chance.", cost: 4, iconName: 'Eye', prerequisiteLevel: 12, prerequisiteSkillIds: ['businessAcumen'], category: 'Utility' },


  // Utility Skills - Higher Cost / Unique Effects
  { id: 'streakShield', name: 'Streak Guardian', description: 'Once every 7 real-world days, your study streak is protected if you miss a day of studying. (Conceptual)', cost: 3, iconName: 'ShieldCheck', otherEffect: 'streak_shield', prerequisiteLevel: 7, prerequisiteSkillIds: ['challengeReroll'], category: 'Utility' },
  { id: 'shopDiscount1', name: 'Savvy Shopper', description: 'Get a 5% discount on all skin purchases.', cost: 2, iconName: 'Percent', shopDiscountPercent: 0.05, prerequisiteLevel: 9, prerequisiteSkillIds: ['unlockCapitalist'], category: 'Utility' },
  { id: 'breakTimeBonus', name: 'Break Time Bonus', description: 'Taking Pomodoro breaks has a small chance to grant bonus cash.', cost: 2, iconName: 'Coffee', prerequisiteLevel: 6, prerequisiteSkillIds: ['unlockAmbiance'], category: 'Passive Boost' },

  // Infinite Skills
  { id: 'infiniteXpBoost', name: 'Endless Insight', description: 'Permanently increases XP gain by 5%. Can be upgraded infinitely.', cost: 4, iconName: 'Zap', xpBoostPercent: 0.05, prerequisiteLevel: 15, prerequisiteSkillIds: ['xpBoost2'], category: 'Infinite' },
  { id: 'infiniteCashBoost', name: 'Infinite Earnings', description: 'Permanently increases Cash gain by 5%. Can be upgraded infinitely.', cost: 4, iconName: 'DollarSign', cashBoostPercent: 0.05, prerequisiteLevel: 15, prerequisiteSkillIds: ['cashBoost2'], category: 'Infinite' },
  { id: 'synergizer', name: 'Synergizer', description: 'Unlocks a small, permanent bonus to both XP and Cash gain for every achievement unlocked.', cost: 5, iconName: 'Layers', prerequisiteLevel: 25, prerequisiteSkillIds: ['infiniteXpBoost', 'infiniteCashBoost'], category: 'Infinite' },
];

const REVISION_INTERVALS = [1, 3, 7, 14, 30, 60, 90]; 

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

  countdownState: CountdownState;
  startCountdown: () => void;
  pauseCountdown: () => void;
  resetCountdown: (newDurationMs?: number) => void;
  setCountdownDuration: (durationMs: number) => void;
  logCountdownSession: () => void;


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

  unlockBusiness: (businessId: keyof UserProfile['businesses']) => void;
  upgradeBusiness: (businessId: keyof UserProfile['businesses']) => void;
  collectBusinessIncome: (businessId: keyof UserProfile['businesses'], rawAmount: number, secondsPassed: number) => void;

  getSkinById: (id: string) => Skin | undefined;
  buySkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => void;
  isSkinOwned: (skinId: string) => boolean;

  dailyOffers: DailyOffer[];
  selectDailyOffer: (offerId: string) => void;
  deactivateOffer: (offerId: string) => void;

  dailyChallenges: DailyChallenge[];
  claimChallengeReward: (challengeId: string) => void;
  updateChallengeProgress: (type: DailyChallenge['type'], value: number, absoluteValue?: boolean) => void;
  getUnlockedAchievements: () => Achievement[];
  isLoaded: boolean;
  updateNotepadData: (updatedNotepadData: Partial<NotepadData>) => void;

  getAllSkills: () => Skill[];
  isSkillUnlocked: (skillId: string) => boolean;
  canUnlockSkill: (skillId: string) => { can: boolean, reason?: string };
  unlockSkill: (skillId: string) => boolean;
  isFeatureUnlocked: (featureKey: FeatureKey) => boolean;
  getAppliedBoost: (type: 'xp' | 'cash' | 'shopDiscount') => number;
  getSkillBoost: (type: 'xp' | 'cash') => number;
  refundAllSkillPoints: () => void;

  floatingGains: FloatingGain[];
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([]);
  const [dailyOffers, setDailyOffers] = useState<DailyOffer[]>([]);
  const [lastChallengeResetDate, setLastChallengeResetDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [floatingGains, setFloatingGains] = useState<FloatingGain[]>([]);

  // Timer States
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>(DEFAULT_POMODORO_STATE);
  const [stopwatchState, setStopwatchState] = useState<StopwatchState>(DEFAULT_STOPWATCH_STATE);
  const [countdownState, setCountdownState] = useState<CountdownState>(DEFAULT_COUNTDOWN_STATE);


  const lastGainTime = useRef({ xp: 0, cash: 0 });
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  const addFloatingGain = useCallback((type: 'xp' | 'cash', amount: number) => {
    const now = Date.now();
    if (now - lastGainTime.current[type] < 500) { // 500ms debounce window
        return;
    }
    lastGainTime.current[type] = now;

    if (amount === 0) return;
    const newGain: FloatingGain = { id: crypto.randomUUID(), type, amount, timestamp: Date.now() };
    setFloatingGains(prev => [...prev, newGain]);
    setTimeout(() => setFloatingGains(prev => prev.filter(g => g.id !== newGain.id)), 2500);
  }, []);

  const checkAndUnlockAchievements = useCallback((profile: UserProfile, currentSessions: StudySession[]) => {
      if (!profile.unlockedSkillIds.includes('unlockAchievements')) return;
          
      const newlyUnlockedIds: string[] = [];
      let totalCashRewardFromAchievements = 0;

      for (const ach of ALL_ACHIEVEMENTS) {
        if (!profile.unlockedAchievementIds.includes(ach.id) && ach.criteria(profile, currentSessions)) {
          newlyUnlockedIds.push(ach.id);
          totalCashRewardFromAchievements += ach.cashReward;
          toast({ title: "Achievement Unlocked!", description: `${ach.name} (+$${ach.cashReward.toLocaleString()})`, icon: <Trophy/> });
          addFloatingGain('cash', ach.cashReward);
        }
      }
      
      if (newlyUnlockedIds.length > 0) {
        setUserProfile(prev => ({ 
            ...prev, 
            unlockedAchievementIds: [...prev.unlockedAchievementIds, ...newlyUnlockedIds], 
            cash: prev.cash + totalCashRewardFromAchievements 
        }));
      }
  }, [addFloatingGain, toast]);


  const updateUserProfile = useCallback((updatedProfileData: Partial<UserProfile>) => {
    const newProfile = {...userProfile, ...updatedProfileData};
    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
  }, [userProfile, checkAndUnlockAchievements]);

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
      return false; 
    }
    return isSkillUnlocked(skill.id);
  }, [isSkillUnlocked]);
  
  const updateChallengeProgress = useCallback((type: DailyChallenge['type'], value: number, absoluteValue: boolean = false) => {
    if(!isFeatureUnlocked('challenges')) return;
    setDailyChallenges(prevChallenges =>
        prevChallenges.map(challenge => {
            if (challenge.type === type && !challenge.rewardClaimed) {
                const newCurrentValue = absoluteValue ? value : (challenge.currentValue || 0) + value;
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
  
  const getSkillBoost = useCallback((type: 'xp' | 'cash'): number => {
    let boost = 0;
    userProfile.unlockedSkillIds.forEach(skillId => {
        const skill = ALL_SKILLS.find(s => s.id === skillId);
        if (skill) {
            if (type === 'xp' && skill.xpBoostPercent && skill.category !== 'Infinite') boost += skill.xpBoostPercent;
            if (type === 'cash' && skill.cashBoostPercent && skill.category !== 'Infinite') boost += skill.cashBoostPercent;
        }
    });
    if(type === 'xp' && userProfile.skillLevels?.['infiniteXpBoost']) {
        boost += (userProfile.skillLevels['infiniteXpBoost'] || 0) * 0.05;
    }
    if(type === 'cash' && userProfile.skillLevels?.['infiniteCashBoost']) {
        boost += (userProfile.skillLevels['infiniteCashBoost'] || 0) * 0.05;
    }
    return boost;
  }, [userProfile.unlockedSkillIds, userProfile.skillLevels]);

  const getAppliedBoost = useCallback((type: 'xp' | 'cash' | 'shopDiscount'): number => {
    let boost = getSkillBoost(type as 'xp' | 'cash');
    if (type === 'shopDiscount') {
        userProfile.unlockedSkillIds.forEach(skillId => {
            const skill = ALL_SKILLS.find(s => s.id === skillId);
            if (skill && skill.shopDiscountPercent) boost += skill.shopDiscountPercent;
        });
    }
    
    if(userProfile.activeOfferId && userProfile.activeOfferEndTime && userProfile.activeOfferEndTime > Date.now()) {
        const offer = DAILY_OFFERS_POOL.find(o => o.id === userProfile.activeOfferId);
        if(offer && offer.effect.type === type) {
            boost += (offer.effect.modifier - 1);
        }
    }
    
    return boost;
  }, [userProfile.unlockedSkillIds, userProfile.skillLevels, userProfile.activeOfferId, userProfile.activeOfferEndTime, getSkillBoost]);

  
  const checkForLevelUp = useCallback((currentXp: number, currentLevel: number) => {
    let newLevel = currentLevel;
    let leveledUp = false;
    let skillPointsGained = 0;
    let cashGained = 0;

    while (newLevel < ACTUAL_LEVEL_THRESHOLDS.length && currentXp >= ACTUAL_LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
      leveledUp = true;
      skillPointsGained++;
      cashGained += newLevel * CASH_REWARD_PER_LEVEL;
    }
    
    if (leveledUp) {
      const newTitle = TITLES[newLevel - 1] || TITLES[TITLES.length - 1];
      let description = `You've reached Level ${newLevel}: ${newTitle}!`;
      const rewards = [];
      if (skillPointsGained > 0) rewards.push(`${skillPointsGained} Skill Point(s)`);
      if (cashGained > 0) rewards.push(`$${cashGained.toLocaleString()}`);
      if (rewards.length > 0) description += ` You earned ${rewards.join(' and ')}!`;
      
      toast({ title: "Level Up!", description, icon: <Sparkles/> });
      if (cashGained > 0) addFloatingGain('cash', cashGained);
      return { newLevel, newTitle, leveledUp, skillPointsGained, cashGained };
    }
    
    return { newLevel: currentLevel, newTitle: TITLES[currentLevel -1], leveledUp, skillPointsGained, cashGained };
  }, [toast, addFloatingGain]);

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
    
    return {
        updatedCurrentStreak: currentStudyStreak,
        updatedLongestStreak: longestStudyStreak,
        updatedLastStudyDate: newLastStudyDate
    };
  }, []);

  const addSession = useCallback((sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number; tags?: string[], isFullPomodoroCycle?: boolean, description?: string }) => {
    if (sessionDetails.durationInSeconds <= 0) { console.warn("Attempted to log session with zero duration."); return; }
    const newSession: StudySession = {
      id: crypto.randomUUID(), type: sessionDetails.type, startTime: sessionDetails.startTime,
      endTime: sessionDetails.startTime + sessionDetails.durationInSeconds * 1000, duration: sessionDetails.durationInSeconds,
      tags: sessionDetails.tags || [], isFullPomodoroCycle: sessionDetails.isFullPomodoroCycle || false, description: sessionDetails.description,
    };
    
    let newProfile: UserProfile | null = null;
    setUserProfile(prevProfile => {
        const { updatedCurrentStreak, updatedLongestStreak, updatedLastStudyDate } = updateStreakAndGetBonus(prevProfile);
        let awardedXp = 0, awardedCash = 0;
        const minutesStudied = sessionDetails.durationInSeconds / 60;
        
        if (sessionDetails.type === 'Pomodoro Focus' || sessionDetails.type === 'Stopwatch' || sessionDetails.type === 'Countdown') {
            const baseStreakBonus = Math.min(updatedCurrentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
            const skillXpBonus = getSkillBoost('xp');
            const skillCashBonus = getSkillBoost('cash');
            let offerXpBonus = 0;
            let offerCashBonus = 0;
            let xpDisabledByOffer = false;

            const activeOffer = prevProfile.activeOfferId && prevProfile.activeOfferEndTime && prevProfile.activeOfferEndTime > Date.now()
                ? DAILY_OFFERS_POOL.find(o => o.id === prevProfile.activeOfferId)
                : null;

            if (activeOffer) {
                if (activeOffer.effect.type === 'xp') offerXpBonus = activeOffer.effect.modifier - 1;
                if (activeOffer.effect.type === 'cash') offerCashBonus = activeOffer.effect.modifier - 1;
                if (activeOffer.id === 'high_stakes') xpDisabledByOffer = true;
            }

            const totalXpMultiplier = 1 + baseStreakBonus + skillXpBonus + offerXpBonus;
            const totalCashMultiplier = 1 + baseStreakBonus + skillCashBonus + offerCashBonus;

            awardedXp = Math.floor(minutesStudied * XP_PER_MINUTE_FOCUS * totalXpMultiplier);
            if (xpDisabledByOffer) {
                awardedXp = 0;
            }
            awardedCash = Math.floor((minutesStudied / 5) * CASH_PER_5_MINUTES_FOCUS * totalCashMultiplier);
            
            if(isFeatureUnlocked('challenges')) updateChallengeProgress('studyDurationMinutes', Math.floor(minutesStudied));
        }

        if ( (sessionDetails.type === 'Pomodoro Focus' && sessionDetails.isFullPomodoroCycle) || (sessionDetails.type === 'Stopwatch' && sessionDetails.durationInSeconds >= 25 * 60) ) {
            if(isFeatureUnlocked('challenges')) updateChallengeProgress('focusCycles', 1);
        }

        if (prevProfile.lastStudyDate !== updatedLastStudyDate && isFeatureUnlocked('challenges')) { 
            updateChallengeProgress('studyStreak', 1);
        }
        
        const newXp = Math.max(0, prevProfile.xp + awardedXp);
        const { newLevel, newTitle, leveledUp, skillPointsGained, cashGained } = checkForLevelUp(newXp, prevProfile.level);
        
        const finalCash = prevProfile.cash + awardedCash + cashGained;
        const newSkillPoints = (prevProfile.skillPoints || 0) + skillPointsGained;

        if (awardedXp > 0) addFloatingGain('xp', awardedXp);
        if (awardedCash > 0) addFloatingGain('cash', awardedCash);

        const rewardParts: string[] = [];
        if (awardedXp > 0) rewardParts.push(`${awardedXp} XP`);
        if (awardedCash > 0) rewardParts.push(`$${awardedCash.toLocaleString()}`);
        
        const totalXpBonusPercent = ( (1 + Math.min(updatedCurrentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS) + getSkillBoost('xp')) - 1) * 100;
        if (totalXpBonusPercent > 0.1 && awardedXp > 0) { 
            rewardParts.push(`(+${totalXpBonusPercent.toFixed(0)}% bonus)`);
        }
        
        if (rewardParts.length > 0) {
            toast({ title: "Session Rewards!", description: `Gained: ${rewardParts.join(', ')}`, icon: <Gift /> });
        }
        
        newProfile = {
          ...prevProfile, xp: newXp, cash: finalCash, level: newLevel, title: newTitle,
          currentStreak: updatedCurrentStreak, longestStreak: updatedLongestStreak, lastStudyDate: updatedLastStudyDate,
          skillPoints: newSkillPoints,
        };
        return newProfile;
      });

    setSessions(prevSessions => {
      const updatedSessions = [newSession, ...prevSessions].sort((a, b) => b.startTime - a.startTime);
      sessionsRef.current = updatedSessions;
      if (newProfile) {
        checkAndUnlockAchievements(newProfile, updatedSessions);
      }
      return updatedSessions;
    });
  }, [updateStreakAndGetBonus, getSkillBoost, checkForLevelUp, updateChallengeProgress, addFloatingGain, toast, isFeatureUnlocked, checkAndUnlockAchievements]);
  
  const addManualSession = useCallback((details: { durationInSeconds: number; endTime: number; type: 'Pomodoro Focus' | 'Stopwatch'; description: string; }) => {
    addSession({
      type: details.type,
      startTime: details.endTime - details.durationInSeconds * 1000,
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
    setUserProfile(prev => {
      const newNotepadData = {
        ...(prev.notepadData || DEFAULT_NOTEPAD_DATA),
        ...updatedNotepadData,
      };
      const newProfile = {...prev, notepadData: newNotepadData };
      checkAndUnlockAchievements(newProfile, sessionsRef.current);
      return newProfile;
    });
  }, [checkAndUnlockAchievements]);

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
    
    let habitCompletedForChallenge = false;
    let newHabits: Habit[] = [];
    setUserProfile(prevProfile => {
        if (!prevProfile.notepadData?.habits) return prevProfile;
        
        newHabits = prevProfile.notepadData.habits.map(habit => {
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
        
        return { ...prevProfile, notepadData: { ...(prevProfile.notepadData), habits: newHabits } };
    });
    
    if(habitCompletedForChallenge && isFeatureUnlocked('challenges')){ updateChallengeProgress('habitCompletions', 1); }
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
    
    addFloatingGain('cash', -effectivePrice);
    const newProfile = { ...userProfile, cash: userProfile.cash - effectivePrice, ownedSkinIds: [...userProfile.ownedSkinIds, skinId] };
    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
    toast({ title: "Purchase Successful!", description: `Bought ${skin.name} for $${effectivePrice.toLocaleString()}${shopDiscount > 0 ? ` (with ${(shopDiscount * 100).toFixed(0)}% discount!)` : ''}.`, icon: <ShoppingCart/> });
    return true;
  }, [isFeatureUnlocked, userProfile, getSkinById, isSkinOwned, getAppliedBoost, toast, addFloatingGain, checkAndUnlockAchievements]);

  const equipSkin = useCallback((skinId: string) => {
    if(!isFeatureUnlocked('shop')) { toast({ title: "Shop Locked", description: "Unlock Shop in Skill Tree.", icon: <XCircle/> }); return; }
    if (!isSkinOwned(skinId)) { toast({ title: "Error", description: "You don't own this skin.", variant: "destructive", icon: <XCircle/> }); return; }
    const skinToEquip = getSkinById(skinId);
    if (!skinToEquip) return;
    
    setUserProfile(prev => ({ ...prev, equippedSkinId: skinId }));
    toast({ title: "Skin Equipped!", description: `${skinToEquip.name} is now active.`, icon: <PaletteIcon/> });
  }, [isFeatureUnlocked, isSkinOwned, getSkinById, toast]);

  const selectDailyOffer = useCallback((offerId: string) => {
    if (!isFeatureUnlocked('challenges')) return;
    const offer = dailyOffers.find(o => o.id === offerId);
    const allChallengesDone = dailyChallenges.every(c => c.rewardClaimed);

    if (!offer) return;
     if (userProfile.offerDeactivatedToday) {
        toast({title: "Offer Choice Locked", description: "You have already deactivated an offer today.", variant: 'destructive'});
        return;
    }
    if (userProfile.activeOfferId && !allChallengesDone) {
      toast({title: "Offer In Progress", description: "You already have an active offer. Complete all challenges to select another.", variant: 'destructive'});
      return;
    }
    const endTime = Date.now() + offer.durationMinutes * 60 * 1000;
    setUserProfile(prev => ({...prev, activeOfferId: offerId, activeOfferEndTime: endTime}));
    toast({title: "Offer Activated!", description: `${offer.title} is now active for ${offer.durationMinutes} minutes.`});
  }, [isFeatureUnlocked, dailyOffers, userProfile.activeOfferId, userProfile.offerDeactivatedToday, dailyChallenges, toast]);
  
  const deactivateOffer = useCallback((offerId: string) => {
    if (userProfile.activeOfferId !== offerId) return;
    setUserProfile(prev => ({...prev, activeOfferId: null, activeOfferEndTime: null, offerDeactivatedToday: true}));
    toast({title: "Offer Deactivated", description: "The active offer has been cancelled for the day."});
  }, [userProfile.activeOfferId, toast]);

  const claimChallengeReward = useCallback((challengeId: string) => {
    if(!isFeatureUnlocked('challenges')) return;
    
    let challengeToClaim: DailyChallenge | undefined;
    const updatedChallenges = dailyChallenges.map(challenge => {
        if (challenge.id === challengeId && challenge.isCompleted && !challenge.rewardClaimed) {
            challengeToClaim = challenge;
            return { ...challenge, rewardClaimed: true };
        }
        return challenge;
    });

    if (!challengeToClaim) return;
    
    setDailyChallenges(updatedChallenges);
    
    const { xpReward, cashReward, title } = challengeToClaim;
    
    toast({title: "Challenge Reward!", description: `+${xpReward} XP, +$${cashReward.toLocaleString()} for '${title}'`, icon: <Gift/>});
    addFloatingGain('xp', xpReward);
    addFloatingGain('cash', cashReward);
    
    const allChallengesNowClaimed = updatedChallenges.every(c => c.rewardClaimed);
    let bonusXp = 0;
    let bonusCash = 0;
    
    if (allChallengesNowClaimed) {
        bonusXp = 250;
        bonusCash = 2500;
        toast({title: "All Challenges Complete!", description: `Bonus: +${bonusXp} XP & +$${bonusCash.toLocaleString()}! You can also select another offer.`, icon: <Sparkles/>});
        addFloatingGain('xp', bonusXp);
        addFloatingGain('cash', bonusCash);
    }

    setUserProfile(prevProfile => {
        let xpToAdd = xpReward + bonusXp;
        let cashToAdd = cashReward + bonusCash;
        
        const newXp = Math.max(0, prevProfile.xp + xpToAdd);
        const { newLevel, newTitle, leveledUp, skillPointsGained, cashGained } = checkForLevelUp(newXp, prevProfile.level);
        cashToAdd += cashGained;

        const finalProfile = {
            ...prevProfile,
            xp: newXp,
            cash: prevProfile.cash + cashToAdd,
            completedChallengeIds: [...(prevProfile.completedChallengeIds || []), challengeId],
            ...(leveledUp && {
                level: newLevel,
                title: newTitle,
                skillPoints: (prevProfile.skillPoints || 0) + skillPointsGained
            }),
            ...(allChallengesNowClaimed && {
                activeOfferId: null,
                activeOfferEndTime: null
            })
        };
        
        checkAndUnlockAchievements(finalProfile, sessionsRef.current);
        return finalProfile;
    });

  }, [isFeatureUnlocked, toast, dailyChallenges, checkForLevelUp, addFloatingGain, checkAndUnlockAchievements]);
  
  const getUnlockedAchievements = useCallback((): Achievement[] => ALL_ACHIEVEMENTS.filter(ach => userProfile.unlockedAchievementIds?.includes(ach.id)), [userProfile.unlockedAchievementIds]);

  const getAllSkills = useCallback(() => ALL_SKILLS, []);
  
  const canUnlockSkill = useCallback((skillId: string): { can: boolean, reason?: string } => {
    const skill = ALL_SKILLS.find(s => s.id === skillId);
    if (!skill) return { can: false, reason: "Skill not found."};
    
    if (skill.category !== 'Infinite' && isSkillUnlocked(skillId)) return { can: false, reason: "Already unlocked." };

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
    
    let newUnlockedSkills = userProfile.unlockedSkillIds;
    let newSkillLevels = { ...(userProfile.skillLevels || {}) };

    if(skill.category === 'Infinite') {
        newSkillLevels[skillId] = (newSkillLevels[skillId] || 0) + 1;
    } else {
        if (!newUnlockedSkills.includes(skillId)) {
            newUnlockedSkills = [...newUnlockedSkills, skillId];
        }
    }
    
    const newProfile = {
        ...userProfile,
        skillPoints: userProfile.skillPoints - skill.cost,
        unlockedSkillIds: newUnlockedSkills,
        skillLevels: newSkillLevels,
    };
    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
    toast({ title: skill.category === 'Infinite' ? "Skill Upgraded!" : "Skill Unlocked!", description: `You upgraded: ${skill.name}`, icon: <CheckCircle/>});
    return true;
  }, [canUnlockSkill, toast, userProfile, checkAndUnlockAchievements]);

  const updateSleepWakeTimes = useCallback((wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => {
    updateUserProfile({ wakeUpTime, sleepTime });
    toast({ title: "Preferences Updated", description: "Your wake-up and sleep times have been saved.", icon: <Settings/> });
  }, [updateUserProfile, toast]);
  
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
        
        let durationMs = getDurationForMode(nextMode, prev.settings) * 1000;
        if(userProfile.activeOfferId && userProfile.activeOfferEndTime && userProfile.activeOfferEndTime > Date.now()) {
            const offer = DAILY_OFFERS_POOL.find(o => o.id === userProfile.activeOfferId);
            if(offer?.effect.type === 'timer_speed') {
                durationMs *= offer.effect.modifier;
            }
        }

        return {
            ...prev,
            mode: nextMode,
            cyclesCompleted: newCyclesCompleted,
            sessionStartTime: 0,
            sessionEndTime: Date.now() + durationMs,
            isRunning: false,
        };
    });
  }, [pausePomodoro, getDurationForMode, userProfile.activeOfferId, userProfile.activeOfferEndTime]);

  const startPomodoro = useCallback(() => {
      setPomodoroState(prev => {
        if (prev.isRunning) return prev;
        const now = Date.now();
        const timeRemainingMs = prev.sessionEndTime > now ? prev.sessionEndTime - now : getDurationForMode(prev.mode, prev.settings) * 1000;
        
        return { 
          ...prev, 
          isRunning: true, 
          sessionStartTime: now - ((getDurationForMode(prev.mode, prev.settings) * 1000) - timeRemainingMs),
          sessionEndTime: now + timeRemainingMs
        };
      });
  }, [getDurationForMode]);

  const resetPomodoro = useCallback(() => {
    setPomodoroState(prev => {
      const durationMs = getDurationForMode(prev.mode, prev.settings) * 1000;
      return {
        ...prev,
        isRunning: false,
        sessionStartTime: 0,
        sessionEndTime: Date.now() + durationMs,
      }
    });
  }, [getDurationForMode]);

  const updatePomodoroSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setPomodoroState(prev => {
        const updatedSettings = { ...prev.settings, ...newSettings };
        const durationMs = getDurationForMode(prev.mode, updatedSettings) * 1000;
        return { 
          ...prev, 
          settings: updatedSettings, 
          isRunning: false,
          sessionStartTime: 0,
          sessionEndTime: Date.now() + durationMs
        };
    });
  }, [getDurationForMode]);
  
  const logPomodoroSession = useCallback(() => {
    const { isRunning, sessionStartTime, mode } = pomodoroState;
    if (isRunning || !sessionStartTime) return;

    const elapsedTime = Date.now() - sessionStartTime;
    if (elapsedTime > 1000) { // Log if more than a second passed
      addSession({
        type: mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break',
        startTime: sessionStartTime,
        durationInSeconds: Math.floor(elapsedTime / 1000),
        isFullPomodoroCycle: false
      });
      resetPomodoro();
    }
  }, [pomodoroState, addSession, resetPomodoro]);

  const startStopwatch = useCallback(() => {
    setStopwatchState(prev => {
        if (prev.isRunning) return prev;
        return { ...prev, isRunning: true, sessionStartTime: Date.now() };
    });
  }, []);

  const pauseStopwatch = useCallback(() => {
    setStopwatchState(prev => {
      if (!prev.isRunning || !prev.sessionStartTime) return prev;
      const elapsedSinceStart = Date.now() - prev.sessionStartTime;
      return { 
        ...prev, 
        isRunning: false, 
        timeElapsedOnPause: prev.timeElapsedOnPause + elapsedSinceStart,
        sessionStartTime: null
      };
    });
  }, []);

  const resetStopwatch = useCallback(() => {
    setStopwatchState({ isRunning: false, timeElapsedOnPause: 0, sessionStartTime: null });
  }, []);

  const logStopwatchSession = useCallback(() => {
    pauseStopwatch();
    const finalTimeElapsedMs = stopwatchState.timeElapsedOnPause;
    if (finalTimeElapsedMs > 1000) {
        addSession({ 
          type: 'Stopwatch', 
          startTime: Date.now() - finalTimeElapsedMs, 
          durationInSeconds: Math.floor(finalTimeElapsedMs / 1000) 
        });
        resetStopwatch();
    }
  }, [stopwatchState.timeElapsedOnPause, pauseStopwatch, addSession, resetStopwatch]);

  const setCountdownDuration = useCallback((durationMs: number) => {
    setCountdownState(prev => ({
        ...prev,
        isRunning: false,
        timeLeftOnPause: durationMs,
        initialDuration: durationMs,
        sessionStartTime: null
    }));
  }, []);

  const startCountdown = useCallback(() => {
    setCountdownState(prev => {
        if (prev.isRunning || prev.timeLeftOnPause <= 0) return prev;
        return { ...prev, isRunning: true, sessionStartTime: Date.now() };
    });
  }, []);

  const pauseCountdown = useCallback(() => {
    setCountdownState(prev => {
        if (!prev.isRunning || !prev.sessionStartTime) return prev;
        const elapsedSinceStart = Date.now() - prev.sessionStartTime;
        return {
            ...prev,
            isRunning: false,
            timeLeftOnPause: prev.timeLeftOnPause - elapsedSinceStart,
            sessionStartTime: null
        };
    });
  }, []);

  const resetCountdown = useCallback((newDurationMs?: number) => {
    setCountdownState(prev => ({
        ...prev,
        isRunning: false,
        timeLeftOnPause: newDurationMs ?? prev.initialDuration,
        initialDuration: newDurationMs ?? prev.initialDuration,
        sessionStartTime: null,
    }));
  }, []);
  
  const logCountdownSession = useCallback(() => {
    const { isRunning, initialDuration, timeLeftOnPause, sessionStartTime } = countdownState;
    if (isRunning) return; // Can only log when paused
    
    let timeStudiedMs = initialDuration - timeLeftOnPause;
    
    if(sessionStartTime && !isRunning) {
        // This case shouldn't happen if pause is always called, but as a safeguard.
        timeStudiedMs = initialDuration - (timeLeftOnPause - (Date.now() - sessionStartTime));
    }

    if (timeStudiedMs > 1000) {
        addSession({
            type: 'Countdown',
            startTime: Date.now() - timeStudiedMs,
            durationInSeconds: Math.floor(timeStudiedMs / 1000)
        });
        resetCountdown(initialDuration);
    }
  }, [countdownState, addSession, resetCountdown]);


  const unlockBusiness = useCallback((businessId: keyof UserProfile['businesses']) => {
    if(!isFeatureUnlocked('capitalist')) { toast({ title: "Capitalist Corner Locked", description: "Unlock this feature from the Skill Tree first.", icon: <XCircle/> }); return; }
    
    const business = userProfile.businesses[businessId];
    if(business.unlocked) { toast({ title: "Already Unlocked", description: "You already own this business." }); return; }
    if(userProfile.cash < business.unlockCost) { toast({ title: "Not Enough Cash", description: `You need $${business.unlockCost.toLocaleString()}.`, icon: <DollarSign/> }); return; }
    
    addFloatingGain('cash', -business.unlockCost);
    const newProfile = {
      ...userProfile,
      cash: userProfile.cash - business.unlockCost,
      businesses: { ...userProfile.businesses, [businessId]: { ...business, unlocked: true, lastCollected: Date.now() } }
    };
    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
    toast({ title: "Business Unlocked!", description: `You are now the proud owner of a ${business.name}.`, icon: <CheckCircle/> });

  }, [isFeatureUnlocked, userProfile, toast, addFloatingGain, checkAndUnlockAchievements]);

  const upgradeBusiness = useCallback((businessId: keyof UserProfile['businesses']) => {
    if(!isFeatureUnlocked('capitalist')) return;
    const business = userProfile.businesses[businessId];
    if(!business.unlocked) return;
    const upgradeCost = business.level * 1000 * Math.pow(1.2, business.level);
    if(userProfile.cash < upgradeCost) { toast({ title: "Not Enough Cash", description: `You need $${upgradeCost.toLocaleString()} to upgrade.`, icon: <DollarSign/> }); return; }
    
    let updatedBusiness = { ...business, level: business.level + 1 };
    // For the mine, upgrading should also reset the depletion timer
    if (updatedBusiness.id === 'mine') {
        updatedBusiness.lastCollected = Date.now();
    }
    
    addFloatingGain('cash', -upgradeCost);
    const newProfile = {
      ...userProfile,
      cash: userProfile.cash - upgradeCost,
      businesses: { ...userProfile.businesses, [businessId]: updatedBusiness }
    };
    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
    toast({ title: "Business Upgraded!", description: `${business.name} is now Level ${updatedBusiness.level}.`, icon: <TrendingUp/> });

  }, [isFeatureUnlocked, userProfile, toast, addFloatingGain, checkAndUnlockAchievements]);
  
  const collectBusinessIncome = useCallback((businessId: keyof UserProfile['businesses'], rawAmount: number, secondsPassed: number) => {
    if(!isFeatureUnlocked('capitalist')) return;
    if (rawAmount < 1) return;

    const business = userProfile.businesses[businessId];
    if (!business.unlocked) return;
    
    let finalIncome = rawAmount;
    
    // Apply business-specific gimmicks
    switch(business.id) {
        case 'startup':
            const roll = Math.random();
            if (roll < 0.4) {
                toast({ title: "Bad Luck!", description: `Your ${business.name} had a setback and produced no income this time.`, variant: 'destructive'});
                finalIncome = 0;
            } else if (roll > 0.9) {
                 toast({ title: "Viral Hit!", description: `Your ${business.name} went viral! 5x income bonus!`, icon: <Sparkles/>});
                 finalIncome *= 5;
            }
            break;
        case 'farm':
            if (Math.random() < 0.15) {
                 toast({ title: "Low Yield", description: `Your ${business.name} had a small harvest. 50% income.`, variant: 'destructive'});
                 finalIncome *= 0.5;
            }
            break;
        case 'mine':
            if (business.depletionRate) {
                const hoursPassed = secondsPassed / 3600;
                finalIncome *= Math.pow(1 - business.depletionRate, hoursPassed);
            }
            break;
        case 'industry':
            if (business.maintenanceCost) {
                finalIncome *= (1 - business.maintenanceCost);
            }
            break;
    }

    // Safeguard against negative income and floor the result
    const incomeToCollect = Math.floor(Math.max(0, finalIncome));

    const newBusiness = { ...business, lastCollected: Date.now() };
    const newBusinesses = { ...userProfile.businesses, [businessId]: newBusiness };
    
    if (incomeToCollect > 0) {
        toast({ title: "Income Collected!", description: `You collected $${incomeToCollect.toLocaleString()} from ${business.name}.`, icon: <DollarSign/> });
        addFloatingGain('cash', incomeToCollect);
    }

    setUserProfile(prev => ({ ...prev, cash: prev.cash + incomeToCollect, businesses: newBusinesses }));
  }, [isFeatureUnlocked, userProfile, toast, addFloatingGain]);

  const loadData = useCallback(() => {
    try {
      const storedSessions = localStorage.getItem('studySessions');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions) as StudySession[];
        setSessions(parsedSessions.sort((a, b) => b.startTime - a.startTime));
      }

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
            xp: (tempProfile.xp === undefined || typeof tempProfile.xp !== 'number' || isNaN(tempProfile.xp)) ? 0 : Math.max(0, tempProfile.xp),
            businesses: {...DEFAULT_BUSINESSES, ...(tempProfile.businesses || {})},
            cash: (tempProfile.cash === undefined || typeof tempProfile.cash !== 'number' || isNaN(tempProfile.cash)) ? DEFAULT_USER_PROFILE.cash : tempProfile.cash,
            ownedSkinIds: Array.isArray(tempProfile.ownedSkinIds) ? tempProfile.ownedSkinIds : [...DEFAULT_USER_PROFILE.ownedSkinIds],
            completedChallengeIds: Array.isArray(tempProfile.completedChallengeIds) ? tempProfile.completedChallengeIds : [],
            unlockedAchievementIds: Array.isArray(tempProfile.unlockedAchievementIds) ? tempProfile.unlockedAchievementIds : [],
            notepadData: ensuredNotepadData,
            skillPoints: typeof tempProfile.skillPoints === 'number' ? tempProfile.skillPoints : DEFAULT_USER_PROFILE.skillPoints,
            unlockedSkillIds: Array.isArray(tempProfile.unlockedSkillIds) ? tempProfile.unlockedSkillIds : DEFAULT_USER_PROFILE.unlockedSkillIds,
            skillLevels: tempProfile.skillLevels || {},
            dailyOffers: tempProfile.dailyOffers || { date: '', offers: [] },
            activeOfferId: tempProfile.activeOfferId || null,
            activeOfferEndTime: tempProfile.activeOfferEndTime || null,
            offerDeactivatedToday: tempProfile.offerDeactivatedToday || false,
        };
        
        const coreSkillsToEnsure = ['unlockTimers', 'unlockSkillTree'];
        coreSkillsToEnsure.forEach(coreSkillId => {
            if (!parsedProfile.unlockedSkillIds.includes(coreSkillId)) {
                parsedProfile.unlockedSkillIds.push(coreSkillId);
            }
        });
      }

      const storedPomoSettings = localStorage.getItem('pomodoroSettings');
      if (storedPomoSettings) {
        const settings = JSON.parse(storedPomoSettings);
        setPomodoroState(p => ({...p, settings, sessionEndTime: Date.now() + getDurationForMode(p.mode, settings) * 1000 }));
      } else {
        setPomodoroState(p => ({...p, sessionEndTime: Date.now() + getDurationForMode(p.mode, p.settings) * 1000 }));
      }

      const storedChallenges = localStorage.getItem('dailyChallenges');
      const storedResetDate = localStorage.getItem('lastChallengeResetDate');
      const todayDateString = format(new Date(), 'yyyy-MM-dd');

      if (storedChallenges && storedResetDate === todayDateString) {
        setDailyChallenges(JSON.parse(storedChallenges));
        setLastChallengeResetDate(todayDateString);
      } else {
        const numChallenges = parsedProfile.level >= 50 ? 6 : 3;
        const tempIsFeatureUnlocked = (featureKey: FeatureKey) => {
            const skill = ALL_SKILLS.find(s => s.unlocksFeature === featureKey);
            return !skill || parsedProfile.unlockedSkillIds.includes(skill.id);
        };

        const availableChallenges = INITIAL_DAILY_CHALLENGES_POOL.filter(challenge => {
            switch(challenge.type) {
                case 'tasksCompleted': return tempIsFeatureUnlocked('notepadChecklist');
                case 'ambianceUsage': return tempIsFeatureUnlocked('ambiance');
                case 'notepadEntry': return tempIsFeatureUnlocked('notepadNotes') || tempIsFeatureUnlocked('notepadRevision');
                case 'habitCompletions': return tempIsFeatureUnlocked('notepadHabits');
                default: return true;
            }
        });
        const shuffledChallenges = [...availableChallenges].sort(() => 0.5 - Math.random());
        const freshChallenges = shuffledChallenges.slice(0, numChallenges).map(ch => ({...ch, currentValue: 0, isCompleted: false, rewardClaimed: false}));
        setDailyChallenges(freshChallenges);
        setLastChallengeResetDate(todayDateString);
        localStorage.setItem('dailyChallenges', JSON.stringify(freshChallenges));
        localStorage.setItem('lastChallengeResetDate', todayDateString);
      }
      
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      if (parsedProfile.dailyOffers?.date !== todayStr) {
          const shuffledOffers = [...DAILY_OFFERS_POOL].sort(() => 0.5 - Math.random());
          const newOffers = shuffledOffers.slice(0, 3);
          setDailyOffers(newOffers);
          parsedProfile.dailyOffers = { date: todayStr, offers: newOffers };
          parsedProfile.activeOfferId = null;
          parsedProfile.activeOfferEndTime = null;
          parsedProfile.offerDeactivatedToday = false;
      } else {
          setDailyOffers(parsedProfile.dailyOffers.offers);
      }
      
      setUserProfile(parsedProfile);

    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setUserProfile(DEFAULT_USER_PROFILE); 
      const freshChallenges = INITIAL_DAILY_CHALLENGES_POOL.slice(0,3).map(ch => ({...ch, currentValue: 0, isCompleted: false, rewardClaimed: false}));
      setDailyChallenges(freshChallenges);
      setLastChallengeResetDate(format(new Date(), 'yyyy-MM-dd'));
    } finally {
        setIsLoaded(true);
    }
  }, [getDurationForMode]);

  useEffect(() => { loadData(); }, [loadData]);
  
  const pomodoroStateRef = useRef(pomodoroState);
  pomodoroStateRef.current = pomodoroState;
  const addSessionRef = useRef(addSession);
  addSessionRef.current = addSession;
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const switchPomodoroModeRef = useRef(switchPomodoroMode);
  switchPomodoroModeRef.current = switchPomodoroMode;
  const getDurationForModeRef = useRef(getDurationForMode);
  getDurationForModeRef.current = getDurationForMode;
  
  useEffect(() => {
    if (!isLoaded) return;
    const timerWorker = () => {
      const currentPomodoroState = pomodoroStateRef.current;
      if (currentPomodoroState.isRunning && Date.now() >= currentPomodoroState.sessionEndTime) {
        const sessionType: StudySession['type'] = currentPomodoroState.mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break';
        const duration = getDurationForModeRef.current(currentPomodoroState.mode, currentPomodoroState.settings);
        addSessionRef.current({ type: sessionType, startTime: currentPomodoroState.sessionStartTime, durationInSeconds: duration, isFullPomodoroCycle: currentPomodoroState.mode === 'work' });
        toastRef.current({ title: `Time's up!`, description: `Your ${currentPomodoroState.mode} session has ended.` });
        switchPomodoroModeRef.current(); 
      }
    };
    
    const intervalId = setInterval(timerWorker, 1000);
    return () => clearInterval(intervalId);
  }, [isLoaded]);

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

  const applyThemePreference = useCallback((skinId: string | null) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;

    // More robustly find and remove all possible theme classes first
    const allThemeClasses = PREDEFINED_SKINS
      .map(s => s.isTheme ? s.themeClass : null)
      .filter((c): c is string => !!c && c !== 'classic');
      
    root.classList.remove(...allThemeClasses);

    // Find the skin to apply
    const skinToApply = PREDEFINED_SKINS.find(s => s.id === skinId);

    // Add the new theme class if it's not the default 'classic'
    if (skinToApply && skinToApply.isTheme && skinToApply.themeClass && skinToApply.themeClass !== 'classic') {
      root.classList.add(skinToApply.themeClass);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroState.settings));
        localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
        if (lastChallengeResetDate) localStorage.setItem('lastChallengeResetDate', lastChallengeResetDate);
      } catch (error) { console.error("Failed to save data to localStorage:", error); }
    }
  }, [sessions, userProfile, pomodoroState.settings, dailyChallenges, lastChallengeResetDate, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
        applyThemePreference(userProfile.equippedSkinId);
    }
  }, [userProfile.equippedSkinId, isLoaded, applyThemePreference]);

  const contextValue = useMemo(() => ({
      sessions, addSession, deleteSession, addTestSession, clearSessions, updateSessionDescription, addManualSession,
      userProfile, updateUserProfile, updateSleepWakeTimes, updateNotepadData,
      pomodoroState, startPomodoro, pausePomodoro, resetPomodoro, switchPomodoroMode, updatePomodoroSettings, logPomodoroSession,
      stopwatchState, startStopwatch, pauseStopwatch, resetStopwatch, logStopwatchSession,
      countdownState, startCountdown, pauseCountdown, resetCountdown, setCountdownDuration, logCountdownSession,
      addNotepadNote, updateNotepadNote, deleteNotepadNote,
      addRevisionConcept, markConceptRevised, deleteRevisionConcept,
      addHabit, updateHabit, deleteHabit, logHabitCompletion, getHabitCompletionForDate, getHabitCompletionsForWeek,
      addNotepadCountdownEvent, updateNotepadCountdownEvent, deleteNotepadCountdownEvent, updateNotepadEisenhowerMatrix,
      unlockBusiness, upgradeBusiness, collectBusinessIncome,
      getSkinById, buySkin, equipSkin, isSkinOwned,
      dailyOffers, selectDailyOffer, deactivateOffer,
      dailyChallenges, claimChallengeReward, updateChallengeProgress,
      getUnlockedAchievements, 
      isLoaded,
      getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill, isFeatureUnlocked, getAppliedBoost, getSkillBoost, refundAllSkillPoints,
      floatingGains,
  }), [
      sessions, addSession, deleteSession, addTestSession, clearSessions, updateSessionDescription, addManualSession,
      userProfile, updateUserProfile, updateSleepWakeTimes, updateNotepadData,
      pomodoroState, startPomodoro, pausePomodoro, resetPomodoro, switchPomodoroMode, updatePomodoroSettings, logPomodoroSession,
      stopwatchState, startStopwatch, pauseStopwatch, resetStopwatch, logStopwatchSession,
      countdownState, startCountdown, pauseCountdown, resetCountdown, setCountdownDuration, logCountdownSession,
      addNotepadNote, updateNotepadNote, deleteNotepadNote,
      addRevisionConcept, markConceptRevised, deleteRevisionConcept,
      addHabit, updateHabit, deleteHabit, logHabitCompletion, getHabitCompletionForDate, getHabitCompletionsForWeek,
      addNotepadCountdownEvent, updateNotepadCountdownEvent, deleteNotepadCountdownEvent, updateNotepadEisenhowerMatrix,
      unlockBusiness, upgradeBusiness, collectBusinessIncome,
      getSkinById, buySkin, equipSkin, isSkinOwned,
      dailyOffers, selectDailyOffer, deactivateOffer,
      dailyChallenges, claimChallengeReward, updateChallengeProgress,
      getUnlockedAchievements, 
      isLoaded,
      getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill, isFeatureUnlocked, getAppliedBoost, getSkillBoost, refundAllSkillPoints,
      floatingGains,
  ]);

  if (!isLoaded) { return null; }

  return (
    <SessionContext.Provider value={contextValue}>
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
