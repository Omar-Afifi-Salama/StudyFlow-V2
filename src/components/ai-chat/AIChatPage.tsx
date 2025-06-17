"use client";

import { useState, useEffect, useRef } from 'react';
import { useSessions } from '@/contexts/SessionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MessageCircle, Send, Key, Save, User, Bot } from 'lucide-react';
import type { AIChatMessage } from '@/types';
import { chatWithAI } from '@/ai/flows/chatFlow'; // Assuming flow is created
import { ScrollArea } from '@/components/ui/scroll-area';
import { marked } from 'marked'; // For rendering markdown


export default function AIChatPage() {
  const { userProfile, setGeminiApiKey } = useSessions();
  const [apiKey, setApiKey] = useState(userProfile.geminiApiKey || '');
  const [inputApiKey, setInputApiKey] = useState(userProfile.geminiApiKey || '');
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    setApiKey(userProfile.geminiApiKey || '');
    setInputApiKey(userProfile.geminiApiKey || '');
  }, [userProfile.geminiApiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSaveApiKey = () => {
    setGeminiApiKey(inputApiKey);
    setApiKey(inputApiKey);
    setError(null);
    if (inputApiKey) {
        setMessages([{ id: crypto.randomUUID(), role: 'model', content: 'API Key saved. You can start chatting!', timestamp: Date.now() }]);
    } else {
        setMessages([{ id: crypto.randomUUID(), role: 'model', content: 'API Key cleared. Enter a key to chat.', timestamp: Date.now() }]);
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    if (!apiKey) {
      setError("Please set your Gemini API Key first in the settings section below.");
      return;
    }
    setError(null);

    const newUserMessage: AIChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const modelReply = await chatWithAI({ message: userInput, apiKey });
      const newModelMessage: AIChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        content: modelReply,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, newModelMessage]);
    } catch (err: any) {
      console.error("AI Chat Error:", err);
      const errorMessage = err.message || "An error occurred while fetching the response.";
      setError(errorMessage);
      setMessages(prev => [...prev, {id: crypto.randomUUID(), role: 'model', content: `Error: ${errorMessage}`, timestamp: Date.now()}]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMarkdown = (content: string) => {
    try {
        return marked.parse(content);
    } catch (e) {
        console.error("Markdown parsing error:", e);
        return content; // fallback to raw content
    }
  }


  return (
    <Card className="shadow-lg w-full h-[calc(100vh-10rem)] flex flex-col"> {/* Adjusted height */}
      <CardHeader>
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          <div>
            <CardTitle className="text-3xl font-headline">AI Study Assistant</CardTitle>
            <CardDescription>Chat with an AI to help with your study questions or get explanations.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col space-y-4">
        {!apiKey && (
          <Alert variant="destructive">
            <Key className="h-4 w-4" />
            <AlertTitle>API Key Required</AlertTitle>
            <AlertDescription>
              Please enter your Gemini API Key in the settings section at the bottom of this page to use the AI Chat.
              Your key is stored locally in your browser.
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ScrollArea className="flex-grow pr-4 -mr-4"> {/* Offset padding for scrollbar */}
            <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[70%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <div className="flex items-center mb-1">
                    {msg.role === 'user' ? <User className="h-4 w-4 mr-2" /> : <Bot className="h-4 w-4 mr-2" />}
                    <span className="text-xs font-semibold">{msg.role === 'user' ? 'You' : 'AI Assistant'}</span>
                  </div>
                  {/* Using dangerouslySetInnerHTML for markdown. Ensure 'marked' sanitizes output if concerned about XSS from model. */}
                  <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: parseMarkdown(msg.content) }} />
                  <p className="text-xs text-muted-foreground/70 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4 space-y-4 flex-col items-stretch">
        <div className="flex space-x-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask a question or type a prompt..."
            className="flex-grow resize-none"
            rows={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading || !apiKey}
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !userInput.trim() || !apiKey} className="h-auto">
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send</span>
          </Button>
        </div>
        <div className="space-y-2 pt-2 border-t">
            <label htmlFor="apiKeyInput" className="text-sm font-medium text-muted-foreground">Gemini API Key:</label>
            <div className="flex space-x-2">
                <Input
                    id="apiKeyInput"
                    type="password"
                    value={inputApiKey}
                    onChange={(e) => setInputApiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key"
                    className="flex-grow"
                />
                <Button onClick={handleSaveApiKey} variant="outline"><Save className="mr-2 h-4 w-4"/> Save Key</Button>
            </div>
            <p className="text-xs text-muted-foreground">Your API key is stored locally in your browser and only used for interacting with the Gemini API.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
