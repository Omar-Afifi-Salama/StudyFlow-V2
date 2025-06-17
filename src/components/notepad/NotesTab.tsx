
"use client";

import { useState, useEffect } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, Trash2, Edit3, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function NotesTab() {
  const { notepadData, addNotepadNote, updateNotepadNote, deleteNotepadNote } = useSessions();
  const [isAddingNewNote, setIsAddingNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNote, setEditingNote] = useState<NotepadNote | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleAddNewNote = () => {
    if (newNoteTitle.trim() === '' || newNoteContent.trim() === '') return;
    addNotepadNote({ title: newNoteTitle, content: newNoteContent });
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNewNote(false);
  };

  const startEditing = (note: NotepadNote) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdateNote = () => {
    if (!editingNote || editTitle.trim() === '' || editContent.trim() === '') return;
    updateNotepadNote({ ...editingNote, title: editTitle, content: editContent });
    cancelEditing();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Notes</CardTitle>
            <CardDescription>Jot down your thoughts, ideas, and summaries.</CardDescription>
          </div>
          {!isAddingNewNote && !editingNote && (
            <Button onClick={() => setIsAddingNewNote(true)} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAddingNewNote || editingNote) && (
          <div className="p-4 border rounded-lg space-y-3 bg-card">
            <h3 className="text-lg font-semibold">{editingNote ? 'Edit Note' : 'Add New Note'}</h3>
            <Input
              type="text"
              placeholder="Note Title"
              value={editingNote ? editTitle : newNoteTitle}
              onChange={(e) => editingNote ? setEditTitle(e.target.value) : setNewNoteTitle(e.target.value)}
              aria-label="Note title"
            />
            <Textarea
              placeholder="Note Content..."
              value={editingNote ? editContent : newNoteContent}
              onChange={(e) => editingNote ? setEditContent(e.target.value) : setNewNoteContent(e.target.value)}
              className="min-h-[150px]"
              aria-label="Note content"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => editingNote ? cancelEditing() : setIsAddingNewNote(false)}>
                <XCircle className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={editingNote ? handleUpdateNote : handleAddNewNote}>
                <Save className="mr-2 h-4 w-4" /> {editingNote ? 'Save Changes' : 'Save Note'}
              </Button>
            </div>
          </div>
        )}

        {notepadData.notes.length === 0 && !isAddingNewNote ? (
          <p className="text-muted-foreground text-center py-4">No notes yet. Add some!</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {notepadData.notes.sort((a,b) => b.lastModified - a.lastModified).map(note => (
              <AccordionItem value={note.id} key={note.id} className="bg-card border rounded-md mb-2 overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-left">{note.title}</span>
                    <span className="text-xs text-muted-foreground pr-2">
                      Last modified: {new Date(note.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0">
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words mb-3">{note.content}</div>
                  <div className="flex justify-end space-x-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => startEditing(note)} aria-label={`Edit note ${note.title}`}>
                      <Edit3 className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" aria-label={`Delete note ${note.title}`}>
                          <Trash2 className="mr-1 h-4 w-4" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the note titled "{note.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteNotepadNote(note.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
