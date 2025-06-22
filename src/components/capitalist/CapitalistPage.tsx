
"use client";

import { useSessions } from '@/contexts/SessionContext';
import BusinessCard from './BusinessCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useEffect, useState, useMemo } from 'react';

export default function CapitalistPage() {
  const { userProfile, unlockBusiness, upgradeBusiness, collectBusinessIncome } = useSessions();
  const { businesses } = userProfile;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalIncomePerHour = useMemo(() => {
    return Object.values(businesses).reduce((total, business) => {
      if (business.unlocked) {
        const income = business.baseIncome * Math.pow(1.15, business.level - 1) * (1 - (business.maintenanceCost || 0));
        return total + income;
      }
      return total;
    }, 0);
  }, [businesses]);

  const timeToNextCollection = useMemo(() => {
    const earliestLastCollected = Math.min(...Object.values(businesses)
      .filter(b => b.unlocked)
      .map(b => b.lastCollected)
    );
    if (!isFinite(earliestLastCollected)) return 3600 * 1000;
    const nextCollectionTime = earliestLastCollected + 3600 * 1000;
    return Math.max(0, nextCollectionTime - now);
  }, [businesses, now]);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Banknote className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-headline">Capitalist Corner</CardTitle>
                    <CardDescription>Invest your study earnings to generate passive income.</CardDescription>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Income Potential</p>
                <p className="font-bold text-lg text-green-500">${totalIncomePerHour.toFixed(0)} / hour</p>
                <p className="text-xs text-muted-foreground flex items-center justify-end">
                  <Clock className="mr-1 h-3 w-3"/>
                  Next income accrual in: {formatTime(timeToNextCollection / 1000)}
                </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(businesses).map(business => (
              <BusinessCard
                key={business.id}
                business={business}
                userCash={userProfile.cash}
                onUnlock={() => unlockBusiness(business.id)}
                onUpgrade={() => upgradeBusiness(business.id)}
                onCollect={() => collectBusinessIncome(business.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
