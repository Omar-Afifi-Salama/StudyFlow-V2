
"use client";

import { useSessions } from '@/contexts/SessionContext';

/**
 * A hook that provides state and actions for the Pomodoro timer.
 * This hook acts as a simple proxy to the central timer state managed in SessionContext,
 * ensuring timer persistence across the application.
 */
export function usePomodoro() {
  const {
    pomodoroState,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    switchPomodoroMode,
    updatePomodoroSettings,
    logPomodoroSession
  } = useSessions();

  return {
    timeLeft: pomodoroState.timeLeft,
    mode: pomodoroState.mode,
    isRunning: pomodoroState.isRunning,
    cyclesCompleted: pomodoroState.cyclesCompleted,
    settings: pomodoroState.settings,
    startTimer: startPomodoro,
    pauseTimer: pausePomodoro,
    resetTimer: resetPomodoro,
    switchMode: switchPomodoroMode,
    setSettings: updatePomodoroSettings,
    logSession: logPomodoroSession,
    sessionStartTimeRef: { current: pomodoroState.sessionStartTime }, // For compatibility with components expecting a ref
  };
}
