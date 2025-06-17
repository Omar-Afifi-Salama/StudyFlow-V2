
export interface StudySession {
  id: string;
  type: 'Stopwatch' | 'Pomodoro Focus' | 'Pomodoro Break';
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // in seconds
  description?: string; // User-added description
}

export type TimerMode = 'stopwatch' | 'pomodoro';

export interface UserProfile {
  xp: number;
  cash: number; // Changed from coins to a general number, displayed as $
  level: number;
  title: string;
  ownedSkinIds: string[];
  equippedSkinId: string | null;
  completedChallengeIds?: string[];
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null; // YYYY-MM-DD format
  geminiApiKey?: string | null; // For AI Chat
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  price: number; // Will be scaled up for dollars
  levelRequirement: number;
  imageUrl: string;
  dataAiHint: string;
  isTheme?: boolean;
}

export interface CapitalistOffer {
  id: string;
  name: string;
  description: string;
  minInvestmentAmount: number; // Minimum required to invest
  maxInvestmentAmount?: number; // Optional: Max they can invest in this offer
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
}

export interface NotepadNote {
  id: string;
  title: string;
  content: string;
  lastModified: number;
  createdAt: number;
}

export interface NotepadGoal {
  id: string;
  text: string;
  dueDate?: string; // YYYY-MM-DD
  completed: boolean;
  createdAt: number;
}

export interface NotepadLink {
  id: string;
  url: string;
  description: string;
  createdAt: number;
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
  cashReward: number; // Will be scaled up for dollars
  targetValue: number; 
  currentValue: number;
  isCompleted: boolean; 
  rewardClaimed: boolean; 
  type: 'pomodoroCycles' | 'studyDurationMinutes' | 'tasksCompleted' | 'studyStreak';
  resetsDaily: boolean; 
  lastProgressUpdate?: number; 
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}
