"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export function useStopwatch() {
  const [timeElapsed, setTimeElapsed] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now() - timeElapsed * 1000;
      timerRef.current = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
  }, [isRunning, timeElapsed]);

  const stop = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      // Ensure final time is captured accurately
      setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    stop();
    setTimeElapsed(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { timeElapsed, isRunning, start, stop, reset };
}
