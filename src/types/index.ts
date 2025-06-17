

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
  revisionConcepts: RevisionConcept[];
  lastLoginDate: string | null; // YYYY-MM-DD format for daily login bonus
  dailyLoginStreak: number; // For daily login bonus
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

export interface NotepadData {
  tasks: NotepadTask[];
  notes: NotepadNote[];
  goals: NotepadGoal[];
  links: NotepadLink[];
  revisionConcepts: RevisionConcept[];
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
  type: 'pomodoroCycles' | 'studyDurationMinutes' | 'tasksCompleted' | 'studyStreak';
  resetsDaily: boolean; 
  lastProgressUpdate?: number; 
}

// Payload for achievement criteria related to capitalist feature
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
}

// For Ambiance Mixer
export interface AmbientSound {
  id: string;
  name: string;
  filePath: string; 
  icon: React.ComponentType<{ className?: string }>;
}


    