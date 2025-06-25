
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid } from 'lucide-react';

interface QuadrantProps {
  title: string;
  description: string;
  action: string;
  bgColorClass?: string;
  textColorClass?: string;
}

const Quadrant = ({ title, description, action, bgColorClass = "bg-muted/30", textColorClass = "text-foreground" }: QuadrantProps) => (
  <div className={`p-4 rounded-lg shadow-sm ${bgColorClass} flex flex-col h-full card-animated`}>
    <h3 className={`text-lg font-semibold mb-1 ${textColorClass}`}>{title}</h3>
    <p className={`text-xs mb-2 ${textColorClass === "text-foreground" ? "text-muted-foreground" : textColorClass + " opacity-80"}`}>{action}</p>
    <p className={`text-sm flex-grow ${textColorClass === "text-foreground" ? "text-foreground/90" : textColorClass}`}>{description}</p>
  </div>
);

export default function EisenhowerMatrixTab() {
  // In a future update, tasks and goals could be dragged here.
  // For now, this is a static display and explanation.

  return (
    <Card className="card-animated">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Grid className="h-7 w-7 text-primary" />
          <div>
            <CardTitle>Eisenhower Matrix</CardTitle>
            <CardDescription>Prioritize your tasks by urgency and importance.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Row 1 */}
          <Quadrant 
            title="Urgent & Important" 
            action="Do First"
            description="Tasks with significant consequences for not completing them or that have immediate deadlines. These are your top priorities."
            bgColorClass="bg-destructive/10 border-destructive border"
            textColorClass="text-destructive"
          />
          <Quadrant 
            title="Not Urgent & Important" 
            action="Schedule"
            description="Tasks that are important for long-term goals but don't have an immediate deadline. Schedule time to work on these proactively."
            bgColorClass="bg-primary/10 border-primary border"
            textColorClass="text-primary"
          />
          {/* Row 2 */}
          <Quadrant 
            title="Urgent & Not Important" 
            action="Delegate"
            description="Tasks that need to be done soon but don't require your specific skills or input. Delegate them if possible, or minimize time spent."
            bgColorClass="bg-yellow-500/10 border-yellow-500 border"
            textColorClass="text-yellow-600 dark:text-yellow-400"
          />
          <Quadrant 
            title="Not Urgent & Not Important" 
            action="Eliminate"
            description="Distractions or tasks that don't contribute to your goals. Avoid or eliminate these to free up time and energy."
            bgColorClass="bg-muted/50 border-muted-foreground/30 border"
            textColorClass="text-muted-foreground"
          />
        </div>
        <div className="mt-6 text-sm text-muted-foreground p-4 border rounded-lg bg-background">
          <h4 className="font-semibold text-foreground mb-2">How to use the Eisenhower Matrix:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Review your tasks from the Checklist and your Goals.</li>
            <li>Categorize each item into one of the four quadrants based on its urgency and importance.</li>
            <li>
              <strong>Do First (Urgent/Important):</strong> Tackle these immediately. They are critical and time-sensitive.
            </li>
            <li>
              <strong>Schedule (Important/Not Urgent):</strong> Dedicate specific time blocks for these. They contribute to long-term success.
            </li>
            <li>
              <strong>Delegate (Urgent/Not Important):</strong> If possible, assign these to someone else. If not, do them quickly and efficiently without overthinking.
            </li>
            <li>
              <strong>Eliminate (Not Urgent/Not Important):</strong> These are time-wasters. Try to reduce or remove them from your workload.
            </li>
          </ul>
          <p className="mt-3 italic">Full drag-and-drop functionality for tasks and goals into this matrix will be a future enhancement!</p>
        </div>
      </CardContent>
    </Card>
  );
}
