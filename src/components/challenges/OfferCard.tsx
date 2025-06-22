
"use client";

import type { DailyOffer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, DollarSign, Timer, Shield, Sparkles, CheckCircle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfferCardProps {
  offer: DailyOffer;
  onSelect: () => void;
  isSelected: boolean;
  canSelect: boolean;
}

const getIconForEffect = (type: DailyOffer['effect']['type']) => {
  switch (type) {
    case 'xp': return <Zap className="h-5 w-5 text-yellow-400" />;
    case 'cash': return <DollarSign className="h-5 w-5 text-green-500" />;
    case 'timer_speed': return <Timer className="h-5 w-5 text-blue-400" />;
    default: return <Sparkles className="h-5 w-5 text-purple-400" />;
  }
};

export default function OfferCard({ offer, onSelect, isSelected, canSelect }: OfferCardProps) {
  const isDebuff = (offer.effect.modifier < 1);

  return (
    <Card 
      className={cn(
        "flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 card-animated",
        isSelected && "ring-2 ring-primary border-primary",
        !canSelect && !isSelected && "opacity-60 bg-muted/50"
      )}
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          {getIconForEffect(offer.effect.type)}
          <CardTitle className={cn("text-xl font-semibold", isDebuff && "text-destructive")}>
            {offer.title}
          </CardTitle>
        </div>
        <CardDescription className="h-10">{offer.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="text-sm font-medium p-2 rounded-md bg-muted/50 border">
          <p><strong>Effect:</strong> {offer.effect.description}</p>
          <p><strong>Duration:</strong> {offer.durationMinutes} minutes</p>
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
            variant={isDebuff ? "destructive" : "default"}
          >
            {canSelect ? <Sparkles className="mr-2 h-4 w-4" /> : <Ban className="mr-2 h-4 w-4" />}
            {canSelect ? 'Activate Offer' : 'Offer Locked'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

    