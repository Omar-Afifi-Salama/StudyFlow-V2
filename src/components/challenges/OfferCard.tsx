
"use client";

import type { DailyOffer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, DollarSign, Timer, Shield, Sparkles, CheckCircle, Ban, XCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfferCardProps {
  offer: DailyOffer;
  onSelect: () => void;
  isSelected: boolean;
  canSelect: boolean;
}

const getIconForType = (type: 'xp' | 'cash' | 'timer_speed' | 'risk') => {
  switch (type) {
    case 'xp': return <Zap className="h-5 w-5 text-yellow-400" />;
    case 'cash': return <DollarSign className="h-5 w-5 text-green-500" />;
    case 'timer_speed': return <Timer className="h-5 w-5 text-blue-400" />;
    case 'risk': return <Shield className="h-5 w-5 text-purple-400"/>;
    default: return <Sparkles className="h-5 w-5 text-purple-400" />;
  }
};

const EffectDisplay = ({ effect }: { effect: DailyOffer['positiveEffect']}) => {
    return (
        <div className="flex items-center space-x-2">
            {getIconForType(effect.type)}
            <span className={cn(effect.modifier > 1 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                {effect.description}
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
        <CardTitle className="text-xl font-semibold">
          {offer.title}
        </CardTitle>
        <CardDescription className="h-10">{offer.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="text-sm font-medium p-3 rounded-md bg-muted/50 border space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500"/>
            <EffectDisplay effect={offer.positiveEffect} />
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-destructive"/>
            <EffectDisplay effect={offer.negativeEffect} />
          </div>
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
