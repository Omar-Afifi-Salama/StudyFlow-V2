
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SkillNode from './SkillNode'; // Assuming SkillNode.tsx is created
import type { Skill } from '@/types';
import { Network, Gem, Zap } from 'lucide-react'; // Using Zap for Skill Points
import { cn } from '@/lib/utils';

// Helper to create a visual line between two nodes (conceptual for now)
// In a real SVG/Canvas solution, this would draw actual lines.
// Here, we use simple divs for visual connection hints.
const ConnectorLine = ({ type = 'vertical', length = 'h-8', className = '' }: { type?: 'vertical' | 'horizontal', length?: string, className?: string }) => {
  const baseClasses = "bg-border";
  const verticalClasses = `w-0.5 ${length} ${baseClasses}`;
  const horizontalClasses = `h-0.5 ${length} ${baseClasses}`;
  return <div className={cn(type === 'vertical' ? verticalClasses : horizontalClasses, className)}></div>;
};


export default function SkillTreePageClient() {
  const { userProfile, getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  const allSkills = getAllSkills();

  // This is where we define the tree structure by mapping skill IDs to their positions.
  // This is a simplified representation. A real dynamic graph is much more complex.
  // We'll define tiers/branches and manually place skills.

  const getSkill = (id: string): Skill | undefined => allSkills.find(s => s.id === id);

  // Define a potential structure:
  // Tier 0 (Always Unlocked - Not explicitly rendered as unlockable nodes)
  // const rootSkillTimers = getSkill('unlockTimers'); // Assumed always unlocked
  // const rootSkillTree = getSkill('unlockSkillTree'); // Assumed always unlocked

  // Tier 1: Initial unlocks from "root" (top of our upside-down tree)
  const tier1Skills: (Skill | undefined)[] = [
    getSkill('unlockAbout'),
    getSkill('unlockNotepadMain'),
    getSkill('unlockStats'),
  ].filter(Boolean) as Skill[];

  // Tier 2: Skills branching from Tier 1
  const tier2_fromNotepad: (Skill | undefined)[] = [
    getSkill('unlockNotepadChecklist'),
    getSkill('unlockNotepadNotes'),
  ].filter(Boolean) as Skill[];
  
  const tier2_fromStats: (Skill | undefined)[] = [
    getSkill('unlockAchievements'),
  ].filter(Boolean) as Skill[];
  
  const tier2_general: (Skill | undefined)[] = [
    getSkill('unlockShop'),
    getSkill('xpBoost1'),
  ].filter(Boolean) as Skill[];


  // Tier 3: Skills branching further
  const tier3_fromChecklist: (Skill | undefined)[] = [
    getSkill('unlockNotepadGoals')
  ].filter(Boolean) as Skill[];
  const tier3_fromNotes: (Skill | undefined)[] = [
    getSkill('unlockNotepadLinks'),
    getSkill('unlockNotepadRevision'),
  ].filter(Boolean) as Skill[];
  const tier3_fromShop: (Skill | undefined)[] = [
    getSkill('unlockCapitalist'),
    getSkill('shopDiscount1')
  ].filter(Boolean) as Skill[];
  const tier3_general: (Skill | undefined)[] = [
    getSkill('unlockAmbiance'),
    getSkill('unlockCountdown'),
    getSkill('cashBoost1'),
    getSkill('unlockChallenges'),
  ].filter(Boolean) as Skill[];

  // Tier 4: Deeper skills
  const tier4_fromGoals: (Skill | undefined)[] = [
    getSkill('unlockNotepadEisenhower'),
    getSkill('unlockNotepadEvents'), // Also depends on countdown
    getSkill('unlockNotepadHabits')
  ].filter(Boolean) as Skill[];
  const tier4_boosts: (Skill | undefined)[] = [
    getSkill('xpBoost2'),
    getSkill('cashBoost2'),
    getSkill('streakShield')
  ].filter(Boolean) as Skill[];
  const tier4_utility: (Skill | undefined)[] = [
     getSkill('investmentInsight'),
     getSkill('revisionAccelerator'),
  ].filter(Boolean) as Skill[];
  
  // Tier 5: Top-tier boosts/utility
   const tier5_final: (Skill | undefined)[] = [
    getSkill('xpBoost3'),
    getSkill('cashBoost3'),
    getSkill('skillPointRefund')
  ].filter(Boolean) as Skill[];


  const renderSkillRow = (skills: Skill[], rowName: string, showConnectors: boolean = true) => (
    <div className="flex flex-col items-center w-full mb-4 md:mb-8">
      {/* <p className="text-sm text-muted-foreground mb-2">{rowName}</p> */}
      <div className="flex justify-around items-start w-full gap-4 md:gap-8 flex-wrap">
        {skills.map((skill, index) => (
          <div key={skill.id} className="flex flex-col items-center">
            {showConnectors && index < skills.length && ( /* Conceptual connector line above node */
              <ConnectorLine type="vertical" length="h-4 md:h-6" />
            )}
            <SkillNode
              skill={skill}
              isUnlocked={isSkillUnlocked(skill.id)}
              canUnlock={canUnlockSkill(skill.id)}
              onUnlock={unlockSkill}
              isCentralTrunk={skill.category === 'Core Feature' && skills.length === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
  
  // This layout is highly simplified and will need significant work for actual lines.
  // The goal here is spatial grouping suggesting a tree.

  return (
    <div className="w-full overflow-x-auto"> {/* Allow horizontal scroll if tree is too wide */}
      <Card className="shadow-lg w-full card-animated min-w-[800px] md:min-w-[1000px] lg:min-w-[1200px]"> {/* Ensure card has min-width */}
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
            <p className="text-sm text-muted-foreground mt-2">
                Note: This skill tree shows available skills and their unlock status. A more detailed visual, interconnected tree diagram UI is a planned future enhancement.
            </p>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 pt-6 flex flex-col items-center overflow-y-hidden"> {/* Prevent vertical scroll of content */}
          
          {/* Tier 0: Implied root - We start rendering from Tier 1 for unlockable skills */}
          {/* A conceptual "starting point" node could be added if desired */}
          {/* <div className="mb-4 md:mb-8"><SkillNode skill={{id:'root', name:'StudyFlow Core', description:'Base application.', cost:0, iconName:'Zap', category:'Core Feature'}} isUnlocked={true} canUnlock={{can:false}} onUnlock={()=>{}} isRoot={true} /></div> */}
          
          {tier1Skills.length > 0 && renderSkillRow(tier1Skills, "Tier 1: Foundational", false)}

          {/* Branch for Notepad */}
          {tier2_fromNotepad.length > 0 && (
            <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier2_fromNotepad.length > 0 && renderSkillRow(tier2_fromNotepad, "Notepad Branch Tier 1")}
          
          <div className="flex w-full justify-around my-2 md:my-4">
             {tier3_fromChecklist.length > 0 && <ConnectorLine type="vertical" length="h-4 md:h-6" />}
             {tier3_fromNotes.length > 0 && <ConnectorLine type="vertical" length="h-4 md:h-6" />}
          </div>
          <div className="flex w-full justify-around">
            {tier3_fromChecklist.length > 0 && renderSkillRow(tier3_fromChecklist, "Checklist Sub-branch")}
            {tier3_fromNotes.length > 0 && renderSkillRow(tier3_fromNotes, "Notes Sub-branch")}
          </div>
          
          {/* Branch for Stats/Achievements */}
           {tier2_fromStats.length > 0 && (
            <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier2_fromStats.length > 0 && renderSkillRow(tier2_fromStats, "Stats Branch")}

          {/* General Purpose Skills / Other Features */}
          {tier2_general.length > 0 && (
            <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier2_general.length > 0 && renderSkillRow(tier2_general, "General Features Tier 1")}

          {tier3_general.length > 0 && (
            <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier3_general.length > 0 && renderSkillRow(tier3_general, "General Features Tier 2")}
          
          {tier3_fromShop.length > 0 && (
            <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier3_fromShop.length > 0 && renderSkillRow(tier3_fromShop, "Shop Branch")}


          {/* Deeper Tiers */}
          {tier4_fromGoals.length > 0 && (
            <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier4_fromGoals.length > 0 && renderSkillRow(tier4_fromGoals, "Advanced Notepad")}
          
          {tier4_boosts.length > 0 && (
             <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier4_boosts.length > 0 && renderSkillRow(tier4_boosts, "Passive Boosts Tier 2")}

          {tier4_utility.length > 0 && (
             <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier4_utility.length > 0 && renderSkillRow(tier4_utility, "Advanced Utilities")}

          {tier5_final.length > 0 && (
            <div className="w-full flex justify-center my-2 md:my-4">
                <ConnectorLine type="vertical" length="h-4 md:h-6" className="mx-auto" />
            </div>
          )}
          {tier5_final.length > 0 && renderSkillRow(tier5_final, "Ultimate Skills")}

        </CardContent>
      </Card>
    </div>
  );
}
