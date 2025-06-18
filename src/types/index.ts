
export interface StudySession {
  id: string;
  type: 'Stopwatch' | 'Pomodoro Focus' | 'Pomodoro Break';
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // in seconds
  description?: string; // User-added description
  tags?: string[];
  isFullPomodoroCycle?: boolean; // True if a Pomodoro focus session completed its full intended duration
}

export type TimerMode = 'stopwatch' | 'pomodoro';

export interface UserProfile {
  xp: number;
  cash: number;
  level: number;
  title: string;
  ownedSkinIds: string[];
  equippedSkinId: string | null;
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
  skillPoints: number; // New: For skill tree
  unlockedSkillIds: string[]; // New: IDs of unlocked skills
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
  themeClass?: 'dark' | 'sepia';
}

export interface CapitalistOffer {
  id: string;
  name: string;
  description: string;
  minInvestmentAmount: number;
  maxInvestmentAmount?: number;
  minRoiPercent: number;
  maxRoiPercent: number;
  volatilityFactor: number;
  durationHours: number;
  expiresAt?: number;
  completionBonusCash?: number;
}

export interface NotepadTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  tags?: string[];
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
  count?: number; // For weekly habits that might have a target count
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
  type: 'pomodoroCycles' | 'studyDurationMinutes' | 'tasksCompleted' | 'studyStreak' | 'ambianceUsage' | 'notepadEntry' | 'habitCompletions';
  resetsDaily: boolean;
  lastProgressUpdate?: number;
}

export interface AchievementCriteriaInvestmentPayload {
  firstInvestmentMade: boolean;
  totalProfit: number;
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
    challenges: DailyChallenge[],
    investmentStats: AchievementCriteriaInvestmentPayload
  ) => boolean;
  category?: 'General' | 'Study Time' | 'Pomodoro' | 'Progression' | 'Collection' | 'Streaks & Challenges' | 'Capitalist' | 'Notepad & Revision' | 'Habits';
}

export interface AmbientSound {
  id: string;
  name: string;
  filePath: string;
  icon: React.ComponentType<{ className?: string }>;
}

// New: Skill Tree related types
export type FeatureKey = 
  | 'stats' 
  | 'ambiance' 
  | 'notepad' 
  | 'challenges' 
  | 'shop' 
  | 'capitalist' 
  | 'countdown' 
  | 'achievements' 
  | 'about';

export interface Skill {
  id: string;
  name: string;
  description: string;
  cost: number; // Skill points needed
  iconName: string; // Lucide icon name
  prerequisiteLevel?: number;
  prerequisiteSkillIds?: string[];
  unlocksFeature?: FeatureKey; // Key of the feature this skill unlocks
  xpBoostPercent?: number; // e.g., 0.05 for +5%
  cashBoostPercent?: number; // e.g., 0.05 for +5%
  shopDiscountPercent?: number;
  otherEffect?: string; // For unique effects like "Streak Shield"
}

export interface FloatingGain {
  id: string;
  type: 'xp' | 'cash';
  amount: number;
  timestamp: number;
}
