"use client";

import type { StudySession } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface SessionContextType {
  sessions: StudySession[];
  addSession: (sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number }) => void;
  clearSessions: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('studySessions');
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.error("Failed to load sessions from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
      } catch (error) {
        console.error("Failed to save sessions to localStorage:", error);
      }
    }
  }, [sessions, isLoaded]);

  const addSession = useCallback((sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number }) => {
    if (sessionDetails.durationInSeconds <= 0) {
      console.warn("Attempted to log a session with zero or negative duration.");
      return;
    }
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      type: sessionDetails.type,
      startTime: sessionDetails.startTime,
      endTime: sessionDetails.startTime + sessionDetails.durationInSeconds * 1000,
      duration: sessionDetails.durationInSeconds,
    };
    setSessions(prevSessions => [newSession, ...prevSessions]);
  }, []);

  const clearSessions = useCallback(() => {
    setSessions([]);
  }, []);

  if (!isLoaded) {
    return null; // Or a loading spinner, to prevent flash of unstyled content or default state
  }

  return (
    <SessionContext.Provider value={{ sessions, addSession, clearSessions }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
};
