
"use client";

import { useState } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadLink } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle, ExternalLink, Edit3, Save, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link'; 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function LinksTab() {
  const { notepadData, updateNotepadData } = useSessions();
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkDescription, setNewLinkDescription] = useState('');

  const [editingLink, setEditingLink] = useState<NotepadLink | null>(null);
  const [editLinkUrl, setEditLinkUrl] = useState('');
  const [editLinkDescription, setEditLinkDescription] = useState('');


  const handleAddLink = () => {
    if (newLinkUrl.trim() === '') return;
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

  const startEditing = (link: NotepadLink) => {
    setEditingLink(link);
    setEditLinkUrl(link.url);
    setEditLinkDescription(link.description);
  };

  const cancelEditing = () => {
    setEditingLink(null);
    setEditLinkUrl('');
    setEditLinkDescription('');
  };

  const handleSaveEdit = () => {
    if (!editingLink || editLinkUrl.trim() === '') return;
     let urlToSave = editLinkUrl.trim();
    if (!urlToSave.startsWith('http://') && !urlToSave.startsWith('https://')) {
        urlToSave = 'https://' + urlToSave;
    }
    updateNotepadData({
      links: notepadData.links.map(link =>
        link.id === editingLink.id ? { 
            ...link, 
            url: urlToSave, 
            description: editLinkDescription.trim() || urlToSave 
        } : link
      ),
    });
    cancelEditing();
  };
  
  const renderLinkForm = (isEditMode: boolean) => {
    const urlValue = isEditMode ? editLinkUrl : newLinkUrl;
    const descValue = isEditMode ? editLinkDescription : newLinkDescription;
    const setUrl = isEditMode ? setEditLinkUrl : setNewLinkUrl;
    const setDesc = isEditMode ? setEditLinkDescription : setNewLinkDescription;
    const submitAction = isEditMode ? handleSaveEdit : handleAddLink;
    const cancelAction = isEditMode ? cancelEditing : () => { setNewLinkUrl(''); setNewLinkDescription(''); /* Potentially hide form */};

    return (
        <div className={`space-y-2 p-3 border rounded-md mb-4 ${isEditMode ? 'bg-muted/40' : ''}`}>
            <h3 className="text-lg font-medium">{isEditMode ? 'Edit Link' : 'Add New Link'}</h3>
            <Input
                type="url"
                value={urlValue}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                aria-label={isEditMode ? "Edit link URL" : "New link URL"}
            />
            <Input
                type="text"
                value={descValue}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Optional description"
                aria-label={isEditMode ? "Edit link description" : "New link description"}
            />
             <div className="flex justify-end space-x-2">
                {isEditMode && <Button variant="ghost" onClick={cancelAction}><XCircle className="mr-2 h-4 w-4"/>Cancel</Button>}
                <Button onClick={submitAction} className="w-full sm:w-auto">
                    {isEditMode ? <Save className="mr-2 h-4 w-4"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                    {isEditMode ? 'Save Changes' : 'Add Link'}
                </Button>
            </div>
        </div>
    );
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>My Links</CardTitle>
        <CardDescription>Save and organize useful web links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!editingLink && renderLinkForm(false)}
        {editingLink && renderLinkForm(true)}

        {notepadData.links.length === 0 && !editingLink ? (
          <p className="text-muted-foreground text-center py-4">No links saved yet. Add some resources!</p>
        ) : (
          <ul className="space-y-2">
            {notepadData.links.sort((a,b) => a.createdAt - b.createdAt).map(link => (
              <li
                key={link.id}
                className={`flex items-center justify-between p-3 rounded-md border bg-card ${editingLink?.id === link.id ? 'ring-2 ring-primary': ''}`}
              >
                <div className="flex-grow overflow-hidden">
                  <Link href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline break-all">
                    {link.description || link.url} <ExternalLink className="inline h-3 w-3 ml-1"/>
                  </Link>
                  {link.description && link.description !== link.url && (
                     <p className="text-xs text-muted-foreground break-all">{link.url}</p>
                  )}
                </div>
                <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => startEditing(link)} disabled={!!editingLink && editingLink.id !== link.id} aria-label={`Edit link ${link.description || link.url}`}>
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={!!editingLink} aria-label={`Delete link ${link.description || link.url}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the link for "{link.description || link.url}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteLink(link.id)}>Delete</AlertDialogAction>
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
