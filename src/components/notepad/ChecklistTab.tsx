
"use client";

import { useState } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadTask } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PlusCircle, Edit3, Save, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DEFAULT_NOTEPAD_DATA } from '@/contexts/SessionContext'; // Import for safety, though ideally not needed if userProfile.notepadData is guaranteed

export default function ChecklistTab() {
  const { userProfile, updateNotepadData, updateChallengeProgress } = useSessions();
  const currentNotepadData = userProfile.notepadData || DEFAULT_NOTEPAD_DATA;
  const tasks = currentNotepadData.tasks || [];

  const [newTaskText, setNewTaskText] = useState('');
  const [editingTask, setEditingTask] = useState<NotepadTask | null>(null);
  const [editText, setEditText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: NotepadTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    const newTasks = [...tasks, newTask];
    updateNotepadData({ tasks: newTasks });
    updateChallengeProgress('tasksCompleted', newTasks.filter(t => t.completed).length, true);
    setNewTaskText('');
  };

  const handleToggleTask = (taskId: string) => {
    const newTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    updateNotepadData({ tasks: newTasks });
    updateChallengeProgress('tasksCompleted', newTasks.filter(t => t.completed).length, true);
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    updateNotepadData({ tasks: newTasks });
    updateChallengeProgress('tasksCompleted', newTasks.filter(t => t.completed).length, true);
  };

  const startEditing = (task: NotepadTask) => {
    setEditingTask(task);
    setEditText(task.text);
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditText('');
  };

  const handleSaveEdit = () => {
    if (!editingTask || editText.trim() === '') return;
    const newTasks = tasks.map(task =>
      task.id === editingTask.id ? { ...task, text: editText.trim() } : task
    );
    updateNotepadData({ tasks: newTasks });
    cancelEditing();
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Checklist</CardTitle>
        <CardDescription>Keep track of your to-dos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!editingTask && (
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-grow"
              aria-label="New task text"
            />
            <Button onClick={handleAddTask} aria-label="Add task">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>
        )}

        {editingTask && (
          <div className="flex space-x-2 p-3 border rounded-md bg-muted/30">
            <Input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-grow"
              aria-label="Edit task text"
            />
            <Button onClick={handleSaveEdit} size="icon" aria-label="Save edited task">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={cancelEditing} aria-label="Cancel editing task">
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}

        {(tasks.length === 0) && !editingTask ? (
          <p className="text-muted-foreground text-center py-4">No tasks yet. Add some!</p>
        ) : (
          <ul className="space-y-2">
            {tasks.sort((a,b) => Number(a.completed) - Number(b.completed) || a.createdAt - b.createdAt).map(task => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-md border ${task.completed ? 'bg-muted/50' : 'bg-card'} ${editingTask?.id === task.id ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-center space-x-3 flex-grow">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    aria-label={task.completed ? `Mark ${task.text} as incomplete` : `Mark ${task.text} as complete`}
                    disabled={!!editingTask}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.text}
                  </label>
                </div>
                <div className="flex space-x-1">
                   <Button variant="ghost" size="icon" onClick={() => startEditing(task)} disabled={!!editingTask && editingTask.id !== task.id} aria-label={`Edit task ${task.text}`}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={!!editingTask} aria-label={`Delete task ${task.text}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the task "{task.text}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
