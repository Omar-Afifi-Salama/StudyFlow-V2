
"use client";

import { useState } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadGoal } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PlusCircle, CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns'; // Make sure date-fns is installed

export default function GoalsTab() {
  const { notepadData, updateNotepadData } = useSessions();
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalDueDate, setNewGoalDueDate] = useState<Date | undefined>(undefined);

  const handleAddGoal = () => {
    if (newGoalText.trim() === '') return;
    const newGoal: NotepadGoal = {
      id: crypto.randomUUID(),
      text: newGoalText.trim(),
      dueDate: newGoalDueDate ? format(newGoalDueDate, 'yyyy-MM-dd') : undefined,
      completed: false,
      createdAt: Date.now(),
    };
    updateNotepadData({ goals: [...notepadData.goals, newGoal] });
    setNewGoalText('');
    setNewGoalDueDate(undefined);
  };

  const handleToggleGoal = (goalId: string) => {
    updateNotepadData({
      goals: notepadData.goals.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      ),
    });
  };

  const handleDeleteGoal = (goalId: string) => {
    updateNotepadData({ goals: notepadData.goals.filter(goal => goal.id !== goalId) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Goals</CardTitle>
        <CardDescription>Set and track your personal or study goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Add a new goal..."
            className="flex-grow"
            aria-label="New goal text"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full sm:w-[200px] justify-start text-left font-normal ${!newGoalDueDate && "text-muted-foreground"}`}
                aria-label="Pick due date for new goal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newGoalDueDate ? format(newGoalDueDate, "PPP") : <span>Pick due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={newGoalDueDate}
                onSelect={setNewGoalDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={handleAddGoal} aria-label="Add goal" className="w-full sm:w-auto">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        {notepadData.goals.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No goals set yet. Aim high!</p>
        ) : (
          <ul className="space-y-2">
            {notepadData.goals.sort((a,b) => Number(a.completed) - Number(b.completed) || (a.dueDate || 'zzzz').localeCompare(b.dueDate || 'zzzz') || a.createdAt - b.createdAt).map(goal => (
              <li
                key={goal.id}
                className={`p-3 rounded-md border ${goal.completed ? 'bg-muted/50' : 'bg-card'}`}
              >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    <Checkbox
                        id={`goal-${goal.id}`}
                        checked={goal.completed}
                        onCheckedChange={() => handleToggleGoal(goal.id)}
                        aria-label={goal.completed ? `Mark goal ${goal.text} as incomplete` : `Mark goal ${goal.text} as complete`}
                    />
                    <div>
                        <label
                        htmlFor={`goal-${goal.id}`}
                        className={`text-sm font-medium ${goal.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                        {goal.text}
                        </label>
                        {goal.dueDate && (
                        <p className={`text-xs ${goal.completed ? 'text-muted-foreground' : 'text-primary'}`}>
                            Due: {format(new Date(goal.dueDate + 'T00:00:00'), "PPP")}
                        </p>
                        )}
                    </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)} aria-label={`Delete goal ${goal.text}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
