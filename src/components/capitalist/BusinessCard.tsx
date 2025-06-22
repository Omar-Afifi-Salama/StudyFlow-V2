
"use client";

import type { Business } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Zap, ArrowUpCircle, Info, Lock } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

interface BusinessCardProps {
  business: Business;
  userCash: number;
  onUnlock: () => void;
  onUpgrade: () => void;
  onCollect: () => void;
}

export default function BusinessCard({ business, userCash, onUnlock, onUpgrade, onCollect }: BusinessCardProps) {
  const isLocked = !business.unlocked;
  const upgradeCost = business.level * 1000 * Math.pow(1.2, business.level);
  const canAffordUpgrade = userCash >= upgradeCost;
  
  const incomePerHour = business.baseIncome * Math.pow(1.15, business.level - 1) * (1 - (business.maintenanceCost || 0));

  return (
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow card-animated">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-semibold">{business.name}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-bold mb-1">{business.gimmickTitle}</p>
                <p>{business.gimmickDescription}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>Level {business.level}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="space-y-1">
          <p className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
            Income: ≈ ${incomePerHour.toFixed(0)} / hour
          </p>
          <p className="flex items-center text-sm text-muted-foreground">
            <Zap className="h-4 w-4 mr-2 text-yellow-500" />
            Next Upgrade: +${(incomePerHour * 0.15).toFixed(0)}/hr
          </p>
           {business.maintenanceCost > 0 && (
             <p className="text-xs text-amber-600 dark:text-amber-400">Maintenance: {(business.maintenanceCost * 100).toFixed(0)}% of income</p>
           )}
           {business.depletionRate > 0 && (
             <p className="text-xs text-destructive/80">Depletion: Income reduces over time.</p>
           )}
        </div>
        {business.unlocked && typeof business.lastCollected === 'number' && (
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex justify-between">
              <span>Next Income</span>
              <span>Accrued: ${business.currentCash.toFixed(0)}</span>
            </div>
            <Progress value={(Date.now() - business.lastCollected) / (3600 * 1000) * 100} />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        {isLocked ? (
          <Button onClick={onUnlock} disabled={userCash < business.unlockCost} className="w-full btn-animated">
            <Lock className="mr-2 h-4 w-4" /> Unlock for ${business.unlockCost.toLocaleString()}
          </Button>
        ) : (
          <div className="w-full flex flex-col gap-2">
             <Button onClick={onCollect} className="w-full btn-animated">
                Collect ${business.currentCash.toFixed(0)}
             </Button>
            <Button onClick={onUpgrade} disabled={!canAffordUpgrade} variant="outline" className="w-full btn-animated">
              <ArrowUpCircle className="mr-2 h-4 w-4" /> Upgrade for ${upgradeCost.toLocaleString()}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
