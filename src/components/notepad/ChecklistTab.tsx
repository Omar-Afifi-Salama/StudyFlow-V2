
"use client";

import { useState } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadTask } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChecklistTab() {
  const { notepadData, updateNotepadData } = useSessions();
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim() === '') return;
    const newTask: NotepadTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    updateNotepadData({ tasks: [...notepadData.tasks, newTask] });
    setNewTaskText('');
  };

  const handleToggleTask = (taskId: string) => {
    updateNotepadData({
      tasks: notepadData.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    });
  };

  const handleDeleteTask = (taskId: string) => {
    updateNotepadData({ tasks: notepadData.tasks.filter(task => task.id !== taskId) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Checklist</CardTitle>
        <CardDescription>Keep track of your to-dos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-grow"
          />
          <Button onClick={handleAddTask} aria-label="Add task">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        {notepadData.tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No tasks yet. Add some!</p>
        ) : (
          <ul className="space-y-2">
            {notepadData.tasks.sort((a,b) => Number(a.completed) - Number(b.completed) || a.createdAt - b.createdAt).map(task => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-md border ${task.completed ? 'bg-muted/50' : 'bg-card'}`}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                    aria-label={task.completed ? `Mark ${task.text} as incomplete` : `Mark ${task.text} as complete`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.text}
                  </label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} aria-label={`Delete task ${task.text}`}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
