
"use client";

import type { Skill } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Check, Lock, Gem } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

const getIconComponent = (iconName?: string): React.ComponentType<{ className?: string }> => {
  if (!iconName || !(iconName in LucideIcons)) {
    return LucideIcons.Star; // Default icon if not found or invalid
  }
  const Icon = LucideIcons[iconName as IconName];
  if (typeof Icon === 'string' || typeof Icon === 'number' || typeof Icon === 'boolean' || Icon === null || Icon === undefined) {
    return LucideIcons.Star; // Fallback for non-component exports
  }
  return Icon as React.ComponentType<{ className?: string }>;
};

interface SkillNodeProps {
  skill: Skill;
  isUnlocked: boolean;
  canUnlock: { can: boolean; reason?: string };
  onUnlock: (skillId: string) => void;
  isRoot?: boolean; // Special styling for root nodes
  isLeaf?: boolean; // For potential future styling
  isCentralTrunk?: boolean; // For central path
}

export default function SkillNode({ skill, isUnlocked, canUnlock, onUnlock, isRoot, isLeaf, isCentralTrunk }: SkillNodeProps) {
  const Icon = getIconComponent(skill.iconName);

  let bgColor = 'bg-muted/50 hover:bg-muted/70'; // Locked and cannot afford/prereq
  let textColor = 'text-muted-foreground';
  let borderColor = 'border-muted-foreground/30';
  let iconColor = 'text-muted-foreground/70';

  if (canUnlock.can && !isUnlocked) {
    bgColor = 'bg-primary/20 hover:bg-primary/30'; // Can unlock
    textColor = 'text-primary-foreground';
    borderColor = 'border-primary/50';
    iconColor = 'text-primary';
  } else if (isUnlocked) {
    bgColor = 'bg-green-500/30 hover:bg-green-500/40'; // Unlocked
    textColor = 'text-green-700 dark:text-green-300';
    borderColor = 'border-green-500/70';
    iconColor = 'text-green-600 dark:text-green-400';
  }

  if (isRoot) {
    bgColor = 'bg-accent hover:bg-accent/90';
    textColor = 'text-accent-foreground';
    borderColor = 'border-accent/70';
    iconColor = 'text-accent-foreground';
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'relative w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:shadow-lg border-2',
              bgColor,
              borderColor,
              'group' // For controlling button visibility
            )}
            onClick={() => { if (canUnlock.can && !isUnlocked) onUnlock(skill.id) }}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' && canUnlock.can && !isUnlocked) onUnlock(skill.id) }}
          >
            <Icon className={cn('w-8 h-8 md:w-10 md:h-10 mb-0.5', iconColor)} />
            <span className={cn('text-xs font-medium text-center truncate w-full px-1', textColor)}>
              {skill.name}
            </span>
            {isUnlocked && (
              <Check className="absolute top-1 right-1 h-4 w-4 text-green-600 dark:text-green-400 bg-background rounded-full p-0.5" />
            )}
            {!isUnlocked && !canUnlock.can && (
               <Lock className="absolute top-1 right-1 h-4 w-4 text-destructive bg-background/70 rounded-full p-0.5" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg">
          <div className="space-y-1.5">
            <h4 className="font-bold text-base">{skill.name}</h4>
            <p className="text-sm text-muted-foreground">{skill.description}</p>
            <div className="text-xs space-y-0.5">
              <p className="flex items-center">Cost: <span className="font-semibold ml-1">{skill.cost}</span> <Gem className="inline h-3 w-3 ml-1 text-yellow-400" /></p>
              {skill.prerequisiteLevel && (
                <p>Requires Level: <span className="font-semibold">{skill.prerequisiteLevel}</span></p>
              )}
              {skill.prerequisiteSkillIds && skill.prerequisiteSkillIds.length > 0 && (
                <div>
                  <p>Requires Skills:</p>
                  <ul className="list-disc list-inside pl-3">
                    {skill.prerequisiteSkillIds.map(id => {
                      // In a real app, you'd fetch skill names here. For now, just IDs.
                      // const prereqSkill = ALL_SKILLS.find(s => s.id === id);
                      // return <li key={id}>{prereqSkill?.name || id}</li>;
                      return <li key={id} className="text-muted-foreground/80">{id.replace('unlock','').replace(/([A-Z])/g, ' $1').trim()}</li>;
                    })}
                  </ul>
                </div>
              )}
              {!isUnlocked && !canUnlock.can && canUnlock.reason && (
                <p className="text-destructive mt-1">{canUnlock.reason}</p>
              )}
            </div>
            {canUnlock.can && !isUnlocked && (
              <Button
                onClick={(e) => { e.stopPropagation(); onUnlock(skill.id); }}
                size="sm"
                className="w-full mt-2 btn-animated"
              >
                <Lock className="mr-1.5 h-3.5 w-3.5" /> Unlock ({skill.cost} SP)
              </Button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
