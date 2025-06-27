
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
  
  // Define Tiers and Branches for the new layout
  const tier0 = ['unlockTimers', 'unlockSkillTree'];
  const tier1 = ['unlockAbout', 'unlockStats', 'unlockNotepadMain'];

  // Branch 1: Gameplay/Economy
  const b1t2 = ['unlockAchievements', 'unlockShop'];
  const b1t3 = ['unlockChallenges', 'unlockCapitalist'];
  const b1t4 = ['challengeReroll', 'businessAcumen'];
  const b1t5 = ['seasonalHunter', 'marketAnalyst'];
  const b1t6 = ['streakShield', 'shopDiscount1'];
  const b1t7 = ['shopDiscount2'];

  // Branch 2: Productivity/Features
  const b2t2 = ['unlockAmbiance', 'pwaPro'];
  const b2t3 = ['ambianceAttunement', 'hotkeyHero'];
  const b2t4 = ['xpBoost1', 'cashBoost1'];
  const b2t5 = ['xpBoost2', 'cashBoost2'];
  const b2t6 = ['knowledgeRetention', 'afkForgiveness'];
  const b2t7 = ['deepWork'];

  // Branch 3: Notepad/Organization
  const b3t2 = ['unlockNotepadChecklist', 'unlockNotepadNotes'];
  const b3t3 = ['unlockNotepadGoals', 'unlockNotepadLinks'];
  const b3t4 = ['unlockNotepadRevision', 'unlockNotepadHabits'];
  const b3t5 = ['revisionAccelerator', 'habitConsistency'];
  const b3t6 = ['unlockNotepadEvents', 'unlockNotepadEisenhower'];
  const b3t7 = ['deadlineDriven'];
  
  // Ultimates
  const tier8 = ['synergizer'];
  const tier9_utility = ['dailyDiligence'];
  const tier9_infinites = ['infiniteXpBoost', 'infiniteCashBoost'];
  
  return (
    <div className="w-full overflow-x-auto pb-8">
      <Card className="shadow-lg w-full card-animated min-w-[1200px]">
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
            
            {/* TIER 0 - ROOT */}
            <div className="flex justify-center gap-8">{tier0.map(renderSkillNode)}</div>
            <div className="flex justify-center w-full h-8"><Connector vertical className="h-full" /></div>
            
            {/* TIER 1 - CORE */}
            <div className="flex justify-around w-full max-w-4xl">{tier1.map(renderSkillNode)}</div>
            <div className="flex justify-around w-full max-w-6xl h-8">
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
            </div>

            {/* MAIN BRANCHES */}
            <div className="flex justify-around w-full max-w-7xl">
              {/* Branch 1 */}
              <div className="flex flex-col items-center space-y-2 w-1/3">
                  <div className="flex justify-around w-full">{b1t2.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b1t3.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b1t4.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b1t5.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b1t6.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /></div>
                  <div className="flex justify-center w-full">{b1t7.map(renderSkillNode)}</div>
              </div>
              
              {/* Branch 2 */}
              <div className="flex flex-col items-center space-y-2 w-1/3 border-x">
                  <div className="flex justify-around w-full">{b2t2.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b2t3.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b2t4.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b2t5.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{b2t6.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /></div>
                   <div className="flex justify-center w-full">{b2t7.map(renderSkillNode)}</div>
              </div>
              
              {/* Branch 3 */}
              <div className="flex flex-col items-center space-y-2 w-1/3">
                   <div className="flex justify-around w-full">{b3t2.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t3.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t4.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t5.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                   <div className="flex justify-around w-full">{b3t6.map(renderSkillNode)}</div>
                   <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /></div>
                   <div className="flex justify-center w-full">{b3t7.map(renderSkillNode)}</div>
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

            {/* TIER 8 - ULTIMATES */}
            <div className="flex justify-center gap-8">{tier8.map(renderSkillNode)}</div>
            <div className="flex justify-center w-full h-8"><Connector vertical className="h-full" /></div>
            <div className="flex justify-center gap-8">{tier9_utility.map(renderSkillNode)}</div>
            <div className="flex justify-center w-full h-8"><Connector vertical className="h-full" /></div>
            
            {/* TIER 9 - INFINITES */}
            <div className="flex justify-center gap-8">{tier9_infinites.map(renderSkillNode)}</div>

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
