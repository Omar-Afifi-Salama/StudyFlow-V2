
"use client";

import { useState } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadLink } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link'; // For external links

export default function LinksTab() {
  const { notepadData, updateNotepadData } = useSessions();
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');

  const handleAddLink = () => {
    if (newLinkUrl.trim() === '') return;
    // Basic URL validation (consider a more robust solution for production)
    let urlToSave = newLinkUrl.trim();
    if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
        urlToSave = 'https://' + urlToSave;
    }

    const newLink: NotepadLink = {
      id: crypto.randomUUID(),
      url: urlToSave,
      description: newLinkDescription.trim() || urlToSave,
      createdAt: Date.now(),
    };
    updateNotepadData({ links: [...notepadData.links, newLink] });
    setNewLinkUrl('');
    setNewLinkDescription('');
  };

  const handleDeleteLink = (linkId: string) => {
    updateNotepadData({ links: notepadData.links.filter(link => link.id !== linkId) });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Links</CardTitle>
        <CardDescription>Save and organize useful web links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="https://example.com"
            aria-label="New link URL"
          />
          <Input
            type="text"
            value={newLinkDescription}
            onChange={(e) => setNewLinkDescription(e.target.value)}
            placeholder="Optional description"
            aria-label="New link description"
          />
          <Button onClick={handleAddLink} className="w-full sm:w-auto" aria-label="Add link">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Link
          </Button>
        </div>
        {notepadData.links.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No links saved yet. Add some resources!</p>
        ) : (
          <ul className="space-y-2">
            {notepadData.links.sort((a,b) => a.createdAt - b.createdAt).map(link => (
              <li
                key={link.id}
                className="flex items-center justify-between p-3 rounded-md border bg-card"
              >
                <div className="flex-grow overflow-hidden">
                  <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline break-all">
                    {link.description || link.url} <ExternalLink className="inline h-3 w-3 ml-1"/>
                  </Link>
                  {link.description && link.description !== link.url && (
                     <p className="text-xs text-muted-foreground break-all">{link.url}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)} aria-label={`Delete link ${link.description || link.url}`}>
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
