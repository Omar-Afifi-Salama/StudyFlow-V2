
"use client";

import type { UtilityItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, DollarSign, Lock, Gem, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

type IconName = keyof typeof LucideIcons;

const getIconComponent = (iconName: string): React.ComponentType<{ className?: string }> => {
  if (iconName in LucideIcons) {
    return LucideIcons[iconName as IconName] as React.ComponentType<{ className?: string }>;
  }
  return Zap; // Default icon
};


interface UtilityCardProps {
  item: UtilityItem;
  userCash: number;
  userSkillPoints: number;
  userLevel: number;
  isOwned: boolean;
  onBuy: () => void;
}

export default function UtilityCard({ item, userCash, userSkillPoints, userLevel, isOwned, onBuy }: UtilityCardProps) {
  const canAfford = item.priceType === 'cash' ? userCash >= item.price : userSkillPoints >= item.price;
  const meetsLevelRequirement = userLevel >= item.levelRequirement;
  const canBuy = !isOwned && canAfford && meetsLevelRequirement;

  const Icon = getIconComponent(item.iconName);

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow card-animated",
      isOwned ? "bg-muted/50 opacity-70" : ""
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
        <CardDescription className="text-sm text-muted-foreground mb-3">{item.description}</CardDescription>
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
        {isOwned ? (
          <Button variant="outline" disabled className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" /> Purchased
          </Button>
        ) : (
          <Button onClick={onBuy} disabled={!canBuy} className="w-full btn-animated">
            Buy Item
            {!meetsLevelRequirement && <span className="ml-1 text-xs">(Lvl {item.levelRequirement})</span>}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
