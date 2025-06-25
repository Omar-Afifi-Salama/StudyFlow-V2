
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSessions } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, PlusSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const manualSessionSchema = z.object({
  hours: z.coerce.number().min(0).max(23).default(0),
  minutes: z.coerce.number().min(0).max(59).default(30),
  date: z.date({ required_error: "A date is required." }),
  type: z.enum(['Pomodoro Focus', 'Stopwatch', 'Countdown'], { required_error: "Session type is required." }),
  description: z.string().max(100).optional(),
}).refine(data => (data.hours * 60 + data.minutes) > 0, {
  message: "Total duration must be at least 1 minute.",
  path: ["hours"],
});

type ManualSessionFormValues = z.infer<typeof manualSessionSchema>;

export default function ManualSessionDialog() {
  const { addManualSession } = useSessions();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ManualSessionFormValues>({
    resolver: zodResolver(manualSessionSchema),
    defaultValues: {
      hours: 0,
      minutes: 30,
      date: new Date(),
      type: 'Pomodoro Focus',
      description: '',
    },
  });

  const onSubmit = (data: ManualSessionFormValues) => {
    const durationInSeconds = data.hours * 3600 + data.minutes * 60;
    const success = addManualSession({
      durationInSeconds,
      endTime: data.date.getTime(), // Use the selected date as the end time
      type: data.type,
      description: data.description || 'Manual Entry',
    });

    if (success) {
      toast({
        title: "Session Logged",
        description: `Manually added a ${data.type} session.`,
      });
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="btn-animated">
          <PlusSquare className="mr-2 h-4 w-4" /> Add Manually
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Log a Past Study Session</DialogTitle>
          <DialogDescription>
            Manually add a session you completed without the timer. A maximum of 4 hours can be logged per day.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Session</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Session Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a session type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pomodoro Focus">Pomodoro Focus</SelectItem>
                      <SelectItem value="Stopwatch">Stopwatch</SelectItem>
                      <SelectItem value="Countdown">Countdown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Chapter 3 review" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost" className="btn-animated">Cancel</Button>
                </DialogClose>
                <Button type="submit" className="btn-animated">Save Session</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
