
"use client";

import type { DailyOffer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfferCardProps {
  offer: DailyOffer;
  onSelect: () => void;
  isSelected: boolean;
  canSelect: boolean;
}

export default function OfferCard({ offer, onSelect, isSelected, canSelect }: OfferCardProps) {
  const isBuff = offer.type === 'buff';
  const isDisabled = !canSelect && !isSelected;

  return (
    <Card 
      className={cn(
        "flex flex-col shadow-md card-animated transition-all duration-300",
        isSelected && "ring-2 ring-primary shadow-primary/30",
        isDisabled && "opacity-60 bg-muted/30",
        canSelect && !isSelected && "hover:border-primary"
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className={cn(
              "text-xl font-semibold mb-1",
              isBuff ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
            )}>
              {isBuff ? <TrendingUp className="inline-block mr-2" /> : <TrendingDown className="inline-block mr-2" />}
              {offer.title}
            </CardTitle>
        </div>
        <CardDescription>{offer.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="flex items-center text-sm">
          {offer.effect.type === 'xp' && <Zap className="h-4 w-4 mr-2 text-yellow-500" />}
          {offer.effect.type === 'cash' && <TrendingUp className="h-4 w-4 mr-2 text-green-500" />}
          {offer.effect.type === 'timer_speed' && <Clock className="h-4 w-4 mr-2 text-blue-500" />}
          Effect: <span className="font-medium ml-1">{offer.effect.description}</span>
        </div>
         <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            Duration: <span className="font-medium ml-1">{offer.durationMinutes} minutes</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {isSelected ? (
          <Button disabled className="w-full btn-animated" variant="secondary">
            <CheckCircle className="mr-2 h-4 w-4" /> Selected
          </Button>
        ) : (
          <Button onClick={onSelect} disabled={isDisabled} className="w-full btn-animated">
            Select Offer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
