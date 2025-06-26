
export interface StudySession {
  id: string;
  type: 'Stopwatch' | 'Pomodoro Focus' | 'Pomodoro Break' | 'Countdown';
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // in seconds
  description?: string; // User-added description
  tags?: string[];
  isFullPomodoroCycle?: boolean; // True if a Pomodoro focus session completed its full intended duration
}

export type TimerMode = 'pomodoro' | 'stopwatch' | 'countdown';

export interface Bond {
  id: string;
  name: string;
  description: string;
  cost: number;
  potentialReturnValue: number;
  potentialLossValue: number;
  risk: 'low' | 'medium' | 'high';
  isPurchased?: boolean;
  purchaseTime: number;
  maturityTime: number;
  claimed: boolean;
}

export interface Business {
  id: 'startup' | 'farm' | 'mine' | 'industry';
  name: string;
  description: string;
  gimmickTitle: string;
  gimmickDescription: string;
  unlockCost: number;
  unlocked: boolean;
  level: number;
  baseIncome: number; // per hour
  lastCollected: number; // timestamp
  currentCash: number;
  depletionRate?: number;
  maintenanceCost?: number;
}

export interface DailyOffer {
    id: string;
    title: string;
    description: string;
    positiveEffect: { type: 'xp' | 'cash' | 'risk' | 'timer_speed', modifier: number, description: string };
    negativeEffect: { type: 'xp' | 'cash' | 'risk' | 'timer_speed', modifier: number, description: string };
    effectType: 'xp_gain' | 'cash_gain' | 'timer_efficiency' | 'capitalist_income' | 'bond_risk';
    positiveDescription: string;
    negativeDescription: string;
}

export interface UtilityItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceType: 'cash' | 'sp';
  levelRequirement: number;
  effect: {
    type: 'xp' | 'cash' | 'sp';
    amount: number;
  };
  iconName: string;
}

export interface UserProfile {
  xp: number;
  cash: number;
  level: number;
  title: string;
  ownedSkinIds: string[];
  equippedSkinId: string | null;
  ownedUtilityItemIds: string[];
  completedChallengeIds: string[];
  currentStreak: number; // Study streak
  longestStreak: number; // Study streak
  lastStudyDate: string | null; // YYYY-MM-DD format for study streak
  wakeUpTime: { hour: number; period: 'AM' | 'PM' };
  sleepTime: { hour: number; period: 'AM' | 'PM' };
  unlockedAchievementIds: string[];
  lastLoginDate: string | null; // YYYY-MM-DD format for daily login bonus
  dailyLoginStreak: number; // For daily login bonus
  notepadData: NotepadData;
  skillPoints: number;
  unlockedSkillIds: string[];
  unlockedInfamySkillIds: string[];
  skillLevels: { [skillId: string]: number };
  businesses: {
    startup: Business;
    farm: Business;
    mine: Business;
    industry: Business;
  };
  dailyOffers: DailyOffer[];
  activeOfferId: string | null;
  manualLogTimeToday: { date: string, duration: number };
  infamyLevel: number;
  infamyPoints: number;
  bonds: Bond[];
  lastBondGenerationTime: number;
  hardResetRequestTime: number | null;
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  price: number;
  levelRequirement: number;
  imageUrl: string;
  dataAiHint: string;
  isTheme?: boolean;
  isLightTheme?: boolean;
  themeClass?: string;
}

export interface NotepadTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  tags?: string[];
  quadrant?: 'do' | 'schedule' | 'delegate' | 'eliminate';
}

export interface NotepadNote {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  createdAt: number;
  tags?: string[];
}

export interface NotepadGoal {
  id: string;
  text: string;
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: number;
  tags?: string[];
  quadrant?: 'do' | 'schedule' | 'delegate' | 'eliminate';
}

export interface NotepadLink {
  id: string;
  url: string;
  description: string;
  createdAt: number;
  tags?: string[];
}

export interface RevisionConcept {
  id: string;
  name: string;
  learnedDate: string; // YYYY-MM-DD
  lastRevisedDate: string; // YYYY-MM-DD
  nextRevisionDate: string; // YYYY-MM-DD
  revisionStage: number; // 0, 1, 2, 3, 4 etc.
  tags?: string[];
}

export type HabitFrequency = 'daily' | 'weekly';
export interface HabitLogEntry {
  date: string; // YYYY-MM-DD for daily, or YYYY-WW (week number) for weekly
  completed: boolean;
  count?: number; // For weekly habits that have a target count
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  targetCompletions?: number; // e.g., "exercise 3 times a week"
  color?: string; // Optional: for UI theming
  createdAt: number;
  log: Record<string, HabitLogEntry>; // Key is date string (YYYY-MM-DD or YYYY-WW)
  currentStreak: number;
  longestStreak: number;
}

export interface NotepadCountdownEvent {
  id: string;
  name: string;
  targetDate: string; // ISO string format (YYYY-MM-DDTHH:mm:ss.sssZ)
  createdAt: number; // Unix timestamp in milliseconds
  tags?: string[];
}

export interface NotepadData {
  tasks: NotepadTask[];
  notes: NotepadNote[];
  goals: NotepadGoal[];
  links: NotepadLink[];
  revisionConcepts: RevisionConcept[];
  habits: Habit[];
  countdownEvents: NotepadCountdownEvent[];
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  cashReward: number;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  rewardClaimed: boolean;
  type: 'focusCycles' | 'studyDurationMinutes' | 'tasksCompleted' | 'studyStreak' | 'ambianceUsage' | 'notepadEntry' | 'habitCompletions';
  resetsDaily: boolean;
  lastProgressUpdate?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  cashReward: number;
  criteria: (
    profile: UserProfile,
    sessions: StudySession[],
  ) => boolean;
  category?: 'General' | 'Study Time' | 'Pomodoro' | 'Progression' | 'Collection' | 'Streaks & Challenges' | 'Capitalist' | 'Notepad & Revision' | 'Habits';
}

export interface AmbientSound {
  id: string;
  name: string;
  filePath: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type FeatureKey =
  | 'timers'
  | 'skill-tree'
  | 'stats'
  | 'ambiance'
  | 'notepad'
  | 'challenges'
  | 'shop'
  | 'capitalist'
  | 'achievements'
  | 'about'
  | 'infamy'
  | 'notepadChecklist'
  | 'notepadNotes'
  | 'notepadGoals'
  | 'notepadLinks'
  | 'notepadRevision'
  | 'notepadHabits'
  | 'notepadEvents'
  | 'notepadEisenhower';

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number;
  iconName: string;
  prerequisiteLevel?: number;
  prerequisiteSkillIds?: string[];
  unlocksFeature?: FeatureKey;
  xpBoostPercent?: number;
  cashBoostPercent?: number;
  shopDiscountPercent?: number;
  otherEffect?: string;
  category?: 'Core Feature' | 'Notepad Feature' | 'Passive Boost' | 'Utility' | 'Infinite' | 'Infamy';
}

export interface FloatingGain {
  id: string;
  type: 'xp' | 'cash';
  amount: number;
  timestamp: number;
}

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesPerLongBreak: number;
}

export interface PomodoroState {
  mode: PomodoroMode;
  isRunning: boolean;
  cyclesCompleted: number;
  settings: PomodoroSettings;
  sessionStartTime: number;
  sessionEndTime: number;
}

export interface StopwatchState {
  timeElapsedOnPause: number; // Time in ms accumulated before the current run.
  isRunning: boolean;
  sessionStartTime: number | null; // Timestamp in ms of when the current run started.
}

export interface CountdownState {
  isRunning: boolean;
  timeLeftOnPause: number; // in ms
  initialDuration: number; // in ms
  sessionStartTime: number | null;
}
