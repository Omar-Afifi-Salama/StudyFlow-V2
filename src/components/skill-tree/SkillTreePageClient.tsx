
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SkillNode from './SkillNode'; 
import type { Skill } from '@/types';
import { Network, Zap } from 'lucide-react'; 
import { cn } from '@/lib/utils';

const Connector = ({ 
    type = 'vertical', // 'vertical', 'horizontal', 'elbow-br', 'elbow-bl', 'elbow-tr', 'elbow-tl', 't-down', 't-up', 't-left', 't-right', 'cross'
    size = 'h-8 w-0.5', // Tailwind class for size
    className = '' 
}: { 
    type?: string, 
    size?: string, 
    className?: string 
}) => {
  const baseClass = "bg-border shrink-0 grow-0";
  
  // Basic vertical and horizontal lines
  if (type === 'vertical') return <div className={cn(baseClass, 'w-0.5', size, className)}></div>;
  if (type === 'horizontal') return <div className={cn(baseClass, 'h-0.5', size, className)}></div>;

  // Placeholder for more complex connector shapes (would require SVG or more complex CSS)
  // For now, complex types will render as a small square dot or a simple line based on size
  return <div className={cn(baseClass, size.includes('h-') ? 'h-1 w-0.5' : 'w-1 h-0.5', className)} title={`Connector: ${type}`}></div>;
};


const renderNodes = (skills: Skill[], { isUnlocked, canUnlockSkill, unlockSkill }: {
  isUnlocked: (id: string) => boolean;
  canUnlockSkill: (id: string) => { can: boolean; reason?: string };
  unlockSkill: (id: string) => boolean;
}) => skills.map(skill => skill && (
  <SkillNode
    key={skill.id}
    skill={skill}
    isUnlocked={isUnlocked(skill.id)}
    canUnlock={canUnlockSkill(skill.id)}
    onUnlock={unlockSkill}
  />
));

export default function SkillTreePageClient() {
  const { userProfile, getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  const allSkills = getAllSkills();
  const getSkill = (id: string) => allSkills.find(s => s.id === id);

  // Define skill tiers and branches for layout
  // Tier 0 (Conceptual Roots - always unlocked, not rendered as nodes)
  // const rootSkills = [getSkill('unlockTimers'), getSkill('unlockSkillTree')];

  // Tier 1: Initial Unlocks (Path from conceptual roots)
  const tier1_CoreFeatures = [getSkill('unlockAbout'), getSkill('unlockNotepadMain'), getSkill('unlockStats')].filter(Boolean) as Skill[];
  const tier1_Boosts = [getSkill('xpBoost1'), getSkill('cashBoost1')].filter(Boolean) as Skill[];
  const tier1_ShopPath = [getSkill('unlockShop')].filter(Boolean) as Skill[];

  // Tier 2: Branching from Tier 1
  const tier2_NotepadTabs = [getSkill('unlockNotepadChecklist'), getSkill('unlockNotepadNotes')].filter(Boolean) as Skill[]; // From NotepadMain
  const tier2_StatsFeatures = [getSkill('unlockAchievements')].filter(Boolean) as Skill[]; // From Stats
  const tier2_ShopFeatures = [getSkill('shopDiscount1'), getSkill('unlockCapitalist')].filter(Boolean) as Skill[]; // From Shop
  const tier2_BoostsContinued = [getSkill('xpBoost2'), getSkill('cashBoost2')].filter(Boolean) as Skill[]; // From xpBoost1/cashBoost1
  const tier2_UtilityFeatures = [getSkill('unlockAmbiance'), getSkill('unlockCountdown')].filter(Boolean) as Skill[]; // General progression

  // Tier 3: Further Branching
  const tier3_AdvancedNotepad = [getSkill('unlockNotepadGoals'), getSkill('unlockNotepadLinks'), getSkill('unlockNotepadRevision')].filter(Boolean) as Skill[];
  const tier3_CoreGameplay = [getSkill('unlockChallenges')].filter(Boolean) as Skill[]; // From Achievements
  const tier3_AdvancedEconomy = [getSkill('investmentInsight')].filter(Boolean) as Skill[]; // From Capitalist
  const tier3_BoostsMax = [getSkill('xpBoost3'), getSkill('cashBoost3')].filter(Boolean) as Skill[]; // From BoostsContinued

  // Tier 4: Expert/Endgame Features
  const tier4_ExpertNotepad = [getSkill('unlockNotepadEisenhower'), getSkill('unlockNotepadEvents'), getSkill('unlockNotepadHabits')].filter(Boolean) as Skill[];
  const tier4_UtilityMastery = [getSkill('revisionAccelerator'), getSkill('streakShield')].filter(Boolean) as Skill[];
  const tier4_Ultimate = [getSkill('skillPointRefund')].filter(Boolean) as Skill[];


  const sharedProps = { isSkillUnlocked, canUnlockSkill, unlockSkill };

  return (
    <div className="w-full overflow-x-auto">
      <Card className="shadow-lg w-full card-animated min-w-[1200px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl font-headline">Skill Tree</CardTitle>
                <CardDescription>
                  Unlock app features and passive bonuses. Hover over skills for details.
                  <br />
                  <span className="text-xs italic">Note: A visual, branching tree UI with connecting lines is a planned future enhancement!</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Zap className="h-6 w-6 text-yellow-400" />
              <span>{userProfile.skillPoints} Skill Point(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center space-y-10 overflow-visible">
          {/* This layout attempts a more structured, connected look. Lines are simplified. */}

          {/* Tier 1 Row */}
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-around items-start w-full gap-x-8">
              {/* Core Features Branch */}
              <div className="flex flex-col items-center gap-y-2">
                {renderNodes(tier1_CoreFeatures, sharedProps)}
              </div>
              {/* Boosts Branch */}
              <div className="flex flex-col items-center gap-y-2">
                {renderNodes(tier1_Boosts, sharedProps)}
              </div>
              {/* Shop Path Branch */}
              <div className="flex flex-col items-center gap-y-2">
                {renderNodes(tier1_ShopPath, sharedProps)}
              </div>
            </div>
            {/* Connectors to Tier 2 - Simplified visualisation */}
            <div className="flex justify-around w-3/4 mt-4">
              <Connector type="vertical" size="h-10" />
              <Connector type="vertical" size="h-10" />
              <Connector type="vertical" size="h-10" />
            </div>
          </div>
          
          {/* Tier 2 Row - Multiple branches */}
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-around items-start w-full gap-x-6 flex-wrap">
              {/* Notepad Branch */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Notepad</p>
                {renderNodes(tier2_NotepadTabs, sharedProps)}
              </div>
              {/* Stats Branch */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Stats</p>
                {renderNodes(tier2_StatsFeatures, sharedProps)}
              </div>
              {/* Shop Branch */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Shop & Economy</p>
                {renderNodes(tier2_ShopFeatures, sharedProps)}
              </div>
              {/* Boosts Continued Branch */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Boosts</p>
                {renderNodes(tier2_BoostsContinued, sharedProps)}
              </div>
              {/* Utility Features Branch */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Utilities</p>
                {renderNodes(tier2_UtilityFeatures, sharedProps)}
              </div>
            </div>
             <div className="flex justify-around w-full mt-4"> {/* Full width for balanced connector appearance */}
              <Connector type="vertical" size="h-10" className="opacity-50" />
              <Connector type="vertical" size="h-10" className="opacity-50" />
              <Connector type="vertical" size="h-10" className="opacity-50" />
              <Connector type="vertical" size="h-10" className="opacity-50" />
              <Connector type="vertical" size="h-10" className="opacity-50" />
            </div>
          </div>

          {/* Tier 3 Row */}
          <div className="flex flex-col items-center w-full">
            <div className="flex justify-around items-start w-full gap-x-6 flex-wrap">
               {/* Advanced Notepad */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Advanced Notepad</p>
                {renderNodes(tier3_AdvancedNotepad, sharedProps)}
              </div>
               {/* Core Gameplay */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Gameplay</p>
                {renderNodes(tier3_CoreGameplay, sharedProps)}
                 {renderNodes(tier3_AdvancedEconomy, sharedProps)}
              </div>
              {/* Boosts Max */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Max Boosts</p>
                {renderNodes(tier3_BoostsMax, sharedProps)}
              </div>
            </div>
            <div className="flex justify-around w-2/3 mt-4">
              <Connector type="vertical" size="h-10" className="opacity-30" />
              <Connector type="vertical" size="h-10" className="opacity-30" />
               <Connector type="vertical" size="h-10" className="opacity-30" />
            </div>
          </div>

          {/* Tier 4 Row */}
           <div className="flex flex-col items-center w-full">
            <div className="flex justify-around items-start w-full gap-x-6 flex-wrap">
               {/* Expert Notepad */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Expert Notepad</p>
                {renderNodes(tier4_ExpertNotepad, sharedProps)}
              </div>
               {/* Utility Mastery */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Master Utilities</p>
                {renderNodes(tier4_UtilityMastery, sharedProps)}
              </div>
               {/* Ultimate */}
              <div className="flex flex-col items-center gap-y-2 p-2 border border-dashed border-muted-foreground/20 rounded-lg">
                 <p className="text-xs text-muted-foreground mb-1">Ultimate</p>
                {renderNodes(tier4_Ultimate, sharedProps)}
              </div>
            </div>
            {/* No connectors needed below the last tier */}
          </div>

        </CardContent>
        <CardFooter className="mt-6">
          <p className="text-xs text-muted-foreground text-center w-full">
            Skill connections are implied by prerequisites. Hover for details. A more graphical tree is planned!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

