
"use client";

import { useSessions, ALL_SKILLS } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SkillNode from './SkillNode';
import type { Skill } from '@/types';
import { Network, Gem } from 'lucide-react';
import { useMemo } from 'react';

// Connector component for drawing lines
const Connector = ({ vertical = false, horizontal = false, className = '' }) => {
  return (
    <div
      className={`bg-border ${vertical ? 'w-0.5' : ''} ${horizontal ? 'h-0.5' : ''} ${className}`}
    ></div>
  );
};

export default function SkillTreePageClient() {
  const { userProfile, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  
  const getSkill = useMemo(() => {
    return (id: string): Skill | undefined => ALL_SKILLS.find(s => s.id === id);
  }, []);

  const renderSkillNode = (skillId: string) => {
    const skill = getSkill(skillId);
    if (!skill) return <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground card-animated">Skill Error</div>;
    const isInfinite = skill.category === 'Infinite';
    const currentLevel = isInfinite ? (userProfile.skillLevels?.[skillId] || 0) : 0;
    
    return (
      <SkillNode
        key={skill.id}
        skill={skill}
        isUnlocked={isSkillUnlocked(skill.id)}
        canUnlock={canUnlockSkill(skill.id)}
        onUnlock={() => unlockSkill(skill.id)}
        isInfinite={isInfinite}
        currentLevel={currentLevel}
      />
    );
  };
  
  // Define tree structure based on a more organized layout
  const tier0 = ['unlockTimers', 'unlockSkillTree'];
  const tier1 = ['unlockAbout', 'unlockStats', 'unlockNotepadMain'];

  // Branch 1: App Features & Economy
  const branch1Tier2 = ['unlockAchievements', 'unlockShop'];
  const branch1Tier3 = ['unlockChallenges', 'unlockCapitalist'];
  const branch1Tier4 = ['streakShield', 'shopDiscount1'];

  // Branch 2: Core Features & Boosts
  const branch2Tier2 = ['unlockAmbiance', 'unlockCountdown'];
  const branch2Tier3 = ['xpBoost1', 'cashBoost1'];
  const branch2Tier4 = ['xpBoost2', 'cashBoost2'];

  // Branch 3: Notepad
  const branch3Tier2 = ['unlockNotepadChecklist', 'unlockNotepadNotes'];
  const branch3Tier3 = ['unlockNotepadGoals', 'unlockNotepadLinks'];
  const branch3Tier4 = ['unlockNotepadRevision', 'unlockNotepadHabits'];
  const branch3Tier5 = ['unlockNotepadEvents', 'unlockNotepadEisenhower'];

  // Ultimate Skills
  const ultimates = ['infiniteXpBoost', 'infiniteCashBoost'];
  
  return (
    <div className="w-full overflow-x-auto pb-8">
      <Card className="shadow-lg w-full card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl font-headline">Skill Tree</CardTitle>
                <CardDescription>
                  Unlock app features and passive bonuses by spending Skill Points.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Gem className="h-6 w-6 text-yellow-400" /> 
              <span>{userProfile.skillPoints} Skill Point(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center space-y-2">
            
            {/* TIER 0 - ROOT (Always unlocked) */}
            <div className="flex justify-center gap-8 w-full max-w-lg">
              {tier0.map(renderSkillNode)}
            </div>

            {/* Connector to Tier 1 */}
            <div className="flex justify-center w-full h-8"><Connector vertical className="h-full" /></div>
            
            {/* TIER 1 - CORE UNLOCKS */}
            <div className="flex justify-around w-full max-w-4xl">
              {tier1.map(renderSkillNode)}
            </div>

            {/* Connectors to the three main branches */}
            <div className="flex justify-around w-full max-w-4xl h-8">
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
            </div>

            {/* BRANCHES CONTAINER */}
            <div className="flex justify-around w-full max-w-6xl">

              {/* Branch 1: Gameplay/Economy */}
              <div className="flex flex-col items-center space-y-2 w-1/3 px-4">
                  <div className="flex justify-around w-full">{branch1Tier2.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{branch1Tier3.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{branch1Tier4.map(renderSkillNode)}</div>
              </div>

              {/* Branch 2: Features & Boosts */}
              <div className="flex flex-col items-center space-y-2 w-1/3 px-4 border-x">
                  <div className="flex justify-around w-full">{branch2Tier2.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{branch2Tier3.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{branch2Tier4.map(renderSkillNode)}</div>
              </div>
              
              {/* Branch 3: Notepad */}
              <div className="flex flex-col items-center space-y-2 w-1/3 px-4">
                   <div className="flex justify-around w-full">{branch3Tier2.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{branch3Tier3.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{branch3Tier4.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{branch3Tier5.map(renderSkillNode)}</div>
              </div>
            </div>

            {/* Connector to Ultimates */}
            <div className="flex justify-center w-full max-w-6xl h-12">
                <div className="w-1/3 flex justify-center"><Connector vertical className="h-full" /></div>
                <div className="w-1/3 flex justify-center"><Connector vertical className="h-full" /></div>
                <div className="w-1/3 flex justify-center"><Connector vertical className="h-full" /></div>
            </div>
            <Connector horizontal className="w-full max-w-xl" />
            <div className="flex justify-center w-full h-8"><Connector vertical className="h-full" /></div>

            {/* ULTIMATE SKILLS */}
            <div className="flex justify-center gap-8 w-full max-w-lg">
              {ultimates.map(renderSkillNode)}
            </div>

        </CardContent>
        <CardFooter className="mt-6 border-t pt-4">
          <p className="text-xs text-muted-foreground text-center w-full">
            Hover over a skill for details. Unlock skills to progress down the tree.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
