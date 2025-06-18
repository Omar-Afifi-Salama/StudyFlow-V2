
"use client";

import { useSessions, ALL_SKILLS } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SkillNode from './SkillNode';
import type { Skill } from '@/types';
import { Network, Zap } from 'lucide-react'; // Zap for skill points, Network for tree
import { cn } from '@/lib/utils';

// Connector component for drawing lines (simplified)
const Connector = ({ type = 'vertical', length = 'h-8', className = '' }: { type?: 'vertical' | 'horizontal' | 'elbow-br' | 'elbow-bl' | 'elbow-tr' | 'elbow-tl', length?: string, className?: string }) => {
  const baseClass = "bg-border shrink-0";
  let sizeClass = '';
  if (type === 'vertical') sizeClass = `w-0.5 ${length}`;
  else if (type === 'horizontal') sizeClass = `h-0.5 ${length}`;
  else { // Elbows and complex connectors will be simple lines for now
    sizeClass = type.startsWith('elbow-b') || type.startsWith('elbow-t') ? `w-0.5 ${length}` : `h-0.5 ${length}`;
  }
  return <div className={cn(baseClass, sizeClass, className)}></div>;
};


// Define the order of categories for display
const categoryOrder: Skill['category'][] = ['Core Feature', 'Notepad Feature', 'Passive Boost', 'Utility'];

export default function SkillTreePageClient() {
  const { userProfile, getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  const allSkills = getAllSkills();
  const getSkill = (id: string): Skill | undefined => allSkills.find(s => s.id === id);

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    allSkills.forEach(skill => {
      const category = skill.category || 'Utility'; // Default to Utility if no category
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });
    // Sort skills within each category, e.g., by cost or level
    for (const category in grouped) {
      grouped[category].sort((a, b) => (a.cost - b.cost) || (a.prerequisiteLevel || 0) - (b.prerequisiteLevel || 0));
    }
    return grouped;
  }, [allSkills]);

  const renderSkillNode = (skill: Skill | undefined) => {
    if (!skill) return <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">Skill Error</div>;
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
  
  // Define a simplified tree structure manually for layout purposes
  // This is a conceptual layout; actual prerequisites will still be checked by canUnlockSkill
  // Tier 0 (Always Unlocked - conceptual, not rendered as interactive nodes here but assumed)
  // const rootSkills = [getSkill('unlockTimers'), getSkill('unlockSkillTree')];

  // Tier 1: Initial Unlocks
  const tier1_Core = [getSkill('unlockAbout'), getSkill('unlockNotepadMain'), getSkill('unlockStats')];
  const tier1_Boosts = [getSkill('xpBoost1'), getSkill('cashBoost1')];

  // Tier 2: Branching from Tier 1
  const tier2_NotepadTabs = [getSkill('unlockNotepadChecklist'), getSkill('unlockNotepadNotes')];
  const tier2_Features = [getSkill('unlockAchievements'), getSkill('unlockShop'), getSkill('unlockAmbiance')];
  const tier2_Boosts = [getSkill('xpBoost2'), getSkill('cashBoost2')];

  // Tier 3: Further Branching
  const tier3_NotepadAdvanced = [getSkill('unlockNotepadGoals'), getSkill('unlockNotepadLinks'), getSkill('unlockNotepadRevision')];
  const tier3_Gameplay = [getSkill('unlockChallenges'), getSkill('unlockCountdown'), getSkill('unlockCapitalist')];
  const tier3_Boosts = [getSkill('xpBoost3'), getSkill('cashBoost3'), getSkill('shopDiscount1')];

  // Tier 4: Expert/Endgame Features
  const tier4_NotepadExpert = [getSkill('unlockNotepadEisenhower'), getSkill('unlockNotepadEvents'), getSkill('unlockNotepadHabits')];
  const tier4_Utility = [getSkill('streakShield'), getSkill('investmentInsight'), getSkill('revisionAccelerator')];
  const tier4_Ultimate = [getSkill('skillPointRefund')];


  return (
    <div className="w-full overflow-x-auto">
      <Card className="shadow-lg w-full card-animated min-w-[1200px]"> {/* Increased min-width for wider tree */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl font-headline">Skill Tree</CardTitle>
                <CardDescription>
                  Unlock app features and passive bonuses by spending Skill Points. Hover over skills for details.
                  <br />
                  <span className="text-xs italic font-semibold text-primary">Note: A visual, interconnected tree diagram UI is a planned future enhancement!</span>
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-lg font-semibold">
              <Zap className="h-6 w-6 text-yellow-400" /> {/* Changed icon to Zap */}
              <span>{userProfile.skillPoints} Skill Point(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center space-y-6 overflow-visible">
          {/* Tier 1 */}
          <div className="flex flex-col items-center w-full space-y-4">
            <p className="text-sm font-semibold text-muted-foreground">Tier 1: Foundations</p>
            <div className="flex justify-around items-start w-full max-w-3xl">
              <div className="flex flex-col items-center space-y-2">{tier1_Core.map(renderSkillNode)}</div>
              <Connector type="vertical" length="h-16" className="opacity-0" /> {/* Spacer */}
              <div className="flex flex-col items-center space-y-2">{tier1_Boosts.map(renderSkillNode)}</div>
            </div>
            <div className="flex w-2/3 justify-around mt-1">
                <Connector type="vertical" length="h-6" />
                <Connector type="vertical" length="h-6" />
            </div>
          </div>

          {/* Tier 2 */}
          <div className="flex flex-col items-center w-full space-y-4">
            <p className="text-sm font-semibold text-muted-foreground">Tier 2: Specialization</p>
            <div className="flex justify-around items-start w-full max-w-4xl">
              <div className="flex flex-col items-center space-y-2">{tier2_NotepadTabs.map(renderSkillNode)}</div>
              <div className="flex flex-col items-center space-y-2">{tier2_Features.map(renderSkillNode)}</div>
              <div className="flex flex-col items-center space-y-2">{tier2_Boosts.map(renderSkillNode)}</div>
            </div>
            <div className="flex w-full justify-around mt-1">
                <Connector type="vertical" length="h-6" />
                <Connector type="vertical" length="h-6" />
                <Connector type="vertical" length="h-6" />
            </div>
          </div>
          
          {/* Tier 3 */}
          <div className="flex flex-col items-center w-full space-y-4">
            <p className="text-sm font-semibold text-muted-foreground">Tier 3: Advancement</p>
            <div className="flex justify-around items-start w-full max-w-5xl">
              <div className="flex flex-col items-center space-y-2">{tier3_NotepadAdvanced.map(renderSkillNode)}</div>
              <div className="flex flex-col items-center space-y-2">{tier3_Gameplay.map(renderSkillNode)}</div>
              <div className="flex flex-col items-center space-y-2">{tier3_Boosts.map(renderSkillNode)}</div>
            </div>
             <div className="flex w-full justify-around mt-1">
                <Connector type="vertical" length="h-6" />
                <Connector type="vertical" length="h-6" />
                <Connector type="vertical" length="h-6" />
            </div>
          </div>

          {/* Tier 4 */}
          <div className="flex flex-col items-center w-full space-y-4">
             <p className="text-sm font-semibold text-muted-foreground">Tier 4: Mastery</p>
            <div className="flex justify-around items-start w-full max-w-5xl">
              <div className="flex flex-col items-center space-y-2">{tier4_NotepadExpert.map(renderSkillNode)}</div>
              <div className="flex flex-col items-center space-y-2">{tier4_Utility.map(renderSkillNode)}</div>
              <div className="flex flex-col items-center space-y-2">{tier4_Ultimate.map(renderSkillNode)}</div>
            </div>
          </div>
          
          {/* Fallback for any uncategorized skills, though ideally all are placed above */}
          {Object.entries(skillsByCategory)
            .filter(([category]) => !['Core Feature', 'Notepad Feature', 'Passive Boost', 'Utility'].includes(category) && skillsByCategory[category].length > 0)
            .sort(([catA], [catB]) => categoryOrder.indexOf(catA as Skill['category']) - categoryOrder.indexOf(catB as Skill['category']))
            .map(([category, skills]) => (
              <div key={category} className="w-full">
                <h3 className="text-lg font-semibold text-center my-3 text-primary">{category}</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {skills.map(renderSkillNode)}
                </div>
              </div>
          ))}

        </CardContent>
        <CardFooter className="mt-6 border-t pt-4">
          <p className="text-xs text-muted-foreground text-center w-full">
            Skills unlock features and provide passive bonuses. Hover over a skill for more details.
            <br />
            A visual, interconnected tree diagram UI is a planned future enhancement.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    