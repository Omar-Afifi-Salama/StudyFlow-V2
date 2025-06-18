
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SkillNode from './SkillNode'; 
import type { Skill } from '@/types';
import { Network, Zap } from 'lucide-react'; 
import { cn } from '@/lib/utils';

// Helper for simple straight line connectors
const Connector = ({ direction = 'vertical', length = 'h-8', className = '' }: { direction?: 'vertical' | 'horizontal', length?: string, className?: string }) => {
  const baseClasses = "bg-border";
  const verticalClasses = `w-0.5 ${length} ${baseClasses}`;
  const horizontalClasses = `h-0.5 ${length} ${baseClasses}`;
  return <div className={cn(direction === 'vertical' ? verticalClasses : horizontalClasses, className, "shrink-0 grow-0")}></div>;
};


export default function SkillTreePageClient() {
  const { userProfile, getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  const allSkills = getAllSkills();

  // Define skill tiers for layout
  // This is a manual layout definition.
  const getSkill = (id: string) => allSkills.find(s => s.id === id);

  const tier0_roots = [getSkill('unlockTimers'), getSkill('unlockSkillTree')].filter(Boolean) as Skill[]; // Base, always unlocked

  const tier1_mainFeatures = [
    getSkill('unlockStats'), 
    getSkill('unlockNotepadMain'), 
    getSkill('unlockShop'),
    getSkill('unlockAbout'),
  ].filter(Boolean) as Skill[];

  const tier2_notepadBranch = [getSkill('unlockNotepadChecklist'), getSkill('unlockNotepadNotes')].filter(Boolean) as Skill[];
  const tier2_statsBranch = [getSkill('unlockAchievements')].filter(Boolean) as Skill[];
  const tier2_shopBranch = [getSkill('unlockCapitalist'), getSkill('shopDiscount1')].filter(Boolean) as Skill[];
  const tier2_utilityBranch = [getSkill('unlockAmbiance'), getSkill('unlockCountdown'), getSkill('unlockChallenges')].filter(Boolean) as Skill[];
  const tier2_boostsBranch = [getSkill('xpBoost1'), getSkill('cashBoost1')].filter(Boolean) as Skill[];


  const tier3_advNotepad = [
    getSkill('unlockNotepadGoals'), // from checklist
    getSkill('unlockNotepadLinks'), // from notes
    getSkill('unlockNotepadRevision') // from notes & goals
  ].filter(Boolean) as Skill[];
  
  const tier3_advUtility = [
    getSkill('streakShield'), // from challenges
    getSkill('investmentInsight') // from capitalist
  ].filter(Boolean) as Skill[];

  const tier3_boosts = [
    getSkill('xpBoost2'), // from xpBoost1
    getSkill('cashBoost2') // from cashBoost1
  ].filter(Boolean) as Skill[];
  
  const tier4_expertNotepad = [
      getSkill('unlockNotepadEisenhower'),
      getSkill('unlockNotepadEvents'),
      getSkill('unlockNotepadHabits'),
      getSkill('revisionAccelerator')
  ].filter(Boolean) as Skill[];

  const tier4_masterBoosts = [
      getSkill('xpBoost3'),
      getSkill('cashBoost3'),
      getSkill('skillPointRefund')
  ].filter(Boolean) as Skill[];


  const renderNodes = (skills: Skill[]) => skills.map(skill => skill && (
    <SkillNode
      key={skill.id}
      skill={skill}
      isUnlocked={isSkillUnlocked(skill.id)}
      canUnlock={canUnlockSkill(skill.id)}
      onUnlock={unlockSkill}
    />
  ));

  return (
    <div className="w-full overflow-x-auto"> 
      <Card className="shadow-lg w-full card-animated min-w-[1000px]"> {/* Ensure card has min-width */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl font-headline">Skill Tree</CardTitle>
                <CardDescription>
                  Unlock app features and passive bonuses. Hover over skills for details.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Zap className="h-6 w-6 text-yellow-400" /> 
              <span>{userProfile.skillPoints} Skill Point(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center space-y-4 md:space-y-6">
          {/* This is a manual layout. A dynamic graph is much more complex. */}
          {/* The lines are simplified visual connectors. */}

          {/* Tier 1 */}
          <div className="flex justify-around items-center w-full space-x-4">
            {renderNodes(tier1_mainFeatures)}
          </div>

          {/* Connectors to Tier 2 */}
          <div className="flex justify-around w-full items-center h-12">
            {tier1_mainFeatures.map((_, index) => (
              <Connector key={`conn-t1-${index}`} direction="vertical" length="h-full" />
            ))}
          </div>
          
          {/* Tier 2 - Grouped by "branch" for clarity */}
          <div className="flex flex-col items-center w-full space-y-8">
            {/* Notepad Branch from unlockNotepadMain */}
            <div className="flex justify-center items-center space-x-8">
              {renderNodes(tier2_notepadBranch)}
            </div>
             {/* Horizontal connector if needed */}
             {tier2_notepadBranch.length > 1 && <Connector direction="horizontal" length="w-24" className="my-[-2rem]"/>}


            {/* Stats Branch from unlockStats */}
            <div className="flex justify-center items-center space-x-8">
              {renderNodes(tier2_statsBranch)}
            </div>

            {/* Shop Branch from unlockShop */}
            <div className="flex justify-center items-center space-x-8">
              {renderNodes(tier2_shopBranch)}
            </div>
            {tier2_shopBranch.length > 1 && <Connector direction="horizontal" length="w-24" className="my-[-2rem]"/>}


            {/* Utility Branch (Ambiance, Countdown, Challenges) - conceptually connected to main trunk */}
            <div className="flex justify-center items-center space-x-8">
              {renderNodes(tier2_utilityBranch)}
            </div>
             {tier2_utilityBranch.length > 1 && <Connector direction="horizontal" length="w-40" className="my-[-2rem]"/>}


            {/* Boosts Branch - conceptually connected to main trunk */}
            <div className="flex justify-center items-center space-x-8">
              {renderNodes(tier2_boostsBranch)}
            </div>
            {tier2_boostsBranch.length > 1 && <Connector direction="horizontal" length="w-24" className="my-[-2rem]"/>}
          </div>
          
          {/* Connectors to Tier 3 */}
          <div className="flex justify-center w-full items-center h-12">
             <Connector direction="vertical" length="h-full" />
          </div>

          {/* Tier 3 */}
           <div className="flex justify-around items-start w-full space-x-4 flex-wrap gap-y-8">
             {renderNodes(tier3_advNotepad)}
             {renderNodes(tier3_advUtility)}
             {renderNodes(tier3_boosts)}
           </div>

           {/* Connectors to Tier 4 */}
            <div className="flex justify-center w-full items-center h-12">
             <Connector direction="vertical" length="h-full" />
           </div>

           {/* Tier 4 */}
           <div className="flex justify-around items-start w-full space-x-4 flex-wrap gap-y-8">
             {renderNodes(tier4_expertNotepad)}
             {renderNodes(tier4_masterBoosts)}
           </div>


        </CardContent>
        <CardFooter className="mt-6">
            <p className="text-xs text-muted-foreground text-center w-full">
                This skill tree layout is a simplified visual representation. A more detailed, interconnected tree UI is planned for a future update.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
