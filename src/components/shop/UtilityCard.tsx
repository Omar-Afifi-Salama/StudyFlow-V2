
"use client";

import { useState, useEffect } from 'react';
import type { UtilityItem, UserProfile } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, Lock, Gem, Zap, Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import { useSessions } from '@/contexts/SessionContext';

type IconName = keyof typeof LucideIcons;

const getIconComponent = (iconName: string): React.ComponentType<{ className?: string }> => {
  if (iconName in LucideIcons) {
    return LucideIcons[iconName as IconName] as React.ComponentType<{ className?: string }>;
  }
  return Zap; // Default icon
};


interface UtilityCardProps {
  item: UtilityItem;
  userProfile: UserProfile;
  isOwned: boolean;
  onBuy: () => void;
}

export default function UtilityCard({ item, userProfile, isOwned, onBuy }: UtilityCardProps) {
  const { userCash, userSkillPoints, userLevel, utilityItemCooldowns } = userProfile;
  const [timeLeft, setTimeLeft] = useState(0);

  const cooldownEndTime = utilityItemCooldowns?.[item.id] || 0;
  const isOnCooldown = cooldownEndTime > Date.now();
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isOnCooldown) {
      const calculateTimeLeft = () => {
        const remaining = Math.max(0, cooldownEndTime - Date.now());
        setTimeLeft(remaining / 1000);
      };
      calculateTimeLeft();
      interval = setInterval(calculateTimeLeft, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnCooldown, cooldownEndTime]);


  const canAfford = item.priceType === 'cash' ? userCash >= item.price : userSkillPoints >= item.price;
  const meetsLevelRequirement = userLevel >= item.levelRequirement;
  
  let canBuy = false;
  let buyButtonText = "Buy Item";
  let disabledReason = "";

  if (isOwned && !item.isConsumable) {
    canBuy = false;
    buyButtonText = "Purchased";
  } else if (isOnCooldown) {
    canBuy = false;
    buyButtonText = "On Cooldown";
  } else if (!meetsLevelRequirement) {
    canBuy = false;
    buyButtonText = `Requires Lvl ${item.levelRequirement}`;
  } else if (!canAfford) {
     canBuy = false;
     buyButtonText = `Need ${item.price.toLocaleString()} ${item.priceType === 'sp' ? 'SP' : '$'}`;
  } else {
    canBuy = true;
  }

  const Icon = getIconComponent(item.iconName);

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow card-animated",
      isOwned && !item.isConsumable ? "bg-muted/50 opacity-70" : ""
    )}>
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardDescription className="text-sm text-muted-foreground mb-3 min-h-[40px]">{item.description}</CardDescription>
        <div className="flex items-center text-sm mb-1">
          {item.priceType === 'cash' ? 
            <DollarSign className="h-4 w-4 mr-1 text-green-500" /> : 
            <Gem className="h-4 w-4 mr-1 text-yellow-400" />
          }
          Price: <span className="ml-1 font-semibold">{item.price.toLocaleString()} {item.priceType === 'sp' ? 'SP' : ''}</span>
        </div>
        <div className="flex items-center text-sm">
          <Lock className="h-4 w-4 mr-1 text-gray-500" /> Requires Level: {item.levelRequirement}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {isOwned && !item.isConsumable ? (
          <Button variant="outline" disabled className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" /> Purchased
          </Button>
        ) : isOnCooldown ? (
          <Button variant="outline" disabled className="w-full">
            <Clock className="mr-2 h-4 w-4 animate-spin" /> {formatTime(timeLeft, true)}
          </Button>
        ) : (
          <Button onClick={onBuy} disabled={!canBuy} className="w-full btn-animated">
            {buyButtonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
