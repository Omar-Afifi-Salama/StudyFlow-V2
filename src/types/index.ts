
export interface StudySession {
  id: string;
  type: 'Stopwatch' | 'Pomodoro Focus' | 'Pomodoro Break';
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // in seconds
  description?: string; // User-added description
  tags?: string[]; // New: Tags for sessions
}

export type TimerMode = 'stopwatch' | 'pomodoro';

export interface UserProfile {
  xp: number;
  cash: number; 
  level: number;
  title: string;
  ownedSkinIds: string[];
  equippedSkinId: string | null;
  completedChallengeIds?: string[];
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null; // YYYY-MM-DD format
  wakeUpTime?: { hour: number; period: 'AM' | 'PM' }; // New
  sleepTime?: { hour: number; period: 'AM' | 'PM' };  // New
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
}

export interface NotepadTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  tags?: string[]; // New
}

export interface NotepadNote {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  createdAt: number;
  tags?: string[]; // New
}

export interface NotepadGoal {
  id: string;
  text: string;
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: number;
  tags?: string[]; // New
}

export interface NotepadLink {
  id: string;
  url: string;
  description: string;
  createdAt: number;
  tags?: string[]; // New
}

export interface NotepadData {
  tasks: NotepadTask[];
  notes: NotepadNote[];
  goals: NotepadGoal[];
  links: NotepadLink[];
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
