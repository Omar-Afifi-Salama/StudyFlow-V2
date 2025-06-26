
"use client";

import { useMemo } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import type { NotepadTask, NotepadGoal } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid, MoreHorizontal, X, AlertTriangle, Calendar, Users, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


type QuadrantKey = 'do' | 'schedule' | 'delegate' | 'eliminate';

const quadrantDetails: Record<QuadrantKey, { title: string; description: string; action: string; bgColorClass: string; textColorClass: string }> = {
  'do': { title: 'Urgent & Important', description: "Crises, deadlines, pressing problems.", action: 'Do First', bgColorClass: "bg-destructive/10 border-destructive", textColorClass: "text-destructive" },
  'schedule': { title: 'Not Urgent & Important', description: "Long-term goals, relationship building, new opportunities.", action: 'Schedule', bgColorClass: "bg-primary/10 border-primary", textColorClass: "text-primary" },
  'delegate': { title: 'Urgent & Not Important', description: "Interruptions, some meetings, popular activities.", action: 'Delegate', bgColorClass: "bg-yellow-500/10 border-yellow-500", textColorClass: "text-yellow-600 dark:text-yellow-400" },
  'eliminate': { title: 'Not Urgent & Not Important', description: "Trivia, time wasters, some calls/emails.", action: 'Eliminate', bgColorClass: "bg-muted/50 border-muted-foreground/30", textColorClass: "text-muted-foreground" },
};

const ItemContextMenu = ({ item, type, onUpdateQuadrant }: { item: NotepadTask | NotepadGoal, type: 'task' | 'goal', onUpdateQuadrant: (itemId: string, itemType: 'task' | 'goal', quadrant?: QuadrantKey) => void }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0"><MoreHorizontal className="h-4 w-4" /></Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1 z-10">
        <div className="flex flex-col">
          {(Object.keys(quadrantDetails) as QuadrantKey[]).map(qKey => (
            <Button key={qKey} variant="ghost" className="justify-start text-sm h-8" onClick={() => onUpdateQuadrant(item.id, type, qKey)}>
              Move to {quadrantDetails[qKey].title}
            </Button>
          ))}
          {item.quadrant && (
            <Button variant="ghost" className="justify-start text-destructive text-sm h-8" onClick={() => onUpdateQuadrant(item.id, type, undefined)}>
              <X className="mr-2 h-4 w-4" /> Uncategorize
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ItemCard = ({ item, type, onUpdateQuadrant }: { item: NotepadTask | NotepadGoal, type: 'task' | 'goal', onUpdateQuadrant: (itemId: string, itemType: 'task' | 'goal', quadrant?: QuadrantKey) => void }) => {
    const isCategorized = !!item.quadrant;
    return (
        <div className="p-2 border rounded-md flex justify-between items-center bg-background/50 hover:bg-background/80 transition-colors">
            <p className={cn("text-sm flex-grow", item.completed && "line-through text-muted-foreground")}>{item.text}</p>
             <div className="flex items-center shrink-0 ml-2">
                {isCategorized ? (
                    <ItemContextMenu item={item} type={type} onUpdateQuadrant={onUpdateQuadrant} />
                ) : (
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuadrant(item.id, type, 'do')}><AlertTriangle className="h-4 w-4 text-destructive" /></Button></TooltipTrigger>
                            <TooltipContent side="top" sideOffset={5} className="z-10"><p>Do (Urgent, Important)</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuadrant(item.id, type, 'schedule')}><Calendar className="h-4 w-4 text-primary" /></Button></TooltipTrigger>
                            <TooltipContent side="top" sideOffset={5} className="z-10"><p>Schedule (Not Urgent, Important)</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuadrant(item.id, type, 'delegate')}><Users className="h-4 w-4 text-yellow-500" /></Button></TooltipTrigger>
                            <TooltipContent side="top" sideOffset={5} className="z-10"><p>Delegate (Urgent, Not Important)</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdateQuadrant(item.id, type, 'eliminate')}><Trash2 className="h-4 w-4 text-muted-foreground" /></Button></TooltipTrigger>
                            <TooltipContent side="top" sideOffset={5} className="z-10"><p>Eliminate (Not Urgent, Not Important)</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    );
};

const Quadrant = ({ quadrantKey, items, onUpdateQuadrant }: { quadrantKey: QuadrantKey, items: (NotepadTask | NotepadGoal)[], onUpdateQuadrant: (itemId: string, itemType: 'task' | 'goal', quadrant?: QuadrantKey) => void }) => {
  const details = quadrantDetails[quadrantKey];
  return (
    <div className={cn("p-4 rounded-lg shadow-sm flex flex-col h-full border", details.bgColorClass)}>
      <h3 className={cn("text-lg font-semibold mb-1", details.textColorClass)}>{details.title}</h3>
      <p className={cn("text-xs mb-2 opacity-80", details.textColorClass)}>{details.action}</p>
      <ScrollArea className="flex-grow h-48 pr-3 -mr-3">
        <div className="space-y-2">
          {items.length === 0 && <p className="text-xs text-center italic py-4 opacity-70">Empty</p>}
          {items.map(item => (
            <ItemCard key={item.id} item={item} type={'dueDate' in item ? 'goal' : 'task'} onUpdateQuadrant={onUpdateQuadrant} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default function EisenhowerMatrixTab() {
  const { userProfile, updateItemQuadrant } = useSessions();
  
  const { categorized, uncategorized } = useMemo(() => {
    const tasks = userProfile.notepadData.tasks || [];
    const goals = userProfile.notepadData.goals || [];
    const allItems = [...tasks, ...goals];
    
    const categorizedItems: Record<QuadrantKey, (NotepadTask | NotepadGoal)[]> = { do: [], schedule: [], delegate: [], eliminate: [] };
    const uncategorizedItems: (NotepadTask | NotepadGoal)[] = [];
    
    for (const item of allItems) {
      if (item.quadrant && quadrantDetails[item.quadrant]) {
        categorizedItems[item.quadrant].push(item);
      } else {
        uncategorizedItems.push(item);
      }
    }
    
    return { categorized: categorizedItems, uncategorized: uncategorizedItems };
  }, [userProfile.notepadData.tasks, userProfile.notepadData.goals]);

  return (
    <Card className="card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Grid className="h-7 w-7 text-primary" />
          <div>
            <CardTitle>Eisenhower Matrix</CardTitle>
            <CardDescription>Prioritize your tasks and goals by assigning them to a quadrant.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {(Object.keys(quadrantDetails) as QuadrantKey[]).map(key => (
            <Quadrant key={key} quadrantKey={key} items={categorized[key]} onUpdateQuadrant={updateItemQuadrant} />
          ))}
        </div>
        
        {uncategorized.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Uncategorized Items</CardTitle>
              <CardDescription>Assign these tasks and goals to a quadrant to prioritize them.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 pr-3 -mr-3">
                <div className="space-y-2">
                  {uncategorized.map(item => (
                    <ItemCard key={item.id} item={item} type={'dueDate' in item ? 'goal' : 'task'} onUpdateQuadrant={updateItemQuadrant} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
