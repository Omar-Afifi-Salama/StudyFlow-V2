
"use client";

import { useEffect } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import OfferCard from './OfferCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, RefreshCw, Coins } from 'lucide-react';
import { Button } from '../ui/button';

export default function CapitalistPage() {
  const { userProfile, capitalistOffers, ensureCapitalistOffers, investInOffer, lastOfferGenerationTime } = useSessions();

  useEffect(() => {
    ensureCapitalistOffers();
  }, [ensureCapitalistOffers]);

  const handleRefreshOffers = () => {
    // This could be made more restrictive (e.g., allow manual refresh once a day or for a cost)
    // For now, it will just re-trigger the check which might re-generate if conditions met.
    // To force regeneration for demo, you might need to clear lastOfferGenerationTime in context (not implemented here)
    ensureCapitalistOffers(); 
  };

  const nextRefreshTime = lastOfferGenerationTime ? new Date(lastOfferGenerationTime + 24 * 60 * 60 * 1000) : null;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle className="text-3xl font-headline">Capitalist Corner</CardTitle>
                    <CardDescription>Invest your hard-earned cash for potential returns. High risk, high reward!</CardDescription>
                </div>
            </div>
            <Button onClick={handleRefreshOffers} variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" /> Refresh Offers
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6 p-4 bg-secondary/30 rounded-lg">
            <p className="text-lg">Your Cash: <span className="font-semibold text-yellow-500 flex items-center"><Coins className="h-5 w-5 mr-1"/>{userProfile.cash}</span></p>
            {nextRefreshTime && (
              <p className="text-sm text-muted-foreground">
                Next offer refresh: {nextRefreshTime.toLocaleTimeString()}
              </p>
            )}
          </div>
          
          {capitalistOffers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-xl">No investment offers available right now.</p>
              <p className="text-muted-foreground">Check back later or try refreshing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capitalistOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  userCash={userProfile.cash}
                  onInvest={() => investInOffer(offer.id, offer.investmentAmount)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
