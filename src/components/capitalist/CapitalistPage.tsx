
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

  const totalIncomePerHour = useMemo(() => {
    return Object.values(businesses).reduce((total, business) => {
      if (business.unlocked) {
        const income = business.baseIncome * Math.pow(1.15, business.level - 1) * (1 - (business.maintenanceCost || 0));
        return total + income;
      }
      return total;
    }, 0);
  }, [businesses]);

  const businessOrder: (keyof typeof businesses)[] = ['farm', 'startup', 'mine', 'industry'];

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
                onCollect={(amount) => collectBusinessIncome(businessId, amount)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
