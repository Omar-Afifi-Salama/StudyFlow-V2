import type { StudySession } from '@/types';
import { formatTime, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer, Coffee } from 'lucide-react';

interface SessionItemProps {
  session: StudySession;
}

export default function SessionItem({ session }: SessionItemProps) {
  const getIcon = () => {
    switch (session.type) {
      case 'Stopwatch':
        return <Timer className="h-4 w-4 text-primary" />;
      case 'Pomodoro Focus':
        return <Clock className="h-4 w-4 text-green-500" />;
      case 'Pomodoro Break':
        return <Coffee className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold flex items-center">
            {getIcon()}
            <span className="ml-2">{session.type}</span>
          </CardTitle>
          <Badge variant={session.type.includes('Focus') || session.type === 'Stopwatch' ? 'default' : 'secondary'} className="text-xs">
            {formatTime(session.duration)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground pb-3 px-4">
        <p>{formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}</p>
      </CardContent>
    </Card>
  );
}
