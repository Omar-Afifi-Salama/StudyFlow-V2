
"use client";

import { useState, useMemo } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { Habit, HabitFrequency, HabitLogEntry, NotepadData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit3, Trash2, Save, XCircle, CalendarDays, TrendingUp, Flame, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, subDays, isSameDay, getWeek, parseISO, isValid } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent as ShadTooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';


const PREDEFINED_COLORS = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF", "#E0E0E0", "#FF9AA2", "#FFDAC1", "#B5EAD7", "#C7CEEA", "#F3E6E8"];


export default function HabitTrackerTab() {
  const { userProfile, addHabit, updateHabit, deleteHabit, logHabitCompletion, getHabitCompletionForDate, getHabitCompletionsForWeek } = useSessions();
  
  const habitsList = useMemo(() => {
    return Array.isArray(userProfile.notepadData?.habits) ? userProfile.notepadData.habits : [];
  }, [userProfile.notepadData?.habits]);


  const [isEditing, setIsEditing] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<Partial<Habit> | null>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [habitViewMode, setHabitViewMode] = useState<'daily' | 'weekly-overview'>('daily');


  const openEditor = (habit?: Habit) => {
    setCurrentHabit(habit ? { ...habit } : { name: '', frequency: 'daily', color: PREDEFINED_COLORS[0], targetCompletions: 1 });
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    setCurrentHabit(null);
  };

  const handleSaveHabit = () => {
    if (!currentHabit || !currentHabit.name) return;
    if (currentHabit.id) {
      updateHabit(currentHabit as Habit);
    } else {
      addHabit(currentHabit as Omit<Habit, 'id' | 'createdAt' | 'log' | 'currentStreak' | 'longestStreak'>);
    }
    closeEditor();
  };

  const handleInputChange = (field: keyof Habit, value: any) => {
    if (!currentHabit) return;
    let processedValue = value;
    if (field === 'targetCompletions') {
      processedValue = parseInt(value, 10);
      if (isNaN(processedValue) || processedValue < 1) processedValue = 1;
    }
    setCurrentHabit(prev => ({ ...prev, [field]: processedValue }));
  };

  const renderHabitForm = () => {
    if (!isEditing || !currentHabit) return null;
    return (
      <Card className="mb-6 shadow-md card-animated">
        <CardHeader>
          <CardTitle>{currentHabit.id ? 'Edit Habit' : 'Add New Habit'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Habit Name (e.g., Exercise, Read)"
            value={currentHabit.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="btn-animated"
          />
          <Textarea
            placeholder="Optional: Description"
            value={currentHabit.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="btn-animated"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={currentHabit.frequency}
                onValueChange={(value: HabitFrequency) => handleInputChange('frequency', value)}
              >
                <SelectTrigger id="frequency" className="btn-animated">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {currentHabit.frequency === 'weekly' && (
              <div>
                <Label htmlFor="targetCompletions">Target Completions per Week</Label>
                <Input
                  id="targetCompletions"
                  type="number"
                  min="1"
                  value={currentHabit.targetCompletions || 1}
                  onChange={(e) => handleInputChange('targetCompletions', e.target.value)}
                  className="btn-animated"
                />
              </div>
            )}
          </div>
          <div>
            <Label>Color Tag</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {PREDEFINED_COLORS.map(color => (
                <Button
                  key={color}
                  variant="outline"
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('color', color)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 p-0 btn-animated", 
                    currentHabit.color === color ? "ring-2 ring-offset-2 ring-ring border-ring" : "border-transparent hover:border-muted-foreground"
                  )}
                  aria-label={`Select color ${color}`}
                >
                  {currentHabit.color === color && <Check className="h-4 w-4 text-white mix-blend-difference" />}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={closeEditor} className="btn-animated"><XCircle className="mr-2 h-4 w-4" />Cancel</Button>
          <Button onClick={handleSaveHabit} className="btn-animated"><Save className="mr-2 h-4 w-4" />Save Habit</Button>
        </CardFooter>
      </Card>
    );
  };

  const DailyHabitView = ({ habit }: { habit: Habit }) => {
    const logEntry = getHabitCompletionForDate(habit, viewDate);
    const isCompleted = logEntry?.completed || false;

    return (
      <div className="flex items-center justify-between p-1">
        <Checkbox
          id={`habit-${habit.id}-${format(viewDate, 'yyyy-MM-dd')}`}
          checked={isCompleted}
          onCheckedChange={(checked) => logHabitCompletion(habit.id, viewDate, !!checked)}
          className="mr-2 h-5 w-5 btn-animated"
        />
        <Label htmlFor={`habit-${habit.id}-${format(viewDate, 'yyyy-MM-dd')}`} className="flex-grow">
          {isCompleted ? <span className="line-through text-muted-foreground">{habit.name}</span> : habit.name}
        </Label>
         <div className="flex items-center text-xs text-muted-foreground">
            <Flame className="h-3 w-3 mr-1 text-orange-400" /> {habit.currentStreak}
          </div>
      </div>
    );
  };
  
  const WeeklyHabitView = ({ habit }: { habit: Habit }) => {
    const completionsThisWeek = getHabitCompletionsForWeek(habit, viewDate);
    const target = habit.targetCompletions || (habit.frequency === 'weekly' ? 1 : 7); // Default target 1 for weekly if not set
    const progressPercent = Math.min((completionsThisWeek / target) * 100, 100);
    const isWeekGoalMet = completionsThisWeek >= target;

    return (
      <div className="p-1 space-y-1">
        <div className="flex items-center justify-between">
            <span className={`${isWeekGoalMet ? 'text-green-500 font-semibold' : ''}`}>{habit.name}</span>
             <div className="flex items-center text-xs text-muted-foreground">
                <Flame className="h-3 w-3 mr-1 text-orange-400" /> {habit.currentStreak} (weeks)
             </div>
        </div>
        <Progress value={progressPercent} className="h-2" />
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{completionsThisWeek} / {target} completions this week</span>
           <Button 
              size="xs" 
              variant="outline" 
              onClick={() => logHabitCompletion(habit.id, viewDate, true, 1)} 
              disabled={completionsThisWeek >= target}
              className="h-6 px-1.5 py-0.5 text-xs btn-animated"
            >
            +1 Done
          </Button>
        </div>
      </div>
    );
  };

  const weekDays = useMemo(() => eachDayOfInterval({ start: startOfWeek(viewDate, { weekStartsOn: 1 }), end: endOfWeek(viewDate, { weekStartsOn: 1 }) }), [viewDate]);
  const dailyHabits = useMemo(() => habitsList.filter(h => h.frequency === 'daily'), [habitsList]);
  const weeklyHabits = useMemo(() => habitsList.filter(h => h.frequency === 'weekly'), [habitsList]);


  return (
    <Card className="card-animated">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Habits</CardTitle>
            <CardDescription>Track and build positive habits.</CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => openEditor()} size="sm" className="btn-animated">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Habit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {renderHabitForm()}
        
        <div className="mb-4 flex items-center justify-between p-2 rounded-md bg-muted/50">
          <Button variant="outline" size="sm" onClick={() => setViewDate(prev => subDays(prev, habitViewMode === 'daily' ? 1: 7))} className="btn-animated">
            <CalendarDays className="mr-1 h-4 w-4 transform rotate-180" /> Prev
          </Button>
          <span className="font-semibold text-lg text-center flex-grow">
            {habitViewMode === 'daily' 
             ? (isValid(viewDate) ? format(viewDate, 'EEEE, MMM d, yyyy') : "Invalid Date")
             : `Week ${isValid(viewDate) ? getWeek(viewDate, { weekStartsOn: 1 }) : '-'} of ${isValid(startOfWeek(viewDate, {weekStartsOn: 1})) ? format(startOfWeek(viewDate, {weekStartsOn: 1}), 'MMM d, yyyy') : "Invalid Date"}`}
          </span>
          <Button variant="outline" size="sm" onClick={() => setViewDate(prev => addDays(prev, habitViewMode === 'daily' ? 1: 7))} className="btn-animated">
            Next <CalendarDays className="h-4 w-4 ml-1" />
          </Button>
          <Select value={habitViewMode} onValueChange={(val: 'daily' | 'weekly-overview') => setHabitViewMode(val)}>
              <SelectTrigger className="w-[180px] btn-animated">
                  <SelectValue placeholder="View Mode" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="daily">Daily Checklist</SelectItem>
                  <SelectItem value="weekly-overview">Weekly Overview</SelectItem>
              </SelectContent>
          </Select>
        </div>

        {habitsList.length === 0 && !isEditing && (
          <p className="text-muted-foreground text-center py-4">No habits set up yet. Start building!</p>
        )}

        {habitViewMode === 'daily' && dailyHabits.map(habit => (
          <Card key={habit.id} className="mb-3 card-animated" style={{ borderLeft: `4px solid ${habit.color || 'hsl(var(--primary))'}`}}>
            <CardContent className="p-3">
               <div className="flex items-center justify-between">
                <DailyHabitView habit={habit} />
                <div className="space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => openEditor(habit)} className="h-7 w-7 btn-animated"><Edit3 className="h-4 w-4" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 btn-animated"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Delete Habit?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete "{habit.name}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel className="btn-animated">Cancel</AlertDialogCancel><AlertDialogAction className="btn-animated" onClick={() => deleteHabit(habit.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {habitViewMode === 'weekly-overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habitsList.map(habit => (
              <Card key={habit.id} className="card-animated" style={{ borderTop: `4px solid ${habit.color || 'hsl(var(--primary))'}`}}>
                <CardHeader className="pb-2 pt-3">
                   <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{habit.name} <span className="text-xs text-muted-foreground">({habit.frequency})</span></CardTitle>
                     <div className="space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditor(habit)} className="h-7 w-7 btn-animated"><Edit3 className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 btn-animated"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Delete Habit?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete "{habit.name}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel className="btn-animated">Cancel</AlertDialogCancel><AlertDialogAction className="btn-animated" onClick={() => deleteHabit(habit.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                   </div>
                </CardHeader>
                <CardContent>
                   {habit.frequency === 'daily' ? (
                      <div className="grid grid-cols-7 gap-1">
                        {weekDays.map(day => {
                          const logEntry = getHabitCompletionForDate(habit, day);
                          const isDone = logEntry?.completed;
                          return (
                            <TooltipProvider key={format(day, 'yyyy-MM-dd')} delayDuration={100}>
                               <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Checkbox
                                        checked={isDone}
                                        onCheckedChange={(checked) => logHabitCompletion(habit.id, day, !!checked)}
                                        className="h-7 w-full rounded-sm data-[state=checked]:bg-green-500 btn-animated"
                                        style={isDone ? {backgroundColor: habit.color, borderColor: habit.color} : {borderColor: habit.color}}
                                    />
                                  </TooltipTrigger>
                                  <ShadTooltipContent><p>{format(day, 'EEE, MMM d')} - {isDone ? "Completed" : "Pending"}</p></ShadTooltipContent>
                               </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                   ) : ( // weekly
                      <WeeklyHabitView habit={habit} />
                   )}
                   <div className="mt-2 text-xs text-muted-foreground flex items-center">
                        <Flame className="h-3 w-3 mr-1 text-orange-400" /> Current Streak: {habit.currentStreak} {habit.frequency === 'daily' ? 'days' : 'weeks'}
                        <span className="mx-2">|</span>
                        <TrendingUp className="h-3 w-3 mr-1 text-green-400" /> Longest: {habit.longestStreak}
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
}
