
"use client";

import { useState } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadGoal } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PlusCircle, CalendarIcon, Edit3, Save, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function GoalsTab() {
  const { notepadData, updateNotepadData } = useSessions();
  const [newGoalText, setNewGoalText] = useState('');
  const [newGoalDueDate, setNewGoalDueDate] = useState<Date | undefined>(undefined);
  
  const [editingGoal, setEditingGoal] = useState<NotepadGoal | null>(null);
  const [editGoalText, setEditGoalText] = useState('');
  const [editGoalDueDate, setEditGoalDueDate] = useState<Date | undefined>(undefined);


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

  const startEditing = (goal: NotepadGoal) => {
    setEditingGoal(goal);
    setEditGoalText(goal.text);
    setEditGoalDueDate(goal.dueDate ? parseISO(goal.dueDate) : undefined);
  };

  const cancelEditing = () => {
    setEditingGoal(null);
    setEditGoalText('');
    setEditGoalDueDate(undefined);
  };

  const handleSaveEdit = () => {
    if (!editingGoal || editGoalText.trim() === '') return;
    updateNotepadData({
      goals: notepadData.goals.map(goal =>
        goal.id === editingGoal.id ? { 
          ...goal, 
          text: editGoalText.trim(), 
          dueDate: editGoalDueDate ? format(editGoalDueDate, 'yyyy-MM-dd') : undefined 
        } : goal
      ),
    });
    cancelEditing();
  };

  const renderGoalForm = (isEditMode: boolean) => {
    const textValue = isEditMode ? editGoalText : newGoalText;
    const dateValue = isEditMode ? editGoalDueDate : newGoalDueDate;
    const setText = isEditMode ? setEditGoalText : setNewGoalText;
    const setDate = isEditMode ? setEditGoalDueDate : setNewGoalDueDate;
    const submitAction = isEditMode ? handleSaveEdit : handleAddGoal;
    const cancelAction = isEditMode ? cancelEditing : () => { setNewGoalText(''); setNewGoalDueDate(undefined); /* Potentially hide form */ };

    return (
      <div className={`p-3 border rounded-md space-y-2 mb-4 ${isEditMode ? 'bg-muted/40' : ''}`}>
        <h3 className="text-lg font-medium">{isEditMode ? 'Edit Goal' : 'Add New Goal'}</h3>
        <Input
            type="text"
            value={textValue}
            onChange={(e) => setText(e.target.value)}
            placeholder="Goal description..."
            className="flex-grow"
            aria-label={isEditMode ? "Edit goal text" : "New goal text"}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!dateValue && "text-muted-foreground"}`}
                aria-label={isEditMode ? "Pick new due date for goal" : "Pick due date for new goal"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "PPP") : <span>Pick due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex justify-end space-x-2">
            {isEditMode && <Button variant="ghost" onClick={cancelAction}><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>}
            <Button onClick={submitAction}>
                {isEditMode ? <Save className="mr-2 h-4 w-4"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                {isEditMode ? 'Save Changes' : 'Add Goal'}
            </Button>
          </div>
      </div>
    );
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Goals</CardTitle>
        <CardDescription>Set and track your personal or study goals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!editingGoal && renderGoalForm(false)}
        {editingGoal && renderGoalForm(true)}

        {notepadData.goals.length === 0 && !editingGoal ? (
          <p className="text-muted-foreground text-center py-4">No goals set yet. Aim high!</p>
        ) : (
          <ul className="space-y-2">
            {notepadData.goals.sort((a,b) => Number(a.completed) - Number(b.completed) || (a.dueDate || 'zzzz').localeCompare(b.dueDate || 'zzzz') || a.createdAt - b.createdAt).map(goal => (
              <li
                key={goal.id}
                className={`p-3 rounded-md border ${goal.completed ? 'bg-muted/50' : 'bg-card'} ${editingGoal?.id === goal.id ? 'ring-2 ring-primary': ''}`}
              >
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                    <Checkbox
                        id={`goal-${goal.id}`}
                        checked={goal.completed}
                        onCheckedChange={() => handleToggleGoal(goal.id)}
                        aria-label={goal.completed ? `Mark goal ${goal.text} as incomplete` : `Mark goal ${goal.text} as complete`}
                        disabled={!!editingGoal}
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
                            Due: {format(parseISO(goal.dueDate), "PPP")} {/* Use parseISO for YYYY-MM-DD */}
                        </p>
                        )}
                    </div>
                    </div>
                    <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(goal)} disabled={!!editingGoal && editingGoal.id !== goal.id} aria-label={`Edit goal ${goal.text}`}>
                            <Edit3 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!!editingGoal} aria-label={`Delete goal ${goal.text}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the goal "{goal.text}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteGoal(goal.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
