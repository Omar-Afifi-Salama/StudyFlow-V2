
"use client";
import type { StudySession } from '@/types';
import { formatTime, formatDateTime } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Timer, Coffee, Edit3, Trash2 } from 'lucide-react';
import { useSessions } from '@/contexts/SessionContext';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SessionItemProps {
  session: StudySession;
}

export default function SessionItem({ session }: SessionItemProps) {
  const { updateSessionDescription, deleteSession } = useSessions();
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(session.description || '');

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

  const handleDescriptionSave = () => {
    updateSessionDescription(session.id, description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteSession(session.id);
    // Toast notification for deletion is handled in SessionContext
  };

  return (
    <Card className="mb-3 shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold flex items-center">
            {getIcon()}
            <span className="ml-2">{session.type}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={session.type.includes('Focus') || session.type === 'Stopwatch' ? 'default' : 'secondary'} className="text-xs">
              {formatTime(session.duration)}
            </Badge>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/70 hover:text-destructive btn-animated">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this session? This action cannot be undone.
                    <br/>Type: {session.type}, Duration: {formatTime(session.duration)}
                    <br/>Description: {session.description || "N/A"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="btn-animated">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 btn-animated">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground pb-3 px-4">
        <p>{formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}</p>
        {isEditing ? (
          <div className="mt-2 flex items-center space-x-2">
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a note..."
              className="h-8 text-xs"
            />
            <Button size="sm" onClick={handleDescriptionSave} className="h-8 btn-animated">Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 btn-animated">Cancel</Button>
          </div>
        ) : (
          <div className="mt-1 flex justify-between items-center">
            <p className="italic flex-grow mr-2">{session.description || "No description."}</p>
            <Button variant="ghost" size="icon" className="h-6 w-6 btn-animated" onClick={() => setIsEditing(true)}>
              <Edit3 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
