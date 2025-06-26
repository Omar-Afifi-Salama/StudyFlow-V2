"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Zap, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FloatingGainIndicator() {
  const { floatingGains } = useSessions();

  if (!floatingGains || floatingGains.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-[1000] pointer-events-none flex flex-col items-end">
      {floatingGains.map(gain => {
        const isLoss = gain.amount < 0;
        const gainClass = isLoss ? 'floating-gain-loss' : (gain.type === 'xp' ? 'floating-gain-xp' : 'floating-gain-cash');

        return (
          <div
            key={gain.id}
            className={cn('floating-gain mb-2 shadow-lg flex items-center', gainClass)}
          >
            {gain.type === 'xp' ? <Zap className="h-4 w-4 mr-1.5" /> : <DollarSign className="h-4 w-4 mr-1.5" />}
            {gain.amount > 0 ? '+' : ''}{gain.amount.toLocaleString()} {gain.type.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}
