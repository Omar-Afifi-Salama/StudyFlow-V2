
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
  cash: number;
  level: number;
  title: string;
  ownedSkinIds: string[];
  equippedSkinId: string | null;
  completedChallengeIds?: string[]; // Tracks IDs of challenges for which reward was claimed
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  price: number;
  levelRequirement: number;
  imageUrl: string;
  dataAiHint: string;
  isTheme?: boolean; // Indicates if this skin primarily applies a theme (like dark mode)
}

export interface CapitalistOffer {
  id: string;
  name: string;
  description: string;
  investmentAmount: number;
  minRoiPercent: number; // e.g., -50 for a 50% loss potential
  maxRoiPercent: number; // e.g., 100 for a 100% gain potential
  volatilityFactor: number; // 0 to 1, higher means more chance of hitting extremes
  durationHours: number; // How long the offer is available or valid
  expiresAt?: number; // Timestamp for when this offer instance disappears
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
  cashReward: number;
  targetValue: number; // e.g., 60 (minutes), 2 (cycles)
  currentValue: number;
  isCompleted: boolean; // True if targetValue reached
  rewardClaimed: boolean; // True if user clicked "Claim Reward"
  type: 'pomodoroCycles' | 'studyDurationMinutes' | 'tasksCompleted';
  resetsDaily: boolean; // If true, progress resets daily
  lastProgressUpdate?: number; // Timestamp of last progress
}
