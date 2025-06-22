
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotebookPen, CheckSquare, StickyNote, Target, Link as LinkIcon, Brain, ListChecks as HabitIcon, CalendarClock, Grid } from "lucide-react";
import ChecklistTab from "./ChecklistTab";
import NotesTab from "./NotesTab";
import GoalsTab from "./GoalsTab";
import LinksTab from "./LinksTab";
import RevisionHubTab from "./RevisionHubTab";
import HabitTrackerTab from "./HabitTrackerTab";
import EventsCountdownTab from "./EventsCountdownTab";
import EisenhowerMatrixTab from "./EisenhowerMatrixTab";
import { useSessions } from "@/contexts/SessionContext";
import { Button } from "../ui/button";
import Link from "next/link";
import type { FeatureKey } from "@/types";

interface NotepadTabInfo {
  value: string;
  label: string;
  icon: React.ElementType;
  featureKey: FeatureKey;
}

const notepadTabs: NotepadTabInfo[] = [
  { value: 'checklist', label: 'Checklist', icon: CheckSquare, featureKey: 'notepadChecklist' },
  { value: 'notes', label: 'Notes', icon: StickyNote, featureKey: 'notepadNotes' },
  { value: 'goals', label: 'Goals', icon: Target, featureKey: 'notepadGoals' },
  { value: 'links', label: 'Links', icon: LinkIcon, featureKey: 'notepadLinks' },
  { value: 'revision', label: 'Revision Hub', icon: Brain, featureKey: 'notepadRevision' },
  { value: 'habits', label: 'Habits', icon: HabitIcon, featureKey: 'notepadHabits' },
  { value: 'events', label: 'Events', icon: CalendarClock, featureKey: 'notepadEvents' },
  { value: 'eisenhower', label: 'Matrix', icon: Grid, featureKey: 'notepadEisenhower' },
];


export default function NotepadPage() {
  const { isFeatureUnlocked } = useSessions();

  if (!isFeatureUnlocked('notepad')) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Notepad Locked</h1>
        <p className="text-muted-foreground mb-6">
          Unlock this feature through the Skill Tree to organize your thoughts and tasks.
        </p>
        <Button asChild>
          <Link href="/skill-tree">Go to Skill Tree</Link>
        </Button>
      </div>
    );
  }

  const unlockedNotepadTabs = notepadTabs.filter(tab => isFeatureUnlocked(tab.featureKey));
  const defaultTabValue = unlockedNotepadTabs.length > 0 ? unlockedNotepadTabs[0].value : "";


  return (
    <Card className="shadow-lg w-full card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <NotebookPen className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">Productivity Hub</CardTitle>
            <CardDescription>Organize your thoughts, tasks, goals, resources, habits, revisions, events, and priorities. Unlock more tabs via the Skill Tree!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {unlockedNotepadTabs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
                <p className="text-lg mb-2">No Notepad features unlocked yet.</p>
                <p>Visit the Skill Tree to unlock specific Notepad tabs like Checklist, Notes, and more.</p>
                 <Button asChild className="mt-4">
                    <Link href="/skill-tree">Go to Skill Tree</Link>
                </Button>
            </div>
        ) : (
        <Tabs defaultValue={defaultTabValue} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 mb-6">
            {unlockedNotepadTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="py-2 text-base md:py-3 btn-animated">
                <tab.icon className="mr-2 h-5 w-5" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {isFeatureUnlocked('notepadChecklist') && <TabsContent value="checklist"><ChecklistTab /></TabsContent>}
          {isFeatureUnlocked('notepadNotes') && <TabsContent value="notes"><NotesTab /></TabsContent>}
          {isFeatureUnlocked('notepadGoals') && <TabsContent value="goals"><GoalsTab /></TabsContent>}
          {isFeatureUnlocked('notepadLinks') && <TabsContent value="links"><LinksTab /></TabsContent>}
          {isFeatureUnlocked('notepadRevision') && <TabsContent value="revision"><RevisionHubTab /></TabsContent>}
          {isFeatureUnlocked('notepadHabits') && <TabsContent value="habits"><HabitTrackerTab /></TabsContent>}
          {isFeatureUnlocked('notepadEvents') && <TabsContent value="events"><EventsCountdownTab /></TabsContent>}
          {isFeatureUnlocked('notepadEisenhower') && <TabsContent value="eisenhower"><EisenhowerMatrixTab /></TabsContent>}
        </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
