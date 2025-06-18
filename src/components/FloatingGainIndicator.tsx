
"use client";

import { useSessions } from '@/contexts/SessionContext';
import { Zap, DollarSign } from 'lucide-react';

export default function FloatingGainIndicator() {
  const { floatingGains } = useSessions();

  if (!floatingGains || floatingGains.length === 0) {
    return null;
  }

  return (
    // Container for all floating gains, positioned at top-right
    // Uses flex-col to stack them, items-end to align them to the right if they have different widths
    <div className="fixed top-16 right-4 z-[1000] pointer-events-none flex flex-col items-end">
      {floatingGains.map(gain => (
        <div
          key={gain.id}
          // Added mb-2 for vertical spacing between individual gain elements
          className={`floating-gain ${gain.type === 'xp' ? 'floating-gain-xp' : 'floating-gain-cash'} mb-2 shadow-lg flex items-center`}
        >
          {gain.type === 'xp' ? <Zap className="h-4 w-4 mr-1.5" /> : <DollarSign className="h-4 w-4 mr-1.5" />}
          +{gain.amount.toLocaleString()} {gain.type.toUpperCase()}
        </div>
      ))}
    </div>
  );
}

