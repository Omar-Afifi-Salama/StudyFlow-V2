
"use client";

import type { Bond } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Percent, Hourglass, ShoppingCart, CheckCircle, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatTime, cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface BondCardProps {
  bond: Bond;
  userCash: number;
  onBuy: () => void;
  isPurchased: boolean;
  hasMadeChoice: boolean;
}

export default function BondCard({ bond, userCash, onBuy, isPurchased, hasMadeChoice }: BondCardProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  const canAfford = userCash >= bond.cost;
  const canBuy = canAfford && !hasMadeChoice;

  const riskColorMap = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  const riskBgMap = {
    low: "bg-green-500/10 border-green-500/20",
    medium: "bg-yellow-500/10 border-yellow-500/20",
    high: "bg-red-500/10 border-red-500/20",
  }

  useEffect(() => {
    if (isPurchased) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, bond.maturityTime - Date.now());
        setTimeLeft(remaining / 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPurchased, bond.maturityTime]);

  return (
    <Card className={cn(
        "flex flex-col shadow-md hover:shadow-lg transition-shadow card-animated border-2",
        isPurchased ? "border-primary" : "border-transparent",
        hasMadeChoice && !isPurchased ? "opacity-50 bg-muted/50" : ""
    )}>
      <CardHeader className={cn("p-4", riskBgMap[bond.risk])}>
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">{bond.name}</CardTitle>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <HelpCircle className="h-5 w-5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent><p>{bond.description}</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <CardDescription className={cn("capitalize font-medium", riskColorMap[bond.risk])}>{bond.risk} Risk</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 p-4">
        <p className="flex items-center text-sm"><DollarSign className="h-4 w-4 mr-2 text-green-500" />Cost: ${bond.cost.toLocaleString()}</p>
        <p className="flex items-center text-sm"><TrendingUp className="h-4 w-4 mr-2 text-primary" />Potential Return: ${bond.potentialReturnValue.toLocaleString()}</p>
        <p className="flex items-center text-sm"><TrendingDown className="h-4 w-4 mr-2 text-destructive" />Potential Loss: ${bond.potentialLossValue.toLocaleString()}</p>

        {isPurchased && (
          <p className="flex items-center text-sm font-semibold pt-2 text-primary"><Hourglass className="h-4 w-4 mr-2 animate-spin" />Matures in: {formatTime(timeLeft, true)}</p>
        )}
      </CardContent>
      <CardFooter className="p-4">
        {isPurchased ? (
           <Button disabled className="w-full" variant="outline">
             <CheckCircle className="mr-2 h-4 w-4" /> Purchased
           </Button>
        ) : (
            <Button onClick={onBuy} disabled={!canBuy} className="w-full btn-animated">
              <ShoppingCart className="mr-2 h-4 w-4" /> Invest
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
