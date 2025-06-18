
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import type { Skill } from '@/types';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Network, Gem, Lock, CheckCircle } from 'lucide-react';


type IconName = keyof typeof LucideIcons;

const getIconComponent = (iconName?: string): React.ComponentType<{ className?: string }> | null => {
  if (!iconName || !(iconName in LucideIcons)) {
    return LucideIcons.Star; 
  }
  const Icon = LucideIcons[iconName as IconName];
  if (typeof Icon === 'string' || typeof Icon === 'number' || typeof Icon === 'boolean' || Icon === null || Icon === undefined) {
    return LucideIcons.Star; 
  }
  return Icon as React.ComponentType<{ className?: string }>;
};

export default function SkillTreePageClient() {
  const { userProfile, getAllSkills, isSkillUnlocked, canUnlockSkill, unlockSkill } = useSessions();
  const allSkills = getAllSkills();

  const skillsByCategory: Record<string, Skill[]> = allSkills.reduce((acc, skill) => {
    const category = skill.category || 'Miscellaneous';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryOrder: Skill['category'][] = ['Core Feature', 'Notepad Feature', 'Passive Boost', 'Utility', 'Miscellaneous'];


  const SkillCardDisplay = ({ skill }: { skill: Skill }) => {
    const Icon = getIconComponent(skill.iconName);
    const isUnlocked = isSkillUnlocked(skill.id);
    const { can, reason } = canUnlockSkill(skill.id);

    return (
      <Card
        className={cn(
          "shadow-md hover:shadow-lg transition-shadow card-animated flex flex-col", 
          isUnlocked && "border-primary bg-primary/10",
          !isUnlocked && !can && "opacity-60 bg-muted/50"
        )}
      >
        <CardHeader>
          <div className="flex items-center space-x-3 mb-1">
            {Icon && <Icon className={cn("h-7 w-7", isUnlocked ? "text-primary" : "text-muted-foreground")} />}
            <CardTitle className="text-xl">{skill.name}</CardTitle>
          </div>
          <CardDescription className="text-sm h-12 overflow-y-auto">{skill.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm flex-grow">
          <p className="flex items-center">Cost: <span className="font-semibold ml-1">{skill.cost}</span> <Gem className="inline h-3.5 w-3.5 ml-1 text-yellow-400" /></p>
          {skill.prerequisiteLevel && <p>Requires Level: <span className="font-semibold">{skill.prerequisiteLevel}</span></p>}
          {skill.prerequisiteSkillIds && skill.prerequisiteSkillIds.length > 0 && (
            <div>
              Requires Skills:
              <ul className="list-disc list-inside ml-4 text-xs">
                {skill.prerequisiteSkillIds.map(id => {
                  const prereq = allSkills.find(s => s.id === id);
                  return <li key={id} className={cn(isSkillUnlocked(id) ? "text-green-600" : "text-destructive")}>{prereq?.name || id}</li>;
                })}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isUnlocked ? (
            <Button variant="ghost" disabled className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" /> Unlocked
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip open={!can && reason ? undefined : false}>
                <TooltipTrigger asChild>
                  <span tabIndex={0} className={cn("w-full", !can && "cursor-not-allowed")}>
                    <Button
                      onClick={() => unlockSkill(skill.id)}
                      disabled={!can}
                      className="w-full btn-animated"
                    >
                      <Lock className="mr-2 h-4 w-4" /> Unlock
                    </Button>
                  </span>
                </TooltipTrigger>
                {reason && <TooltipContent><p>{reason}</p></TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    );
  };


  return (
    <Card className="shadow-lg w-full card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Network className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">Skill Tree</CardTitle>
            <CardDescription>
              Spend Skill Points earned from leveling up to unlock new features and gain powerful passive bonuses.
              You have <span className="font-bold text-primary">{userProfile.skillPoints}</span> Skill Point(s).
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {categoryOrder.map(categoryName => {
          const skillsInCategory = skillsByCategory[categoryName];
          if (!skillsInCategory || skillsInCategory.length === 0) return null;
          
          const displaySkills = skillsInCategory.sort((a,b) => (a.prerequisiteLevel || 0) - (b.prerequisiteLevel || 0) || a.cost - b.cost);
          
          if (displaySkills.length === 0) return null;

          return (
            <div key={categoryName}>
              <h2 className="text-2xl font-semibold mb-4 text-primary border-b pb-2">{categoryName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displaySkills.map(skill => <SkillCardDisplay key={skill.id} skill={skill} />)}
              </div>
            </div>
          );
        })}
        <p className="text-center text-muted-foreground text-sm pt-4">
          Note: Skills unlock features and provide bonuses. A visual, branching skill tree UI with connecting lines is planned for a future update!
        </p>
      </CardContent>
    </Card>
  );
}

