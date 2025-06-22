
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SkillNode from './SkillNode';
import type { Skill } from '@/types';
import { Network, Gem } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

// Connector component for drawing lines
const Connector = ({ type = 'vertical', length = 'h-8', className = '' }: { type?: 'vertical' | 'horizontal' | 'elbow-br' | 'elbow-bl' | 'elbow-tr' | 'elbow-tl', length?: string, className?: string }) => {
  const baseClass = "bg-border shrink-0";
  let sizeClass = '';
  if (type === 'vertical') sizeClass = `w-0.5 ${length}`;
  else if (type === 'horizontal') sizeClass = `h-0.5 ${length}`;
  // For this simplified version, elbows will just be straight lines too
  else sizeClass = type.startsWith('elbow-b') || type.startsWith('elbow-t') ? `w-0.5 ${length}` : `h-0.5 ${length}`;
  
  return <div className={cn(baseClass, sizeClass, className)}></div>;
};

export default function SkillTreePageClient() {
  const { userProfile, getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  
  const getSkill = useMemo(() => {
    const allSkills = getAllSkills();
    return (id: string): Skill | undefined => allSkills.find(s => s.id === id);
  }, [getAllSkills]);

  const renderSkillNode = (skillId: string) => {
    const skill = getSkill(skillId);
    if (!skill) return <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground card-animated">Skill Error</div>;
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
  
  // Manually define tree structure for layout
  const tier1_Core = ['unlockAbout', 'unlockStats', 'unlockNotepadMain'];
  
  const tier2_Features_Branch1 = ['unlockAchievements', 'unlockShop'];
  const tier2_Features_Branch2 = ['unlockAmbiance', 'unlockCountdown'];
  const tier2_Notepad_Branch = ['unlockNotepadChecklist', 'unlockNotepadNotes'];

  const tier3_Gameplay_Branch = ['unlockChallenges', 'unlockCapitalist'];
  const tier3_Utility_Branch1 = ['xpBoost1', 'cashBoost1'];
  const tier3_Notepad_Branch = ['unlockNotepadGoals', 'unlockNotepadLinks', 'unlockNotepadRevision'];

  const tier4_Advanced_Utility_Branch = ['streakShield', 'shopDiscount1', 'investmentInsight'];
  const tier4_Advanced_Boosts = ['xpBoost2', 'cashBoost2'];
  const tier4_Notepad_Branch = ['unlockNotepadHabits', 'unlockNotepadEvents', 'unlockNotepadEisenhower'];
  
  const tier5_Ultimate_Boosts = ['xpBoost3', 'cashBoost3'];
  const tier5_Ultimate_Utility = ['revisionAccelerator', 'skillPointRefund'];

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
                  <br />
                  <span className="text-sm italic font-semibold text-primary mt-1 block">A more dynamic, organic visual tree is planned for the future!</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Gem className="h-6 w-6 text-yellow-400" /> 
              <span>{userProfile.skillPoints} Skill Point(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center space-y-4 overflow-visible">
          {/* TIER 1 */}
          <div className="flex justify-center items-center gap-x-12">
            {tier1_Core.map(renderSkillNode)}
          </div>
          
          {/* Connectors to Tier 2 */}
          <div className="flex w-full justify-around max-w-2xl">
            <Connector type="vertical" length="h-8" />
            <Connector type="vertical" length="h-8" />
            <Connector type="vertical" length="h-8" />
          </div>

          {/* TIER 2 */}
          <div className="flex w-full justify-around max-w-5xl">
            {/* Branch 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier2_Features_Branch1.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
            {/* Branch 2 */}
             <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier2_Features_Branch2.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
            {/* Branch 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier2_Notepad_Branch.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
          </div>
          
           {/* TIER 3 */}
          <div className="flex w-full justify-around max-w-6xl">
            {/* Branch 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier3_Gameplay_Branch.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
            {/* Branch 2 */}
             <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier3_Utility_Branch1.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
            {/* Branch 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier3_Notepad_Branch.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
          </div>

           {/* TIER 4 */}
          <div className="flex w-full justify-around max-w-6xl">
            {/* Branch 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier4_Advanced_Utility_Branch.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
            {/* Branch 2 */}
             <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier4_Advanced_Boosts.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-8" />
            </div>
            {/* Branch 3 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier4_Notepad_Branch.map(renderSkillNode)}</div>
               <Connector type="vertical" length="h-8" className="opacity-0"/>
            </div>
          </div>

           {/* TIER 5 */}
          <div className="flex w-full justify-around max-w-6xl">
            {/* Branch 1 */}
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier5_Ultimate_Utility.map(renderSkillNode)}</div>
            </div>
            {/* Branch 2 */}
             <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-x-6">{tier5_Ultimate_Boosts.map(renderSkillNode)}</div>
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
