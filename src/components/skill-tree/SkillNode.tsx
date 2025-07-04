
"use client";

import type { Skill } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Check, Lock, Gem, ArrowUpCircle } from 'lucide-react';

type IconName = keyof typeof LucideIcons;

const getIconComponent = (iconName?: string): React.ComponentType<{ className?: string }> => {
  if (!iconName || !(iconName in LucideIcons)) {
    return LucideIcons.Star; 
  }
  const Icon = LucideIcons[iconName as IconName];
  if (typeof Icon === 'string' || typeof Icon === 'number' || typeof Icon === 'boolean' || Icon === null || Icon === undefined) {
    return LucideIcons.Star; 
  }
  return Icon as React.ComponentType<{ className?: string }>;
};

interface SkillNodeProps {
  skill: Skill;
  isUnlocked: boolean;
  canUnlock: { can: boolean; reason?: string };
  onUnlock: (skillId: string) => void;
  isRoot?: boolean; 
  isLeaf?: boolean; 
  isCentralTrunk?: boolean;
  isInfinite?: boolean;
  currentLevel?: number;
}

export default function SkillNode({ skill, isUnlocked, canUnlock, onUnlock, isRoot, isLeaf, isCentralTrunk, isInfinite, currentLevel = 0 }: SkillNodeProps) {
  const Icon = getIconComponent(skill.iconName);

  let bgColor = 'bg-muted/50 hover:bg-muted/70'; 
  let textColor = 'text-muted-foreground';
  let borderColor = 'border-muted-foreground/30';
  let iconColor = 'text-muted-foreground/70';
  
  const effectiveIsUnlocked = isInfinite ? currentLevel > 0 : isUnlocked;

  if (canUnlock.can && !effectiveIsUnlocked) {
    bgColor = 'bg-primary/20 hover:bg-primary/30'; 
    textColor = 'text-primary-foreground';
    borderColor = 'border-primary/50';
    iconColor = 'text-primary';
  } else if (effectiveIsUnlocked) {
    bgColor = 'bg-green-500/30 hover:bg-green-500/40'; 
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
  
  if (isInfinite && currentLevel > 0) {
    bgColor = 'bg-amber-500/30 hover:bg-amber-500/40';
    textColor = 'text-amber-700 dark:text-amber-300';
    borderColor = 'border-amber-500/70';
    iconColor = 'text-amber-600 dark:text-amber-400';
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-1.5 w-24">
            <div
              className={cn(
                'relative w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg border-2 p-1',
                bgColor,
                borderColor,
                'group' 
              )}
              onClick={() => { if (canUnlock.can) onUnlock(skill.id); }}
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' && canUnlock.can) onUnlock(skill.id); }}
              aria-label={`Skill: ${skill.name}`}
            >
              <Icon className={cn('w-8 h-8 mb-0.5', iconColor)} />
              {effectiveIsUnlocked && !isInfinite && (
                <Check className="absolute top-1 right-1 h-4 w-4 text-green-600 dark:text-green-400 bg-background rounded-full p-0.5" />
              )}
               {isInfinite && currentLevel > 0 && (
                <div className="absolute top-0.5 right-0.5 bg-background text-amber-500 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center border border-amber-500">{currentLevel}</div>
              )}
              {!effectiveIsUnlocked && !canUnlock.can && (
                 <Lock className="absolute top-1 right-1 h-4 w-4 text-destructive bg-background/70 rounded-full p-0.5" />
              )}
            </div>
             <span className={cn('text-xs font-medium text-center w-full', textColor)}>
                {skill.name}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg">
          <div className="space-y-1.5">
            <h4 className="font-bold text-base">{skill.name} {isInfinite && currentLevel > 0 && `(Level ${currentLevel})`}</h4>
            <p className="text-sm text-muted-foreground">{skill.description}</p>
            {isInfinite && <p className="text-sm font-semibold text-primary">Current Bonus: +{currentLevel * 5}%</p>}
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
                      const formattedId = id.replace(/^unlock/, '').replace(/([A-Z])/g, ' $1').replace(/Main$/, '').trim();
                      return <li key={id} className="text-muted-foreground/80">{formattedId}</li>;
                    })}
                  </ul>
                </div>
              )}
              {!canUnlock.can && (
                <p className="text-destructive mt-1 font-semibold">{canUnlock.reason}</p>
              )}
            </div>
            {canUnlock.can && (
              <Button
                onClick={(e) => { e.stopPropagation(); onUnlock(skill.id); }}
                size="sm"
                className="w-full mt-2 btn-animated"
              >
                {isInfinite ? <ArrowUpCircle className="mr-1.5 h-3.5 w-3.5" /> : <Lock className="mr-1.5 h-3.5 w-3.5" />}
                {isInfinite ? `Upgrade for ${skill.cost} SP` : `Unlock for ${skill.cost} SP`}
              </Button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
