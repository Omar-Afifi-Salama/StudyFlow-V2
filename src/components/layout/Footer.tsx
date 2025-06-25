
"use client";

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useSessions } from '@/contexts/SessionContext';
import { PlusSquare, Trash2, Skull } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatTime } from '@/lib/utils';
import Link from 'next/link';

const quotes = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { quote: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
];

export default function Footer() {
  const [currentQuote, setCurrentQuote] = useState<{ quote: string; author: string } | null>(null);
  const { addDevLevels, userProfile } = useSessions();
  
  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);
  
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!currentQuote && !isDevelopment) { 
    return null;
  }

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container max-w-screen-2xl mx-auto py-4 text-center text-muted-foreground flex flex-col items-center">
        {currentQuote && (
          <>
            <p className="italic">"{currentQuote.quote}"</p>
            <p className="text-sm mt-1">- {currentQuote.author}</p>
          </>
        )}
        <p className="text-xs mt-3">&copy; {new Date().getFullYear()} StudyFlow App. All rights reserved.</p>
        
        {userProfile.level >= 100 && (
          <Button asChild variant="link" className="mt-2 text-purple-500 animate-pulse">
            <Link href="/infamy"><Skull className="mr-2 h-4 w-4"/> You have reached Level 100. The Path of Infamy awaits... </Link>
          </Button>
        )}

        <div className="flex items-center space-x-2 mt-3">
          {isDevelopment && (
            <Button onClick={addDevLevels} variant="outline" size="sm" className="btn-animated">
              <PlusSquare className="mr-2 h-4 w-4" /> Dev: Add 50 Levels
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
