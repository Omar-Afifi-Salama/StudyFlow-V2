
"use client";

import { useSessions } from '@/contexts/SessionContext';

/**
 * A hook that provides state and actions for the Stopwatch timer.
 * This hook acts as a simple proxy to the central timer state managed in SessionContext,
 * ensuring timer persistence across the application.
 */
export function useStopwatch() {
  const {
    stopwatchState,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    logStopwatchSession
  } = useSessions();

  return {
    timeElapsed: stopwatchState.timeElapsed,
    isRunning: stopwatchState.isRunning,
    start: startStopwatch,
    stop: pauseStopwatch, // 'stop' is an alias for 'pause' in this hook
    reset: resetStopwatch,
    logSession: logStopwatchSession,
  };
}
