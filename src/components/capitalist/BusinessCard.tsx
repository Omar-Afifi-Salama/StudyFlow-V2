
"use client";

import type { Business } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Zap, TrendingUp, TrendingDown, Info, Unlock, ArrowUpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BusinessCardProps {
  business: Business;
  userCash: number;
  onUnlock: () => void;
  onUpgrade: () => void;
}

export default function BusinessCard({ business, userCash, onUnlock, onUpgrade }: BusinessCardProps) {
  const canUnlock = userCash >= business.unlockCost;
  const canUpgrade = business.unlocked && userCash >= business.upgradeCost;

  return (
    <Card className={`flex flex-col overflow-hidden shadow-md card-animated transition-all duration-300 ${!business.unlocked ? 'opacity-70 bg-muted/30' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold mb-1">{business.name}</CardTitle>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="font-bold">Gimmick: {business.gimmick}</p>
                        <p className="max-w-xs">{business.description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <CardDescription>Level {business.level}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="flex items-center text-sm">
          <Zap className="h-4 w-4 mr-2 text-yellow-500" /> 
          Income/hr: <span className="font-medium ml-1">${business.baseIncome.toLocaleString()}</span>
        </div>
         {business.maintenanceCost && (
            <div className="flex items-center text-sm text-amber-600">
                <TrendingDown className="h-4 w-4 mr-2" />
                Maintenance/hr: <span className="font-medium ml-1">${business.maintenanceCost.toLocaleString()}</span>
            </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        {!business.unlocked ? (
          <Button onClick={onUnlock} disabled={!canUnlock} className="w-full btn-animated">
            <Unlock className="mr-2 h-4 w-4" /> Unlock for ${business.unlockCost.toLocaleString()}
          </Button>
        ) : (
          <Button onClick={onUpgrade} disabled={!canUpgrade} className="w-full btn-animated">
            <ArrowUpCircle className="mr-2 h-4 w-4" /> Upgrade for ${business.upgradeCost.toLocaleString()}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
