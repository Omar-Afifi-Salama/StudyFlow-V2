
"use client";

import { useState } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { RevisionConcept } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Trash2, CalendarIcon, CheckCircle, Edit3, Save, XCircle } from 'lucide-react';
import { format, parseISO, isValid, differenceInDays, differenceInSeconds } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DEFAULT_NOTEPAD_DATA } from '@/contexts/SessionContext';

export default function RevisionHubTab() {
  const { userProfile, addRevisionConcept, markConceptRevised, deleteRevisionConcept } = useSessions();
  const currentNotepadData = userProfile.notepadData || DEFAULT_NOTEPAD_DATA;
  const concepts = currentNotepadData.revisionConcepts || [];
  
  const [newConceptName, setNewConceptName] = useState('');
  const [newLearnedDate, setNewLearnedDate] = useState<Date | undefined>(new Date());
  
  const [editingConcept, setEditingConcept] = useState<RevisionConcept | null>(null);
  const [editConceptName, setEditConceptName] = useState('');
  const [editLearnedDate, setEditLearnedDate] = useState<Date | undefined>(undefined);


  const handleAddConcept = () => {
    if (newConceptName.trim() === '' || !newLearnedDate || !isValid(newLearnedDate)) return;
    addRevisionConcept(newConceptName.trim(), newLearnedDate);
    setNewConceptName('');
    setNewLearnedDate(new Date());
  };

  const handleMarkRevised = (conceptId: string) => {
    markConceptRevised(conceptId);
  };

  const handleDelete = (conceptId: string) => {
    deleteRevisionConcept(conceptId);
  };

  const startEditing = (concept: RevisionConcept) => {
    setEditingConcept(concept);
    setEditConceptName(concept.name);
    const parsedLearnedDate = parseISO(concept.learnedDate);
    setEditLearnedDate(isValid(parsedLearnedDate) ? parsedLearnedDate : undefined);
  };

  const cancelEditing = () => {
    setEditingConcept(null);
    setEditConceptName('');
    setEditLearnedDate(undefined);
  };

  const handleSaveEdit = () => {
     if (!editingConcept || editConceptName.trim() === '' || !editLearnedDate || !isValid(editLearnedDate)) return;
    deleteRevisionConcept(editingConcept.id);
    addRevisionConcept(editConceptName.trim(), editLearnedDate);
    cancelEditing();
  };
  
  const formatDateSafe = (dateString: string | undefined, formatString: string = 'PPP') => {
    if (!dateString) return "N/A";
    const dateObj = parseISO(dateString);
    return isValid(dateObj) ? format(dateObj, formatString) : "Invalid Date";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revision Hub</CardTitle>
        <CardDescription>Add concepts you've learned and get smart revision reminders based on the forgetting curve.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!editingConcept && (
          <div className="flex flex-col sm:flex-row gap-2 p-3 border rounded-md">
            <Input
              type="text"
              value={newConceptName}
              onChange={(e) => setNewConceptName(e.target.value)}
              placeholder="Concept name..."
              className="flex-grow"
              aria-label="New concept name"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {(newLearnedDate && isValid(newLearnedDate)) ? format(newLearnedDate, 'PPP') : <span>Learned Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={newLearnedDate} onSelect={setNewLearnedDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddConcept} aria-label="Add concept for revision">
              <PlusCircle className="h-5 w-5" /> Add
            </Button>
          </div>
        )}

        {editingConcept && (
          <div className="flex flex-col sm:flex-row gap-2 p-3 border rounded-md bg-muted/30">
            <Input
              type="text"
              value={editConceptName}
              onChange={(e) => setEditConceptName(e.target.value)}
              className="flex-grow"
              aria-label="Edit concept name"
            />
             <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {(editLearnedDate && isValid(editLearnedDate)) ? format(editLearnedDate, 'PPP') : <span>Learned Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={editLearnedDate} onSelect={setEditLearnedDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Button onClick={handleSaveEdit} size="icon" aria-label="Save edited concept">
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={cancelEditing} aria-label="Cancel editing concept">
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}


        {(concepts.length === 0) && !editingConcept ? (
          <p className="text-muted-foreground text-center py-4">No concepts added for revision yet.</p>
        ) : (
          <ul className="space-y-3">
            {concepts.sort((a, b) => {
                const dateA = parseISO(a.nextRevisionDate);
                const dateB = parseISO(b.nextRevisionDate);
                if (!isValid(dateA) && !isValid(dateB)) return 0;
                if (!isValid(dateA)) return 1; 
                if (!isValid(dateB)) return -1;
                return dateA.getTime() - dateB.getTime();
            }).map(concept => {
                const lastRevised = parseISO(concept.lastRevisedDate);
                const nextRevision = parseISO(concept.nextRevisionDate);
                const now = new Date();

                let progress = 0;
                let progressText = "";
                let isDue = false;

                if (isValid(nextRevision) && isValid(lastRevised)) {
                    isDue = now >= nextRevision;
                    if (isDue) {
                        progress = 100;
                        const daysOverdue = differenceInDays(now, nextRevision);
                        progressText = daysOverdue === 0 ? "Due today" : `${daysOverdue} day(s) overdue`;
                    } else {
                        const totalDuration = differenceInSeconds(nextRevision, lastRevised);
                        const elapsed = differenceInSeconds(now, lastRevised);
                        progress = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
                        const daysRemaining = differenceInDays(nextRevision, now);
                        progressText = `Due in ${daysRemaining + 1} day(s)`;
                    }
                } else {
                    progressText = "Invalid date data.";
                }


              return (
                <li key={concept.id} className={`p-4 rounded-md border ${isDue ? 'border-primary bg-primary/10' : 'bg-card'} ${editingConcept?.id === concept.id ? 'ring-2 ring-primary' : ''}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="flex-grow mb-3 sm:mb-0">
                            <h4 className="font-semibold text-lg">{concept.name}</h4>
                            <p className="text-sm text-muted-foreground">
                                Learned: {formatDateSafe(concept.learnedDate)} | Last Revised: {formatDateSafe(concept.lastRevisedDate)}
                            </p>
                        </div>
                        <div className="flex space-x-1 self-start sm:self-center">
                            <Button variant="ghost" size="icon" onClick={() => startEditing(concept)} disabled={!!editingConcept && editingConcept.id !== concept.id} aria-label={`Edit concept ${concept.name}`}>
                                <Edit3 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={!!editingConcept} aria-label={`Delete concept ${concept.name}`}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the concept "{concept.name}".
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(concept.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button onClick={() => handleMarkRevised(concept.id)} size="sm" variant={isDue ? "default" : "outline"} aria-label={`Mark ${concept.name} as revised`}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Revised
                            </Button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-muted-foreground">Revision Progress</span>
                             <span className={`text-xs font-semibold ${isDue ? 'text-primary animate-pulse' : 'text-foreground'}`}>
                                {progressText} (Stage {concept.revisionStage + 1})
                            </span>
                        </div>
                        <Progress value={progress} aria-label={`Revision progress for ${concept.name}`} />
                    </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
