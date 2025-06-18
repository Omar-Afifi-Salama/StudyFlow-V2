
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotebookPen, CheckSquare, StickyNote, Target, Link as LinkIcon, Brain, ListChecks as HabitIcon, CalendarClock } from "lucide-react";
import ChecklistTab from "./ChecklistTab";
import NotesTab from "./NotesTab";
import GoalsTab from "./GoalsTab";
import LinksTab from "./LinksTab";
import RevisionHubTab from "./RevisionHubTab";
import HabitTrackerTab from "./HabitTrackerTab";
import EventsCountdownTab from "./EventsCountdownTab"; // New import

export default function NotepadPage() {
  return (
    <Card className="shadow-lg w-full card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <NotebookPen className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">Digital Notepad</CardTitle>
            <CardDescription>Organize your thoughts, tasks, goals, resources, habits, revisions, and events.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 mb-6">
            <TabsTrigger value="checklist" className="py-2 text-base md:py-3 btn-animated">
              <CheckSquare className="mr-2 h-5 w-5" /> Checklist
            </TabsTrigger>
            <TabsTrigger value="notes" className="py-2 text-base md:py-3 btn-animated">
              <StickyNote className="mr-2 h-5 w-5" /> Notes
            </TabsTrigger>
            <TabsTrigger value="goals" className="py-2 text-base md:py-3 btn-animated">
              <Target className="mr-2 h-5 w-5" /> Goals
            </TabsTrigger>
            <TabsTrigger value="links" className="py-2 text-base md:py-3 btn-animated">
              <LinkIcon className="mr-2 h-5 w-5" /> Links
            </TabsTrigger>
            <TabsTrigger value="revision" className="py-2 text-base md:py-3 btn-animated">
              <Brain className="mr-2 h-5 w-5" /> Revision Hub
            </TabsTrigger>
            <TabsTrigger value="habits" className="py-2 text-base md:py-3 btn-animated">
              <HabitIcon className="mr-2 h-5 w-5" /> Habits
            </TabsTrigger>
            <TabsTrigger value="events" className="py-2 text-base md:py-3 btn-animated">
              <CalendarClock className="mr-2 h-5 w-5" /> Events
            </TabsTrigger>
          </TabsList>
          <TabsContent value="checklist">
            <ChecklistTab />
          </TabsContent>
          <TabsContent value="notes">
            <NotesTab />
          </TabsContent>
          <TabsContent value="goals">
            <GoalsTab />
          </TabsContent>
          <TabsContent value="links">
            <LinksTab />
          </TabsContent>
          <TabsContent value="revision">
            <RevisionHubTab />
          </TabsContent>
          <TabsContent value="habits">
            <HabitTrackerTab />
          </TabsContent>
          <TabsContent value="events">
            <EventsCountdownTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
