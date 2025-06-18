
"use client";

import { useState, useEffect } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadNote } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save, Trash2, Edit3, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function NotesTab() {
  const { notepadData, addNotepadNote, updateNotepadNote, deleteNotepadNote } = useSessions();
  const [isAddingNewNote, setIsAddingNewNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
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
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsAddingNewNote(false); // Close new note form if open
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditTitle('');
    setEditContent('');
  };

  const handleUpdateNote = () => {
    if (!editingNoteId || editTitle.trim() === '' || editContent.trim() === '') return;
    const originalNote = notepadData.notes.find(n => n.id === editingNoteId);
    if(originalNote) {
        updateNotepadNote({ ...originalNote, title: editTitle, content: editContent });
    }
    cancelEditing();
  };
  
  const renderNoteForm = () => (
    <div className="p-4 border rounded-lg space-y-3 bg-card mb-4">
        <h3 className="text-lg font-semibold">{editingNoteId ? 'Edit Note' : 'Add New Note'}</h3>
        <Input
          type="text"
          placeholder="Note Title"
          value={editingNoteId ? editTitle : newNoteTitle}
          onChange={(e) => editingNoteId ? setEditTitle(e.target.value) : setNewNoteTitle(e.target.value)}
          aria-label="Note title"
          className="transition-colors duration-200"
        />
        <Textarea
          placeholder="Note Content..."
          value={editingNoteId ? editContent : newNoteContent}
          onChange={(e) => editingNoteId ? setEditContent(e.target.value) : setNewNoteContent(e.target.value)}
          className="min-h-[150px] transition-colors duration-200"
          aria-label="Note content"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={() => editingNoteId ? cancelEditing() : setIsAddingNewNote(false)} className="btn-animated">
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={editingNoteId ? handleUpdateNote : handleAddNewNote} className="btn-animated">
            <Save className="mr-2 h-4 w-4" /> {editingNoteId ? 'Save Changes' : 'Save Note'}
          </Button>
        </div>
    </div>
  );


  return (
    <Card className="card-animated">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Notes</CardTitle>
            <CardDescription>Jot down your thoughts, ideas, and summaries.</CardDescription>
          </div>
          {!isAddingNewNote && !editingNoteId && (
            <Button onClick={() => { setIsAddingNewNote(true); setEditingNoteId(null); }} size="sm" className="btn-animated">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isAddingNewNote || editingNoteId) && renderNoteForm()}

        {notepadData.notes.length === 0 && !isAddingNewNote && !editingNoteId ? (
          <p className="text-muted-foreground text-center py-4">No notes yet. Add some!</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {notepadData.notes.sort((a,b) => b.lastModified - a.lastModified).map(note => 
              editingNoteId === note.id ? null : ( // Don't render the accordion item if it's being edited above
              <AccordionItem value={note.id} key={note.id} className="bg-card border rounded-md mb-2 overflow-hidden transition-shadow duration-200 hover:shadow-md">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-left">{note.title}</span>
                    <span className="text-xs text-muted-foreground pr-2">
                      Last modified: {new Date(note.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-0">
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words mb-3 text-foreground/80">{note.content}</div>
                  <div className="flex justify-end space-x-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => startEditing(note)} aria-label={`Edit note ${note.title}`} className="btn-animated">
                      <Edit3 className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" aria-label={`Delete note ${note.title}`} className="btn-animated">
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
