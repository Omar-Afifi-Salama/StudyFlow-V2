export interface StudySession {
  id: string;
  type: 'Stopwatch' | 'Pomodoro Focus' | 'Pomodoro Break';
  startTime: number; // Unix timestamp in milliseconds
  endTime: number;   // Unix timestamp in milliseconds
  duration: number;  // in seconds
}

export type TimerMode = 'stopwatch' | 'pomodoro';
