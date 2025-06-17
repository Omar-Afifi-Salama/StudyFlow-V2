
"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import type { AmbientSound } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause, Waves, Wind, CloudRain, Coffee as CoffeeIcon, SunMedium, Moon } from 'lucide-react'; // Moon for white noise (calm night)

// Placeholder sounds - user needs to add these to public/sounds/
const AVAILABLE_SOUNDS: AmbientSound[] = [
  { id: 'rain', name: 'Gentle Rain', filePath: '/sounds/rain.mp3', icon: CloudRain },
  { id: 'cafe', name: 'Busy Cafe', filePath: '/sounds/cafe.mp3', icon: CoffeeIcon },
  { id: 'waves', name: 'Ocean Waves', filePath: '/sounds/waves.mp3', icon: Waves },
  { id: 'wind', name: 'Soft Wind', filePath: '/sounds/wind.mp3', icon: Wind },
  { id: 'whitenoise', name: 'White Noise', filePath: '/sounds/white_noise.mp3', icon: Moon },
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

  // Initialize Audio elements
  useEffect(() => {
    AVAILABLE_SOUNDS.forEach(sound => {
      if (!audioPlayersRef.current[sound.id]) {
        const audio = new Audio(sound.filePath);
        audio.loop = true;
        audioPlayersRef.current[sound.id] = audio;
      }
    });

    return () => { // Cleanup on unmount
      Object.values(audioPlayersRef.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = ''; // Release resource
        }
      });
      audioPlayersRef.current = {};
    };
  }, []);

  const updateAudioProperties = useCallback((soundId: string, state: AudioPlayerState) => {
    const audio = audioPlayersRef.current[soundId];
    if (audio) {
      audio.volume = isMasterMuted ? 0 : masterVolume * state.volume;
      if (state.isPlaying && audio.paused) {
        audio.play().catch(e => console.error("Error playing audio:", e));
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
  }, [playerStates, masterVolume, isMasterMuted, updateAudioProperties]);

  const togglePlay = (soundId: string) => {
    setPlayerStates(prev => ({
      ...prev,
      [soundId]: { ...prev[soundId], isPlaying: !prev[soundId].isPlaying },
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
    <Card className="shadow-lg w-full">
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
                <Button onClick={toggleMasterMute} variant="outline" size="icon" aria-label={isMasterMuted ? "Unmute all sounds" : "Mute all sounds"}>
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
                <Button onClick={stopAllSounds} variant="destructive" size="sm">Stop All</Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AVAILABLE_SOUNDS.map((sound) => {
            const state = playerStates[sound.id];
            const IconComponent = sound.icon;
            return (
              <Card key={sound.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <IconComponent className="h-6 w-6 text-primary" />
                        <CardTitle className="text-xl">{sound.name}</CardTitle>
                    </div>
                    <Button onClick={() => togglePlay(sound.id)} variant="outline" size="icon" aria-label={state.isPlaying ? `Pause ${sound.name}` : `Play ${sound.name}`}>
                      {state.isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Slider
                    defaultValue={[state.volume]}
                    max={1}
                    step={0.01}
                    onValueChange={(newVal) => handleVolumeChange(sound.id, newVal[0])}
                    aria-label={`${sound.name} volume`}
                    disabled={!state.isPlaying || isMasterMuted}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
         <p className="text-xs text-muted-foreground text-center">
            Note: You need to place audio files (e.g., rain.mp3, cafe.mp3) in your <code className="bg-muted px-1 rounded-sm">public/sounds/</code> directory for playback.
        </p>
      </CardContent>
    </Card>
  );
}
