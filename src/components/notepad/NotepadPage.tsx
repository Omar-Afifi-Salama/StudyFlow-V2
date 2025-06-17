"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotebookPen, CheckSquare, StickyNote, Target, Link as LinkIcon } from "lucide-react";
import ChecklistTab from "./ChecklistTab";
import NotesTab from "./NotesTab";
import GoalsTab from "./GoalsTab";
import LinksTab from "./LinksTab";

export default function NotepadPage() {
  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <NotebookPen className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">Digital Notepad</CardTitle>
            <CardDescription>Organize your thoughts, tasks, goals, and resources.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="checklist" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="checklist" className="py-2 text-base md:py-3"> {/* Adjusted padding */}
              <CheckSquare className="mr-2 h-5 w-5" /> Checklist
            </TabsTrigger>
            <TabsTrigger value="notes" className="py-2 text-base md:py-3"> {/* Adjusted padding */}
              <StickyNote className="mr-2 h-5 w-5" /> Notes
            </TabsTrigger>
            <TabsTrigger value="goals" className="py-2 text-base md:py-3"> {/* Adjusted padding */}
              <Target className="mr-2 h-5 w-5" /> Goals
            </TabsTrigger>
            <TabsTrigger value="links" className="py-2 text-base md:py-3"> {/* Adjusted padding */}
              <LinkIcon className="mr-2 h-5 w-5" /> Links
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
