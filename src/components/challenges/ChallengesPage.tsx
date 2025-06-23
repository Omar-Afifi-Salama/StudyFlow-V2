
"use client";

import { useSessions } from '@/contexts/SessionContext';
import ChallengeCard from './ChallengeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, Gift, Sparkles } from 'lucide-react';
import OfferCard from './OfferCard';

export default function ChallengesPage() {
  const { dailyChallenges, claimChallengeReward, dailyOffers, selectDailyOffer, userProfile, deactivateOffer } = useSessions();
  
  const allChallengesClaimed = dailyChallenges.every(c => c.rewardClaimed);

  return (
    <div className="space-y-6">
      <Card className="shadow-lg card-animated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarCheck className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl font-headline">Daily Challenges</CardTitle>
                <CardDescription>Complete challenges for bonus XP and Cash!</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {dailyChallenges.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground text-xl">No challenges available right now.</p>
              <p className="text-muted-foreground">Check back tomorrow for new challenges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyChallenges.map(challenge => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onClaimReward={() => claimChallengeReward(challenge.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg card-animated">
        <CardHeader>
           <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <div>
                <CardTitle className="text-3xl font-headline">Daily Offers</CardTitle>
                <CardDescription>Choose one offer to activate for the day. {allChallengesClaimed && "You've earned a bonus offer!"}</CardDescription>
              </div>
            </div>
        </CardHeader>
        <CardContent>
           {dailyOffers.length === 0 ? (
             <p className="text-muted-foreground text-center py-8">No daily offers available. Check back tomorrow!</p>
           ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyOffers.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  onSelect={() => selectDailyOffer(offer.id)}
                  onDeactivate={() => deactivateOffer(offer.id)}
                  isSelected={userProfile.activeOfferId === offer.id}
                  canSelect={(!userProfile.activeOfferId || allChallengesClaimed) && !userProfile.offerDeactivatedToday}
                />
              ))}
            </div>
           )}
        </CardContent>
      </Card>
      
      <p className="text-sm text-muted-foreground text-center">Challenges and offers reset daily.</p>
    </div>
  );
}
