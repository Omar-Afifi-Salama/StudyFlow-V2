
"use client";

import { useSessions } from '@/contexts/SessionContext';
import ChallengeCard from './ChallengeCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button'; // Assuming Button component exists

export default function ChallengesPage() {
  const { dailyChallenges, claimChallengeReward } = useSessions();
  // In a real app, ensureDailyChallenges would be called, perhaps with a manual refresh option
  // For now, challenges are reset daily based on localStorage logic in SessionContext

  // const handleRefreshChallenges = () => {
  //   // Potentially add a manual refresh if needed, though SessionContext handles daily reset
  //   // ensureDailyChallenges(); // This function would need to be exposed by useSessions
  //   console.log("Manual refresh challenges clicked (not implemented for forced refresh yet)");
  // };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarCheck className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl font-headline">Daily Challenges</CardTitle>
                <CardDescription>Complete challenges for bonus XP and Cash!</CardDescription>
              </div>
            </div>
            {/* <Button onClick={handleRefreshChallenges} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Challenges 
            </Button> */}
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
      <p className="text-sm text-muted-foreground text-center">Challenges reset daily.</p>
    </div>
  );
}
