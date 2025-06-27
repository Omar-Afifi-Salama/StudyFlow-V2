"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadCountdownEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Trash2, CalendarIcon, Edit3, Save, XCircle, TimerIcon } from 'lucide-react';
import { format, parseISO, isValid, differenceInSeconds, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '../ui/label';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
}

const calculateTimeLeft = (targetDateString: string): TimeLeft => {
  const targetDate = parseISO(targetDateString);
  if (!isValid(targetDate)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isPast: true };
  }

  const now = new Date();
  const totalSeconds = differenceInSeconds(targetDate, now);

  if (totalSeconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isPast: true };
  }

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return { days, hours, minutes, seconds, totalSeconds, isPast: false };
};


export default function EventsCountdownTab() {
  const { userProfile, addNotepadCountdownEvent, updateNotepadCountdownEvent, deleteNotepadCountdownEvent } = useSessions();
  const events = userProfile.notepadData.countdownEvents || [];

  const [newEventName, setNewEventName] = useState('');
  const [newTargetDate, setNewTargetDate] = useState<Date | undefined>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Default to tomorrow
  const [newTargetTime, setNewTargetTime] = useState('12:00'); // Default time

  const [editingEvent, setEditingEvent] = useState<NotepadCountdownEvent | null>(null);
  const [editEventName, setEditEventName] = useState('');
  const [editTargetDate, setEditTargetDate] = useState<Date | undefined>(undefined);
  const [editTargetTime, setEditTargetTime] = useState('12:00');
  
  const [timeDisplays, setTimeDisplays] = useState<Record<string, TimeLeft>>({});

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newDisplays: Record<string, TimeLeft> = {};
      events.forEach(event => {
        newDisplays[event.id] = calculateTimeLeft(event.targetDate);
      });
      setTimeDisplays(newDisplays);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [events]);

  const combineDateAndTime = (date: Date | undefined, time: string): string | null => {
    if (!date || !isValid(date)) return null;
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    
    const combinedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    return combinedDate.toISOString();
  };


  const handleAddEvent = () => {
    const targetDateTimeISO = combineDateAndTime(newTargetDate, newTargetTime);
    if (newEventName.trim() === '' || !targetDateTimeISO) {
        alert("Please provide a valid name, date, and time for the event.");
        return;
    }

    addNotepadCountdownEvent({ name: newEventName.trim(), targetDate: targetDateTimeISO });
    setNewEventName('');
    setNewTargetDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
    setNewTargetTime('12:00');
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteNotepadCountdownEvent(eventId);
  };

  const startEditing = (event: NotepadCountdownEvent) => {
    setEditingEvent(event);
    setEditEventName(event.name);
    const parsedDate = parseISO(event.targetDate);
    if (isValid(parsedDate)) {
      setEditTargetDate(parsedDate);
      setEditTargetTime(format(parsedDate, "HH:mm"));
    } else {
      setEditTargetDate(undefined);
      setEditTargetTime("12:00");
    }
  };

  const cancelEditing = () => {
    setEditingEvent(null);
    setEditEventName('');
    setEditTargetDate(undefined);
    setEditTargetTime('12:00');
  };

  const handleSaveEdit = () => {
    if (!editingEvent) return;
    const targetDateTimeISO = combineDateAndTime(editTargetDate, editTargetTime);
    if (editEventName.trim() === '' || !targetDateTimeISO) {
      alert("Please provide a valid name, date, and time for the event.");
      return;
    }
    updateNotepadCountdownEvent({ ...editingEvent, name: editEventName.trim(), targetDate: targetDateTimeISO });
    cancelEditing();
  };

  const renderEventForm = (isEditMode: boolean) => {
    const name = isEditMode ? editEventName : newEventName;
    const setName = isEditMode ? setEditEventName : setNewEventName;
    const date = isEditMode ? editTargetDate : newTargetDate;
    const setDate = isEditMode ? setEditTargetDate : setNewTargetDate;
    const time = isEditMode ? editTargetTime : newTargetTime;
    const setTime = isEditMode ? setEditTargetTime : setNewTargetTime;
    const handleSubmit = isEditMode ? handleSaveEdit : handleAddEvent;
    const handleCancel = isEditMode ? cancelEditing : () => {
      setNewEventName('');
      setNewTargetDate(new Date(Date.now() + 24 * 60 * 60 * 1000));
      setNewTargetTime('12:00');
    };

    return (
      <div className={`p-4 border rounded-lg space-y-3 mb-6 card-animated ${isEditMode ? 'bg-muted/30' : 'bg-card'}`}>
        <h3 className="text-lg font-semibold">{isEditMode ? 'Edit Event Countdown' : 'Add New Event Countdown'}</h3>
        <Input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="btn-animated"
          aria-label="Event name"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:flex-1 justify-start text-left font-normal btn-animated">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {(date && isValid(date)) ? format(date, 'PPP') : <span>Pick date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))} />
            </PopoverContent>
          </Popover>
          <div className="w-full sm:w-auto">
             <Label htmlFor={isEditMode ? "edit-event-time" : "new-event-time"} className="sr-only">Event Time</Label>
             <Input
                id={isEditMode ? "edit-event-time" : "new-event-time"}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full sm:w-[120px] btn-animated"
                aria-label="Event time"
             />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={handleCancel} className="btn-animated">
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSubmit} className="btn-animated">
            {isEditMode ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {isEditMode ? 'Save Changes' : 'Add Event'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="card-animated">
      <CardHeader>
        <CardTitle>Event Countdowns</CardTitle>
        <CardDescription>Track upcoming deadlines and important dates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {editingEvent ? renderEventForm(true) : renderEventForm(false)}

        {events.length === 0 && !editingEvent ? (
          <p className="text-muted-foreground text-center py-4">No countdown events set up yet.</p>
        ) : (
          <ul className="space-y-4">
            {events.map(event => {
              const timeLeft = timeDisplays[event.id] || calculateTimeLeft(event.targetDate);
              const initialDuration = differenceInSeconds(parseISO(event.targetDate), new Date(event.createdAt));
              const progress = initialDuration > 0 && !timeLeft.isPast ? Math.max(0, Math.min(100, ((initialDuration - timeLeft.totalSeconds) / initialDuration) * 100)) : (timeLeft.isPast ? 100 : 0);

              return (
                <li key={event.id} className={`p-4 rounded-md border card-animated ${timeLeft.isPast ? 'bg-muted/50 opacity-70' : 'bg-card'} ${editingEvent?.id === event.id ? 'ring-2 ring-primary' : ''}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                    <div className="flex-grow mb-2 sm:mb-0">
                      <h4 className="text-xl font-semibold">{event.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Target: {isValid(parseISO(event.targetDate)) ? format(parseISO(event.targetDate), 'PPPp') : 'Invalid Date'}
                      </p>
                    </div>
                    <div className="flex space-x-1 self-start sm:self-center">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(event)} disabled={!!editingEvent && editingEvent.id !== event.id} className="btn-animated" aria-label={`Edit event ${event.name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={!!editingEvent} className="btn-animated" aria-label={`Delete event ${event.name}`}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the event "{event.name}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="btn-animated">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="btn-animated" onClick={() => handleDeleteEvent(event.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {timeLeft.isPast ? (
                    <div className="text-center text-lg font-semibold text-primary py-2">Event Passed!</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center mb-3">
                        <div><span className="text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span><p className="text-xs text-muted-foreground">Days</p></div>
                        <div><span className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span><p className="text-xs text-muted-foreground">Hours</p></div>
                        <div><span className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span><p className="text-xs text-muted-foreground">Minutes</p></div>
                        <div><span className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span><p className="text-xs text-muted-foreground">Seconds</p></div>
                      </div>
                      <Progress value={progress} aria-label={`${event.name} progress ${progress.toFixed(0)}%`} />
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}