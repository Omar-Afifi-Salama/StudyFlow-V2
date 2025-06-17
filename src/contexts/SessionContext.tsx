
"use client";

import type { StudySession, UserProfile, Skin, CapitalistOffer, NotepadTask, NotepadNote, NotepadGoal, NotepadLink, NotepadData } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const XP_PER_MINUTE_FOCUS = 10;
const CASH_PER_5_MINUTES_FOCUS = 1;

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800, 4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300, // Levels 1-20
  19200, 21200, 23300, 25500, 27800, 30200, 32700, 35300, 38000, 40800, // Levels 21-30
]; // XP needed for next level

const TITLES = [
  "Newbie", "Learner", "Student", "Scholar", "Adept", "Prodigy", "Savant", "Sage", "Guru", "Master", // Up to level 10
  "Grandmaster Learner", "Erudite Student", "Luminous Scholar", "Distinguished Adept", "Virtuoso Prodigy", // 11-15
  "Enlightened Savant", "Venerable Sage", "Zenith Guru", "Ascendant Master", "Study God" // 16-20
  // Add more titles for higher levels if LEVEL_THRESHOLDS is extended
];

export const PREDEFINED_SKINS: Skin[] = [
  { id: 'classic', name: 'Classic Blue', description: 'The default, calming blue theme.', price: 0, levelRequirement: 1, imageUrl: 'https://placehold.co/300x200/6FB5F0/FFFFFF.png', dataAiHint: 'blue gradient' },
  { id: 'forest', name: 'Forest Whisper', description: 'Earthy tones for deep concentration.', price: 100, levelRequirement: 3, imageUrl: 'https://placehold.co/300x200/2F4F4F/90EE90.png', dataAiHint: 'forest pattern' },
  { id: 'sunset', name: 'Sunset Vibes', description: 'Warm colors to keep you motivated.', price: 150, levelRequirement: 5, imageUrl: 'https://placehold.co/300x200/FF8C00/FFD700.png', dataAiHint: 'sunset gradient' },
  { id: 'galaxy', name: 'Galaxy Quest', description: 'Explore the universe of knowledge.', price: 300, levelRequirement: 7, imageUrl: 'https://placehold.co/300x200/483D8B/E6E6FA.png', dataAiHint: 'galaxy stars' },
  { id: 'mono', name: 'Monochrome Focus', description: 'Minimalist black and white.', price: 200, levelRequirement: 8, imageUrl: 'https://placehold.co/300x200/333333/F5F5F5.png', dataAiHint: 'grayscale pattern' },
  { id: 'ocean', name: 'Ocean Depths', description: 'Dive deep into your studies.', price: 250, levelRequirement: 10, imageUrl: 'https://placehold.co/300x200/20B2AA/AFEEEE.png', dataAiHint: 'ocean waves' },
  { id: 'neon', name: 'Neon Grid', description: 'Retro-futuristic study zone.', price: 400, levelRequirement: 12, imageUrl: 'https://placehold.co/300x200/FF00FF/00FFFF.png', dataAiHint: 'neon grid' },
  { id: 'pastel', name: 'Pastel Dreams', description: 'Soft and gentle study environment.', price: 350, levelRequirement: 15, imageUrl: 'https://placehold.co/300x200/FFB6C1/ADD8E6.png', dataAiHint: 'pastel colors' },
  { id: 'gold', name: 'Golden Achiever', description: 'For those who shine.', price: 1000, levelRequirement: 18, imageUrl: 'https://placehold.co/300x200/FFD700/B8860B.png', dataAiHint: 'gold texture' },
  { id: 'elite', name: 'Elite Scholar', description: 'The ultimate focus skin.', price: 2000, levelRequirement: 20, imageUrl: 'https://placehold.co/300x200/1A237E/C5CAE9.png', dataAiHint: 'dark blue elegant' },
];


const DEFAULT_USER_PROFILE: UserProfile = {
  xp: 0,
  cash: 50, // Starting cash
  level: 1,
  title: TITLES[0],
  ownedSkinIds: ['classic'],
  equippedSkinId: 'classic',
};

const DEFAULT_NOTEPAD_DATA: NotepadData = {
  tasks: [],
  notes: [{ id: 'main_note', content: '', lastModified: Date.now() }],
  goals: [],
  links: [],
};

interface SessionContextType {
  sessions: StudySession[];
  addSession: (sessionDetails: { type: StudySession['type']; startTime: number; durationInSeconds: number }) => void;
  clearSessions: () => void;
  userProfile: UserProfile;
  notepadData: NotepadData;
  updateNotepadData: (newData: Partial<NotepadData>) => void;
  getSkinById: (id: string) => Skin | undefined;
  buySkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => void;
  isSkinOwned: (skinId: string) => boolean;
  capitalistOffers: CapitalistOffer[];
  ensureCapitalistOffers: () => void;
  investInOffer: (offerId: string, investmentAmount: number) => { success: boolean; message: string; profit?: number };
  lastOfferGenerationTime: number | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [notepadData, setNotepadData] = useState<NotepadData>(DEFAULT_NOTEPAD_DATA);
  const [capitalistOffers, setCapitalistOffers] = useState<CapitalistOffer[]>([]);
  const [lastOfferGenerationTime, setLastOfferGenerationTime] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(() => {
    try {
      const storedSessions = localStorage.getItem('studySessions');
      if (storedSessions) setSessions(JSON.parse(storedSessions));

      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      else setUserProfile(DEFAULT_USER_PROFILE);
      
      const storedNotepad = localStorage.getItem('notepadData');
      if (storedNotepad) setNotepadData(JSON.parse(storedNotepad));
      else setNotepadData(DEFAULT_NOTEPAD_DATA);

      const storedOffers = localStorage.getItem('capitalistOffers');
      if (storedOffers) setCapitalistOffers(JSON.parse(storedOffers));

      const storedOfferTime = localStorage.getItem('lastOfferGenerationTime');
      if (storedOfferTime) setLastOfferGenerationTime(parseInt(storedOfferTime, 10));

    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      setUserProfile(DEFAULT_USER_PROFILE); // Reset to default if loading fails
      setNotepadData(DEFAULT_NOTEPAD_DATA);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('studySessions', JSON.stringify(sessions));
        localStorage.setItem('userProfile', JSON.stringify(userProfile));
        localStorage.setItem('notepadData', JSON.stringify(notepadData));
        localStorage.setItem('capitalistOffers', JSON.stringify(capitalistOffers));
        if (lastOfferGenerationTime) {
          localStorage.setItem('lastOfferGenerationTime', lastOfferGenerationTime.toString());
        } else {
          localStorage.removeItem('lastOfferGenerationTime');
        }
      } catch (error) {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [sessions, userProfile, notepadData, capitalistOffers, lastOfferGenerationTime, isLoaded]);

  const checkForLevelUp = useCallback((currentXp: number, currentLevel: number) => {
    let newLevel = currentLevel;
    let newTitle = TITLES[currentLevel -1] || TITLES[TITLES.length -1];
    let leveledUp = false;

    while (newLevel < LEVEL_THRESHOLDS.length && currentXp >= LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
      leveledUp = true;
    }
    
    if (leveledUp) {
      newTitle = TITLES[newLevel - 1] || TITLES[TITLES.length -1]; // Get title for the new level
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached Level ${newLevel}: ${newTitle}.`,
      });
    }
    return { newLevel, newTitle, leveledUp };
  }, [toast]);

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

    // Award XP and Cash
    let awardedXp = 0;
    let awardedCash = 0;
    if (sessionDetails.type === 'Pomodoro Focus' || sessionDetails.type === 'Stopwatch') {
      const minutesStudied = sessionDetails.durationInSeconds / 60;
      awardedXp = Math.floor(minutesStudied * XP_PER_MINUTE_FOCUS);
      awardedCash = Math.floor(minutesStudied / 5 * CASH_PER_5_MINUTES_FOCUS);
    }

    if (awardedXp > 0 || awardedCash > 0) {
      setUserProfile(prevProfile => {
        const newXp = prevProfile.xp + awardedXp;
        const { newLevel, newTitle, leveledUp } = checkForLevelUp(newXp, prevProfile.level);
        
        if(awardedXp > 0 && awardedCash > 0) {
            toast({ title: "Session Rewards", description: `+${awardedXp} XP, +${awardedCash} Cash` });
        } else if (awardedXp > 0) {
            toast({ title: "Session Rewards", description: `+${awardedXp} XP` });
        } else if (awardedCash > 0) {
            toast({ title: "Session Rewards", description: `+${awardedCash} Cash` });
        }


        return {
          ...prevProfile,
          xp: newXp,
          cash: prevProfile.cash + awardedCash,
          level: newLevel,
          title: newTitle,
        };
      });
    }
  }, [checkForLevelUp, toast]);

  const clearSessions = useCallback(() => {
    setSessions([]);
    // Optionally, reset user profile stats related to sessions if desired, but typically not.
    // setUserProfile(prev => ({...prev, xp: 0, cash: 0, level: 1, title: TITLES[0]})); // Example reset
  }, []);

  const getSkinById = useCallback((id: string) => {
    return PREDEFINED_SKINS.find(skin => skin.id === id);
  }, []);

  const isSkinOwned = useCallback((skinId: string) => {
    return userProfile.ownedSkinIds.includes(skinId);
  }, [userProfile.ownedSkinIds]);

  const buySkin = useCallback((skinId: string) => {
    const skin = getSkinById(skinId);
    if (!skin) {
      toast({ title: "Error", description: "Skin not found.", variant: "destructive" });
      return false;
    }
    if (isSkinOwned(skinId)) {
      toast({ title: "Already Owned", description: "You already own this skin." });
      return false;
    }
    if (userProfile.cash < skin.price) {
      toast({ title: "Not Enough Cash", description: `You need ${skin.price} cash. You have ${userProfile.cash}.`, variant: "destructive" });
      return false;
    }
    if (userProfile.level < skin.levelRequirement) {
      toast({ title: "Level Too Low", description: `You need to be Level ${skin.levelRequirement}. You are Level ${userProfile.level}.`, variant: "destructive" });
      return false;
    }

    setUserProfile(prev => ({
      ...prev,
      cash: prev.cash - skin.price,
      ownedSkinIds: [...prev.ownedSkinIds, skinId],
    }));
    toast({ title: "Purchase Successful!", description: `You bought ${skin.name}.` });
    return true;
  }, [userProfile, getSkinById, isSkinOwned, toast]);

  const equipSkin = useCallback((skinId: string) => {
    if (!isSkinOwned(skinId)) {
      toast({ title: "Error", description: "You don't own this skin.", variant: "destructive" });
      return;
    }
    setUserProfile(prev => ({ ...prev, equippedSkinId: skinId }));
    const skin = getSkinById(skinId);
    toast({ title: "Skin Equipped!", description: `${skin?.name || 'Skin'} is now active.` });
  }, [isSkinOwned, getSkinById, toast]);

  const updateNotepadData = useCallback((newData: Partial<NotepadData>) => {
    setNotepadData(prev => ({ ...prev, ...newData, notes: newData.notes || prev.notes.map(n => n.id === 'main_note' ? {...n, lastModified: Date.now()} : n) }));
  }, []);

  const generateOffers = (): CapitalistOffer[] => {
    const baseOffers: Omit<CapitalistOffer, 'id' | 'expiresAt'>[] = [
      { name: "Safe Bet Startup", description: "Low risk, low reward tech investment.", investmentAmount: 50, minRoiPercent: 5, maxRoiPercent: 20, volatilityFactor: 0.2, durationHours: 24 },
      { name: "Crypto Gamble", description: "High risk, high reward digital currency.", investmentAmount: 100, minRoiPercent: -80, maxRoiPercent: 200, volatilityFactor: 0.8, durationHours: 24 },
      { name: "Real Estate Flip", description: "Moderate risk, steady gains.", investmentAmount: 200, minRoiPercent: -10, maxRoiPercent: 50, volatilityFactor: 0.4, durationHours: 24 },
      { name: "Meme Stock Madness", description: "To the moon or bust!", investmentAmount: 75, minRoiPercent: -95, maxRoiPercent: 500, volatilityFactor: 0.95, durationHours: 24 },
      { name: "Blue Chip Bonds", description: "Slow and steady wins the race.", investmentAmount: 300, minRoiPercent: 1, maxRoiPercent: 10, volatilityFactor: 0.1, durationHours: 24 },
      { name: "Emerging Market Fund", description: "Potential for growth, with some uncertainty.", investmentAmount: 150, minRoiPercent: -30, maxRoiPercent: 70, volatilityFactor: 0.6, durationHours: 24 },
    ];
    // Shuffle and pick 3
    const shuffled = [...baseOffers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(offer => ({
      ...offer,
      id: crypto.randomUUID(),
      expiresAt: Date.now() + offer.durationHours * 60 * 60 * 1000,
    }));
  };

  const ensureCapitalistOffers = useCallback(() => {
    const now = Date.now();
    if (!lastOfferGenerationTime || now - lastOfferGenerationTime > 24 * 60 * 60 * 1000 || capitalistOffers.some(o => o.expiresAt && o.expiresAt < now)) {
      const newOffers = generateOffers();
      setCapitalistOffers(newOffers);
      setLastOfferGenerationTime(now);
    }
  }, [lastOfferGenerationTime, capitalistOffers]);

  const investInOffer = useCallback((offerId: string, investmentAmount: number) => {
    const offer = capitalistOffers.find(o => o.id === offerId);
    if (!offer) return { success: false, message: "Offer not found." };
    if (userProfile.cash < investmentAmount) return { success: false, message: "Not enough cash." };
    if (investmentAmount !== offer.investmentAmount) return {success: false, message: `Investment must be exactly ${offer.investmentAmount} cash.`};


    // Simulate ROI
    const randomFactor = Math.random(); // 0 to 1
    let actualRoiPercent: number;

    // Weighted randomness based on volatility
    if (Math.random() < offer.volatilityFactor) {
      // Higher chance to hit extremes
      actualRoiPercent = Math.random() < 0.5 ? offer.minRoiPercent : offer.maxRoiPercent;
    } else {
      // More likely to be somewhere in the middle
       actualRoiPercent = offer.minRoiPercent + (offer.maxRoiPercent - offer.minRoiPercent) * randomFactor;
    }
    
    const profit = Math.round(investmentAmount * (actualRoiPercent / 100));
    const newCash = userProfile.cash - investmentAmount + profit;

    setUserProfile(prev => ({ ...prev, cash: newCash }));
    
    // Remove invested offer
    setCapitalistOffers(prevOffers => prevOffers.filter(o => o.id !== offerId));

    const message = profit >= 0 ? `Investment successful! You gained ${profit} cash.` : `Investment risky... You lost ${Math.abs(profit)} cash.`;
    toast({ title: "Investment Result", description: message });
    return { success: true, message, profit };

  }, [capitalistOffers, userProfile.cash, toast]);


  if (!isLoaded) {
    return null; 
  }

  return (
    <SessionContext.Provider value={{ 
      sessions, addSession, clearSessions, 
      userProfile, 
      notepadData, updateNotepadData,
      getSkinById, buySkin, equipSkin, isSkinOwned,
      capitalistOffers, ensureCapitalistOffers, investInOffer, lastOfferGenerationTime
    }}>
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
