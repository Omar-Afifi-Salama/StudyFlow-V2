
"use client";

import type { Bond } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Percent, Hourglass, ShoppingCart, CheckCircle } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface BondCardProps {
  bond: Bond;
  userCash: number;
  onBuy: () => void;
}

export default function BondCard({ bond, userCash, onBuy }: BondCardProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  const profit = bond.returnValue - bond.cost;
  const profitPercentage = (profit / bond.cost) * 100;
  const canAfford = userCash >= bond.cost;
  const isPurchased = bond.purchaseTime > 0;

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
    <Card className="flex flex-col shadow-md hover:shadow-lg transition-shadow card-animated">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Government Bond</CardTitle>
        <CardDescription>A secure, fixed-return investment.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p className="flex items-center text-sm"><DollarSign className="h-4 w-4 mr-2 text-green-500" />Cost: ${bond.cost.toLocaleString()}</p>
        <p className="flex items-center text-sm"><DollarSign className="h-4 w-4 mr-2 text-primary" />Returns: ${bond.returnValue.toLocaleString()}</p>
        <p className="flex items-center text-sm"><Percent className="h-4 w-4 mr-2 text-yellow-500" />Profit: ${profit.toLocaleString()} ({profitPercentage.toFixed(1)}%)</p>
        {isPurchased && (
          <p className="flex items-center text-sm font-semibold pt-2"><Hourglass className="h-4 w-4 mr-2 animate-spin" />Matures in: {formatTime(timeLeft, true)}</p>
        )}
      </CardContent>
      <CardFooter>
        {isPurchased ? (
           <Button disabled className="w-full" variant="outline">
             <CheckCircle className="mr-2 h-4 w-4" /> Purchased
           </Button>
        ) : (
            <Button onClick={onBuy} disabled={!canAfford} className="w-full btn-animated">
              <ShoppingCart className="mr-2 h-4 w-4" /> Buy Bond
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
