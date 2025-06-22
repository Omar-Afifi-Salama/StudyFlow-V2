
"use client";

import { useSessions } from '@/contexts/SessionContext';
import OfferCard from './OfferCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function DailyOffersPage() {
  const { dailyOffers, selectDailyOffer, userProfile } = useSessions();
  const [timeToNext, setTimeToNext] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      setTimeToNext(diff);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const canSelectOffer = !userProfile.activeOfferId;
  const activeOffer = userProfile.activeOfferId ? dailyOffers.find(o => o.id === userProfile.activeOfferId) || userProfile.dailyOffers.offers.find(o=> o.id === userProfile.activeOfferId) : null;
  const timeLeftOnActiveOffer = userProfile.activeOfferEndTime ? Math.max(0, userProfile.activeOfferEndTime - Date.now()) : 0;


  return (
    <div className="space-y-6">
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <Sparkles className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-headline">Daily Offers</CardTitle>
                    <CardDescription>Choose one of these temporary modifiers for today!</CardDescription>
                </div>
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="mr-2 h-4 w-4"/>
              New offers in: {formatTime(timeToNext / 1000)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dailyOffers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-xl">Loading today's offers...</p>
            </div>
          ) : (
             <>
              {activeOffer && timeLeftOnActiveOffer > 0 && (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
                  <h3 className="font-semibold text-lg text-primary">Active Offer: {activeOffer.title}</h3>
                  <p className="text-sm text-primary/80">{activeOffer.effect.description}</p>
                   <p className="text-xs text-muted-foreground mt-1">Time Remaining: {formatTime(timeLeftOnActiveOffer / 1000)}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailyOffers.map(offer => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onSelect={() => selectDailyOffer(offer.id)}
                    isSelected={userProfile.activeOfferId === offer.id}
                    canSelect={canSelectOffer}
                  />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
