
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
  
  // Tier 0 (Root)
  const tier0 = ['unlockTimers', 'unlockSkillTree'];
  
  // Tier 1 (Core Unlocks)
  const tier1 = ['unlockAbout', 'unlockStats', 'unlockNotepadMain'];

  // Branch 1: Gameplay/Economy (Left Side)
  const b1t2 = ['unlockAchievements', 'unlockShop'];
  const b1t3 = ['unlockChallenges', 'unlockCapitalist'];
  const b1t4 = ['challengeReroll', 'businessAcumen'];
  const b1t5 = ['streakShield', 'marketAnalyst'];
  const b1t6 = ['shopDiscount1'];

  // Branch 2: Features & Boosts (Middle)
  const b2t2 = ['unlockAmbiance', 'pwaPro'];
  const b2t3 = ['breakTimeBonus', 'xpBoost1'];
  const b2t4 = ['xpBoost2', 'cashBoost1'];
  const b2t5 = ['knowledgeRetention', 'cashBoost2'];
  const b2t6 = ['deepWork'];

  // Branch 3: Notepad (Right Side)
  const b3t2 = ['unlockNotepadChecklist', 'unlockNotepadNotes'];
  const b3t3 = ['unlockNotepadGoals', 'unlockNotepadLinks'];
  const b3t4 = ['goalMomentum', 'unlockNotepadRevision'];
  const b3t5 = ['revisionAccelerator', 'unlockNotepadHabits'];
  const b3t6 = ['unlockNotepadEvents', 'unlockNotepadEisenhower'];

  // Ultimates
  const ultimates = ['infiniteXpBoost', 'synergizer', 'infiniteCashBoost'];
  
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
            <div className="flex justify-around w-full max-w-6xl h-8">
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
            </div>

            {/* BRANCHES CONTAINER */}
            <div className="flex flex-col md:flex-row justify-around w-full max-w-7xl">

              {/* Branch 1: Gameplay/Economy */}
              <div className="flex flex-col items-center space-y-2 w-full md:w-1/3 px-4">
                  <div className="flex justify-around w-full">{b1t2.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b1t3.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b1t4.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b1t5.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /></div>
                   <div className="flex justify-center w-full">{b1t6.map(renderSkillNode)}</div>
              </div>

              {/* Branch 2: Features & Boosts */}
              <div className="flex flex-col items-center space-y-2 w-full md:w-1/3 px-4 md:border-x">
                  <div className="flex justify-around w-full">{b2t2.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b2t3.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b2t4.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b2t5.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /></div>
                   <div className="flex justify-center w-full">{b2t6.map(renderSkillNode)}</div>
              </div>
              
              {/* Branch 3: Notepad */}
              <div className="flex flex-col items-center space-y-2 w-full md:w-1/3 px-4">
                   <div className="flex justify-around w-full">{b3t2.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t3.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t4.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t5.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t6.map(renderSkillNode)}</div>
              </div>
            </div>

            {/* Connector to Ultimates */}
            <div className="flex justify-center w-full max-w-6xl h-12">
                <div className="w-1/3 flex justify-center"><Connector vertical className="h-full" /></div>
                <div className="w-1/3 flex justify-center"><Connector vertical className="h-full" /></div>
                <div className="w-1/3 flex justify-center"><Connector vertical className="h-full" /></div>
            </div>
            <Connector horizontal className="w-full max-w-2xl" />
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
