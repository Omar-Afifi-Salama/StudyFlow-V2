
"use client";

import type { StudySession, UserProfile, Skin, NotepadTask, NotepadNote, NotepadGoal, NotepadLink, NotepadData, DailyChallenge, Achievement, RevisionConcept, Habit, HabitFrequency, HabitLogEntry, NotepadCountdownEvent, Skill, FeatureKey, FloatingGain, PomodoroState, StopwatchState, CountdownState, PomodoroMode, PomodoroSettings, DailyOffer, Business, Bond, UtilityItem, UtilityCategory } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Zap, ShoppingCart, ShieldCheck, CalendarCheck, Award, Clock, BarChart, Coffee, Timer, TrendingUp, Brain, Gift, Star, DollarSign, Activity, AlignLeft, Link2, CheckSquare, Trophy, TrendingDown, Sigma, Moon, Sun, Palette, Package, Briefcase, Target as TargetIcon, Edit, Repeat, ListChecks as HabitIcon, CalendarClock, BarChart3, Wind, NotebookText, Settings, Lightbulb, HelpCircle, Network, Settings2, Grid, CheckSquare2, StickyNote, Target, Link as LinkLucide, Sparkles, XCircle, Save, Trash2, CheckCircle, Percent, RepeatIcon, PaletteIcon, MoreVertical, ChevronDown, Gem, Flame, Shuffle, BrainCircuit, Rocket, Eye, Layers, Smartphone, Sunrise, Feather, Library, CalendarHeart, CalendarCheck2, Building2, HandCoins, FileText, Archive, CalendarPlus, Signal, Shirt, Headphones, RotateCcw, Crown, Landmark, Skull, FlaskConical } from 'lucide-react';
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

const generateLevelThresholds = () => {
    const thresholds = [0];
    let cumulativeXp = 0;
    for (let level = 1; level < 100; level++) {
        const minutesForNextLevel = (level - 1) * 5 + 25;
        const xpForNextLevel = minutesForNextLevel * XP_PER_MINUTE_FOCUS;
        cumulativeXp += xpForNextLevel;
        thresholds.push(cumulativeXp);
    }
    return thresholds;
};
export const ACTUAL_LEVEL_THRESHOLDS = generateLevelThresholds();


export const PREDEFINED_SKINS: Skin[] = [
  // --- Original Light Themes ---
  { id: 'classic', name: 'Classic Blue', description: 'The default, calming blue theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/E5F1FC/0A2540?text=Classic+Blue', dataAiHint: 'classic blue', isTheme: true, isLightTheme: true, themeClass: 'classic' },
  { id: 'sepia_tone', name: 'Sepia Tone', description: 'A warm, vintage theme for focused nostalgia.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/c0a080/4a3f30?text=Sepia+Tone', dataAiHint: 'sepia tone', isTheme: true, isLightTheme: true, themeClass: 'sepia' },
  { id: 'theme-solarpunk', name: 'Solarpunk', description: 'Lush greens and gold for an optimistic future.', price: 20000, levelRequirement: 10, imageUrl: 'https://placehold.co/400x225/fefce8/16a34a?text=Solarpunk', dataAiHint: 'solarpunk city', isTheme: true, isLightTheme: true, themeClass: 'theme-solarpunk' },
  { id: 'theme-minty-fresh', name: 'Minty Fresh', description: 'A clean and refreshing mint green theme.', price: 25000, levelRequirement: 12, imageUrl: 'https://placehold.co/400x225/f0fdf4/22c55e?text=Minty+Fresh', dataAiHint: 'mint leaf', isTheme: true, isLightTheme: true, themeClass: 'theme-minty-fresh' },
  { id: 'theme-sakura-season', name: 'Sakura Season', description: 'Soft pinks inspired by cherry blossoms.', price: 25000, levelRequirement: 12, imageUrl: 'https://placehold.co/400x225/fff5f7/ec4899?text=Sakura+Season', dataAiHint: 'cherry blossom', isTheme: true, isLightTheme: true, themeClass: 'theme-sakura-season' },
  { id: 'theme-desert-mirage', name: 'Desert Mirage', description: 'Warm oranges and sandy tones.', price: 45000, levelRequirement: 18, imageUrl: 'https://placehold.co/400x225/fffbeb/f97316?text=Desert+Mirage', dataAiHint: 'desert sunset', isTheme: true, isLightTheme: true, themeClass: 'theme-desert-mirage' },
  { id: 'theme-arctic-dawn', name: 'Arctic Dawn', description: 'Cool blues and purples of a polar sunrise.', price: 45000, levelRequirement: 18, imageUrl: 'https://placehold.co/400x225/ecfeff/06b6d4?text=Arctic+Dawn', dataAiHint: 'arctic sunrise', isTheme: true, isLightTheme: true, themeClass: 'theme-arctic-dawn' },
  { id: 'theme-lavender-haze', name: 'Lavender Haze', description: 'A dreamy and calming lavender theme.', price: 55000, levelRequirement: 22, imageUrl: 'https://placehold.co/400x225/f5f3ff/8b5cf6?text=Lavender+Haze', dataAiHint: 'lavender field', isTheme: true, isLightTheme: true, themeClass: 'theme-lavender-haze' },
  { id: 'theme-steampunk', name: 'Steampunk', description: 'Browns, brass, and verdigris for a mechanical feel.', price: 80000, levelRequirement: 32, imageUrl: 'https://placehold.co/400x225/4d3d30/c89b3c?text=Steampunk', dataAiHint: 'steampunk gears', isTheme: true, isLightTheme: true, themeClass: 'theme-steampunk' },
  { id: 'theme-monochrome', name: 'Monochrome', description: 'A minimalist black and white theme.', price: 65000, levelRequirement: 25, imageUrl: 'https://placehold.co/400x225/ffffff/525252?text=Monochrome', dataAiHint: 'black white', isTheme: true, isLightTheme: true, themeClass: 'theme-monochrome' },
  // --- New Light Themes ---
  { id: 'theme-peachy-keen', name: 'Peachy Keen', description: 'A soft and inviting peachy theme.', price: 30000, levelRequirement: 14, imageUrl: 'https://placehold.co/400x225/ffedd5/fb923c?text=Peachy+Keen', dataAiHint: 'peach fruit', isTheme: true, isLightTheme: true, themeClass: 'theme-peachy-keen' },
  { id: 'theme-cotton-candy', name: 'Cotton Candy', description: 'A sweet and playful pink and blue theme.', price: 35000, levelRequirement: 16, imageUrl: 'https://placehold.co/400x225/fce7f3/60a5fa?text=Cotton+Candy', dataAiHint: 'candy floss', isTheme: true, isLightTheme: true, themeClass: 'theme-cotton-candy' },
  { id: 'theme-goldenrod', name: 'Goldenrod', description: 'A vibrant and cheerful yellow theme.', price: 40000, levelRequirement: 18, imageUrl: 'https://placehold.co/400x225/fef9c3/facc15?text=Goldenrod', dataAiHint: 'yellow flower', isTheme: true, isLightTheme: true, themeClass: 'theme-goldenrod' },
  { id: 'theme-sky-blue', name: 'Sky Blue', description: 'A calm and open sky blue theme.', price: 40000, levelRequirement: 18, imageUrl: 'https://placehold.co/400x225/e0f2fe/38bdf8?text=Sky+Blue', dataAiHint: 'blue sky', isTheme: true, isLightTheme: true, themeClass: 'theme-sky-blue' },
  { id: 'theme-stone-grove', name: 'Stone Grove', description: 'An earthy, natural stone and green theme.', price: 50000, levelRequirement: 20, imageUrl: 'https://placehold.co/400x225/f5f5f4/44403c?text=Stone+Grove', dataAiHint: 'stone zen', isTheme: true, isLightTheme: true, themeClass: 'theme-stone-grove' },
  { id: 'theme-coral-reef', name: 'Coral Reef', description: 'Vibrant corals and aqua blues.', price: 60000, levelRequirement: 24, imageUrl: 'https://placehold.co/400x225/ecfeff/ff7f50?text=Coral+Reef', dataAiHint: 'coral reef', isTheme: true, isLightTheme: true, themeClass: 'theme-coral-reef' },
  { id: 'theme-sagebrush', name: 'Sagebrush', description: 'A muted, calming green and beige theme.', price: 55000, levelRequirement: 22, imageUrl: 'https://placehold.co/400x225/f0fdf4/86a383?text=Sagebrush', dataAiHint: 'sage plant', isTheme: true, isLightTheme: true, themeClass: 'theme-sagebrush' },
  { id: 'theme-rosewater', name: 'Rosewater', description: 'A delicate and elegant light rose theme.', price: 65000, levelRequirement: 26, imageUrl: 'https://placehold.co/400x225/fff1f2/fda4af?text=Rosewater', dataAiHint: 'rose petal', isTheme: true, isLightTheme: true, themeClass: 'theme-rosewater' },
  { id: 'theme-spring-meadow', name: 'Spring Meadow', description: 'Fresh greens and soft floral pastels.', price: 70000, levelRequirement: 28, imageUrl: 'https://placehold.co/400x225/f0fdf4/a3e635?text=Spring+Meadow', dataAiHint: 'spring meadow', isTheme: true, isLightTheme: true, themeClass: 'theme-spring-meadow' },
  { id: 'theme-parchment', name: 'Parchment', description: 'An old-world theme of aged paper and ink.', price: 75000, levelRequirement: 30, imageUrl: 'https://placehold.co/400x225/fdf6e3/654321?text=Parchment', dataAiHint: 'old paper', isTheme: true, isLightTheme: true, themeClass: 'theme-parchment' },

  // --- Original Dark Themes ---
  { id: 'dark_mode', name: 'Dark Mode', description: 'A sleek dark theme for night owls.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/400x225/2d3748/e2e8f0?text=Dark+Mode', dataAiHint: 'dark theme', isTheme: true, isLightTheme: false, themeClass: 'dark' },
  { id: 'theme-oceanic', name: 'Oceanic', description: 'Deep blues and teals for calm concentration.', price: 20000, levelRequirement: 10, imageUrl: 'https://placehold.co/400x225/083344/2dd4bf?text=Oceanic', dataAiHint: 'ocean deep', isTheme: true, isLightTheme: false, themeClass: 'theme-oceanic' },
  { id: 'theme-cyberpunk', name: 'Cyberpunk', description: 'Neon-drenched streets for late-night focus.', price: 50000, levelRequirement: 20, imageUrl: 'https://placehold.co/400x225/0a0a0a/f400a1?text=Cyberpunk', dataAiHint: 'cyberpunk city', isTheme: true, isLightTheme: false, themeClass: 'theme-cyberpunk' },
  { id: 'theme-volcanic-ash', name: 'Volcanic Ash', description: 'A dark theme with fiery orange highlights.', price: 75000, levelRequirement: 30, imageUrl: 'https://placehold.co/400x225/262626/ea580c?text=Volcanic+Ash', dataAiHint: 'volcano lava', isTheme: true, isLightTheme: false, themeClass: 'theme-volcanic-ash' },
  { id: 'theme-emerald-grove', name: 'Emerald Grove', description: 'A rich, dark theme with deep green tones.', price: 70000, levelRequirement: 28, imageUrl: 'https://placehold.co/400x225/1c2a2b/10b981?text=Emerald+Grove', dataAiHint: 'enchanted forest', isTheme: true, isLightTheme: false, themeClass: 'theme-emerald-grove' },
  { id: 'theme-crimson-peak', name: 'Crimson Peak', description: 'A dark theme with stark crimson accents.', price: 100000, levelRequirement: 40, imageUrl: 'https://placehold.co/400x225/1a1a1a/dc2626?text=Crimson+Peak', dataAiHint: 'red mountain', isTheme: true, isLightTheme: false, themeClass: 'theme-crimson-peak' },
  { id: 'theme-sapphire-depths', name: 'Sapphire Depths', description: 'A deep, dark blue theme with sapphire highlights.', price: 100000, levelRequirement: 40, imageUrl: 'https://placehold.co/400x225/1e293b/3b82f6?text=Sapphire+Depths', dataAiHint: 'blue crystal', isTheme: true, isLightTheme: false, themeClass: 'theme-sapphire-depths' },
  { id: 'theme-8-bit-arcade', name: '8-Bit Arcade', description: 'A retro theme with pixel-perfect colors.', price: 120000, levelRequirement: 45, imageUrl: 'https://placehold.co/400x225/1a1b26/00ffff?text=8-Bit+Arcade', dataAiHint: 'pixel art', isTheme: true, isLightTheme: false, themeClass: 'theme-8-bit-arcade' },
  { id: 'theme-nord', name: 'Nord', description: 'A popular, cool-toned dark theme for developers.', price: 150000, levelRequirement: 50, imageUrl: 'https://placehold.co/400x225/2e3440/88c0d0?text=Nord', dataAiHint: 'nordic fjord', isTheme: true, isLightTheme: false, themeClass: 'theme-nord' },
  { id: 'theme-dracula', name: 'Dracula', description: 'Another iconic dark theme with vibrant colors.', price: 150000, levelRequirement: 50, imageUrl: 'https://placehold.co/400x225/282a36/ff79c6?text=Dracula', dataAiHint: 'vampire castle', isTheme: true, isLightTheme: false, themeClass: 'theme-dracula' },
  // --- New Dark Themes ---
  { id: 'theme-midnight-hacker', name: 'Midnight Hacker', description: 'Classic green-on-black terminal style.', price: 30000, levelRequirement: 14, imageUrl: 'https://placehold.co/400x225/0d0d0d/39ff14?text=Midnight+Hacker', dataAiHint: 'hacker code', isTheme: true, isLightTheme: false, themeClass: 'theme-midnight-hacker' },
  { id: 'theme-royal-purple', name: 'Royal Purple', description: 'A dark theme with regal purple and gold accents.', price: 35000, levelRequirement: 16, imageUrl: 'https://placehold.co/400x225/2c1f3d/d4af37?text=Royal+Purple', dataAiHint: 'royal crown', isTheme: true, isLightTheme: false, themeClass: 'theme-royal-purple' },
  { id: 'theme-vampire-gothic', name: 'Vampire Gothic', description: 'A gothic theme with deep reds and grays.', price: 40000, levelRequirement: 18, imageUrl: 'https://placehold.co/400x225/1a1a1a/8b0000?text=Vampire+Gothic', dataAiHint: 'gothic castle', isTheme: true, isLightTheme: false, themeClass: 'theme-vampire-gothic' },
  { id: 'theme-toxic-waste', name: 'Toxic Waste', description: 'A dark theme with vibrant, toxic greens.', price: 40000, levelRequirement: 18, imageUrl: 'https://placehold.co/400x225/1f2922/adff2f?text=Toxic+Waste', dataAiHint: 'toxic waste', isTheme: true, isLightTheme: false, themeClass: 'theme-toxic-waste' },
  { id: 'theme-synthwave-sunset', name: 'Synthwave Sunset', description: 'An 80s-inspired theme with sunset gradients.', price: 50000, levelRequirement: 20, imageUrl: 'https://placehold.co/400x225/2c003e/ff6ac1?text=Synthwave+Sunset', dataAiHint: 'synthwave sunset', isTheme: true, isLightTheme: false, themeClass: 'theme-synthwave-sunset' },
  { id: 'theme-starlight', name: 'Starlight', description: 'A deep space theme with twinkling star highlights.', price: 60000, levelRequirement: 24, imageUrl: 'https://placehold.co/400x225/0c0a24/f0f8ff?text=Starlight', dataAiHint: 'starry night', isTheme: true, isLightTheme: false, themeClass: 'theme-starlight' },
  { id: 'theme-retro-orange', name: 'Retro Orange', description: 'A 70s-inspired theme with warm oranges and browns.', price: 55000, levelRequirement: 22, imageUrl: 'https://placehold.co/400x225/3d2c21/f08a4b?text=Retro+Orange', dataAiHint: 'retro pattern', isTheme: true, isLightTheme: false, themeClass: 'theme-retro-orange' },
  { id: 'theme-inferno', name: 'Inferno', description: 'A fiery theme of burning embers and charcoal.', price: 65000, levelRequirement: 26, imageUrl: 'https://placehold.co/400x225/210707/ff4500?text=Inferno', dataAiHint: 'fire flames', isTheme: true, isLightTheme: false, themeClass: 'theme-inferno' },
  { id: 'theme-deep-forest', name: 'Deep Forest', description: 'Earthy browns and deep greens of a forest at night.', price: 70000, levelRequirement: 28, imageUrl: 'https://placehold.co/400x225/1a2421/a3b18a?text=Deep+Forest', dataAiHint: 'dark forest', isTheme: true, isLightTheme: false, themeClass: 'theme-deep-forest' },
  { id: 'theme-matrix-rain', name: 'Matrix Rain', description: 'A dark theme with cascading green code.', price: 75000, levelRequirement: 30, imageUrl: 'https://placehold.co/400x225/000000/00ff00?text=Matrix+Rain', dataAiHint: 'matrix code', isTheme: true, isLightTheme: false, themeClass: 'theme-matrix-rain' },
];

export const UTILITY_ITEMS: UtilityItem[] = [
  // XP Boosters
  { id: 'xp_boost_small', name: 'Small XP Canister', description: 'Instantly gain 1,200 XP.', price: 10000, priceType: 'cash', levelRequirement: 5, effect: { type: 'xp', amount: 1200 }, iconName: 'Zap', isConsumable: true, cooldownSeconds: 3600, category: 'XP Boost' },
  { id: 'xp_boost_medium', name: 'Medium XP Canister', description: 'Instantly gain 6,000 XP.', price: 45000, priceType: 'cash', levelRequirement: 15, effect: { type: 'xp', amount: 6000 }, iconName: 'Zap', isConsumable: true, cooldownSeconds: 3600 * 2, category: 'XP Boost' },
  { id: 'xp_boost_large', name: 'Large XP Canister', description: 'Instantly gain 15,000 XP.', price: 100000, priceType: 'cash', levelRequirement: 25, effect: { type: 'xp', amount: 15000 }, iconName: 'Zap', isConsumable: true, cooldownSeconds: 3600 * 4, category: 'XP Boost' },
  { id: 'xp_boost_huge', name: 'Huge XP Canister', description: 'Instantly gain 40,000 XP.', price: 250000, priceType: 'cash', levelRequirement: 40, effect: { type: 'xp', amount: 40000 }, iconName: 'Zap', isConsumable: true, cooldownSeconds: 3600 * 8, category: 'XP Boost' },
  { id: 'focus_potion', name: 'Focus Potion', description: 'Grants the rewards of one 25-minute focus session.', price: 15000, priceType: 'cash', levelRequirement: 12, effect: { type: 'special_focus_potion' }, iconName: 'FlaskConical', isConsumable: true, cooldownSeconds: 3600 * 6, category: 'XP Boost' },

  // Currency Exchange
  { id: 'xp_from_sp_small', name: 'Knowledge Shard', description: 'Convert 1 SP into 5,000 XP.', price: 1, priceType: 'sp', levelRequirement: 8, effect: { type: 'xp', amount: 5000 }, iconName: 'BrainCircuit', isConsumable: true, cooldownSeconds: 1800, category: 'Currency Exchange' },
  { id: 'xp_from_sp_medium', name: 'Knowledge Crystal', description: 'Convert 3 SP into 20,000 XP.', price: 3, priceType: 'sp', levelRequirement: 18, effect: { type: 'xp', amount: 20000 }, iconName: 'BrainCircuit', isConsumable: true, cooldownSeconds: 3600, category: 'Currency Exchange' },
  { id: 'skill_point_pack', name: 'Mind Expansion', description: 'Buy 3 Skill Points for $100,000.', price: 100000, priceType: 'cash', levelRequirement: 20, effect: { type: 'sp', amount: 3 }, iconName: 'Gem', isConsumable: true, cooldownSeconds: 86400, category: 'Currency Exchange' },
  { id: 'skill_point_pack_large', name: 'Cerebral Boost', description: 'Buy 5 Skill Points for $180,000.', price: 180000, priceType: 'cash', levelRequirement: 30, effect: { type: 'sp', amount: 5 }, iconName: 'Gem', isConsumable: true, cooldownSeconds: 86400 * 2, category: 'Currency Exchange' },
  { id: 'cash_injection_small', name: 'Small Loan', description: 'Convert 2 SP into $20,000 cash.', price: 2, priceType: 'sp', levelRequirement: 10, effect: { type: 'cash', amount: 20000 }, iconName: 'HandCoins', isConsumable: true, cooldownSeconds: 3600 * 2, category: 'Currency Exchange' },
  { id: 'cash_injection_medium', name: 'Investor Cheque', description: 'Convert 5 SP into $75,000 cash.', price: 5, priceType: 'sp', levelRequirement: 22, effect: { type: 'cash', amount: 75000 }, iconName: 'HandCoins', isConsumable: true, cooldownSeconds: 3600 * 4, category: 'Currency Exchange' },

  // Permanent Unlocks
  { id: 'sound_pack_premium', name: 'Premium Sound Pack', description: 'Unlock 4 additional high-quality ambient sounds.', price: 50000, priceType: 'cash', levelRequirement: 10, effect: { type: 'unlock_feature', featureKey: 'premiumSounds' }, iconName: 'Headphones', isConsumable: false, category: 'Permanent Unlocks' },
];

export const DEFAULT_NOTEPAD_DATA: NotepadData = {
  tasks: [], notes: [], goals: [], links: [], revisionConcepts: [], habits: [], countdownEvents: [],
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
    { id: 'xp_boost_cash_cut', title: 'Intense Focus', description: 'Gain more XP, but earn less cash.', positiveEffect: { type: 'xp', modifier: 1.25, description: '+25% XP Gain' }, negativeEffect: { type: 'cash', modifier: 0.75, description: '-25% Cash Gain' }, effectType: 'xp_gain', positiveDescription: '+25% XP Gain', negativeDescription: '-25% Cash Gain' },
    { id: 'cash_boost_xp_cut', title: 'Lucrative Grind', description: 'Earn much more cash, but learn less.', positiveEffect: { type: 'cash', modifier: 1.50, description: '+50% Cash Gain' }, negativeEffect: { type: 'xp', modifier: 0.50, description: '-50% XP Gain' }, effectType: 'cash_gain', positiveDescription: '+50% Cash Gain', negativeDescription: '-50% XP Gain' },
    { id: 'risky_bet', title: 'All or Nothing', description: 'A huge XP boost, but capitalist income is halved.', positiveEffect: { type: 'xp', modifier: 1.50, description: '+50% XP Gain' }, negativeEffect: { type: 'risk', modifier: 0.5, description: '-50% Capitalist Income' }, effectType: 'capitalist_income', positiveDescription: '+50% XP Gain', negativeDescription: '-50% Capitalist Income' },
    { id: 'efficient_work', title: 'Efficient Cycles', description: 'Pomodoro focus is shorter, but so are the breaks.', positiveEffect: { type: 'timer_speed', modifier: 0.85, description: '15% shorter Focus time' }, negativeEffect: { type: 'timer_speed', modifier: 1.20, description: '20% longer Break time' }, effectType: 'timer_efficiency', positiveDescription: '15% shorter Focus time', negativeDescription: '20% longer Break time' },
    { id: 'slow_and_steady', title: 'Slow and Steady', description: 'Slightly less XP, but gain a protective cash bonus.', positiveEffect: { type: 'cash', modifier: 1.10, description: '+10% Cash Gain' }, negativeEffect: { type: 'xp', modifier: 0.90, description: '-10% XP Gain' }, effectType: 'xp_gain', positiveDescription: '+10% Cash Gain', negativeDescription: '-10% XP Gain' },
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
  ownedUtilityItemIds: [], utilityItemCooldowns: {}, ownedSoundIds: [],
  completedChallengeIds: [], currentStreak: 0, longestStreak: 0, lastStudyDate: null,
  wakeUpTime: { hour: 8, period: 'AM' }, sleepTime: { hour: 10, period: 'PM' },
  unlockedAchievementIds: [], lastLoginDate: null, dailyLoginStreak: 0,
  notepadData: DEFAULT_NOTEPAD_DATA, skillPoints: 0, unlockedSkillIds: ['unlockTimers', 'unlockSkillTree'], skillLevels: {},
  businesses: DEFAULT_BUSINESSES,
  dailyOffers: [], activeOfferId: null,
  manualLogTimeToday: { date: '', duration: 0 },
  infamyLevel: 0,
  infamyPoints: 0,
  unlockedInfamySkillIds: [],
  hardResetRequestTime: null,
  bonds: [],
  lastBondGenerationTime: 0,
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
    { id: 'capitalist_income_1k', title: 'Budding Entrepreneur', description: 'Earn $1,000 from the Capitalist Corner.', xpReward: 100, cashReward: 1000, targetValue: 1000, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'capitalistIncome', resetsDaily: true },
    { id: 'skill_unlock_1', title: 'Skill Seeker', description: 'Unlock a new skill from the Skill Tree.', xpReward: 50, cashReward: 500, targetValue: 1, currentValue: 0, isCompleted: false, rewardClaimed: false, type: 'skillUnlocks', resetsDaily: true },
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
  { id: 'notepadMaster', name: 'Notepad Master', description: 'Unlock all Notepad-related skills.', iconName: 'NotebookText', cashReward: 10000, criteria: (p) => ['unlockNotepadChecklist', 'unlockNotepadNotes', 'unlockNotepadGoals', 'unlockNotepadLinks', 'unlockNotepadRevision', 'unlockNotepadHabits', 'unlockNotepadEvents', 'unlockNotepadEisenhower'].every(sk => p.unlockedSkillIds.includes(sk)), category: 'Notepad & Revision'},

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
  { id: 'businessTycoon', name: 'Business Tycoon', description: 'Get one business to Level 10.', iconName: 'Building2', cashReward: 10000, criteria: (p) => Object.values(p.businesses).some(b => b.level >= 10), category: 'Capitalist' },
  { id: 'mogul', name: 'Mogul', description: 'Have a combined level of 40 across all businesses.', iconName: 'Landmark', cashReward: 25000, criteria: (p) => Object.values(p.businesses).reduce((sum, b) => sum + b.level, 0) >= 40, category: 'Capitalist' },
  { id: 'millionaireClub', name: 'Millionaire Club', description: 'Hold over $1,000,000 cash at one time.', iconName: 'Landmark', cashReward: 10000, criteria: (p) => p.cash >= 1000000, category: 'Capitalist' },
  { id: 'passivePowerhouse', name: 'Passive Powerhouse', description: 'Have a combined passive income of over $20,000 per hour.', iconName: 'DollarSign', cashReward: 20000, criteria: (p) => Object.values(p.businesses).reduce((total, business) => { if (business.unlocked) { const income = business.baseIncome * Math.pow(1.15, business.level - 1) * (1 - (business.maintenanceCost || 0)); return total + income; } return total; }, 0) >= 20000, category: 'Capitalist' },
  { id: 'businessMagnate', name: 'Business Magnate', description: 'Get all four businesses to Level 10.', iconName: 'Building2', cashReward: 50000, criteria: (p) => Object.values(p.businesses).every(b => b.level >= 10), category: 'Capitalist' },

  // General / Meta
  { id: 'skillfulLearner', name: 'Skillful Learner', description: 'Unlock 5 skills from the skill tree.', iconName: 'Network', cashReward: 1000, criteria: (p) => p.unlockedSkillIds.length >= 5, category: 'General' },
  { id: 'treeOfKnowledge', name: 'Tree of Knowledge', description: 'Unlock 15 skills from the skill tree.', iconName: 'Network', cashReward: 5000, criteria: (p) => p.unlockedSkillIds.length >= 15, category: 'General' },
  { id: 'skillTreeMaster', name: 'Skill Tree Master', description: 'Unlock all non-infinite skills.', iconName: 'Network', cashReward: 20000, criteria: p => ALL_SKILLS.filter(sk => sk.category !== 'Infinite').every(sk => p.unlockedSkillIds.includes(sk)), category: 'General'},
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
  { id: 'synergizer', name: 'Synergizer', description: 'Unlocks a small, permanent bonus to both XP and Cash gain for every achievement unlocked.', cost: 5, iconName: 'Layers', prerequisiteLevel: 25, prerequisiteSkillIds: ['deepWork', 'marketAnalyst', 'goalMomentum'], category: 'Infinite' },
];

export const ALL_INFAMY_SKILLS: Skill[] = [
  { id: 'infamyXpBoost', name: 'Perpetual Learner', description: 'Permanently gain +10% more XP from all sources.', cost: 1, iconName: 'Zap', xpBoostPercent: 0.10, category: 'Infamy' },
  { id: 'infamyCashBoost', name: 'Golden Touch', description: 'Permanently gain +10% more Cash from all sources.', cost: 1, iconName: 'DollarSign', cashBoostPercent: 0.10, category: 'Infamy' },
  { id: 'infamyStartingBonus', name: 'Head Start', description: 'Start each new run after Infamy with $50,000 cash.', cost: 1, iconName: 'Rocket', otherEffect: 'starting_bonus', category: 'Infamy' },
  { id: 'infamyBusinessBoost', name: 'Capitalist Legacy', description: 'All businesses start at Level 2 after going infamous.', cost: 2, prerequisiteLevel: 2, iconName: 'Building2', otherEffect: 'business_legacy', category: 'Infamy' },
  { id: 'infamyChallengeSlot', name: 'Extra Endeavor', description: 'Gain one additional Daily Challenge slot.', cost: 2, prerequisiteLevel: 3, iconName: 'CalendarPlus', otherEffect: 'challenge_slot', category: 'Infamy' },
];


const REVISION_INTERVALS = [1, 3, 7, 14, 30, 60, 90]; 

type QuadrantKey = 'do' | 'schedule' | 'delegate' | 'eliminate';

interface SessionContextType {
  sessions: StudySession[];
  userProfile: UserProfile;
  pomodoroState: PomodoroState;
  stopwatchState: StopwatchState;
  countdownState: CountdownState;
  dailyChallenges: DailyChallenge[];
  dailyOffers: DailyOffer[];
  floatingGains: FloatingGain[];
  activeTimer: TimerMode | null;
  skinPreview: { id: string | null; timeoutId: NodeJS.Timeout | null };
  isLoaded: boolean;
  afkCheckVisible: boolean;

  startTimer: (timerType: TimerMode) => void;
  pauseTimer: (timerType: TimerMode) => void;
  resetTimer: (timerType: TimerMode) => void;
  logSession: (timerType: TimerMode) => void;
  confirmAfk: (isStillHere: boolean) => void;
  
  switchPomodoroMode: (mode?: PomodoroMode) => void;
  updatePomodoroSettings: (newSettings: Partial<PomodoroSettings>) => void;
  setCountdownDuration: (durationMs: number) => void;

  addManualSession: (details: { durationInSeconds: number; endTime: number; type: 'Pomodoro Focus' | 'Stopwatch' | 'Countdown'; description: string; }) => boolean;
  deleteSession: (sessionId: string) => void;
  addDevLevels: () => void;
  clearSessions: () => void;
  hardReset: () => void;
  requestHardReset: () => void;
  cancelHardReset: () => void;
  updateSessionDescription: (sessionId: string, description: string) => void;
  
  updateUserProfile: (updatedProfileData: Partial<UserProfile>) => void;
  dangerouslySetUserProfile: (profile: UserProfile) => void;
  updateSleepWakeTimes: (wakeUpTime: UserProfile['wakeUpTime'], sleepTime: UserProfile['sleepTime']) => void;

  updateNotepadData: (updatedNotepadData: Partial<NotepadData>) => void;
  addNotepadNote: (note: Omit<NotepadNote, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateNotepadNote: (note: NotepadNote) => void;
  deleteNotepadNote: (noteId: string) => void;
  updateItemQuadrant: (itemId: string, itemType: 'task' | 'goal', quadrant?: QuadrantKey) => void;

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
  
  unlockBusiness: (businessId: keyof UserProfile['businesses']) => void;
  upgradeBusiness: (businessId: keyof UserProfile['businesses']) => void;
  collectBusinessIncome: (businessId: keyof UserProfile['businesses'], rawAmount: number, secondsPassed: number) => void;
  
  buyBond: (bondId: string) => void;
  claimMaturedBonds: () => void;

  getSkinById: (id: string) => Skin | undefined;
  buySkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => void;
  trySkin: (skinId: string) => void;
  cancelSkinPreview: () => void;
  isSkinOwned: (skinId: string) => boolean;
  buyUtilityItem: (itemId: string) => boolean;
  isUtilityItemOwned: (itemId: string) => boolean;

  selectDailyOffer: (offerId: string) => void;
  
  claimChallengeReward: (challengeId: string) => void;
  updateChallengeProgress: (type: DailyChallenge['type'], value: number, absoluteValue?: boolean) => void;
  
  getUnlockedAchievements: () => Achievement[];
  isSkillUnlocked: (skillId: string) => boolean;
  canUnlockSkill: (skillId: string) => { can: boolean, reason?: string };
  unlockSkill: (skillId: string) => boolean;
  goInfamous: () => void;
  isInfamySkillUnlocked: (skillId: string) => boolean;
  canUnlockInfamySkill: (skillId: string) => { can: boolean, reason?: string };
  unlockInfamySkill: (skillId: string) => boolean;
  isFeatureUnlocked: (featureKey: FeatureKey) => boolean;
  getAppliedBoost: (type: 'xp' | 'cash' | 'shopDiscount') => number;
  getSkillBoost: (type: 'xp' | 'cash') => number;
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
  const [skinPreview, setSkinPreview] = useState<{ id: string | null; timeoutId: NodeJS.Timeout | null }>({ id: null, timeoutId: null });

  
  const [afkCheckVisible, setAfkCheckVisible] = useState(false);
  const afkTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [pomodoroState, setPomodoroState] = useState<PomodoroState>(DEFAULT_POMODORO_STATE);
  const [stopwatchState, setStopwatchState] = useState<StopwatchState>(DEFAULT_STOPWATCH_STATE);
  const [countdownState, setCountdownState] = useState<CountdownState>(DEFAULT_COUNTDOWN_STATE);
  const [activeTimer, setActiveTimer] = useState<TimerMode | null>(null);

  const lastGainTime = useRef({ xp: 0, cash: 0 });
  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  const addFloatingGain = useCallback((type: 'xp' | 'cash', amount: number) => {
    const now = Date.now();
    if (now - lastGainTime.current[type] < 500) return;
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
    setUserProfile(prevProfile => {
      const newProfile = { ...prevProfile, ...updatedProfileData };
      checkAndUnlockAchievements(newProfile, sessionsRef.current);
      return newProfile;
    });
  }, [checkAndUnlockAchievements]);
  
  const dangerouslySetUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
  }, []);
  
  const isSkillUnlocked = useCallback((skillId: string) => userProfile.unlockedSkillIds.includes(skillId), [userProfile.unlockedSkillIds]);
  
  const isFeatureUnlocked = useCallback((featureKey: FeatureKey) => {
    if (featureKey === 'timers' || featureKey === 'skill-tree') return true;
    if (featureKey === 'infamy' && (userProfile.level < 100 && userProfile.infamyLevel === 0)) return false;
    
    // Handle special cases first
    if(featureKey === 'premiumSounds') {
        return userProfile.ownedUtilityItemIds.includes('sound_pack_premium');
    }

    const skill = ALL_SKILLS.find(s => s.unlocksFeature === featureKey);
    return !skill || isSkillUnlocked(skill.id);
  }, [isSkillUnlocked, userProfile.level, userProfile.infamyLevel, userProfile.ownedUtilityItemIds]);
  
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
    if(userProfile.activeOfferId) {
        const offer = dailyOffers.find(o => o.id === userProfile.activeOfferId);
        if(offer) {
          if (offer.positiveEffect.type === type) boost += (offer.positiveEffect.modifier - 1);
          if (offer.negativeEffect.type === type) boost += (offer.negativeEffect.modifier - 1);
        }
    }
    return boost;
  }, [userProfile.unlockedSkillIds, userProfile.skillLevels, userProfile.activeOfferId, getSkillBoost, dailyOffers]);
  
  const checkForLevelUp = useCallback((currentXp: number, currentLevel: number) => {
    let newLevel = currentLevel;
    let leveledUp = false;
    let skillPointsGained = 0;
    let cashGained = 0;

    while (newLevel < 100 && currentXp >= ACTUAL_LEVEL_THRESHOLDS[newLevel]) {
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
    return { newLevel: currentLevel, newTitle: TITLES[currentLevel - 1], leveledUp, skillPointsGained, cashGained };
  }, [toast, addFloatingGain]);

  const updateStreakAndGetBonus = useCallback((currentProfile: UserProfile) => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    let currentStudyStreak = currentProfile.currentStreak;
    let longestStudyStreak = currentProfile.longestStreak;
    let lastStudyDay = currentProfile.lastStudyDate;

    if (lastStudyDay) {
      const lastDate = parseISO(lastStudyDay);
      if (isToday(lastDate)) {
        // No change if already studied today
      } else if (isYesterday(lastDate)) {
        currentStudyStreak++;
      } else {
        currentStudyStreak = 1;
      }
    } else { 
      currentStudyStreak = 1;
    }

    let newLastStudyDate = todayStr;
    if (currentStudyStreak > longestStudyStreak) {
        longestStudyStreak = currentStudyStreak;
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
            let offerXpMultiplier = 1.0;
            let offerCashMultiplier = 1.0;

            if(prevProfile.activeOfferId) {
                const offer = dailyOffers.find(o => o.id === prevProfile.activeOfferId);
                if (offer) {
                  if (offer.positiveEffect.type === 'xp') offerXpMultiplier *= offer.positiveEffect.modifier;
                  if (offer.positiveEffect.type === 'cash') offerCashMultiplier *= offer.positiveEffect.modifier;
                  if (offer.negativeEffect.type === 'xp') offerXpMultiplier *= offer.negativeEffect.modifier;
                  if (offer.negativeEffect.type === 'cash') offerCashMultiplier *= offer.negativeEffect.modifier;
                }
            }

            const totalXpMultiplier = (1 + baseStreakBonus + skillXpBonus) * offerXpMultiplier;
            const totalCashMultiplier = (1 + baseStreakBonus + skillCashBonus) * offerCashMultiplier;

            awardedXp = Math.floor(minutesStudied * XP_PER_MINUTE_FOCUS * totalXpMultiplier);
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
      if (newProfile) checkAndUnlockAchievements(newProfile, updatedSessions);
      return updatedSessions;
    });
  }, [updateStreakAndGetBonus, getSkillBoost, dailyOffers, checkForLevelUp, updateChallengeProgress, addFloatingGain, toast, isFeatureUnlocked, checkAndUnlockAchievements]);
  
  const addManualSession = useCallback((details: { durationInSeconds: number; endTime: number; type: StudySession['type']; description: string; }) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const { date, duration } = userProfile.manualLogTimeToday || { date: '', duration: 0 };
    if (date === todayStr && duration >= 4 * 3600) {
      toast({ title: "Limit Reached", description: "You can only log up to 4 hours of manual time per day.", variant: "destructive" });
      return false;
    }
    
    addSession({
      type: details.type,
      startTime: details.endTime - details.durationInSeconds * 1000,
      durationInSeconds: details.durationInSeconds,
      description: details.description,
      isFullPomodoroCycle: details.type === 'Pomodoro Focus' ? (details.durationInSeconds / 60) >= pomodoroState.settings.workDuration : false,
    });
    
    const newDuration = (date === todayStr ? duration : 0) + details.durationInSeconds;
    setUserProfile(prev => ({ ...prev, manualLogTimeToday: { date: todayStr, duration: newDuration } }));
    return true;
  }, [addSession, pomodoroState.settings.workDuration, toast, userProfile.manualLogTimeToday]);

  const addDevLevels = useCallback(() => {
    setUserProfile(prevProfile => {
        let newXp = prevProfile.xp;
        let newLevel = prevProfile.level;
        let skillPointsToAdd = 0;
        let cashToAdd = 0;

        for (let i = 0; i < 50; i++) {
            if (newLevel >= 100) break;
            const xpForNextLevel = (ACTUAL_LEVEL_THRESHOLDS[newLevel] ?? newXp) - newXp;
            newXp += xpForNextLevel;
            const levelUpResult = checkForLevelUp(newXp, newLevel);
            newLevel = levelUpResult.newLevel;
            skillPointsToAdd += levelUpResult.skillPointsGained;
            cashToAdd += levelUpResult.cashGained;
        }
        
        return {
            ...prevProfile,
            xp: newXp,
            skillPoints: prevProfile.skillPoints + skillPointsToAdd,
            cash: prevProfile.cash + cashToAdd,
            level: newLevel,
            title: TITLES[newLevel - 1] || TITLES[TITLES.length - 1]
        };
    });
    toast({ title: "Dev Power!", description: "Added 50 levels of progress." });
  }, [checkForLevelUp, toast]);


  const clearSessions = useCallback(() => {
    setSessions([]);
    toast({
      title: "Session Log Cleared",
      description: "All your study sessions have been removed.",
      icon: <Trash2 />,
    });
  }, [toast]);

  const deleteSession = useCallback((sessionId: string) => {
    const sessionToDelete = sessions.find(s => s.id === sessionId);
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    if (sessionToDelete) toast({ title: "Session Deleted", description: `Session type "${sessionToDelete.type}" removed.`, icon: <Trash2 /> });
  }, [sessions, toast]);

  const updateSessionDescription = useCallback((sessionId: string, description: string) => {
    setSessions(prevSessions => prevSessions.map(session => session.id === sessionId ? { ...session, description } : session));
  }, []);

  const updateNotepadData = useCallback((updatedNotepadData: Partial<NotepadData>) => {
    setUserProfile(prev => {
      const newNotepadData = { ...(prev.notepadData || DEFAULT_NOTEPAD_DATA), ...updatedNotepadData };
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
  
  const updateItemQuadrant = useCallback((itemId: string, itemType: 'task' | 'goal', quadrant?: QuadrantKey) => {
    if (!isFeatureUnlocked('notepadEisenhower')) {
        toast({ title: "Feature Locked", description: "Unlock the Eisenhower Matrix in the Skill Tree.", icon: <XCircle/> });
        return;
    }
    
    if (itemType === 'task') {
        const newTasks = (userProfile.notepadData.tasks || []).map(task => {
            if (task.id === itemId) {
                return { ...task, quadrant };
            }
            return task;
        });
        updateNotepadData({ tasks: newTasks });
    } else if (itemType === 'goal') {
        const newGoals = (userProfile.notepadData.goals || []).map(goal => {
            if (goal.id === itemId) {
                return { ...goal, quadrant };
            }
            return goal;
        });
        updateNotepadData({ goals: newGoals });
    }

    toast({ title: "Item Moved", description: `Item moved to ${quadrant ? quadrantDetails[quadrant].title : 'Uncategorized'}.`, icon: <Grid/> });
  }, [isFeatureUnlocked, userProfile.notepadData.tasks, userProfile.notepadData.goals, updateNotepadData, toast]);

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

  const cancelSkinPreview = useCallback(() => {
    if (skinPreview.timeoutId) {
        clearTimeout(skinPreview.timeoutId);
    }
    setSkinPreview({ id: null, timeoutId: null });
    toast({ title: "Preview Cancelled", description: "Reverted to your original theme." });
  }, [skinPreview.timeoutId, toast]);

  const trySkin = useCallback((skinId: string) => {
    const skin = getSkinById(skinId);
    if (!skin) return;

    if (skinPreview.timeoutId) {
      clearTimeout(skinPreview.timeoutId);
    }
    
    setSkinPreview({ id: skinId, timeoutId: null });
    toast({ title: "Theme Preview", description: `Trying out ${skin.name} for 60 seconds.` });

    const timeoutId = setTimeout(() => {
      setSkinPreview(prev => {
        // Only revert if the current preview is the one that timed out
        if (prev.id === skinId) {
          toast({ title: "Preview Ended", description: `Reverted to your original theme.` });
          return { id: null, timeoutId: null };
        }
        return prev;
      });
    }, 60000);

    setSkinPreview(prev => ({ ...prev, timeoutId }));
  }, [skinPreview.timeoutId, toast, getSkinById]);

  const equipSkin = useCallback((skinId: string) => {
    if(!isFeatureUnlocked('shop')) { toast({ title: "Shop Locked", description: "Unlock Shop in Skill Tree.", icon: <XCircle/> }); return; }
    if (!isSkinOwned(skinId)) { toast({ title: "Error", description: "You don't own this skin.", variant: "destructive", icon: <XCircle/> }); return; }
    const skinToEquip = getSkinById(skinId);
    if (!skinToEquip) return;

    // If a preview is active, cancel it before equipping
    if (skinPreview.id) {
        cancelSkinPreview();
    }
    
    setUserProfile(prev => ({ ...prev, equippedSkinId: skinId }));
    toast({ title: "Skin Equipped!", description: `${skinToEquip.name} is now active.`, icon: <PaletteIcon/> });
  }, [isFeatureUnlocked, isSkinOwned, getSkinById, toast, skinPreview.id, cancelSkinPreview]);
  
  const isUtilityItemOwned = useCallback((itemId: string) => {
      const item = UTILITY_ITEMS.find(i => i.id === itemId);
      if (!item) return false;
      if (!item.isConsumable) return userProfile.ownedUtilityItemIds.includes(itemId);
      return false; // Consumables aren't "owned"
  }, [userProfile.ownedUtilityItemIds]);

  const buyUtilityItem = useCallback((itemId: string) => {
    if(!isFeatureUnlocked('shop')) { toast({ title: "Shop Locked", description: "Unlock Shop in the Skill Tree.", icon: <XCircle/> }); return false; }
    const item = UTILITY_ITEMS.find(i => i.id === itemId);
    if (!item) { toast({ title: "Error", description: "Item not found.", variant: "destructive" }); return false; }
    
    if (!item.isConsumable && isUtilityItemOwned(itemId)) { toast({ title: "Already Purchased", description: "You can only buy this item once." }); return false; }
    if (item.isConsumable && (userProfile.utilityItemCooldowns?.[itemId] || 0) > Date.now()) { toast({ title: "Item on Cooldown", description: "You must wait before buying this again."}); return false; }
    if (userProfile.level < item.levelRequirement) { toast({ title: "Level Too Low", description: `Requires Level ${item.levelRequirement}.` }); return false; }
    
    if (item.priceType === 'cash' && userProfile.cash < item.price) { toast({ title: "Not Enough Cash", description: `Need $${item.price.toLocaleString()}.` }); return false; }
    if (item.priceType === 'sp' && userProfile.skillPoints < item.price) { toast({ title: "Not Enough Skill Points", description: `Need ${item.price} SP.` }); return false; }

    const profileUpdates: Partial<UserProfile> = {};
    if (!item.isConsumable) profileUpdates.ownedUtilityItemIds = [...userProfile.ownedUtilityItemIds, itemId];
    else profileUpdates.utilityItemCooldowns = { ...(userProfile.utilityItemCooldowns || {}), [itemId]: Date.now() + (item.cooldownSeconds || 0) * 1000 };

    if (item.priceType === 'cash') { profileUpdates.cash = userProfile.cash - item.price; addFloatingGain('cash', -item.price); } 
    else { profileUpdates.skillPoints = userProfile.skillPoints - item.price; }

    if (item.effect.type === 'xp') { profileUpdates.xp = (profileUpdates.xp || userProfile.xp) + item.effect.amount; addFloatingGain('xp', item.effect.amount); } 
    else if (item.effect.type === 'cash') { profileUpdates.cash = (profileUpdates.cash ?? userProfile.cash) + item.effect.amount; addFloatingGain('cash', item.effect.amount); } 
    else if (item.effect.type === 'sp') { profileUpdates.skillPoints = (profileUpdates.skillPoints ?? userProfile.skillPoints) + item.effect.amount; } 
    else if (item.effect.type === 'special_focus_potion') {
        const xpAmount = XP_PER_MINUTE_FOCUS * 25; const cashAmount = CASH_PER_5_MINUTES_FOCUS * 5;
        profileUpdates.xp = (profileUpdates.xp || userProfile.xp) + xpAmount; profileUpdates.cash = (profileUpdates.cash ?? userProfile.cash) + cashAmount;
        addFloatingGain('xp', xpAmount); addFloatingGain('cash', cashAmount);
    }
    
    const newProfile = { ...userProfile, ...profileUpdates };
    const { newLevel, newTitle, leveledUp, skillPointsGained, cashGained } = checkForLevelUp(newProfile.xp, newProfile.level);
    if(leveledUp) { newProfile.level = newLevel; newProfile.title = newTitle; newProfile.skillPoints += skillPointsGained; newProfile.cash += cashGained; }

    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
    toast({ title: "Item Purchased!", description: `You acquired ${item.name}.`, icon: <CheckCircle /> });
    return true;
  }, [isFeatureUnlocked, userProfile, isUtilityItemOwned, toast, addFloatingGain, checkForLevelUp, checkAndUnlockAchievements]);

  const selectDailyOffer = useCallback((offerId: string) => {
    if (!isFeatureUnlocked('challenges')) return;
    const offer = dailyOffers.find(o => o.id === offerId);
    if (!offer) return;
    if (userProfile.activeOfferId) {
      toast({title: "Offer Already Active", description: "You can only have one offer active per day.", variant: 'destructive'});
      return;
    }
    
    setUserProfile(prev => ({...prev, activeOfferId: offerId }));
    toast({title: "Offer Activated!", description: `${offer.title} is now active for the rest of the day.`, icon: <Sparkles />});
  }, [isFeatureUnlocked, dailyOffers, userProfile.activeOfferId, toast]);

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
    let bonusXp = 0, bonusCash = 0;
    const allChallengesNowClaimed = updatedChallenges.every(c => c.rewardClaimed);
    if (allChallengesNowClaimed) {
        bonusXp = 250; bonusCash = 2500;
        toast({title: "All Challenges Complete!", description: `Bonus: +${bonusXp} XP & +$${bonusCash.toLocaleString()}! You can also select another offer.`, icon: <Sparkles/>});
        addFloatingGain('xp', bonusXp); addFloatingGain('cash', bonusCash);
    }

    setUserProfile(prevProfile => {
        let xpToAdd = xpReward + bonusXp;
        let cashToAdd = cashReward + bonusCash;
        const newXp = Math.max(0, prevProfile.xp + xpToAdd);
        const { newLevel, newTitle, leveledUp, skillPointsGained, cashGained } = checkForLevelUp(newXp, prevProfile.level);
        cashToAdd += cashGained;

        const finalProfile = {
            ...prevProfile, xp: newXp, cash: prevProfile.cash + cashToAdd,
            completedChallengeIds: [...(prevProfile.completedChallengeIds || []), challengeId],
            ...(leveledUp && { level: newLevel, title: newTitle, skillPoints: (prevProfile.skillPoints || 0) + skillPointsGained }),
            ...(allChallengesNowClaimed && { activeOfferId: null })
        };
        checkAndUnlockAchievements(finalProfile, sessionsRef.current);
        return finalProfile;
    });
  }, [isFeatureUnlocked, toast, dailyChallenges, checkForLevelUp, addFloatingGain, checkAndUnlockAchievements]);
  
  const getUnlockedAchievements = useCallback((): Achievement[] => ALL_ACHIEVEMENTS.filter(ach => userProfile.unlockedAchievementIds?.includes(ach.id)), [userProfile.unlockedAchievementIds]);
  
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

  const unlockSkill = useCallback((skillId: string) => {
    const unlockCheck = canUnlockSkill(skillId);
    if (!unlockCheck.can) { toast({ title: "Cannot Unlock Skill", description: unlockCheck.reason, variant: "destructive", icon: <XCircle/> }); return false; }
    const skill = ALL_SKILLS.find(s => s.id === skillId);
    if (!skill) return false;
    let newUnlockedSkills = userProfile.unlockedSkillIds;
    let newSkillLevels = { ...(userProfile.skillLevels || {}) };
    if(skill.category === 'Infinite') {
        newSkillLevels[skillId] = (newSkillLevels[skillId] || 0) + 1;
    } else if (!newUnlockedSkills.includes(skillId)) {
        newUnlockedSkills = [...newUnlockedSkills, skillId];
    }
    const newProfile = { ...userProfile, skillPoints: userProfile.skillPoints - skill.cost, unlockedSkillIds: newUnlockedSkills, skillLevels: newSkillLevels };
    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
    if(isFeatureUnlocked('challenges')) updateChallengeProgress('skillUnlocks', 1);
    toast({ title: skill.category === 'Infinite' ? "Skill Upgraded!" : "Skill Unlocked!", description: `You unlocked: ${skill.name}`, icon: <CheckCircle/>});
    return true;
  }, [canUnlockSkill, toast, userProfile, checkAndUnlockAchievements, isFeatureUnlocked, updateChallengeProgress]);

  const isInfamySkillUnlocked = useCallback((skillId: string) => {
    return userProfile.unlockedInfamySkillIds.includes(skillId);
  }, [userProfile.unlockedInfamySkillIds]);

  const canUnlockInfamySkill = useCallback((skillId: string): { can: boolean, reason?: string } => {
    const skill = ALL_INFAMY_SKILLS.find(s => s.id === skillId);
    if (!skill) return { can: false, reason: "Skill not found." };
    if (isInfamySkillUnlocked(skillId)) return { can: false, reason: "Already unlocked." };
    if (userProfile.infamyPoints < skill.cost) return { can: false, reason: `Not enough Infamy Points. Needs ${skill.cost}, has ${userProfile.infamyPoints}.` };
    if (skill.prerequisiteLevel && userProfile.infamyLevel < skill.prerequisiteLevel) return { can: false, reason: `Requires Infamy Level ${skill.prerequisiteLevel}.` };
    return { can: true };
  }, [userProfile.infamyPoints, userProfile.infamyLevel, isInfamySkillUnlocked]);

  const unlockInfamySkill = useCallback((skillId: string) => {
    const unlockCheck = canUnlockInfamySkill(skillId);
    if (!unlockCheck.can) {
      toast({ title: "Cannot Unlock Infamy Skill", description: unlockCheck.reason, variant: "destructive" });
      return false;
    }
    const skill = ALL_INFAMY_SKILLS.find(s => s.id === skillId);
    if (!skill) return false;

    const newUnlockedSkills = [...userProfile.unlockedInfamySkillIds, skillId];
    const newProfile = { ...userProfile, infamyPoints: userProfile.infamyPoints - skill.cost, unlockedInfamySkillIds: newUnlockedSkills };
    setUserProfile(newProfile);
    toast({ title: "Infamy Skill Unlocked!", description: `You have learned: ${skill.name}` });
    return true;
  }, [canUnlockInfamySkill, userProfile, toast]);

  const goInfamous = useCallback(() => {
    if (userProfile.level < 100) {
      toast({ title: "Not Ready", description: "You must reach Level 100 to go infamous.", variant: "destructive" });
      return;
    }

    let startingCash = DEFAULT_USER_PROFILE.cash;
    
    if (isInfamySkillUnlocked('infamyStartingBonus')) {
      startingCash += 50000;
    }

    let startingBusinesses = DEFAULT_BUSINESSES;
    if (isInfamySkillUnlocked('infamyBusinessBoost')) {
        const now = Date.now();
        startingBusinesses = {
            farm: { ...DEFAULT_BUSINESSES.farm, level: 2, lastCollected: now },
            startup: { ...DEFAULT_BUSINESSES.startup, level: 2, lastCollected: now },
            mine: { ...DEFAULT_BUSINESSES.mine, level: 2, lastCollected: now },
            industry: { ...DEFAULT_BUSINESSES.industry, level: 2, lastCollected: now },
        };
    }

    setUserProfile(prev => ({
      ...prev,
      // Reset progress
      xp: 0,
      level: 1,
      title: TITLES[0],
      cash: startingCash,
      businesses: startingBusinesses,
      // Infamy progression
      infamyLevel: prev.infamyLevel + 1,
      infamyPoints: prev.infamyPoints + 1,
      // Reset timers and other volatile state
      bonds: [],
      lastBondGenerationTime: 0,
      activeOfferId: null,
    }));
    
    // Clear sessions from state and storage
    setSessions([]);
    localStorage.removeItem('studySessions');

    toast({ title: "You Have Gone Infamous!", description: "Your journey begins anew, but with greater power. You earned 1 Infamy Point." });

  }, [userProfile, toast, isInfamySkillUnlocked]);


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

  const switchPomodoroMode = useCallback((newMode?: PomodoroMode) => {
    let nextMode: PomodoroMode = 'work';
    setPomodoroState(prev => {
        let newCyclesCompleted = prev.cyclesCompleted;
        if (newMode) {
            nextMode = newMode;
            if (prev.mode === 'work' && (nextMode === 'shortBreak' || nextMode === 'longBreak')) newCyclesCompleted++;
        } else {
            if (prev.mode === 'work') {
                newCyclesCompleted = prev.cyclesCompleted + 1;
                nextMode = newCyclesCompleted % prev.settings.cyclesPerLongBreak === 0 ? 'longBreak' : 'shortBreak';
            } else { nextMode = 'work'; }
        }
        let durationMs = getDurationForMode(nextMode, prev.settings) * 1000;
        if(userProfile.activeOfferId) {
            const offer = dailyOffers.find(o => o.id === userProfile.activeOfferId);
            if (offer) {
                if (offer.positiveEffect.type === 'timer_speed') durationMs *= offer.positiveEffect.modifier;
                if (offer.negativeEffect.type === 'timer_speed' && nextMode !== 'work') durationMs *= offer.negativeEffect.modifier;
            }
        }
        return { ...prev, mode: nextMode, cyclesCompleted: newCyclesCompleted, sessionEndTime: Date.now() + durationMs };
    });
  }, [getDurationForMode, userProfile.activeOfferId, dailyOffers]);

  const updatePomodoroSettings = useCallback((newSettings: Partial<PomodoroSettings>) => {
    setPomodoroState(prev => {
        const updatedSettings = { ...prev.settings, ...newSettings };
        let newSessionEndTime = prev.sessionEndTime;
        if (!prev.isRunning) {
            const durationMs = getDurationForMode(prev.mode, updatedSettings) * 1000;
            newSessionEndTime = Date.now() + durationMs;
        }
        return {
            ...prev,
            settings: updatedSettings,
            sessionEndTime: newSessionEndTime
        };
    });
  }, [getDurationForMode]);

  const getTimerState = (timerType: TimerMode) => ({ pomodoro: pomodoroState, stopwatch: stopwatchState, countdown: countdownState })[timerType];
  
  const startTimer = useCallback((timerType: TimerMode) => {
      if (activeTimer && activeTimer !== timerType) {
        toast({ title: "Timer Active", description: `The ${activeTimer} is already running.`, variant: 'destructive'}); return;
      }
      setActiveTimer(timerType);
      
      const startAfkCheck = () => {
        if (afkTimerRef.current) clearTimeout(afkTimerRef.current);
        afkTimerRef.current = setTimeout(() => { setAfkCheckVisible(true); }, 3600 * 1000); // 1 hour
      };

      if (timerType === 'pomodoro') {
          setPomodoroState(prev => {
            const now = Date.now();
            const timeRemainingMs = prev.sessionEndTime > now ? prev.sessionEndTime - now : getDurationForMode(prev.mode, prev.settings) * 1000;
            return { ...prev, isRunning: true, sessionStartTime: now, sessionEndTime: now + timeRemainingMs };
          });
          startAfkCheck();
      } else if (timerType === 'stopwatch') {
          setStopwatchState(prev => ({ ...prev, isRunning: true, sessionStartTime: Date.now() }));
          startAfkCheck();
      } else if (timerType === 'countdown') {
          setCountdownState(prev => {
              if (prev.timeLeftOnPause <= 0) return prev;
              return { ...prev, isRunning: true, sessionStartTime: Date.now() }
          });
          startAfkCheck();
      }
  }, [activeTimer, toast, getDurationForMode]);

  const pauseTimer = useCallback((timerType: TimerMode) => {
    setActiveTimer(null);
    if (afkTimerRef.current) clearTimeout(afkTimerRef.current);

    if (timerType === 'pomodoro') {
        setPomodoroState(prev => {
            if (!prev.isRunning) return prev;
            return { ...prev, isRunning: false, sessionEndTime: prev.sessionEndTime };
        });
    } else if (timerType === 'stopwatch') {
        setStopwatchState(prev => {
            if (!prev.isRunning || !prev.sessionStartTime) return prev;
            const elapsedSinceStart = Date.now() - prev.sessionStartTime;
            return { ...prev, isRunning: false, timeElapsedOnPause: prev.timeElapsedOnPause + elapsedSinceStart, sessionStartTime: null };
        });
    } else if (timerType === 'countdown') {
        setCountdownState(prev => {
            if (!prev.isRunning || !prev.sessionStartTime) return prev;
            const elapsedSinceStart = Date.now() - prev.sessionStartTime;
            return { ...prev, isRunning: false, timeLeftOnPause: prev.timeLeftOnPause - elapsedSinceStart, sessionStartTime: null };
        });
    }
  }, []);

  const resetTimer = useCallback((timerType: TimerMode) => {
    if (activeTimer === timerType) setActiveTimer(null);
    if (afkTimerRef.current) clearTimeout(afkTimerRef.current);

    if (timerType === 'pomodoro') {
      setPomodoroState(prev => ({...prev, isRunning: false, sessionEndTime: Date.now() + getDurationForMode(prev.mode, prev.settings) * 1000}));
    } else if (timerType === 'stopwatch') {
      setStopwatchState(DEFAULT_STOPWATCH_STATE);
    } else if (timerType === 'countdown') {
      setCountdownState(prev => ({...DEFAULT_COUNTDOWN_STATE, initialDuration: prev.initialDuration, timeLeftOnPause: prev.initialDuration}));
    }
  }, [activeTimer, getDurationForMode]);
  
  const logSession = useCallback((timerType: TimerMode) => {
    pauseTimer(timerType);
    let sessionDetails: { type: StudySession['type'], startTime: number, durationInSeconds: number, isFullPomodoroCycle?: boolean } | null = null;
    
    if (timerType === 'pomodoro') {
        const { sessionStartTime, mode, sessionEndTime } = pomodoroState;
        const totalDuration = getDurationForMode(mode, pomodoroState.settings);
        const elapsedDuration = totalDuration - Math.max(0, (sessionEndTime - Date.now()) / 1000);
        if (elapsedDuration > 1) sessionDetails = { type: mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break', startTime: sessionStartTime, durationInSeconds: Math.floor(elapsedDuration), isFullPomodoroCycle: false };
        resetTimer('pomodoro');
    } else if (timerType === 'stopwatch') {
        const { timeElapsedOnPause } = stopwatchState;
        if (timeElapsedOnPause > 1000) sessionDetails = { type: 'Stopwatch', startTime: Date.now() - timeElapsedOnPause, durationInSeconds: Math.floor(timeElapsedOnPause / 1000) };
        resetTimer('stopwatch');
    } else if (timerType === 'countdown') {
        const { initialDuration, timeLeftOnPause } = countdownState;
        const timeStudiedMs = initialDuration - timeLeftOnPause;
        if (timeStudiedMs > 1000) sessionDetails = { type: 'Countdown', startTime: Date.now() - timeStudiedMs, durationInSeconds: Math.floor(timeStudiedMs / 1000) };
        resetTimer('countdown');
    }
    
    if (sessionDetails) {
        addSession(sessionDetails);
    }
  }, [pauseTimer, resetTimer, addSession, pomodoroState, stopwatchState, countdownState, getDurationForMode]);
  
  const confirmAfk = (isStillHere: boolean) => {
    setAfkCheckVisible(false);
    if (!isStillHere && activeTimer) { logSession(activeTimer); } 
    else { if (afkTimerRef.current) clearTimeout(afkTimerRef.current); }
  };
  
  const setCountdownDuration = useCallback((durationMs: number) => {
    if(activeTimer && activeTimer !== 'countdown') { toast({title: "Timer Active", description: `Cannot set countdown while ${activeTimer} is running.`, variant: 'destructive'}); return; }
    setCountdownState(prev => ({ ...prev, isRunning: false, timeLeftOnPause: durationMs, initialDuration: durationMs, sessionStartTime: null }));
  }, [activeTimer, toast]);

  const unlockBusiness = useCallback((businessId: keyof UserProfile['businesses']) => {
    if(!isFeatureUnlocked('capitalist')) { toast({ title: "Capitalist Corner Locked", description: "Unlock this feature from the Skill Tree first.", icon: <XCircle/> }); return; }
    const business = userProfile.businesses[businessId];
    if(business.unlocked) { toast({ title: "Already Unlocked", description: "You already own this business." }); return; }
    if(userProfile.cash < business.unlockCost) { toast({ title: "Not Enough Cash", description: `You need $${business.unlockCost.toLocaleString()}.`, icon: <DollarSign/> }); return; }
    addFloatingGain('cash', -business.unlockCost);
    const newProfile = { ...userProfile, cash: userProfile.cash - business.unlockCost, businesses: { ...userProfile.businesses, [businessId]: { ...business, unlocked: true, lastCollected: Date.now() } } };
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
    if (updatedBusiness.id === 'mine') updatedBusiness.lastCollected = Date.now();
    addFloatingGain('cash', -upgradeCost);
    const newProfile = { ...userProfile, cash: userProfile.cash - upgradeCost, businesses: { ...userProfile.businesses, [businessId]: updatedBusiness } };
    setUserProfile(newProfile);
    checkAndUnlockAchievements(newProfile, sessionsRef.current);
    if(isFeatureUnlocked('challenges')) updateChallengeProgress('capitalistIncome', upgradeCost, false);
    toast({ title: "Business Upgraded!", description: `${business.name} is now Level ${updatedBusiness.level}.`, icon: <TrendingUp/> });
  }, [isFeatureUnlocked, userProfile, toast, addFloatingGain, checkAndUnlockAchievements, updateChallengeProgress]);
  
  const collectBusinessIncome = useCallback((businessId: keyof UserProfile['businesses'], rawAmount: number, secondsPassed: number) => {
    if(!isFeatureUnlocked('capitalist')) return;
    if (rawAmount < 1) return;
    const business = userProfile.businesses[businessId];
    if (!business.unlocked) return;
    let finalIncome = rawAmount;
    switch(business.id) {
        case 'startup':
            const roll = Math.random();
            if (roll < 0.4) { toast({ title: "Bad Luck!", description: `Your ${business.name} had a setback and produced no income this time.`, variant: 'destructive'}); finalIncome = 0; } 
            else if (roll > 0.9) { toast({ title: "Viral Hit!", description: `Your ${business.name} went viral! 5x income bonus!`, icon: <Sparkles/>}); finalIncome *= 5; }
            break;
        case 'farm':
            if (Math.random() < 0.15) { toast({ title: "Low Yield", description: `Your ${business.name} had a small harvest. 50% income.`, variant: 'destructive'}); finalIncome *= 0.5; }
            break;
        case 'mine':
            if (business.depletionRate) finalIncome *= Math.pow(1 - business.depletionRate, secondsPassed / 3600);
            break;
        case 'industry':
            if (business.maintenanceCost) finalIncome *= (1 - business.maintenanceCost);
            break;
    }
    const incomeToCollect = Math.floor(Math.max(0, finalIncome));
    const newBusiness = { ...business, lastCollected: Date.now() };
    const newBusinesses = { ...userProfile.businesses, [businessId]: newBusiness };
    if (incomeToCollect > 0) {
        toast({ title: "Income Collected!", description: `You collected $${incomeToCollect.toLocaleString()} from ${business.name}.`, icon: <DollarSign/> });
        addFloatingGain('cash', incomeToCollect);
    }
    setUserProfile(prev => ({ ...prev, cash: prev.cash + incomeToCollect, businesses: newBusinesses }));
    if(isFeatureUnlocked('challenges') && incomeToCollect > 0) updateChallengeProgress('capitalistIncome', incomeToCollect, false);
  }, [isFeatureUnlocked, userProfile, toast, addFloatingGain, updateChallengeProgress]);
  
  const buyBond = useCallback((bondId: string) => {
    const bond = userProfile.bonds.find(b => b.id === bondId);
    if (!bond || bond.purchaseTime > 0) return;
    if (userProfile.bonds.some(b => b.isPurchased)) {
      toast({title: "Choice Made", description: "You can only invest in one bond per cycle.", variant: "destructive"});
      return;
    }
    if (userProfile.cash < bond.cost) { toast({title: "Not Enough Cash", description: "You cannot afford this bond.", variant: 'destructive'}); return; }
    
    addFloatingGain('cash', -bond.cost);
    const updatedBond = { ...bond, purchaseTime: Date.now(), isPurchased: true, maturityTime: Date.now() + 60 * 60 * 1000 };
    setUserProfile(prev => ({
        ...prev,
        cash: prev.cash - bond.cost,
        bonds: prev.bonds.map(b => b.id === bondId ? updatedBond : b)
    }));
  }, [userProfile, toast, addFloatingGain]);

  const claimMaturedBonds = useCallback(() => {
    let cashFromBonds = 0;
    const now = Date.now();
    let madeChanges = false;
    const newBonds = userProfile.bonds.filter(bond => {
        if (bond.isPurchased && !bond.claimed && now >= bond.maturityTime) {
            let actualReturn = 0;
            switch(bond.risk){
                case 'low': actualReturn = bond.potentialReturnValue; break;
                case 'medium': actualReturn = Math.random() < 0.6 ? bond.potentialReturnValue : bond.cost - bond.potentialLossValue; break;
                case 'high': actualReturn = Math.random() < 0.2 ? bond.potentialReturnValue : bond.cost - bond.potentialLossValue; break;
            }
            cashFromBonds += Math.floor(actualReturn);
            madeChanges = true;
            return false;
        }
        return true;
    });
    if (madeChanges) {
        setUserProfile(prev => ({...prev, cash: prev.cash + cashFromBonds, bonds: newBonds}));
        toast({title: "Bonds Matured!", description: `You collected $${cashFromBonds.toLocaleString()} from matured bonds.`, icon: <DollarSign/>});
        addFloatingGain('cash', cashFromBonds);
    }
  }, [userProfile.bonds, toast, addFloatingGain]);

  const loadData = useCallback(() => {
    try {
      const storedSessions = localStorage.getItem('studySessions');
      if (storedSessions) setSessions(JSON.parse(storedSessions).sort((a, b) => b.startTime - a.startTime));

      let profileToLoad: UserProfile = DEFAULT_USER_PROFILE;
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
          const tempProfile = JSON.parse(storedProfile);
          const ensuredNotepadData: NotepadData = {
              ...DEFAULT_NOTEPAD_DATA, ...(tempProfile.notepadData || {}),
              tasks: Array.isArray(tempProfile.notepadData?.tasks) ? tempProfile.notepadData.tasks : DEFAULT_NOTEPAD_DATA.tasks,
              notes: Array.isArray(tempProfile.notepadData?.notes) ? tempProfile.notepadData.notes : DEFAULT_NOTEPAD_DATA.notes,
              goals: Array.isArray(tempProfile.notepadData?.goals) ? tempProfile.notepadData.goals : DEFAULT_NOTEPAD_DATA.goals,
              links: Array.isArray(tempProfile.notepadData?.links) ? tempProfile.notepadData.links : DEFAULT_NOTEPAD_DATA.links,
              revisionConcepts: Array.isArray(tempProfile.notepadData?.revisionConcepts) ? tempProfile.notepadData.revisionConcepts : DEFAULT_NOTEPAD_DATA.revisionConcepts,
              habits: Array.isArray(tempProfile.notepadData?.habits) ? tempProfile.notepadData.habits : DEFAULT_NOTEPAD_DATA.habits,
              countdownEvents: Array.isArray(tempProfile.notepadData?.countdownEvents) ? tempProfile.notepadData.countdownEvents : DEFAULT_NOTEPAD_DATA.countdownEvents,
          };
          profileToLoad = { ...DEFAULT_USER_PROFILE, ...tempProfile, notepadData: ensuredNotepadData, xp: Math.max(0, tempProfile.xp || 0) };
          let correctLevel = 1;
          for (let i = 1; i < ACTUAL_LEVEL_THRESHOLDS.length; i++) {
            if (profileToLoad.xp >= ACTUAL_LEVEL_THRESHOLDS[i]) correctLevel = i + 1; else break;
          }
          if(correctLevel > 100) correctLevel = 100;
          
          if (profileToLoad.level !== correctLevel) {
            profileToLoad.level = correctLevel;
            profileToLoad.title = TITLES[correctLevel - 1] || TITLES[TITLES.length - 1];
          }
          const coreSkills = ['unlockTimers', 'unlockSkillTree'];
          coreSkills.forEach(id => { if (!profileToLoad.unlockedSkillIds.includes(id)) profileToLoad.unlockedSkillIds.push(id) });
      }
      
      const storedPomoSettings = localStorage.getItem('pomodoroSettings');
      if(storedPomoSettings) setPomodoroState(prev => ({...prev, settings: JSON.parse(storedPomoSettings)}));
      
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const lastReset = localStorage.getItem('lastChallengeResetDate');
      if (lastReset === todayStr) {
          setDailyChallenges(JSON.parse(localStorage.getItem('dailyChallenges') || '[]'));
      } else {
        const numChallenges = profileToLoad.level >= 50 ? 6 : 3;
        const tempIsFeatureUnlocked = (featureKey: FeatureKey) => !ALL_SKILLS.find(s => s.unlocksFeature === featureKey) || profileToLoad.unlockedSkillIds.includes(ALL_SKILLS.find(s => s.unlocksFeature === featureKey)!.id);
        const availableChallenges = INITIAL_DAILY_CHALLENGES_POOL.filter(ch => {
            switch(ch.type){
                case 'tasksCompleted': return tempIsFeatureUnlocked('notepadChecklist');
                case 'ambianceUsage': return tempIsFeatureUnlocked('ambiance');
                case 'notepadEntry': return tempIsFeatureUnlocked('notepadNotes') || tempIsFeatureUnlocked('notepadRevision');
                case 'habitCompletions': return tempIsFeatureUnlocked('notepadHabits');
                case 'capitalistIncome': return tempIsFeatureUnlocked('capitalist');
                case 'skillUnlocks': return tempIsFeatureUnlocked('skill-tree');
                default: return true;
            }
        });
        const newChallenges = [...availableChallenges].sort(() => 0.5 - Math.random()).slice(0, numChallenges).map(ch => ({
            ...ch, 
            currentValue: 0, 
            isCompleted: false, 
            rewardClaimed: false,
            targetValue: Math.ceil(ch.targetValue * (1 + (profileToLoad.level / 20))), // Scale target
            xpReward: Math.ceil(ch.xpReward * (1 + (profileToLoad.level / 10))), // Scale XP
            cashReward: Math.ceil(ch.cashReward * (1 + (profileToLoad.level / 10))), // Scale Cash
        }));
        setDailyChallenges(newChallenges);
        setLastChallengeResetDate(todayStr);
      }
      
      const lastOffersDate = localStorage.getItem('lastOffersDate');
      if (lastOffersDate !== todayStr) {
          const newOffers = [...DAILY_OFFERS_POOL].sort(() => 0.5 - Math.random()).slice(0, 3);
          setDailyOffers(newOffers);
          profileToLoad.dailyOffers = newOffers;
          profileToLoad.activeOfferId = null;
          localStorage.setItem('lastOffersDate', todayStr);
      } else {
        setDailyOffers(profileToLoad.dailyOffers || []);
      }
      
      const now = Date.now();
      if(now - (profileToLoad.lastBondGenerationTime || 0) > 3600 * 1000) {
          const baseCost = Math.max(500, Math.floor(profileToLoad.cash * 0.05) + profileToLoad.level * 50);
          const newBonds: Bond[] = [
            { id: crypto.randomUUID(), name: "Govt. Bond", description: "A very safe, low-yield government bond.", risk: "low", cost: baseCost, potentialReturnValue: Math.floor(baseCost * 1.05), potentialLossValue: 0, purchaseTime: 0, maturityTime: 0, isPurchased: false, claimed: false },
            { id: crypto.randomUUID(), name: "Corporate Note", description: "A balanced corporate bond with decent returns.", risk: "medium", cost: baseCost * 2, potentialReturnValue: Math.floor(baseCost * 2.3), potentialLossValue: Math.floor(baseCost * 0.5), purchaseTime: 0, maturityTime: 0, isPurchased: false, claimed: false },
            { id: crypto.randomUUID(), name: "Junk Bond", description: "A high-risk, high-reward investment.", risk: "high", cost: baseCost * 1.5, potentialReturnValue: Math.floor(baseCost * 4), potentialLossValue: Math.floor(baseCost), purchaseTime: 0, maturityTime: 0, isPurchased: false, claimed: false },
          ];
          profileToLoad.bonds = newBonds;
          profileToLoad.lastBondGenerationTime = now;
      }
      setUserProfile(profileToLoad);
    } catch (error) { console.error("Failed to load data:", error); hardReset(); } 
    finally { setIsLoaded(true); }
  }, []);

  const hardReset = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);
  
  const requestHardReset = useCallback(() => {
      setUserProfile(p => ({ ...p, hardResetRequestTime: Date.now() }));
      toast({title: "Hard Reset Initiated", description: "All data will be permanently deleted in 10 minutes. You can cancel this at any time."});
  }, [toast]);
  
  const cancelHardReset = useCallback(() => {
      setUserProfile(p => ({ ...p, hardResetRequestTime: null }));
      toast({title: "Hard Reset Cancelled", description: "Your data is safe."});
  }, [toast]);

  useEffect(() => {
    if (!isLoaded || !userProfile.hardResetRequestTime) return;
    const interval = setInterval(() => {
        if (Date.now() - userProfile.hardResetRequestTime! >= 10 * 60 * 1000) {
            hardReset();
        }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isLoaded, userProfile.hardResetRequestTime, hardReset]);


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

  const pomodoroStateRef = useRef(pomodoroState);
  pomodoroStateRef.current = pomodoroState;
  const addSessionRef = useRef(addSession);
  addSessionRef.current = addSession;
  const switchPomodoroModeRef = useRef(switchPomodoroMode);
  switchPomodoroModeRef.current = switchPomodoroMode;
  
  useEffect(() => {
    if (!isLoaded) return;
    const timerWorker = () => {
      const currentPomodoroState = pomodoroStateRef.current;
      if (currentPomodoroState.isRunning && Date.now() >= currentPomodoroState.sessionEndTime) {
        const sessionType: StudySession['type'] = currentPomodoroState.mode === 'work' ? 'Pomodoro Focus' : 'Pomodoro Break';
        const duration = getDurationForMode(currentPomodoroState.mode, currentPomodoroState.settings);
        addSessionRef.current({ type: sessionType, startTime: currentPomodoroState.sessionStartTime, durationInSeconds: duration, isFullPomodoroCycle: currentPomodoroState.mode === 'work' });
        toast({ title: `Time's up!`, description: `Your ${currentPomodoroState.mode} session has ended.` });
        new Audio('/sounds/notification.mp3').play().catch(e => console.error("Error playing sound:", e));
        switchPomodoroModeRef.current(); 
      }
    };
    const intervalId = setInterval(timerWorker, 1000);
    return () => clearInterval(intervalId);
  }, [isLoaded, getDurationForMode, toast]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isLoaded) return;
    const root = window.document.documentElement;
    const skinIdToApply = skinPreview.id || userProfile.equippedSkinId;
    const equippedSkin = PREDEFINED_SKINS.find(s => s.id === skinIdToApply);
    
    const themeClass = equippedSkin?.isTheme ? equippedSkin.themeClass : 'classic';

    root.setAttribute('data-theme', themeClass || 'classic');
    
  }, [userProfile.equippedSkinId, skinPreview.id, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('pomodoroSettings', JSON.stringify(pomodoroState.settings));
        localStorage.setItem('dailyChallenges', JSON.stringify(dailyChallenges));
        if (lastChallengeResetDate) localStorage.setItem('lastChallengeResetDate', lastChallengeResetDate);
      } catch (error) { console.error("Failed to save data:", error); }
    }
  }, [sessions, userProfile, pomodoroState.settings, dailyChallenges, lastChallengeResetDate, isLoaded]);


  return (
    <SessionContext.Provider value={{
      sessions, userProfile, pomodoroState, stopwatchState, countdownState, dailyChallenges, dailyOffers, floatingGains, activeTimer, skinPreview, isLoaded, afkCheckVisible,
      startTimer, pauseTimer, resetTimer, logSession, confirmAfk,
      switchPomodoroMode, updatePomodoroSettings, setCountdownDuration,
      addManualSession, deleteSession, addDevLevels, clearSessions, hardReset, requestHardReset, cancelHardReset, updateSessionDescription,
      updateUserProfile, dangerouslySetUserProfile, updateSleepWakeTimes,
      updateNotepadData, addNotepadNote, updateNotepadNote, deleteNotepadNote, updateItemQuadrant,
      addRevisionConcept, markConceptRevised, deleteRevisionConcept,
      addHabit, updateHabit, deleteHabit, logHabitCompletion, getHabitCompletionForDate, getHabitCompletionsForWeek,
      addNotepadCountdownEvent, updateNotepadCountdownEvent, deleteNotepadCountdownEvent,
      unlockBusiness, upgradeBusiness, collectBusinessIncome, buyBond, claimMaturedBonds,
      getSkinById, buySkin, equipSkin, trySkin, cancelSkinPreview, isSkinOwned, buyUtilityItem, isUtilityItemOwned,
      selectDailyOffer,
      claimChallengeReward, updateChallengeProgress,
      getUnlockedAchievements, isSkillUnlocked, canUnlockSkill, unlockSkill, isFeatureUnlocked, getAppliedBoost, getSkillBoost,
      goInfamous, isInfamySkillUnlocked, canUnlockInfamySkill, unlockInfamySkill,
    }}>
      {children}
    </SessionContext.Provider>
  );
};

const quadrantDetails: Record<QuadrantKey, { title: string; description: string; action: string; bgColorClass: string; textColorClass: string }> = {
  'do': { title: 'Urgent & Important', description: "Crises, deadlines, pressing problems.", action: 'Do First', bgColorClass: "bg-destructive/10 border-destructive", textColorClass: "text-destructive" },
  'schedule': { title: 'Not Urgent & Important', description: "Long-term goals, relationship building, new opportunities.", action: 'Schedule', bgColorClass: "bg-primary/10 border-primary", textColorClass: "text-primary" },
  'delegate': { title: 'Urgent & Not Important', description: "Interruptions, some meetings, popular activities.", action: 'Delegate', bgColorClass: "bg-yellow-500/10 border-yellow-500", textColorClass: "text-yellow-600 dark:text-yellow-400" },
  'eliminate': { title: 'Not Urgent & Not Important', description: "Trivia, time wasters, some calls/emails.", action: 'Eliminate', bgColorClass: "bg-muted/50 border-muted-foreground/30", textColorClass: "text-muted-foreground" },
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (context === undefined) throw new Error('useSessions must be used within a SessionProvider');
  return context;
};
