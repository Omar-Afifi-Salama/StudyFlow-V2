"use client";

import { useSessions } from '@/contexts/SessionContext';
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
  const { userProfile, getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  
  const getSkill = useMemo(() => {
    const allSkills = getAllSkills();
    return (id: string): Skill | undefined => allSkills.find(s => s.id === id);
  }, [getAllSkills]);

  const renderSkillNode = (skillId: string) => {
    const skill = getSkill(skillId);
    if (!skill) return <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground card-animated">Skill Error</div>;
    return (
      <SkillNode
        key={skill.id}
        skill={skill}
        isUnlocked={isSkillUnlocked(skill.id)}
        canUnlock={canUnlockSkill(skill.id)}
        onUnlock={() => unlockSkill(skill.id)}
      />
    );
  };
  
  // Define tree structure based on the image and prerequisites
  const tier0 = ['unlockAbout', 'unlockStats', 'unlockNotepadMain'];

  const branch1Tier1 = ['unlockAchievements', 'unlockShop'];
  const branch1Tier2 = ['unlockChallenges', 'unlockCapitalist'];
  const branch1Tier3 = ['streakShield', 'shopDiscount1', 'investmentInsight'];
  const branch1Tier4 = ['skillPointRefund']; // Single ultimate

  const branch2Tier1 = ['unlockAmbiance', 'unlockCountdown'];
  const branch2Tier2 = ['xpBoost1', 'cashBoost1'];
  const branch2Tier3 = ['xpBoost2', 'cashBoost2'];
  const branch2Tier4 = ['xpBoost3', 'cashBoost3'];

  const branch3Tier1 = ['unlockNotepadChecklist', 'unlockNotepadNotes'];
  const branch3Tier2 = ['unlockNotepadGoals', 'unlockNotepadLinks', 'unlockNotepadRevision'];
  const branch3Tier3 = ['unlockNotepadHabits', 'unlockNotepadEvents', 'unlockNotepadEisenhower'];
  const branch3Tier4 = ['revisionAccelerator']; // Single ultimate
  
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
                  Unlock app features and passive bonuses by spending Skill Points. Hover over skills for details.
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
            <div className="flex justify-around w-full max-w-4xl">
              {tier0.map(renderSkillNode)}
            </div>

            {/* CONNECTORS to branches */}
            <div className="flex justify-around w-full max-w-4xl h-8">
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
              <Connector vertical className="h-full" />
            </div>

            {/* BRANCHES CONTAINER */}
            <div className="flex justify-around w-full max-w-6xl">
              {/* Branch 1: Gameplay/Economy */}
              <div className="flex flex-col items-center space-y-2 w-1/3">
                  <div className="flex justify-around w-full"> {branch1Tier1.map(renderSkillNode)} </div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full"> {branch1Tier2.map(renderSkillNode)} </div>
                  <Connector vertical className="h-8" />
                  <Connector horizontal className="w-full max-w-xs"/>
                  <div className="flex justify-center w-full h-8"><Connector vertical className="h-full"/></div>
                  <div className="flex justify-around w-full"> {branch1Tier3.map(renderSkillNode)} </div>
                  <div className="flex justify-center w-full h-8"><Connector vertical className="h-full"/></div>
                  <div className="flex justify-center w-full"> {branch1Tier4.map(renderSkillNode)} </div>
              </div>

              {/* Branch 2: Features & Boosts */}
              <div className="flex flex-col items-center space-y-2 w-1/3">
                  <div className="flex justify-around w-full">{branch2Tier1.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{branch2Tier2.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{branch2Tier3.map(renderSkillNode)}</div>
                  <div className="flex justify-around w-full h-8"><Connector vertical className="h-full" /><Connector vertical className="h-full" /></div>
                  <div className="flex justify-around w-full">{branch2Tier4.map(renderSkillNode)}</div>
              </div>
              
              {/* Branch 3: Notepad */}
              <div className="flex flex-col items-center space-y-2 w-1/3">
                   <div className="flex justify-around w-full">{branch3Tier1.map(renderSkillNode)}</div>
                   <Connector vertical className="h-8" />
                   <Connector horizontal className="w-full max-w-xs"/>
                   <div className="flex justify-center w-full h-8"><Connector vertical className="h-full"/></div>
                   <div className="flex justify-around w-full">{branch3Tier2.map(renderSkillNode)}</div>
                   <Connector vertical className="h-8" />
                   <Connector horizontal className="w-full max-w-xs"/>
                   <div className="flex justify-center w-full h-8"><Connector vertical className="h-full"/></div>
                   <div className="flex justify-around w-full">{branch3Tier3.map(renderSkillNode)}</div>
                   <div className="flex justify-center w-full h-8"><Connector vertical className="h-full"/></div>
                   <div className="flex justify-center w-full">{branch3Tier4.map(renderSkillNode)}</div>
              </div>
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
