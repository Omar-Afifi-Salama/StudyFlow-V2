
"use client";

import { useState, useEffect } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function NotesTab() {
  const { notepadData, updateNotepadData } = useSessions();
  // Assuming single note support for simplicity, taking the first note or a default structure.
  const mainNote = notepadData.notes[0] || { id: 'main_note', content: '', lastModified: Date.now() };
  const [noteContent, setNoteContent] = useState(mainNote.content);
  const { toast } = useToast();

  useEffect(() => {
    setNoteContent(mainNote.content);
  }, [mainNote.content]);

  const handleSaveNote = () => {
    updateNotepadData({
      notes: [{ ...mainNote, content: noteContent, lastModified: Date.now() }],
    });
    toast({ title: "Note Saved", description: "Your notes have been updated." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Notes</CardTitle>
        <CardDescription>Jot down your thoughts and ideas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Start typing your notes here..."
          className="min-h-[300px] text-base"
          aria-label="Note content"
        />
        <div className="flex justify-end">
          <Button onClick={handleSaveNote} aria-label="Save notes">
            <Save className="mr-2 h-4 w-4" /> Save Notes
          </Button>
        </div>
         <p className="text-xs text-muted-foreground text-right">
            Last saved: {new Date(mainNote.lastModified).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
