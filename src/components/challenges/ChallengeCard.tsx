
"use client";

import type { DailyChallenge } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Gift, XCircle, Zap, DollarSign } from 'lucide-react';

interface ChallengeCardProps {
  challenge: DailyChallenge;
  onClaimReward: () => void;
}

export default function ChallengeCard({ challenge, onClaimReward }: ChallengeCardProps) {
  const progressPercent = challenge.targetValue > 0 ? (challenge.currentValue / challenge.targetValue) * 100 : 0;
  const canClaim = challenge.isCompleted && !challenge.rewardClaimed;

  return (
    <Card className={`flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow ${challenge.rewardClaimed ? 'bg-muted/30 opacity-70' : 'bg-card'}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold mb-1">{challenge.title}</CardTitle>
            {challenge.rewardClaimed && <CheckCircle className="h-6 w-6 text-green-500" />}
            {challenge.isCompleted && !challenge.rewardClaimed && <Gift className="h-6 w-6 text-yellow-500 animate-pulse" />}
            {!challenge.isCompleted && <XCircle className="h-6 w-6 text-destructive/50" />}
        </div>
        <CardDescription className="text-sm text-muted-foreground h-12 overflow-y-auto">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress:</span>
            <span>{challenge.currentValue.toLocaleString()} / {challenge.targetValue.toLocaleString()} {challenge.type === 'studyDurationMinutes' ? 'min' : ''}</span>
          </div>
          <Progress value={Math.min(100, progressPercent)} aria-label={`${challenge.title} progress ${progressPercent}%`} />
        </div>
        <div className="text-sm space-y-1">
            <p className="flex items-center"><Zap className="h-4 w-4 mr-2 text-yellow-400" /> XP Reward: <span className="font-medium ml-1">{challenge.xpReward.toLocaleString()}</span></p>
            <p className="flex items-center"><DollarSign className="h-4 w-4 mr-2 text-green-500" /> Cash Reward: <span className="font-medium ml-1">${challenge.cashReward.toLocaleString()}</span></p>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {challenge.rewardClaimed ? (
          <Button disabled className="w-full" variant="ghost">
            <CheckCircle className="mr-2 h-4 w-4" /> Reward Claimed
          </Button>
        ) : (
          <Button onClick={onClaimReward} disabled={!canClaim} className="w-full">
            <Gift className="mr-2 h-4 w-4" /> Claim Reward
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
