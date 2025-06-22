
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import BusinessCard from './BusinessCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, RefreshCw, DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import type { BusinessType } from '@/types';

const INCOME_COLLECTION_INTERVAL = 60 * 60 * 1000; // 1 hour in ms

export default function CapitalistPage() {
  const { userProfile, collectAllIncome, unlockBusiness, upgradeBusiness } = useSessions();
  const { toast } = useToast();
  const [lastCollected, setLastCollected] = useState(Date.now());
  const [timeToNext, setTimeToNext] = useState(INCOME_COLLECTION_INTERVAL);
  
  const businessOrder: BusinessType[] = ['farm', 'startup', 'mine', 'industry'];
  const businesses = userProfile.businesses ? businessOrder.map(id => userProfile.businesses[id]).filter(b => b) : [];

  const totalHourlyIncome = useMemo(() => {
    if (!userProfile.businesses) return 0;
    return Object.values(userProfile.businesses)
      .filter(b => b.unlocked)
      .reduce((sum, b) => {
          let income = b.baseIncome;
          if (b.maintenanceCost) income -= b.maintenanceCost;
          // Note: This is a simplified display and doesn't account for volatility/depletion gimmicks
          return sum + income;
      }, 0);
  }, [userProfile.businesses]);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeSinceLast = Date.now() - lastCollected;
      const remainingTime = INCOME_COLLECTION_INTERVAL - timeSinceLast;
      if (remainingTime <= 0) {
        handleCollectIncome(); // Auto-collect
      } else {
        setTimeToNext(remainingTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lastCollected]);

  const handleCollectIncome = () => {
    const { totalGains, messages } = collectAllIncome();
    if (totalGains > 0) {
      toast({
        title: "Income Collected!",
        description: `Total gain of $${totalGains.toLocaleString()}. ${messages.join(' ')}`,
      });
    } else {
       toast({
        title: "Income Collected",
        description: `No new income this cycle. ${messages.join(' ')}`,
      });
    }
    setLastCollected(Date.now());
    setTimeToNext(INCOME_COLLECTION_INTERVAL);
  };
  
  const handleUnlock = (type: BusinessType) => {
    if (unlockBusiness(type)) {
      toast({ title: "Business Unlocked!", description: "It will now start generating income." });
    } else {
      toast({ title: "Unlock Failed", description: "Not enough cash to unlock.", variant: "destructive" });
    }
  };

  const handleUpgrade = (type: BusinessType) => {
    if (upgradeBusiness(type)) {
      toast({ title: "Business Upgraded!", description: "Income potential has increased." });
    } else {
      toast({ title: "Upgrade Failed", description: "Not enough cash to upgrade.", variant: "destructive" });
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-headline">Capitalist Corner</CardTitle>
                    <CardDescription>Unlock and upgrade businesses to generate passive income.</CardDescription>
                </div>
            </div>
            <Button onClick={handleCollectIncome} variant="outline" size="sm" className="btn-animated">
                <RefreshCw className="mr-2 h-4 w-4" /> Collect Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-4 bg-secondary/30 rounded-lg">
            <div className="text-lg">Your Cash: <span className="font-semibold text-green-500 flex items-center"><DollarSign className="h-5 w-5 mr-1"/>{userProfile.cash.toLocaleString()}</span></div>
            <div className="text-lg">Total Income/hr: <span className="font-semibold text-primary">${totalHourlyIncome.toLocaleString()}</span></div>
            <div className="text-sm text-muted-foreground">
              Next income accrual in: {formatTime(timeToNext)}
            </div>
          </div>
          
          {businesses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-xl">Loading businesses...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businesses.map(biz => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  userCash={userProfile.cash}
                  onUnlock={() => handleUnlock(biz.id)}
                  onUpgrade={() => handleUpgrade(biz.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
