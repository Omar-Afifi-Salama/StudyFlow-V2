export interface StudySession {
  id: string;
  type: 'Stopwatch' | 'Pomodoro Focus' | 'Pomodoro Break';
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // in seconds
}

export type TimerMode = 'stopwatch' | 'pomodoro';

export interface UserProfile {
  xp: number;
  cash: number;
  level: number;
  title: string;
  ownedSkinIds: string[];
  equippedSkinId: string | null;
}

export interface Skin {
  id: string;
  name: string;
  description: string;
  price: number;
  levelRequirement: number;
  imageUrl: string;
  dataAiHint: string;
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
  id: string; // Could be a single ID like 'main_note' if only one note is supported
  content: string;
  lastModified: number;
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
  notes: NotepadNote[]; // Or a single NotepadNote if only one is supported
  goals: NotepadGoal[];
  links: NotepadLink[];
}
