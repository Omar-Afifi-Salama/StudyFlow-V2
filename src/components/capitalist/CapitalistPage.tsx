
"use client";

import { useSessions } from '@/contexts/SessionContext';
import BusinessCard from './BusinessCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';
import BondCard from './BondCard';

export default function CapitalistPage() {
  const { userProfile, unlockBusiness, upgradeBusiness, collectBusinessIncome, claimMaturedBonds, buyBond } = useSessions();
  const { businesses, bonds } = userProfile;
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const totalIncomePerHour = useMemo(() => {
    return Object.values(businesses).reduce((total, business) => {
      if (business.unlocked) {
        // Show gross income potential. Net income is handled on collection.
        const income = business.baseIncome * Math.pow(1.15, business.level - 1);
        return total + income;
      }
      return total;
    }, 0);
  }, [businesses]);
  
  useEffect(() => {
    claimMaturedBonds();
    const interval = setInterval(claimMaturedBonds, 60000); // Check for matured bonds every minute
    return () => clearInterval(interval);
  }, [claimMaturedBonds]);

  const businessOrder: (keyof typeof businesses)[] = ['farm', 'startup', 'mine', 'industry'];

  const timeUntilNextBond = 3600 - ((currentTime - (userProfile.lastBondGenerationTime || 0)) / 1000) % 3600;

  const hasMadeBondChoiceThisCycle = bonds.some(b => b.isPurchased);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Banknote className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-headline">Capitalist Corner</CardTitle>
                    <CardDescription>Invest your study earnings. Income accrues in real-time, but special business traits are applied when you collect.</CardDescription>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Gross Income Potential</p>
                <p className="font-bold text-lg text-green-500">${totalIncomePerHour.toFixed(0)} / hour</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessOrder.map(businessId => (
              <BusinessCard
                key={businessId}
                business={businesses[businessId]}
                userCash={userProfile.cash}
                onUnlock={() => unlockBusiness(businessId)}
                onUpgrade={() => upgradeBusiness(businessId)}
                onCollect={(amount, secondsPassed) => collectBusinessIncome(businessId, amount, secondsPassed)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg card-animated">
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Investment Bonds</CardTitle>
                    <CardDescription>A low-risk, time-based investment. New opportunities available every hour.</CardDescription>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-2"/>
                    New bonds in: {formatTime(timeUntilNextBond)}
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {bonds.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No bonds currently available. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bonds.map(bond => (
                        <BondCard 
                            key={bond.id}
                            bond={bond}
                            onBuy={() => buyBond(bond.id)}
                            userCash={userProfile.cash}
                            isPurchased={bond.isPurchased || false}
                            hasMadeChoice={hasMadeBondChoiceThisCycle}
                        />
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
