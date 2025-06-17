
"use client";

import { useState } from 'react';
import type { CapitalistOffer } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDownRight, ArrowUpRight, BarChart, DollarSign, Percent, Gift } from 'lucide-react';

interface OfferCardProps {
  offer: CapitalistOffer;
  userCash: number;
  onInvest: (investmentAmount: number) => void;
}

export default function OfferCard({ offer, userCash, onInvest }: OfferCardProps) {
  const [investmentAmount, setInvestmentAmount] = useState(offer.minInvestmentAmount);

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setInvestmentAmount(Math.max(0, value)); // Ensure non-negative
    } else if (e.target.value === '') {
      setInvestmentAmount(0); // Allow empty input to clear
    }
  };
  
  const canAfford = userCash >= investmentAmount;
  const meetsMinInvestment = investmentAmount >= offer.minInvestmentAmount;
  const meetsMaxInvestment = offer.maxInvestmentAmount ? investmentAmount <= offer.maxInvestmentAmount : true;
  const isValidInvestment = investmentAmount > 0 && canAfford && meetsMinInvestment && meetsMaxInvestment;


  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold mb-1">{offer.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground h-10 overflow-y-auto">{offer.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <div className="flex items-center text-sm">
          <DollarSign className="h-4 w-4 mr-2 text-green-500" /> 
          Min Investment: <span className="font-medium ml-1">${offer.minInvestmentAmount.toLocaleString()}</span>
        </div>
        {offer.maxInvestmentAmount && (
            <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-red-500" /> 
            Max Investment: <span className="font-medium ml-1">${offer.maxInvestmentAmount.toLocaleString()}</span>
            </div>
        )}
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
         {offer.completionBonusCash && offer.completionBonusCash > 0 && (
          <div className="flex items-center text-sm text-yellow-600">
            <Gift className="h-4 w-4 mr-2" />
            Completion Bonus: <span className="font-medium ml-1">${offer.completionBonusCash.toLocaleString()}</span>
          </div>
        )}
        <div className="space-y-1">
            <label htmlFor={`invest-amount-${offer.id}`} className="text-sm font-medium">Your Investment:</label>
            <Input
                id={`invest-amount-${offer.id}`}
                type="number"
                value={investmentAmount}
                onChange={handleInvestmentChange}
                placeholder={`Min $${offer.minInvestmentAmount.toLocaleString()}`}
                min={offer.minInvestmentAmount}
                max={offer.maxInvestmentAmount || userCash}
                className="h-10"
            />
        </div>
         {offer.expiresAt && (
            <p className="text-xs text-muted-foreground pt-2">
                Expires: {new Date(offer.expiresAt).toLocaleTimeString()}
            </p>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button onClick={() => onInvest(investmentAmount)} disabled={!isValidInvestment} className="w-full">
          Invest <DollarSign className="ml-2 h-4 w-4" />
          {!canAfford && <span className="ml-1 text-xs">(Need ${ (investmentAmount - userCash).toLocaleString() } more)</span>}
          {canAfford && !meetsMinInvestment && <span className="ml-1 text-xs">(Min ${offer.minInvestmentAmount.toLocaleString()})</span>}
          {canAfford && meetsMinInvestment && !meetsMaxInvestment && offer.maxInvestmentAmount && <span className="ml-1 text-xs">(Max ${offer.maxInvestmentAmount.toLocaleString()})</span>}
        </Button>
      </CardFooter>
    </Card>
  );
}
