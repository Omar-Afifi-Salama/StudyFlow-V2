
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from '@/contexts/SessionContext';
import AppLayout from '@/components/layout/AppLayout';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'StudyFlow',
  description: 'Track your study sessions and boost productivity.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#E5F1FC', // Default theme color, will be overridden by dark/sepia if active
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png"></link>
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <SessionProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Footer /> 
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
