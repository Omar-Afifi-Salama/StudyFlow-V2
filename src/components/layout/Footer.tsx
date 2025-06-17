
"use client";

import { useEffect, useState } from 'react';

const quotes = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha" },
  { quote: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { quote: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" }
];

export default function Footer() {
  const [currentQuote, setCurrentQuote] = useState<{ quote: string; author: string } | null>(null);

  useEffect(() => {
    setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!currentQuote) {
    return null; // Or a loading skeleton
  }

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container max-w-screen-2xl mx-auto py-4 text-center text-muted-foreground">
        <p className="italic">"{currentQuote.quote}"</p>
        <p className="text-sm mt-1">- {currentQuote.author}</p>
        <p className="text-xs mt-3">&copy; {new Date().getFullYear()} StudyFlow App. All rights reserved.</p>
      </div>
    </footer>
  );
}
