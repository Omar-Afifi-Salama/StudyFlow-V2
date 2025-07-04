
"use client";

import type { Skill } from '@/types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Check, Lock, Zap as InfamyPointIcon } from 'lucide-react';

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

interface InfamySkillNodeProps {
  skill: Skill;
  isUnlocked: boolean;
  canUnlock: { can: boolean; reason?: string };
  onUnlock: (skillId: string) => void;
}

export default function InfamySkillNode({ skill, isUnlocked, canUnlock, onUnlock }: InfamySkillNodeProps) {
  const Icon = getIconComponent(skill.iconName);

  let bgColor = 'bg-muted/50 hover:bg-muted/70'; 
  let textColor = 'text-muted-foreground';
  let borderColor = 'border-muted-foreground/30';
  let iconColor = 'text-muted-foreground/70';
  
  if (canUnlock.can) {
    bgColor = 'bg-purple-500/20 hover:bg-purple-500/30';
    textColor = 'text-purple-700 dark:text-purple-300';
    borderColor = 'border-purple-500/50';
    iconColor = 'text-purple-500';
  } else if (isUnlocked) {
    bgColor = 'bg-green-500/30 hover:bg-green-500/40';
    textColor = 'text-green-700 dark:text-green-300';
    borderColor = 'border-green-500/70';
    iconColor = 'text-green-600 dark:text-green-400';
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-1.5 w-24">
            <div
              className={cn(
                'relative w-24 h-24 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg border-2 p-1 text-center',
                bgColor,
                borderColor,
                'group' 
              )}
              onClick={() => { if (canUnlock.can) onUnlock(skill.id); }}
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter' && canUnlock.can) onUnlock(skill.id); }}
              aria-label={`Infamy Skill: ${skill.name}`}
            >
              <Icon className={cn('w-8 h-8 mb-1', iconColor)} />
               <span className={cn('text-xs font-medium', textColor)}>
                {skill.name}
               </span>
              {isUnlocked && (
                <Check className="absolute top-1 right-1 h-4 w-4 text-green-600 dark:text-green-400 bg-background rounded-full p-0.5" />
              )}
              {!isUnlocked && !canUnlock.can && (
                 <Lock className="absolute top-1 right-1 h-4 w-4 text-destructive bg-background/70 rounded-full p-0.5" />
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs bg-popover text-popover-foreground p-3 rounded-md shadow-lg">
          <div className="space-y-1.5">
            <h4 className="font-bold text-base">{skill.name}</h4>
            <p className="text-sm text-muted-foreground">{skill.description}</p>
            <div className="text-xs space-y-0.5">
              <p className="flex items-center">Cost: <span className="font-semibold ml-1">{skill.cost}</span> <InfamyPointIcon className="inline h-3 w-3 ml-1 text-purple-400" /></p>
              {skill.prerequisiteLevel && (
                <p>Requires Infamy Level: <span className="font-semibold">{skill.prerequisiteLevel}</span></p>
              )}
              {!canUnlock.can && (
                <p className="text-destructive mt-1 font-semibold">{canUnlock.reason}</p>
              )}
            </div>
            {canUnlock.can && (
              <Button
                onClick={(e) => { e.stopPropagation(); onUnlock(skill.id); }}
                size="sm"
                className="w-full mt-2 btn-animated bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Lock className="mr-1.5 h-3.5 w-3.5" />
                Unlock for {skill.cost} IP
              </Button>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
