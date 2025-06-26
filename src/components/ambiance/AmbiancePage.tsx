
"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import type { AmbientSound } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause, Waves, Wind, CloudRain, Coffee as CoffeeIcon, Moon, TreePine, Flame, Lock, Speaker } from 'lucide-react'; 
import { useSessions } from '@/contexts/SessionContext';
import Link from 'next/link';

// Locally hosted sounds for reliability
const AVAILABLE_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Gentle Rain', filePath: '/sounds/rain.mp3', icon: CloudRain, isPremium: false },
  { id: 'cafe', name: 'Busy Cafe', filePath: '/sounds/cafe.mp3', icon: CoffeeIcon, isPremium: false },
  { id: 'waves', name: 'Ocean Waves', filePath: '/sounds/waves.mp3', icon: Waves, isPremium: false },
  { id: 'whitenoise', name: 'White Noise', filePath: '/sounds/whitenoise.mp3', icon: Moon, isPremium: false },
  { id: 'wind', name: 'Soft Wind', filePath: '/sounds/wind.mp3', icon: Wind, isPremium: true },
  { id: 'forest', name: 'Forest Night', filePath: '/sounds/forest.mp3', icon: TreePine, isPremium: true },
  { id: 'fireplace', name: 'Crackling Fire', filePath: '/sounds/fireplace.mp3', icon: Flame, isPremium: true },
  { id: 'brown-noise', name: 'Brown Noise', filePath: '/sounds/brown-noise.mp3', icon: Speaker, isPremium: true },
];

interface AudioPlayerState {
  isPlaying: boolean;
  volume: number; // 0-1
}

export default function AmbiancePage() {
  const [masterVolume, setMasterVolume] = useState(0.5);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const audioPlayersRef = useRef<Record<string, HTMLAudioElement | null>>({});
  const [playerStates, setPlayerStates] = useState<Record<string, AudioPlayerState>>(
    AVAILABLE_SOUNDS.reduce((acc, sound) => {
      acc[sound.id] = { isPlaying: false, volume: 0.5 };
      return acc;
    }, {} as Record<string, AudioPlayerState>)
  );
  const { updateChallengeProgress, isUtilityItemOwned } = useSessions();
  const usageTrackerRef = useRef<NodeJS.Timeout | null>(null);
  const activeUsageStartTimeRef = useRef<number | null>(null);

  const hasPremiumAccess = isUtilityItemOwned('sound_pack_premium');

  // Initialize Audio elements
  useEffect(() => {
    AVAILABLE_SOUNDS.forEach(sound => {
      if (!audioPlayersRef.current[sound.id]) {
        const audio = new Audio(sound.filePath);
        audio.loop = true;
        audio.crossOrigin = "anonymous";
        audioPlayersRef.current[sound.id] = audio;
      }
    });

    return () => { // Cleanup on unmount
      Object.values(audioPlayersRef.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = ''; 
        }
      });
      audioPlayersRef.current = {};
      if (usageTrackerRef.current) clearInterval(usageTrackerRef.current);
    };
  }, []);

  const updateAudioProperties = useCallback((soundId: string, state: AudioPlayerState) => {
    const audio = audioPlayersRef.current[soundId];
    if (audio) {
      audio.volume = isMasterMuted ? 0 : masterVolume * state.volume;
      if (state.isPlaying && audio.paused) {
        audio.play().catch(e => console.error("Error playing audio for " + soundId + ":", e));
      } else if (!state.isPlaying && !audio.paused) {
        audio.pause();
      }
    }
  }, [masterVolume, isMasterMuted]);

  // Effect to update audio elements when states or master volume/mute change
  useEffect(() => {
    Object.entries(playerStates).forEach(([soundId, state]) => {
      updateAudioProperties(soundId, state);
    });

    // Challenge progress tracking
    const anySoundPlaying = Object.values(playerStates).some(s => s.isPlaying);
    if (anySoundPlaying && !activeUsageStartTimeRef.current) {
        activeUsageStartTimeRef.current = Date.now();
    } else if (!anySoundPlaying && activeUsageStartTimeRef.current) {
        const durationMs = Date.now() - activeUsageStartTimeRef.current;
        updateChallengeProgress('ambianceUsage', Math.floor(durationMs / (1000 * 60)));
        activeUsageStartTimeRef.current = null;
    }

    if (anySoundPlaying && !usageTrackerRef.current) {
      usageTrackerRef.current = setInterval(() => {
        if (activeUsageStartTimeRef.current) {
          const durationSinceLastTickMs = Date.now() - activeUsageStartTimeRef.current;
          if(durationSinceLastTickMs > 0) {
            updateChallengeProgress('ambianceUsage', Math.floor(durationSinceLastTickMs / (1000 * 60)));
            activeUsageStartTimeRef.current = Date.now();
          }
        }
      }, 60000);
    } else if (!anySoundPlaying && usageTrackerRef.current) {
      clearInterval(usageTrackerRef.current);
      usageTrackerRef.current = null;
    }

  }, [playerStates, masterVolume, isMasterMuted, updateAudioProperties, updateChallengeProgress]);

  const togglePlay = (sound: AmbientSound) => {
    if (sound.isPremium && !hasPremiumAccess) return;
    setPlayerStates(prev => ({
      ...prev,
      [sound.id]: { ...prev[sound.id], isPlaying: !prev[sound.id].isPlaying },
    }));
  };

  const handleVolumeChange = (soundId: string, newVolume: number) => {
    setPlayerStates(prev => ({
      ...prev,
      [soundId]: { ...prev[soundId], volume: newVolume },
    }));
  };
  
  const handleMasterVolumeChange = (newVolumeArray: number[]) => {
    setMasterVolume(newVolumeArray[0]);
  };

  const toggleMasterMute = () => {
    setIsMasterMuted(prev => !prev);
  };
  
  const stopAllSounds = () => {
    setPlayerStates(prev => {
        const newStates = {...prev};
        AVAILABLE_SOUNDS.forEach(sound => {
            newStates[sound.id] = {...newStates[sound.id], isPlaying: false};
        });
        return newStates;
    });
  };

  return (
    <Card className="shadow-lg w-full card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Wind className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">Ambiance Mixer</CardTitle>
            <CardDescription>Create your perfect study soundscape. Mix and match ambient sounds.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-lg font-semibold">Master Controls</h3>
            <div className="flex items-center space-x-4">
                <Button onClick={toggleMasterMute} variant="outline" size="icon" aria-label={isMasterMuted ? "Unmute all sounds" : "Mute all sounds"} className="btn-animated">
                    {isMasterMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                    defaultValue={[masterVolume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleMasterVolumeChange}
                    className="flex-grow"
                    aria-label="Master volume"
                    disabled={isMasterMuted}
                />
                <Button onClick={stopAllSounds} variant="destructive" size="sm" className="btn-animated">Stop All</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_SOUNDS.map((sound) => {
            const state = playerStates[sound.id];
            const IconComponent = sound.icon;
            const isLocked = sound.isPremium && !hasPremiumAccess;
            return (
              <Card key={sound.id} className={`shadow-md card-animated ${isLocked ? 'bg-muted/50 opacity-70' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <IconComponent className={`h-6 w-6 ${isLocked ? 'text-muted-foreground' : 'text-primary'}`} />
                        <CardTitle className="text-xl">{sound.name}</CardTitle>
                    </div>
                    {isLocked ? (
                      <Button asChild variant="secondary" size="sm" className="btn-animated">
                        <Link href="/shop"><Lock className="h-4 w-4 mr-2" />Shop</Link>
                      </Button>
                    ) : (
                      <Button onClick={() => togglePlay(sound)} variant="outline" size="icon" aria-label={state.isPlaying ? `Pause ${sound.name}` : `Play ${sound.name}`} className="btn-animated">
                        {state.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Slider
                    defaultValue={[state.volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(newVal) => handleVolumeChange(sound.id, newVal[0])}
                    aria-label={`${sound.name} volume`}
                    disabled={!state.isPlaying || isMasterMuted || isLocked}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
