
"use client";

import type { DailyOffer } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, DollarSign, Timer, Shield, Sparkles, CheckCircle, Ban, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const getIconForType = (type: DailyOffer['effectType']) => {
  switch (type) {
    case 'xp_gain': return <Zap className="h-6 w-6 text-yellow-400" />;
    case 'cash_gain': return <DollarSign className="h-6 w-6 text-green-500" />;
    case 'timer_efficiency': return <Timer className="h-6 w-6 text-blue-400" />;
    case 'capitalist_income': return <Shield className="h-6 w-6 text-purple-400"/>;
    case 'bond_risk': return <Shield className="h-6 w-6 text-red-400"/>;
    default: return <Sparkles className="h-6 w-6 text-purple-400" />;
  }
};

const EffectDisplay = ({ description, isPositive }: { description: string, isPositive: boolean }) => (
  <div className="flex items-center space-x-3">
    {isPositive ? 
      <TrendingUp className="h-5 w-5 text-green-500 shrink-0" /> : 
      <TrendingDown className="h-5 w-5 text-destructive shrink-0" />
    }
    <p className={cn("text-sm font-medium", isPositive ? "text-green-600 dark:text-green-400" : "text-destructive")}>
      {description}
    </p>
  </div>
);

export default function OfferCard({ offer, onSelect, isSelected, canSelect }: { offer: DailyOffer; onSelect: () => void; isSelected: boolean; canSelect: boolean; }) {
  return (
    <Card 
      className={cn(
        "flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 card-animated",
        isSelected && "ring-2 ring-primary border-primary",
        !canSelect && !isSelected && "opacity-60 bg-muted/50"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getIconForType(offer.effectType)}
            <CardTitle className="text-xl font-semibold">{offer.title}</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7"><HelpCircle className="h-4 w-4" /></Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">{offer.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 p-4">
        <div className="text-sm font-medium p-4 rounded-md bg-muted/50 border border-border/50 space-y-3">
          <EffectDisplay description={offer.positiveDescription} isPositive={true} />
          <EffectDisplay description={offer.negativeDescription} isPositive={false} />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {isSelected ? (
          <Button disabled variant="outline" className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" /> Activated
          </Button>
        ) : (
          <Button 
            onClick={onSelect} 
            disabled={!canSelect}
            className="w-full btn-animated"
          >
            {canSelect ? <Sparkles className="mr-2 h-4 w-4" /> : <Ban className="mr-2 h-4 w-4" />}
            {canSelect ? 'Activate Offer' : 'Offer Locked'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
