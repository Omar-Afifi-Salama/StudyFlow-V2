
"use client";

import type { CapitalistOffer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownRight, ArrowUpRight, BarChart, Coins, Percent, DollarSign } from 'lucide-react';

interface OfferCardProps {
  offer: CapitalistOffer;
  userCash: number;
  onInvest: () => void;
}

export default function OfferCard({ offer, userCash, onInvest }: OfferCardProps) {
  const canAfford = userCash >= offer.investmentAmount;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-1">{offer.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground h-10 overflow-y-auto">{offer.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-2">
        <div className="flex items-center text-sm">
          <DollarSign className="h-4 w-4 mr-2 text-green-500" /> 
          Investment: <span className="font-medium ml-1">{offer.investmentAmount} Cash</span>
        </div>
        <div className="flex items-center text-sm">
          <ArrowUpRight className="h-4 w-4 mr-2 text-green-500" /> 
          Max ROI: <span className="font-medium ml-1">+{offer.maxRoiPercent}%</span>
        </div>
        <div className="flex items-center text-sm">
          <ArrowDownRight className="h-4 w-4 mr-2 text-red-500" /> 
          Min ROI: <span className="font-medium ml-1">{offer.minRoiPercent}%</span>
        </div>
        <div className="flex items-center text-sm">
          <BarChart className="h-4 w-4 mr-2 text-blue-500" /> 
          Volatility: <span className="font-medium ml-1">{(offer.volatilityFactor * 100).toFixed(0)}%</span>
        </div>
         {offer.expiresAt && (
            <p className="text-xs text-muted-foreground pt-2">
                Expires: {new Date(offer.expiresAt).toLocaleTimeString()}
            </p>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button onClick={onInvest} disabled={!canAfford} className="w-full">
          Invest <Coins className="ml-2 h-4 w-4" />
          {!canAfford && <span className="ml-1 text-xs">(Need {offer.investmentAmount - userCash} more)</span>}
        </Button>
      </CardFooter>
    </Card>
  );
}
