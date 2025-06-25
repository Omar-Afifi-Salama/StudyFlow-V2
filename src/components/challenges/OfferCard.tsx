
"use client";

import type { DailyOffer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, DollarSign, Timer, Shield, Sparkles, CheckCircle, Ban, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface OfferCardProps {
  offer: DailyOffer;
  onSelect: () => void;
  isSelected: boolean;
  canSelect: boolean;
}

const getIconForType = (type: DailyOffer['effectType']) => {
  switch (type) {
    case 'xp_gain': return <Zap className="h-5 w-5 text-yellow-400" />;
    case 'cash_gain': return <DollarSign className="h-5 w-5 text-green-500" />;
    case 'timer_efficiency': return <Timer className="h-5 w-5 text-blue-400" />;
    case 'capitalist_income': return <Shield className="h-5 w-5 text-purple-400"/>;
    case 'bond_risk': return <Shield className="h-5 w-5 text-red-400"/>;
    default: return <Sparkles className="h-5 w-5 text-purple-400" />;
  }
};

const EffectDisplay = ({ effect, isPositive }: { effect: string, isPositive: boolean}) => {
    return (
        <div className="flex items-center space-x-2">
            {isPositive 
                ? <TrendingUp className="h-5 w-5 text-green-500"/>
                : <TrendingDown className="h-5 w-5 text-destructive"/>
            }
            <span className={cn(isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                {effect}
            </span>
        </div>
    )
}

export default function OfferCard({ offer, onSelect, isSelected, canSelect }: OfferCardProps) {
  return (
    <Card 
      className={cn(
        "flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 card-animated",
        isSelected && "ring-2 ring-primary border-primary",
        !canSelect && !isSelected && "opacity-60 bg-muted/50"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
                 {getIconForType(offer.effectType)}
                 {offer.title}
            </CardTitle>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><XCircle className="h-4 w-4"/></Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm max-w-xs">{offer.description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="text-sm font-medium p-3 rounded-md bg-muted/50 border space-y-2">
            <EffectDisplay effect={offer.positiveDescription} isPositive={true} />
            <EffectDisplay effect={offer.negativeDescription} isPositive={false} />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {isSelected ? (
           <div className="w-full flex flex-col sm:flex-row gap-2">
              <Button disabled variant="outline" className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" /> Activated
              </Button>
            </div>
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
