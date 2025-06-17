"use client";
import { useState, useEffect, useCallback, useRef } from 'react';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  cyclesPerLongBreak: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesPerLongBreak: 4,
};

export function usePomodoro(initialSettings?: Partial<PomodoroSettings>) {
  const [settings, setSettings] = useState<PomodoroSettings>({ ...DEFAULT_SETTINGS, ...initialSettings });
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number>(0);

  const updateTimerForMode = useCallback((newMode: PomodoroMode, currentCycles: number, newSettings: PomodoroSettings) => {
    switch (newMode) {
      case 'work':
        setTimeLeft(newSettings.workDuration * 60);
        break;
      case 'shortBreak':
        setTimeLeft(newSettings.shortBreakDuration * 60);
        break;
      case 'longBreak':
        setTimeLeft(newSettings.longBreakDuration * 60);
        break;
    }
  }, []);

  useEffect(() => {
    updateTimerForMode(mode, cyclesCompleted, settings);
  }, [settings, updateTimerForMode]);


  const startTimer = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      sessionStartTimeRef.current = Date.now() - ((getDurationForMode(mode, settings) * 60) - timeLeft) * 1000;
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // Time's up, handle mode transition
            // This logic will be enhanced in the component or via a callback
            return 0; 
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  }, [isRunning, mode, settings, timeLeft]);

  const pauseTimer = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    pauseTimer();
    updateTimerForMode(mode, cyclesCompleted, settings);
  }, [pauseTimer, mode, cyclesCompleted, settings, updateTimerForMode]);

  const switchMode = useCallback((nextMode?: PomodoroMode) => {
    pauseTimer();
    let newMode: PomodoroMode = 'work';
    let newCyclesCompleted = cyclesCompleted;

    if (nextMode) { // Manual switch
        newMode = nextMode;
        if (newMode === 'work' && mode !== 'work') {
             // if switching to work from break, don't increment cycle
        } else if (mode === 'work' && newMode !== 'work') {
            newCyclesCompleted = cyclesCompleted + 1;
        }

    } else { // Automatic switch
        if (mode === 'work') {
            newCyclesCompleted = cyclesCompleted + 1;
            if (newCyclesCompleted % settings.cyclesPerLongBreak === 0) {
            newMode = 'longBreak';
            } else {
            newMode = 'shortBreak';
            }
        } else { // current mode is 'shortBreak' or 'longBreak'
            newMode = 'work';
        }
    }
    
    setMode(newMode);
    setCyclesCompleted(newCyclesCompleted);
    updateTimerForMode(newMode, newCyclesCompleted, settings);
    setIsRunning(false); // Stay paused after mode switch
  }, [pauseTimer, mode, cyclesCompleted, settings, updateTimerForMode]);
  

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getDurationForMode = (currentMode: PomodoroMode, currentSettings: PomodoroSettings) => {
    switch (currentMode) {
      case 'work': return currentSettings.workDuration;
      case 'shortBreak': return currentSettings.shortBreakDuration;
      case 'longBreak': return currentSettings.longBreakDuration;
      default: return 0;
    }
  };
  
  const currentSessionTotalDuration = getDurationForMode(mode, settings) * 60; // in seconds
  const currentSessionElapsedTime = currentSessionTotalDuration - timeLeft;


  return {
    timeLeft,
    mode,
    isRunning,
    cyclesCompleted,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setSettings,
    sessionStartTimeRef,
    currentSessionElapsedTime,
    currentSessionTotalDuration
  };
}

