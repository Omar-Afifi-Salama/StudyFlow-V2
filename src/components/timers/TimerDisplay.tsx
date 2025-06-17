import { formatTime } from '@/lib/utils';

interface TimerDisplayProps {
  seconds: number;
  className?: string;
  forceHours?: boolean;
}

export default function TimerDisplay({ seconds, className, forceHours = false }: TimerDisplayProps) {
  return (
    <div className={`font-mono text-7xl md:text-8xl font-bold text-center text-foreground ${className || ''}`}>
      {formatTime(seconds, forceHours)}
    </div>
  );
}
